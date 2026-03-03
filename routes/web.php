<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NewsletterSubscriberController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Dashboard
Route::get('/', [DashboardController::class , 'index'])->name('dashboard');

// Resource Routes
Route::get('categories/dropdown', [CategoryController::class , 'dropdown'])->name('categories.dropdown');
Route::get('categories/summary', [CategoryController::class , 'summary'])->name('categories.summary');
Route::post('categories/{category}/activate', [CategoryController::class , 'activate'])->name('categories.activate');
Route::resource('categories', CategoryController::class)->except(['show']);
Route::resource('products', ProductController::class);
Route::resource('orders', OrderController::class)->only(['index', 'show', 'update', 'destroy']);
Route::resource('users', UserController::class);
Route::resource('reviews', ReviewController::class)->only(['index', 'show', 'update', 'destroy']);
Route::resource('coupons', CouponController::class)->except(['show']);

// Subscribers
Route::get('subscribers', [NewsletterSubscriberController::class , 'index'])->name('subscribers.index');
Route::put('subscribers/{subscriber}', [NewsletterSubscriberController::class , 'update'])->name('subscribers.update');
Route::delete('subscribers/{subscriber}', [NewsletterSubscriberController::class , 'destroy'])->name('subscribers.destroy');

// Messages
Route::get('messages', [ContactMessageController::class , 'index'])->name('messages.index');
Route::get('messages/{message}', [ContactMessageController::class , 'show'])->name('messages.show');
Route::delete('messages/{message}', [ContactMessageController::class , 'destroy'])->name('messages.destroy');

// Settings
Route::get('settings', [SettingController::class , 'index'])->name('settings.index');
Route::put('settings', [SettingController::class , 'update'])->name('settings.update');
