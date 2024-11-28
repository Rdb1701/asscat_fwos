<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseOfferingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'year_level'       => $this->year_level,
            'academic_id'      => $this->academic_id,
            'course_id'        => $this->course_id,
            'section_id'       => $this->section_id,
            'effectivity_year' => $this->effectivity_year
        ];
    }
}
