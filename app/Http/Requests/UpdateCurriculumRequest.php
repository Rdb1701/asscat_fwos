<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCurriculumRequest extends FormRequest
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
        $code = $this->route("curriculum");
        return [

            'course_code'       => [
                'required',
                Rule::unique('curricula')->ignore($code->id),
                'max:255'
            ],
            'descriptive_title' => ['required', 'max:255'],
            'units'             => ['required', 'max:11'],
            'lec'               => ['required', 'max:11'],
            'lab'               => ['required', 'max:11'],
            'cmo'               => ['required', 'max:11'],
            'hei'               => ['required', 'max:11'],
            'pre_requisite'      => ['max:255'],
            'academic_id'       => ['required', 'max:255'],
            'course_id'         => ['required', 'max:255'],
            'year_level'        => ['required', 'max:255'],
        ];
    }
}