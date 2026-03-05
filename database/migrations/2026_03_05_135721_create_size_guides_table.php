<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('size_guides', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. "Men's Tops", "Women's Bottoms"
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->json('columns'); // ["Size", "Chest (cm)", "Waist (cm)"]
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('size_guides');
    }
};
