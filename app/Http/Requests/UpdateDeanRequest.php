<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateDeanRequest extends FormRequest
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
        $user = $this->route("deanAccount");
        return [
            "name" => ["required", "string", "max:255"],
            "email" => [
                "required",
                "email",
                Rule::unique('users')->ignore($user->id),
            ],
            'role'              => ['required', 'string'],
            'department_id'     => ['required', 'max:11'],
        ];
    }
}
