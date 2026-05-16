<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('make');
            $table->string('model');
            $table->year('year');
            $table->string('registration_number')->unique();
            $table->decimal('daily_price', 8, 2);
            $table->boolean('is_available')->default(true);
            $table->json('images')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['make', 'model']);
            $table->index('daily_price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
