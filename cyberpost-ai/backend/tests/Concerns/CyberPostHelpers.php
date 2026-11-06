<?php

namespace Tests\Concerns;

use App\Models\LinkedInAccount;
use App\Models\User;
use App\Support\UserBootstrapper;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

trait CyberPostHelpers
{
    protected function makeOwner(array $settings = []): User
    {
        $user = User::create(['name' => 'Hissein Banaye Hassan', 'email' => 'owner'.Str::random(5).'@example.com', 'password' => 'Mot-de-passe-123', 'role' => 'owner']);
        UserBootstrapper::bootstrap($user);
        $user->settings->update(array_merge(['article_length' => 'medium', 'hashtags_count' => 5], $settings));
        return $user->fresh();
    }

    protected function connectLinkedIn(User $user, array $attrs = []): LinkedInAccount
    {
        return LinkedInAccount::create(array_merge([
            'user_id' => $user->id, 'member_id' => 'abc123', 'person_urn' => 'urn:li:person:abc123', 'name' => 'Hissein Banaye Hassan',
            'access_token' => 'AQV-secret-access-token-value-0123456789abcdefghijklmnopqrstuvwxyz', 'expires_at' => now()->addDays(50),
            'scopes' => 'openid profile w_member_social', 'status' => 'connected', 'connected_at' => now(),
        ], $attrs));
    }

    /** Article plausible et unique, conforme à la charte (≈ 230 mots, question finale, sans chiffre). */
    protected function fakeArticleJson(string $title = null): string
    {
        $vocab = ['analyste', 'journaux', 'détection', 'corrélation', 'investigation', 'priorisation', 'contexte', 'hypothèse', 'alerte', 'réseau',
            'identité', 'privilèges', 'segmentation', 'surveillance', 'chronologie', 'preuve', 'escalade', 'méthode', 'rigueur', 'équipe',
            'processus', 'documentation', 'visibilité', 'exposition', 'remédiation', 'confinement', 'signal', 'comportement', 'règle', 'couverture'];
        $sentences = [];
        $seed = Str::random(12);
        for ($i = 0; $i < 28; $i++) {
            shuffle($vocab);
            $sentences[] = ucfirst(implode(' ', array_slice($vocab, 0, 7))).' '.Str::lower(Str::random(6)).'.';
        }
        $content = "Point de départ $seed pour cette réflexion.\n\n".implode(' ', array_slice($sentences, 0, 14))."\n\n"
            .implode(' ', array_slice($sentences, 14))."\n\nEt vous, comment abordez-vous ce sujet dans votre équipe ?";
        return json_encode([
            'title' => $title ?? 'Titre '.$seed,
            'content' => $content,
            'hashtags' => ['CyberSecurity', 'SOC', 'BlueTeam', 'ThreatHunting', 'Infosec'],
            'sources' => [],
        ], JSON_UNESCAPED_UNICODE);
    }

    protected function fakeServices(array $linkedin = null, ?callable $llm = null): void
    {
        $linkedin ??= [Http::response(null, 201, ['x-restli-id' => 'urn:li:share:7000000000000000001'])];
        $liSeq = Http::sequence();
        foreach ($linkedin as $r) {
            $liSeq->pushResponse($r);
        }
        Http::fake([
            'api.anthropic.com/*' => $llm ?? fn () => Http::response(['content' => [['type' => 'text', 'text' => $this->fakeArticleJson()]]]),
            'api.linkedin.com/rest/posts' => $liSeq,
            'www.cisa.gov/*' => Http::response(['vulnerabilities' => []]),
            'cert.cyber.gouv.fr/*' => Http::response('<rss><channel></channel></rss>'),
        ]);
    }

    /** Lundi 9 novembre 2026, heure d'Abidjan (= UTC). */
    protected function at(string $localDateTime, string $tz = 'Africa/Abidjan'): CarbonImmutable
    {
        $t = CarbonImmutable::parse($localDateTime, $tz)->utc();
        $this->travelTo($t);
        return CarbonImmutable::now();
    }

    protected function linkedinPostCount(): int
    {
        return Http::recorded(fn ($req) => str_contains($req->url(), 'api.linkedin.com/rest/posts'))->count();
    }
}
