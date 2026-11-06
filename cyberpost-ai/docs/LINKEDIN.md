# Connexion à LinkedIn (LinkedIn Developer Portal)

CyberPost AI utilise **exclusivement l'API officielle de LinkedIn** et le protocole **OAuth 2.0** :
aucun scraping, aucune automatisation de navigateur, aucun mot de passe LinkedIn stocké.

## 1. Créer l'application LinkedIn

1. Connectez-vous sur <https://www.linkedin.com/developers/apps> et cliquez sur **Create app**.
2. Renseignez :
   - **App name** : CyberPost AI (ou le nom de votre choix) ;
   - **LinkedIn Page** : LinkedIn exige d'associer une page entreprise. Créez une page si vous n'en avez pas
     (cela n'a aucun effet sur la publication, qui se fait sur votre profil personnel) ;
   - **App logo**, **Privacy policy URL** si demandés.
3. Validez la vérification de la page si LinkedIn la demande.

## 2. Ajouter les produits nécessaires

Onglet **Products** :

| Produit | Permissions (scopes) | Rôle dans CyberPost AI |
|---|---|---|
| **Sign In with LinkedIn using OpenID Connect** | `openid`, `profile` | identifier le membre (champ `sub` de `/v2/userinfo`) et construire l'auteur `urn:li:person:{sub}` |
| **Share on LinkedIn** | `w_member_social` | créer des publications au nom du membre authentifié |

Ces deux produits sont en libre-service (« self-serve ») : ils sont généralement accordés immédiatement.
Si LinkedIn refuse ou retire l'un d'eux, l'application affiche l'état exact :
« Permission w_member_social absente » ou « Accès refusé par LinkedIn ». Elle ne prétend jamais avoir publié.

## 3. Déclarer l'URL de redirection

Onglet **Auth**, rubrique **OAuth 2.0 settings** › **Authorized redirect URLs** :

```
https://VOTRE-DOMAINE/linkedin/callback
```

Elle doit être **strictement identique** à la variable `LINKEDIN_REDIRECT_URI` du fichier `.env`.

## 4. Renseigner le backend

Toujours dans l'onglet **Auth**, copiez **Client ID** et **Primary Client Secret** dans `backend/.env` :

```ini
LINKEDIN_CLIENT_ID=xxxxxxxxxxxx
LINKEDIN_CLIENT_SECRET=xxxxxxxxxxxx
LINKEDIN_REDIRECT_URI=https://VOTRE-DOMAINE/linkedin/callback
LINKEDIN_SCOPES="openid profile w_member_social"
LINKEDIN_API_VERSION=202610
```

Puis `php artisan config:cache`. Le secret ne quitte jamais le serveur et n'est jamais transmis à l'application Android.

## 5. Connecter votre compte depuis l'application

Application › **Paramètres** › **Connecter mon LinkedIn** :

1. le navigateur s'ouvre sur la page d'autorisation officielle de LinkedIn ;
2. vous vous connectez à LinkedIn (sur le site de LinkedIn) et **autorisez explicitement** l'application ;
3. LinkedIn redirige vers `https://VOTRE-DOMAINE/linkedin/callback` ; le backend échange le code contre un jeton
   (vérification d'un paramètre `state` à usage unique, valable 10 minutes) ;
4. le serveur renvoie vers l'application (`cyberpost://linkedin?status=success`) qui affiche « Connecté ».

Vérification en ligne de commande, sans rien publier :

```bash
php artisan cyberpost:linkedin:check votre@email
```

## 6. Durée de validité des jetons

- Les jetons d'accès LinkedIn sont valables **60 jours**.
- Les jetons de rafraîchissement (« programmatic refresh tokens ») ne sont accordés qu'à certains partenaires LinkedIn.
  Si votre application en reçoit un, CyberPost AI renouvelle automatiquement l'accès ; sinon :
  - une notification est envoyée **7 jours** avant l'expiration, puis rappelée ;
  - à l'expiration, les publications sont suspendues (aucun appel n'est fait) et l'application affiche
    « Jeton expiré : reconnectez votre compte » ;
  - il suffit d'appuyer sur **Reconnecter** (deux clics, environ une fois tous les deux mois).

## 7. Détails techniques de la publication

- Point d'accès : `POST https://api.linkedin.com/rest/posts`
- En-têtes : `Authorization: Bearer …`, `Linkedin-Version: 202610`, `X-Restli-Protocol-Version: 2.0.0`
- Corps : `author = urn:li:person:{sub}`, `visibility = PUBLIC`, `distribution.feedDistribution = MAIN_FEED`,
  `lifecycleState = PUBLISHED`, texte dans `commentary` au format « little text » (caractères réservés échappés,
  hashtags au format `{hashtag|\#|Tag}`).
- Succès : **HTTP 201** et en-tête `x-restli-id` (`urn:li:share:…`) ; c'est la **seule** condition pour qu'un article
  soit marqué « Publié ».

### Version de l'API

LinkedIn publie une version mensuelle (format AAAAMM), maintenue au moins un an. Quand une version est retirée,
LinkedIn répond **HTTP 426**. CyberPost AI marque alors la publication en échec avec le message
« Version d'API LinkedIn retirée : mettez à jour LINKEDIN_API_VERSION ». Mettez la variable à jour
(une version récente listée sur <https://learn.microsoft.com/en-us/linkedin/marketing/versioning>) puis
`php artisan config:cache`.

### Codes d'erreur et comportement

| Réponse LinkedIn | Comportement |
|---|---|
| 201 | publié, identifiant enregistré, notification de succès |
| connexion impossible (DNS, refus de connexion) | requête non envoyée : nouvelle tentative après 2, 5, 10 puis 20 min |
| 429 | limite atteinte : nouvelle tentative différée |
| 401 | compte marqué expiré, notification « Jeton LinkedIn expiré » |
| 403 | échec : permission `w_member_social` absente (message explicite) |
| 426 | échec : version d'API retirée |
| 400, 422 | échec : contenu refusé (message de LinkedIn affiché) |
| 5xx, délai dépassé, coupure | **publication incertaine** : aucune nouvelle tentative automatique, vérification demandée |

## 8. Limites connues

- LinkedIn applique des limites quotidiennes par membre et par application, visibles dans l'onglet **Analytics**
  du portail. Une publication par jour ouvré reste très en deçà.
- L'API ne permet pas aux applications standard de relire les publications du membre (`r_member_social` est réservé) :
  c'est pourquoi une réponse incertaine demande une vérification humaine au lieu d'une vérification automatique.
