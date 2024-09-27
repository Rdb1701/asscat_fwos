<?php

namespace App\Http\Controllers\Head;

use App\Http\Controllers\Controller;
use App\Models\FacultyLoad;
use App\Http\Requests\StoreFacultyLoadRequest;
use App\Http\Requests\UpdateFacultyLoadRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

        return inertia("Chairperson/FacultyLoading/Index", [
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
            ->leftJoin('users_employment as ue', 'ue.user_id', 'u.id')
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

        //check research Load Units
        // $research_load_units = DB::table('')

        if ($query_faculty->employment_status == "Full-Time") {
            // Check if faculty has reached the maximum unit load after adding the new subject
            if (($count_units_per_faculty + $new_curriculum_units) > 27) {
                return response()->json([
                    'success' => false,
                    'message' => 'Adding this subject will exceed the maximum unit load of 27 units.',
                ]);
            }

            // Check for preparations count
            if ($count_preparations >= 4 && !$curriculum_id_exists && ($count_units_per_faculty + $new_curriculum_units) <= 27) {
                return response()->json([
                    'success' => false,
                    'message' => 'Faculty has reached the maximum number of preparations (4).',
                ]);
            }


            FacultyLoad::create($data);
            return response()->json([
                'success' => true,
                'message' => 'Successfully Added Faculty Load!',
            ]);
        }

        // Additional logic can be added for other employment statuses like Part-Time, Administrative, etc.
        return response()->json([
            'success' => false,
            'message' => 'Only Full-Time faculty can be added at this moment.',
        ]);
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
            ->leftJoin('users_employment as ue', 'ue.user_id', 'u.id')
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
                's.section_name'
            )
            ->where('fl.user_id', $faculty_id)
            ->get();

        return inertia("Chairperson/FacultyLoading/FacultyView", [
            'faculty_id'    => $faculty_id,
            'academic_year' => $academic_years,
            'sections'      => $section,
            'faculty_info'  => $query_faculty,
            'facultyLoad'   => $faculty_load_query,
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
}
