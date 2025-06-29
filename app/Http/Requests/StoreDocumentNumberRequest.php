<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentNumberRequest extends FormRequest
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
            "document_number" => ['required', 'max:255', 'unique:document_numbers,document_number'],
            "revision_number"  => ['required', 'max:255'],
            "effective_date"   => ['required', 'max:255'],
            "for"              => ['required', 'max:255'],
        ];
    }
}
