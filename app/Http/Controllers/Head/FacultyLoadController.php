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

        FacultyLoad::create($data);

        return back()->with('success', 'Successfully Added');
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

    public function facultyView(Request $request)
    {
        $faculty_id = $request->input('faculty_id');
        $academic_years  = DB::table('academic_years')->select('*')->get();

        $query_faculty = DB::table('users as u')->select('u.*', 'ud.user_code_id')
        ->leftJoin('users_deparment as ud', 'ud.user_id', 'u.id')
        ->where('u.id', $faculty_id)
        ->first();

        $section = DB::table('sections')->select('*')->get();

        return inertia("Chairperson/FacultyLoading/FacultyView",[
            'faculty_id'    => $faculty_id,
            'academic_year' => $academic_years,
            'sections'      => $section,
            'faculty_info'  => $query_faculty
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
