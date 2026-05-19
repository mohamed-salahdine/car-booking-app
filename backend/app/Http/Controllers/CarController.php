<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Http\Requests\StoreCarRequest;
use App\Http\Resources\CarResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarController extends Controller
{
    // 1. UPDATED FOR PAGINATION
    public function index(Request $request)
    {
        $query = Car::query()->latest();

        if ($request->has('available')) {
            $query->where('is_available', $request->boolean('available'));
        }

        // Return 6 cars per page. Laravel Resources automatically format pagination data!
        return CarResource::collection($query->paginate(6));
    }

    // 2. UPDATED FOR IMAGE UPLOADS
    public function store(StoreCarRequest $request)
    {
        $data = $request->validated();
        $imagePaths = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('cars', 'public'); // Saves to storage/app/public/cars
            }
        }

        $data['images'] = $imagePaths;
        $car = Car::create($data);

        return new CarResource($car);
    }

    public function show(Car $car)
    {
        return new CarResource($car);
    }

    // 3. UPDATED TO HANDLE NEW IMAGES ON EDIT
    public function update(StoreCarRequest $request, Car $car)
    {
        $data = $request->validated();

        if ($request->hasFile('images')) {
            // Optional: Delete old images from storage to save space
            if (is_array($car->images)) {
                foreach ($car->images as $oldImage) {
                    if (!str_starts_with($oldImage, 'http')) {
                        Storage::disk('public')->delete($oldImage);
                    }
                }
            }

            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('cars', 'public');
            }
            $data['images'] = $imagePaths;
        } else {
            // Keep existing images if no new ones are uploaded
            unset($data['images']);
        }

        $car->update($data);
        return new CarResource($car);
    }

    public function destroy(Request $request, Car $car)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Optional: Delete images from server when car is deleted
        if (is_array($car->images)) {
            foreach ($car->images as $image) {
                if (!str_starts_with($image, 'http')) {
                    Storage::disk('public')->delete($image);
                }
            }
        }

        $car->delete();
        return response()->json(['message' => 'Car deleted successfully']);
    }
}
