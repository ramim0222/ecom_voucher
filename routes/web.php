<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/cart', function () {
    return Inertia::render('Cart');
});

Route::get('/checkout', function () {
    return Inertia::render('Checkout');
});



Route::get('/products', function () {
    return Inertia::render('Product/Index');
});

Route::get('/products/{id}', function ($id) {
    return Inertia::render('Product/Page', ['id' => $id]);
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
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard/Dashboard');
        })->name('dashboard');

        Route::get('/dashboard/profile', [ProfileController::class, 'dashboard'])->name('dashboard.profile');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
        Route::put('/profile/preferences', [ProfileController::class, 'updatePreferences'])->name('profile.preferences');

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

        Route::get('/admin/products', [ProductController::class, 'index'])->name('admin.products.index');
        Route::post('/admin/products', [ProductController::class, 'store'])->name('admin.products.store');
        Route::put('/admin/products/{product}', [ProductController::class, 'update'])->name('admin.products.update');
        Route::delete('/admin/products/{product}', [ProductController::class, 'destroy'])->name('admin.products.destroy');

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


    });
});



require __DIR__.'/auth.php';
