<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                        => $this->id,
            'department_name'           => $this->department_name,
            'department_description'    => $this->department_description,
            'created_at'                => (new Carbon($this->created_at))->format('Y-m-d'),
        ];
    }
}
