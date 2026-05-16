<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// ---------------------------------------------------------
// PUBLIC ROUTES
// ---------------------------------------------------------

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Cars (Guests can view cars)
// Route::get('/cars', [CarController::class, 'index']); // We will create this next
// Route::get('/cars/{car}', [CarController::class, 'show']); 


// ---------------------------------------------------------
// PROTECTED ROUTES (Requires valid Sanctum Token)
// ---------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {

    // Auth User
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Customer Routes (Bookings)
    // Route::apiResource('bookings', BookingController::class);

    // Admin Routes (Manage Cars and View all Bookings)
    // We will use a custom middleware 'admin' later, or handle it in policies/controllers
    Route::prefix('admin')->group(function () {
        // Route::apiResource('cars', CarController::class)->except(['index', 'show']);
        // Route::get('/bookings', [AdminBookingController::class, 'index']);
    });
});
