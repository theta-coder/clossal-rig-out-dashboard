<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\CollectionController;
use App\Http\Controllers\Api\SizeGuideController;
use App\Http\Controllers\Api\SizeColorController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\UserActivityController;
use App\Http\Controllers\Api\ProductReturnController;
use App\Http\Controllers\Api\SupportController;
use App\Http\Controllers\Api\LoyaltyController;
use App\Http\Controllers\Api\ProductInteractionController;
use App\Http\Controllers\Api\ShippingMethodController;
use App\Http\Controllers\Api\IdentityController;
use App\Http\Controllers\Api\NotificationController;

// Auth endpoints for the React frontend
Route::post('/login', [AuthController::class , 'login']);
Route::post('/register', [AuthController::class , 'register']);

// OTP & Identity
Route::post('/auth/otp/send', [IdentityController::class , 'sendOtp']);
Route::post('/auth/otp/verify', [IdentityController::class , 'verifyOtp']);
Route::post('/auth/social-login', [IdentityController::class , 'socialLogin']);

// Protected routes (requires Bearer token generated during login)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class , 'user']);
    Route::post('/logout', [AuthController::class , 'logout']);

    // Protected User Routes
    Route::get('/user/orders', [\App\Http\Controllers\Api\OrderController::class , 'index']);
    Route::get('/user/orders/{id}', [\App\Http\Controllers\Api\OrderController::class , 'show']);
    Route::get('/user/addresses', [UserProfileController::class , 'addresses']);
    Route::post('/user/addresses', [UserProfileController::class , 'storeAddress']);
    Route::put('/user/addresses/{id}', [UserProfileController::class , 'updateAddress']);
    Route::delete('/user/addresses/{id}', [UserProfileController::class , 'deleteAddress']);
    Route::post('/user/profile', [UserProfileController::class , 'update']);

    // Returns & Refunds
    Route::get('/returns', [ProductReturnController::class , 'index']);
    Route::post('/returns', [ProductReturnController::class , 'store']);
    Route::get('/returns/{id}', [ProductReturnController::class , 'show']);
    Route::post('/returns/bank-details', [ProductReturnController::class , 'storeBankDetails']);

    // Support & Complaints
    Route::get('/support/tickets', [SupportController::class , 'complaints']);
    Route::post('/support/tickets', [SupportController::class , 'storeComplaint']);
    Route::get('/support/tickets/{id}', [SupportController::class , 'showComplaint']);
    Route::post('/support/tickets/{id}/reply', [SupportController::class , 'replyComplaint']);

    // Loyalty & Wallet
    Route::get('/loyalty/balance', [LoyaltyController::class , 'balance']);
    Route::get('/loyalty/points-history', [LoyaltyController::class , 'pointsHistory']);
    Route::get('/loyalty/wallet-history', [LoyaltyController::class , 'walletHistory']);
    Route::get('/loyalty/referrals', [LoyaltyController::class , 'referrals']);
    Route::post('/loyalty/redeem-giftcard', [LoyaltyController::class , 'redeemGiftCard']);

    // Notifications
    Route::post('/user/notifications/token', [NotificationController::class , 'registerToken']);
    Route::get('/user/notifications/preferences', [NotificationController::class , 'preferences']);
    Route::put('/user/notifications/preferences', [NotificationController::class , 'updatePreferences']);
    Route::post('/user/notifications/revoke', [NotificationController::class , 'revokeToken']);

    Route::put('/reviews/{review}', [ReviewController::class , 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class , 'destroy']);

    // Wishlist API
    Route::get('/wishlists', [WishlistController::class , 'index']);
    Route::post('/wishlists', [WishlistController::class , 'store']);
    Route::post('/wishlists/items', [WishlistController::class , 'addItem']);
    Route::delete('/wishlists/items/{id}', [WishlistController::class , 'removeItem']);
    Route::delete('/wishlists/{id}', [WishlistController::class , 'destroy']);

    // Favorites API
    Route::get('/favorites', [FavoriteController::class , 'index']);
    Route::post('/favorites/toggle', [FavoriteController::class , 'toggle']);
    Route::get('/favorites/{product_id}/status', [FavoriteController::class , 'status']);

    // Product Interaction (Protected)
    Route::post('/products/{product}/ask', [ProductInteractionController::class , 'askQuestion']);
});

