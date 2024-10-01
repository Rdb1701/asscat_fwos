<?php

namespace App\Http\Controllers\Head;

use App\Http\Controllers\Controller;
use App\Models\AdministrativeLoad;
use App\Http\Requests\StoreAdministrativeLoadRequest;
use App\Http\Requests\UpdateAdministrativeLoadRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminLoadController extends Controller
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
    public function store(StoreAdministrativeLoadRequest $request)
    {
        $data = $request->validated();

        AdministrativeLoad::create($data);

        return back();

        
    }

    /**
     * Display the specified resource.
     */
    public function show(AdministrativeLoad $administrativeLoad)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AdministrativeLoad $administrativeLoad)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdministrativeLoadRequest $request, AdministrativeLoad $administrativeLoad)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AdministrativeLoad $administrative_load)
    {
        $administrative_load->delete();

        return to_route('faculty_load.index');
    }

    function admin_load_view(Request $request)
    {
        $user_id = $request->input('user_id');
        $name = $request->input('faculty_name');
        $code = $request->input('faculty_code');

        $query = DB::table('administrative_loads')->select('*')->where('user_id', $user_id)->get();

        return inertia('Chairperson/FacultyLoading/AdminLoad',[
            'admin_load' =>$query,
            'name'       => $name,
            'code'   => $code
        ]);
    }
}
