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
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'name')) {
                $table->dropColumn('name');
            }

            $table->string('first_name')->after('id');
            $table->string('last_name')->after('first_name');
            $table->string('phone_number')->nullable()->after('password');
            $table->string('street_address')->nullable()->after('phone_number');
            $table->string('city')->nullable()->after('street_address');
            $table->string('state')->nullable()->after('city');
            $table->string('zip')->nullable()->after('state');
            $table->string('country')->nullable()->default('Bangladesh')->after('zip');
            $table->enum('role', ['admin', 'customer'])->default('customer')->after('country');
            $table->enum('status', ['active', 'banned'])->default('active')->after('role');
            $table->date('date_of_birth')->nullable()->after('status');
            $table->boolean('promotional_emails')->default(true)->after('date_of_birth');
            $table->boolean('other_updates')->default(true)->after('promotional_emails');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name', 'last_name', 'phone_number', 'street_address',
                'city', 'state', 'zip', 'country', 'role', 'status',
                'date_of_birth', 'promotional_emails', 'other_updates'
            ]);
            $table->string('name')->after('id');
        });
    }
};
