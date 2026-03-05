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
        Schema::create('courier_companies', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // TCS, Leopards, BlueEx
            $table->string('slug')->unique(); // tcs, leopards, blueex
            $table->string('logo')->nullable();
            $table->string('tracking_url_format')->nullable(); // https://tcs.com.pk/tracking?id={tracking_number}
            $table->string('api_key')->nullable();
            $table->string('api_secret')->nullable();
            $table->string('api_url')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('contact_email')->nullable();
            $table->decimal('default_rate', 8, 2)->default(0); // default shipping cost
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courier_companies');
    }
};
