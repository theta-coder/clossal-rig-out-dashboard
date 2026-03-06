<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductCatalog\CategoryController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\CourierCompanyController;
use App\Http\Controllers\CurrencyRateController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmailLogController;
use App\Http\Controllers\EmailTemplateController;
use App\Http\Controllers\MarketingTools\AnnouncementManagementController;
use App\Http\Controllers\MarketingTools\BundleItemManagementController;
use App\Http\Controllers\MarketingTools\CouponManagementController;
use App\Http\Controllers\MarketingTools\CouponUsageManagementController;
use App\Http\Controllers\MarketingTools\FlashSaleManagementController;
use App\Http\Controllers\MarketingTools\FlashSaleProductManagementController;
use App\Http\Controllers\MarketingTools\NewsletterCampaignManagementController;
use App\Http\Controllers\MarketingTools\NewsletterSubscriberManagementController;
use App\Http\Controllers\MarketingTools\ProductBundleManagementController;
use App\Http\Controllers\MarketingTools\PromotionalBannerManagementController;
use App\Http\Controllers\MarketingTools\QuantityDiscountManagementController;
use App\Http\Controllers\NewsletterSubscriberController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderManagement\CodCollectionManagementController;
use App\Http\Controllers\OrderManagement\InvoiceManagementController;
use App\Http\Controllers\OrderManagement\OrderItemManagementController;
use App\Http\Controllers\OrderManagement\OrderStatusHistoryManagementController;
use App\Http\Controllers\OrderManagement\OrderTrackingManagementController;
use App\Http\Controllers\OrderManagement\PaymentTransactionManagementController;
use App\Http\Controllers\OrderManagement\ProductReturnManagementController;
use App\Http\Controllers\OrderManagement\RefundBankDetailManagementController;
use App\Http\Controllers\OrderManagement\ReturnItemManagementController;
use App\Http\Controllers\ProductCatalog\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShoppingExperienceController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserManagement\UserController;
use App\Http\Controllers\UserManagement\AddressController;
use App\Http\Controllers\UserManagement\BlacklistController;
use App\Http\Controllers\ProductCatalog\SizeController;
use App\Http\Controllers\ProductCatalog\ColorController;
use App\Http\Controllers\UserManagement\RoleController;
use App\Http\Controllers\UserManagement\SocialLoginController;
use App\Http\Controllers\UserManagement\OtpVerificationController;
use App\Http\Controllers\UserManagement\TermsAcceptanceController;
use App\Http\Controllers\UserManagement\DeviceTokenController;
use App\Http\Controllers\UserManagement\UserActivityLogController;
use App\Http\Controllers\AbandonedCartController;
use App\Http\Controllers\ActivityReportController;
use App\Http\Controllers\StockLogController;
use App\Http\Controllers\StockReservationController;
use App\Http\Controllers\LowStockAlertController;
use App\Http\Controllers\BackInStockAlertController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\Analytics\AnalyticsController;
use App\Http\Controllers\Content\BlogController;
use App\Http\Controllers\Content\FaqManagementController;
use App\Http\Controllers\Marketing\CampaignController;
use App\Http\Controllers\Inventory\StockLogController as InventoryStockLogController;
use App\Http\Controllers\Affiliate\AffiliateManagementController;
use App\Http\Controllers\UserManagement\CustomerSegmentController;
use App\Http\Controllers\System\LogHistoryController;
use App\Http\Controllers\Logistics\RiderManagementController;
use App\Http\Controllers\Logistics\ShippingManagementController;
use App\Http\Controllers\Loyalty\LoyaltyManagementController;
use App\Http\Controllers\Loyalty\GiftCardManagementController;
use App\Http\Controllers\Shopping\ShoppingExperienceManagementController;
use App\Http\Controllers\System\TaxRateController;
use App\Http\Controllers\System\StoreBankAccountController;
use App\Http\Controllers\System\SmsTemplateController;
use App\Http\Controllers\System\SystemSettingController;
use App\Http\Controllers\System\SubscriptionController;
use App\Http\Controllers\Analytics\SavedReportController;
use App\Http\Controllers\OrderManagement\PaymentFailureManagementController;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::get('/', function () {
    return redirect()->route('login');
});
Route::get('/login', [AuthController::class , 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class , 'login']);
Route::post('/logout', [AuthController::class , 'logout'])->name('logout');

