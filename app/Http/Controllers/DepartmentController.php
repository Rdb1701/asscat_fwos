<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Department::query();
        $department = $query->paginate();

        return inertia("Registrar/College/Index",[
            'departments'=> DepartmentResource::collection($department),
            'success'    => session("success")
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Registrar/College/Add");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDepartmentRequest $request)
    {
        $data = $request->validated();
        Department::create($data);

        return to_route('department.index')
        ->with('success','Successfully Added');

    }

    /**
     * Display the specified resource.
     */
    public function show(Department $department)
    {
        $query = Department::query();
        $department = $query->paginate();

        return inertia("Registrar/College/Index",[
            'departments'=> DepartmentResource::collection($department),
            'success'    => session("success")
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Department $department)
    {
        return inertia("Registrar/College/Edit",[
            'college' => new DepartmentResource($department),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDepartmentRequest $request, Department $department)
    {
        $data = $request->validated();
        $department->update($data);

        return to_route('department.index')->with('success', 'Successfully Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Department $department)
    {
        $department->delete();
        return to_route('department.index');
    }
}
