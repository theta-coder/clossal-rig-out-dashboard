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
        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Order related
            $table->boolean('order_placed')->default(true);
            $table->boolean('order_confirmed')->default(true);
            $table->boolean('order_shipped')->default(true);
            $table->boolean('order_delivered')->default(true);
            $table->boolean('order_cancelled')->default(true);

            // Promotions & Marketing
            $table->boolean('flash_sale_alerts')->default(true);
            $table->boolean('new_arrivals')->default(true);
            $table->boolean('price_drop_alerts')->default(true);
            $table->boolean('newsletter')->default(true);

            // Account
            $table->boolean('review_replies')->default(true);
            $table->boolean('loyalty_points_update')->default(true);
            $table->boolean('gift_card_received')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_preferences');
    }
};
