<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\RedirectResponse;

trait RedirectsAuthenticatedUsers
{
    protected function redirectAuthenticatedUser(string $query = ''): RedirectResponse
    {
        $user = auth()->user();
        $destination = $user->defaultRedirectPath().$query;

        if ($user->isAdmin()) {
            return redirect($destination);
        }

        return redirect()->intended($destination);
    }
}
