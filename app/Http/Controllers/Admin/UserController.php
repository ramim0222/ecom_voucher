<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $users = User::query()
            ->where('role', 'customer')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->withCount('orders')
            ->withSum(['orders as total_spent' => function ($query) {
                $query->where('payment_status', 'paid');
            }], 'total_amount')
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display the specified user
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return Inertia::render('Admin/Users/Page', ['user' => $user]);
    }

    /**
     * Update user status (ban/unban)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,banned'
        ]);

        $user = User::findOrFail($id);

        // Prevent admin from banning themselves
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot ban yourself.']);
        }

        // Prevent banning other admins
        if ($user->role === 'admin') {
            return back()->withErrors(['error' => 'You cannot ban another admin.']);
        }

        $user->update([
            'status' => $request->status
        ]);

        return back()->with('success', "User has been {$request->status}.");
    }
}
