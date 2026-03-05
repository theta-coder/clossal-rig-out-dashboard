<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        // -------------------------------------------------------
        // 1. WISHLISTS
        // -------------------------------------------------------
        Schema::create('wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name')->default('My Wishlist');
            $table->boolean('is_public')->default(false)->comment('Can be shared via link?');
            $table->string('share_token', 64)->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('wishlist_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wishlist_id')->constrained('wishlists')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->onDelete('set null');
            $table->timestamps();

            $table->unique(['wishlist_id', 'product_id', 'variant_id']);
        });

        // -------------------------------------------------------
        // 2. RIDERS (Delivery Boys)
        // -------------------------------------------------------
        Schema::create('riders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('cnic', 15)->nullable()->unique()->comment('Pakistani CNIC');
            $table->string('vehicle_type')->nullable()->comment('e.g. bike, car');
            $table->string('vehicle_number')->nullable();
            $table->string('license_number')->nullable();
            $table->enum('status', ['active', 'inactive', 'suspended', 'on_leave'])->default('active');
            $table->string('city')->nullable();
            $table->string('zone')->nullable()->comment('Delivery zone assigned');
            $table->decimal('total_earnings', 10, 2)->default(0.00);
            $table->decimal('paid_earnings', 10, 2)->default(0.00);
            $table->integer('total_deliveries')->default(0);
            $table->date('joining_date')->nullable();
            $table->timestamps();
        });

        Schema::create('rider_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rider_id')->constrained('riders')->onDelete('cascade');
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->enum('status', ['assigned', 'picked_up', 'delivered', 'failed', 'returned'])->default('assigned');
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('picked_up_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->decimal('delivery_fee', 8, 2)->default(0.00);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // -------------------------------------------------------
        // 3. PAGES (Static CMS Pages)
        // -------------------------------------------------------
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content');
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->boolean('show_in_footer')->default(false);
            $table->boolean('show_in_header')->default(false);
            $table->timestamps();
        });

        // -------------------------------------------------------
        // 4. FAQs
        // -------------------------------------------------------
        Schema::create('faq_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faq_category_id')->nullable()->constrained('faq_categories')->onDelete('set null');
            $table->text('question');
            $table->longText('answer');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // -------------------------------------------------------
        // 5. WALLETS + WALLET TRANSACTIONS
        // -------------------------------------------------------
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->decimal('balance', 10, 2)->default(0.00);
            $table->decimal('total_credited', 10, 2)->default(0.00);
            $table->decimal('total_debited', 10, 2)->default(0.00);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained('wallets')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('set null');
            $table->enum('type', ['credit', 'debit'])->comment('credit = money in, debit = money out');
            $table->decimal('amount', 10, 2);
            $table->decimal('balance_before', 10, 2);
            $table->decimal('balance_after', 10, 2);
            $table->string('source')->nullable()->comment('e.g. refund, cashback, manual, order_payment');
            $table->string('description')->nullable();
            $table->string('reference')->nullable()->comment('External transaction ref if any');
            $table->enum('status', ['pending', 'completed', 'failed', 'reversed'])->default('completed');
            $table->timestamps();
        });

        // -------------------------------------------------------
        // 6. PRODUCT QUESTIONS + ANSWERS
        // -------------------------------------------------------
        Schema::create('product_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('name')->nullable()->comment('Guest name if not logged in');
            $table->string('email')->nullable()->comment('Guest email if not logged in');
            $table->text('question');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });

        Schema::create('product_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('product_questions')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->boolean('is_admin_reply')->default(false)->comment('True if answered by admin/seller');
            $table->text('answer');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('approved');
            $table->integer('helpful_count')->default(0)->comment('Upvotes on this answer');
            $table->timestamps();
        });

        // -------------------------------------------------------
        // 7. SOCIAL LOGINS
        // -------------------------------------------------------
        Schema::create('social_logins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('provider')->comment('e.g. google, facebook, apple');
            $table->string('provider_id')->comment('Unique ID from provider');
            $table->string('provider_email')->nullable();
            $table->string('avatar')->nullable();
            $table->text('access_token')->nullable();
            $table->text('refresh_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->timestamps();

            $table->unique(['provider', 'provider_id']);
        });

        // -------------------------------------------------------
        // 8. SUBSCRIPTION PLANS
        // -------------------------------------------------------
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('e.g. Silver, Gold, Premium');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->default(0.00);
            $table->enum('billing_cycle', ['monthly', 'quarterly', 'yearly'])->default('monthly');
            $table->integer('free_shipping_orders')->nullable()->comment('NULL = unlimited free shipping');
            $table->decimal('discount_percentage', 5, 2)->default(0.00)->comment('Extra discount on all orders');
            $table->integer('loyalty_points_multiplier')->default(1)->comment('e.g. 2 = double points');
            $table->json('perks')->nullable()->comment('Extra perks as JSON array');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('user_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('subscription_plans')->onDelete('cascade');
            $table->enum('status', ['active', 'expired', 'cancelled', 'paused'])->default('active');
            $table->decimal('amount_paid', 10, 2);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->boolean('auto_renew')->default(false);
            $table->timestamps();
        });

        // -------------------------------------------------------
        // 9. SAVED REPORTS
        // -------------------------------------------------------
        Schema::create('saved_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->string('name')->comment('Report display name');
            $table->enum('type', [
                'sales', 'orders', 'customers', 'products',
                'inventory', 'affiliates', 'coupons', 'returns'
            ])->comment('Report category');
            $table->json('filters')->nullable()->comment('Saved filter params as JSON');
            $table->json('columns')->nullable()->comment('Which columns to show');
            $table->enum('format', ['table', 'chart', 'csv'])->default('table');
            $table->boolean('is_scheduled')->default(false);
            $table->enum('schedule_frequency', ['daily', 'weekly', 'monthly'])->nullable();
            $table->string('schedule_email')->nullable()->comment('Email to send scheduled report to');
            $table->timestamp('last_run_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Drop in reverse order to respect foreign keys
        Schema::dropIfExists('saved_reports');
        Schema::dropIfExists('user_subscriptions');
        Schema::dropIfExists('subscription_plans');
        Schema::dropIfExists('social_logins');
        Schema::dropIfExists('product_answers');
        Schema::dropIfExists('product_questions');
        Schema::dropIfExists('wallet_transactions');
        Schema::dropIfExists('wallets');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('faq_categories');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('rider_orders');
        Schema::dropIfExists('riders');
        Schema::dropIfExists('wishlist_items');
        Schema::dropIfExists('wishlists');
    }
};