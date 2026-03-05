<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    /**
     * Run the migrations.
     * Adds all missing tables and columns required for full website functionality.
     */
    public function up(): void
    {
        // =========================================================
        // 1. ORDER ADDRESS SNAPSHOT
        // Problem: Agar user address delete kare, order ka data lost ho jata hai
        // =========================================================
        Schema::table('orders', function (Blueprint $table) {
            $table->string('shipping_name')->nullable()->after('address_id');
            $table->string('shipping_street')->nullable()->after('shipping_name');
            $table->string('shipping_city')->nullable()->after('shipping_street');
            $table->string('shipping_zip')->nullable()->after('shipping_city');
            $table->string('shipping_phone')->nullable()->after('shipping_zip');
            $table->string('shipping_email')->nullable()->after('shipping_phone');

            // Loyalty points used in this order
            $table->integer('loyalty_points_used')->default(0)->after('gift_card_amount');
            $table->decimal('loyalty_discount', 10, 2)->default(0.00)->after('loyalty_points_used');
        });


        // =========================================================
        // 2. OTP VERIFICATION TABLE
        // Problem: Phone se login/register/password reset ka koi system nahi
        // =========================================================
        Schema::create('otp_verifications', function (Blueprint $table) {
            $table->id();
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('otp', 10)->comment('Generated OTP code');
            $table->enum('type', ['login', 'register', 'password_reset', 'email_verify', 'phone_verify']);
            $table->string('ip_address', 45)->nullable();
            $table->boolean('is_used')->default(false);
            $table->integer('attempts')->default(0)->comment('Wrong attempts count');
            $table->timestamp('expires_at');
            $table->timestamp('used_at')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index(['phone', 'type']);
            $table->index(['email', 'type']);
            $table->index('expires_at');
        });


        // =========================================================
        // 3. PASSWORD RESET - PHONE SUPPORT ADD KARNA
        // Problem: Abhi sirf email se password reset hota hai
        // =========================================================
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('email');
            $table->enum('token_type', ['email', 'sms'])->default('email')->after('phone');
        });


        // =========================================================
        // 4. PRODUCT VARIANT IMAGES TABLE
        // Problem: Color switch pe alag image nahi dikhti
        // =========================================================
        Schema::create('product_variant_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('color_id')->nullable()->constrained('colors')->onDelete('set null');
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->onDelete('set null');
            $table->string('image_path');
            $table->boolean('is_primary')->default(false)->comment('Main image for this color');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['product_id', 'color_id']);
        });


        // =========================================================
        // 5. SMS LOGS TABLE
        // Problem: Email logs hain lekin SMS ka koi record nahi
        // =========================================================
        Schema::create('sms_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('phone', 20);
            $table->text('message');
            $table->enum('type', ['otp', 'order_update', 'promotional', 'return_update', 'payment_confirm']);
            $table->string('provider')->nullable()->comment('e.g. twilio, jazz_api, telenor');
            $table->string('message_id')->nullable()->comment('Provider message ID for tracking');
            $table->enum('status', ['pending', 'sent', 'failed', 'delivered'])->default('pending');
            $table->text('error')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index(['phone', 'type']);
        });


        // =========================================================
        // 6. REVIEW HELPFUL VOTES TABLE
        // Problem: Reviews pe "helpful?" vote ka koi system nahi
        // =========================================================
        Schema::create('review_helpful_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('review_id')->constrained('reviews')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('ip_address', 45)->nullable()->comment('For guest votes');
            $table->boolean('is_helpful')->comment('true = helpful, false = not helpful');
            $table->timestamps();

            $table->unique(['review_id', 'user_id']);
            $table->index(['review_id', 'is_helpful']);
        });

        // Add helpful_count to reviews table
        Schema::table('reviews', function (Blueprint $table) {
            $table->integer('helpful_count')->default(0)->after('is_verified');
            $table->integer('not_helpful_count')->default(0)->after('helpful_count');
            $table->boolean('is_approved')->default(true)->after('not_helpful_count');
            $table->boolean('is_featured')->default(false)->after('is_approved');
        });


        // =========================================================
        // 7. CUSTOMER COMPLAINTS / DISPUTES TABLE
        // Problem: Return ke ilawa koi complaint system nahi
        // =========================================================
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('complaint_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('set null');
            $table->enum('type', [
                'late_delivery',
                'damaged_parcel',
                'wrong_item',
                'missing_item',
                'payment_issue',
                'rider_behavior',
                'other'
            ])->default('other');
            $table->string('subject');
            $table->text('description');
            $table->enum('status', ['open', 'in_review', 'resolved', 'closed', 'escalated'])->default('open');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null')
                ->comment('Admin handling this complaint');
            $table->text('resolution_notes')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'priority']);
            $table->index('user_id');
        });

        // Complaint attachments
        Schema::create('complaint_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('complaint_id')->constrained('complaints')->onDelete('cascade');
            $table->string('file_path');
            $table->string('file_type')->nullable()->comment('image, pdf, etc.');
            $table->timestamps();
        });

        // Complaint replies (back and forth between customer and admin)
        Schema::create('complaint_replies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('complaint_id')->constrained('complaints')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('message');
            $table->boolean('is_admin_reply')->default(false);
            $table->timestamps();
        });


        // =========================================================
        // 8. RIDER LOCATION TRACKING TABLE
        // Problem: Rider real-time location store nahi ho rahi
        // =========================================================
        Schema::create('rider_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rider_id')->constrained('riders')->onDelete('cascade');
            $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('set null');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->decimal('accuracy', 6, 2)->nullable()->comment('GPS accuracy in meters');
            $table->boolean('is_on_duty')->default(true);
            $table->timestamp('recorded_at')->useCurrent();

            $table->index(['rider_id', 'recorded_at']);
        });


        // =========================================================
        // 9. PRODUCT COMPARISON TABLE
        // Problem: Users products compare nahi kar sakte
        // =========================================================
        Schema::create('product_comparisons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('session_id')->nullable()->comment('For guest users');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();

            $table->index(['user_id']);
            $table->index(['session_id']);
        });


        // =========================================================
        // 10. DEVICE TOKENS TABLE (Push Notifications)
        // Problem: FCM tokens ka proper management nahi, sirf logs mein hai
        // =========================================================
        Schema::create('device_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('fcm_token', 500);
            $table->enum('platform', ['android', 'ios', 'web'])->default('android');
            $table->string('device_name')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'fcm_token']);
            $table->index(['user_id', 'is_active']);
        });


        // =========================================================
        // 11. PRODUCT STOCK RESERVATION TABLE
        // Problem: Jab cart mein item ho aur koi aur bhi wohi last piece le le
        // =========================================================
        Schema::create('stock_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->onDelete('cascade');
            $table->foreignId('cart_id')->nullable()->constrained('carts')->onDelete('cascade');
            $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('set null');
            $table->integer('quantity');
            $table->enum('status', ['reserved', 'confirmed', 'released', 'expired'])->default('reserved');
            $table->timestamp('expires_at')->comment('Auto release after this time');
            $table->timestamps();

            $table->index(['product_id', 'status']);
            $table->index('expires_at');
        });


        // =========================================================
        // 12. BANK ACCOUNTS TABLE (Seller/Store Payouts)
        // Problem: Store ka apna bank account manage karne ka koi system nahi
        // =========================================================
        Schema::create('store_bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('bank_name');
            $table->string('account_title');
            $table->string('account_number');
            $table->string('iban')->nullable();
            $table->string('branch_code')->nullable();
            $table->string('branch_name')->nullable();
            $table->enum('type', ['main', 'refund', 'affiliate_payout'])->default('main');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });


        // =========================================================
        // 13. NEWSLETTER CAMPAIGNS TABLE
        // Problem: Subscribers hain lekin campaigns bhejne ka track nahi
        // =========================================================
        Schema::create('newsletter_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->longText('body');
            $table->enum('status', ['draft', 'scheduled', 'sending', 'sent', 'cancelled'])->default('draft');
            $table->integer('total_sent')->default(0);
            $table->integer('total_failed')->default(0);
            $table->integer('total_opened')->default(0);
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });


        // =========================================================
        // 14. PRODUCTS TABLE - MISSING USEFUL COLUMNS
        // =========================================================
        Schema::table('products', function (Blueprint $table) {
            $table->integer('total_sold')->default(0)->after('is_active')
                ->comment('Total units sold, for sorting by popularity');
            $table->integer('total_views')->default(0)->after('total_sold')
                ->comment('Cached view count');
            $table->decimal('average_rating', 3, 2)->default(0.00)->after('total_views');
            $table->integer('review_count')->default(0)->after('average_rating');
            $table->timestamp('published_at')->nullable()->after('review_count')
                ->comment('Schedule product publish date');
        });


        // =========================================================
        // 15. USERS TABLE - MISSING USEFUL COLUMNS
        // =========================================================
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_verified_at')->nullable()->after('phone')
                ->comment('Phone OTP verify timestamp');
            $table->boolean('is_blocked')->default(false)->after('role')
                ->comment('Admin blocked this user');
            $table->string('referral_code', 20)->nullable()->unique()->after('is_blocked')
                ->comment('This user ka referral code');
            $table->integer('total_orders')->default(0)->after('referral_code');
            $table->decimal('total_spent', 12, 2)->default(0.00)->after('total_orders');
            $table->string('gender')->nullable()->after('avatar');
            $table->date('date_of_birth')->nullable()->after('gender');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove added columns from existing tables
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'shipping_name', 'shipping_street', 'shipping_city',
                'shipping_zip', 'shipping_phone', 'shipping_email',
                'loyalty_points_used', 'loyalty_discount',
            ]);
        });

        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->dropColumn(['phone', 'token_type']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn(['helpful_count', 'not_helpful_count', 'is_approved', 'is_featured']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['total_sold', 'total_views', 'average_rating', 'review_count', 'published_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone_verified_at', 'is_blocked', 'referral_code',
                'total_orders', 'total_spent', 'gender', 'date_of_birth',
            ]);
        });

        // Drop created tables
        Schema::dropIfExists('newsletter_campaigns');
        Schema::dropIfExists('store_bank_accounts');
        Schema::dropIfExists('stock_reservations');
        Schema::dropIfExists('device_tokens');
        Schema::dropIfExists('product_comparisons');
        Schema::dropIfExists('rider_locations');
        Schema::dropIfExists('complaint_replies');
        Schema::dropIfExists('complaint_attachments');
        Schema::dropIfExists('complaints');
        Schema::dropIfExists('review_helpful_votes');
        Schema::dropIfExists('sms_logs');
        Schema::dropIfExists('product_variant_images');
        Schema::dropIfExists('otp_verifications');
    }
};