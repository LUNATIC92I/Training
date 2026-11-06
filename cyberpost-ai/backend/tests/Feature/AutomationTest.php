<?php

namespace Tests\Feature;

use App\Models\AppNotification;
use App\Models\Article;
use App\Models\Publication;
use App\Services\Publishing\Publisher;
use App\Services\Scheduling\Automation;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\CyberPostHelpers;
use Tests\TestCase;

/**
 * Scénarios de bout en bout de l'ordonnanceur (horloge simulée, LinkedIn et
 * fournisseur de génération simulés par Http::fake).
 */
class AutomationTest extends TestCase
{
    use RefreshDatabase, CyberPostHelpers;

    private function automation(): Automation { return app(Automation::class); }

    #[Test] public function cycle_complet_du_lundi_generation_a_05h30_publication_a_06h30_exactement(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user);
        $this->fakeServices();

        $this->automation()->runGeneration($this->at('2026-11-09 05:29'));
        $this->assertSame(0, Article::count(), 'rien avant la fenêtre de génération');

        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        $a = Article::sole();
        $this->assertSame(Article::APPROVED, $a->status);
        $this->assertSame('2026-11-09 06:30:00', $a->scheduled_for->utc()->format('Y-m-d H:i:s'));
        $this->assertNotEmpty($a->hashtags);

        $this->automation()->runPublishing($this->at('2026-11-09 06:29'));
        $this->assertSame(0, $this->linkedinPostCount(), 'aucune publication avant 06h30');

        $this->automation()->runPublishing($this->at('2026-11-09 06:30'));
        $this->assertSame(1, $this->linkedinPostCount());
        $a->refresh();
        $this->assertSame(Article::PUBLISHED, $a->status);
        $this->assertSame('urn:li:share:7000000000000000001', $a->linkedin_post_urn);

        // Requête conforme à l'API Posts
        Http::assertSent(function ($req) {
            if (! str_contains($req->url(), 'rest/posts')) {
                return false;
            }
            $b = $req->data();
            return $req->hasHeader('Linkedin-Version', '202610') && $req->hasHeader('X-Restli-Protocol-Version', '2.0.0')
                && $b['author'] === 'urn:li:person:abc123' && $b['visibility'] === 'PUBLIC' && $b['lifecycleState'] === 'PUBLISHED'
                && str_contains($b['commentary'], '{hashtag|\\#|CyberSecurity}');
        });

        $n = AppNotification::where('type', 'published')->sole();
        $this->assertStringContainsString('publiée avec succès sur LinkedIn à 06h30', $n->body);

