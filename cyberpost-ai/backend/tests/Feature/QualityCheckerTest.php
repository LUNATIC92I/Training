<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Services\Content\ArticleParser;
use App\Services\Content\QualityChecker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\CyberPostHelpers;
use Tests\TestCase;

class QualityCheckerTest extends TestCase
{
    use RefreshDatabase, CyberPostHelpers;

    private function check(array $override, array $sources = [], ?callable $mutate = null): array
    {
        $user = $this->makeOwner();
        $parsed = (new ArticleParser)->parse($this->fakeArticleJson());
        $parsed = array_merge($parsed, $override);
        return app(QualityChecker::class)->check($parsed, $user->settings, 'medium', $sources, $user->id);
    }

    #[Test] public function un_article_conforme_na_aucun_probleme_bloquant(): void
    {
        $r = $this->check([]);
        $this->assertSame([], $r['blocking']);
        $this->assertGreaterThanOrEqual(90, $r['score']);
    }

    #[Test] public function une_cve_absente_des_sources_est_bloquee(): void
    {
        $parsed = (new ArticleParser)->parse($this->fakeArticleJson());
        $r = $this->check(['content' => str_replace('Point de départ', 'La faille CVE-2026-12345 change tout. Point de départ', $parsed['content'])]);
        $this->assertStringContainsString('CVE-2026-12345', implode(' ', $r['blocking']));
    }

    #[Test] public function une_cve_presente_dans_les_sources_est_acceptee(): void
    {
        $parsed = (new ArticleParser)->parse($this->fakeArticleJson());
        $src = [['title' => 'CVE-2026-12345 : test', 'url' => 'https://nvd.nist.gov/vuln/detail/CVE-2026-12345', 'date' => '2026-11-04', 'summary' => '', 'cves' => ['CVE-2026-12345']]];
        $r = $this->check(['content' => 'La faille CVE-2026-12345 change tout. '.$parsed['content'],
            'sources' => [['title' => 'NVD', 'url' => 'https://nvd.nist.gov/vuln/detail/CVE-2026-12345']]], $src);
        $this->assertSame([], array_values(array_filter($r['blocking'], fn ($b) => str_contains($b, 'CVE'))));
    }

    #[Test] public function une_statistique_sans_source_est_bloquee(): void
    {
        $parsed = (new ArticleParser)->parse($this->fakeArticleJson());
        $r = $this->check(['content' => 'Près de 73 % des attaques commencent ainsi. '.$parsed['content']]);
        $this->assertTrue(collect($r['blocking'])->contains(fn ($b) => str_contains($b, 'statistique')));
    }

    #[Test] public function cliches_anecdotes_et_absence_de_question_sont_bloques(): void
    {
        $r = $this->check(['content' => "À l'ère du numérique, la semaine dernière un incident est survenu. ".str_repeat('analyse des journaux et corrélation fine ', 40)]);
        $all = implode(' ', $r['blocking']);
        $this->assertStringContainsString("à l'ère du numérique", $all);
        $this->assertStringContainsString('la semaine dernière', $all);
        $this->assertStringContainsString('question finale', $all);
    }

    #[Test] public function nombre_de_hashtags_incorrect(): void
    {
        $r = $this->check(['hashtags' => ['SOC']]);
        $this->assertTrue(collect($r['blocking'])->contains(fn ($b) => str_contains($b, 'hashtags')));
    }

    #[Test] public function un_contenu_trop_proche_dun_article_recent_est_bloque(): void
    {
        $user = $this->makeOwner();
        $parsed = (new ArticleParser)->parse($this->fakeArticleJson());
        Article::create(['user_id' => $user->id, 'title' => 'x', 'content' => $parsed['content'], 'status' => Article::PUBLISHED, 'content_hash' => Article::hashContent($parsed['content'])]);
        $r = app(QualityChecker::class)->check($parsed, $user->settings, 'medium', [], $user->id);
        $this->assertTrue(collect($r['blocking'])->contains(fn ($b) => str_contains($b, 'trop proche') || str_contains($b, 'identique')));
    }
}
