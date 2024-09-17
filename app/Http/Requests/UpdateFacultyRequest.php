<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFacultyRequest extends FormRequest
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
        $user = $this->route("faculty_file");

        return [
            'name'                       => ['required', 'max:255'],
            "email"                      => [
                "required",
                "email",
                Rule::unique('users')->ignore($user->id),
            ],
            'role'                       => ['required', 'string'],
            'course_id'                  => ['required', 'max:11'],
            'employment_classification'  => ['required', 'max:255'],
            'employment_status'          => ['required', 'max:255'],
            'regular_load'               => ['required', 'max:255'],
            'extra_load'                 => ['required', 'max:255'],
        ];

    }
}
