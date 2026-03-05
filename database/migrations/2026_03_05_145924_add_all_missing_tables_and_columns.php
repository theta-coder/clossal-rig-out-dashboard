<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        // =========================================================
        // 1. ORDERS TABLE - Missing Columns
        // =========================================================
        Schema::table('orders', function (Blueprint $table) {
            // Shipping address snapshot
            if (!Schema::hasColumn('orders', 'shipping_name')) {
                $table->string('shipping_name')->nullable()->after('address_id');
            }
            if (!Schema::hasColumn('orders', 'shipping_street')) {
                $table->string('shipping_street')->nullable()->after('shipping_name');
            }
            if (!Schema::hasColumn('orders', 'shipping_city')) {
                $table->string('shipping_city')->nullable()->after('shipping_street');
            }
            if (!Schema::hasColumn('orders', 'shipping_zip')) {
                $table->string('shipping_zip')->nullable()->after('shipping_city');
            }
            if (!Schema::hasColumn('orders', 'shipping_phone')) {
                $table->string('shipping_phone')->nullable()->after('shipping_zip');
            }
            if (!Schema::hasColumn('orders', 'shipping_email')) {
                $table->string('shipping_email')->nullable()->after('shipping_phone');
            }

            // Loyalty
            if (!Schema::hasColumn('orders', 'loyalty_points_used')) {
                $table->integer('loyalty_points_used')->default(0)->after('gift_card_amount');
            }
            if (!Schema::hasColumn('orders', 'loyalty_discount')) {
                $table->decimal('loyalty_discount', 10, 2)->default(0.00)->after('loyalty_points_used');
            }

            // Cancel info
            if (!Schema::hasColumn('orders', 'cancelled_by')) {
                $table->enum('cancelled_by', ['customer', 'admin'])->nullable()->after('status');
            }
            if (!Schema::hasColumn('orders', 'cancel_reason')) {
                $table->string('cancel_reason')->nullable()->after('cancelled_by');
            }
            if (!Schema::hasColumn('orders', 'cancelled_at')) {
                $table->timestamp('cancelled_at')->nullable()->after('cancel_reason');
            }
        });


        // =========================================================
        // 2. CARTS TABLE - Expiry Column
        // =========================================================
        Schema::table('carts', function (Blueprint $table) {
            if (!Schema::hasColumn('carts', 'expires_at')) {
                $table->timestamp('expires_at')->nullable()->after('session_id')
                    ->comment('Auto expire old guest carts');
            }
        });


        // =========================================================
        // 3. PASSWORD RESET TOKENS - Phone Support
        // =========================================================
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            if (!Schema::hasColumn('password_reset_tokens', 'phone')) {
                $table->string('phone', 20)->nullable()->after('email');
            }
            if (!Schema::hasColumn('password_reset_tokens', 'token_type')) {
                $table->enum('token_type', ['email', 'sms'])->default('email')->after('phone');
            }
        });


        // =========================================================
        // 4. REVIEWS TABLE - Missing Columns
        // =========================================================
        Schema::table('reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('reviews', 'helpful_count')) {
                $table->integer('helpful_count')->default(0)->after('is_verified');
            }
            if (!Schema::hasColumn('reviews', 'not_helpful_count')) {
                $table->integer('not_helpful_count')->default(0)->after('helpful_count');
            }
            if (!Schema::hasColumn('reviews', 'is_approved')) {
                $table->boolean('is_approved')->default(true)->after('not_helpful_count');
            }
            if (!Schema::hasColumn('reviews', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('is_approved');
            }
        });


        // =========================================================
        // 5. PRODUCTS TABLE - Missing Columns
        // =========================================================
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'total_sold')) {
                $table->integer('total_sold')->default(0)->after('is_active');
            }
            if (!Schema::hasColumn('products', 'total_views')) {
                $table->integer('total_views')->default(0)->after('total_sold');
            }
            if (!Schema::hasColumn('products', 'average_rating')) {
                $table->decimal('average_rating', 3, 2)->default(0.00)->after('total_views');
            }
            if (!Schema::hasColumn('products', 'review_count')) {
                $table->integer('review_count')->default(0)->after('average_rating');
            }
            if (!Schema::hasColumn('products', 'published_at')) {
                $table->timestamp('published_at')->nullable()->after('review_count')
                    ->comment('Schedule product publish date');
            }
        });


        // =========================================================
        // 6. USERS TABLE - Missing Columns
        // =========================================================
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'phone_verified_at')) {
                $table->timestamp('phone_verified_at')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('users', 'is_blocked')) {
                $table->boolean('is_blocked')->default(false)->after('role');
            }
            if (!Schema::hasColumn('users', 'referral_code')) {
                $table->string('referral_code', 20)->nullable()->unique()->after('is_blocked');
            }
            if (!Schema::hasColumn('users', 'total_orders')) {
                $table->integer('total_orders')->default(0)->after('referral_code');
            }
            if (!Schema::hasColumn('users', 'total_spent')) {
                $table->decimal('total_spent', 12, 2)->default(0.00)->after('total_orders');
            }
            if (!Schema::hasColumn('users', 'gender')) {
                $table->string('gender')->nullable()->after('avatar');
            }
            if (!Schema::hasColumn('users', 'date_of_birth')) {
                $table->date('date_of_birth')->nullable()->after('gender');
            }
        });


        if (!Schema::hasTable('otp_verifications')) {
            Schema::create('otp_verifications', function (Blueprint $table) {
                $table->id();
                $table->string('phone', 20)->nullable();
                $table->string('email')->nullable();
                $table->string('otp', 10);
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
        }


        if (!Schema::hasTable('product_variant_images')) {
            Schema::create('product_variant_images', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
                $table->foreignId('color_id')->nullable()->constrained('colors')->onDelete('set null');
                $table->foreignId('variant_id')->nullable()->constrained('product_variants')->onDelete('set null');
                $table->string('image_path');
                $table->boolean('is_primary')->default(false);
                $table->integer('sort_order')->default(0);
                $table->timestamps();

                $table->index(['product_id', 'color_id']);
            });
        }


        // =========================================================
        // 9. SMS LOGS TABLE
        // =========================================================
        if (!Schema::hasTable('sms_logs')) {
            Schema::create('sms_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->string('phone', 20);
                $table->text('message');
                $table->enum('type', ['otp', 'order_update', 'promotional', 'return_update', 'payment_confirm']);
                $table->string('provider')->nullable()->comment('e.g. twilio, jazz_api');
                $table->string('message_id')->nullable()->comment('Provider message ID');
                $table->enum('status', ['pending', 'sent', 'failed', 'delivered'])->default('pending');
                $table->text('error')->nullable();
                $table->timestamp('sent_at')->nullable();
                $table->timestamps();

                $table->index('status');
                $table->index(['phone', 'type']);
            });
        }


        if (!Schema::hasTable('review_helpful_votes')) {
            Schema::create('review_helpful_votes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('review_id')->constrained('reviews')->onDelete('cascade');
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->string('ip_address', 45)->nullable()->comment('For guest votes');
                $table->boolean('is_helpful');
                $table->timestamps();

                $table->unique(['review_id', 'user_id']);
                $table->index(['review_id', 'is_helpful']);
            });
        }


        if (!Schema::hasTable('complaints')) {
            Schema::create('complaints', function (Blueprint $table) {
                $table->id();
                $table->string('complaint_number')->unique();
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('set null');
                $table->enum('type', [
                    'late_delivery', 'damaged_parcel', 'wrong_item',
                    'missing_item', 'payment_issue', 'rider_behavior', 'other'
                ])->default('other');
                $table->string('subject');
                $table->text('description');
                $table->enum('status', ['open', 'in_review', 'resolved', 'closed', 'escalated'])->default('open');
                $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
                $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
                $table->text('resolution_notes')->nullable();
                $table->timestamp('resolved_at')->nullable();
                $table->timestamps();

                $table->index(['status', 'priority']);
            });
        }

        if (!Schema::hasTable('complaint_attachments')) {
            Schema::create('complaint_attachments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('complaint_id')->constrained('complaints')->onDelete('cascade');
                $table->string('file_path');
                $table->string('file_type')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('complaint_replies')) {
            Schema::create('complaint_replies', function (Blueprint $table) {
                $table->id();
                $table->foreignId('complaint_id')->constrained('complaints')->onDelete('cascade');
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->text('message');
                $table->boolean('is_admin_reply')->default(false);
                $table->timestamps();
            });
        }


        if (!Schema::hasTable('rider_locations')) {
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
        }


        if (!Schema::hasTable('product_comparisons')) {
            Schema::create('product_comparisons', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
                $table->string('session_id')->nullable()->comment('For guest users');
                $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
                $table->timestamp('created_at')->useCurrent();

                $table->index('user_id');
                $table->index('session_id');
            });
        }


        if (!Schema::hasTable('device_tokens')) {
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
        }


        if (!Schema::hasTable('stock_reservations')) {
            Schema::create('stock_reservations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
                $table->foreignId('variant_id')->nullable()->constrained('product_variants')->onDelete('cascade');
                $table->foreignId('cart_id')->nullable()->constrained('carts')->onDelete('cascade');
                $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('set null');
                $table->integer('quantity');
                $table->enum('status', ['reserved', 'confirmed', 'released', 'expired'])->default('reserved');
                $table->timestamp('expires_at');
                $table->timestamps();

                $table->index(['product_id', 'status']);
                $table->index('expires_at');
            });
        }


        if (!Schema::hasTable('store_bank_accounts')) {
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
        }


        if (!Schema::hasTable('newsletter_campaigns')) {
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
        }


        if (!Schema::hasTable('back_in_stock_alerts')) {
            Schema::create('back_in_stock_alerts', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
                $table->foreignId('variant_id')->nullable()->constrained('product_variants')->onDelete('cascade');
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->string('email')->nullable()->comment('For guest users');
                $table->string('phone', 20)->nullable()->comment('SMS alert');
                $table->enum('notify_via', ['email', 'sms', 'both'])->default('email');
                $table->boolean('is_notified')->default(false);
                $table->timestamp('notified_at')->nullable();
                $table->timestamps();

                $table->index(['product_id', 'is_notified']);
                $table->index(['variant_id', 'is_notified']);
            });
        }


        // =========================================================
        // 19. COD CASH COLLECTION TRACKING TABLE
        // =========================================================
        if (!Schema::hasTable('cod_collections')) {
            Schema::create('cod_collections', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
                $table->foreignId('rider_id')->constrained('riders')->onDelete('cascade');
                $table->decimal('amount_collected', 10, 2)->comment('Cash collected from customer');
                $table->decimal('amount_submitted', 10, 2)->default(0.00)->comment('Cash submitted to office');
                $table->enum('status', ['collected', 'submitted', 'verified', 'shortage', 'excess'])->default('collected');
                $table->timestamp('collected_at')->nullable();
                $table->timestamp('submitted_at')->nullable();
                $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
                $table->timestamp('verified_at')->nullable();
                $table->text('notes')->nullable();
                $table->timestamps();

                $table->index(['rider_id', 'status']);
                $table->index('status');
            });
        }


        // =========================================================
        // 20. FRAUD PREVENTION / BLACKLIST TABLE
        // =========================================================
        if (!Schema::hasTable('blacklists')) {
            Schema::create('blacklists', function (Blueprint $table) {
                $table->id();
                $table->enum('type', ['email', 'phone', 'ip_address', 'address'])->index();
                $table->string('value')->comment('The blacklisted email/phone/IP');
                $table->string('reason')->nullable();
                $table->foreignId('blacklisted_by')->nullable()->constrained('users')->onDelete('set null');
                $table->boolean('is_active')->default(true);
                $table->timestamp('expires_at')->nullable()->comment('NULL = permanent ban');
                $table->timestamps();

                $table->unique(['type', 'value']);
                $table->index(['type', 'is_active']);
            });
        }


        // =========================================================
        // 21. TERMS & CONDITIONS ACCEPTANCE LOG
        // =========================================================
        if (!Schema::hasTable('terms_acceptances')) {
            Schema::create('terms_acceptances', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->string('email')->nullable()->comment('Guest email if not logged in');
                $table->string('terms_version')->comment('e.g. v1.0, v2.1');
                $table->enum('type', ['terms_of_service', 'privacy_policy', 'refund_policy', 'all'])->default('all');
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->timestamp('accepted_at')->useCurrent();

                $table->index('user_id');
                $table->index('terms_version');
            });
        }
    }


    public function down(): void
    {
        // Drop new tables (reverse order for foreign keys)
        Schema::dropIfExists('terms_acceptances');
        Schema::dropIfExists('blacklists');
        Schema::dropIfExists('cod_collections');
        Schema::dropIfExists('back_in_stock_alerts');
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

        // Remove added columns from existing tables
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone_verified_at', 'is_blocked', 'referral_code',
                'total_orders', 'total_spent', 'gender', 'date_of_birth',
            ]);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'total_sold', 'total_views', 'average_rating',
                'review_count', 'published_at',
            ]);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn(['helpful_count', 'not_helpful_count', 'is_approved', 'is_featured']);
        });

        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->dropColumn(['phone', 'token_type']);
        });

        Schema::table('carts', function (Blueprint $table) {
            $table->dropColumn('expires_at');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'shipping_name', 'shipping_street', 'shipping_city',
                'shipping_zip', 'shipping_phone', 'shipping_email',
                'loyalty_points_used', 'loyalty_discount',
                'cancelled_by', 'cancel_reason', 'cancelled_at',
            ]);
        });
    }
};