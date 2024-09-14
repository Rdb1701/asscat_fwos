<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'course_name'          => $this->course_name,
            'department_id'        => $this->department_id,
            'course_description'   => $this->course_description,
            'department_name'      =>$this->department_name,
            'created_at'           => (new Carbon($this->created_at))->format('Y-m-d'),
        ];
    }
}
