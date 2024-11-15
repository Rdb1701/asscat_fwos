<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFacultyLoadRequest extends FormRequest
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
        $faculty_load = $this->route("faculty_load");
        return [
            'user_id'            => ['required','max:255'],
            'curriculum_id'      => [
            'required',
            'max:255',
            // Unique check for combination of curriculum_id and section
            Rule::unique('faculty_loads')->where(function ($query) {
                return $query->where('curriculum_id', $this->curriculum_id)
                             ->where('section', $this->section)
                             ->where('academic_id', $this->academic_id);
            })
        ],
            'contact_hours'      => ['required','max:255'],
            'administrative_id'  => ['max:255'],
            'research_load_id'   => ['max:255'],
            'section'            => ['required','max:255'],
            'academic_id'        => ['required','max:255'],
    
        ];
    }
}
