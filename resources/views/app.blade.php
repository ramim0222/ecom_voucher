<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta http-equiv="Permissions-Policy" content="interest-cohort=()">

        @php
            $brandingSettings = \App\Services\BrandingService::getSettings();
            $brandName = $brandingSettings['brand_name'] ?? 'GameVault';
            $brandDescription = $brandingSettings['brand_description'] ?? 'Premium Gaming Vouchers';
            $faviconPath = $brandingSettings['favicon_path'] ?? '';
        @endphp

        <title inertia>{{ $brandName }} - {{ $brandDescription }}</title>
        <meta name="description" content="{{ $brandDescription }}">

        @if (!empty($faviconPath))
            <link rel="icon" type="image/x-icon" href="{{ asset('storage/' . $faviconPath) }}">
            <link rel="shortcut icon" href="{{ asset('storage/' . $faviconPath) }}">
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        @php
            $metaSettings = \App\Models\Option::getValue('marketing_meta_settings', []);
            $googleSettings = \App\Models\Option::getValue('marketing_google_settings', []);
            $tiktokSettings = \App\Models\Option::getValue('marketing_tiktok_settings', []);

            $metaPixelId = $metaSettings['dataset_id'] ?? null;
            $metaBrowserEnabled = $metaSettings['browser_tracking_enabled'] ?? false;

            function isValidScriptContent($value) {
                if (empty($value) || !is_string($value)) {
                    return false;
                }

                $trimmed = trim($value);
                $hasScriptTag = stripos($trimmed, '<script') !== false || stripos($trimmed, '</script>') !== false;
                $hasScriptKeywords = preg_match('/\b(gtag|fbq|ttq|dataLayer|googletagmanager|analytics|noscript)\b/i', $trimmed);
                $hasHtmlTags = preg_match('/<[a-z][^>]*>/i', $trimmed);
                $hasJsPatterns = preg_match('/(window\.|document\.|function\s*\(|var\s+\w+|const\s+\w+)/i', $trimmed);

                return $hasScriptTag || $hasScriptKeywords || $hasHtmlTags || $hasJsPatterns;
            }
        @endphp

        @if (!empty($googleSettings['analytics_script']) && isValidScriptContent($googleSettings['analytics_script']))
            {!! $googleSettings['analytics_script'] !!}
        @endif

        @if (!empty($googleSettings['tag_manager_head_script']) && isValidScriptContent($googleSettings['tag_manager_head_script']))
            {!! $googleSettings['tag_manager_head_script'] !!}
        @endif

        @if (!empty($tiktokSettings['pixel_script']) && isValidScriptContent($tiktokSettings['pixel_script']))
            {!! $tiktokSettings['pixel_script'] !!}
        @endif

        @if ($metaBrowserEnabled && !empty($metaPixelId))
            <script>
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '{{ $metaPixelId }}');
                fbq('track', 'PageView');
            </script>
            <noscript>
                <img height="1" width="1" style="display:none"
                     src="https://www.facebook.com/tr?id={{ $metaPixelId }}&ev=PageView&noscript=1"/>
            </noscript>
        @endif
    </head>
    <body class="dark font-sans antialiased">
        @if (!empty($googleSettings['tag_manager_body_script']) && isValidScriptContent($googleSettings['tag_manager_body_script']))
            {!! $googleSettings['tag_manager_body_script'] !!}
        @endif
        @inertia
    </body>
</html>
