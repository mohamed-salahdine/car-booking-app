<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Car extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'make',
        'model',
        'year',
        'registration_number',
        'daily_price',
        'is_available',
        'images'
    ];

    protected function casts(): array
    {
        return [
            'daily_price' => 'decimal:2',
            'is_available' => 'boolean',
            'images' => 'array', // Auto-cast JSON to array
        ];
    }

    // Relationship
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
