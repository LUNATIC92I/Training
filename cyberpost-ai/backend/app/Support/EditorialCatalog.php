<?php

namespace App\Support;

/**
 * Catalogue éditorial par défaut : catégories, angles de sujets et calendrier
 * hebdomadaire. Copié pour chaque utilisateur à la création de son compte,
 * puis modifiable (activation des catégories, calendrier).
 *
 * Les sujets sont des angles pédagogiques « intemporels » : ils ne citent
 * aucun incident, chiffre ou CVE. Les catégories d'actualité
 * (requires_sources) ne sont rédigées qu'à partir de sources officielles
 * collectées au moment de la génération.
 */
class EditorialCatalog
{
    public static function categories(): array
    {
        $op = 'Cybersécurité opérationnelle';
        $si = 'Sécurité informatique';
        $adv = 'Cybersécurité avancée';
        $news = 'Actualités et menaces';
        $car = 'Certifications et carrière';
        $af = 'Cybersécurité en Afrique';

        return [
            ['soc-analysis', 'SOC Analysis (niveaux 1, 2 et 3)', $op, false, [
                'Ce qui distingue réellement un analyste SOC de niveau 1, 2 et 3',
                'Le tri des alertes : comment éviter la fatigue d\'alerte au niveau 1',
                'Escalader une alerte : quelles informations le niveau 2 attend vraiment',
                'Rédiger un ticket d\'incident utile pour l\'équipe suivante',
                'Faux positifs : pourquoi les documenter est un investissement',
                'Les indicateurs de performance d\'un SOC qui ont du sens (et ceux qui trompent)',
                'La passation entre équipes de quart dans un SOC 24/7',
                'Construire et maintenir des runbooks qui servent réellement',
                'Le rôle du niveau 3 : ingénierie de détection et amélioration continue',
            ]],
            ['threat-hunting', 'Threat Hunting', $op, false, [
                'Différence entre détection et threat hunting',
                'Formuler une hypothèse de chasse à partir d\'une technique ATT&CK',
                'Chasser la persistance sur des postes Windows : par où commencer',
                'Le threat hunting sans outil coûteux : méthode et discipline',
                'Transformer une chasse réussie en règle de détection durable',
                'Les angles morts fréquents d\'une chasse aux menaces',
                'Documenter une chasse, même quand elle ne trouve rien',
            ]],
            ['incident-response', 'Incident Response', $op, false, [
                'Les premières heures d\'un incident : priorités et erreurs à éviter',
                'Confinement : isoler sans détruire les preuves',
                'Le rôle de la communication interne pendant une crise cyber',
                'Retour d\'expérience post-incident : en faire un outil d\'amélioration',
                'Préparer un plan de réponse aux incidents avant d\'en avoir besoin',
                'Exercices de crise sur table : pourquoi et comment les organiser',
                'Chaîne de responsabilités pendant un incident : qui décide de quoi',
            ]],
            ['siem-engineering', 'SIEM Engineering et analyse des journaux', $op, false, [
                'Collecter moins mais mieux : la qualité des journaux avant la quantité',
                'Les journaux Windows indispensables pour un SOC',
                'Normaliser les journaux : pourquoi c\'est la base d\'une bonne détection',
                'Écrire une règle de corrélation lisible et maintenable',
                'Tester ses règles de détection comme on teste du code',
                'Analyse des journaux d\'authentification : signaux faibles à surveiller',
                'Rétention des journaux : arbitrer entre coût, conformité et investigation',
            ]],
            ['threat-intel', 'Threat Intelligence et MITRE ATT&CK', $op, false, [
                'Threat Intelligence stratégique, opérationnelle et tactique : à qui sert chacune',
                'Utiliser MITRE ATT&CK pour mesurer sa couverture de détection',
                'Les indicateurs de compromission ont une durée de vie limitée',
                'De l\'IOC au comportement : remonter la pyramide de la douleur',
                'Construire une veille cyber utile sans se noyer dans l\'information',
                'Partager le renseignement sur les menaces entre organisations',
            ]],
            ['pentest', 'Pentest et Ethical Hacking', $si, false, [
                'Ce qu\'un rapport de pentest doit apporter à un décideur',
                'Le cadre légal et contractuel d\'un test d\'intrusion',
                'Pentest, audit et scan de vulnérabilités : trois choses différentes',
                'La phase de reconnaissance : pourquoi elle conditionne tout le test',
                'Prioriser les corrections après un test d\'intrusion',
                'L\'éthique du hacker éthique au quotidien',
                'Tests d\'intrusion applicatifs : les familles de failles toujours présentes',
            ]],
            ['red-blue-purple', 'Red Team, Blue Team et Purple Team', $si, false, [
                'Red Team et pentest : des objectifs différents',
                'Le Purple Teaming comme accélérateur d\'apprentissage pour le SOC',
                'Ce que la Blue Team apprend d\'un exercice Red Team',
                'Organiser un premier exercice Purple Team dans une petite structure',
                'Mesurer la valeur d\'un exercice d\'attaque simulée',
            ]],
            ['network-security', 'Sécurité des réseaux', $si, false, [
                'La segmentation réseau, protection sous-estimée',
                'Surveiller les flux sortants : un signal souvent négligé',
                'DNS : une mine d\'informations pour la détection',
                'Accès à distance et exposition sur Internet : faire l\'inventaire',
                'Pare-feu : la dérive des règles et comment la maîtriser',
            ]],
            ['systems-security', 'Sécurité Linux et Windows', $si, false, [
                'Durcir un serveur Linux : les fondamentaux avant les outils',
                'Les comptes de service, angle mort de nombreuses organisations',
                'Journalisation Linux utile pour la détection d\'intrusion',
                'Sécurité Windows : le principe du moindre privilège appliqué',
                'Gestion des correctifs sur un parc hétérogène',
                'PowerShell : outil d\'administration et vecteur d\'attaque',
            ]],
            ['active-directory', 'Active Directory Security', $si, false, [
                'Pourquoi Active Directory reste une cible prioritaire des attaquants',
                'Le modèle de tiering pour protéger les comptes à privilèges',
                'Kerberoasting : comprendre le principe pour mieux le détecter',
                'Auditer régulièrement les groupes privilégiés',
                'Les délégations dangereuses dans Active Directory',
                'Surveiller les modifications sensibles de l\'annuaire',
            ]],
            ['vuln-management', 'Gestion des vulnérabilités', $si, false, [
                'Prioriser les vulnérabilités au-delà du score CVSS',
                'Le catalogue des vulnérabilités exploitées comme outil de priorisation',
                'Inventaire des actifs : sans lui, pas de gestion des vulnérabilités',
                'Mesurer le délai de correction et le réduire',
                'Que faire quand un correctif n\'est pas disponible',
            ]],
            ['malware-ransomware', 'Malware Analysis et Ransomware', $adv, false, [
                'Analyse statique et dynamique : complémentarité et limites',
                'Construire un environnement d\'analyse de malware sûr',
                'Les étapes typiques d\'une attaque par rançongiciel',
                'Sauvegardes et rançongiciels : ce qui protège vraiment',
                'Les signaux précurseurs d\'un rançongiciel dans les journaux',
                'Double extorsion : pourquoi la sauvegarde ne suffit plus',
            ]],
            ['phishing-osint', 'Phishing et OSINT', $adv, false, [
                'Analyser un e-mail de phishing comme un analyste SOC',
                'Les en-têtes d\'un e-mail : ce qu\'ils révèlent',
                'Sensibilisation au phishing : au-delà des campagnes de test',
                'OSINT : ce que votre organisation expose sans le savoir',
                'Le cadre éthique de l\'OSINT',
                'Phishing et authentification multifacteur : les techniques de contournement à connaître',
            ]],
            ['forensics', 'Forensic et Digital Forensics', $adv, false, [
                'Préserver les preuves numériques : les erreurs qui coûtent cher',
                'Ordre de volatilité : par quoi commencer la collecte',
                'La chronologie, colonne vertébrale d\'une investigation',
                'Forensic mémoire : pourquoi elle change la donne',
                'Documenter une investigation pour qu\'elle soit exploitable',
            ]],
            ['cloud-zero-trust', 'Cloud Security et Zero Trust', $adv, false, [
                'Le modèle de responsabilité partagée dans le cloud',
                'Mauvaises configurations cloud : la première source de risque',
                'Zero Trust : un principe, pas un produit',
                'Journalisation dans le cloud : ce qu\'il faut activer dès le départ',
                'Gérer les identités dans un environnement multicloud',
            ]],
            ['iam-pam', 'IAM et PAM', $adv, false, [
                'Gestion des identités : le nouveau périmètre de sécurité',
                'Comptes à privilèges : inventaire, coffre et surveillance',
                'Le cycle de vie des accès : arrivée, mobilité, départ',
                'Authentification multifacteur : choisir les bonnes méthodes',
                'Revue des accès : en faire un processus utile',
            ]],
            ['m365-edr', 'Microsoft 365, EDR et XDR', $adv, false, [
                'Sécuriser Microsoft 365 : les réglages de base souvent oubliés',
                'Les journaux d\'audit Microsoft 365 pour l\'investigation',
                'EDR et antivirus : ce qui change réellement',
                'XDR : promesse et réalité opérationnelle',
                'Réduire le bruit d\'un EDR sans perdre en détection',
                'Accès conditionnel : sécuriser sans bloquer les utilisateurs',
            ]],
            ['news-vulns', 'CVE récentes et vulnérabilités critiques', $news, true, [
                'Analyse de vulnérabilités récemment ajoutées au catalogue des vulnérabilités exploitées',
                'Ce que les dernières alertes officielles imposent aux équipes de correction',
            ]],
            ['news-threats', 'Cyberattaques, APT et cybercriminalité', $news, true, [
                'Lecture commentée d\'un rapport officiel récent sur la menace',
                'Ce que les derniers avis de sécurité officiels disent des techniques d\'attaque',
            ]],
            ['regulation', 'Évolutions réglementaires et gouvernance', $news, false, [
                'Pourquoi la conformité ne remplace pas la sécurité',
                'Expliquer le risque cyber à un comité de direction',
                'La gestion des risques fournisseurs et tiers',
                'Protection des données personnelles : le rôle du SOC',
            ]],
            ['certifications', 'Certifications (CISSP, CEH, CySA+, Security+, CISM, CCNA, SC-200, ISO 27001)', $car, false, [
                'Choisir une certification selon son objectif de carrière',
                'Security+ et CySA+ : quel parcours pour un futur analyste SOC',
                'CISSP et CISM : certifications de gestion, pas seulement techniques',
                'SC-200 : ce que couvre la certification orientée opérations de sécurité Microsoft',
                'ISO 27001 : comprendre le système de management de la sécurité',
                'CEH et la pratique : comment compléter une certification par des laboratoires',
                'CCNA : pourquoi les bases réseau restent un atout en cybersécurité',
                'Préparer une certification en travaillant à temps plein',
            ]],
            ['career-soc', 'Carrière SOC Analyst et SOC Manager', $car, false, [
                'Les compétences qui font progresser un analyste SOC',
                'Du poste d\'analyste au rôle de SOC Manager : ce qui change',
                'Se former en continu sans s\'épuiser',
                'Conseils pour un premier entretien d\'analyste SOC',
                'Les compétences non techniques indispensables en cybersécurité',
                'Construire un portfolio de laboratoires cyber',
                'Le mentorat en cybersécurité : donner et recevoir',
            ]],
            ['africa', 'Cybersécurité en Afrique', $af, false, [
                'Les enjeux de la cybersécurité pour les banques africaines',
                'Protéger les infrastructures critiques en Afrique de l\'Ouest et centrale',
                'Souveraineté numérique africaine et maîtrise des données',
                'Mobile money et sécurité : un enjeu africain spécifique',
                'Coopération régionale face à la cybercriminalité',
                'La place des CERT nationaux dans l\'écosystème africain',
            ]],
            ['africa-talents', 'Talents et compétences cyber en Afrique', $af, false, [
                'Former les jeunes talents africains en cybersécurité',
                'Développer les compétences locales plutôt que dépendre de l\'extérieur',
                'Communautés et clubs de cybersécurité : un levier pour l\'Afrique',
                'Les métiers de la cybersécurité accessibles aux jeunes diplômés',
                'Laboratoires à faible coût pour apprendre la cybersécurité',
            ]],
        ];
    }

