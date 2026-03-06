<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        if (!Schema::hasTable('daily_sales_summaries')) {
            Schema::create('daily_sales_summaries', function (Blueprint $table) {
                $table->id();
                $table->date('date')->unique();
                $table->integer('total_orders')->default(0);
                $table->decimal('total_revenue', 15, 2)->default(0);
                $table->integer('total_customers')->default(0);
                $table->decimal('average_order_value', 15, 2)->default(0);
                $table->integer('total_items_sold')->default(0);
                $table->integer('refund_count')->default(0);
                $table->decimal('refund_amount', 15, 2)->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('monthly_sales_summaries')) {
            Schema::create('monthly_sales_summaries', function (Blueprint $table) {
                $table->id();
                $table->integer('year');
                $table->integer('month');
                $table->integer('total_orders')->default(0);
                $table->decimal('total_revenue', 15, 2)->default(0);
                $table->integer('total_customers')->default(0);
                $table->decimal('average_order_value', 15, 2)->default(0);
                $table->integer('total_items_sold')->default(0);
                $table->integer('refund_count')->default(0);
                $table->decimal('refund_amount', 15, 2)->default(0);
                $table->timestamps();
                $table->unique(['year', 'month']);
            });
        }

        if (!Schema::hasTable('top_products')) {
            Schema::create('top_products', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained()->onDelete('cascade');
                $table->string('period')->default('all_time'); // daily, weekly, monthly, all_time
                $table->date('period_date')->nullable();
                $table->integer('units_sold')->default(0);
                $table->decimal('total_revenue', 15, 2)->default(0);
                $table->integer('views')->default(0);
                $table->decimal('conversion_rate', 5, 2)->default(0);
                $table->integer('rank')->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('top_customers')) {
            Schema::create('top_customers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->integer('total_orders')->default(0);
                $table->decimal('total_spent', 15, 2)->default(0);
                $table->decimal('average_order_value', 15, 2)->default(0);
                $table->timestamp('last_purchase_at')->nullable();
                $table->timestamp('customer_since')->nullable();
                $table->boolean('is_vip')->default(false);
                $table->decimal('lifetime_value', 15, 2)->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('conversion_funnel')) {
            Schema::create('conversion_funnel', function (Blueprint $table) {
                $table->id();
                $table->date('date')->unique();
                $table->integer('visitors')->default(0);
                $table->integer('product_views')->default(0);
                $table->integer('add_to_cart')->default(0);
                $table->integer('checkout_start')->default(0);
                $table->integer('orders_completed')->default(0);
                $table->decimal('visitor_to_view_rate', 5, 2)->default(0);
                $table->decimal('view_to_cart_rate', 5, 2)->default(0);
                $table->decimal('cart_to_checkout_rate', 5, 2)->default(0);
                $table->decimal('checkout_to_order_rate', 5, 2)->default(0);
                $table->decimal('overall_conversion_rate', 5, 2)->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('admin_audit_logs')) {
            Schema::create('admin_audit_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
                $table->string('action');
                $table->string('module');
                $table->string('ip_address')->nullable();
                $table->string('user_agent')->nullable();
                $table->json('old_values')->nullable();
                $table->json('new_values')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('traffic_sources')) {
            Schema::create('traffic_sources', function (Blueprint $table) {
                $table->id();
                $table->date('date')->nullable();
                $table->string('source');
                $table->integer('visitors')->default(0);
                $table->integer('sessions')->default(0);
                $table->integer('bounces')->default(0);
                $table->decimal('bounce_rate', 5, 2)->default(0);
                $table->integer('conversions')->default(0);
                $table->decimal('conversion_rate', 5, 2)->default(0);
                $table->decimal('revenue', 15, 2)->default(0);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('traffic_sources');
        Schema::dropIfExists('admin_audit_logs');
        Schema::dropIfExists('conversion_funnel');
        Schema::dropIfExists('top_customers');
        Schema::dropIfExists('top_products');
        Schema::dropIfExists('monthly_sales_summaries');
        Schema::dropIfExists('daily_sales_summaries');
    }
};
