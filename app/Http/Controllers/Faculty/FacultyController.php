<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreFacultyRequest;
use App\Http\Requests\UpdateFacultyRequest;
use App\Http\Resources\FacultyResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

class FacultyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $query = DB::table('users as u')
            ->leftJoin('users_deparment as ud', 'ud.user_id', 'u.id')
            ->leftJoin('users_employments as ue', 'ue.user_id', 'u.id')
            ->leftJoin('departments as d', 'd.id', 'ud.department_id')
            ->leftJoin('courses as c', 'c.department_id', 'd.id')
            ->leftJoin('user_specializations as us','us.user_id', 'u.id' )
            ->leftJoin('specializations as sp', 'sp.id', 'us.specialization_id')
            ->select(
                'u.id',
                'u.name',
                'u.email',
                'ud.user_code_id',
                'ue.employment_status',
                DB::raw('GROUP_CONCAT(sp.name SEPARATOR ", ") as specializations') // Combine specializations
            )
            ->where('c.id', $user->course_id)
            ->groupBy('u.id', 'u.name', 'u.email', 'ud.user_code_id', 'ue.employment_status') // Add all selected non-aggregated columns
            ->get();
    
        return inertia("Chairperson/Faculty/Index", [
            'faculty'  => $query,
            'success'  => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        $query = DB::table('courses')->select('*')->where('id', $user->course_id)->get();
        return inertia('Chairperson/Faculty/Add', [
            'program' => $query
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFacultyRequest $request)
    {
        $user_auth = Auth::user();

        $data = $request->validated();
        $faculty = User::create($data);

        //query for Department
        $query_department = DB::table('users as u')
            ->leftJoin('courses as c', 'c.id', 'u.course_id')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->select('d.id as dept_id')
            ->where('c.id', $user_auth->course_id)
            ->first();

        $department_id = $query_department ? $query_department->dept_id : null;


        if ($faculty) {
            $timestamp = time();
            $lastSixDigits = substr($timestamp, -6);

            $user_code = substr_replace($lastSixDigits, '-', 4, 0);

            //insert to User Department
            DB::table('users_deparment')->insert([
                'user_code_id'  => $user_code,
                'position'      => $request->role,
                'department_id' => $department_id,
                'user_id'       => $faculty->id,
            ]);

            //insert for user employment
            DB::table('users_employments')->insert([
                'employment_classification' => $request->employment_classification,
                'employment_status'         => $request->employment_status,
                'regular_load'              => $request->regular_load,
                'extra_load'                => $request->extra_load,
                'user_id'                   => $faculty->id,
            ]);
        } else {
            return to_route('faculty_file.index')
                ->with('success', 'Cannot be Created');
        }

        return to_route('faculty_file.index')
            ->with('success', 'Successfully Created');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $users = Auth::user();
        $query = DB::table('users as u')
            ->leftJoin('users_deparment as ud', 'ud.user_id', 'u.id')
            ->leftJoin('departments as d', 'd.id', 'ud.department_id')
            ->leftJoin('courses as c', 'c.department_id', 'd.id')
            ->select('u.*', 'ud.user_code_id')
            ->where('c.id', $users->course_id)
            ->get();

        return inertia("Chairperson/Faculty/Index", [
            'faculty'  => FacultyResource::collection($query),
            'success'  => session('success')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $faculty_file)
    {
        $user = Auth::user();
        $query = DB::table('courses')->select('*')->where('id', $user->course_id)->get();

        //user department_data
        $department = DB::table('users_deparment')
            ->where('user_id', $faculty_file->id)
            ->first();
        //user employment data
        $employment = DB::table('users_employments')
            ->where('user_id', $faculty_file->id)
            ->first();
        
        $specialization = DB::table('user_specializations as us')
        ->leftJoin('specializations as s', 's.id', 'us.specialization_id')
        ->select('us.*','s.name')
        ->where('us.user_id',$faculty_file->id )
        ->get();

        $specialization_select = DB::table('specializations')
        ->select('*')
        ->get();


        return inertia('Chairperson/Faculty/Edit', [
            'program' => $query,
            'faculty_edit' => new FacultyResource($faculty_file),
            'user_department' => $department,
            'user_employment' => $employment,
            'specializations' => $specialization,
            'specialization_select' => $specialization_select
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFacultyRequest $request, User $faculty_file)
    {
        $user_auth = Auth::user();

        $data = $request->validated();
        $faculty = $faculty_file->update($data);

        //query for Department
        $query_department = DB::table('users as u')
            ->leftJoin('courses as c', 'c.id', 'u.course_id')
            ->leftJoin('departments as d', 'd.id', 'c.department_id')
            ->select('d.id as dept_id')
            ->where('c.id', $user_auth->course_id)
            ->first();

        $department_id = $query_department ? $query_department->dept_id : null;


        if ($faculty) {
            $timestamp = time();
            $lastSixDigits = substr($timestamp, -6);

            $user_code = substr_replace($lastSixDigits, '-', 4, 0);

            //insert to User Department
            DB::table('users_deparment')
                ->where('user_id', $faculty_file->id)
                ->update([
                    'position'      => $request->role,
                    'department_id' => $department_id,
                ]);

            //insert for user employment
            DB::table('users_employments')
                ->where('user_id', $faculty_file->id)
                ->update([
                    'employment_classification' => $request->employment_classification,
                    'employment_status'         => $request->employment_status,
                    'regular_load'              => $request->regular_load,
                    'extra_load'                => $request->extra_load
                ]);
        } else {
            return to_route('faculty_file.index')
                ->with('success', 'Cannot be Updated');
        }

        return to_route('faculty_file.index')
            ->with('success', 'Successfully Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $faculty_file)
    {
        $faculty_file->delete();
    }


    public function changepassword(Request $request, User $faculty_file)
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

        $faculty_file->update($data);

        return to_route('faculty_file.index')
            ->with('success', "Successfully Change Password");
    }


    public function store_specialization(Request $request, $id)
    {
       $request->validate([
            'specialization' => ['required'],
            'specialization.*' => ['exists:specializations,user_id']
        ]);

        DB::table('user_specializations')->insert([
            'user_id' => $id,
            'specialization_id' =>$request->specialization,
            'created_at' => now(), 
            'updated_at' => now(),
        ]);

        return redirect()->back();
    }

    public function destroy_specialization($id, $faculty_id)
    {
        DB::table('user_specializations')
        ->where('id', $id)
        ->where('user_id', $faculty_id)
        ->delete();

        return redirect()->back();
    }
}
