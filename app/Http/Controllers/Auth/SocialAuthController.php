<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\RedirectsAuthenticatedUsers;
use App\Models\User;
use App\Services\GuestSessionMergeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

class SocialAuthController extends Controller
{
    use RedirectsAuthenticatedUsers;

    private const PROVIDERS = ['google', 'discord'];

    public function __construct(
        protected GuestSessionMergeService $guestSessionMergeService
    ) {}

    public function redirect(string $provider): SymfonyRedirectResponse|RedirectResponse
    {
        $this->validateProvider($provider);

        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider, Request $request): RedirectResponse
    {
        $this->validateProvider($provider);

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Throwable) {
            return redirect()
                ->route('login')
                ->withErrors(['email' => 'Unable to authenticate with '.ucfirst($provider).'. Please try again.']);
        }

        if (! $socialUser->getEmail()) {
            return redirect()
                ->route('login')
                ->withErrors(['email' => 'We could not retrieve an email address from your '.ucfirst($provider).' account.']);
        }

        $user = User::query()
            ->where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if (! $user) {
            $user = User::query()
                ->where('email', strtolower($socialUser->getEmail()))
                ->first();

            if ($user) {
                $user->update([
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                ]);
            }
        }

        if (! $user) {
            [$firstName, $lastName] = $this->splitName($socialUser->getName());

            $user = User::create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => strtolower($socialUser->getEmail()),
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'password' => null,
                'role' => 'customer',
                'status' => 'active',
                'country' => 'Bangladesh',
                'email_verified_at' => now(),
                'promotional_emails' => true,
                'other_updates' => true,
            ]);
        }

        if ($user->status === 'banned') {
            return redirect()
                ->route('login')
                ->withErrors(['email' => 'Your account has been banned.']);
        }

        Auth::login($user);

        $this->guestSessionMergeService->merge($user, $request);

        $request->session()->regenerate();

        return $this->redirectAuthenticatedUser();
    }

    private function validateProvider(string $provider): void
    {
        if (! in_array($provider, self::PROVIDERS, true)) {
            abort(404);
        }
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function splitName(?string $name): array
    {
        $parts = preg_split('/\s+/', trim($name ?? ''), 2) ?: [];

        return [
            $parts[0] ?? 'User',
            $parts[1] ?? '',
        ];
    }
}
