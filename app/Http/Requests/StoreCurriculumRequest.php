<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCurriculumRequest extends FormRequest
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
            'course_code'       => [
                'required',
                'max:255',
                Rule::unique('curricula')->where(function ($query) {
                    return $query->where('course_id', $this->course_id);
                }),
            ],
            'descriptive_title' => ['required', 'max:255'],
            'lec'               => ['max:11'],
            'lab'               => ['max:11'],
            'cmo'               => ['max:11'],
            'hei'               => ['max:11'],
            'pre_requisite'     => ['max:255'],
            'course_id'         => ['required', 'max:255'],
            'year_level'        => ['required', 'max:255'],
            'efectivity_year'   => ['required','max:255'],
            'semester'          => ['required','max:255'],
            'specialization_id'          => ['required','max:255'],
        ];
    }
}
