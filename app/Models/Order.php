<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'address_id',
        'coupon_id',
        'status',
        'subtotal',
        'shipping_cost',
        'discount_amount',
        'total',
        'payment_method',
        'notes',
        'gift_card_id',
        'gift_card_amount',
        'shipping_name',
        'shipping_street',
        'shipping_city',
        'shipping_zip',
        'shipping_phone',
        'shipping_email',
        'loyalty_points_used',
        'loyalty_discount',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'total' => 'decimal:2',
            'loyalty_discount' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->latest();
    }

    public function paymentTransactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    public function tracking(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(OrderTracking::class);
    }

    public function loyaltyTransactions(): HasMany
    {
        return $this->hasMany(LoyaltyTransaction::class);
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(Referral::class);
    }

    public function riderOrder(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(RiderOrder::class);
    }

    public function walletTransactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function affiliateConversion(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(AffiliateConversion::class);
    }

    public function giftCardTransactions(): HasMany
    {
        return $this->hasMany(GiftCardTransaction::class);
    }

    public function refundBankDetail(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(RefundBankDetail::class);
    }

    public function giftCard(): BelongsTo
    {
        return $this->belongsTo(GiftCard::class);
    }

    public function returns(): HasMany
    {
        return $this->hasMany(ProductReturn::class);
    }

    public function invoice(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    public function couponUsage(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(CouponUsage::class);
    }

    public function complaints(): HasMany
    {
        return $this->hasMany(Complaint::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(StockReservation::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(RiderLocation::class);
    }

    public function codCollections(): HasMany
    {
        return $this->hasMany(CodCollection::class);
    }
}
