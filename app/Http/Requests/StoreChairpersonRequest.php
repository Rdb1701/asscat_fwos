<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreChairpersonRequest extends FormRequest
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
          
        ];
    }
}
