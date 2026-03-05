<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flash_sale_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flash_sale_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->decimal('sale_price', 10, 2)->nullable()->comment('Override price (NULL = use sale discount)');
            $table->integer('max_quantity')->nullable()->comment('Max units allowed per sale');
            $table->integer('sold_count')->default(0);
            $table->timestamps();

            $table->unique(['flash_sale_id', 'product_id'], 'flash_sale_products_sale_product_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flash_sale_products');
    }
};
