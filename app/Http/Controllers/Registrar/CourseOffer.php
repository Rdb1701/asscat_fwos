<?php

namespace App\Http\Controllers\Registrar;

use App\Http\Controllers\Controller;
use App\Models\CourseOffering;
use Illuminate\Http\Request;
use App\Http\Requests\StoreCourseOfferingRequest;
use App\Http\Requests\UpdateCourseOfferingRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CourseOffer extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {   
        $user = Auth::user();

        $query  = DB::table('academic_years')->select('*')->get();
        $query2 = "";

        if($user->role == 'Registrar')
        {
         $query2 = DB::table('courses')->select('*')->get();
        }

        if($user->role == 'Dean')
        {
         $query2 = DB::table('courses')->select('*')->where('department_id', $user->department_id)->get();
        }

        $curriculum_year  = DB::table('curricula')
        ->select('efectivity_year as school_year')
        ->distinct()
        ->get();
       
        
        $course_offering = DB::table('course_offerings as co')
            ->leftJoin('courses as c', 'c.id', 'co.course_id')
            ->leftJoin('sections as s', 's.id', 'co.section_id')
            ->select(
                'co.*',
                'c.course_name',
                's.section_name'
            )
            ->get();

        return inertia("Registrar/CourseOffering/Index", [
            'academic' => $query,
            'courses'  => $query2,
            'curriculumYear' => $curriculum_year,
            'courseOffering' => $course_offering,
            'success'   => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $academic = DB::table('academic_years')->select('*')->get();
        $course   = DB::table('courses')->select('*')->get();
        $section  = DB::table('sections')->select('*')->get();


        return inertia("Registrar/CourseOffering/Add", [
            'academic' => $academic,
            'course'   => $course,
            'section'  => $section
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseOfferingRequest $request)
    {
        $data = $request->validated();

        $sections = $data['section_name'];

        foreach ($sections as $sec) {
            $courseOffering = new CourseOffering([
                'course_id'   => $data['course'],
                'academic_id' => $data['academic_year'],
                'year_level'  => $data['year_level'],
                'section_id'  => $sec,
            ]);
            $courseOffering->save();
        }

        return to_route('course_offering.index')
            ->with('success', 'Successfully Inserted Course Offering');
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseOffering $courseOffering)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CourseOffering $courseOffering)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseOfferingRequest $request, CourseOffering $courseOffering)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseOffering $course_offer)
    {
        $course_offer->delete();

        return to_route('course_offering.index');
    }

    function getSearch(Request $request)
    {

        $user   = Auth::user();

        //SEARCH QUERY
        $course           = $request->input('course');
        $school_year      = $request->input('school_year');
        $year_level       = $request->input('year_level');
       // $curriculum_year  = $request->input('curriculum_year');

       $get_curriculum_year = DB::table('course_offerings')->select('effectivity_year')
            ->where('academic_id', $school_year)
            ->where('year_level', $year_level)
            ->where('course_id', $course)
            ->first();
        
         // Check if a result is found and extract the effectivity year
         $curriculum_year = $get_curriculum_year ? $get_curriculum_year->effectivity_year : null;

        //get school year
        $get_school_year = DB::table('academic_years')->select('school_year', 'semester')->where('id', $school_year)->first();

        //get semester
        $get_semester = DB::table('academic_years')->select('semester', 'id')->where('id', $school_year)->first();

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



        // Get course offering and faculty name
        $course_offering = DB::table('course_offerings as co')
            ->leftJoin('academic_years as ay', 'ay.id', 'co.academic_id')
            ->leftJoin('courses as c', 'c.id', 'co.course_id')
            ->leftJoin('sections as s', 's.id', 'co.section_id')
            ->leftJoin('curricula as cur', 'cur.course_id', 'c.id')
            ->leftJoin('faculty_loads as fl', function ($join) {
                $join->on('fl.curriculum_id', '=', 'cur.id')
                    ->on('fl.section', '=', 's.id');
            })
            ->leftJoin('users as fac', 'fac.id', 'fl.user_id')
            ->select(
                'cur.*',
                'c.course_name',
                'cur.year_level',
                's.section_name',
                'ay.school_year',
                'ay.semester',
                'fac.name as faculty_name'
            )
            ->distinct()
            ->where('co.course_id', $course)
            ->where('cur.efectivity_year', $curriculum_year)
            ->where('cur.semester', $get_semester->semester)
            ->where('cur.year_level', $year_level)
            ->where('co.year_level', $year_level)
            ->where('co.academic_id', $school_year)
            ->orderBy('s.section_name', 'asc')
            ->orderBy('cur.course_code')
            ->get();

        // Check if no data is found
        $noDataFound = $course_offering->isEmpty();

        return inertia("Registrar/CourseOffering/Search",[
            'noDataFound'     => $noDataFound,
            'courseOfferings' => $course_offering,
            'school_year'     => $get_school_year,
            'program'         => $get_course,
            'course_id'       => $course,
            'academic_id'     => $school_year,
            'year_level'      => $year_level,
            'curriculum_year' => $curriculum_year

        ]);
    }

    public function getPrint(Request $request){
        //SEARCH QUERY
        $course           = $request->input('course_id');
        $school_year      = $request->input('academic_id');
        $year_level       = $request->input('year_level');
        $curriculum_year  = $request->input('curriculum_year');

        //get school year
        $get_school_year = DB::table('academic_years')
            ->select('school_year', 'semester')
            ->where('id', $school_year)
            ->first();

        //get semester
        $get_semester = DB::table('academic_years')->select('semester', 'id')->where('id', $school_year)->first();

        // get course and Dean
        $get_course = DB::table('courses as c')
            ->select(
                'c.course_description',
                'c.course_name',
                'u.name as dean_name',
                'd.department_name',
                'd.department_description',
                'u.department_id'
            )
            ->leftJoin('users as u', 'u.department_id', 'c.department_id')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->where('c.id', $course)
            ->first();

        // Get course offering and faculty name
        $course_offering = DB::table('course_offerings as co')
            ->leftJoin('academic_years as ay', 'ay.id', 'co.academic_id')
            ->leftJoin('courses as c', 'c.id', 'co.course_id')
            ->leftJoin('sections as s', 's.id', 'co.section_id')
            ->leftJoin('curricula as cur', 'cur.course_id', 'c.id')
            ->leftJoin('faculty_loads as fl', function ($join) {
                $join->on('fl.curriculum_id', '=', 'cur.id')
                    ->on('fl.section', '=', 's.id');
            })
            ->leftJoin('users as fac', 'fac.id', 'fl.user_id')
            ->select(
                'cur.*',
                'c.course_name',
                'cur.year_level',
                's.section_name',
                'ay.school_year',
                'ay.semester',
                'fac.name as faculty_name'
            )
            ->distinct()
            ->where('co.course_id', $course)
            ->where('cur.efectivity_year', $curriculum_year)
            ->where('cur.semester', $get_semester->semester)
            ->where('cur.year_level', $year_level)
            ->where('co.year_level', $year_level)
            ->where('co.academic_id', $school_year)
            ->orderBy('s.section_name', 'asc')
            ->orderBy('cur.course_code')
            ->get();

        // Check if no data is found
        $noDataFound = $course_offering->isEmpty();
        return inertia("Registrar/CourseOffering/Print",[
            'noDataFound'     => $noDataFound,
            'courseOfferings' =>$course_offering,
            'school_year'     => $get_school_year,
            'program'         => $get_course,

        ]);
    }
}
