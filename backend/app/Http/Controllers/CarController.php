<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Http\Requests\StoreCarRequest;
use App\Http\Resources\CarResource;
use Illuminate\Http\Request;

class CarController extends Controller
{
    // Public: List all available cars
    public function index(Request $request)
    {
        $query = Car::query();

        // Optional: Filter by availability
        if ($request->has('available')) {
            $query->where('is_available', $request->boolean('available'));
        }

        return CarResource::collection($query->get());
    }

    // Admin: Add a new car
    public function store(StoreCarRequest $request)
    {
        $car = Car::create($request->validated());
        return new CarResource($car);
    }

    // Public: View single car
    public function show(Car $car)
    {
        return new CarResource($car);
    }

    // Admin: Update car
    public function update(StoreCarRequest $request, Car $car)
    {
        $car->update($request->validated());
        return new CarResource($car);
    }

    // Admin: Delete car
    public function destroy(Request $request, Car $car)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $car->delete();
        return response()->json(['message' => 'Car deleted successfully']);
    }
}
