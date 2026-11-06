# Procédure de test de bout en bout

## 1. Tests automatisés du backend (56 tests)

```bash
cd backend
php artisan test                      # SQLite en mémoire
# même suite sur MySQL / MariaDB :
DB_CONNECTION=mysql DB_HOST=127.0.0.1 DB_DATABASE=cyberpost_test DB_USERNAME=... DB_PASSWORD=... php artisan test
```

Couverture des exigences :

| Exigence | Test(s) |
|---|---|
| 06h30 Africa/Abidjan, lundi au vendredi | `ScheduleCalculatorTest`, `AutomationTest::cycle_complet…`, `semaine_complete_cinq_publications` |
| Aucune publication le week-end | `aucun_creneau_le_samedi…`, `aucune_publication_le_week_end` |
| Changements de fuseau (dont heure d'été) | `changement_de_fuseau_horaire`, `changement_dheure_reprogramme_les_articles` |
| Génération avant l'heure, une seule par jour | `fenetre_de_generation`, `une_seule_generation_par_jour…` |
| Erreurs réseau et reprises | `connexion_impossible_puis_reprise_automatique`, `limite_429…`, `erreur_temporaire_du_fournisseur…` |
| Réponse incertaine sans double publication | `reponse_500…`, `delai_depasse…`, `publication_interrompue…`, `deux_publications_simultanees…` |
| Expiration des jetons | `jeton_refuse_401…`, `jeton_expire_avant_envoi…`, `avertissement_avant_expiration…` |
| Permissions LinkedIn et version d'API | `permission_absente_403_et_version_retiree_426` |
| Mode validation | `mode_validation_attend_lapprobation` |
| Redémarrage du backend | `serveur_indisponible_au_creneau…`, `redemarrage_dans_la_fenetre…` |
| Qualité et faits inventés | `QualityCheckerTest` (CVE, statistiques, clichés, anecdotes, similarité) |
| Actualité sourcée | `sujet_dactualite_redige_uniquement_avec_les_sources_officielles`, `sans_source_dactualite…` |
| Connexion LinkedIn OAuth | `connexion_linkedin_oauth_de_bout_en_bout`, `refus_dautorisation_linkedin` |
| Sécurité de l'API | `les_jetons_et_secrets_ne_sont_jamais_exposes`, `le_role_lecture_seule…`, `isolation_des_articles…`, `limitation_des_tentatives…`, `https_obligatoire_en_production` |
| Notifications | `enregistrement_appareil_et_notifications` + assertions dans `AutomationTest` |

## 2. Test de bout en bout réel (backend lancé + simulateur LinkedIn)

```bash
cd backend
bash tests/e2e/run-e2e.sh
```

Le script démarre le backend réel (`php artisan serve`) et un simulateur des API LinkedIn et du fournisseur de génération,
puis vérifie : connexion de l'application, flux OAuth complet par redirections HTTP, génération à 05h30, rien à 06h29,
publication à 06h30 confirmée par HTTP 201, redémarrage du backend sans doublon, aucune activité le week-end,
notifications, refus de republication, absence de jeton dans les réponses. Il enregistre aussi les réponses JSON
utilisées par les tests de contrat Android.

## 3. Tests de l'application Android (22 tests)

```bash
cd android
./gradlew testDebugUnitTest
```

- `ContractTest` : interprétation des réponses réelles du backend ;
- `RetrofitApiTest` : routes, méthodes HTTP, corps envoyés, messages d'erreur ;
- `ServerUrlTest` : HTTPS obligatoire ;
- `StatusMappingTest` : voyants vert / orange / rouge ;
- `ScreenRenderTest` : rendu réel des 7 écrans (Robolectric), captures dans `app/build/screenshots`.

## 4. Recette avec le vrai LinkedIn (à faire une fois en production)

> LinkedIn ne fournit pas d'environnement de test séparé : la publication réelle se vérifie sur votre profil.
> Pour un premier essai sans exposer de contenu, vous pouvez créer un compte LinkedIn de test personnel.

1. Backend déployé en HTTPS, cron actif (`php artisan cyberpost:status`).
2. Application installée, connexion au serveur, tableau de bord : planificateur au vert.
3. Paramètres › **Connecter mon LinkedIn** : autoriser ; le statut passe à « Connecté et autorisé à publier ».
   Vérification serveur : `php artisan cyberpost:linkedin:check votre@email`.
4. Fournisseur de génération : `php artisan cyberpost:generate votre@email` affiche un article (non publié).
5. Articles › **Générer un article** › ouvrir l'article › **Publier maintenant** ; vérifier :
   - la notification « Publication réussie » sur le téléphone ;
   - le post sur votre profil LinkedIn (bouton **Voir sur LinkedIn**) ;
   - un second appui sur **Publier maintenant** est refusé (« Cet article est déjà publié »).
6. Programmation : Paramètres › heure = maintenant + 5 min, enregistrer ; vérifier la génération puis la publication
   à l'heure exacte, **application fermée et téléphone éteint** ; remettre 06:30.
7. Mode validation : désactiver « Mode automatique », générer, vérifier que rien n'est publié sans **Valider**.
8. Expiration : Paramètres › **Déconnecter**, puis attendre un créneau : l'article passe en échec avec le message
   « Aucun compte LinkedIn connecté » et une notification d'échec est reçue ; reconnecter.

## 5. Ce qui n'a pas pu être testé dans l'environnement de développement

- la publication sur le vrai LinkedIn (nécessite votre application LinkedIn Developer et votre autorisation) ;
- la génération avec une vraie clé d'API (nécessite votre clé) ;
- l'affichage sur un téléphone physique ou un émulateur (non disponible ; les écrans ont été rendus avec Robolectric) ;
- les notifications FCM réelles (nécessitent votre projet Firebase).

L'étape 4 ci-dessus couvre ces points en conditions réelles.
