# Installation et déploiement du backend

Le backend doit tourner sur un **serveur accessible en permanence** (VPS, serveur dédié) : c'est lui qui génère
et publie, même lorsque le téléphone est éteint ou l'application fermée.

## Prérequis

- Linux (Debian 12/13 ou Ubuntu 22.04/24.04 recommandés), 1 vCPU et 1 Go de RAM suffisent ;
- PHP **8.3** ou supérieur avec les extensions `mbstring`, `xml`, `curl`, `mysql`, `intl`, `zip`, `openssl`, `sodium` ;
- Composer 2 ; MySQL 8 ou MariaDB 10.11+ ; Nginx (ou Apache) ;
- un nom de domaine et un certificat TLS (Let's Encrypt) : **HTTPS est obligatoire**.

## 1. Paquets (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install -y nginx mariadb-server php8.3-fpm php8.3-cli php8.3-mbstring php8.3-xml \
     php8.3-curl php8.3-mysql php8.3-intl php8.3-zip unzip git certbot python3-certbot-nginx
curl -sS https://getcomposer.org/installer | php && sudo mv composer.phar /usr/local/bin/composer
```

## 2. Base de données

```bash
sudo mysql -e "CREATE DATABASE cyberpost CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cyberpost'@'localhost' IDENTIFIED BY 'MOT_DE_PASSE_FORT';
GRANT ALL PRIVILEGES ON cyberpost.* TO 'cyberpost'@'localhost'; FLUSH PRIVILEGES;"
```

## 3. Code et configuration

```bash
sudo mkdir -p /var/www/cyberpost && sudo chown $USER /var/www/cyberpost
git clone <url-du-depot> /var/www/cyberpost/repo
cp -r /var/www/cyberpost/repo/cyberpost-ai/backend /var/www/cyberpost/backend
cd /var/www/cyberpost/backend
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
nano .env   # base de données, LinkedIn (docs/LINKEDIN.md), génération (docs/GENERATION.md)
php artisan migrate --force
php artisan config:cache && php artisan route:cache
sudo chown -R www-data:www-data storage bootstrap/cache
chmod 600 .env
```

> **Important** : la clé `APP_KEY` chiffre les jetons LinkedIn en base. Sauvegardez-la : si elle est perdue,
> il faudra reconnecter LinkedIn.

## 4. Créer votre compte

Il n'y a pas d'inscription publique. Créez le compte propriétaire (le mot de passe est demandé de façon masquée) :

```bash
php artisan cyberpost:user:create votre@email --name="Hissein Banaye Hassan"
```

Le profil éditorial, les catégories et le calendrier par défaut sont initialisés automatiquement
(publication 06h30, lundi à vendredi, Africa/Abidjan, mode automatique). Un rôle `viewer` (lecture seule)
est disponible avec `--role=viewer`.

## 5. Nginx et HTTPS

```bash
sudo cp /var/www/cyberpost/repo/cyberpost-ai/deploy/nginx-cyberpost.conf /etc/nginx/sites-available/cyberpost
sudo sed -i 's/cyberpost.example.com/VOTRE-DOMAINE/g' /etc/nginx/sites-available/cyberpost
sudo ln -s /etc/nginx/sites-available/cyberpost /etc/nginx/sites-enabled/
sudo certbot --nginx -d VOTRE-DOMAINE
sudo nginx -t && sudo systemctl reload nginx
```

Vérification : `curl https://VOTRE-DOMAINE/api/v1/health` renvoie `{"ok":true,...}`.

## 6. Configuration du cron (indispensable)

L'ordonnanceur Laravel est déclenché **chaque minute** par une seule entrée cron :

```bash
sudo crontab -u www-data -e
# ajouter :
* * * * * cd /var/www/cyberpost/backend && php artisan schedule:run >> /dev/null 2>&1
```

(le fichier `deploy/crontab.txt` contient cette ligne). Tâches planifiées (`php artisan schedule:list`) :

| Tâche | Fréquence | Rôle |
|---|---|---|
| `cyberpost:publish-due` | chaque minute | publie les articles validés dont l'heure est arrivée (06h30), reprises, détection des publications interrompues |
| `cyberpost:generate-due` | chaque minute | génère l'article du prochain créneau (60 min avant par défaut), reprises en cas d'erreur temporaire |
| `cyberpost:check-tokens` | chaque jour à 08h05 (Abidjan) | prévient avant l'expiration du jeton LinkedIn |
| `model:prune` | chaque mois | purge les journaux de plus de 12 mois |

Les deux tâches principales sont séparées et protégées contre les exécutions simultanées (`withoutOverlapping`,
`onOneServer`) : une génération lente ne peut pas retarder la publication de 06h30.

Contrôle après quelques minutes : `php artisan cyberpost:status` affiche la dernière exécution de chaque tâche ;
le tableau de bord de l'application passe le planificateur au vert.

## 7. Fuseau horaire et heure du serveur

Le serveur peut rester en UTC : les créneaux sont calculés dans le fuseau de l'utilisateur
(**Africa/Abidjan**, GMT sans heure d'été). Vérifiez que l'horloge est synchronisée :

```bash
timedatectl status   # « System clock synchronized: yes »
```

## 8. Mises à jour du backend

```bash
cd /var/www/cyberpost/backend
php artisan down
git -C ../repo pull && rsync -a --exclude .env --exclude storage ../repo/cyberpost-ai/backend/ ./
composer install --no-dev --optimize-autoloader
php artisan migrate --force && php artisan config:cache && php artisan route:cache
php artisan up
```

Un redémarrage du serveur ou du backend ne provoque **jamais** de double publication : l'état de chaque
publication est en base, et une publication interrompue au milieu de l'appel à LinkedIn est classée
« vérification nécessaire » au lieu d'être renvoyée.

## 9. Sauvegardes

- base MySQL : `mysqldump cyberpost > cyberpost-$(date +%F).sql` (quotidien) ;
- fichier `.env` (contient `APP_KEY` et les secrets) : à conserver hors du serveur, chiffré.

## 10. Fenêtre de rattrapage

Si le serveur est indisponible à 06h30, la publication est rattrapée dès son retour **dans les 2 heures**
(`catch_up_window_minutes`). Au-delà, l'article passe « en attente » avec une notification
« Publication manquée » : rien n'est publié en retard sans votre accord.
