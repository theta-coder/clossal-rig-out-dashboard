<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        Schema::create('returns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('return_number')->unique(); // e.g. RT-XXXXX
            $table->enum('status', ['requested', 'approved', 'rejected', 'received', 'refunded'])->default('requested');
            $table->enum('reason', ['defective', 'wrong_item', 'not_as_described', 'changed_mind', 'other'])->default('other');
            $table->text('notes')->nullable();
            $table->decimal('refund_amount', 10, 2)->default(0.00);
            $table->enum('refund_method', ['original_payment', 'store_credit', 'bank_transfer'])->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->timestamps();
        });

        Schema::create('return_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('return_id')->constrained('returns')->onDelete('cascade');
            $table->foreignId('order_item_id')->constrained('order_items')->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('refund_amount', 10, 2)->default(0.00);
            $table->text('reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('return_items');
        Schema::dropIfExists('returns');
    }
};