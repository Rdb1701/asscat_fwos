<?php

namespace App\Http\Controllers\Registrar;

use App\Http\Controllers\Controller;
use App\Models\FacultyLoad;
use Illuminate\Http\Request;
use App\Http\Requests\StoreFacultyLoadRequest;
use App\Http\Requests\UpdateFacultyLoadRequest;
use App\Models\AdministrativeLoad;
use App\Models\ResearchLoad;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FacultyLoading extends Controller
{
   /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $query_faculty = "";

        if($user->role == "Registrar")
        {
        $query_faculty = DB::table('users as u')->select('u.*', 'ud.user_code_id', 'd.department_name')
            ->leftJoin('users_deparment as ud', 'ud.user_id', 'u.id')
            ->leftJoin('courses as c', 'c.id', 'u.course_id')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->where('u.role', 'Faculty')
            ->orWhere('u.role', 'Chairperson')
            ->get();
        }

        if($user->role == "Dean")
        {
            $query_faculty = DB::table('users as u')
            ->select('u.*', 'ud.user_code_id', 'd.department_name')
            ->leftJoin('users_deparment as ud', 'ud.user_id', 'u.id')
            ->leftJoin('courses as c', 'c.id', 'u.course_id')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->where('c.department_id', $user->department_id)
            ->where(function($query) {
                $query->where('u.role', 'Faculty')
                      ->orWhere('u.role', 'Chairperson');
            })
            ->get();
        
        
        }

        return inertia("Registrar/FacultyLoad/Index", [
            'faculty' => $query_faculty,
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
            ->where('cur.academic_id', $request->academic)
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
            ->where('cur.academic_id', $request->academic)
            ->select(DB::raw('COUNT(DISTINCT cur.course_code) as total'))
            ->value('total');

        // Check if the curriculum ID already exists for the faculty
        $curriculum_id_exists = DB::table('faculty_loads as fl')
            ->leftJoin('curricula as cur', 'cur.id', '=', 'fl.curriculum_id')
            ->where('fl.user_id', $request->user_id)
            ->where('cur.academic_id', $request->academic)
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
            ->where('cur.academic_id', $request->academic)
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
                if ($part_time_hour >= $maxHoursPartTime) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Adding this subject will exceed the maximum ' . $maxHoursPartTime . ' Hours for Part Time Instructors.',
                    ]);
                }

                FacultyLoad::create($data);
                return response()->json(['success' => true, 'message' => $successMessage]);

            case "COS":
                if ($part_time_hour >= $maxHoursCOS) {
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


        return inertia("Registrar/FacultyLoad/FacultyView", [
            'faculty_id'    => $faculty_id,
            'academic_year' => $academic_years,
            'sections'      => $section,
            'faculty_info'  => $query_faculty,
            'facultyLoad'   => $faculty_load_query,
            'administrative_faculty_load' => $administrative_faculty_load,
            'employment_status' => $get_user_employment_status,
            'research_faculty_load' => $research_faculty_load,
            'success'       => session('success')
        ]);
    }


    public function change(Request $request)
    {
        $academic_id = $request->input('academic_id');
        $query = DB::table('curricula')
            ->select('*')
            ->where('academic_id', $academic_id)
            ->get();

        return response()->json($query);
    }



    //print faculty laod
    public function getPrint(Request $request)
    {

        $user = Auth::user();
        $academic_year  = $request->input('academic_year_filter');
        $faculty_id        = $request->input('user_id');


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

        $get_faculty_course_id = DB::table('users')->select('course_id')->where('id', $faculty_id)->first();

        //get course
        $get_course = DB::table('courses as c')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->leftJoin('users as u', 'u.department_id', 'd.id')
            ->select('c.*', 'd.department_description', 'd.department_name', 'u.name as dean_name')
            ->where('c.id', $get_faculty_course_id->course_id)->first();

        //get chairperson
        $get_chair = DB::table('users')->select('name')->where('course_id', $get_faculty_course_id->course_id)->where('role', 'Chairperson')->first();

        //administrative Load Units count
        $administrative_faculty_load = AdministrativeLoad::where('user_id', $faculty_id)
            ->sum('units');

        //Research Load  Units Count
        $research_faculty_load = ResearchLoad::where('user_id', $faculty_id)
            ->sum('units');

        // get admin load
        $get_admin_load = AdministrativeLoad::where('user_id', $faculty_id)->first();

        $get_research_load = ResearchLoad::where('user_id', $faculty_id)->first();


        return inertia("Registrar/FacultyLoad/Print", [
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
}
