# Architecture de CyberPost AI

```
┌────────────────────────────┐        HTTPS (jeton Sanctum)        ┌──────────────────────────────────────────┐
│  Application Android       │ ──────────────────────────────────▶ │  Backend Laravel 13 (PHP 8.3)            │
│  Kotlin · Compose · MVVM   │ ◀────────── JSON (API REST) ─────── │  API REST /api/v1                         │
│  Retrofit · Room · FCM     │                                     │  Ordonnanceur (cron chaque minute)        │
└─────────────▲──────────────┘                                     │  ├─ cyberpost:generate-due                │
              │ notifications push (FCM HTTP v1)                   │  ├─ cyberpost:publish-due                 │
              └──────────────────────────────────────────────────── │  └─ cyberpost:check-tokens                │
                                                                    │  MySQL : articles, publications, jetons… │
                                                                    └───────┬───────────────┬──────────────────┘
                                                                            │               │
                                                       API officielle LinkedIn        Fournisseur de génération
                                                       OAuth 2.0 · /rest/posts        (Anthropic, OpenAI, compatible)
                                                                            │
                                                         Sources officielles : CISA KEV, CERT-FR (ANSSI)
```

**Principe directeur** : le téléphone n'est qu'une console. Toute la logique de génération, de planification et de
publication s'exécute sur le serveur ; l'APK ne contient aucun secret (ni clé d'API, ni secret OAuth, ni jeton LinkedIn).

## Backend (`backend/`)

| Dossier | Contenu |
|---|---|
| `app/Services/Llm` | `LlmProvider` (interface), `AnthropicProvider`, `OpenAiCompatibleProvider`, `LlmManager` |
| `app/Services/Content` | `TopicSelector` (calendrier, rotation), `SourceCollector` (CISA KEV, CERT-FR), `PromptBuilder` (charte éditoriale), `ArticleParser`, `QualityChecker`, `Similarity`, `ArticleGenerator` |
| `app/Services/LinkedIn` | `LinkedInClient` (OAuth 2.0, OpenID Connect, API Posts), `LittleText` (format du texte), `PostResult` |
| `app/Services/Publishing` | `Publisher` : publication avec garanties anti-doublon |
| `app/Services/Scheduling` | `ScheduleCalculator` (calculs horaires purs), `Automation` (orchestration de l'ordonnanceur) |
| `app/Services/Notify` | `Notifier` (base + push), `FcmClient` (FCM HTTP v1), `ActivityLog` (journal métier) |
| `app/Http/Controllers/Api` | contrôleurs REST |
| `app/Console/Commands` | commandes artisan (ordonnanceur, création de compte, diagnostics) |
| `app/Support` | catalogue éditorial, initialisation des comptes, masquage des secrets dans les journaux |
| `database/migrations` | schéma complet |
| `tests/` | tests unitaires et fonctionnels (PHPUnit), test de bout en bout `tests/e2e` |

### Tables

| Table | Rôle |
|---|---|
| `users` | comptes (rôle `owner` ou `viewer`) |
| `personal_access_tokens` | jetons d'API de l'application (Sanctum, 90 jours) |
| `linkedin_accounts` | compte LinkedIn connecté ; jetons **chiffrés** (AES-256 via `APP_KEY`) |
| `oauth_states` | états OAuth à usage unique (anti-CSRF, 10 min, stockés hachés) |
| `editorial_categories` | catégories, angles de sujets, activation, dernière utilisation |
| `publication_schedules` | calendrier éditorial (jour ISO → catégories) |
| `application_settings` | heure, jours, fuseau, mode, longueur, ton, hashtags, fournisseur, langue, profil éditorial |
| `articles` | titre, catégorie, sujet, contenu, hashtags, sources, dates de génération / prévue / publication, statut, URN LinkedIn, erreurs, score qualité |
| `publications` | une ligne par article : statut, tentatives, prochaine tentative, URN, code HTTP, clé d'idempotence |
| `notifications` | notifications de l'utilisateur (avec clé de déduplication) |
| `publication_logs` | journal des opérations (12 mois) |
| `device_tokens` | jetons FCM des appareils (chiffrés) |
| `system_heartbeats` | dernière exécution de chaque tâche (santé du planificateur) |

### Cycle de vie d'un article

```
generating ──▶ approved ───────────────▶ publishing ──▶ published
    │            ▲  (mode automatique,       │
    │            │   contrôle qualité OK)    ├──▶ retry_scheduled ──▶ publishing (connexion impossible, 429)
    │      needs_review (mode validation,    ├──▶ failed      (401, 403, 426, 4xx, jeton expiré)
    │       problème qualité, créneau        └──▶ uncertain   (5xx, délai dépassé, interruption)
    ▼       manqué) ── validation ──▶ approved          │
generation_failed (reprise automatique                  └── vérification humaine ──▶ published | failed
                   si l'erreur est temporaire)
```

### Garanties anti-doublon (idempotence)

1. **Un article par jour** : contrainte unique `(user_id, slot_date)` ; deux exécutions simultanées ne peuvent pas créer
   deux articles pour le même créneau.
2. **Jamais le même contenu** : contrainte unique `(user_id, content_hash)` et refus de publier un contenu identique
   à un article déjà publié.
3. **Une publication par article** : contrainte unique `publications.article_id`, `linkedin_post_urn` unique.
4. **Réservation atomique** : verrou applicatif par article (`Cache::lock`) puis `SELECT … FOR UPDATE` ;
   le statut passe à `publishing` **avant** l'appel réseau.
5. **Aucun renvoi en cas de doute** : si LinkedIn a pu recevoir la requête (délai dépassé, 5xx, coupure, processus
   interrompu pendant l'appel), l'article passe `uncertain` ; aucune nouvelle tentative automatique ni manuelle n'est
   possible tant que l'utilisateur n'a pas indiqué, après vérification de son profil, si le post est en ligne.
   (L'API LinkedIn n'offre ni clé d'idempotence ni lecture des posts du membre pour les applications standard.)
6. **Reprise sûre** : seules les erreurs prouvant que rien n'a été créé (connexion impossible avant envoi, 429)
   donnent lieu à de nouvelles tentatives (2, 5, 10, 20 min, maximum 4).
7. **Publié = confirmé** : un article n'est marqué « publié » que sur réponse HTTP 201 de LinkedIn.

### Ponctualité de 06h30

- cron chaque minute : la tâche `publish-due` s'exécute à 06h30:00 et publie dans les secondes qui suivent ;
- génération anticipée (60 min par défaut, réglable ; 720 min conseillées en mode validation) ;
- génération et publication sont deux tâches indépendantes : une génération lente ne bloque pas la publication ;
- fuseau `Africa/Abidjan` (GMT, sans heure d'été) ; tout autre fuseau IANA est accepté, heures d'été comprises.

## Application Android (`android/`)

| Paquet | Contenu |
|---|---|
| `data/remote` | DTO (kotlinx.serialization), interface Retrofit `CyberPostApi`, `ApiClient` (OkHttp, jeton, journal masqué) |
| `data/local` | cache Room (articles, notifications, instantané du tableau de bord) pour la consultation hors ligne |
| `data` | `Repository` (source unique de données), `SessionStore` (jeton chiffré par l'Android Keystore), `ServerUrl` (HTTPS obligatoire) |
| `notifications` | canaux, `CyberPostMessagingService` (FCM), `PushManager` (initialisation Firebase sans `google-services.json`), `SyncWorker` (secours) |
| `ui/screens` | écrans et ViewModels (MVVM) : connexion, tableau de bord, articles, détail, calendrier, alertes, paramètres |
| `ui/theme`, `ui/components` | thème SOC sombre, composants (panneaux, voyants, puces de statut) |

Le WorkManager ne sert **qu'à la synchronisation des alertes** ; la publication à heure fixe ne dépend jamais du téléphone.

## Sécurité

- HTTPS obligatoire (middleware `RequireHttps` en production, HSTS ; l'application refuse les adresses `http://`
  hors développement local) ;
- authentification par jeton Sanctum (90 jours, un par appareil), réponse identique et temps constant pour un compte
  inexistant ou un mauvais mot de passe ;
- limitation des requêtes : connexion 5/min par compte et 20/min par IP, API 120/min, génération 20/h, publication 3/min ;
- rôles : `owner` (modification) et `viewer` (lecture seule) ;
- validation stricte de toutes les entrées ; Eloquent et requêtes paramétrées (pas de SQL concaténé) ;
- jetons LinkedIn et jetons FCM chiffrés en base ; jamais renvoyés par l'API ;
- secrets masqués dans tous les journaux (`RedactingTap`, `Redactor`) ;
- OAuth : paramètre `state` aléatoire, haché, à usage unique, expirant après 10 minutes ;
- côté Android : jeton chiffré (AES-GCM, clé non exportable dans l'Android Keystore), sauvegarde Android désactivée,
  trafic en clair interdit, journal HTTP uniquement en debug avec en-tête `Authorization` masqué.
