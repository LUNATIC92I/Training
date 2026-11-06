<?php

/*
|--------------------------------------------------------------------------
| CyberPost AI : configuration
|--------------------------------------------------------------------------
| Tous les secrets sont lus depuis l'environnement (.env) et ne sont jamais
| renvoyés par l'API ni écrits dans les journaux.
*/

return [

    'default_timezone' => env('CYBERPOST_TIMEZONE', 'Africa/Abidjan'),

    // Adresse vers laquelle l'application Android est renvoyée après OAuth.
    'app_deep_link' => env('CYBERPOST_APP_DEEP_LINK', 'cyberpost://linkedin'),

    // Autorise l'option --now des commandes (tests uniquement, jamais en production).
    'allow_time_travel' => env('CYBERPOST_ALLOW_TIME_TRAVEL', false),

    'linkedin' => [
        'client_id' => env('LINKEDIN_CLIENT_ID'),
        'client_secret' => env('LINKEDIN_CLIENT_SECRET'),
        'redirect_uri' => env('LINKEDIN_REDIRECT_URI'),
        // Share on LinkedIn (w_member_social) + Sign In with LinkedIn using OpenID Connect (openid profile)
        'scopes' => env('LINKEDIN_SCOPES', 'openid profile w_member_social'),
        // En-tête Linkedin-Version (AAAAMM). Chaque version est maintenue au moins un an :
        // à mettre à jour avant son retrait (une réponse 426 le signale).
        'api_version' => env('LINKEDIN_API_VERSION', '202610'),
        // Adresses officielles. Les variables *_BASE ne servent qu'à pointer un
        // environnement de recette vers un simulateur (tests de bout en bout) :
        // ne jamais les définir en production.
        'authorize_url' => env('LINKEDIN_OAUTH_BASE', 'https://www.linkedin.com').'/oauth/v2/authorization',
        'token_url' => env('LINKEDIN_OAUTH_BASE', 'https://www.linkedin.com').'/oauth/v2/accessToken',
        'userinfo_url' => env('LINKEDIN_API_BASE', 'https://api.linkedin.com').'/v2/userinfo',
        'posts_url' => env('LINKEDIN_API_BASE', 'https://api.linkedin.com').'/rest/posts',
        'timeout' => (int) env('LINKEDIN_TIMEOUT', 30),
        'expiry_warning_days' => 7,
    ],

    'llm' => [
        'default_provider' => env('LLM_PROVIDER', 'anthropic'),
        'timeout' => (int) env('LLM_TIMEOUT', 120),
        'providers' => [
            'anthropic' => [
                'name' => 'Anthropic Claude',
                'driver' => 'anthropic',
                'api_key' => env('ANTHROPIC_API_KEY'),
                'model' => env('ANTHROPIC_MODEL', 'claude-sonnet-5-5'),
                'base_url' => env('ANTHROPIC_BASE_URL', 'https://api.anthropic.com'),
            ],
            'openai' => [
                'name' => 'OpenAI',
                'driver' => 'openai_compatible',
                'api_key' => env('OPENAI_API_KEY'),
                'model' => env('OPENAI_MODEL'),
                'base_url' => env('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
            ],
            // Tout fournisseur exposant l'API « chat/completions » compatible OpenAI
            // (Mistral, Groq, un serveur auto-hébergé, etc.).
            'custom' => [
                'name' => env('CUSTOM_LLM_NAME', 'Fournisseur compatible OpenAI'),
                'driver' => 'openai_compatible',
                'api_key' => env('CUSTOM_LLM_API_KEY'),
                'model' => env('CUSTOM_LLM_MODEL'),
                'base_url' => env('CUSTOM_LLM_BASE_URL'),
            ],
        ],
    ],

    // Flux utilisés pour les sujets d'actualité (sources officielles).
    'sources' => [
        'enabled' => env('NEWS_SOURCES_ENABLED', true),
        'max_age_days' => 14,
        'feeds' => [
            ['type' => 'cisa_kev', 'name' => 'CISA Known Exploited Vulnerabilities',
                'url' => 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json'],
            ['type' => 'rss', 'name' => 'CERT-FR (ANSSI) : alertes', 'url' => 'https://cert.cyber.gouv.fr/alerte/feed/'],
            ['type' => 'rss', 'name' => 'CERT-FR (ANSSI) : avis', 'url' => 'https://cert.cyber.gouv.fr/avis/feed/'],
            ['type' => 'rss', 'name' => 'CERT-FR (ANSSI) : menaces et incidents', 'url' => 'https://cert.cyber.gouv.fr/cti/feed/'],
        ],
    ],

    'generation' => [
        'max_attempts' => 4,             // tentatives avant abandon pour un créneau
        'similarity_threshold' => 0.30,  // Jaccard sur trigrammes de mots
        'similarity_window_days' => 30,
    ],

    'publishing' => [
        'max_attempts' => 4,
        'retry_delays_minutes' => [2, 5, 10, 20],
        'stale_publishing_minutes' => 10, // au-delà : réponse incertaine, jamais de nouvel envoi automatique
    ],

    'fcm' => [
        'service_account_path' => env('FCM_SERVICE_ACCOUNT_PATH'),
        // Valeurs publiques de l'application Firebase Android, transmises à l'app (pas des secrets).
        'project_id' => env('FCM_PROJECT_ID'),
        'application_id' => env('FCM_ANDROID_APP_ID'),
        'api_key' => env('FCM_ANDROID_API_KEY'),
        'sender_id' => env('FCM_SENDER_ID'),
    ],
];
