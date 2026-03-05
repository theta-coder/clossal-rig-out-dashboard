<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'original_price',
        'category_id',
        'badge',
        'is_featured',
        'is_active',
        'total_sold',
        'total_views',
        'average_rating',
        'review_count',
        'published_at',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_image',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'original_price' => 'decimal:2',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'average_rating' => 'decimal:2',
            'published_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function sizes(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Size::class , 'product_sizes')->withPivot('stock');
    }

    public function colors(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Color::class , 'product_colors');
    }

    public function sizeAttributes(): HasMany
    {
        return $this->hasMany(ProductSize::class);
    }

    public function colorAttributes(): HasMany
    {
        return $this->hasMany(ProductColor::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(ProductDetail::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function stockLogs(): HasMany
    {
        return $this->hasMany(StockLog::class);
    }

    public function lowStockAlerts(): HasMany
    {
        return $this->hasMany(LowStockAlert::class);
    }

    public function views(): HasMany
    {
        return $this->hasMany(ProductView::class);
    }

    public function flashSaleProducts(): HasMany
    {
        return $this->hasMany(FlashSaleProduct::class);
    }

    public function flashSales(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(FlashSale::class , 'flash_sale_products')
            ->withPivot('sale_price', 'max_quantity', 'sold_count')
            ->withTimestamps();
    }

    public function wishlistItems(): HasMany
    {
        return $this->hasMany(WishlistItem::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(ProductQuestion::class);
    }

    public function bundleItems(): HasMany
    {
        return $this->hasMany(BundleItem::class);
    }

    public function tags(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Tag::class , 'product_tags');
    }

    public function collections(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Collection::class , 'collection_product')
            ->withPivot('sort_order')
            ->withTimestamps();
    }

    public function variantImages(): HasMany
    {
        return $this->hasMany(ProductVariantImage::class);
    }

    public function comparisons(): HasMany
    {
        return $this->hasMany(ProductComparison::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(StockReservation::class);
    }

    public function backInStockAlerts(): HasMany
    {
        return $this->hasMany(BackInStockAlert::class);
    }
}
