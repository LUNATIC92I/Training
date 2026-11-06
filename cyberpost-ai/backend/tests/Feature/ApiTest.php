<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\LinkedInAccount;
use App\Models\User;
use App\Support\UserBootstrapper;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\CyberPostHelpers;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase, CyberPostHelpers;

    private function token(User $u): array
    {
        return ['Authorization' => 'Bearer '.$u->createToken('test')->plainTextToken, 'Accept' => 'application/json'];
    }

    #[Test] public function connexion_et_erreurs_dauthentification(): void
    {
        $u = $this->makeOwner();
        $this->postJson('/api/v1/auth/login', ['email' => $u->email, 'password' => 'mauvais', 'device_name' => 'Pixel'])
            ->assertStatus(422)->assertJson(['message' => 'Identifiants incorrects.']);
        $this->postJson('/api/v1/auth/login', ['email' => 'inconnu@example.com', 'password' => 'x', 'device_name' => 'Pixel'])
            ->assertStatus(422)->assertJson(['message' => 'Identifiants incorrects.']);
        $res = $this->postJson('/api/v1/auth/login', ['email' => $u->email, 'password' => 'Mot-de-passe-123', 'device_name' => 'Pixel'])
            ->assertOk()->assertJsonPath('user.role', 'owner');
        $this->getJson('/api/v1/me', ['Authorization' => 'Bearer '.$res->json('token')])->assertOk()->assertJsonPath('data.email', $u->email);
        $this->app['auth']->forgetGuards(); // le garde mémorise l'utilisateur entre deux requêtes d'un même test
        $this->getJson('/api/v1/dashboard')->assertStatus(401)->assertJson(['message' => 'Authentification requise.']);
    }

    #[Test] public function connexion_insensible_a_la_casse_de_le_mail(): void
    {
        User::create(['name' => 'X', 'email' => 'Hissein.Banaye@Example.COM', 'password' => 'Mot-de-passe-123', 'role' => 'owner']);
        $this->postJson('/api/v1/auth/login', ['email' => 'hissein.banaye@example.com', 'password' => 'Mot-de-passe-123', 'device_name' => 'P'])->assertOk();
    }

    #[Test] public function limitation_des_tentatives_de_connexion(): void
    {
        $u = $this->makeOwner();
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/login', ['email' => $u->email, 'password' => 'x', 'device_name' => 'P']);
        }
        $this->postJson('/api/v1/auth/login', ['email' => $u->email, 'password' => 'Mot-de-passe-123', 'device_name' => 'P'])->assertStatus(429);
    }

    #[Test] public function tableau_de_bord_indique_les_services_non_configures(): void
    {
        config(['cyberpost.linkedin.client_id' => null]);
        $u = $this->makeOwner();
        $this->getJson('/api/v1/dashboard', $this->token($u))->assertOk()
            ->assertJsonPath('data.status.level', 'red')
            ->assertJsonPath('data.linkedin.status', 'not_configured')
            ->assertJsonPath('data.scheduler.status', 'error')
            ->assertJsonPath('data.schedule.time', '06:30')
            ->assertJsonPath('data.schedule.days', [1, 2, 3, 4, 5])
            ->assertJsonPath('data.schedule.timezone', 'Africa/Abidjan')
            ->assertJsonStructure(['data' => ['next_publication' => ['at', 'local_time'], 'stats', 'generator', 'push', 'recent_errors']]);
    }

    #[Test] public function les_jetons_et_secrets_ne_sont_jamais_exposes(): void
    {
        $u = $this->makeOwner();
        $acc = $this->connectLinkedIn($u);
        $h = $this->token($u);
        foreach (['/api/v1/dashboard', '/api/v1/linkedin/status', '/api/v1/settings', '/api/v1/providers', '/api/v1/logs', '/api/v1/push-config'] as $url) {
            $body = $this->getJson($url, $h)->assertOk()->getContent();
            $this->assertStringNotContainsString('AQV-secret-access-token', $body, $url);
            $this->assertStringNotContainsString('test-anthropic-key', $body, $url);
            $this->assertStringNotContainsString('test-client-secret', $body, $url);
        }
        // Jeton chiffré en base
        $raw = \DB::table('linkedin_accounts')->value('access_token');
        $this->assertStringNotContainsString('AQV-secret', $raw);
        $this->assertSame('AQV-secret-access-token-value-0123456789abcdefghijklmnopqrstuvwxyz', $acc->fresh()->access_token);
    }

    #[Test] public function le_role_lecture_seule_ne_peut_rien_modifier(): void
    {
        $owner = $this->makeOwner();
        $viewer = User::create(['name' => 'V', 'email' => 'v@example.com', 'password' => 'Mot-de-passe-123', 'role' => 'viewer']);
        UserBootstrapper::bootstrap($viewer);
        $h = $this->token($viewer);
        $this->getJson('/api/v1/settings', $h)->assertOk();
        $this->putJson('/api/v1/settings', [], $h)->assertStatus(403);
        $this->postJson('/api/v1/linkedin/connect', [], $h)->assertStatus(403);
        $this->postJson('/api/v1/articles/generate', [], $h)->assertStatus(403);
    }

    #[Test] public function isolation_des_articles_entre_utilisateurs(): void
    {
        $a = $this->makeOwner();
        $b = $this->makeOwner();
        $art = Article::create(['user_id' => $a->id, 'title' => 'privé', 'content' => str_repeat('contenu ', 30), 'status' => Article::NEEDS_REVIEW]);
        $this->getJson("/api/v1/articles/{$art->id}", $this->token($b))->assertStatus(404);
        $this->postJson("/api/v1/articles/{$art->id}/publish-now", [], $this->token($b))->assertStatus(404);
    }

    #[Test] public function parametres_validation_et_mise_a_jour(): void
    {
        $u = $this->makeOwner();
        $h = $this->token($u);
        $s = $this->getJson('/api/v1/settings', $h)->json('data');
        $this->assertSame('Hissein Banaye Hassan', $s['author_name']);
        $this->assertSame('Senior SOC Analyst', $s['author_title']);
        $this->putJson('/api/v1/settings', array_merge($s, ['publish_time' => '25:00']), $h)->assertStatus(422);
        $this->putJson('/api/v1/settings', array_merge($s, ['timezone' => 'Mars/Olympus']), $h)->assertStatus(422);
        $this->putJson('/api/v1/settings', array_merge($s, ['publish_time' => '07:00', 'mode' => 'validation', 'language' => 'en', 'publish_days' => [1, 3, 5]]), $h)
            ->assertOk()->assertJsonPath('data.publish_time', '07:00')->assertJsonPath('data.mode', 'validation')->assertJsonPath('data.publish_days', [1, 3, 5]);
    }

    #[Test] public function cycle_article_via_lapi(): void
    {
        $u = $this->makeOwner(['mode' => 'validation']);
        $this->connectLinkedIn($u);
        $this->fakeServices();
        $h = $this->token($u);

        $id = $this->postJson('/api/v1/articles/generate', [], $h)->assertStatus(202)->json('article.id');
        $art = $this->getJson("/api/v1/articles/$id", $h)->assertOk()->json('data');
        $this->assertSame('needs_review', $art['status']);

        $this->putJson("/api/v1/articles/$id", ['title' => 'Titre revu', 'content' => $art['content']."\n\nAjout de l'auteur.", 'hashtags' => ['SOC', 'Cyber']], $h)
            ->assertOk()->assertJsonPath('data.title', 'Titre revu');
        $this->putJson("/api/v1/articles/$id", ['title' => 'x', 'content' => 'trop court', 'hashtags' => []], $h)->assertStatus(422);

        $this->postJson("/api/v1/articles/$id/schedule", ['scheduled_for' => now()->subDay()->toIso8601String()], $h)->assertStatus(422);
        $this->postJson("/api/v1/articles/$id/schedule", ['scheduled_for' => now()->addDay()->toIso8601String()], $h)->assertOk()
            ->assertJsonPath('article.status', 'approved');

        $this->postJson("/api/v1/articles/$id/publish-now", [], $h)->assertOk()->assertJsonPath('article.status', 'published')
            ->assertJsonPath('article.linkedin_post_url', 'https://www.linkedin.com/feed/update/urn:li:share:7000000000000000001/');
        $this->postJson("/api/v1/articles/$id/publish-now", [], $h)->assertStatus(422)->assertJsonPath('message', 'Cet article est déjà publié.');
        $this->assertSame(1, $this->linkedinPostCount());
        $this->putJson("/api/v1/articles/$id", ['title' => 'x', 'content' => str_repeat('modif ', 30), 'hashtags' => []], $h)->assertStatus(409);
    }

    #[Test] public function resolution_dune_publication_incertaine(): void
    {
        $u = $this->makeOwner();
        $h = $this->token($u);
        $art = Article::create(['user_id' => $u->id, 'title' => 't', 'content' => str_repeat('contenu ', 30), 'status' => Article::UNCERTAIN]);
        $this->postJson("/api/v1/articles/{$art->id}/resolve", ['published' => true, 'post_url' => 'https://www.linkedin.com/feed/update/urn:li:activity:7123456789/'], $h)
            ->assertOk()->assertJsonPath('article.status', 'published')->assertJsonPath('article.linkedin_post_urn', 'urn:li:activity:7123456789');
    }

    #[Test] public function connexion_linkedin_oauth_de_bout_en_bout(): void
    {
        $u = $this->makeOwner();
        $h = $this->token($u);
        $url = $this->postJson('/api/v1/linkedin/connect', [], $h)->assertOk()->json('data.authorization_url');
        $this->assertStringStartsWith('https://www.linkedin.com/oauth/v2/authorization?', $url);
        parse_str(parse_url($url, PHP_URL_QUERY), $q);
        $this->assertSame('openid profile w_member_social', $q['scope']);
        $this->assertSame('https://cyberpost.test/linkedin/callback', $q['redirect_uri']);

        Http::fake([
            'www.linkedin.com/oauth/v2/accessToken' => Http::response(['access_token' => 'AQX-new-token', 'expires_in' => 5184000, 'scope' => 'openid,profile,w_member_social']),
            'api.linkedin.com/v2/userinfo' => Http::response(['sub' => 'xyz789', 'name' => 'Hissein Banaye Hassan']),
        ]);
        // État invalide refusé
        $this->get('/linkedin/callback?code=abc&state=faux')->assertOk()->assertSee('Requête expirée ou invalide');

        $this->get('/linkedin/callback?code=abc&state='.$q['state'])->assertOk()->assertSee('cyberpost://linkedin?status=success', false);
        $acc = LinkedInAccount::where('user_id', $u->id)->sole();
        $this->assertSame('urn:li:person:xyz789', $acc->person_urn);
        $this->assertTrue($acc->hasScope('w_member_social'));
        $this->assertSame('connected', $this->getJson('/api/v1/linkedin/status', $h)->json('data.status'));
        Http::assertSent(fn ($r) => str_contains($r->url(), 'accessToken') && $r['grant_type'] === 'authorization_code' && $r['client_secret'] === 'test-client-secret');

        // Un état ne peut servir qu'une fois
        $this->get('/linkedin/callback?code=abc&state='.$q['state'])->assertSee('Requête expirée ou invalide');

        $this->postJson('/api/v1/linkedin/disconnect', [], $h)->assertOk();
        $this->assertSame('not_connected', $this->getJson('/api/v1/linkedin/status', $h)->json('data.status'));
    }

    #[Test] public function refus_dautorisation_linkedin(): void
    {
        $u = $this->makeOwner();
        $url = $this->postJson('/api/v1/linkedin/connect', [], $this->token($u))->json('data.authorization_url');
        parse_str(parse_url($url, PHP_URL_QUERY), $q);
        $this->get('/linkedin/callback?error=user_cancelled_authorize&state='.$q['state'])->assertSee('status=error', false)->assertSee('Autorisation annul');
        $this->assertNull(LinkedInAccount::first());
    }

    #[Test] public function calendrier_et_categories(): void
    {
        $u = $this->makeOwner();
        $h = $this->token($u);
        $cal = $this->getJson('/api/v1/calendar', $h)->assertOk()->json('data');
        $this->assertSame(['news-vulns', 'news-threats'], $cal['days'][2]['categories']);
        $this->assertFalse($cal['days'][5]['enabled']);
        $this->putJson('/api/v1/calendar', ['days' => [['weekday' => 1, 'categories' => ['pentest']]]], $h)->assertOk()
            ->assertJsonPath('data.days.0.categories', ['pentest']);
        $this->putJson('/api/v1/calendar', ['days' => [['weekday' => 1, 'categories' => ['inexistante']]]], $h)->assertStatus(422);
        $this->putJson('/api/v1/categories/pentest', ['enabled' => false], $h)->assertOk()->assertJsonPath('data.enabled', false);
    }

    #[Test] public function enregistrement_appareil_et_notifications(): void
    {
        $u = $this->makeOwner();
        $h = $this->token($u);
        $this->postJson('/api/v1/devices', ['fcm_token' => 'fcm-token-1'], $h)->assertOk();
        $this->postJson('/api/v1/devices', ['fcm_token' => 'fcm-token-1'], $h)->assertOk();
        $this->assertSame(1, \App\Models\DeviceToken::count());
        $this->getJson('/api/v1/push-config', $h)->assertOk()->assertJsonPath('data.configured', false);
        app(\App\Services\Notify\Notifier::class)->send($u, 'test', 'Titre', 'Corps', 'info');
        $this->getJson('/api/v1/notifications', $h)->assertOk()->assertJsonCount(1, 'data');
        $this->postJson('/api/v1/notifications/read-all', [], $h)->assertOk();
        $this->assertNotNull($this->getJson('/api/v1/notifications', $h)->json('data.0.read_at'));
    }

    #[Test] public function https_obligatoire_en_production(): void
    {
        $this->app['env'] = 'production';
        $this->getJson('http://localhost/api/v1/health')->assertStatus(403)->assertJson(['message' => 'HTTPS obligatoire.']);
        $this->getJson('https://localhost/api/v1/health')->assertOk()->assertHeader('Strict-Transport-Security');
    }

    #[Test] public function commandes_artisan_avec_heure_simulee(): void
    {
        $u = $this->makeOwner();
        $this->connectLinkedIn($u);
        $this->fakeServices();
        $this->travelTo(\Carbon\CarbonImmutable::parse('2026-11-09 05:30', 'UTC'));
        $this->artisan('cyberpost:generate-due', ['--now' => '2026-11-09 05:30'])->assertSuccessful();
        $this->travelTo(\Carbon\CarbonImmutable::parse('2026-11-09 06:30', 'UTC'));
        $this->artisan('cyberpost:publish-due', ['--now' => '2026-11-09 06:30'])->assertSuccessful();
        $this->assertSame(Article::PUBLISHED, Article::sole()->status);
        $this->artisan('cyberpost:status')->assertSuccessful();
    }

    #[Test] public function lordonnanceur_declare_les_taches_chaque_minute(): void
    {
        $events = collect(app(\Illuminate\Console\Scheduling\Schedule::class)->events());
        $publish = $events->first(fn ($e) => str_contains($e->command, 'cyberpost:publish-due'));
        $generate = $events->first(fn ($e) => str_contains($e->command, 'cyberpost:generate-due'));
        $this->assertSame('* * * * *', $publish->expression);
        $this->assertSame('* * * * *', $generate->expression);
        $this->assertTrue($publish->withoutOverlapping);
    }
}
