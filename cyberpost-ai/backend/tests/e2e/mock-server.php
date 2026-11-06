<?php
/*
 * Simulateur de LinkedIn et du fournisseur de génération pour les tests de
 * bout en bout (php -S 127.0.0.1:8099 mock-server.php). Il enregistre chaque
 * requête reçue dans mock-requests.jsonl afin de vérifier l'absence de doublon.
 * Il ne sert qu'aux tests : il n'est jamais utilisé en production.
 */
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$log = __DIR__.'/mock-requests.jsonl';
$body = file_get_contents('php://input');
$headers = function_exists('getallheaders') ? getallheaders() : [];
file_put_contents($log, json_encode(['method' => $_SERVER['REQUEST_METHOD'], 'path' => $path, 'headers' => $headers, 'body' => $body], JSON_UNESCAPED_UNICODE)."\n", FILE_APPEND);
header('Content-Type: application/json');

switch (true) {
    // ----------------------------------------------------- LinkedIn OAuth (www)
    case $path === '/linkedin-www/oauth/v2/authorization':
        // Simule l'accord explicite de l'utilisateur puis la redirection vers le backend
        header('Location: '.$_GET['redirect_uri'].'?code=code-e2e&state='.urlencode($_GET['state']), true, 302);
        exit;
    case $path === '/linkedin-www/oauth/v2/accessToken':
        parse_str($body, $form);
        if (($form['code'] ?? '') !== 'code-e2e' || ($form['client_secret'] ?? '') !== 'e2e-secret') {
            http_response_code(400);
            echo json_encode(['error' => 'invalid_request']);
            exit;
        }
        echo json_encode(['access_token' => 'AQE2E-access-token-'.bin2hex(random_bytes(8)), 'expires_in' => 5184000, 'scope' => 'openid,profile,w_member_social']);
        exit;
    // ----------------------------------------------------- LinkedIn API
    case $path === '/linkedin-api/v2/userinfo':
        echo json_encode(['sub' => 'e2eMember01', 'name' => 'Hissein Banaye Hassan', 'given_name' => 'Hissein', 'family_name' => 'Banaye Hassan']);
        exit;
    case $path === '/linkedin-api/rest/posts':
        $p = json_decode($body, true);
        $ok = ($headers['Linkedin-Version'] ?? $headers['linkedin-version'] ?? '') !== ''
            && str_starts_with($headers['Authorization'] ?? $headers['authorization'] ?? '', 'Bearer AQE2E')
            && ($p['author'] ?? '') === 'urn:li:person:e2eMember01' && ! empty($p['commentary']);
        if (! $ok) {
            http_response_code(422);
            echo json_encode(['message' => 'Requête invalide pour le simulateur']);
            exit;
        }
        http_response_code(201);
        header('x-restli-id: urn:li:share:'.(7100000000000000000 + random_int(1, 999999)));
        exit;
    // ----------------------------------------------------- Fournisseur de génération (API Messages)
    case $path === '/anthropic/v1/messages':
        $seed = bin2hex(random_bytes(6));
        $paras = [
            "Une alerte bien triée vaut mieux que dix alertes escaladées sans contexte. C'est la leçon que je retiens de la discipline d'un SOC, et elle mérite qu'on s'y attarde (référence $seed).",
            "Au niveau 1, la tentation est forte de transmettre tout ce qui semble suspect. Pourtant, l'analyste qui reçoit l'escalade a surtout besoin de trois éléments : ce qui a déclenché l'alerte, ce qui a déjà été vérifié, et pourquoi le doute persiste.",
            "Prenons un cas typique : une authentification réussie depuis un pays inhabituel pour un compte administrateur. Avant d'escalader, on vérifie l'historique de connexion du compte, la présence d'un déplacement connu, l'appareil utilisé et les actions réalisées juste après la connexion.",
            "Ce travail préalable ne retarde pas la réponse : il l'accélère. Le niveau 2 peut alors se concentrer sur l'investigation au lieu de refaire les vérifications de base, et le délai de confinement diminue.",
            "À mon sens, la qualité d'un SOC se mesure moins au nombre d'alertes traitées qu'à la qualité des tickets qui circulent entre les niveaux. Un ticket clair, daté et argumenté est un outil de transmission, mais aussi un support d'apprentissage pour toute l'équipe.",
            "Et vous, quelles informations exigez-vous dans une escalade avant d'ouvrir une investigation ?",
        ];
        echo json_encode(['content' => [['type' => 'text', 'text' => json_encode([
            'title' => "Escalader une alerte : ce que le niveau 2 attend vraiment ($seed)",
            'content' => implode("\n\n", $paras),
            'hashtags' => ['CyberSecurity', 'SOC', 'IncidentResponse', 'BlueTeam', 'SecurityOperations'],
            'sources' => [],
        ], JSON_UNESCAPED_UNICODE)]]]);
        exit;
    default:
        http_response_code(404);
        echo json_encode(['message' => 'inconnu']);
}
