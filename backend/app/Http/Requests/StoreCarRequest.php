<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCarRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only allow if user is authenticated and is an admin
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'registration_number' => 'required|string|unique:cars',
            'daily_price' => 'required|numeric|min:0',
            'is_available' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'url' // Ensure each item in the array is a valid URL
        ];
    }
}
