# API REST (v1)

Base : `https://VOTRE-DOMAINE/api/v1` · JSON · en-tête `Authorization: Bearer <jeton>` (sauf mention contraire).
Les erreurs renvoient `{"message": "..."}` en français avec le code HTTP adapté (401, 403, 404, 409, 422, 429).

| Méthode | Route | Rôle | Description |
|---|---|---|---|
| GET | `/health` | public | état du service |
| POST | `/auth/login` | public | `{email, password, device_name}` → `{token, user}` |
| POST | `/auth/logout` | tous | révoque le jeton courant |
| GET | `/me` | tous | utilisateur courant |
| GET | `/dashboard` | tous | voyant global, LinkedIn, prochaine publication, statistiques, composants, erreurs récentes |
| GET | `/articles?status=` | tous | liste paginée (50) |
| GET | `/articles/{id}` | tous | article complet (contenu, hashtags, sources, qualité, URN LinkedIn) |
| PUT | `/articles/{id}` | owner | `{title, content, hashtags[]}` |
| DELETE | `/articles/{id}` | owner | suppression |
| POST | `/articles/generate` | owner | `{category_slug?}` → 202, génération asynchrone |
| POST | `/articles/{id}/regenerate` | owner | régénération asynchrone |
| POST | `/articles/{id}/approve` | owner | validation (mode validation) |
| POST | `/articles/{id}/publish-now` | owner | publication immédiate (refusée si déjà publiée ou incertaine) |
| POST | `/articles/{id}/schedule` | owner | `{scheduled_for: ISO 8601}` |
| POST | `/articles/{id}/resolve` | owner | `{published: bool, post_url?}` après vérification d'une publication incertaine |
| GET / PUT | `/calendar` | tous / owner | calendrier hebdomadaire et 10 prochains créneaux |
| GET | `/categories` | tous | catégories éditoriales |
| PUT | `/categories/{slug}` | owner | `{enabled}` |
| GET / PUT | `/settings` | tous / owner | paramètres (heure, jours, fuseau, mode, contenu, fournisseur, langue, profil éditorial) |
| GET | `/providers` | tous | fournisseurs de génération et état de configuration (sans secret) |
| GET | `/linkedin/status` | tous | `not_configured`, `not_connected`, `connected`, `expiring`, `expired` |
| POST | `/linkedin/connect` | owner | renvoie l'URL d'autorisation LinkedIn |
| POST | `/linkedin/disconnect` | owner | supprime les jetons du serveur |
| GET | `/notifications` | tous | 100 dernières notifications |
| POST | `/notifications/{id}/read`, `/notifications/read-all` | tous | marquer comme lues |
| POST / DELETE | `/devices` | tous | enregistrer / retirer un jeton FCM |
| GET | `/push-config` | tous | configuration Firebase publique pour l'application |
| GET | `/logs?level=` | tous | journal des opérations |

Route web : `GET /linkedin/callback` (redirection OAuth de LinkedIn, renvoie vers `cyberpost://linkedin?status=…`).

Des exemples de réponses réelles se trouvent dans `android/app/src/test/resources/contract/`.
