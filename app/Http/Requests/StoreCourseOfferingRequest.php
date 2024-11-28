<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseOfferingRequest extends FormRequest
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
            'section_name'       => 'required|array',
            'section_name.*'     => 'exists:sections,id',
            'course'             => 'required|integer|exists:courses,id',
            'academic_year'      => 'required|integer|exists:academic_years,id',
            'year_level'         => 'required|string',
            'effectivity_year'   => 'required|string',
        ];
    }
}
