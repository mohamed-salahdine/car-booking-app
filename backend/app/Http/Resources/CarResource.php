<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'make' => $this->make,
            'model' => $this->model,
            'year' => $this->year,
            'registration_number' => $this->registration_number,
            'daily_price' => (float) $this->daily_price,
            'is_available' => (bool) $this->is_available,

            // This safely maps the image paths to full URLs for the React frontend
            'images' => collect($this->images ?? [])->map(function ($path) {
                return str_starts_with($path, 'http') ? $path : asset('storage/' . $path);
            })->toArray(),
        ];
    }
}
