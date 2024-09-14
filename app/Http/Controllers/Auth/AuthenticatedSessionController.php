<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
             //check if registrar user
        if($request->user()->role === "Registrar")
        {
            return redirect('registrar/dashboard');
        }
              //check if dean user
        if($request->user()->role === "Dean")
        {
            return redirect('dean/dashboard');
        }
              //check if chairperson user
        if($request->user()->role === "Chairperson")
        {
            return redirect('chairperson/dashboard');
        }
              //check if faculty user
        if($request->user()->role === "Faculty")
        {
            return redirect('faculty/dashboard');
        }

        return redirect()->intended(route('/'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
