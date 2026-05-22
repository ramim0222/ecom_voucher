<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateMarketingRequest;
use App\Models\Option;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MarketingController extends Controller
{
    public function indexMeta(): Response
    {
        $metaSettings = Option::getValue('marketing_meta_settings', [
            'dataset_id' => '',
            'pixel_id' => '',
            'access_token' => '',
            'catalog' => '',
            'test_event_code' => '',
            'browser_tracking_enabled' => true,
            'server_tracking_enabled' => true,
        ]);

        return Inertia::render('Admin/Marketing/Meta', [
            'metaSettings' => $metaSettings,
        ]);
    }

    public function indexGoogle(): Response
    {
        $googleSettings = Option::getValue('marketing_google_settings', [
            'analytics_script' => '',
            'tag_manager_head_script' => '',
            'tag_manager_body_script' => '',
        ]);

        return Inertia::render('Admin/Marketing/Google', [
            'googleSettings' => $googleSettings,
        ]);
    }

    public function indexTiktok(): Response
    {
        $tiktokSettings = Option::getValue('marketing_tiktok_settings', [
            'pixel_script' => '',
        ]);

        return Inertia::render('Admin/Marketing/Tiktok', [
            'tiktokSettings' => $tiktokSettings,
        ]);
    }

    public function updateMeta(UpdateMarketingRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Option::setValue('marketing_meta_settings', [
            'dataset_id' => $validated['dataset_id'] ?? '',
            'pixel_id' => $validated['pixel_id'] ?? '',
            'access_token' => $validated['access_token'] ?? '',
            'catalog' => $validated['catalog'] ?? '',
            'test_event_code' => $validated['test_event_code'] ?? '',
            'browser_tracking_enabled' => (bool) ($validated['browser_tracking_enabled'] ?? false),
            'server_tracking_enabled' => (bool) ($validated['server_tracking_enabled'] ?? false),
        ]);

        return redirect()
            ->route('admin.settings.marketing.meta')
            ->with('success', 'Meta settings updated successfully.');
    }

    public function updateGoogle(UpdateMarketingRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Option::setValue('marketing_google_settings', [
            'analytics_script' => $validated['analytics_script'] ?? '',
            'tag_manager_head_script' => $validated['tag_manager_head_script'] ?? '',
            'tag_manager_body_script' => $validated['tag_manager_body_script'] ?? '',
        ]);

        return redirect()
            ->route('admin.settings.marketing.google')
            ->with('success', 'Google settings updated successfully.');
    }

    public function updateTiktok(UpdateMarketingRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Option::setValue('marketing_tiktok_settings', [
            'pixel_script' => $validated['pixel_script'] ?? '',
        ]);

        return redirect()
            ->route('admin.settings.marketing.tiktok')
            ->with('success', 'TikTok settings updated successfully.');
    }
}
