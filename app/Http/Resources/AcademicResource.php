<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AcademicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'school_year' => $this->school_year,
            'semester'    => $this->semester,
            'created_at'  => (new Carbon($this->created_at))->format('Y-m-d'),
        ];
    }
}
