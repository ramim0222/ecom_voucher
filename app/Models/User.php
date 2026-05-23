<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'provider',
        'provider_id',
        'password',
        'phone_number',
        'street_address',
        'city',
        'state',
        'zip',
        'country',
        'role',
        'status',
        'date_of_birth',
        'promotional_emails',
        'other_updates',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'promotional_emails' => 'boolean',
            'other_updates' => 'boolean',
        ];
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    // Check if user is admin
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function defaultRedirectPath(): string
    {
        return route($this->isAdmin() ? 'admin' : 'dashboard', absolute: false);
    }

    // Check if user is customer
    public function isCustomer()
    {
        return $this->role === 'customer';
    }

    // Check if user is active
    public function isActive()
    {
        return $this->status === 'active';
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function cart()
    {
        return $this->hasMany(Cart::class);
    }

    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
