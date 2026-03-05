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
        Schema::create('size_guide_rows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('size_guide_id')->constrained()->cascadeOnDelete();
            $table->string('size_label'); // XS, S, M, L, XL
            $table->json('measurements'); // {"Chest": "86-91", "Waist": "71-76"}
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('size_guide_rows');
    }
};
