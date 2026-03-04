<?php

namespace Database\Seeders;

use App\Models\Color;
use App\Models\Product;
use App\Models\ProductColor;
use App\Models\ProductSize;
use App\Models\Size;
use Illuminate\Database\Seeder;

class SizeColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create default sizes
        $sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        $sizeIds = [];
        foreach ($sizes as $name) {
            $size = Size::firstOrCreate(['name' => $name]);
            $sizeIds[$name] = $size->id;
        }

        // 2. Create default colors
        $colors = [
            ['name' => 'Black', 'code' => '#000000'],
            ['name' => 'White', 'code' => '#FFFFFF'],
            ['name' => 'Red', 'code' => '#FF0000'],
            ['name' => 'Blue', 'code' => '#0000FF'],
            ['name' => 'Gray', 'code' => '#808080'],
            ['name' => 'Beige', 'code' => '#F5F5DC'],
        ];
        $colorIds = [];
        foreach ($colors as $c) {
            $color = Color::firstOrCreate(['name' => $c['name']], ['code' => $c['code']]);
            $colorIds[$c['name']] = $color->id;
        }

        // 3. Link existing products to some sizes and colors
        $products = Product::all();
        foreach ($products as $product) {
            // Assign 3-4 random sizes with stock
            $randomSizes = array_rand($sizeIds, rand(2, 4));
            if (!is_array($randomSizes))
                $randomSizes = [$randomSizes];

            foreach ($randomSizes as $sizeName) {
                ProductSize::create([
                    'product_id' => $product->id,
                    'size_id' => $sizeIds[$sizeName],
                    'stock' => rand(5, 50),
                ]);
            }

            // Assign 1-2 random colors
            $randomColors = array_rand($colorIds, rand(1, 2));
            if (!is_array($randomColors))
                $randomColors = [$randomColors];

            foreach ($randomColors as $colorName) {
                ProductColor::create([
                    'product_id' => $product->id,
                    'color_id' => $colorIds[$colorName],
                ]);
            }
        }
    }
}
