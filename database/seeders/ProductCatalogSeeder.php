<?php

namespace Database\Seeders;

use App\Models\ProductCatalog\Category;
use App\Models\ProductCatalog\Collection;
use App\Models\ProductCatalog\Color;
use App\Models\ProductCatalog\Product;
use App\Models\ProductCatalog\Size;
use App\Models\ProductCatalog\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;

class ProductCatalogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $placeholderImage = 'assets/products/1772636426_0_7e46c6d2798eff446b365c5246f4c9ca.jpg';

        $categoriesBySlug = [];
        $categoryRows = [
            ['name' => 'Men', 'slug' => 'men', 'parent_slug' => null, 'is_active' => true],
            ['name' => 'Women', 'slug' => 'women', 'parent_slug' => null, 'is_active' => true],
            ['name' => 'Kids', 'slug' => 'kids', 'parent_slug' => null, 'is_active' => true],
            ['name' => 'T-Shirts', 'slug' => 'men-tshirts', 'parent_slug' => 'men', 'is_active' => true],
            ['name' => 'Shirts', 'slug' => 'men-shirts', 'parent_slug' => 'men', 'is_active' => true],
            ['name' => 'Dresses', 'slug' => 'women-dresses', 'parent_slug' => 'women', 'is_active' => true],
            ['name' => 'Tops', 'slug' => 'women-tops', 'parent_slug' => 'women', 'is_active' => true],
            ['name' => 'Boys', 'slug' => 'kids-boys', 'parent_slug' => 'kids', 'is_active' => true],
            ['name' => 'Girls', 'slug' => 'kids-girls', 'parent_slug' => 'kids', 'is_active' => true],
        ];

        foreach ($categoryRows as $row) {
            $parentId = $row['parent_slug'] ? ($categoriesBySlug[$row['parent_slug']]->id ?? null) : null;

            $categoriesBySlug[$row['slug']] = Category::updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'name' => $row['name'],
                    'parent_id' => $parentId,
                    'is_active' => $row['is_active'],
                ]
            );
        }

        $sizesByName = [];
        foreach (['XS', 'S', 'M', 'L', 'XL', 'XXL'] as $sizeName) {
            $sizesByName[$sizeName] = Size::firstOrCreate(['name' => $sizeName]);
        }

        $colorsByName = [];
        $colorRows = [
            ['name' => 'Black', 'code' => '#111111'],
            ['name' => 'White', 'code' => '#F8F8F8'],
            ['name' => 'Navy', 'code' => '#1F3A5F'],
            ['name' => 'Olive', 'code' => '#556B2F'],
            ['name' => 'Maroon', 'code' => '#800000'],
            ['name' => 'Beige', 'code' => '#E6D8B8'],
            ['name' => 'Sky Blue', 'code' => '#87CEEB'],
            ['name' => 'Dusty Pink', 'code' => '#D8A7B1'],
        ];

        foreach ($colorRows as $row) {
            $colorsByName[$row['name']] = Color::updateOrCreate(
                ['name' => $row['name']],
                ['code' => $row['code']]
            );
        }

        $tagsBySlug = [];
        $tagRows = [
            ['name' => 'New Arrival', 'slug' => 'new-arrival'],
            ['name' => 'Best Seller', 'slug' => 'best-seller'],
            ['name' => 'Casual', 'slug' => 'casual'],
            ['name' => 'Formal', 'slug' => 'formal'],
            ['name' => 'Cotton', 'slug' => 'cotton'],
            ['name' => 'Premium', 'slug' => 'premium'],
            ['name' => 'Summer', 'slug' => 'summer'],
            ['name' => 'Winter', 'slug' => 'winter'],
        ];

        foreach ($tagRows as $row) {
            $tagsBySlug[$row['slug']] = Tag::updateOrCreate(
                ['slug' => $row['slug']],
                ['name' => $row['name']]
            );
        }

        $collectionsBySlug = [];
        $collectionRows = [
            [
                'name' => 'Summer Essentials',
                'slug' => 'summer-essentials',
                'description' => 'Lightweight breathable styles for everyday summer wear.',
                'is_active' => true,
                'sort_order' => 1,
                'starts_at' => Carbon::now()->startOfMonth()->toDateString(),
                'ends_at' => Carbon::now()->addMonths(2)->endOfMonth()->toDateString(),
            ],
            [
                'name' => 'Eid Edit',
                'slug' => 'eid-edit',
                'description' => 'Festive collection with polished and premium looks.',
                'is_active' => true,
                'sort_order' => 2,
                'starts_at' => Carbon::now()->toDateString(),
                'ends_at' => Carbon::now()->addMonth()->toDateString(),
            ],
            [
                'name' => 'Winter Drop',
                'slug' => 'winter-drop',
                'description' => 'Warm color tones and season-ready outfits.',
                'is_active' => true,
                'sort_order' => 3,
                'starts_at' => Carbon::now()->subDays(10)->toDateString(),
                'ends_at' => Carbon::now()->addMonths(4)->toDateString(),
            ],
            [
                'name' => 'Daily Basics',
                'slug' => 'daily-basics',
                'description' => 'Essential pieces you can style every day.',
                'is_active' => true,
                'sort_order' => 4,
                'starts_at' => null,
                'ends_at' => null,
            ],
        ];

        foreach ($collectionRows as $row) {
            $collectionsBySlug[$row['slug']] = Collection::updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'image' => $placeholderImage,
                    'starts_at' => $row['starts_at'],
                    'ends_at' => $row['ends_at'],
                    'is_active' => $row['is_active'],
                    'sort_order' => $row['sort_order'],
                ]
            );
        }

        $products = [
            [
                'name' => 'Classic Cotton Tee',
                'slug' => 'classic-cotton-tee',
                'category_slug' => 'men-tshirts',
                'description' => 'Soft cotton tee with clean fit and breathable fabric.',
                'price' => 1299,
                'original_price' => 1599,
                'badge' => 'Best Seller',
                'is_featured' => true,
                'is_active' => true,
                'sizes' => ['S' => 24, 'M' => 38, 'L' => 27, 'XL' => 15],
                'colors' => ['Black', 'White', 'Navy'],
                'details' => ['100% combed cotton', 'Regular fit', 'Machine washable'],
                'tags' => ['best-seller', 'casual', 'cotton', 'summer'],
                'collections' => ['summer-essentials', 'daily-basics'],
            ],
            [
                'name' => 'Oxford Smart Shirt',
                'slug' => 'oxford-smart-shirt',
                'category_slug' => 'men-shirts',
                'description' => 'Button-down shirt with a crisp smart-casual silhouette.',
                'price' => 2499,
                'original_price' => 2899,
                'badge' => 'Premium',
                'is_featured' => true,
                'is_active' => true,
                'sizes' => ['M' => 20, 'L' => 26, 'XL' => 18, 'XXL' => 10],
                'colors' => ['White', 'Sky Blue', 'Olive'],
                'details' => ['Wrinkle resistant finish', 'Button-down collar', 'Comfort stretch'],
                'tags' => ['formal', 'premium', 'new-arrival'],
                'collections' => ['eid-edit', 'daily-basics'],
            ],
            [
                'name' => 'Floral Midi Dress',
                'slug' => 'floral-midi-dress',
                'category_slug' => 'women-dresses',
                'description' => 'Flowy midi dress with floral pattern and soft lining.',
                'price' => 3199,
                'original_price' => 3699,
                'badge' => 'New',
                'is_featured' => true,
                'is_active' => true,
                'sizes' => ['S' => 14, 'M' => 22, 'L' => 16, 'XL' => 9],
                'colors' => ['Dusty Pink', 'Beige', 'Maroon'],
                'details' => ['Lightweight fabric', 'A-line shape', 'Hidden side zip'],
                'tags' => ['new-arrival', 'summer', 'premium'],
                'collections' => ['summer-essentials', 'eid-edit'],
            ],
            [
                'name' => 'Ribbed Everyday Top',
                'slug' => 'ribbed-everyday-top',
                'category_slug' => 'women-tops',
                'description' => 'Stretch ribbed top built for daily styling.',
                'price' => 1599,
                'original_price' => 1899,
                'badge' => null,
                'is_featured' => false,
                'is_active' => true,
                'sizes' => ['XS' => 8, 'S' => 18, 'M' => 24, 'L' => 17],
                'colors' => ['Black', 'White', 'Dusty Pink'],
                'details' => ['Body fit', 'Soft stretch blend', 'Everyday essential'],
                'tags' => ['casual', 'cotton'],
                'collections' => ['daily-basics'],
            ],
            [
                'name' => 'Boys Track Set',
                'slug' => 'boys-track-set',
                'category_slug' => 'kids-boys',
                'description' => 'Two-piece track set with durable stitching and comfort fit.',
                'price' => 2199,
                'original_price' => 2599,
                'badge' => 'Hot',
                'is_featured' => false,
                'is_active' => true,
                'sizes' => ['S' => 12, 'M' => 16, 'L' => 13],
                'colors' => ['Navy', 'Olive', 'Black'],
                'details' => ['Breathable knit', 'Elastic waistband', 'Sporty look'],
                'tags' => ['casual', 'summer'],
                'collections' => ['daily-basics', 'summer-essentials'],
            ],
            [
                'name' => 'Girls Party Frock',
                'slug' => 'girls-party-frock',
                'category_slug' => 'kids-girls',
                'description' => 'Elegant frock for special occasions with layered finish.',
                'price' => 2799,
                'original_price' => 3299,
                'badge' => 'Limited',
                'is_featured' => true,
                'is_active' => true,
                'sizes' => ['S' => 9, 'M' => 13, 'L' => 8],
                'colors' => ['Maroon', 'Dusty Pink', 'Beige'],
                'details' => ['Soft inner lining', 'Layered skirt', 'Occasion wear'],
                'tags' => ['new-arrival', 'premium'],
                'collections' => ['eid-edit'],
            ],
        ];

        foreach ($products as $row) {
            $product = Product::updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'price' => $row['price'],
                    'original_price' => $row['original_price'],
                    'category_id' => $categoriesBySlug[$row['category_slug']]->id,
                    'badge' => $row['badge'],
                    'is_featured' => $row['is_featured'],
                    'is_active' => $row['is_active'],
                ]
            );

            $product->images()->delete();
            $product->images()->create([
                'image_path' => $placeholderImage,
                'sort_order' => 0,
            ]);

            $product->sizeAttributes()->delete();
            foreach ($row['sizes'] as $sizeName => $stock) {
                $product->sizeAttributes()->create([
                    'size_id' => $sizesByName[$sizeName]->id,
                    'stock' => $stock,
                ]);
            }

            $product->colorAttributes()->delete();
            foreach ($row['colors'] as $colorName) {
                $product->colorAttributes()->create([
                    'color_id' => $colorsByName[$colorName]->id,
                ]);
            }

            $product->details()->delete();
            foreach ($row['details'] as $index => $detail) {
                $product->details()->create([
                    'detail' => $detail,
                    'sort_order' => $index,
                ]);
            }

            $tagIds = [];
            foreach ($row['tags'] as $tagSlug) {
                $tagIds[] = $tagsBySlug[$tagSlug]->id;
            }
            $product->tags()->sync($tagIds);

            $collectionSync = [];
            foreach ($row['collections'] as $index => $collectionSlug) {
                $collectionSync[$collectionsBySlug[$collectionSlug]->id] = ['sort_order' => $index + 1];
            }
            $product->collections()->sync($collectionSync);
        }

        // Some projects in this codebase use different size_guides schemas.
        // To keep this seeder portable and reliable, we skip size guide data here.
        if (Schema::hasTable('size_guides')) {
            $this->command?->warn('ProductCatalogSeeder: size guide rows skipped due schema variations.');
        }
    }
}
