<?php

namespace Tests\Unit;

use App\Services\LinkedIn\LittleText;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class LittleTextTest extends TestCase
{
    #[Test] public function echappe_tous_les_caracteres_reserves(): void
    {
        $this->assertSame('Analyse \\(SOC\\) \\@equipe \\#tag \\[x\\] \\{y\\} \\<z\\> a\\_b \\*c\\* \\~d \\| e \\\\ f',
            LittleText::escape('Analyse (SOC) @equipe #tag [x] {y} <z> a_b *c* ~d | e \\ f'));
    }

    #[Test] public function ajoute_les_hashtags_au_format_modele(): void
    {
        $c = LittleText::commentary('Texte ?', ['#Cyber Security', 'SOC']);
        $this->assertSame("Texte ?\n\n{hashtag|\\#|CyberSecurity} {hashtag|\\#|SOC}", $c);
    }

    #[Test] public function conserve_les_accents_et_les_retours_a_la_ligne(): void
    {
        $this->assertSame("Sécurité\n\nRéponse à incident.", LittleText::escape("Sécurité\n\nRéponse à incident."));
    }
}
