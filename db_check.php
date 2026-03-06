<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tables = ['daily_sales_summaries', 'monthly_sales_summaries', 'top_products', 'top_customers', 'conversion_funnel'];

foreach ($tables as $table) {
    if (Schema::hasTable($table)) {
        echo "Table: $table\n";
        $columns = DB::select("DESCRIBE $table");
        foreach ($columns as $column) {
            echo "  Field: {$column->Field}, Type: {$column->Type}, Null: {$column->Null}, Default: {$column->Default}\n";
        }
    }
    else {
        echo "Table: $table NOT FOUND\n";
    }
}
