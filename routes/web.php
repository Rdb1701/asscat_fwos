<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\Dean\ChairpersonController;
use App\Http\Controllers\Dean\ProgramController;
use App\Http\Controllers\DeanController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\Faculty\FacultyController;
use App\Http\Controllers\FacultyUser\FacultyLoadingController;
use App\Http\Controllers\Head\AdminLoadController;
use App\Http\Controllers\Head\FacultyLoadController;
use App\Http\Controllers\Head\CourseOfferingController;
use App\Http\Controllers\Head\CurriculumController;
use App\Http\Controllers\Head\ResearchLoadController;
use App\Http\Controllers\Head\SectionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Registrar\CourseOffer;
use App\Http\Controllers\Registrar\FacultyLoading;
use App\Http\Controllers\SpecializationController;
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

    Route::post('curriculum/import', [CurriculumController::class, 'import'])->name('curriculum.import');

    Route::resource('faculty_file', FacultyController::class);

    Route::post('faculty_specialization/{id}', [FacultyController::class, 'store_specialization'])->name('faculty_specialization.store');
    Route::delete('faculty_specialization/{id}/{faculty_id}/destroy', [FacultyController::class, 'destroy_specialization'])->name('faculty_specialization.destroy');

    Route::put('faculty_file/{faculty_file}/changepassword', [FacultyController::class, 'changepassword'])
    ->name('faculty_account.changepassword');

    //Course Offering
    Route::resource('course_offering', CourseOfferingController::class);

    Route::get('course_offeringSearch', [CourseOfferingController::class, 'getSearch'])->name('getSearch.courseOffering');

    Route::get('course_offeringPrint', [CourseOfferingController::class, 'getPrint'])->name('getPrint.courseOffering');

    Route::get('course_offeringChange', [CourseOfferingController::class, 'change_course'])->name('change.courseOffering');


    //Faculty Load
    Route::resource('faculty_load', FacultyLoadController::class);

    Route::get('Faculty_load/view', [FacultyLoadController::class, 'facultyView'])->name('faculty_view.view');

    Route::get('Faculty_load/change', [FacultyLoadController::class, 'change'])->name('faculty_load.change');

    Route::resource('administrative_load', AdminLoadController::class);

    Route::resource('research_load', ResearchLoadController::class);

    Route::get('faculty_load_print', [FacultyLoadController::class, 'getPrint'])->name('getPrint.facultyLoad');

    Route::get('faculty_load_all_print', [FacultyLoadController::class, 'getAllPrint'])->name('getAllPrint.facultyLoad');

    Route::get('facultyAdmin_load', [AdminLoadController::class, 'admin_load_view'])->name('faculty_load.view');

    Route::get('facultyResearch_load', [ResearchLoadController::class, 'research_load_view'])->name('research_load.view');


    Route::resource('specialization', SpecializationController::class);


    Route::post('/generate-faculty-loads', [FacultyLoadController::class, 'generateFacultyLoads'])->name('faculty_loads.generate');

});


//FACULTY MIDDLEWARE
Route::middleware('auth', 'faculty')->group(function () {
    //faculty auth dashboard inertia
    Route::get('faculty/dashboard',[FacultyLoadingController::class, 'index'])->name('faculty.dashboard');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //Course Offering
    Route::resource('course_offer', CourseOffer::class);

    Route::get('course_offerSearch', [CourseOffer::class, 'getSearch'])->name('getSearch.courseOffer');

    Route::get('course_offerPrint', [CourseOffer::class, 'getPrint'])->name('getPrint.courseOffer');


    //Faculty Load
    Route::resource('facultyload', FacultyLoading::class);

    Route::get('Facultyload/view', [FacultyLoading::class, 'facultyView'])->name('facultyView.view');

    Route::get('Facultyload/change', [FacultyLoading::class, 'change'])->name('facultyload.change');

    Route::get('facultyload_print', [FacultyLoading::class, 'getPrint'])->name('getPrint.facultyload');

    Route::get('facultyAdminload', [FacultyLoading::class, 'admin_load_view'])->name('facultyload.view');

    Route::get('facultyResearchload', [FacultyLoading::class, 'research_load_view'])->name('researchload.view');

});

require __DIR__ . '/auth.php';
