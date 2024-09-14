<?php

namespace App\Http\Controllers\Head;

use App\Http\Controllers\Controller;
use App\Models\Curriculum;
use App\Http\Requests\StoreCurriculumRequest;
use App\Http\Requests\UpdateCurriculumRequest;
use App\Http\Resources\CurriculumResource;
use Illuminate\Support\Facades\DB;

class CurriculumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
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
            ->paginate();

        return inertia("Chairperson/Curriculum/Index", [
            'curriculums' => CurriculumResource::collection($query),
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $academic = DB::table('academic_years')->select('*')->get();
        $course = DB::table('courses as c')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->select('c.*', 'd.department_name')
            ->get();

        return inertia("Chairperson/Curriculum/Add", [
            'academic' => $academic,
            'courses' => $course
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
        $academic = DB::table('academic_years')->select('*')->get();
        $course = DB::table('courses as c')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->select('c.*', 'd.department_name')
            ->get();

        return inertia("Chairperson/Curriculum/Add", [
            'academic' => $academic,
            'courses' => $course
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Curriculum $curriculum)
    {
        $academic = DB::table('academic_years')->select('*')->get();
        $course = DB::table('courses as c')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->select('c.*', 'd.department_name')
            ->get();

        return inertia("Chairperson/Curriculum/Edit", [
            "curr_edit" => new CurriculumResource($curriculum),
            'academic' => $academic,
            'courses' => $course
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
}
