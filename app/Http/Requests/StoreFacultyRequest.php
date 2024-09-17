<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreFacultyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'         => ['required', 'max:255'],
            "email"        => ["required", "string", "email", "unique:users,email"],
            "password"     => [
                "required",
                'confirmed',
                Password::min(8)->letters(),
            ], 
            'role'          => ['required', 'string'],
            'course_id'     => ['required', 'max:11'],
            'employment_classification' => ['required', 'max:255'],
            'employment_status'         => ['required', 'max:255'],
            'regular_load'              => ['required', 'max:255'],
            'extra_load'                => ['required', 'max:255'],
        ];
    }
}