<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin user already exists
        $adminUser = User::where('email', 'ramim@admin.com')->first();

        if (!$adminUser) {
            User::create([
                'first_name' => 'SM',
                'last_name' => 'Ramim',
                'email' => 'ramim@admin.com',
                'password' => Hash::make('Ramim420'),
                'phone_number' => '01234567890',
                'street_address' => '216-Dhonia; Dhaka-1236',
                'city' => 'Dhaka',
                'state' => 'Dhaka',
                'zip' => '1236',
                'country' => 'Bangladesh',
                'role' => 'admin',
                'status' => 'active',
                'date_of_birth' => '1998-12-11',
                'promotional_emails' => false,
                'other_updates' => false,
                'email_verified_at' => now(),
            ]);

            $this->command->info('Admin user created successfully!');
        } else {
            $this->command->info('Admin user already exists.');
        }
    }
}
