<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('size_id')->nullable()->constrained('sizes')->nullOnDelete();
            $table->foreignId('color_id')->nullable()->constrained('colors')->nullOnDelete();
            $table->string('sku')->nullable()->comment('Stock Keeping Unit code');
            $table->string('barcode')->nullable();
            $table->integer('stock')->default(0);
            $table->decimal('price', 10, 2)->nullable()->comment('Override price (NULL = use product price)');
            $table->decimal('weight', 8, 2)->nullable()->comment('Weight in grams');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['product_id', 'size_id', 'color_id'], 'product_variants_product_size_color_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
