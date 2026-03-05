<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('transaction_ref')->nullable()->comment('Gateway transaction ID');
            $table->enum('gateway', ['cod', 'jazzcash', 'easypaisa', 'stripe', 'bank_transfer'])->default('cod');
            $table->string('method', 100)->nullable()->comment('e.g. wallet, card, USSD');
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'])->default('pending');
            $table->timestamp('payment_at')->nullable()->comment('When payment was confirmed');
            $table->longText('gateway_response')->nullable()->comment('Raw JSON from payment gateway');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
