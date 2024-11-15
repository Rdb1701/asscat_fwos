<?php

namespace App\Http\Controllers\FacultyUser;

use App\Http\Controllers\Controller;
use App\Models\FacultyLoad;
use App\Http\Requests\StoreFacultyLoadRequest;
use App\Http\Requests\UpdateFacultyLoadRequest;
use App\Models\AdministrativeLoad;
use App\Models\ResearchLoad;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FacultyLoadingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        //academic years
        $academic_years  = DB::table('academic_years')->select('*')->get();

        //faculty data
        $query_faculty = DB::table('users as u')->select('u.*', 'ud.user_code_id', 'ue.employment_status')
            ->leftJoin('users_deparment as ud', 'ud.user_id', 'u.id')
            ->leftJoin('users_employments as ue', 'ue.user_id', 'u.id')
            ->where('u.id', $user->id)
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
            ->where('fl.user_id', $user->id)
            ->get();

        //administrative Load Units count
        $administrative_faculty_load = AdministrativeLoad::where('user_id', $user->id)
            ->sum('units');

        //Research Load  Units Count
        $research_faculty_load = ResearchLoad::where('user_id', $user->id)
            ->sum('units');

        $get_user_employment_status = DB::table('users_employments')->select('employment_status')->where('user_id', $user->id)->first();


        return inertia("Faculty/Dashboard", [
            'faculty_id'    => $user->id,
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
        //
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
    public function destroy(FacultyLoad $facultyLoad)
    {
        //
    }
}
