<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tax_rates', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('e.g. GST, Sales Tax Lahore');
            $table->decimal('rate', 5, 2)->comment('Percentage, e.g. 17.00 for 17%');
            $table->enum('applies_to', ['all', 'category', 'zone'])->default('all');
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('zone_id')->nullable()->constrained('shipping_zones')->nullOnDelete();
            $table->boolean('is_inclusive')->default(false)->comment('1 = tax included in price');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tax_rates');
    }
};
