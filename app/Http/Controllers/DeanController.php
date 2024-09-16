<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreDeanRequest;
use App\Http\Requests\UpdateDeanRequest;
use App\Http\Resources\DeanResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;

class DeanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = DB::table('users as us')
            ->leftJoin('departments as d', 'd.id', '=', 'us.department_id')
            ->select(
                'us.*',
                'd.department_name'
            )
            ->where('us.role', 'Dean')
            ->get();

        return inertia("Registrar/Dean/Index", [
            'dean_account' => $query,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = DB::table('departments')
            ->select('*')
            ->get();

        return inertia("Registrar/Dean/Add", [
            'college' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDeanRequest $request)
    {
        $data = $request->validated();
        User::create($data);

        return to_route('deanAccount.index')
            ->with('success', 'Successfully Created');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $query = DB::table('users as us')
            ->leftJoin('departments as d', 'd.id', '=', 'us.department_id')
            ->select(
                'us.*',
                'd.department_name'
            )
            ->where('us.role', 'Dean')
            ->get();

        return inertia("Registrar/Dean/Index", [
            'dean_account' => $query,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $deanAccount)
    {
        $departments = DB::table('departments')
            ->select('*')
            ->get();
        return inertia("Registrar/Dean/Edit", [
            "dean_edit" => new DeanResource($deanAccount),
            "college"   => $departments,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDeanRequest $request, User $deanAccount)
    {
        $data = $request->validated();
        $deanAccount->update($data);

        return to_route('deanAccount.index')
            ->with('success', "Successfully Updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $deanAccount)
    {
        $deanAccount->delete();
        to_route('deanAccount.index');
        
    }


    public function changepassword(Request $request, User $dean)
    {
        $data = $request->validate([
            "password"     => [
                "required",
                'confirmed',
                Password::min(8),
            ],
        ]);

        $password = $data['password'] ?? null;
        if ($password) {
            $data['password'] = bcrypt($password);
        } else {
            unset($data['password']);
        }

        $dean->update($data);

        return to_route('deanAccount.index')
            ->with('success', "Successfully Change Password");
    }
}
