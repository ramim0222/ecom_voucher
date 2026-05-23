<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MarketingController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Front\ProductController as FrontProductController;
use App\Http\Controllers\Front\ReviewController;
use App\Http\Controllers\Front\CartController;
use App\Http\Controllers\Front\WishlistController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Front\IndexController;
use App\Http\Controllers\Front\DashboardController as FrontDashboardController;

Route::get('/', [IndexController::class, 'welcome'])->name('welcome');
Route::get('/checkout', [IndexController::class, 'checkout'])->name('checkout');
Route::get('/products', [FrontProductController::class, 'products'])->name('products');
Route::get('/products/{id}', [FrontProductController::class, 'product'])->name('product');
Route::get('/support', [IndexController::class, 'support'])->name('support');

// Public cart routes (work for both auth and guest users)
Route::get('/cart', [CartController::class, 'cart'])->name('cart');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::patch('/cart/{productId}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{productId}', [CartController::class, 'remove'])->name('cart.remove');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');

// Guest order routes
Route::post('/orders/guest/create', [OrderController::class, 'createGuestOrder'])->name('orders.guest-create');
Route::get('/orders/guest-confirmation', [OrderController::class, 'guestConfirmation'])->name('orders.guest-confirmation');

// Order show (accessible by owner, admin, or guest via session)
Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');





//Customer Middleware Group Routes

Route::middleware(['auth', 'verified'])->group(function () {
    Route::group([
        'middleware' => function ($request, $next) {
            if (! auth()->user() || auth()->user()->role !== 'customer') {
                abort(403, 'Unauthorized.');
            }
            if (auth()->user()->status !== 'active') {
                abort(403, 'Your account has been banned. Please contact support.');
            }
            return $next($request);
        }
    ], function () {
        //Dashboard routes
        Route::get('/dashboard', [FrontDashboardController::class, 'index'])->name('dashboard');

        //Dashboard Profile routes
        Route::get('/dashboard/profile', [ProfileController::class, 'dashboard'])->name('dashboard.profile');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
        Route::put('/profile/preferences', [ProfileController::class, 'updatePreferences'])->name('profile.preferences');

        // Review routes
        Route::post('/products/{product}/reviews', [ReviewController::class, 'store'])->name('reviews.store');

        // Wishlist routes
        Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');
        Route::post('/wishlist/add', [WishlistController::class, 'add'])->name('wishlist.add');
        Route::delete('/wishlist/{wishlist}', [WishlistController::class, 'remove'])->name('wishlist.remove');
        Route::delete('/wishlist', [WishlistController::class, 'clear'])->name('wishlist.clear');
        Route::post('/wishlist/{wishlist}/move-to-cart', [WishlistController::class, 'moveToCart'])->name('wishlist.move-to-cart');
        Route::post('/wishlist/move-all', [WishlistController::class, 'moveAllToCart'])->name('wishlist.move-all');
        Route::delete('/wishlist/product/{product}', [WishlistController::class, 'removeByProduct'])->name('wishlist.remove-by-product');

        // Order routes (auth required for creating/viewing user orders)
        Route::post('/orders/create-from-cart', [OrderController::class, 'createFromCart'])->name('orders.create-from-cart');
        Route::post('/orders/create-from-products', [OrderController::class, 'createFromProducts'])->name('orders.create-from-products');
        Route::post('/orders/{order}/payment', [OrderController::class, 'processPayment'])->name('orders.process-payment');
        Route::post('/orders/{order}/simulate-payment', [OrderController::class, 'simulatePayment'])->name('orders.simulate-payment');
        Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
        Route::post('/orders/check-availability', [OrderController::class, 'checkAvailability'])->name('orders.check-availability');

        Route::get('/dashboard/orders', [OrderController::class, 'index'])->name('dashboard.orders');

    });
});

//admin middleware group routes

Route::middleware(['auth', 'verified'])->group(function () {
    Route::group([
        'middleware' => function ($request, $next) {
            if (! auth()->user() || auth()->user()->role !== 'admin') {
                abort(403, 'Unauthorized.');
            }
            return $next($request);
        }
    ], function () {


        Route::get('/admin', [DashboardController::class, 'index'])->name('admin');

        Route::get('/admin/profile', [ProfileController::class, 'admin'])->name('admin.profile');
        Route::patch('/admin/profile', [ProfileController::class, 'update'])->name('admin.profile.update');

        Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users.index');
        Route::get('/admin/users/{id}', [UserController::class, 'show'])->name('admin.users.show');
        Route::patch('/admin/users/{id}/status', [UserController::class, 'updateStatus'])->name('admin.users.update-status');

        Route::get('/admin/products', [AdminProductController::class, 'index'])->name('admin.products.index');
        Route::post('/admin/products', [AdminProductController::class, 'store'])->name('admin.products.store');
        Route::put('/admin/products/{product}', [AdminProductController::class, 'update'])->name('admin.products.update');
        Route::delete('/admin/products/{product}', [AdminProductController::class, 'destroy'])->name('admin.products.destroy');
        Route::post('/admin/products/{product}/codes', [AdminProductController::class, 'uploadCodes'])->name('admin.products.codes.upload');
        Route::get('/admin/products/{product}/codes', [AdminProductController::class, 'getCodes'])->name('admin.products.codes.get');
        Route::post('/admin/products/{product}/codes/bulk-delete', [AdminProductController::class, 'bulkDeleteCodes'])->name('admin.products.codes.bulk-delete');

        // Admin Order routes
        Route::get('/admin/orders', [OrderController::class, 'adminIndex'])->name('admin.orders.index');
        Route::get('/admin/orders/{order}', [OrderController::class, 'adminShow'])->name('admin.orders.show');
        Route::post('/admin/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('admin.orders.cancel');
        Route::patch('/admin/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('admin.orders.update-status');
        Route::patch('/admin/orders/{order}/payment-status', [OrderController::class, 'updatePaymentStatus'])->name('admin.orders.update-payment-status');

        Route::get('/admin/categories', [CategoryController::class, 'index'])->name('admin.categories.index');
        Route::post('/admin/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
        Route::put('/admin/categories/{category}', [CategoryController::class, 'update'])->name('admin.categories.update');
        Route::delete('/admin/categories/{category}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');


        Route::get('/admin/reviews', [AdminReviewController::class, 'index'])->name('admin.reviews');
        Route::patch('/admin/reviews/{review}/status', [AdminReviewController::class, 'updateStatus'])->name('admin.reviews.update-status');
        Route::delete('/admin/reviews/{review}', [AdminReviewController::class, 'destroy'])->name('admin.reviews.destroy');

        Route::get('/admin/settings', [SettingsController::class, 'index'])->name('admin.settings');

        Route::prefix('admin/settings/marketing')->group(function () {
            Route::get('/meta', [MarketingController::class, 'indexMeta'])->name('admin.settings.marketing.meta');
            Route::get('/google', [MarketingController::class, 'indexGoogle'])->name('admin.settings.marketing.google');
            Route::get('/tiktok', [MarketingController::class, 'indexTiktok'])->name('admin.settings.marketing.tiktok');
            Route::put('/meta', [MarketingController::class, 'updateMeta'])->name('admin.settings.marketing.meta.update');
            Route::put('/google', [MarketingController::class, 'updateGoogle'])->name('admin.settings.marketing.google.update');
            Route::put('/tiktok', [MarketingController::class, 'updateTiktok'])->name('admin.settings.marketing.tiktok.update');
        });

    });
});



require __DIR__.'/auth.php';
