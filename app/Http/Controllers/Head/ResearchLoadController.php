<?php

namespace App\Http\Controllers\Head;

use App\Http\Controllers\Controller;
use App\Models\ResearchLoad;
use App\Http\Requests\StoreResearchLoadRequest;
use App\Http\Requests\UpdateResearchLoadRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ResearchLoadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(Request $request)
    {
        $data = $request->validate([
            "research_load"       => ['required', 'max:255'],
            'research_units'      => ['required', 'max:255'],
            'user_id'             => ['required', 'unique:research_loads,user_id', 'max:255']
        ], [
            'user_id.unique' => 'You can only add one reseach Load per Faculty.'
        ]);

        try {
            DB::table('research_loads')->insert([
                'load_desc' => $data['research_load'],
                'units'     => $data['research_units'],
                'user_id'   => $data['user_id'],
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now()
            ]);

            return back();
        } catch (\Exception $e) {

            return response()->json(['error' => 'Failed to create research load', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ResearchLoad $researchLoad)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ResearchLoad $researchLoad)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResearchLoadRequest $request, ResearchLoad $researchLoad)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ResearchLoad $research_load)
    {
        $research_load->delete();

        return to_route('faculty_load.index');
    }


    function research_load_view(Request $request)
    {
        $user_id = $request->input('user_id');
        $name = $request->input('faculty_name');
        $code = $request->input('faculty_code');

        $query = DB::table('research_loads')->select('*')->where('user_id', $user_id)->get();

        return inertia('Chairperson/FacultyLoading/ResearchLoad',[
            'admin_load' =>$query,
            'name'       => $name,
            'code'       => $code
        ]);
    }
}
