<?php

namespace App\Models\UserManagement;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use Spatie\Permission\Traits\HasRoles;

// Import related models to fix "Class App\Models\UserManagement\X not found" errors
use App\Models\Order;
use App\Models\Cart;
use App\Models\Favorite;
use App\Models\Review;
use App\Models\PaymentTransaction;
use App\Models\LoyaltyPoint;
use App\Models\LoyaltyTransaction;
use App\Models\Referral;
use App\Models\Notification;
use App\Models\EmailLog;
use App\Models\ProductView;
use App\Models\Wishlist;
use App\Models\Rider;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\ProductQuestion;
use App\Models\ProductAnswer;
use App\Models\UserSubscription;
use App\Models\SavedReport;
use App\Models\SearchLog;
use App\Models\Affiliate;
use App\Models\GiftCard;
use App\Models\ProductReturn;
use App\Models\Invoice;
use App\Models\CouponUsage;
use App\Models\SmsLog;
use App\Models\Complaint;
use App\Models\NewsletterCampaign;
use App\Models\BackInStockAlert;
use App\Models\CodCollection;
use App\Models\AdminAuditLog;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'phone_verified_at',
        'role',
        'is_blocked',
        'referral_code',
        'total_orders',
        'total_spent',
        'gender',
        'date_of_birth',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_blocked' => 'boolean',
            'total_spent' => 'decimal:2',
            'date_of_birth' => 'date',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin') || $this->role === 'admin';
    }

    public function hasDashboardAccess(): bool
    {
        if ($this->isAdmin()) {
            return true;
        }

        try {
            if ($this->hasPermissionTo('dashboard_access')) {
                return true;
            }
        }
        catch (\Exception $e) {
        }

        // Allow if they have any Spatie role that isn't 'customer'
        if ($this->roles()->where('name', '!=', 'customer')->exists()) {
            return true;
        }

        // Allow if their legacy string role is something other than 'customer'
        return $this->role !== 'customer' && $this->role !== null;
    }



    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function cart(): HasOne
    {
        return $this->hasOne(Cart::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function customerNotes(): HasMany
    {
        return $this->hasMany(CustomerNote::class);
    }

    public function customerTags(): HasMany
    {
        return $this->hasMany(CustomerTag::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(UserActivityLog::class);
    }

    public function paymentTransactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    public function loyaltyPoints(): HasOne
    {
        return $this->hasOne(LoyaltyPoint::class);
    }

    public function loyaltyTransactions(): HasMany
    {
        return $this->hasMany(LoyaltyTransaction::class);
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(Referral::class , 'referrer_id');
    }

    public function receivedReferrals(): HasMany
    {
        return $this->hasMany(Referral::class , 'referred_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function emailLogs(): HasMany
    {
        return $this->hasMany(EmailLog::class);
    }

    public function productViews(): HasMany
    {
        return $this->hasMany(ProductView::class);
    }

    public function wishlist(): HasOne
    {
        return $this->hasOne(Wishlist::class);
    }

    public function rider(): HasOne
    {
        return $this->hasOne(Rider::class);
    }

    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class);
    }

    public function walletTransactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function productQuestions(): HasMany
    {
        return $this->hasMany(ProductQuestion::class);
    }

    public function productAnswers(): HasMany
    {
        return $this->hasMany(ProductAnswer::class);
    }

    public function socialLogins(): HasMany
    {
        return $this->hasMany(SocialLogin::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(UserSubscription::class);
    }

    public function savedReports(): HasMany
    {
        return $this->hasMany(SavedReport::class , 'admin_id');
    }

    public function adminAuditLogs(): HasMany
    {
        return $this->hasMany(AdminAuditLog::class);
    }

    public function searchLogs(): HasMany
    {
        return $this->hasMany(SearchLog::class);
    }

    public function affiliate(): HasOne
    {
        return $this->hasOne(Affiliate::class);
    }

    public function giftCards(): HasMany
    {
        return $this->hasMany(GiftCard::class);
    }

    public function notificationPreference(): HasOne
    {
        return $this->hasOne(NotificationPreference::class);
    }

    public function returns(): HasMany
    {
        return $this->hasMany(ProductReturn::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function couponUsages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    public function otpVerifications(): HasMany
    {
        return $this->hasMany(OtpVerification::class);
    }

    public function smsLogs(): HasMany
    {
        return $this->hasMany(SmsLog::class);
    }

    public function complaints(): HasMany
    {
        return $this->hasMany(Complaint::class);
    }

    public function assignedComplaints(): HasMany
    {
        return $this->hasMany(Complaint::class , 'assigned_to');
    }

    public function deviceTokens(): HasMany
    {
        return $this->hasMany(DeviceToken::class);
    }

    public function newsletterCampaigns(): HasMany
    {
        return $this->hasMany(NewsletterCampaign::class , 'created_by');
    }

    public function backInStockAlerts(): HasMany
    {
        return $this->hasMany(BackInStockAlert::class);
    }

    public function verifiedCodCollections(): HasMany
    {
        return $this->hasMany(CodCollection::class , 'verified_by');
    }

    public function blacklistActions(): HasMany
    {
        return $this->hasMany(Blacklist::class , 'blacklisted_by');
    }

    public function termsAcceptances(): HasMany
    {
        return $this->hasMany(TermsAcceptance::class);
    }
}
