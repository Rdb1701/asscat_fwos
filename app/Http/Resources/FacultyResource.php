<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacultyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'email'          => $this->email,
            'role'           => $this->role,
            'course_id'      => $this->course_id,
            'user_code_id'   => $this->user_code_id,
            'employment_status' =>$this->employment_status,
            'specialization_name' =>$this->specialization_name,
            'created_at'     => (new Carbon($this->created_at))->format('Y-m-d'),
        ];
    }
}
