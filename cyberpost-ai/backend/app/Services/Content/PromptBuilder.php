<?php

namespace App\Services\Content;

use App\Models\ApplicationSetting;
use App\Models\EditorialCategory;

/**
 * Construit les consignes envoyées au modèle de langage.
 * La charte éditoriale impose une voix humaine de Senior SOC Analyst, interdit
 * d'inventer des faits (chiffres, CVE, incidents, citations, expériences) et
 * exige une sortie JSON stricte, vérifiée ensuite par QualityChecker.
 */
class PromptBuilder
{
    public const LENGTHS = [
        'short' => [130, 190],
        'medium' => [200, 300],
        'long' => [300, 420],
    ];

    public function resolveLength(string $setting): string
    {
        if (isset(self::LENGTHS[$setting])) {
            return $setting;
        }
        // « variable » : varie les longueurs d'un jour à l'autre.
        return ['short', 'medium', 'medium', 'long'][random_int(0, 3)];
    }

    public function system(ApplicationSetting $s): string
    {
        $en = $s->language === 'en';
        $author = trim($s->author_name) ?: ($en ? 'the author' : "l'auteur");
        $profile = implode("\n", array_filter([
            ($en ? 'Name: ' : 'Nom : ').$author,
            $s->author_title ? ($en ? 'Role: ' : 'Fonction : ').$s->author_title : null,
            $s->author_domain ? ($en ? 'Areas: ' : 'Domaines : ').$s->author_domain : null,
            $s->author_positioning ? ($en ? 'Editorial positioning: ' : 'Positionnement éditorial : ').$s->author_positioning : null,
        ]));
        $tone = [
            'pedagogue' => $en ? 'teaching-oriented, patient, concrete' : 'pédagogue, patient et concret',
            'analytique' => $en ? 'analytical, precise, structured' : 'analytique, précis et structuré',
            'direct' => $en ? 'direct, frank, efficient' : 'direct, franc et efficace',
            'conversationnel' => $en ? 'conversational, warm, accessible' : 'conversationnel, chaleureux et accessible',
        ][$s->tone] ?? 'pédagogue';

        if ($en) {
            return <<<TXT
You write LinkedIn posts in English for a cybersecurity professional, in their own voice (first person).

AUTHOR PROFILE (the only facts you may state about the author):
$profile

VOICE: an experienced Senior SOC Analyst: $tone. Human, natural, technical yet accessible. Useful to students, SOC analysts, pentesters, CISOs and IT managers.

ABSOLUTE RULES:
- Never invent statistics, percentages, figures, CVE identifiers, incidents, company names, dates, quotes or studies. If a source list is provided, only use facts from it; otherwise write without any figures.
- Never invent personal anecdotes, past missions, employers, clients or certifications. Personal reflection is welcome as opinion ("in my view", "what I take away"), never as a fabricated story. Concrete examples must be presented explicitly as typical scenarios.
- No clichés ("in today's digital world", "game changer", "let's dive in", "in conclusion"), no sales tone, no more than one emoji (none is better), no em dashes.
- Structure: a hook that is not generic, a technically solid development, clear explanations, a concrete example, a personal analysis, a meaningful conclusion, and a final open question inviting comments.
- Plain text only (no Markdown, no asterisks, no headings). Short paragraphs separated by blank lines. Hyphen lists allowed.
- Hashtags go ONLY in the "hashtags" field, never in the text.

OUTPUT: a single JSON object, nothing else:
{"title": "internal title", "content": "post text", "hashtags": ["Tag1", "Tag2"], "sources": [{"title": "...", "url": "..."}]}
TXT;
        }

        return <<<TXT
Tu rédiges des publications LinkedIn en français pour un professionnel de la cybersécurité, avec sa propre voix (à la première personne).

PROFIL DE L'AUTEUR (seuls faits que tu peux affirmer sur l'auteur) :
$profile

VOIX : celle d'un Senior SOC Analyst expérimenté, au ton $tone. Humaine, naturelle, technique et accessible. Utile aux étudiants, analystes SOC, pentesters, RSSI et responsables informatiques.

RÈGLES ABSOLUES :
- N'invente jamais de statistiques, pourcentages, chiffres, identifiants CVE, incidents, noms d'entreprises, dates, citations ou études. Si une liste de sources est fournie, n'utilise que les faits qu'elle contient ; sinon, écris sans aucun chiffre.
- N'invente jamais d'anecdote personnelle, de mission passée, d'employeur, de client ou de certification. La réflexion personnelle est bienvenue sous forme d'avis (« à mon sens », « ce que j'en retiens »), jamais sous forme d'histoire fabriquée. Les exemples concrets sont présentés explicitement comme des scénarios types (« prenons un cas typique »).
- Pas de formules creuses (« à l'ère du numérique », « dans un monde où », « plongeons », « game changer », « en conclusion »), pas de ton commercial, un émoji au maximum (aucun, c'est mieux), pas de tiret cadratin.
- Varie l'accroche : jamais « Saviez-vous que », « Aujourd'hui, je voudrais », « Dans un monde ».
- Structure : une accroche qui n'est pas générique, un développement techniquement solide, des explications claires, un exemple concret, une analyse personnelle, une conclusion utile, puis une question ouverte finale qui invite aux commentaires.
- Texte brut uniquement (pas de Markdown, pas d'astérisques, pas de titres). Paragraphes courts séparés par une ligne vide. Listes à tirets autorisées.
- Les hashtags vont UNIQUEMENT dans le champ « hashtags », jamais dans le texte.
- Français correct, typographie française (espace avant « ? » et « : »).

SORTIE : un unique objet JSON, rien d'autre :
{"title": "titre interne", "content": "texte de la publication", "hashtags": ["Tag1", "Tag2"], "sources": [{"title": "...", "url": "..."}]}
TXT;
    }

    public function user(ApplicationSetting $s, EditorialCategory $cat, string $topic, string $angle, string $length,
        array $sources, array $avoidOpenings, array $issues = []): string
    {
        [$min, $max] = self::LENGTHS[$length];
        $en = $s->language === 'en';
        $lines = [];
        $lines[] = ($en ? 'Category: ' : 'Catégorie : ').$cat->name;
        $lines[] = ($en ? 'Topic: ' : 'Sujet : ').$topic;
        $lines[] = ($en ? 'Format: ' : 'Format : ').$angle;
        $lines[] = $en ? "Length: between $min and $max words (hashtags excluded)." : "Longueur : entre $min et $max mots (hors hashtags).";
        $lines[] = $en ? "Hashtags: exactly {$s->hashtags_count} relevant professional hashtags, without the # sign, in CamelCase."
            : "Hashtags : exactement {$s->hashtags_count} hashtags professionnels pertinents, sans le signe #, en CamelCase.";

        if ($sources) {
            $lines[] = '';
            $lines[] = $en ? 'OFFICIAL SOURCES (the only facts you may use; cite those you use in "sources" with their exact URL):'
                : 'SOURCES OFFICIELLES (seuls faits utilisables ; cite celles que tu utilises dans « sources » avec leur URL exacte) :';
            foreach ($sources as $i => $src) {
                $lines[] = sprintf('[%d] %s (%s) %s : %s', $i + 1, $src['title'], $src['date'] ?? 'date inconnue', $src['url'], $src['summary']);
            }
            $lines[] = $en ? 'Pick one or two items, explain their practical meaning for defenders, and mention the date of publication.'
                : 'Choisis un ou deux éléments, explique leur portée concrète pour les défenseurs, et mentionne la date de publication de la source.';
        } else {
            $lines[] = $en ? 'No sources: write an evergreen post without any figure, date, CVE or real incident. "sources" must be [].'
                : 'Aucune source : écris un contenu intemporel, sans chiffre, date, CVE ni incident réel. « sources » doit valoir [].';
        }

        if ($avoidOpenings) {
            $lines[] = '';
            $lines[] = $en ? 'Recent openings to NOT reuse (neither wording nor structure):' : 'Accroches récentes à NE PAS réutiliser (ni formulation ni structure) :';
            foreach ($avoidOpenings as $o) {
                $lines[] = '- '.$o;
            }
        }
        if ($s->custom_instructions) {
            $lines[] = '';
            $lines[] = ($en ? 'Additional author instructions: ' : 'Consignes supplémentaires de l\'auteur : ').$s->custom_instructions;
        }
        if ($issues) {
            $lines[] = '';
            $lines[] = $en ? 'Your previous draft was rejected for these reasons. Write a new version that fixes all of them:'
                : 'Ta version précédente a été refusée pour ces raisons. Rédige une nouvelle version qui les corrige toutes :';
            foreach ($issues as $i) {
                $lines[] = '- '.$i;
            }
        }
        return implode("\n", $lines);
    }
}
