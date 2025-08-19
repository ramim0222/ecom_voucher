<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Front\ProductController as FrontProductController;
use App\Http\Controllers\Front\ReviewController;
use App\Http\Controllers\Front\CartController;
use App\Http\Controllers\Front\WishlistController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Front\IndexController;

Route::get('/', [IndexController::class, 'welcome'])->name('welcome');



Route::get('/checkout', [IndexController::class, 'checkout'])->name('checkout');



Route::get('/products', [FrontProductController::class, 'products'])->name('products');
Route::get('/products/{id}', [FrontProductController::class, 'product'])->name('product');

// Review routes
Route::middleware(['auth', 'verified'])->group(function () {

});





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
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard/Dashboard');
        })->name('dashboard');

        //Dashboard Profile routes
        Route::get('/dashboard/profile', [ProfileController::class, 'dashboard'])->name('dashboard.profile');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
        Route::put('/profile/preferences', [ProfileController::class, 'updatePreferences'])->name('profile.preferences');

        // Review routes
        Route::post('/products/{product}/reviews', [ReviewController::class, 'store'])->name('reviews.store');

        // Cart routes
        Route::get('/cart', [CartController::class, 'cart'])->name('cart');
        Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
        Route::patch('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
        Route::delete('/cart/{cart}', [CartController::class, 'remove'])->name('cart.remove');
        Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');

        // Wishlist routes
        Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');
        Route::post('/wishlist/add', [WishlistController::class, 'add'])->name('wishlist.add');
        Route::delete('/wishlist/{wishlist}', [WishlistController::class, 'remove'])->name('wishlist.remove');
        Route::delete('/wishlist', [WishlistController::class, 'clear'])->name('wishlist.clear');
        Route::post('/wishlist/{wishlist}/move-to-cart', [WishlistController::class, 'moveToCart'])->name('wishlist.move-to-cart');
        Route::post('/wishlist/move-all', [WishlistController::class, 'moveAllToCart'])->name('wishlist.move-all');
        Route::delete('/wishlist/product/{product}', [WishlistController::class, 'removeByProduct'])->name('wishlist.remove-by-product');




        Route::get('/dashboard/orders', function () {
            return Inertia::render('Dashboard/Orders');
        });

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


        Route::get('/admin', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('admin');

        Route::get('/admin/profile', function () {
            return Inertia::render('Admin/Profile');
        })->name('admin.profile');

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

        Route::get('/admin/orders', function () {
            return Inertia::render('Admin/Orders/Index');
        });

        Route::get('/admin/orders/{id}', function ($id) {
            return Inertia::render('Admin/Orders/Page', ['id' => $id]);
        });

        Route::get('/admin/categories', [CategoryController::class, 'index'])->name('admin.categories.index');
        Route::post('/admin/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
        Route::put('/admin/categories/{category}', [CategoryController::class, 'update'])->name('admin.categories.update');
        Route::delete('/admin/categories/{category}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');


        Route::get('/admin/reviews', [AdminReviewController::class, 'index'])->name('admin.reviews');
        Route::patch('/admin/reviews/{review}/status', [AdminReviewController::class, 'updateStatus'])->name('admin.reviews.update-status');
        Route::delete('/admin/reviews/{review}', [AdminReviewController::class, 'destroy'])->name('admin.reviews.destroy');

    });
});



require __DIR__.'/auth.php';
