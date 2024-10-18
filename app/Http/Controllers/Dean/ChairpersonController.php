<?php

namespace App\Http\Controllers\Dean;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreChairpersonRequest;
use App\Http\Requests\UpdateChairpersonRequest;
use App\Http\Resources\ChairpersonResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

class ChairpersonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $query = DB::table('users as us')
            ->leftJoin('courses as c', 'c.id', 'us.course_id')
            ->select(
                'us.*',
                'c.course_name',
                'c.department_id'
            )
            ->where('us.role', 'Chairperson')
            ->where('c.department_id', $user->department_id)
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
        $user = Auth::user();
        $program = DB::table('courses')
            ->select('*')
            ->where('department_id', $user->department_id)
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
        $user = Auth::user();
        $data = $request->validated();
        $chairperson =  User::create($data);


        if ($chairperson) {
            $timestamp = time();
            $lastSixDigits = substr($timestamp, -6);

            $user_code = substr_replace($lastSixDigits, '-', 4, 0);

            //insert to User Department
            DB::table('users_deparment')->insert([
                'user_code_id'  => $user_code,
                'position'      => "Faculty",
                'department_id' => $user->department_id,
                'user_id'       => $chairperson->id,
            ]);

            //insert for user employment
            DB::table('users_employments')->insert([
                'employment_classification' => "Teaching",
                'employment_status'         => "Full-Time",
                'regular_load'              => "21",
                'extra_load'                => "6",
                'user_id'                   => $chairperson->id,
            ]);
        } else {
            return to_route('faculty_file.index')
                ->with('success', 'Cannot be Created');
        }

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
        $user = Auth::user();
        $course = DB::table('courses')
            ->select('*')
            ->where('department_id', $user->department_id)
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


    public function changepassword(Request $request, User $chairperson)
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

        $chairperson->update($data);

        return to_route('chairAccount.index')
            ->with('success', "Successfully Change Password");
    }
}
