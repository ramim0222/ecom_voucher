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
    public function index()
    {
        $users = User::where('role', 'customer')->get();
        return Inertia::render('Admin/Users/Index', ['users' => $users]);
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