Route::get('/forgot-password', [AuthController::class , 'showForgotPasswordForm'])->name('password.request');
Route::post('/forgot-password', [AuthController::class , 'processForgotPassword'])->name('password.email');


// Protected Dashboard Routes
Route::middleware(['auth', 'admin'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class , 'index'])->name('dashboard');

    // Resource Routes
    Route::get('categories/dropdown', [CategoryController::class , 'dropdown'])->name('categories.dropdown');
    Route::get('categories/summary', [CategoryController::class , 'summary'])->name('categories.summary');
    Route::post('categories/{category}/activate', [CategoryController::class , 'activate'])->name('categories.activate');
    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::get('products/dropdown', [ProductController::class , 'dropdown'])->name('products.dropdown');
    Route::get('products/summary', [ProductController::class , 'summary'])->name('products.summary');
    Route::post('products/{product}/activate', [ProductController::class , 'activate'])->name('products.activate');
    Route::resource('products', ProductController::class);
    Route::resource('products.variants', \App\Http\Controllers\ProductCatalog\ProductVariantController::class)->except(['create', 'edit', 'show']);
    Route::post('products/{product}/variants/{variant}/toggle-active', [\App\Http\Controllers\ProductCatalog\ProductVariantController::class , 'toggleActive'])->name('products.variants.toggle-active');
    Route::delete('products/{product}/variants/{variant}/images/{image}', [\App\Http\Controllers\ProductCatalog\ProductVariantController::class , 'destroyImage'])->name('products.variants.images.destroy');
    Route::resource('orders', OrderController::class)->only(['index', 'show', 'update', 'destroy']);

    // Marketing & Sales Tools (separate controllers)
    Route::prefix('marketing-tools')->name('marketing-tools.')->group(function () {
            Route::get('coupons', [CouponManagementController::class , 'index'])->name('coupons.index');
            Route::post('coupons', [CouponManagementController::class , 'store'])->name('coupons.store');
            Route::put('coupons/{id}', [CouponManagementController::class , 'update'])->name('coupons.update');
            Route::delete('coupons/{id}', [CouponManagementController::class , 'destroy'])->name('coupons.destroy');

            Route::get('coupon-usages', [CouponUsageManagementController::class , 'index'])->name('coupon-usages.index');
            Route::post('coupon-usages', [CouponUsageManagementController::class , 'store'])->name('coupon-usages.store');
            Route::put('coupon-usages/{id}', [CouponUsageManagementController::class , 'update'])->name('coupon-usages.update');
            Route::delete('coupon-usages/{id}', [CouponUsageManagementController::class , 'destroy'])->name('coupon-usages.destroy');

            Route::get('flash-sales', [FlashSaleManagementController::class , 'index'])->name('flash-sales.index');
            Route::post('flash-sales', [FlashSaleManagementController::class , 'store'])->name('flash-sales.store');
            Route::put('flash-sales/{id}', [FlashSaleManagementController::class , 'update'])->name('flash-sales.update');
            Route::delete('flash-sales/{id}', [FlashSaleManagementController::class , 'destroy'])->name('flash-sales.destroy');

            Route::get('flash-sale-products', [FlashSaleProductManagementController::class , 'index'])->name('flash-sale-products.index');
            Route::post('flash-sale-products', [FlashSaleProductManagementController::class , 'store'])->name('flash-sale-products.store');
            Route::put('flash-sale-products/{id}', [FlashSaleProductManagementController::class , 'update'])->name('flash-sale-products.update');
            Route::delete('flash-sale-products/{id}', [FlashSaleProductManagementController::class , 'destroy'])->name('flash-sale-products.destroy');

            Route::get('quantity-discounts', [QuantityDiscountManagementController::class , 'index'])->name('quantity-discounts.index');
            Route::post('quantity-discounts', [QuantityDiscountManagementController::class , 'store'])->name('quantity-discounts.store');
            Route::put('quantity-discounts/{id}', [QuantityDiscountManagementController::class , 'update'])->name('quantity-discounts.update');
            Route::delete('quantity-discounts/{id}', [QuantityDiscountManagementController::class , 'destroy'])->name('quantity-discounts.destroy');

            Route::get('product-bundles', [ProductBundleManagementController::class , 'index'])->name('product-bundles.index');
            Route::post('product-bundles', [ProductBundleManagementController::class , 'store'])->name('product-bundles.store');
            Route::put('product-bundles/{id}', [ProductBundleManagementController::class , 'update'])->name('product-bundles.update');
            Route::delete('product-bundles/{id}', [ProductBundleManagementController::class , 'destroy'])->name('product-bundles.destroy');

            Route::get('bundle-items', [BundleItemManagementController::class , 'index'])->name('bundle-items.index');
            Route::post('bundle-items', [BundleItemManagementController::class , 'store'])->name('bundle-items.store');
            Route::put('bundle-items/{id}', [BundleItemManagementController::class , 'update'])->name('bundle-items.update');
            Route::delete('bundle-items/{id}', [BundleItemManagementController::class , 'destroy'])->name('bundle-items.destroy');

            Route::get('promotional-banners', [PromotionalBannerManagementController::class , 'index'])->name('promotional-banners.index');
            Route::post('promotional-banners', [PromotionalBannerManagementController::class , 'store'])->name('promotional-banners.store');
            Route::put('promotional-banners/{id}', [PromotionalBannerManagementController::class , 'update'])->name('promotional-banners.update');
            Route::delete('promotional-banners/{id}', [PromotionalBannerManagementController::class , 'destroy'])->name('promotional-banners.destroy');

            Route::get('announcements', [AnnouncementManagementController::class , 'index'])->name('announcements.index');
            Route::post('announcements', [AnnouncementManagementController::class , 'store'])->name('announcements.store');
            Route::put('announcements/{id}', [AnnouncementManagementController::class , 'update'])->name('announcements.update');
            Route::delete('announcements/{id}', [AnnouncementManagementController::class , 'destroy'])->name('announcements.destroy');

            Route::get('newsletter-subscribers', [NewsletterSubscriberManagementController::class , 'index'])->name('newsletter-subscribers.index');
            Route::post('newsletter-subscribers', [NewsletterSubscriberManagementController::class , 'store'])->name('newsletter-subscribers.store');
            Route::put('newsletter-subscribers/{id}', [NewsletterSubscriberManagementController::class , 'update'])->name('newsletter-subscribers.update');
            Route::delete('newsletter-subscribers/{id}', [NewsletterSubscriberManagementController::class , 'destroy'])->name('newsletter-subscribers.destroy');

            Route::get('newsletter-campaigns', [NewsletterCampaignManagementController::class , 'index'])->name('newsletter-campaigns.index');
            Route::post('newsletter-campaigns', [NewsletterCampaignManagementController::class , 'store'])->name('newsletter-campaigns.store');
            Route::put('newsletter-campaigns/{id}', [NewsletterCampaignManagementController::class , 'update'])->name('newsletter-campaigns.update');
            Route::delete('newsletter-campaigns/{id}', [NewsletterCampaignManagementController::class , 'destroy'])->name('newsletter-campaigns.destroy');
        }
        );

        // Order & Transaction Management (separate controllers)
        Route::prefix('order-management')->name('order-management.')->group(function () {
            Route::get('order-items', [OrderItemManagementController::class , 'index'])->name('order-items.index');
            Route::post('order-items', [OrderItemManagementController::class , 'store'])->name('order-items.store');
            Route::put('order-items/{id}', [OrderItemManagementController::class , 'update'])->name('order-items.update');
            Route::delete('order-items/{id}', [OrderItemManagementController::class , 'destroy'])->name('order-items.destroy');

            Route::get('order-status-histories', [OrderStatusHistoryManagementController::class , 'index'])->name('order-status-histories.index');
            Route::post('order-status-histories', [OrderStatusHistoryManagementController::class , 'store'])->name('order-status-histories.store');
            Route::put('order-status-histories/{id}', [OrderStatusHistoryManagementController::class , 'update'])->name('order-status-histories.update');
            Route::delete('order-status-histories/{id}', [OrderStatusHistoryManagementController::class , 'destroy'])->name('order-status-histories.destroy');

            Route::get('order-tracking', [OrderTrackingManagementController::class , 'index'])->name('order-tracking.index');
            Route::post('order-tracking', [OrderTrackingManagementController::class , 'store'])->name('order-tracking.store');
            Route::put('order-tracking/{id}', [OrderTrackingManagementController::class , 'update'])->name('order-tracking.update');
            Route::delete('order-tracking/{id}', [OrderTrackingManagementController::class , 'destroy'])->name('order-tracking.destroy');

            Route::get('invoices', [InvoiceManagementController::class , 'index'])->name('invoices.index');
            Route::post('invoices', [InvoiceManagementController::class , 'store'])->name('invoices.store');
            Route::put('invoices/{id}', [InvoiceManagementController::class , 'update'])->name('invoices.update');
            Route::delete('invoices/{id}', [InvoiceManagementController::class , 'destroy'])->name('invoices.destroy');

            Route::get('payment-transactions', [PaymentTransactionManagementController::class , 'index'])->name('payment-transactions.index');
            Route::post('payment-transactions', [PaymentTransactionManagementController::class , 'store'])->name('payment-transactions.store');
            Route::put('payment-transactions/{id}', [PaymentTransactionManagementController::class , 'update'])->name('payment-transactions.update');
            Route::delete('payment-transactions/{id}', [PaymentTransactionManagementController::class , 'destroy'])->name('payment-transactions.destroy');

            Route::get('product-returns', [ProductReturnManagementController::class , 'index'])->name('product-returns.index');
            Route::post('product-returns', [ProductReturnManagementController::class , 'store'])->name('product-returns.store');
            Route::put('product-returns/{id}', [ProductReturnManagementController::class , 'update'])->name('product-returns.update');
            Route::delete('product-returns/{id}', [ProductReturnManagementController::class , 'destroy'])->name('product-returns.destroy');

            Route::get('return-items', [ReturnItemManagementController::class , 'index'])->name('return-items.index');
            Route::post('return-items', [ReturnItemManagementController::class , 'store'])->name('return-items.store');
            Route::put('return-items/{id}', [ReturnItemManagementController::class , 'update'])->name('return-items.update');
            Route::delete('return-items/{id}', [ReturnItemManagementController::class , 'destroy'])->name('return-items.destroy');

            Route::get('refund-bank-details', [RefundBankDetailManagementController::class , 'index'])->name('refund-bank-details.index');
            Route::post('refund-bank-details', [RefundBankDetailManagementController::class , 'store'])->name('refund-bank-details.store');
            Route::put('refund-bank-details/{id}', [RefundBankDetailManagementController::class , 'update'])->name('refund-bank-details.update');
            Route::delete('refund-bank-details/{id}', [RefundBankDetailManagementController::class , 'destroy'])->name('refund-bank-details.destroy');

            Route::get('cod-collections', [CodCollectionManagementController::class , 'index'])->name('cod-collections.index');
            Route::post('cod-collections', [CodCollectionManagementController::class , 'store'])->name('cod-collections.store');
            Route::put('cod-collections/{id}', [CodCollectionManagementController::class , 'update'])->name('cod-collections.update');
            Route::delete('cod-collections/{id}', [CodCollectionManagementController::class , 'destroy'])->name('cod-collections.destroy');
        }
        );

        // Users Management
        Route::get('users/dropdown', [UserController::class , 'dropdown'])->name('users.dropdown');
        Route::get('users/summary', [UserController::class , 'summary'])->name('users.summary');
        Route::post('users/{user}/toggle-block', [UserController::class , 'toggleBlock'])->name('users.toggle-block');
        Route::delete('users/{user}/device-tokens/{deviceToken}', [UserController::class , 'removeDeviceToken'])->name('users.remove-device-token');
        Route::resource('users', UserController::class);

        // Addresses
        Route::get('addresses/summary', [AddressController::class , 'summary'])->name('addresses.summary');
        Route::post('addresses/{address}/set-default', [AddressController::class , 'setDefault'])->name('addresses.set-default');
        Route::resource('addresses', AddressController::class);

        // Blacklist
        Route::get('blacklist/summary', [BlacklistController::class , 'summary'])->name('blacklist.summary');
        Route::post('blacklist/{blacklist}/toggle-active', [BlacklistController::class , 'toggleActive'])->name('blacklist.toggle-active');
        Route::resource('blacklist', BlacklistController::class)->except(['show', 'create', 'edit']);
        Route::resource('reviews', ReviewController::class)->only(['index', 'show', 'update', 'destroy']);
        Route::resource('coupons', CouponController::class)->except(['show']);
        Route::resource('sizes', SizeController::class)->except(['show', 'create', 'edit']);
        Route::resource('tags', \App\Http\Controllers\ProductCatalog\TagController::class)->except(['show', 'create', 'edit']);
        Route::resource('collections', \App\Http\Controllers\ProductCatalog\CollectionController::class)->except(['show']);
        Route::resource('size-guides', \App\Http\Controllers\ProductCatalog\SizeGuideController::class)->except(['show']);
        Route::resource('colors', ColorController::class)->except(['show', 'create', 'edit']);

        // Subscribers
        Route::get('subscribers', [NewsletterSubscriberController::class , 'index'])->name('subscribers.index');
        Route::put('subscribers/{subscriber}', [NewsletterSubscriberController::class , 'update'])->name('subscribers.update');
        Route::delete('subscribers/{subscriber}', [NewsletterSubscriberController::class , 'destroy'])->name('subscribers.destroy');

        // Messages
        Route::get('messages', [ContactMessageController::class , 'index'])->name('messages.index');
        Route::get('messages/{message}', [ContactMessageController::class , 'show'])->name('messages.show');
        Route::delete('messages/{message}', [ContactMessageController::class , 'destroy'])->name('messages.destroy');

        // Social Logins (read-only + delete)
        Route::resource('social-logins', SocialLoginController::class)->only(['index', 'show', 'destroy']);

        // OTP Verifications (read-only log)
        Route::resource('otp-verifications', OtpVerificationController::class)->only(['index', 'show']);

        // Terms Acceptances (read-only log)
        Route::resource('terms-acceptances', TermsAcceptanceController::class)->only(['index', 'show']);

        // Device Tokens
        Route::post('device-tokens/{deviceToken}/toggle', [DeviceTokenController::class , 'update'])->name('device-tokens.toggle');
        Route::resource('device-tokens', DeviceTokenController::class)->only(['index', 'show', 'destroy']);

        // User Activity Logs (read-only)
        Route::resource('user-activity-logs', UserActivityLogController::class)->only(['index', 'show']);

        // Roles & Permissions
        Route::resource('roles', RoleController::class)->except(['show', 'create', 'edit']);

        // Announcements
        Route::resource('announcements', \App\Http\Controllers\AnnouncementController::class)->except(['show', 'create', 'edit']);
        Route::put('announcements/{announcement}/toggle', [\App\Http\Controllers\AnnouncementController::class , 'toggle'])->name('announcements.toggle');

        // Settings
        Route::get('settings', [SettingController::class , 'index'])->name('settings.index');
        Route::put('settings', [SettingController::class , 'update'])->name('settings.update');

        // Reports & Shopping Insights
        Route::get('reports/abandoned-carts', [AbandonedCartController::class , 'index'])->name('reports.abandoned-carts');
        Route::get('reports/abandoned-carts/{id}', [AbandonedCartController::class , 'show'])->name('reports.abandoned-carts.show');
        Route::delete('reports/abandoned-carts/{id}', [AbandonedCartController::class , 'destroy'])->name('reports.abandoned-carts.destroy');

        Route::get('reports/activity', [ActivityReportController::class , 'index'])->name('reports.activity');
        Route::get('reports/activity/search', [ActivityReportController::class , 'searchLogs'])->name('reports.activity.search');
        Route::get('reports/activity/views', [ActivityReportController::class , 'viewLogs'])->name('reports.activity.views');
        Route::post('reports/activity/clean', [ActivityReportController::class , 'clean'])->name('reports.activity.clean');

        // Inventory
        Route::resource('stock-logs', StockLogController::class)->only(['index', 'show']);
        Route::resource('stock-reservations', StockReservationController::class)->only(['index', 'show', 'destroy']);
        Route::resource('low-stock-alerts', LowStockAlertController::class)->except(['show']);
        Route::resource('back-in-stock-alerts', BackInStockAlertController::class)->only(['index', 'show', 'update', 'destroy']);
        Route::resource('courier-companies', CourierCompanyController::class)->except(['show']);
        Route::resource('currency-rates', CurrencyRateController::class)->except(['show']);
        Route::resource('email-logs', EmailLogController::class)->except(['show']);
        Route::resource('email-templates', EmailTemplateController::class)->except(['show']);

        // Shopping Experience CRUD
        Route::get('shopping-experience', [ShoppingExperienceController::class , 'index'])->name('shopping-experience.index');
        Route::post('shopping-experience/{resource}', [ShoppingExperienceController::class , 'store'])->name('shopping-experience.store');
        Route::put('shopping-experience/{resource}/{id}', [ShoppingExperienceController::class , 'update'])->name('shopping-experience.update');
        Route::delete('shopping-experience/{resource}/{id}', [ShoppingExperienceController::class , 'destroy'])->name('shopping-experience.destroy');

        // Complaint Center CRUD
        Route::get('complaints', [ComplaintController::class , 'index'])->name('complaints.index');
        Route::post('complaints/{resource}', [ComplaintController::class , 'store'])->name('complaints.store');
        Route::put('complaints/{resource}/{id}', [ComplaintController::class , 'update'])->name('complaints.update');
        Route::delete('complaints/{resource}/{id}', [ComplaintController::class , 'destroy'])->name('complaints.destroy');

        // New Dashboard Routes
        Route::prefix('dashboard')->name('dashboard.')->group(function () {
            // Analytics
            Route::get('analytics', [AnalyticsController::class , 'index'])->name('analytics.index');
            Route::get('analytics/funnel', [AnalyticsController::class , 'funnel'])->name('analytics.funnel');
            Route::get('analytics/traffic', [AnalyticsController::class , 'traffic'])->name('analytics.traffic');

            // Content
            Route::resource('blog', BlogController::class);
            Route::get('faqs', [FaqManagementController::class , 'index'])->name('faqs.index');
            Route::post('faqs/category', [FaqManagementController::class , 'storeCategory'])->name('faqs.category.store');
            Route::post('faqs/item', [FaqManagementController::class , 'storeFaq'])->name('faqs.item.store');
            Route::put('faqs/item/{faq}', [FaqManagementController::class , 'update'])->name('faqs.item.update');
            Route::delete('faqs/item/{faq}', [FaqManagementController::class , 'destroy'])->name('faqs.item.destroy');

            // Marketing
            Route::get('campaigns', [CampaignController::class , 'index'])->name('campaigns.index');
            Route::post('campaigns', [CampaignController::class , 'store'])->name('campaigns.store');
            Route::get('campaigns/{campaign}', [CampaignController::class , 'show'])->name('campaigns.show');
            Route::put('campaigns/{campaign}', [CampaignController::class , 'update'])->name('campaigns.update');
            Route::delete('campaigns/{campaign}', [CampaignController::class , 'destroy'])->name('campaigns.destroy');

            // Logistics
            Route::get('riders', [RiderManagementController::class , 'index'])->name('riders.index');
            Route::post('riders', [RiderManagementController::class , 'store'])->name('riders.store');
            Route::put('riders/{rider}', [RiderManagementController::class , 'update'])->name('riders.update');
            Route::delete('riders/{rider}', [RiderManagementController::class , 'destroy'])->name('riders.destroy');
            Route::get('riders/orders', [RiderManagementController::class , 'orders'])->name('riders.orders');
            Route::get('riders/locations', [RiderManagementController::class , 'locations'])->name('riders.locations');
            Route::get('shipping/zones', [ShippingManagementController::class , 'zones'])->name('shipping.zones');
            Route::post('shipping/zones', [ShippingManagementController::class , 'storeZone'])->name('shipping.zones.store');
            Route::put('shipping/zones/{shippingZone}', [ShippingManagementController::class , 'updateZone'])->name('shipping.zones.update');
            Route::delete('shipping/zones/{shippingZone}', [ShippingManagementController::class , 'destroyZone'])->name('shipping.zones.destroy');
            Route::get('shipping/rates', [ShippingManagementController::class , 'rates'])->name('shipping.rates');

            // Loyalty
            Route::get('loyalty/points', [LoyaltyManagementController::class , 'points'])->name('loyalty.points');
            Route::get('loyalty/wallets', [LoyaltyManagementController::class , 'wallets'])->name('loyalty.wallets');
            Route::get('loyalty/cards', [LoyaltyManagementController::class , 'cards'])->name('loyalty.cards');
            Route::post('loyalty/cards', [LoyaltyManagementController::class , 'storeCard'])->name('loyalty.cards.store');

            // Affiliate
            Route::get('affiliates', [AffiliateManagementController::class , 'index'])->name('affiliates.index');
            Route::post('affiliates', [AffiliateManagementController::class , 'store'])->name('affiliates.store');
            Route::get('affiliates/clicks', [AffiliateManagementController::class , 'clicks'])->name('affiliates.clicks');
            Route::get('affiliates/conversions', [AffiliateManagementController::class , 'conversions'])->name('affiliates.conversions');
            Route::get('affiliates/{affiliate}', [AffiliateManagementController::class , 'show'])->name('affiliates.show');
            Route::put('affiliates/{affiliate}', [AffiliateManagementController::class , 'update'])->name('affiliates.update');
            Route::delete('affiliates/{affiliate}', [AffiliateManagementController::class , 'destroy'])->name('affiliates.destroy');
            Route::post('affiliates/{affiliate}/approve', [AffiliateManagementController::class , 'approve'])->name('affiliates.approve');

            // Advanced User Management
            Route::get('customer-segments', [CustomerSegmentController::class , 'index'])->name('customer-segments.index');
            Route::post('customer-segments', [CustomerSegmentController::class , 'store'])->name('customer-segments.store');
            Route::put('customer-segments/{segment}', [CustomerSegmentController::class , 'update'])->name('customer-segments.update');
            Route::delete('customer-segments/{segment}', [CustomerSegmentController::class , 'destroy'])->name('customer-segments.destroy');
            Route::get('customers/{user}/notes', [CustomerSegmentController::class , 'notes'])->name('customers.notes');

            // Inventory Stock Logs (Specific)
            Route::get('inventory/stock-logs', [InventoryStockLogController::class , 'index'])->name('inventory.stock-logs');
            Route::get('inventory/reservations', [InventoryStockLogController::class , 'reservations'])->name('inventory.reservations');

            // System History
            Route::get('logs/emails', [LogHistoryController::class , 'emailLogs'])->name('logs.emails');
            Route::get('logs/sms', [LogHistoryController::class , 'smsLogs'])->name('logs.sms');
            Route::get('logs/audit', [LogHistoryController::class , 'auditLogs'])->name('logs.audit');

            // Shopping Experience MGMT
            Route::get('shopping/carts', [ShoppingExperienceManagementController::class , 'carts'])->name('shopping.carts');
            Route::get('shopping/wishlists', [ShoppingExperienceManagementController::class , 'wishlists'])->name('shopping.wishlists');

            // Gift Card Transactions & Redemptions
            Route::get('loyalty/gift-card-transactions', [GiftCardManagementController::class , 'transactions'])->name('loyalty.gift-card-transactions');
            Route::post('loyalty/gift-card-transactions', [GiftCardManagementController::class , 'storeTransaction'])->name('loyalty.gift-card-transactions.store');
            Route::delete('loyalty/gift-card-transactions/{id}', [GiftCardManagementController::class , 'destroyTransaction'])->name('loyalty.gift-card-transactions.destroy');
            Route::get('loyalty/gift-card-redemptions', [GiftCardManagementController::class , 'redemptions'])->name('loyalty.gift-card-redemptions');
            Route::delete('loyalty/gift-card-redemptions/{id}', [GiftCardManagementController::class , 'destroyRedemption'])->name('loyalty.gift-card-redemptions.destroy');

            // Saved Reports
            Route::get('analytics/saved-reports', [SavedReportController::class , 'index'])->name('analytics.saved-reports.index');
            Route::post('analytics/saved-reports', [SavedReportController::class , 'store'])->name('analytics.saved-reports.store');
            Route::put('analytics/saved-reports/{savedReport}', [SavedReportController::class , 'update'])->name('analytics.saved-reports.update');
            Route::delete('analytics/saved-reports/{savedReport}', [SavedReportController::class , 'destroy'])->name('analytics.saved-reports.destroy');
        }
        );

        // System — Tax Rates
        Route::prefix('system')->name('system.')->group(function () {
            Route::get('tax-rates', [TaxRateController::class , 'index'])->name('tax-rates.index');
            Route::post('tax-rates', [TaxRateController::class , 'store'])->name('tax-rates.store');
            Route::put('tax-rates/{taxRate}', [TaxRateController::class , 'update'])->name('tax-rates.update');
            Route::delete('tax-rates/{taxRate}', [TaxRateController::class , 'destroy'])->name('tax-rates.destroy');

            // Store Bank Accounts
            Route::get('bank-accounts', [StoreBankAccountController::class , 'index'])->name('bank-accounts.index');
            Route::post('bank-accounts', [StoreBankAccountController::class , 'store'])->name('bank-accounts.store');
            Route::put('bank-accounts/{storeBankAccount}', [StoreBankAccountController::class , 'update'])->name('bank-accounts.update');
            Route::delete('bank-accounts/{storeBankAccount}', [StoreBankAccountController::class , 'destroy'])->name('bank-accounts.destroy');

            // SMS Templates
            Route::get('sms-templates', [SmsTemplateController::class , 'index'])->name('sms-templates.index');
            Route::post('sms-templates', [SmsTemplateController::class , 'store'])->name('sms-templates.store');
            Route::put('sms-templates/{smsTemplate}', [SmsTemplateController::class , 'update'])->name('sms-templates.update');
            Route::delete('sms-templates/{smsTemplate}', [SmsTemplateController::class , 'destroy'])->name('sms-templates.destroy');

            // System Settings
            Route::get('system-settings', [SystemSettingController::class , 'index'])->name('system-settings.index');
            Route::post('system-settings', [SystemSettingController::class , 'store'])->name('system-settings.store');
            Route::put('system-settings/{systemSetting}', [SystemSettingController::class , 'update'])->name('system-settings.update');
            Route::delete('system-settings/{systemSetting}', [SystemSettingController::class , 'destroy'])->name('system-settings.destroy');
            Route::post('system-settings/bulk-update', [SystemSettingController::class , 'bulkUpdate'])->name('system-settings.bulk-update');

            // Subscription Plans
            Route::get('subscription-plans', [SubscriptionController::class , 'plans'])->name('subscription-plans.index');
            Route::post('subscription-plans', [SubscriptionController::class , 'storePlan'])->name('subscription-plans.store');
            Route::put('subscription-plans/{subscriptionPlan}', [SubscriptionController::class , 'updatePlan'])->name('subscription-plans.update');
            Route::delete('subscription-plans/{subscriptionPlan}', [SubscriptionController::class , 'destroyPlan'])->name('subscription-plans.destroy');

            // User Subscriptions
            Route::get('user-subscriptions', [SubscriptionController::class , 'userSubscriptions'])->name('user-subscriptions.index');
            Route::post('user-subscriptions', [SubscriptionController::class , 'storeUserSubscription'])->name('user-subscriptions.store');
            Route::put('user-subscriptions/{userSubscription}', [SubscriptionController::class , 'updateUserSubscription'])->name('user-subscriptions.update');
            Route::delete('user-subscriptions/{userSubscription}', [SubscriptionController::class , 'destroyUserSubscription'])->name('user-subscriptions.destroy');
        });

        // Order Management — Payment Failures
        Route::prefix('order-management')->name('order-management.')->group(function () {
            Route::get('payment-failures', [PaymentFailureManagementController::class , 'index'])->name('payment-failures.index');
            Route::post('payment-failures', [PaymentFailureManagementController::class , 'store'])->name('payment-failures.store');
            Route::put('payment-failures/{id}', [PaymentFailureManagementController::class , 'update'])->name('payment-failures.update');
            Route::delete('payment-failures/{id}', [PaymentFailureManagementController::class , 'destroy'])->name('payment-failures.destroy');
        });
    });
