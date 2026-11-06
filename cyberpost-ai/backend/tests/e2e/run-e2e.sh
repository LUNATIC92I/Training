#!/usr/bin/env bash
# =============================================================================
# Test de bout en bout de CyberPost AI (backend réel + simulateur LinkedIn/LLM)
#
#  1. démarre un simulateur LinkedIn / génération (port 8099) et le backend (8000)
#  2. crée un compte, se connecte comme l'application Android
#  3. connecte LinkedIn par le flux OAuth complet (redirections HTTP réelles)
#  4. simule le lundi : génération à 05h30, rien à 06h29, publication à 06h30
#  5. redémarre le backend et vérifie l'absence de double publication
#  6. enregistre les réponses JSON pour les tests de contrat Android
#
# Usage : bash tests/e2e/run-e2e.sh   (depuis le dossier backend)
# =============================================================================
set -euo pipefail
cd "$(dirname "$0")/../.."
E2E=tests/e2e
OUT=${CONTRACT_OUT:-../android/app/src/test/resources/contract}
mkdir -p "$OUT"
rm -f $E2E/mock-requests.jsonl database/e2e.sqlite && touch database/e2e.sqlite
unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy || true
# Les variables déjà présentes dans l'environnement priment sur .env : on les neutralise.
for v in $(env | grep -oE "^(ANTHROPIC|OPENAI|CUSTOM_LLM|LLM|LINKEDIN|FCM|DB|CYBERPOST|NEWS)_[A-Z_]*"); do unset "$v"; done

cat > .env.e2e <<ENV
APP_NAME="CyberPost AI"
APP_ENV=local
APP_KEY=base64:$(head -c 32 /dev/urandom | base64)
APP_DEBUG=false
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=sqlite
DB_DATABASE=$(pwd)/database/e2e.sqlite
CACHE_STORE=file
SESSION_DRIVER=array
QUEUE_CONNECTION=sync
LOG_CHANNEL=single
CYBERPOST_ALLOW_TIME_TRAVEL=true
LINKEDIN_CLIENT_ID=e2e-client
LINKEDIN_CLIENT_SECRET=e2e-secret
LINKEDIN_REDIRECT_URI=http://127.0.0.1:8000/linkedin/callback
LINKEDIN_OAUTH_BASE=http://127.0.0.1:8099/linkedin-www
LINKEDIN_API_BASE=http://127.0.0.1:8099/linkedin-api
ANTHROPIC_API_KEY=e2e-key
ANTHROPIC_MODEL=e2e-model
ANTHROPIC_BASE_URL=http://127.0.0.1:8099/anthropic
NEWS_SOURCES_ENABLED=false
ENV

export APP_ENV=e2e
A="php artisan"
pass() { echo "  [OK] $1"; }
fail() { echo "  [ÉCHEC] $1"; exit 1; }
cleanup() { kill ${MOCK:-0} ${API:-0} 2>/dev/null || true; }
trap cleanup EXIT

php -S 127.0.0.1:8099 $E2E/mock-server.php >/dev/null 2>&1 & MOCK=$!
$A migrate:fresh --force -q
$A cyberpost:user:create e2e@cyberpost.test --name="Hissein Banaye Hassan" --password="E2e-Mot-De-Passe-2026" >/dev/null
$A serve --host=127.0.0.1 --port=8000 >/dev/null 2>&1 & API=$!
for i in $(seq 1 30); do curl -sf http://127.0.0.1:8000/api/v1/health >/dev/null && break; sleep 0.5; done
BASE=http://127.0.0.1:8000/api/v1
J='Accept: application/json'

echo "1. Connexion (comme l'application Android)"
LOGIN=$(curl -s -H "$J" -H 'Content-Type: application/json' -d '{"email":"e2e@cyberpost.test","password":"E2e-Mot-De-Passe-2026","device_name":"Pixel 9 (e2e)"}' $BASE/auth/login)
echo "$LOGIN" | sed -E 's/"token":"[^"]+"/"token":"1|jeton-de-test"/' > "$OUT/login.json"
TOKEN=$(echo "$LOGIN" | php -r 'echo json_decode(stream_get_contents(STDIN))->token;')
[ -n "$TOKEN" ] && pass "jeton Sanctum obtenu" || fail "connexion"
H="Authorization: Bearer $TOKEN"
get() { curl -s -H "$J" -H "$H" "$BASE/$1"; }
has() { php -r 'exit(str_contains(json_encode(json_decode(file_get_contents($argv[1])), JSON_UNESCAPED_UNICODE), $argv[2]) ? 0 : 1);' "$1" "$2"; }

