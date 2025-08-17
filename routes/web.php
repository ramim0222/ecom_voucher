<?php

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

Route::get('/admin', function () {
    return Inertia::render('Admin/Dashboard');
});

Route::get('/admin/users', function () {
    return Inertia::render('Admin/Users/Index');
});

Route::get('/admin/users/{id}', function ($id) {
    return Inertia::render('Admin/Users/Page', ['id' => $id]);
});

Route::get('/admin/products', function () {
    return Inertia::render('Admin/Products');
});

Route::get('/admin/orders', function () {
    return Inertia::render('Admin/Orders/Index');
});

Route::get('/admin/orders/{id}', function ($id) {
    return Inertia::render('Admin/Orders/Page', ['id' => $id]);
});

Route::get('/admin/categories', function () {

    return Inertia::render('Admin/Categories');
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

        Route::get('/dashboard/orders', function () {
            return Inertia::render('Dashboard/Orders');
        });

    });
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::put('/profile/preferences', [ProfileController::class, 'updatePreferences'])->name('profile.preferences');
});

require __DIR__.'/auth.php';
