<?php

namespace App\Services\Content;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Collecte des sources officielles pour les sujets d'actualité.
 * Chaque élément renvoyé : title, url, date (AAAA-MM-JJ), summary, cves[].
 * Le texte généré ne pourra citer que ces éléments (contrôlé par QualityChecker).
 */
class SourceCollector
{
    /** @return array<int, array{title:string,url:string,date:?string,summary:string,cves:array,source:string}> */
    public function collect(?CarbonImmutable $now = null): array
    {
        if (! config('cyberpost.sources.enabled')) {
            return [];
        }
        $now ??= CarbonImmutable::now('UTC');
        return Cache::remember('cyberpost:news:'.$now->format('Y-m-d-H'), 3600, function () use ($now) {
            $items = [];
            foreach (config('cyberpost.sources.feeds', []) as $feed) {
                try {
                    $items = array_merge($items, match ($feed['type']) {
                        'cisa_kev' => $this->kev($feed, $now),
                        'rss' => $this->rss($feed, $now),
                        default => [],
                    });
                } catch (Throwable $e) {
                    Log::warning('Source indisponible', ['feed' => $feed['name'], 'error' => $e->getMessage()]);
                }
            }
            usort($items, fn ($a, $b) => strcmp((string) $b['date'], (string) $a['date']));
            return array_slice($items, 0, 12);
        });
    }

    private function kev(array $feed, CarbonImmutable $now): array
    {
        $res = Http::timeout(30)->withUserAgent('CyberPostAI/1.0')->get($feed['url']);
        if ($res->failed()) {
            return [];
        }
        $min = $now->subDays((int) config('cyberpost.sources.max_age_days', 14))->format('Y-m-d');
        return collect($res->json('vulnerabilities', []))
            ->filter(fn ($v) => ($v['dateAdded'] ?? '') >= $min)
            ->sortByDesc('dateAdded')->take(6)
            ->map(fn ($v) => [
                'title' => "{$v['cveID']} : {$v['vulnerabilityName']}",
                'url' => 'https://nvd.nist.gov/vuln/detail/'.$v['cveID'],
                'date' => $v['dateAdded'],
                'summary' => trim(($v['shortDescription'] ?? '').' Produit : '.($v['vendorProject'] ?? '').' '.($v['product'] ?? '')
                    .'. Ajoutée au catalogue CISA KEV le '.$v['dateAdded'].'. Usage connu par des rançongiciels : '.($v['knownRansomwareCampaignUse'] ?? 'Unknown').'.'),
                'cves' => [$v['cveID']],
                'source' => $feed['name'],
            ])->values()->all();
    }

    private function rss(array $feed, CarbonImmutable $now): array
    {
        $res = Http::timeout(30)->withUserAgent('CyberPostAI/1.0')->get($feed['url']);
        if ($res->failed()) {
            return [];
        }
        $prev = libxml_use_internal_errors(true);
        $xml = simplexml_load_string($res->body(), 'SimpleXMLElement', LIBXML_NONET | LIBXML_NOCDATA);
        libxml_use_internal_errors($prev);
        if (! $xml || ! isset($xml->channel->item)) {
            return [];
        }
        $min = $now->subDays((int) config('cyberpost.sources.max_age_days', 14));
        $out = [];
        foreach ($xml->channel->item as $item) {
            $date = isset($item->pubDate) ? rescue(fn () => CarbonImmutable::parse((string) $item->pubDate), null, false) : null;
            if ($date && $date->lt($min)) {
                continue;
            }
            $title = trim(html_entity_decode(strip_tags((string) $item->title)));
            $summary = mb_substr(trim(preg_replace('/\s+/', ' ', html_entity_decode(strip_tags((string) $item->description)))), 0, 600);
            preg_match_all('/CVE-\d{4}-\d{4,7}/i', $title.' '.$summary, $m);
            $out[] = [
                'title' => $title,
                'url' => (string) $item->link,
                'date' => $date?->format('Y-m-d'),
                'summary' => $summary,
                'cves' => array_values(array_unique(array_map('strtoupper', $m[0]))),
                'source' => $feed['name'],
            ];
            if (count($out) >= 5) {
                break;
            }
        }
        return $out;
    }
}
