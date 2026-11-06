# Notifications

Chaque événement crée une notification **en base** (onglet **Alertes** de l'application) :
publication réussie, échec, jeton expiré ou bientôt expiré, article généré, publication programmée,
intervention nécessaire (validation, vérification d'une publication incertaine, créneau manqué).

Deux canaux de livraison sur le téléphone :

1. **Firebase Cloud Messaging (recommandé)** : notification immédiate, même application fermée ;
2. **Synchronisation de secours** : si FCM n'est pas configuré, l'application vérifie les nouvelles alertes
   toutes les 15 minutes (WorkManager) et les affiche. Ce mécanisme ne sert qu'à l'affichage : la publication
   est toujours assurée par le serveur.

Le tableau de bord indique « Notifications push : non configurées » tant que FCM n'est pas en place.

## Configurer Firebase Cloud Messaging

1. Créez un projet sur <https://console.firebase.google.com>.
2. **Ajouter une application Android** avec le nom de paquet `ci.cyberpost.app`
   (et `ci.cyberpost.app.debug` pour la version debug si nécessaire). Le fichier `google-services.json`
   n'est **pas** à intégrer dans l'APK : relevez simplement les valeurs suivantes dans les paramètres du projet
   (onglet Général, section « Vos applications ») :
   - `FCM_PROJECT_ID` : identifiant du projet ;
   - `FCM_ANDROID_APP_ID` : identifiant d'application (`1:…:android:…`) ;
   - `FCM_ANDROID_API_KEY` : clé d'API Web/Android du projet ;
   - `FCM_SENDER_ID` : numéro d'expéditeur (Cloud Messaging).
   Ces identifiants sont publics par nature (présents dans toute application Firebase) ; le backend les transmet
   à l'application, qui initialise Firebase au démarrage.
3. **Compte de service** (secret) : Paramètres du projet › Comptes de service › **Générer une nouvelle clé privée**.
   Copiez le fichier JSON sur le serveur, hors du dossier public :
   ```bash
   sudo install -o www-data -m 600 service-account.json /etc/cyberpost/fcm-service-account.json
   ```
   et renseignez `FCM_SERVICE_ACCOUNT_PATH=/etc/cyberpost/fcm-service-account.json`.
4. `php artisan config:cache`, puis reconnectez-vous dans l'application : l'appareil s'enregistre automatiquement.

Le backend utilise l'API **FCM HTTP v1** (jeton OAuth signé avec la clé du compte de service). Les jetons
d'appareil invalides sont supprimés automatiquement.
