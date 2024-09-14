<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CurriculumResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                =>$this->id,
            'course_code'       => $this->course_code,
            'descriptive_title' => $this->descriptive_title,
            'units'             => $this->units,
            'lec'               => $this->lec,
            'lab'               => $this->lab,
            'cmo'               => $this->cmo,
            'hei'               => $this->hei,
            'pre_requisite'     => $this->pre_requisite,
            'academic_id'       => $this->academic_id,
            'school_year'       => $this->school_year,
            'semester'          => $this->semester,
            'course_id'         => $this->course_id,
            'course_name'       => $this->course_name,
            'department_id'     => $this->department_name,
            'year_level'        => $this->year_level,
            'created_at'        => (new Carbon($this->created_at))->format('Y-m-d'),
        ];
    }
}
