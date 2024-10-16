<?php

namespace App\Http\Controllers\Dean;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Http\Resources\CourseResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $query = DB::table('courses as c')
            ->leftJoin('departments as d', 'c.department_id', 'd.id')
            ->select('c.*', 'd.department_name')
            ->where('c.department_id', $user->department_id)
            ->get();

        return inertia('Dean/Program/Index', [
            'program' => CourseResource::collection($query),
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        $department = DB::table('departments')
            ->select('*')
            ->where('id', $user->department_id)
            ->get();

        return inertia("Dean/Program/Add", [
            'departments' => $department,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseRequest $request)
    {
        $data = $request->validated();

        Course::create($data);

        return to_route('program.index')
            ->with('success', "Successfully Created");
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        $query = DB::table('courses as c')
            ->leftJoin('departments as d', 'c.department_id', 'd.id')
            ->select('c.*', 'd.department_name')
            ->get();

        return inertia('Dean/Program/Index', [
            'program' => CourseResource::collection($query),
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $program)
    {
        $department = DB::table('departments')
            ->select('*')
            ->get();

        return inertia("Dean/Program/Edit", [
            'departments' => $department,
            'courses' => new CourseResource($program)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseRequest $request, Course $program)
    {
        $data = $request->validated();

        $program->update($data);

        return to_route('program.index')
            ->with('success', "Successfully Updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $program)
    {
        $program->delete();
        return to_route('program.index');
            
    }
}
