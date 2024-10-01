<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminLoadResource extends JsonResource
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
            'load_desc'   => $this->load_desc,
            'units'       => $this->units,
            'user_id'     => $this->user_id,
            'created_at'  => (new Carbon($this->created_at))->format('Y-m-d'),
        ];
    }
}