        // Exécutions suivantes : aucune double publication
        $this->automation()->runPublishing($this->at('2026-11-09 06:31'));
        $this->automation()->runGeneration($this->at('2026-11-09 06:32'));
        $this->assertSame(1, $this->linkedinPostCount());
        $this->assertSame(1, Article::count());
    }

    #[Test] public function une_seule_generation_par_jour_meme_avec_executions_repetees(): void
    {
        $user = $this->makeOwner();
        $this->fakeServices();
        foreach (['05:30', '05:31', '05:45', '06:00'] as $t) {
            $this->automation()->runGeneration($this->at("2026-11-10 $t"));
        }
        $this->assertSame(1, Article::where('user_id', $user->id)->count());
    }

    #[Test] public function aucune_publication_le_week_end(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user);
        $this->fakeServices();
        foreach (['2026-11-07', '2026-11-08'] as $day) {
            foreach (['05:30', '06:30', '07:00'] as $t) {
                $this->automation()->runGeneration($this->at("$day $t"));
                $this->automation()->runPublishing($this->at("$day $t"));
            }
        }
        $this->assertSame(0, Article::count());
        $this->assertSame(0, $this->linkedinPostCount());
    }

    #[Test] public function semaine_complete_cinq_publications(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user);
        $responses = [];
        for ($i = 1; $i <= 5; $i++) {
            $responses[] = Http::response(null, 201, ['x-restli-id' => "urn:li:share:70000000000000000$i"]);
        }
        $this->fakeServices($responses);
        foreach (['09', '10', '11', '12', '13', '14', '15'] as $d) {
            foreach (['05:30', '06:30'] as $t) {
                $this->automation()->runGeneration($this->at("2026-11-$d $t"));
                $this->automation()->runPublishing($this->at("2026-11-$d $t"));
            }
        }
        $this->assertSame(5, Article::where('status', Article::PUBLISHED)->count());
        $this->assertSame(5, $this->linkedinPostCount());
        $this->assertSame(5, Article::distinct('content_hash')->count('content_hash'));
    }

    #[Test] public function reponse_500_de_linkedin_publication_incertaine_sans_nouvel_envoi(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user);
        $this->fakeServices([Http::response(['message' => 'Internal error'], 500)]);
        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        $this->automation()->runPublishing($this->at('2026-11-09 06:30'));
        foreach (['06:31', '06:40', '07:00', '08:00'] as $t) {
            $this->automation()->runPublishing($this->at("2026-11-09 $t"));
        }
        $this->assertSame(1, $this->linkedinPostCount(), 'jamais de renvoi automatique après une réponse ambiguë');
        $this->assertSame(Article::UNCERTAIN, Article::sole()->status);
        $this->assertTrue(AppNotification::where('type', 'intervention')->exists());
    }

    #[Test] public function delai_depasse_publication_incertaine_sans_nouvel_envoi(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user);
        $calls = 0;
        Http::fake([
            'api.anthropic.com/*' => fn () => Http::response(['content' => [['type' => 'text', 'text' => $this->fakeArticleJson()]]]),
            'api.linkedin.com/rest/posts' => function () use (&$calls) {
                $calls++;
                throw new ConnectionException('cURL error 28: Operation timed out after 30001 milliseconds');
            },
        ]);
        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        $this->automation()->runPublishing($this->at('2026-11-09 06:30'));
        $this->automation()->runPublishing($this->at('2026-11-09 06:45'));
        $this->assertSame(Article::UNCERTAIN, Article::sole()->status);
        $this->assertSame(1, $calls);

        // Publication manuelle refusée tant que la vérification n'est pas résolue
        $o = app(Publisher::class)->publish(Article::sole(), 'manual');
        $this->assertFalse($o->ok);
        $this->assertSame(1, $calls);
    }

    #[Test] public function connexion_impossible_puis_reprise_automatique(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user);
        $calls = 0;
        Http::fake([
            'api.anthropic.com/*' => fn () => Http::response(['content' => [['type' => 'text', 'text' => $this->fakeArticleJson()]]]),
            'api.linkedin.com/rest/posts' => function () use (&$calls) {
                $calls++;
                if ($calls === 1) {
                    throw new ConnectionException('cURL error 7: Failed to connect to api.linkedin.com port 443');
                }
                return Http::response(null, 201, ['x-restli-id' => 'urn:li:share:7000000000000000009']);
            },
        ]);
        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        $this->automation()->runPublishing($this->at('2026-11-09 06:30'));
        $this->assertSame(Article::RETRY_SCHEDULED, Article::sole()->status);
        $this->automation()->runPublishing($this->at('2026-11-09 06:31'));
        $this->assertSame(1, $calls, 'respect du délai avant nouvelle tentative');
        $this->automation()->runPublishing($this->at('2026-11-09 06:33'));
        $this->assertSame(2, $calls);
        $this->assertSame(Article::PUBLISHED, Article::sole()->status);
    }

    #[Test] public function limite_429_nouvelle_tentative(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user);
        $this->fakeServices([Http::response(['message' => 'Too many'], 429), Http::response(null, 201, ['x-restli-id' => 'urn:li:share:1'])]);
        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        $this->automation()->runPublishing($this->at('2026-11-09 06:30'));
        $this->automation()->runPublishing($this->at('2026-11-09 06:35'));
        $this->assertSame(2, $this->linkedinPostCount());
        $this->assertSame(Article::PUBLISHED, Article::sole()->status);
    }

    #[Test] public function jeton_refuse_401_compte_expire_et_notification(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user);
        $this->fakeServices([Http::response(['message' => 'Invalid access token'], 401)]);
        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        $this->automation()->runPublishing($this->at('2026-11-09 06:30'));
        $this->assertSame(Article::FAILED, Article::sole()->status);
        $this->assertSame('expired', $user->linkedinAccount->fresh()->status);
        $this->assertTrue(AppNotification::where('type', 'token_expired')->exists());
        $this->assertTrue(AppNotification::where('type', 'publish_failed')->exists());
    }

    #[Test] public function jeton_expire_avant_envoi_aucun_appel_a_linkedin(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user, ['expires_at' => CarbonImmutable::parse('2026-11-01')]);
        $this->fakeServices();
        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        $this->automation()->runPublishing($this->at('2026-11-09 06:30'));
        $this->assertSame(0, $this->linkedinPostCount());
        $this->assertSame(Article::FAILED, Article::sole()->status);
        $this->assertTrue(AppNotification::where('type', 'token_expired')->exists());
    }

    #[Test] public function permission_absente_403_et_version_retiree_426(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user);
        $this->fakeServices([Http::response(['message' => 'Not enough permissions'], 403), Http::response(['code' => 'NONEXISTENT_VERSION'], 426)]);
        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        $this->automation()->runPublishing($this->at('2026-11-09 06:30'));
        $this->assertStringContainsString('w_member_social', Article::sole()->error);

        $o = app(Publisher::class)->publish(Article::sole(), 'manual');
        $this->assertFalse($o->ok);
        $this->assertStringContainsString('LINKEDIN_API_VERSION', $o->message);
    }

    #[Test] public function mode_validation_attend_lapprobation(): void
    {
        $user = $this->makeOwner(['mode' => 'validation']);
        $this->connectLinkedIn($user);
        $this->fakeServices();
        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        $this->assertSame(Article::NEEDS_REVIEW, Article::sole()->status);
        $this->automation()->runPublishing($this->at('2026-11-09 06:30'));
        $this->assertSame(0, $this->linkedinPostCount(), 'pas de publication sans validation');
        $this->assertTrue(AppNotification::where('dedupe_key', 'pending:'.Article::sole()->id)->exists());

        Article::sole()->update(['status' => Article::APPROVED]); // validation dans l'application
        $this->automation()->runPublishing($this->at('2026-11-09 06:50'));
        $this->assertSame(1, $this->linkedinPostCount());
    }

    #[Test] public function serveur_indisponible_au_creneau_pas_de_publication_tardive(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user);
        $this->fakeServices();
        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        // Le serveur redémarre à 09h00, au-delà de la fenêtre de rattrapage de 2 heures.
        $this->automation()->runPublishing($this->at('2026-11-09 09:00'));
        $this->assertSame(0, $this->linkedinPostCount());
        $this->assertSame(Article::NEEDS_REVIEW, Article::sole()->status);
        $this->assertTrue(AppNotification::where('dedupe_key', 'missed:'.Article::sole()->id)->exists());
    }

    #[Test] public function redemarrage_dans_la_fenetre_publication_rattrapee(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user);
        $this->fakeServices();
        // Serveur arrêté de 05h00 à 07h15 : génération et publication rattrapées.
        $this->automation()->runGeneration($this->at('2026-11-09 07:15'));
        $this->automation()->runPublishing($this->at('2026-11-09 07:15'));
        $this->assertSame(1, $this->linkedinPostCount());
    }

    #[Test] public function publication_interrompue_devient_incertaine_sans_renvoi(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user);
        $this->fakeServices();
        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        $a = Article::sole();
        // Simule un processus tué pendant l'appel à LinkedIn.
        $a->update(['status' => Article::PUBLISHING]);
        Publication::create(['user_id' => $user->id, 'article_id' => $a->id, 'idempotency_key' => (string) \Illuminate\Support\Str::uuid(),
            'status' => Publication::PUBLISHING, 'attempts' => 1, 'started_at' => now()]);
        $this->automation()->runPublishing($this->at('2026-11-09 06:45'));
        $this->assertSame(Article::UNCERTAIN, $a->fresh()->status);
        $this->assertSame(0, $this->linkedinPostCount());
    }

    #[Test] public function deux_publications_simultanees_du_meme_article_un_seul_envoi(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user);
        $this->fakeServices();
        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        $a = Article::sole();
        $first = app(Publisher::class)->publish($a, 'manual');
        $second = app(Publisher::class)->publish($a, 'manual');
        $scheduled = app(Publisher::class)->publish($a, 'scheduler');
        $this->assertTrue($first->ok);
        $this->assertFalse($second->ok);
        $this->assertFalse($scheduled->ok);
        $this->assertSame(1, $this->linkedinPostCount());
        $this->assertSame(1, Publication::count());
    }

    #[Test] public function fournisseur_non_configure_echec_de_generation_explicite(): void
    {
        config(['cyberpost.llm.providers.anthropic.api_key' => null]);
        $user = $this->makeOwner();
        $this->fakeServices();
        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        $a = Article::sole();
        $this->assertSame(Article::GENERATION_FAILED, $a->status);
        $this->assertStringContainsString('non configuré', $a->error);
        $this->assertTrue(AppNotification::where('type', 'generation_failed')->exists());
    }

    #[Test] public function erreur_temporaire_du_fournisseur_puis_reprise(): void
    {
        $user = $this->makeOwner();
        $calls = 0;
        Http::fake(['api.anthropic.com/*' => function () use (&$calls) {
            $calls++;
            return $calls === 1 ? Http::response(['error' => ['message' => 'overloaded']], 529)
                : Http::response(['content' => [['type' => 'text', 'text' => $this->fakeArticleJson()]]]);
        }]);
        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        $this->assertSame(Article::GENERATION_FAILED, Article::sole()->status);
        $this->automation()->runGeneration($this->at('2026-11-09 05:36'));
        $this->assertSame(Article::APPROVED, Article::sole()->status);
    }

    #[Test] public function sujet_dactualite_redige_uniquement_avec_les_sources_officielles(): void
    {
        $user = $this->makeOwner();
        $user->schedules()->where('weekday', 3)->update(['category_slugs' => ['news-vulns']]);
        $captured = null;
        Http::fake([
            'www.cisa.gov/*' => Http::response(['vulnerabilities' => [[
                'cveID' => 'CVE-2024-27834', 'vendorProject' => 'Apple', 'product' => 'Multiple Products',
                'vulnerabilityName' => 'Apple Multiple Products Improper Authentication Vulnerability', 'dateAdded' => '2026-11-04',
                'shortDescription' => 'Improper authentication.', 'knownRansomwareCampaignUse' => 'Unknown']]]),
            'cert.cyber.gouv.fr/*' => Http::response('<rss><channel></channel></rss>'),
            'api.anthropic.com/*' => function ($req) use (&$captured) {
                $captured = $req->data()['messages'][0]['content'];
                $json = json_decode($this->fakeArticleJson(), true);
                $json['content'] = "La CVE-2024-27834 ajoutée le 2026-11-04 mérite attention.\n\n".$json['content'];
                $json['sources'] = [['title' => 'NVD', 'url' => 'https://nvd.nist.gov/vuln/detail/CVE-2024-27834']];
                return Http::response(['content' => [['type' => 'text', 'text' => json_encode($json)]]]);
            },
        ]);
        $this->automation()->runGeneration($this->at('2026-11-11 05:30'));
        $a = Article::sole();
        $this->assertStringContainsString('SOURCES OFFICIELLES', $captured);
        $this->assertSame(Article::APPROVED, $a->status, implode(' | ', $a->quality_issues));
        $this->assertSame('https://nvd.nist.gov/vuln/detail/CVE-2024-27834', $a->sources[0]['url']);
        $this->assertSame('2026-11-04', $a->sources[0]['date']);
    }

    #[Test] public function sans_source_dactualite_un_sujet_intemporel_est_choisi(): void
    {
        $user = $this->makeOwner();
        $this->fakeServices();
        $this->automation()->runGeneration($this->at('2026-11-11 05:30')); // mercredi = actualités
        $a = Article::sole();
        $this->assertNotContains($a->category->slug, ['news-vulns', 'news-threats']);
        $this->assertSame([], $a->sources);
    }

    #[Test] public function avertissement_avant_expiration_du_jeton(): void
    {
        $user = $this->makeOwner();
        $this->connectLinkedIn($user, ['expires_at' => now()->addDays(3)]);
        $this->automation()->checkTokens();
        $this->automation()->checkTokens();
        $this->assertSame(1, AppNotification::where('type', 'token_expiring')->count());
    }

    #[Test] public function changement_dheure_reprogramme_les_articles(): void
    {
        $user = $this->makeOwner();
        $this->fakeServices();
        $this->automation()->runGeneration($this->at('2026-11-09 05:30'));
        $user->settings->update(['publish_time' => '07:15']);
        $this->automation()->reschedule($user);
        $this->assertSame('07:15', Article::sole()->scheduled_for->format('H:i'));
    }
}
