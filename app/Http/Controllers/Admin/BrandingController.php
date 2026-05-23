<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateBrandingRequest;
use App\Models\Option;
use App\Services\BrandingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BrandingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Branding', [
            'brandingSettings' => BrandingService::getSettings(),
        ]);
    }

    public function update(UpdateBrandingRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $brandingSettings = BrandingService::getSettings();

        $brandingSettings['brand_name'] = $validated['brand_name'];
        $brandingSettings['brand_description'] = $validated['brand_description'] ?? '';
        $brandingSettings['hero_title'] = $validated['hero_title'];
        $brandingSettings['hero_description'] = $validated['hero_description'] ?? '';
        $brandingSettings['products_title'] = $validated['products_title'];
        $brandingSettings['products_description'] = $validated['products_description'] ?? '';
        $brandingSettings['featured_title'] = $validated['featured_title'];
        $brandingSettings['featured_description'] = $validated['featured_description'] ?? '';
        $brandingSettings['discounts_title'] = $validated['discounts_title'];
        $brandingSettings['discounts_description'] = $validated['discounts_description'] ?? '';
        $brandingSettings['categories_title'] = $validated['categories_title'];

        if ($request->hasFile('branding.logo')) {
            if (! empty($brandingSettings['logo_path']) && Storage::disk('public')->exists($brandingSettings['logo_path'])) {
                Storage::disk('public')->delete($brandingSettings['logo_path']);
            }

            $brandingSettings['logo_path'] = $request->file('branding.logo')->store('settings/branding/logo', 'public');
        }

        if ($request->hasFile('branding.favicon')) {
            if (! empty($brandingSettings['favicon_path']) && Storage::disk('public')->exists($brandingSettings['favicon_path'])) {
                Storage::disk('public')->delete($brandingSettings['favicon_path']);
            }

            $brandingSettings['favicon_path'] = $request->file('branding.favicon')->store('settings/branding/favicon', 'public');
        }

        Option::setValue('branding_settings', $brandingSettings);

        return redirect()
            ->route('admin.settings.branding')
            ->with('success', 'Branding settings updated successfully.');
    }
}
