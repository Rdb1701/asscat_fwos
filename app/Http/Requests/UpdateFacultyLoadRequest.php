<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFacultyLoadRequest extends FormRequest
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
            'id'                 => ['required','max:255'],
            'user_id'            => ['required','max:255'],
            'curriculum_id'      => ['required','max:255'],
            'contact_hours'      => ['required','max:255'],
            'administrative_id'  => ['max:255'],
            'research_load_id'   => ['max:255'],
            'section'            => ['required','max:255'],
            'academic_id'        => ['required','max:255'],
    
        ];
    }
}
