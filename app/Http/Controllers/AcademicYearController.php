<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Http\Requests\StoreAcademicYearRequest;
use App\Http\Requests\UpdateAcademicYearRequest;
use App\Http\Resources\AcademicResource;
use App\Models\Course;

class AcademicYearController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = AcademicYear::query();
        $academic_year = $query->get();


        return inertia("Registrar/AcademicYear/Index", [
            'academic_year' => AcademicResource::collection($academic_year),
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Registrar/AcademicYear/Add");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAcademicYearRequest $request)
    {
        $data = $request->validated();
        AcademicYear::create($data);

        return to_route('academic.index')
            ->with('success', 'Successfully Added');
    }

    /**
     * Display the specified resource.
     */
    public function show(AcademicYear $academicYear)
    {
        $query = AcademicYear::query();
        $academic_year = $query->get();

        return inertia("Registrar/AcademicYear/Index", [
            'academic_year' => AcademicResource::collection($academic_year),
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AcademicYear $academic)
    {
        // Debug the model data
        return inertia("Registrar/AcademicYear/Edit", [
            'academicYear' => new AcademicResource($academic),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAcademicYearRequest $request, AcademicYear $academic)
    {
        $data = $request->validated();
        $academic->update($data);

        return to_route('academic.index')->with('success', 'Successfully Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AcademicYear $academic)
    {
        $academic->delete();
        return to_route('academic.index');
    }
}
