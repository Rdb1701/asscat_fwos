<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\Dean\ChairpersonController;
use App\Http\Controllers\Dean\ProgramController;
use App\Http\Controllers\DeanController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\Faculty\FacultyController;
use App\Http\Controllers\Head\FacultyLoadController;
use App\Http\Controllers\Head\CourseOfferingController;
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
    Route::get('registrar/dashboard', [AcademicYearController::class, 'index'])
        ->name('registrar.dashboard');


    Route::resource('academic', AcademicYearController::class);
    Route::resource('department', DepartmentController::class);
    Route::resource('deanAccount', DeanController::class);

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

    Route::get('curriculum_search', [CurriculumController::class, 'getSearch'])->name('getSearch.curriculum');

    Route::get('curriculum_print',[CurriculumController::class, 'getPrint'])->name('getPrint.curriculum');

    Route::resource('faculty_file', FacultyController:: class);

    Route::put('faculty_file/{faculty_file}/changepassword', [FacultyController::class, 'changepassword'])
    ->name('faculty_account.changepassword');

    Route::resource('course_offering', CourseOfferingController::class);

    Route::get('course_offeringSearch', [CourseOfferingController::class, 'getSearch'])->name('getSearch.courseOffering');

    Route::get('course_offeringPrint', [CourseOfferingController::class, 'getPrint'])->name('getPrint.courseOffering');

    Route::resource('faculty_load', FacultyLoadController::class);

    Route::get('Faculty_load/view', [FacultyLoadController::class, 'facultyView'])->name('faculty_view.view');

    Route::get('Faculty_load/change', [FacultyLoadController::class, 'change'])->name('faculty_load.change');

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
