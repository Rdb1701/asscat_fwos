<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\Dean\ChairpersonController;
use App\Http\Controllers\Dean\ProgramController;
use App\Http\Controllers\DeanController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\Head\CurriculumController;
use App\Http\Controllers\Head\SectionController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//Redirect to Login if not Authenticated
Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();

        // Redirect based on user role
        if ($user->role === "Registrar") {
            return redirect()->route('registrar.dashboard');
        } elseif ($user->role === "Dean") {
            return redirect()->route('dean.dashboard');
        } elseif ($user->role === "Chairperson") {
            return redirect()->route('chairperson.dashboard');
        } elseif ($user->role === "Faculty") {
            return redirect()->route('faculty.dashboard');
        }

        return redirect()->route('/');
    }

    return Inertia::render('Auth/Login');
});

//REGISTRAR MIDDLEWARE
Route::middleware('auth', 'registrar')->group(function () {
    //registrar auth dashboard inertia
    Route::get('registrar/dashboard',[AcademicYearController::class, 'index'])
    ->name('registrar.dashboard');
    

    Route::resource('academic', AcademicYearController::class);
    Route::resource('department', DepartmentController::class );
    Route::resource('deanAccount', DeanController::class );

    Route::put('dean/{dean}/changepassword', [DeanController::class, 'changepassword'])
        ->name('dean_account.changepassword');
});


//DEAN MIDDLEWARE
Route::middleware('auth', 'dean')->group(function () {
    //dean auth dashboard inertia

    Route::get('dean/dashboard', [ProgramController::class, 'index'])
    ->name('dean.dashboard');

    Route::resource('program', ProgramController::class);

    Route::resource('chairAccount', ChairpersonController::class);


    Route::put('chairperson/{chairperson}/changepassword', [ChairpersonController::class, 'changepassword'])
    ->name('chair_account.changepassword');

});


//CHAIRPERSON MIDDLEWARE
Route::middleware('auth', 'chairperson')->group(function () {
    //chairperson auth dashboard inertia
    Route::get('chairperson/dashboard', [SectionController::class, 'index'])
    ->name('chairperson.dashboard');

    Route::resource('section', SectionController::class);

    Route::resource('curriculum', CurriculumController::class);
});


//FACULTY MIDDLEWARE
Route::middleware('auth', 'faculty')->group(function () {
    //faculty auth dashboard inertia
    Route::get('faculty/dashboard', function () {
        return Inertia::render('Faculty/Dashboard');
    })->name('faculty.dashboard');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
