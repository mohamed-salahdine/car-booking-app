<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Car;
use App\Models\Booking;

class AdminController extends Controller
{
    public function stats(Request $request)
    {
        // Must be admin, protected by route middleware or controller logic
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $totalUsers = User::where('role', 'customer')->count();
        $totalCars = Car::count();
        $totalBookings = Booking::count();
        
        $recentBookings = Booking::with(['user', 'car'])->orderBy('created_at', 'desc')->take(5)->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'total_cars' => $totalCars,
                'total_bookings' => $totalBookings,
                'recent_bookings' => $recentBookings,
            ]
        ]);
    }
}
