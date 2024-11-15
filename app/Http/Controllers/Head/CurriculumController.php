<?php

namespace App\Http\Controllers\Head;

use App\Http\Controllers\Controller;
use App\Models\Curriculum;
use App\Http\Requests\StoreCurriculumRequest;
use App\Http\Requests\UpdateCurriculumRequest;
use App\Http\Resources\CurriculumResource;
use App\Imports\CurriculumImport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class CurriculumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $query = DB::table('curricula as cur')
            ->leftJoin('courses as c', 'c.id', 'cur.course_id')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->leftJoin('specializations as s', 's.id', 'cur.specialization_id')
            ->select(
                'cur.*',
                'c.course_name',
                'd.department_name',
                's.name as specialization_name'
            )
            ->where('cur.course_id', $user->course_id)
            ->get();

        $programs = DB::table('courses')
            ->select('*')
            ->where('id', $user->course_id)
            ->get();

        $academic = DB::table('curricula')
            ->select('efectivity_year as school_year')
            ->distinct()
            ->get();

        return inertia("Chairperson/Curriculum/Index", [
            'curriculums' => CurriculumResource::collection($query),
            'success'     => session('success'),
            'cur_error'   => session('cur_error'),
            'programs'    => $programs,
            'academic'    => $academic
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user        = Auth::user();
        $academic    = DB::table('academic_years')->select('*')->get();
        $effectivity = DB::table('academic_years')->select('school_year')->distinct()->get();
        $semester    = DB::table('academic_years')->select('semester')->distinct()->get();
        $course      = DB::table('courses as c')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->select('c.*', 'd.department_name')
            ->where('c.id', $user->course_id)
            ->get();

        $specialization = DB::table('specializations')->select('*')
            ->where('course_id', $user->course_id)
            ->get();

        return inertia("Chairperson/Curriculum/Add", [
            'effectivity'    => $effectivity,
            'semester'       => $semester,
            'academic'       => $academic,
            'courses'        => $course,
            'specialization' => $specialization
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCurriculumRequest $request)
    {
        $data = $request->validated();
        Curriculum::create($data);

        return to_route("curriculum.index")
            ->with('success', 'Successfully Created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Curriculum $curriculum)
    {
        $user  = Auth::user();
        $query = DB::table('curricula as cur')
            ->leftJoin('academic_years as acad', 'acad.id', 'cur.academic_id')
            ->leftJoin('courses as c', 'c.id', 'cur.course_id')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->select(
                'cur.*',
                'c.course_name',
                'd.department_name',
                'acad.school_year',
                'acad.semester'
            )
            ->where('cur.course_id', $user->course_id)
            ->get();


        $programs = DB::table('courses')
            ->select('*')
            ->get();
        $academic = DB::table('academic_years')
            ->select('school_year')
            ->distinct()
            ->get();

        return inertia("Chairperson/Curriculum/Index", [
            'curriculums' => CurriculumResource::collection($query),
            'success'  => session('success'),
            'programs' => $programs,
            'academic' => $academic
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Curriculum $curriculum)
    {
        $user        = Auth::user();
        $academic    = DB::table('academic_years')->select('*')->get();
        $effectivity = DB::table('academic_years')->select('school_year')->distinct()->get();
        $semester    = DB::table('academic_years')->select('semester')->distinct()->get();
        $course      = DB::table('courses as c')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->select('c.*', 'd.department_name')
            ->where('c.id', $user->course_id)
            ->get();

        $specialization = DB::table('specializations')->select('*')
            ->where('course_id', $user->course_id)
            ->get();

        return inertia("Chairperson/Curriculum/Edit", [
            "curr_edit"      => new CurriculumResource($curriculum),
            'academic'       => $academic,
            'courses'        => $course,
            'effectivity'    => $effectivity,
            'semester'       => $semester,
            'specialization' => $specialization
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCurriculumRequest $request, Curriculum $curriculum)
    {
        $data = $request->validated();
        $curriculum->update($data);

        return to_route('curriculum.index')
            ->with('success', 'Successfully Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Curriculum $curriculum)
    {
        $curriculum->delete();

        return to_route("curriculum.index");
    }


    public function getSearch(Request $request)
    {

        //SEARCH QUERY
        $course           = $request->input('course');
        $school_year      = $request->input('school_year');
        $curriculum_year  = $request->input('curriculum_year');

        $get_course = DB::table('courses')->select('course_description', 'id')->where('id', $course)->first();


        $search = DB::table('curricula as circ')
            ->leftJoin('courses as c', 'c.id', 'circ.course_id')
            ->select(
                'circ.*',
                'c.course_name'
            )
            ->where('circ.course_id', $course)
            ->where('efectivity_year', $school_year)
            ->orderByRaw("
        CASE 
            WHEN circ.year_level = 'First Year' THEN 1
            WHEN circ.year_level = 'Second Year' THEN 2
            WHEN circ.year_level = 'Third Year' THEN 3
            WHEN circ.year_level = 'Fourth Year' THEN 4
        END
    ")
            ->orderBy('semester', 'asc')
            ->get();


        // Check if no data is found
        $noDataFound = $search->isEmpty();


        return inertia("Chairperson/Curriculum/Search", [
            'curriculum'  => $search,
            'program'     => $get_course,
            'school_year' => $curriculum_year,
            'curriculum_year' => $school_year,
            'noDataFound' => $noDataFound
        ]);
    }


    public function getPrint(Request $request)
    {
        //SEARCH QUERY
        $course             = $request->input('course');
        $school_year        = $request->input('school_year');
        $course_description = $request->input('course_description');
        $curriculum_year  = $request->input('curriculum_year');

        // get course and Dean
        $get_course = DB::table('courses as c')->select(
            'c.course_description',
            'c.course_name',
            'u.name as dean_name',
            'd.department_name',
            'd.department_description',
            'u.department_id'
        )
            ->leftJoin('users as u', 'u.department_id', 'c.department_id')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->where('c.id', $course)->first();

        //get chairperson Name
        $get_chairperson = DB::table('users')->select('name as chairperson_name')->where('course_id', $course)->where('role', 'Chairperson')->first();

        //get curriculum
        $search = DB::table('curricula as circ')
            ->leftJoin('courses as c', 'c.id', 'circ.course_id')
            ->select(
                'circ.*',
                'c.course_name'
            )
            ->where('circ.course_id', $course)
            ->where('efectivity_year', $school_year)
            ->orderByRaw("
        CASE 
            WHEN circ.year_level = 'First Year' THEN 1
            WHEN circ.year_level = 'Second Year' THEN 2
            WHEN circ.year_level = 'Third Year' THEN 3
            WHEN circ.year_level = 'Fourth Year' THEN 4
        END
    ")
            ->orderBy('semester', 'asc')
            ->get();


        // Check if no data is found
        $noDataFound = $search->isEmpty();


        return inertia("Chairperson/Curriculum/Print", [
            'curriculum'          => $search,
            'program'             => $get_course,
            'school_year'         => $school_year,
            'course_description'  => $course_description,
            'noDataFound'         => $noDataFound,
            'chairperson'         => $get_chairperson,
            'curriculum_year'     => $curriculum_year

        ]);
    }


    public function import(Request $request)
    {
        $request->validate([
            'excel_file' => 'required|mimes:xlsx,xls',
        ]);
    
        try {
            $import = new CurriculumImport;
            Excel::import($import, $request->file('excel_file'));
    
            $rowsImported = $import->getRowCount(); // Add this method to your CurriculumImport class
    
            Log::info('Curriculum import completed. Rows imported: ' . $rowsImported);
    
            // return response()->json([
            //     'success' => true,
            //     'message' => 'Curriculum data imported successfully. Rows imported: ' . $rowsImported,
            // ]);

            return to_route('curriculum.index')->with([
                'success' => 'Curriculum data imported successfully. Rows imported: ' . $rowsImported,
                'message' => 'Curriculum data imported successfully. Rows imported: ' . $rowsImported,
            ]);

        } catch (\Exception $e) {
            Log::error('Error importing curriculum data: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
    
            // return response()->json([
            //     'success' => false,
            //     'message' => 'Error importing curriculum data: ' . $e->getMessage(),
            // ], 500);

            return to_route('curriculum.index')->with([
                'cur_error' => 'Error importing curriculum data: ' . $e->getMessage(),
                'message' => 'Error importing curriculum data: ' . $e->getMessage(),
            ]);
        }
    }
}