curl -s -X PUT -H "$J" -H "$H" -H 'Content-Type: application/json' -d "$(get settings | php -r '$d=json_decode(stream_get_contents(STDIN),true)["data"];$d["article_length"]="medium";echo json_encode($d);')" $BASE/settings > /dev/null
get linkedin/status | grep -q '"not_connected"' && pass "LinkedIn non connecté au départ" || fail "statut LinkedIn initial"

echo "2. Connexion LinkedIn par OAuth 2.0"
AUTH_URL=$(curl -s -X POST -H "$J" -H "$H" $BASE/linkedin/connect | php -r 'echo json_decode(stream_get_contents(STDIN))->data->authorization_url;')
PAGE=$(curl -s -L "$AUTH_URL")
echo "$PAGE" | grep -q 'cyberpost://linkedin?status=success' && pass "retour vers l'application : succès" || fail "callback OAuth"
get linkedin/status | tee "$OUT/linkedin_status.json" | grep -q '"connected"' && pass "compte connecté et autorisé (w_member_social)" || fail "statut connecté"

echo "3. Lundi 9 novembre 2026 (heure d'Abidjan)"
$A cyberpost:generate-due --now="2026-11-09 05:29" | grep -q . && fail "génération avant 05h30" || pass "05h29 : aucune génération"
$A cyberpost:generate-due --now="2026-11-09 05:30" | grep -q "approved" && pass "05h30 : article généré et validé par le contrôle qualité" || fail "génération"
$A cyberpost:publish-due --now="2026-11-09 06:29" | grep -q . && fail "publication avant l'heure" || pass "06h29 : aucune publication"
$A cyberpost:publish-due --now="2026-11-09 06:30" | grep -q "created" && pass "06h30 : publié, création confirmée par LinkedIn (HTTP 201)" || fail "publication 06h30"
$A cyberpost:publish-due --now="2026-11-09 06:31" >/dev/null

echo "4. Redémarrage du backend"
kill $API; wait $API 2>/dev/null || true
$A serve --host=127.0.0.1 --port=8000 >/dev/null 2>&1 & API=$!
for i in $(seq 1 30); do curl -sf http://127.0.0.1:8000/api/v1/health >/dev/null && break; sleep 0.5; done
$A cyberpost:publish-due --now="2026-11-09 06:35" >/dev/null
$A cyberpost:generate-due --now="2026-11-09 06:35" >/dev/null
POSTS=$(grep -c '"path":"\\/linkedin-api\\/rest\\/posts"' $E2E/mock-requests.jsonl || true)
[ "$POSTS" = "1" ] && pass "une seule requête de publication reçue par LinkedIn" || fail "$POSTS publications reçues"

echo "5. Samedi et dimanche"
for d in 2026-11-14 2026-11-15; do
  $A cyberpost:generate-due --now="$d 05:30" | grep -q . && fail "génération le week-end"
  $A cyberpost:publish-due --now="$d 06:30" | grep -q . && fail "publication le week-end"
done
pass "aucune génération ni publication le week-end"

echo "6. Données consultées par l'application"
get dashboard > "$OUT/dashboard.json"
grep -q '"total_published":1' "$OUT/dashboard.json" && pass "tableau de bord : 1 article publié" || fail "statistiques"
get articles > "$OUT/articles.json"
ID=$(php -r '$d=json_decode(file_get_contents($argv[1]),true);echo $d["data"][0]["id"];' "$OUT/articles.json")
get "articles/$ID" > "$OUT/article.json"
grep -q 'urn:li:share:' "$OUT/article.json" && pass "article : identifiant LinkedIn enregistré" || fail "urn"
get calendar > "$OUT/calendar.json"; get settings > "$OUT/settings.json"; get categories > "$OUT/categories.json"
get notifications > "$OUT/notifications.json"; get providers > "$OUT/providers.json"; get logs > "$OUT/logs.json"; get push-config > "$OUT/push_config.json"
has "$OUT/notifications.json" 'publiée avec succès sur LinkedIn à 06h30' && pass "notification de succès créée" || fail "notification"
curl -s -X POST -H "$J" -H "$H" $BASE/articles/$ID/publish-now > "$OUT/action_refused.json"
has "$OUT/action_refused.json" 'déjà publié' && pass "republication manuelle refusée" || fail "doublon manuel"
if grep -q 'AQE2E-access-token' "$OUT"/*.json; then fail "jeton LinkedIn exposé"; else pass "aucun jeton LinkedIn dans les réponses de l'API"; fi

rm -f .env.e2e database/e2e.sqlite
echo "Test de bout en bout réussi."
