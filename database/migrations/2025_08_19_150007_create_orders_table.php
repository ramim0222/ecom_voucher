<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
                Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // Generate unique order number
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('subtotal', 10, 2); // Sum of all order items
            $table->decimal('discount_amount', 10, 2)->default(0); // Any discount applied
            $table->decimal('tax_amount', 10, 2)->default(0); // Tax amount if applicable
            $table->decimal('total_amount', 10, 2); // subtotal + tax - discount
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled', 'refunded'])->default('pending');
            $table->string('payment_method')->nullable(); // bkash, card, etc.
            $table->string('payment_reference')->nullable(); // Payment gateway reference
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->timestamp('payment_completed_at')->nullable();
            $table->json('payment_details')->nullable(); // Store payment gateway response
            $table->json('billing_address')->nullable(); // Store billing address
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['payment_status', 'created_at']);
            $table->index('order_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
