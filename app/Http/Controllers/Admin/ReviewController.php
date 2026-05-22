<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');

        $reviews = Review::with(['user', 'product'])
            ->when($status !== 'all' && $status !== '', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('review', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('email', 'like', "%{$search}%")
                                ->orWhere('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('product', function ($productQuery) use ($search) {
                            $productQuery->where('title', 'like', "%{$search}%");

                            if (is_numeric($search)) {
                                $productQuery->orWhere('id', $search);
                            }
                        });

                    if (preg_match('/^sku-(\d+)$/i', $search, $matches)) {
                        $q->orWhere('product_id', $matches[1]);
                    }
                });
            })
            ->orderByRaw("CASE
                WHEN status = 'pending' THEN 1
                WHEN status = 'approved' THEN 2
                WHEN status = 'rejected' THEN 3
                ELSE 4
            END")
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString()
            ->through(function ($review) {
                return [
                    'id' => $review->id,
                    'product' => $review->product->title,
                    'sku' => 'SKU-' . $review->product->id,
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
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
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
