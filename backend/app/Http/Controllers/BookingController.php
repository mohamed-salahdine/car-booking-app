<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Car;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // List authenticated user's bookings (or all if Admin)
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $bookings = Booking::with(['car', 'user'])->orderBy('created_at', 'desc')->get();
        } else {
            $bookings = $user->bookings()->with('car')->orderBy('created_at', 'desc')->get();
        }

        return BookingResource::collection($bookings);
    }

    // Create a new booking
    public function store(StoreBookingRequest $request)
    {
        $car = Car::findOrFail($request->car_id);

        if (!$car->is_available) {
            return response()->json(['message' => 'Car is currently not available.'], 400);
        }

        $start = Carbon::parse($request->start_date);
        $end = Carbon::parse($request->end_date);

        // --- ANTI-DOUBLE-BOOKING LOGIC ---
        $overlappingBookings = Booking::where('car_id', $car->id)
            ->whereIn('status', ['pending', 'confirmed']) // Ignore cancelled/completed
            ->where(function ($query) use ($start, $end) {
                $query->whereBetween('start_date', [$start, $end])
                    ->orWhereBetween('end_date', [$start, $end])
                    ->orWhere(function ($q) use ($start, $end) {
                        $q->where('start_date', '<=', $start)
                            ->where('end_date', '>=', $end);
                    });
            })
            ->exists();

        if ($overlappingBookings) {
            return response()->json(['message' => 'Car is already booked for the selected dates.'], 409);
        }

        // Calculate Price (Days * Daily Price) - Minimum 1 day
        $days = $start->diffInDays($end) == 0 ? 1 : $start->diffInDays($end);
        $totalPrice = $days * $car->daily_price;

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'car_id' => $car->id,
            'start_date' => $start,
            'end_date' => $end,
            'total_price' => $totalPrice,
            'status' => 'confirmed', // Assuming auto-confirm for now
        ]);

        return new BookingResource($booking->load('car'));
    }

    // Cancel a booking
    public function destroy(Request $request, Booking $booking)
    {
        if ($request->user()->id !== $booking->user_id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking->update(['status' => 'cancelled']);
        return response()->json(['message' => 'Booking cancelled successfully']);
    }
}
