<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\Category;
use App\Models\Cart;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'cartCount' => fn () => $request->user() ? (int) Cart::where('user_id', $request->user()->id)->sum('quantity') : 0,
            'categories' => fn () => Category::query()
                ->orderBy('name')
                ->get(['id', 'name', 'logo', 'status'])
                ->map(function ($c) {
                    return [
                        'id' => $c->id,
                        'name' => $c->name,
                        'logo' => $c->logo,
                        'status' => is_string($c->status) ? strtolower($c->status) : $c->status,
                    ];
                })
                ->toArray(),
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
