<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule; // <-- 1. Add this import at the top!

class StoreCarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        // 2. Get the car from the route (will be null if creating, or the Car model if updating)
        $car = $this->route('car');

        return [
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),

            // 3. Update this rule to ignore the current car's ID
            'registration_number' => [
                'required',
                'string',
                Rule::unique('cars')->ignore($car?->id),
            ],

            'daily_price' => 'required|numeric|min:0',
            'is_available' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'url'
        ];
    }
}
