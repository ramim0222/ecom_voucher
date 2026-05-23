<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Services\ContentPagesService;
use Inertia\Inertia;
use Inertia\Response;

class ContentPageController extends Controller
{
    public function faq(): Response
    {
        return Inertia::render('Faq', [
            'page' => ContentPagesService::getPage(ContentPagesService::PAGE_FAQ),
        ]);
    }

    public function refund(): Response
    {
        return Inertia::render('PolicyPage', [
            'page' => ContentPagesService::getPage(ContentPagesService::PAGE_REFUND),
            'pageKey' => ContentPagesService::PAGE_REFUND,
        ]);
    }

    public function privacy(): Response
    {
        return Inertia::render('PolicyPage', [
            'page' => ContentPagesService::getPage(ContentPagesService::PAGE_PRIVACY),
            'pageKey' => ContentPagesService::PAGE_PRIVACY,
        ]);
    }

    public function terms(): Response
    {
        return Inertia::render('PolicyPage', [
            'page' => ContentPagesService::getPage(ContentPagesService::PAGE_TERMS),
            'pageKey' => ContentPagesService::PAGE_TERMS,
        ]);
    }
}
