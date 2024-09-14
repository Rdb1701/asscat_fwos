<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'section_name'      => $this->section_name,
            'year_level'        => $this->year_level,
            'created_at'        => (new Carbon($this->created_at))->format('Y-m-d'),
        ];
    }
}
