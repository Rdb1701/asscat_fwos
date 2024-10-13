<?php

namespace App\Http\Controllers;

use App\Models\Specialization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SpecializationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = DB::table('specializations')->select('*')->get();

        return inertia(
            'Chairperson/Specialization/Index',[
            'special' => $query,
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Chairperson/Specialization/Add");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required','max:255']
        ]);

        Specialization::create($data);

        return to_route('specialization.index')
        ->with('success','Successfully Added');
    }

    /**
     * Display the specified resource.
     */
    public function show(Specialization $specialization)
    {
        $query = DB::table('specializations')->select('*')->get();

        return inertia(
            'Chairperson/Specialization/Index',[
            'special' => $query,
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $query = DB::table('specializations')->select('*')->where('id', $id)->first();

        return inertia(
            'Chairperson/Specialization/Edit',[
            'special' => $query,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Specialization $specialization)
    {
        $data = $request->validate([
            'name' => ['required', 'max:255']
        ]);

        $specialization->update($data);

        return to_route('specialization.index')->with('success', 'Successfully Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Specialization $specialization)
    {
        $specialization->delete();

        return to_route('specialization.index');
    }
}
