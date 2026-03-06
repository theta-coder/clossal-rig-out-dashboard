<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tables = DB::select('SHOW TABLES');
foreach ($tables as $tableRow) {
    $table = array_values((array)$tableRow)[0];
    if (in_array($table, ['daily_sales_summaries', 'monthly_sales_summaries', 'top_products', 'top_customers', 'conversion_funnel'])) {
        echo "Table: $table\n";
        $columns = DB::select("DESCRIBE $table");
        foreach ($columns as $column) {
            echo "  Field: {$column->Field}, Type: {$column->Type}\n";
        }
    }
}
