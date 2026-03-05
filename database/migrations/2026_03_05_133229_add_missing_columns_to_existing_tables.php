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
        // -----------------------------------------------
        // 1. ORDERS TABLE
        // payment_status aur tax_amount add karo
        // -----------------------------------------------
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('payment_status', ['unpaid', 'paid', 'refunded', 'partially_refunded'])
                ->default('unpaid')
                ->after('payment_method');

            $table->decimal('tax_amount', 10, 2)
                ->default(0.00)
                ->after('discount_amount');
        });

        // -----------------------------------------------
        // 2. USERS TABLE
        // last_login_at aur avatar add karo
        // -----------------------------------------------
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('last_login_at')
                ->nullable()
                ->after('phone');

            $table->string('avatar')
                ->nullable()
                ->after('last_login_at');
        });

        // -----------------------------------------------
        // 3. PRODUCTS TABLE
        // sku, barcode, weight add karo
        // -----------------------------------------------
        Schema::table('products', function (Blueprint $table) {
            $table->string('sku')
                ->nullable()
                ->unique()
                ->after('badge')
                ->comment('Stock Keeping Unit - unique product code');

            $table->string('barcode')
                ->nullable()
                ->after('sku');

            $table->decimal('weight', 8, 2)
                ->nullable()
                ->after('barcode')
                ->comment('Weight in grams');
        });

        // -----------------------------------------------
        // 4. CART_ITEMS TABLE
        // size_id aur color_id as foreign keys add karo
        // (purane size/color string columns bhi rahenge
        //  backward compatibility ke liye)
        // -----------------------------------------------
        Schema::table('cart_items', function (Blueprint $table) {
            $table->unsignedBigInteger('size_id')
                ->nullable()
                ->after('size');

            $table->unsignedBigInteger('color_id')
                ->nullable()
                ->after('color');

            $table->foreign('size_id')
                ->references('id')
                ->on('sizes')
                ->onDelete('set null');

            $table->foreign('color_id')
                ->references('id')
                ->on('colors')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Orders
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['payment_status', 'tax_amount']);
        });

        // Users
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['last_login_at', 'avatar']);
        });

        // Products
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['sku', 'barcode', 'weight']);
        });

        // Cart Items
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropForeign(['size_id']);
            $table->dropForeign(['color_id']);
            $table->dropColumn(['size_id', 'color_id']);
        });
    }
};