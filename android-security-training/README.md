# Formation Sécurité Android & GrapheneOS

Site vitrine et plateforme de formation **gratuite** en sécurité Android, protection de la vie privée et découverte de GrapheneOS.

**Formation offerte par Hissein Banaye Hassan.** Accès gratuit jusqu'au **31 décembre 2026 à 23h59, heure d'Abidjan**.

> « Votre smartphone contient une partie de votre vie. Apprenez à la protéger. »

---

## Sommaire

1. [Contenu livré](#contenu-livré)
2. [Arborescence](#arborescence)
3. [Lancer le site en local](#lancer-le-site-en-local)
4. [Déploiement](#déploiement)
5. [Fonctionnement technique](#fonctionnement-technique)
6. [Ajouter ou modifier une leçon](#ajouter-ou-modifier-une-leçon)
7. [Maintenir la liste des appareils GrapheneOS](#maintenir-la-liste-des-appareils-grapheneos)
8. [Sécurité, confidentialité et accessibilité](#sécurité-confidentialité-et-accessibilité)
9. [Tests réalisés](#tests-réalisés)
10. [Sources](#sources)

---

## Contenu livré

| Élément | Détail |
|---|---|
| Pages | `index.html` (accueil), `formation.html` (espace apprenant, leçons, examen), `modules.html` (catalogue avec recherche et filtres), `ressources.html`, `a-propos.html` |
| Formation | 10 modules, **113 leçons** complètes (objectif, introduction, explications techniques, illustration, procédure pas à pas, exemples, erreurs et solutions, recommandations, résumé, questionnaire) |
| Évaluations | 289 questions de validation corrigées et un **examen final de 50 questions** avec explications |
| Progression | Sauvegarde locale (localStorage), pourcentage global et par module, reprise, résultats aux quiz, nouvelles tentatives |
| Compte à rebours | Jours, heures, minutes, secondes jusqu'au 31/12/2026 23h59 (Abidjan, GMT), message de fin de gratuité |
| Illustrations | 26 schémas techniques SVG générés par `tools/build_illustrations.py` |
| SEO | Balises meta, Open Graph, données structurées `Course`, `sitemap.xml`, `robots.txt`, favicon, manifeste |

## Arborescence

```
android-security-training/
├── index.html              Accueil (héros, terminal animé, compte à rebours, risques, démonstrations, comparatif, programme)
├── formation.html          Espace apprenant (tableau de bord, leçons, quiz, examen final)
├── modules.html            Catalogue des modules : recherche, filtre par niveau, progression
├── ressources.html         Bibliothèque de liens officiels vérifiés
├── a-propos.html           Présentation de l'initiative
├── css/
│   ├── style.css           Jetons de design, composants, mises en page
│   ├── animations.css      Animations (respecte prefers-reduced-motion)
│   └── responsive.css      Adaptations tablette et mobile, impression
├── js/
│   ├── main.js             Utilitaires communs, thème, révélation au défilement
│   ├── navigation.js       En-tête, menu mobile accessible, indicateur de progression
│   ├── countdown.js        Compte à rebours
│   ├── progress.js         Stockage local de la progression
│   ├── interactions.js     Terminal animé, démonstrations, catalogue
│   ├── formation.js        Moteur de l'espace apprenant (routage, leçons, quiz, examen)
│   └── data/
│       ├── catalog.js      Structure de la formation (modules, titres et niveaux des leçons)
│       ├── module-01.js …  Contenu détaillé de chaque module (chargé à la demande)
│       ├── module-10.js
│       ├── exam.js         Examen final
│       └── devices.js      Appareils pris en charge par GrapheneOS
├── assets/
│   ├── icons/              favicon.svg, logo.svg, apple-touch-icon.png
│   ├── images/             og-image.png (partage sur les réseaux)
│   └── illustrations/      Schémas techniques SVG
├── tools/
│   └── build_illustrations.py   Générateur des illustrations
├── sitemap.xml
├── robots.txt
└── site.webmanifest
```

## Lancer le site en local

Le site est 100 % statique (HTML5, CSS3, JavaScript Vanilla), sans dépendance ni étape de compilation.

**Option 1 : ouvrir directement le fichier.** Double-cliquez sur `index.html`. Tout fonctionne, y compris le chargement des leçons (scripts classiques, compatibles `file://`).

**Option 2 (recommandée) : petit serveur local**, plus proche des conditions réelles :

```bash
cd android-security-training
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Déploiement

N'importe quel hébergement de fichiers statiques convient : copiez le contenu du dossier `android-security-training/` à la racine du site.

### GitHub Pages

1. Dans le dépôt GitHub : **Settings › Pages**.
2. Source : **Deploy from a branch**, branche `main` (ou celle choisie), dossier `/ (root)`.
3. Le site sera disponible à l'adresse `https://<utilisateur>.github.io/<dépôt>/android-security-training/`.

### Netlify, Cloudflare Pages, Vercel ou serveur web classique

Indiquez `android-security-training` comme dossier de publication, sans commande de build.

### Adapter l'URL publique

Les URL absolues (balises `canonical`, Open Graph, `sitemap.xml`, `robots.txt`, données structurées) utilisent :

```
https://lunatic92i.github.io/training/android-security-training/
```

Si le site est publié ailleurs, remplacez cette adresse partout :

```bash
grep -rl "https://lunatic92i.github.io/training/android-security-training" . \
  | xargs sed -i "s#https://lunatic92i.github.io/training/android-security-training#https://votre-domaine.tld#g"
```

### En-têtes HTTP recommandés (si votre hébergeur le permet)

Une politique de sécurité du contenu est déjà présente en balise `<meta>`. Côté serveur, ajoutez de préférence :

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Fonctionnement technique

### Routage de l'espace apprenant

`formation.html` fonctionne par paramètres d'URL :

| URL | Affichage |
|---|---|
| `formation.html` | Tableau de bord (progression, reprise, modules, résultats) |
| `formation.html?lecon=m3-l2` | Leçon 2 du module 3 |
| `formation.html?module=m6` | Première leçon du module 6 |
| `formation.html?examen=final` | Examen final |
| `modules.html?q=vpn` | Catalogue pré-filtré par la recherche « vpn » |

### Progression

`js/progress.js` enregistre dans `localStorage` (clé `asg-formation-progress-v1`) : leçons terminées, résultats des quiz (dernier, meilleur, tentatives), résultat de l'examen et dernière leçon consultée. Les données sont validées à la lecture. Rien n'est envoyé sur Internet. Le bouton « Réinitialiser ma progression » du tableau de bord efface ces données.

### Quiz

Les réponses sont **mélangées à chaque affichage**, la correction détaillée s'affiche après validation, et le questionnaire peut être refait à volonté.

### Compte à rebours

`js/countdown.js` vise `2026-12-31T23:59:00Z` (Abidjan applique GMT toute l'année, sans heure d'été). Après l'échéance, il affiche : « La période de gratuité de cette formation est officiellement terminée. », suivi d'une mention indiquant que les conditions d'accès gratuit sont susceptibles d'évoluer. Il n'est jamais affirmé que la formation devient payante.

### Thème

Le thème sombre est celui par défaut ; un thème clair est disponible via le bouton de l'en-tête (préférence mémorisée).

## Ajouter ou modifier une leçon

1. Ajoutez ou modifiez le titre et le niveau dans `js/data/catalog.js`.
2. Ajoutez ou modifiez l'objet correspondant, **au même rang**, dans `js/data/module-XX.js`.

Format d'une leçon :

```js
{
  obj: "Objectif pédagogique",
  intro: ["Paragraphe 1", "Paragraphe 2"],
  warn: "Avertissement affiché en évidence (facultatif)",
  tech: [
    "Paragraphe simple",
    { h: "Sous-titre", p: ["Paragraphe"], ul: ["Puce 1", "Puce 2"] }
  ],
  table: { cap: "Légende", head: ["Col 1", "Col 2"], rows: [["a", "b"]] }, // facultatif
  extra: "devices",            // facultatif : insère le tableau des appareils
  fig: "boot-chain",           // nom d'un fichier de assets/illustrations (sans .svg)
  steps: ["Étape 1", "Étape 2"],
  result: "Résultat attendu",  // facultatif
  caution: "Avertissement de sécurité lié à la procédure", // facultatif
  ex: ["Exemple 1"],
  err: [["Erreur fréquente", "Solution"]],
  reco: ["Recommandation"],
  sum: "Résumé",
  quiz: [{ q: "Question ?", o: ["A", "B", "C"], a: 1, e: "Explication" }]
}
```

Les chaînes peuvent contenir du HTML simple (`<b>`, `<code>`, `<a>`). Ces contenus sont écrits par l'auteur du site ; n'y insérez jamais de contenu provenant d'utilisateurs.

Pour régénérer les illustrations après modification du script :

```bash
python3 tools/build_illustrations.py
```

## Maintenir la liste des appareils GrapheneOS

La liste se trouve dans `js/data/devices.js`. Elle reproduit la section « Which devices are supported? » de la FAQ officielle **à la date indiquée dans le champ `checked`**.

Règles impératives :

- ne jamais ajouter un appareil absent de la liste officielle <https://grapheneos.org/faq#supported-devices> ;
- mettre à jour `checked` à chaque vérification ;
- reporter les dates de support minimal (`end`, `endDate`) depuis la section « How long will GrapheneOS support my device? ».

Le tableau affiché dans les modules 5 et 6 rappelle systématiquement de vérifier la page officielle. Une page web ne peut pas interroger directement grapheneos.org depuis le navigateur du visiteur (restrictions CORS) ; la vérification périodique manuelle reste donc nécessaire.

Les procédures d'installation (module 6) suivent le guide officiel <https://grapheneos.org/install/web>. À chaque évolution de ce guide (systèmes d'exploitation ou navigateurs pris en charge, étapes), mettez à jour `js/data/module-06.js`.

## Sécurité, confidentialité et accessibilité

- Aucun cookie, aucun traceur, aucune police ni aucun script externe.
- Politique de sécurité du contenu (CSP) restrictive ; aucun script en ligne.
- Contenus dynamiques construits avec `textContent` lorsque les données ne proviennent pas de l'auteur ; données de `localStorage` validées avant usage.
- Liens externes avec `rel="noopener"`.
- Accessibilité : lien d'évitement, structure de titres, navigation au clavier (onglets des démonstrations, menu mobile avec piège de focus et touche Échap), contrastes conformes WCAG AA, libellés ARIA, annonces `aria-live`, respect de `prefers-reduced-motion`.

## Tests réalisés

Les vérifications suivantes ont été automatisées avec Playwright (Chromium) :

- chargement sans erreur JavaScript de toutes les pages, en 1366 px et 390 px, sans débordement horizontal ;
- rendu des 113 leçons (sections et questionnaires présents) ;
- validation d'un quiz, affichage des corrections, enregistrement de la progression, tableau de bord, bouton « Reprendre », navigation Précédent/Suivant entre modules ;
- examen final : 50 questions, correction et enregistrement ;
- recherche et filtre par niveau du catalogue, état « aucun résultat » ;
- tableau des appareils : recherche par nom de code, filtres ;
- compte à rebours, et message de fin simulé après l'échéance ;
- menu mobile (ouverture, fermeture par Échap) ;
- démonstrations interactives ;
- préférence « réduire les animations » ;
- liens internes (aucun lien cassé) et 34 liens externes officiels.

## Sources

- GrapheneOS : <https://grapheneos.org/>, <https://grapheneos.org/install/web>, <https://grapheneos.org/faq>, <https://grapheneos.org/features>, <https://grapheneos.org/usage>
- Android Security (AOSP) : <https://source.android.com/docs/security>
- Android Security Bulletins : <https://source.android.com/docs/security/bulletin>
- Android Developers : <https://developer.android.com/>

GrapheneOS, Android, Google Pixel et Google Play sont des marques de leurs détenteurs respectifs. Cette formation indépendante n'est ni affiliée ni approuvée par le projet GrapheneOS ou par Google.

---

© 2026 Hissein Banaye Hassan. Formation gratuite en sécurité Android et découverte de GrapheneOS.
