<?php

namespace App\Http\Controllers\Dean;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreChairpersonRequest;
use App\Http\Requests\UpdateChairpersonRequest;
use App\Http\Resources\ChairpersonResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

class ChairpersonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = DB::table('users as us')
            ->leftJoin('courses as c', 'c.id', 'us.course_id')
            ->select(
                'us.*',
                'c.course_name'
            )
            ->where('us.role', 'Chairperson')
            ->get();

        return inertia("Dean/Chairperson/Index", [
            'chair_account' => $query,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $program = DB::table('courses')
            ->select('*')
            ->get();

        return inertia("Dean/Chairperson/Add", [
            'program' => $program,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreChairpersonRequest $request)
    {
        $data = $request->validated();
        User::create($data);

        return to_route('chairAccount.index')
            ->with('success', 'Successfully Created');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $query = DB::table('users as us')
            ->leftJoin('courses as c', 'c.id', 'us.course_id')
            ->select(
                'us.*',
                'c.course_name'
            )
            ->where('us.role', 'Chairperson')
            ->get();

        return inertia("Dean/Chairperson/Index", [
            'chair_account' => $query,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $chairAccount)
    {
        $course = DB::table('courses')
            ->select('*')
            ->get();
        return inertia("Dean/Chairperson/Edit", [
            "chair_edit" => new ChairpersonResource($chairAccount),
            "programs"   => $course,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateChairpersonRequest $request, User $chairAccount)
    {
        $data = $request->validated();
        $chairAccount->update($data);

        return to_route('chairAccount.index')
            ->with('success', "Successfully Updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $chairAccount)
    {
        $chairAccount->delete();

        return to_route('chairAccount.index');
        
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

        return to_route('chairAccount.index')
            ->with('success', "Successfully Change Password");
    }
}
