<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateContentPageRequest;
use App\Services\ContentPagesService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContentPagesController extends Controller
{
    public function editFaq(): Response
    {
        return Inertia::render('Admin/ContentPages/Faq', [
            'pageSettings' => ContentPagesService::getPage(ContentPagesService::PAGE_FAQ),
        ]);
    }

    public function editRefund(): Response
    {
        return $this->editPolicy(ContentPagesService::PAGE_REFUND);
    }

    public function editPrivacy(): Response
    {
        return $this->editPolicy(ContentPagesService::PAGE_PRIVACY);
    }

    public function editTerms(): Response
    {
        return $this->editPolicy(ContentPagesService::PAGE_TERMS);
    }

    public function updateFaq(UpdateContentPageRequest $request): RedirectResponse
    {
        ContentPagesService::updatePage(
            ContentPagesService::PAGE_FAQ,
            $request->validated()
        );

        return redirect()
            ->route('admin.settings.content.faq')
            ->with('success', 'FAQ page updated successfully.');
    }

    public function updateRefund(UpdateContentPageRequest $request): RedirectResponse
    {
        return $this->updatePolicy(ContentPagesService::PAGE_REFUND, $request);
    }

    public function updatePrivacy(UpdateContentPageRequest $request): RedirectResponse
    {
        return $this->updatePolicy(ContentPagesService::PAGE_PRIVACY, $request);
    }

    public function updateTerms(UpdateContentPageRequest $request): RedirectResponse
    {
        return $this->updatePolicy(ContentPagesService::PAGE_TERMS, $request);
    }

    private function editPolicy(string $pageKey): Response
    {
        return Inertia::render('Admin/ContentPages/Policy', [
            'pageKey' => $pageKey,
            'pageSettings' => ContentPagesService::getPage($pageKey),
        ]);
    }

    private function updatePolicy(string $pageKey, UpdateContentPageRequest $request): RedirectResponse
    {
        ContentPagesService::updatePage($pageKey, $request->validated());

        return redirect()
            ->route("admin.settings.content.{$pageKey}")
            ->with('success', 'Page updated successfully.');
    }
}
