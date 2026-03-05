<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete()->comment('Admin who made the change');
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete()->comment('If change was due to an order');
            $table->enum('type', ['add', 'deduct', 'adjust', 'return']);
            $table->integer('quantity_before');
            $table->integer('quantity_change')->comment('Positive = added, Negative = deducted');
            $table->integer('quantity_after');
            $table->string('reason')->nullable()->comment('e.g. manual_adjust, order_placed, return');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_logs');
    }
};