    /** Calendrier par défaut : jour ISO => catégories. */
    public static function weeklyCalendar(): array
    {
        return [
            1 => ['soc-analysis', 'threat-hunting', 'incident-response', 'siem-engineering', 'threat-intel'],
            2 => ['pentest', 'red-blue-purple', 'network-security', 'systems-security', 'active-directory', 'vuln-management'],
            3 => ['news-vulns', 'news-threats'],
            4 => ['cloud-zero-trust', 'iam-pam', 'm365-edr', 'forensics', 'malware-ransomware', 'phishing-osint'],
            5 => ['certifications', 'career-soc', 'africa', 'africa-talents'],
            6 => [],
            7 => [],
        ];
    }

    /** Catégories de repli lorsqu'aucune source d'actualité n'est disponible. */
    public static function newsFallback(): array
    {
        return ['vuln-management', 'malware-ransomware', 'threat-intel', 'regulation'];
    }

    /** Formats d'écriture, tirés au sort pour varier la structure des publications. */
    public static function angles(): array
    {
        return [
            'explication pédagogique d\'une notion, illustrée par un scénario type',
            'les erreurs fréquentes et comment les éviter',
            'méthode pas à pas, présentée en étapes courtes',
            'une idée reçue confrontée à la réalité du terrain',
            'analyse d\'un scénario type, présenté explicitement comme un cas d\'école',
            'liste de contrôle commentée',
            'comparaison entre deux approches, avantages et limites',
            'réflexion d\'analyste sur une tendance de fond, sans chiffres',
        ];
    }
}
