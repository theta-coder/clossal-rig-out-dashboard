<?php

namespace Database\Seeders;

use App\Models\ProductCatalog\SizeGuide;
use App\Models\ProductCatalog\SizeGuideRow;
use Illuminate\Database\Seeder;

class SizeGuideSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Men's Shirts Size Chart
        $menShirts = SizeGuide::create([
            'name' => "Men's Shirts Size Chart",
            'category_id' => 6, // Shirts
            'columns' => ['SIZE', 'CHEST', 'LENGTH', 'SHOULDER', 'SLEEVE', 'WAIST', 'HIP'],
            'is_active' => true,
        ]);

        $rows = [
            ['S', ['CHEST' => '38-40', 'LENGTH' => '28', 'SHOULDER' => '17', 'SLEEVE' => '8', 'WAIST' => '-', 'HIP' => '-']],
            ['M', ['CHEST' => '40-42', 'LENGTH' => '29', 'SHOULDER' => '18', 'SLEEVE' => '8.5', 'WAIST' => '-', 'HIP' => '-']],
            ['L', ['CHEST' => '42-44', 'LENGTH' => '30', 'SHOULDER' => '19', 'SLEEVE' => '9', 'WAIST' => '-', 'HIP' => '-']],
            ['XL', ['CHEST' => '44-46', 'LENGTH' => '31', 'SHOULDER' => '20', 'SLEEVE' => '9.5', 'WAIST' => '-', 'HIP' => '-']],
        ];

        foreach ($rows as $index => $rowData) {
            SizeGuideRow::create([
                'size_guide_id' => $menShirts->id,
                'size_label' => $rowData[0],
                'measurements' => $rowData[1],
                'sort_order' => $index,
            ]);
        }

        // 2. Women's Dresses Size Chart
        $womenDresses = SizeGuide::create([
            'name' => "Women's Dresses Size Chart",
            'category_id' => 7, // Dresses
            'columns' => ['SIZE', 'CHEST', 'WAIST', 'HIP', 'LENGTH'],
            'is_active' => true,
        ]);

        $rows = [
            ['XS', ['CHEST' => '32', 'WAIST' => '24', 'HIP' => '34', 'LENGTH' => '35']],
            ['S', ['CHEST' => '34', 'WAIST' => '26', 'HIP' => '36', 'LENGTH' => '36']],
            ['M', ['CHEST' => '36', 'WAIST' => '28', 'HIP' => '38', 'LENGTH' => '37']],
            ['L', ['CHEST' => '38', 'WAIST' => '30', 'HIP' => '40', 'LENGTH' => '38']],
        ];

        foreach ($rows as $index => $rowData) {
            SizeGuideRow::create([
                'size_guide_id' => $womenDresses->id,
                'size_label' => $rowData[0],
                'measurements' => $rowData[1],
                'sort_order' => $index,
            ]);
        }
    }
}
