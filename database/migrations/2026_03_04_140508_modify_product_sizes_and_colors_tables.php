<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration 
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Clear existing data as we are changing the structure
        DB::table('product_sizes')->truncate();
        DB::table('product_colors')->truncate();

        Schema::table('product_sizes', function (Blueprint $table) {
            $table->dropColumn('size');
            $table->foreignId('size_id')->after('product_id')->constrained('sizes')->onDelete('cascade');
        });

        Schema::table('product_colors', function (Blueprint $table) {
            $table->dropColumn('color_name');
            $table->foreignId('color_id')->after('product_id')->constrained('colors')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('product_colors', function (Blueprint $table) {
            $table->dropForeign(['color_id']);
            $table->dropColumn('color_id');
            $table->string('color_name')->after('product_id');
        });

        Schema::table('product_sizes', function (Blueprint $table) {
            $table->dropForeign(['size_id']);
            $table->dropColumn('size_id');
            $table->string('size')->after('product_id');
        });
    }
};
