# Configuration du fournisseur de génération de texte

Le moteur de génération est **indépendant du fournisseur** (interface `App\Services\Llm\LlmProvider`).
Trois entrées sont prêtes à l'emploi ; le choix se fait dans l'application (Paramètres › Contenu) ou par
`LLM_PROVIDER` pour la valeur par défaut. Les clés d'API restent **exclusivement dans le fichier `.env` du serveur**.

| Clé | Fournisseur | Variables |
|---|---|---|
| `anthropic` | Anthropic Claude (API Messages) | `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` (défaut `claude-sonnet-5-5`) |
| `openai` | OpenAI (API Chat Completions) | `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_BASE_URL` |
| `custom` | tout service compatible « chat/completions » (Mistral, Groq, serveur auto-hébergé…) | `CUSTOM_LLM_NAME`, `CUSTOM_LLM_API_KEY`, `CUSTOM_LLM_MODEL`, `CUSTOM_LLM_BASE_URL` |

Après modification : `php artisan config:cache`. Le tableau de bord indique « Moteur de génération : non configuré »
tant que la clé ou le modèle manque ; aucune génération n'est simulée.

Test sans publication :

```bash
php artisan cyberpost:generate votre@email --category=soc-analysis
```

## Ajouter un nouveau fournisseur

1. Créer une classe implémentant `LlmProvider` (`complete(string $system, string $user, ...)`).
2. Déclarer un pilote dans `LlmManager::provider()` et une entrée dans `config/cyberpost.php`.

## Charte éditoriale appliquée

Le prompt (`App\Services\Content\PromptBuilder`) impose :

- la voix d'un Senior SOC Analyst, selon le **profil éditorial** saisi dans l'application (nom, fonction,
  domaines, positionnement, consignes supplémentaires), sans jamais inventer d'expérience, de mission,
  d'employeur ni de certification ;
- une accroche non générique, un développement technique, un exemple présenté comme **scénario type**,
  une analyse personnelle, une conclusion et une **question finale** ;
- l'absence de statistiques, CVE, incidents, dates ou citations inventés ;
- pas de Markdown, peu ou pas d'émojis, pas de formules creuses ;
- une longueur variable (courte, moyenne, longue) et un format tiré au sort (méthode, erreurs fréquentes,
  idée reçue, comparaison, liste de contrôle…).

## Contrôle qualité automatique

`App\Services\Content\QualityChecker` vérifie chaque article. Les problèmes **bloquants** empêchent toute
publication automatique :

- texte trop court ou dépassant la limite LinkedIn de 3 000 caractères ;
- absence de question finale ; nombre de hashtags incorrect ; Markdown ;
- formules artificielles (« à l'ère du numérique », « plongeons »…) ; excès d'émojis ;
- anecdote personnelle non fournie par l'auteur (« la semaine dernière, un client… ») ;
- **identifiant CVE absent des sources officielles fournies** ;
- **chiffre, pourcentage ou année sans source** ;
- source citée qui ne figure pas parmi celles fournies ;
- accroche identique ou contenu trop proche (similarité de Jaccard ≥ 30 %) d'un article des 30 derniers jours.

Le moteur réécrit jusqu'à deux fois en indiquant au modèle les problèmes à corriger. S'il reste un problème,
l'article passe **« En attente de validation »** et vous êtes notifié : il ne sera pas publié sans vous.

## Sujets d'actualité et sources

Les catégories d'actualité (mercredi par défaut) ne sont rédigées qu'à partir de sources officielles collectées
au moment de la génération :

- catalogue **CISA Known Exploited Vulnerabilities** (vulnérabilités ajoutées depuis 14 jours, lien NVD) ;
- flux **CERT-FR (ANSSI)** : alertes, avis, menaces et incidents.

Les références (titre, URL, date) sont enregistrées avec l'article et affichées dans l'application.
Si aucune source n'est disponible, le moteur choisit un sujet intemporel (gestion des vulnérabilités,
Threat Intelligence…) plutôt que d'inventer une actualité.

## Calendrier et anti-répétition

- Calendrier par défaut : lundi SOC et Threat Hunting ; mardi Pentest et sécurité des systèmes ;
  mercredi actualités et vulnérabilités ; jeudi Cloud, IAM, EDR, forensic ; vendredi carrière,
  certifications et cybersécurité en Afrique. Modifiable dans l'onglet **Calendrier**.
- Sélection pondérée : les catégories utilisées le moins récemment sont favorisées.
- Un angle déjà traité dans les 30 derniers jours n'est pas reproposé tant qu'il en reste d'autres.

## Coût

Chaque article nécessite un à trois appels au modèle (environ 2 000 à 3 000 jetons au total par appel).
Consultez la tarification de votre fournisseur.
