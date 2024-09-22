<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacultyLoadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'user_id'            => $this->user_id,
            'curriculum_id'      => $this->curriculum_id,
            'contact_hours'      => $this->contact_hours,
            'administrative_id'  => $this->administrative_id,
            'research_load_id'   => $this->research_load_id,
            'section'            => $this->section,
            'created_at'         => (new Carbon($this->created_at))->format('Y-m-d'),
        ];
    }
}
