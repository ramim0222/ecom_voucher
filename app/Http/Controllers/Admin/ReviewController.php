<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        // Get all reviews with user and product relationships
        $reviews = Review::with(['user', 'product'])
            ->orderByRaw("CASE
                WHEN status = 'pending' THEN 1
                WHEN status = 'approved' THEN 2
                WHEN status = 'rejected' THEN 3
                ELSE 4
            END")
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'product' => $review->product->title,
                    'sku' => 'SKU-' . $review->product->id, // You can add SKU field to products table if needed
                    'user' => $review->user->full_name,
                    'email' => $review->user->email,
                    'rating' => $review->rating,
                    'comment' => $review->review,
                    'status' => $review->status,
                    'created_at' => $review->created_at->toISOString(),
                    'product_id' => $review->product_id,
                    'user_id' => $review->user_id,
                ];
            });

        return Inertia::render('Admin/Reviews', [
            'reviews' => $reviews,
        ]);
    }

    public function updateStatus(Request $request, Review $review)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $review->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Review status updated successfully.');
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return back()->with('success', 'Review deleted successfully.');
    }
}