// Activity Logging API
Route::post('/activity/search', [UserActivityController::class , 'logSearch']);
Route::post('/activity/view', [UserActivityController::class , 'logProductView']);

// Public Catalog APIs
Route::get('/categories', [CategoryController::class , 'index']);
Route::get('/products', [ProductController::class , 'index']);
Route::get('/products/{id}', [ProductController::class , 'show']);
Route::get('/products/{product}/variants', [\App\Http\Controllers\Api\ProductVariantController::class , 'index']);
Route::get('/variants/{id}', [\App\Http\Controllers\Api\ProductVariantController::class , 'show']);
Route::get('/variants/{id}/stock', [\App\Http\Controllers\Api\ProductVariantController::class , 'stock']);
Route::get('/tags', [TagController::class , 'index']);
Route::get('/collections', [CollectionController::class , 'index']);
Route::get('/collections/{id}', [CollectionController::class , 'show']);
Route::get('/size-guides', [SizeGuideController::class , 'index']);
Route::get('/size-guides/{id}', [SizeGuideController::class , 'show']);

// Product Interaction (Public)
Route::get('/products/{product}/questions', [ProductInteractionController::class , 'questions']);
Route::post('/products/{product}/notify-me', [ProductInteractionController::class , 'notifyMe']);

// Reviews API
Route::get('/products/{product}/reviews', [ReviewController::class , 'index']);
Route::post('/products/{product}/reviews', [ReviewController::class , 'store']);
Route::get('/reviews/{review}', [ReviewController::class , 'show']);

// Sizes & Colors API
Route::get('/sizes', [SizeColorController::class , 'sizes']);
Route::get('/colors', [SizeColorController::class , 'colors']);

// Cart API
Route::get('/cart', [CartController::class , 'index']);
Route::post('/cart/items', [CartController::class , 'store']);
Route::put('/cart/items/{id}', [CartController::class , 'update']);
Route::delete('/cart/items/{id}', [CartController::class , 'destroy']);
Route::delete('/cart', [CartController::class , 'clear']);

// Shipping API
Route::get('/shipping/zones', [ShippingMethodController::class , 'zones']);
Route::get('/shipping/rates', [ShippingMethodController::class , 'rates']);
Route::get('/shipping/couriers', [ShippingMethodController::class , 'couriers']);

// Misc Public API
Route::post('/coupons/validate', [CouponController::class , 'validate']);
Route::post('/orders', [OrderController::class , 'store']);
Route::get('/orders/track', [OrderController::class , 'track']);
Route::get('/announcements/active', [AnnouncementController::class , 'getActive']);

// Promotional Banners
Route::get('/banners/active', [\App\Http\Controllers\Api\PromotionalBannerController::class , 'active']);

// Flash Sales
Route::get('/flash-sales/active', [\App\Http\Controllers\Api\FlashSaleController::class , 'active']);
Route::get('/flash-sales/{id}', [\App\Http\Controllers\Api\FlashSaleController::class , 'show']);

// Product Bundles
Route::get('/bundles', [\App\Http\Controllers\Api\ProductBundleController::class , 'index']);
Route::get('/bundles/{id}', [\App\Http\Controllers\Api\ProductBundleController::class , 'show']);

// Quantity Discounts
Route::get('/products/{id}/discounts', [\App\Http\Controllers\Api\QuantityDiscountController::class , 'forProduct']);

// Newsletter
Route::post('/newsletter/subscribe', [\App\Http\Controllers\Api\NewsletterController::class , 'subscribe']);
Route::post('/newsletter/unsubscribe', [\App\Http\Controllers\Api\NewsletterController::class , 'unsubscribe']);

// FAQs
Route::get('/faqs', [\App\Http\Controllers\Api\FaqController::class , 'index']);
Route::get('/faq-categories', [\App\Http\Controllers\Api\FaqController::class , 'categories']);

// Pages (CMS)
Route::get('/pages', [\App\Http\Controllers\Api\PageController::class , 'index']);
Route::get('/pages/{slug}', [\App\Http\Controllers\Api\PageController::class , 'show']);

// Support (Public)
Route::post('/support/contact', [SupportController::class , 'contact']);
