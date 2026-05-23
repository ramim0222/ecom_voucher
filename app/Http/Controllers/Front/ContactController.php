<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactFormRequest;
use App\Mail\ContactMail;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function show()
    {
        $admin = User::query()
            ->where('role', 'admin')
            ->where('status', 'active')
            ->first(['email', 'phone_number']);

        return Inertia::render('Contact', [
            'recaptchaSiteKey' => config('services.recaptcha.site_key'),
            'contactEmail' => $admin?->email ?? config('mail.from.address', 'support@gamevault.com'),
            'contactPhone' => $admin?->phone_number,
        ]);
    }

    public function submit(ContactFormRequest $request)
    {
        $validated = $request->validated();

        try {
            $admin = User::query()
                ->where('role', 'admin')
                ->where('status', 'active')
                ->first(['email']);

            $recipientEmail = $admin?->email ?? config('mail.from.address', 'support@gamevault.com');

            Mail::to($recipientEmail)->send(new ContactMail(
                name: $validated['name'],
                email: $validated['email'],
                contactSubject: $validated['subject'],
                message: $validated['message']
            ));

            Log::info('Contact form email sent', [
                'to' => $recipientEmail,
                'from' => $validated['email'],
                'name' => $validated['name'],
                'subject' => $validated['subject'],
            ]);

            return back()->with('success', 'Your message has been sent! We will get back to you within 24 hours.');
        } catch (\Exception $e) {
            Log::error('Contact form submission failed: ' . $e->getMessage(), [
                'from' => $validated['email'] ?? null,
                'name' => $validated['name'] ?? null,
            ]);

            return back()->with('error', 'Sorry, there was an error sending your message. Please try again.');
        }
    }
}
