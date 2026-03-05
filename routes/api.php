<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SubcategoryController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\ReviewController;

// Auth endpoints for the React frontend
Route::post('/login', [AuthController::class , 'login']);
Route::post('/register', [AuthController::class , 'register']);

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

    Route::put('/reviews/{review}', [ReviewController::class , 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class , 'destroy']);
});

Route::post('/coupons/validate', [App\Http\Controllers\Api\CouponController::class , 'validate']);
Route::post('/orders', [\App\Http\Controllers\Api\OrderController::class , 'store']);
Route::get('/orders/track', [\App\Http\Controllers\Api\OrderController::class , 'track']);
Route::get('/categories', [CategoryController::class , 'index']);

Route::get('/subcategories', [SubcategoryController::class , 'index']);
Route::get('/subcategories/{id}', [SubcategoryController::class , 'show']);

Route::get('/announcements/active', [App\Http\Controllers\Api\AnnouncementController::class , 'getActive']);


// Products API
Route::get('/products', [App\Http\Controllers\Api\ProductController::class , 'index']);
Route::get('/products/{id}', [App\Http\Controllers\Api\ProductController::class , 'show']);
Route::get('/products/{product}/reviews', [ReviewController::class , 'index']);
Route::post('/products/{product}/reviews', [ReviewController::class , 'store']);
Route::get('/reviews/{review}', [ReviewController::class , 'show']);

// Sizes & Colors API
Route::get('/sizes', [App\Http\Controllers\Api\SizeColorController::class , 'sizes']);
Route::get('/colors', [App\Http\Controllers\Api\SizeColorController::class , 'colors']);

// Cart API
Route::get('/cart', [App\Http\Controllers\Api\CartController::class , 'index']);
Route::post('/cart/items', [App\Http\Controllers\Api\CartController::class , 'store']);
Route::put('/cart/items/{id}', [App\Http\Controllers\Api\CartController::class , 'update']);
Route::delete('/cart/items/{id}', [App\Http\Controllers\Api\CartController::class , 'destroy']);
Route::delete('/cart', [App\Http\Controllers\Api\CartController::class , 'clear']);
