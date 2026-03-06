<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('campaigns')) {
            Schema::create('campaigns', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description')->nullable();
                $table->string('type')->nullable();
                $table->foreignId('target_segment_id')->nullable()->constrained('customer_segments')->onDelete('set null');
                $table->enum('status', ['draft', 'active', 'paused', 'completed'])->default('draft');
                $table->date('start_date')->nullable();
                $table->date('end_date')->nullable();
                $table->integer('total_sent')->default(0);
                $table->integer('total_opened')->default(0);
                $table->integer('total_clicked')->default(0);
                $table->integer('total_converted')->default(0);
                $table->decimal('budget', 12, 2)->nullable();
                $table->decimal('spent', 12, 2)->default(0);
                $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
                $table->timestamps();
            });
        } else {
            // Fix existing table: make id AUTO_INCREMENT if it isn't already
            DB::statement('ALTER TABLE campaigns MODIFY id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT');
        }

        if (!Schema::hasTable('campaign_metrics')) {
            Schema::create('campaign_metrics', function (Blueprint $table) {
                $table->id();
                $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
                $table->integer('impressions')->default(0);
                $table->integer('clicks')->default(0);
                $table->integer('conversions')->default(0);
                $table->decimal('revenue', 12, 2)->default(0);
                $table->date('date')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_metrics');
        Schema::dropIfExists('campaigns');
    }
};
