<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_tracking', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('courier_name')->nullable()->comment('e.g. TCS, Leopards, BlueEx');
            $table->string('tracking_number')->nullable();
            $table->string('tracking_url', 500)->nullable();
            $table->date('estimated_delivery')->nullable();
            $table->date('actual_delivery')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_tracking');
    }
};
