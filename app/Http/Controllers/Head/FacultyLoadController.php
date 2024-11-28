<?php

namespace App\Http\Controllers\Head;

use App\Http\Controllers\Controller;
use App\Models\FacultyLoad;
use App\Http\Requests\StoreFacultyLoadRequest;
use App\Http\Requests\UpdateFacultyLoadRequest;
use App\Models\AcademicYear;
use App\Models\AdministrativeLoad;
use App\Models\Course;
use App\Models\CourseOffering;
use App\Models\Curriculum;
use App\Models\ResearchLoad;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Psy\Command\WhereamiCommand;

class FacultyLoadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $query_faculty = DB::table('users as u')->select('u.*', 'ud.user_code_id')
            ->leftJoin('users_deparment as ud', 'ud.user_id', 'u.id')
            ->where('u.course_id', $user->course_id)
            ->get();

        $academic = DB::table('academic_years')
            ->select("*")
            ->distinct()
            ->get();

        $curriculum_year = DB::table('curricula')
            ->select('efectivity_year as school_year')
            ->distinct()
            ->get();

        return inertia("Chairperson/FacultyLoading/Index", [
            'faculty' => $query_faculty,
            'academic' => $academic,
            'curriculum_year' => $curriculum_year,
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFacultyLoadRequest $request)
    {
        $data = $request->validated();

        $get_semester = DB::table('academic_years')->select('semester', 'id')->where('id', $request->academic_id)->first();
        $get_school_year = DB::table('academic_years')->select('school_year', 'id')->where('id', $request->academic_id)->first();


        // Fetch faculty data
        $query_faculty = DB::table('users as u')->select('u.*', 'ud.user_code_id', 'ue.employment_status')
            ->leftJoin('users_deparment as ud', 'ud.user_id', 'u.id')
            ->leftJoin('users_employments as ue', 'ue.user_id', 'u.id')
            ->where('u.id', $request->user_id)
            ->first();

        // Units count per faculty (calculate total units considering lecture and laboratory)
        $count_units_per_faculty = DB::table('faculty_loads as fl')
            ->leftJoin('curricula as cur', 'cur.id', '=', 'fl.curriculum_id')
            ->where('fl.user_id', $request->user_id)
            ->where('fl.academic_id', $request->academic_id)
            ->select(DB::raw('SUM(cur.lec) + SUM(cur.lab * 0.75) as total_units')) // Calculate total units
            ->value('total_units');

        // Get the units of the new curriculum to be added
        $new_curriculum_units = DB::table('curricula')
            ->where('id', $request->curriculum_id)
            ->select(DB::raw('lec + (lab * 0.75) as units'))
            ->value('units');

        // Preparations count for regular Employee
        $count_preparations = DB::table('faculty_loads as fl')
            ->leftJoin('curricula as cur', 'cur.id', '=', 'fl.curriculum_id')
            ->where('fl.user_id', $request->user_id)
            ->where('fl.academic_id', $request->academic_id)
            ->select(DB::raw('COUNT(DISTINCT cur.course_code) as total'))
            ->value('total');

        // Check if the curriculum ID already exists for the faculty
        $curriculum_id_exists = DB::table('faculty_loads as fl')
            ->leftJoin('curricula as cur', 'cur.id', '=', 'fl.curriculum_id')
            ->where('fl.user_id', $request->user_id)
            ->where('fl.academic_id', $request->academic_id)
            ->where('fl.curriculum_id', $request->curriculum_id)
            ->exists();


        //administrative Load Units count
        $administrative_load = AdministrativeLoad::where('user_id', $request->user_id)
            ->sum('units');

        //Research Load  Units Count
        $research_load = ResearchLoad::where('user_id', $request->user_id)
            ->sum('units');

        // IF PART TIME
        $part_time_hour = DB::table('faculty_loads as fl')
            ->leftJoin('curricula as cur', 'cur.id', 'fl.curriculum_id')
            ->where('fl.academic_id', $request->academic_id)
            ->where('fl.user_id', $request->user_id)
            ->sum('fl.contact_hours');



        $total_admin_research_load = $administrative_load + $research_load;



        //IF FULLTIME
        $status = $query_faculty->employment_status;
        $maxUnitsFullTime = 27;
        $maxHoursPartTime = 15;
        $maxHoursCOS = 30;
        $successMessage = 'Successfully Added Faculty Load!';
        $exceedUnitsMessage = 'Adding this subject will exceed the maximum unit load of ';

        switch ($status) {
            case "Full-Time":
                $totalUnits = $count_units_per_faculty + $new_curriculum_units + $total_admin_research_load;

                if ($totalUnits >= $maxUnitsFullTime) {
                    return response()->json([
                        'success' => false,
                        'message' => $exceedUnitsMessage . $maxUnitsFullTime . ' units.',
                    ]);
                }

                if ($count_preparations >= 4 && !$curriculum_id_exists && $totalUnits <= $maxUnitsFullTime) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Faculty has reached the maximum number of preparations (4).',
                    ]);
                }

                FacultyLoad::create($data);
                return response()->json(['success' => true, 'message' => $successMessage]);

            case "Part-Time":
                if ($part_time_hour + $request->conctact_hours >= $maxHoursPartTime) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Adding this subject will exceed the maximum ' . $maxHoursPartTime . ' Hours for Part Time Instructors.',
                    ]);
                }

                FacultyLoad::create($data);
                return response()->json(['success' => true, 'message' => $successMessage]);

            case "COS":
                if ($part_time_hour + $request->conctact_hours + $total_admin_research_load >= $maxHoursCOS) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Adding this subject will exceed the maximum ' . $maxHoursCOS . ' Hours for COS Instructors.',
                    ]);
                }

                FacultyLoad::create($data);
                return response()->json(['success' => true, 'message' => $successMessage]);

            default:
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot be added at this moment.',
                ]);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(FacultyLoad $facultyLoad)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FacultyLoad $facultyLoad)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFacultyLoadRequest $request, FacultyLoad $facultyLoad)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FacultyLoad $faculty_load)
    {
        $faculty_load->delete();

        return back();
    }

    public function facultyView(Request $request)
    {
        $faculty_id = $request->input('faculty_id');
        //academic years
        $academic_years  = DB::table('academic_years')->select('*')->get();

        //faculty data
        $query_faculty = DB::table('users as u')->select('u.*', 'ud.user_code_id', 'ue.employment_status')
            ->leftJoin('users_deparment as ud', 'ud.user_id', 'u.id')
            ->leftJoin('users_employments as ue', 'ue.user_id', 'u.id')
            ->where('u.id', $faculty_id)
            ->first();


        //get all section
        $section = DB::table('sections')->select('*')->get();

        //faculty_load view
        $faculty_load_query = DB::table('faculty_loads as fl')
            ->leftJoin('curricula as cur', 'cur.id', 'fl.curriculum_id')
            ->leftJoin('administrative_loads as admin', 'admin.user_id', 'fl.user_id')
            ->leftJoin('research_loads as rl', 'rl.user_id', 'fl.user_id')
            ->leftJoin('sections as s', 's.id', 'fl.section')
            ->leftJoin('academic_years as acad', 'acad.id', 'fl.academic_id')
            ->select(
                'fl.*',
                'cur.course_code',
                'cur.descriptive_title',
                'cur.units',
                'cur.lec',
                'cur.lab',
                'cur.cmo',
                'cur.hei',
                'cur.pre_requisite',
                'admin.load_desc as admin_load',
                'admin.units as admin_units',
                'rl.load_desc as research_load',
                'rl.units as research_units',
                's.section_name',
                'acad.school_year',
                'acad.semester'
            )
            ->where('fl.user_id', $faculty_id)
            ->get();

        //administrative Load Units count
        $administrative_faculty_load = AdministrativeLoad::where('user_id', $faculty_id)
            ->sum('units');

        //Research Load  Units Count
        $research_faculty_load = ResearchLoad::where('user_id', $faculty_id)
            ->sum('units');

        $get_user_employment_status = DB::table('users_employments')->select('employment_status')->where('user_id', $faculty_id)->first();


        return inertia("Chairperson/FacultyLoading/FacultyView", [
            'faculty_id'                  => $faculty_id,
            'academic_year'               => $academic_years,
            'sections'                    => $section,
            'faculty_info'                => $query_faculty,
            'facultyLoad'                 => $faculty_load_query,
            'administrative_faculty_load' => $administrative_faculty_load,
            'employment_status'           => $get_user_employment_status,
            'research_faculty_load'       => $research_faculty_load,
            'success'                     => session('success')
        ]);
    }


    public function change(Request $request)
    {
        $academic_id = $request->input('academic_id');
        $get_semester = DB::table('academic_years')->select('semester', 'id')->where('id', $academic_id)->first();
        $school_year  = DB::table('academic_years')->select('school_year', 'id')->where('id', $academic_id)->first();


        $query = DB::table('curricula')
            ->select('*')
            ->where('semester', $get_semester->semester)
            ->where('efectivity_year', $school_year->school_year)
            ->get();

        return response()->json($query);
    }



    //print faculty laod
    public function getPrint(Request $request)
    {

        $user = Auth::user();
        $academic_year  = $request->input('academic_year_filter');
        $faculty_id     = $request->input('user_id');

        //faculty data
        $query_faculty = DB::table('users as u')->select('u.*', 'ud.user_code_id', 'ue.employment_status')
            ->leftJoin('users_deparment as ud', 'ud.user_id', 'u.id')
            ->leftJoin('users_employments as ue', 'ue.user_id', 'u.id')
            ->where('u.id', $faculty_id)
            ->first();

        //faculty_load view
        $faculty_load_query = DB::table('faculty_loads as fl')
            ->leftJoin('curricula as cur', 'cur.id', 'fl.curriculum_id')
            ->leftJoin('administrative_loads as admin', 'admin.user_id', 'fl.user_id')
            ->leftJoin('research_loads as rl', 'rl.user_id', 'fl.user_id')
            ->leftJoin('sections as s', 's.id', 'fl.section')
            ->leftJoin('academic_years as acad', 'acad.id', 'fl.academic_id')
            ->select(
                'fl.*',
                'cur.course_code',
                'cur.descriptive_title',
                'cur.units',
                'cur.lec',
                'cur.lab',
                'cur.cmo',
                'cur.hei',
                'cur.pre_requisite',
                'admin.load_desc as admin_load',
                'admin.units as admin_units',
                'rl.load_desc as research_load',
                'rl.units as research_units',
                's.section_name',
                'acad.school_year',
                'acad.semester'
            )
            ->where('fl.user_id', $faculty_id)
            ->where('fl.academic_id', $academic_year)
            ->get();

        //get academic year
        $get_academic_year = DB::table('academic_years')->select('*')->where('id', $academic_year)->first();

        //get course
        $get_course = DB::table('courses as c')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->leftJoin('users as u', 'u.department_id', 'd.id')
            ->select('c.*', 'd.department_description', 'd.department_name', 'u.name as dean_name')
            ->where('c.id', $user->course_id)->first();

        //get chairperson
        $get_chair = DB::table('users')->select('name')->where('course_id', $user->course_id)->where('role', 'Chairperson')->first();

        //administrative Load Units count
        $administrative_faculty_load = AdministrativeLoad::where('user_id', $faculty_id)
            ->sum('units');

        //Research Load  Units Count
        $research_faculty_load = ResearchLoad::where('user_id', $faculty_id)
            ->sum('units');

        // get admin load
        $get_admin_load = AdministrativeLoad::where('user_id', $faculty_id)->first();

        $get_research_load = ResearchLoad::where('user_id', $faculty_id)->first();


        return inertia("Chairperson/FacultyLoading/Print", [
            'faculty_id'    => $faculty_id,
            'faculty_info'  => $query_faculty,
            'facultyLoad'   => $faculty_load_query,
            'academic_year' => $get_academic_year,
            'department'    => $get_course,
            'chair'         => $get_chair,
            'admin_load'    => $get_admin_load,
            'research_load' => $get_research_load,
            'administrative_faculty_load' => $administrative_faculty_load,
            'research_faculty_load' => $research_faculty_load,
            'success'       => session('success')
        ]);
    }


    //PRINT ALL FACULTY LOADS
    public function getAllPrint(Request $request)
    {
        $user = Auth::user();
        $academic_year_id = $request->input('academic_year_filter');
    
        // Get all faculty users
        $faculty_users = User::where(function ($query) {
            $query->where('role', 'Faculty')
                  ->orWhere('role', 'Chairperson');
        })
        ->where('course_id', $user->course_id)
        ->with([
            'department',
            'employment',
            'administrativeLoads',
            'researchLoads',
            'facultyLoads' => function ($query) use ($academic_year_id) {
                $query->where('academic_id', $academic_year_id)
                      ->with(['curriculum', 'sections', 'academicYear']);
            }
        ])
        ->get();
    
        // Get academic year
        $academic_year = AcademicYear::findOrFail($academic_year_id);
    
        // Get course and department info
        $course = Course::with(['department', 'department.users' => function ($query) {
            $query->where('role', 'Dean');
        }])->findOrFail($user->course_id);
    
        // Get chairperson
        $chairperson = User::where('course_id', $user->course_id)
                           ->where('role', 'Chairperson')
                           ->first();
    
        return Inertia::render("Chairperson/FacultyLoading/Print3", [
            'faculty_users' => $faculty_users,
            'academic_year' => $academic_year,
            'department'    => $course->department,
            'course'        => $course,
            'dean'          => $course->department->users->first(),
            'chair'         => $chairperson,
            'success'       => session('success')
        ]);
    }
    
    


    public function generateFacultyLoads(Request $request)
    {
        $data = $request->validate([
            'academic_id'     => ['required', 'exists:academic_years,id'],
            'curriculum_year' => ['required', 'max:255']
        ]);

        $academicYear = $data['academic_id'];
        $curriculumYear = $data['curriculum_year'];

        $faculties = User::with(['specializations', 'employment'])
            ->whereHas('employment', function ($query) {
                $query->whereIn('employment_status', ['Full-Time', 'Part-Time', 'COS']);
            })
            ->get();



        $generatedLoads = [];

        foreach ($faculties as $faculty) {
            $generatedLoad = $this->generateLoadForFaculty($faculty, $academicYear, $curriculumYear);
            $generatedLoads[$faculty->id] = $generatedLoad;
        }

        // return response()->json([
        //     'success' => true,
        //     'message' => 'Faculty loads generated successfully',
        //     'data' => $generatedLoads
        // ]);

        return to_route('faculty_load.index')
            ->with('success', 'Successfully Generated Faculty Loads');
    }

    private function generateLoadForFaculty($faculty, $academicYear, $curriculumYear)
    {
        $facultySpecializations = $faculty->specializations->pluck('id')->toArray();
        $employmentStatus       = $faculty->employment->employment_status;

        $get_semester    = DB::table('academic_years')->select('semester', 'id')->where('id', $academicYear)->first();

        $availableCurricula = Curriculum::whereIn('specialization_id', $facultySpecializations)
            ->where('efectivity_year', $curriculumYear)
            ->where('semester', $get_semester->semester)
            ->get();

        $currentLoad = $this->getCurrentFacultyLoad($faculty->id, $academicYear);
        $allocatedLoad = $this->allocateLoad($faculty, $availableCurricula, $currentLoad);


        $this->saveFacultyLoad($faculty, $allocatedLoad, $academicYear, $currentLoad, $curriculumYear);

        return $allocatedLoad;
    }

    private function getCurrentFacultyLoad($facultyId, $academicYear)
    {
        $teachingLoad = FacultyLoad::where('user_id', $facultyId)
            ->whereHas('curriculum', function ($query) use ($academicYear) {
                $query->where('academic_id', $academicYear);
            })
            ->with('curriculum')
            ->get();

        $administrativeLoad  = AdministrativeLoad::where('user_id', $facultyId)->sum('units');
        $researchLoad        = ResearchLoad::where('user_id', $facultyId)->sum('units');

        return [
            'teaching'       => $teachingLoad,
            'administrative' => $administrativeLoad,
            'research'       => $researchLoad,
        ];
    }

    private function allocateLoad($faculty, $availableCurricula, $currentLoad)
    {
        $maxUnits        = $this->getMaxUnits($faculty->employment->employment_status);
        $maxPreparations = 4;
        $allocatedLoad   = [];
        $totalUnits      = $currentLoad['administrative'] + $currentLoad['research'];
        $preparations    = $currentLoad['teaching']->pluck('curriculum.course_code')->unique()->count();

        foreach ($availableCurricula as $curriculum) {
            $units = $curriculum->lec + ($curriculum->lab * 0.75);

            if ($totalUnits + $units <= $maxUnits && $preparations < $maxPreparations) {
                $allocatedLoad[] = $curriculum;
                $totalUnits += $units;
                if (!$currentLoad['teaching']->contains('curriculum_id', $curriculum->id)) {
                    $preparations++;
                }
            }

            if ($totalUnits >= $maxUnits || $preparations >= $maxPreparations) {
                break;
            }
        }

        // Ensure minimum units for Full-Time faculty
        if ($faculty->employment->employment_status === 'Full-Time' && $totalUnits < 21) {
            foreach ($availableCurricula as $curriculum) {
                if (!in_array($curriculum, $allocatedLoad)) {
                    $units = $curriculum->lec + ($curriculum->lab * 0.75);
                    if ($totalUnits + $units <= $maxUnits) {
                        $allocatedLoad[] = $curriculum;
                        $totalUnits += $units;
                        if ($totalUnits >= 21) {
                            break;
                        }
                    }
                }
            }
        }

        return $allocatedLoad;
    }

    private function getMaxUnits($employmentStatus)
    {
        switch ($employmentStatus) {
            case 'Full-Time':
                return 27;
            case 'Part-Time':
                return 15;
            case 'COS':
                return 30;
            default:
                return 0;
        }
    }

    private function saveFacultyLoad($faculty, $generatedLoad, $academicYear, $currentLoad, $curriculumYear)
    {
        //get semester
        $get_semester = DB::table('academic_years')->select('semester', 'id')->where('id', $academicYear)->first();

        // Delete existing loads for this faculty and academic year
        FacultyLoad::where('user_id', $faculty->id)
            ->where('academic_id', $academicYear)
            ->whereHas('curriculum', function ($query) use ($curriculumYear, $get_semester) {
                $query->where('efectivity_year', $curriculumYear)
                    ->where('semester', $get_semester->semester);
            })
            ->delete();


        $maxUnits = $this->getMaxUnits($faculty->employment->employment_status);
        $totalUnits = $currentLoad['administrative'] + $currentLoad['research'];
        $preparations = [];

        // Save new loads
        foreach ($generatedLoad as $curriculum) {
            $availableSections = $this->getAvailableSections($curriculum, $academicYear);

            if ($availableSections->isNotEmpty()) {
                foreach ($availableSections as $section) {
                    $units = $curriculum->lec + ($curriculum->lab * 0.75);

                    // Check if adding this load would exceed the maximum units
                    if ($totalUnits + $units > $maxUnits) {
                        Log::warning("Maximum units exceeded for faculty {$faculty->id}. Skipping curriculum {$curriculum->id}");
                        break 2; // Break out of both loops
                    }

                    // Check if adding this load would exceed the maximum preparations
                    if (!in_array($curriculum->course_code, $preparations) && count($preparations) >= 4) {
                        Log::warning("Maximum preparations exceeded for faculty {$faculty->id}. Skipping curriculum {$curriculum->id}");
                        break; // Move to the next curriculum
                    }

                    // Check if the section already has an instructor assigned
                    $existingLoad = FacultyLoad::where('curriculum_id', $curriculum->id)
                        ->where('section', $section->id)
                        ->where('academic_id', $academicYear)
                        ->first();

                    if ($existingLoad) {
                        Log::info("Section {$section->id} for curriculum {$curriculum->id} already has an instructor assigned. Skipping.");
                        continue; // Try the next section
                    }

                    FacultyLoad::create([
                        'user_id'           => $faculty->id,
                        'curriculum_id'     => $curriculum->id,
                        'contact_hours'     => $curriculum->lec + $curriculum->lab,
                        'administrative_id' => null,
                        'research_load_id'  => null,
                        'section'           => $section->id,
                        'academic_id'       => $academicYear
                    ]);

                    $totalUnits += $units;
                    if (!in_array($curriculum->course_code, $preparations)) {
                        $preparations[] = $curriculum->course_code;
                    }
                }
            } else {
                Log::warning("No available sections for curriculum {$curriculum->id} in academic year {$academicYear}");
            }
        }

        // Check if minimum units are met for Full-Time faculty
        if ($faculty->employment->employment_status === 'Full-Time' && $totalUnits < 21) {
            Log::warning("Minimum units not met for full-time faculty {$faculty->id}. Total units: {$totalUnits}");
        }

        Log::info("Total units allocated for faculty {$faculty->id}: {$totalUnits}");
    }

    private function getAvailableSections($curriculum, $academicYear)
    {
        return CourseOffering::where('academic_id', $academicYear)
            ->where('course_id', $curriculum->course_id)
            ->where('year_level', $curriculum->year_level)
            ->with('section')
            ->get()
            ->pluck('section');
    }
}
