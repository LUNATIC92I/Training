/* Module 3 : Sécuriser un smartphone Android classique
   Les chemins de menus sont donnés pour Android 14 à 16. Les libellés varient
   selon le fabricant et la version : utilisez la recherche des Paramètres
   (icône loupe) en cas de doute. */
window.ASG = window.ASG || {}; ASG.content = ASG.content || {};
ASG.content.m3 = [
/* ---------------------------------------------------------------- 3.1 */
{
  obj: "Configurer un verrouillage d'écran sécurisé, un délai de verrouillage court et l'option de verrouillage renforcé.",
  intro: [
    "Le verrouillage d'écran est la première barrière entre votre vie numérique et toute personne qui prend votre téléphone en main. C'est aussi lui qui protège les clés de chiffrement de vos données (module 1, leçon 9).",
    "Un bon verrouillage repose sur trois éléments : une méthode robuste, un délai court et la possibilité de désactiver temporairement la biométrie."
  ],
  tech: [
    { h: "Choisir la méthode", p: [
      "Le <b>schéma</b> laisse des traces visibles sur l'écran et offre peu de combinaisons réellement utilisées. Le <b>PIN</b> est un bon compromis s'il est long et aléatoire. Le <b>mot de passe</b> alphanumérique est le plus robuste. Les méthodes « Aucun » et « Balayer l'écran » n'offrent aucune protection."
    ]},
    { h: "Le délai et le bouton marche", p: [
      "Le réglage « Verrouiller automatiquement après la mise en veille » doit être court (immédiatement à 30 secondes). L'option « Le bouton Marche/Arrêt verrouille instantanément » doit rester active."
    ]},
    { h: "Le mode « Verrouillage »", p: [
      "Depuis Android 9, une option du menu d'alimentation, appelée <b>Verrouillage</b> (Lockdown), verrouille l'appareil, masque les notifications et désactive la biométrie et Smart Lock jusqu'à la prochaine saisie du code. Elle est utile si l'on risque de vous forcer à poser votre doigt sur le capteur."
    ]}
  ],
  fig: "lockscreen",
  steps: [
    "<b>Pixel</b> : <b>Paramètres › Sécurité et confidentialité › Déverrouillage de l'appareil › Verrouillage de l'écran</b>. <b>Samsung</b> : <b>Paramètres › Écran de verrouillage et AOD › Type de verrouillage de l'écran</b>. <b>Xiaomi (HyperOS)</b> : <b>Paramètres › Empreintes, données faciales et verrouillage de l'écran</b>.",
    "Saisissez votre code actuel, puis choisissez <b>Code PIN</b> (6 chiffres ou plus) ou <b>Mot de passe</b>.",
    "Ouvrez les réglages associés (icône engrenage à côté de « Verrouillage de l'écran » sur Pixel, « Paramètres de verrouillage sécurisé » sur Samsung).",
    "Réglez <b>Verrouiller automatiquement</b> sur <b>Immédiatement</b> ou <b>5 secondes</b>.",
    "Activez <b>Le bouton Marche/Arrêt verrouille instantanément</b>.",
    "Vérifiez que l'option <b>Verrouillage</b> apparaît dans le menu d'alimentation (appui long sur le bouton Marche/Arrêt, ou Marche + Volume haut selon les modèles). Sur certains appareils Samsung, activez <b>Afficher l'option Verrouillage</b> dans les paramètres de verrouillage sécurisé."
  ],
  result: "L'appareil se verrouille quelques secondes après la mise en veille, avec un PIN ou un mot de passe robuste, et l'option Verrouillage est disponible.",
  ex: [
    "Dans un lieu public, vous posez votre téléphone sur la table : avec un délai de verrouillage de 10 minutes, toute personne peut le saisir et consulter vos messages.",
    "Lors d'un contrôle ou d'une agression, l'option Verrouillage empêche que l'on vous force à déverrouiller avec votre empreinte."
  ],
  err: [
    ["Utiliser un schéma simple en forme de lettre.", "Passez à un PIN aléatoire de 6 chiffres minimum ou à un mot de passe."],
    ["Laisser Smart Lock déverrouiller le téléphone à proximité d'une montre ou au domicile.", "Désactivez Smart Lock (ou « Extend Unlock ») : un voleur profite aussi de ces conditions."],
    ["Choisir un délai de verrouillage long pour le confort.", "Gardez un délai court et utilisez la biométrie pour un déverrouillage rapide."]
  ],
  reco: [
    "Pour un usage professionnel ou à risque, préférez un mot de passe d'au moins 8 caractères.",
    "Apprenez le geste du menu d'alimentation par cœur pour pouvoir activer le verrouillage sans réfléchir.",
    "Ne partagez jamais votre code, même avec un proche."
  ],
  sum: "Un verrouillage sécurisé combine une méthode robuste (PIN long ou mot de passe), un délai de verrouillage court, le verrouillage instantané par le bouton Marche/Arrêt et l'option Verrouillage qui désactive temporairement la biométrie.",
  quiz: [
    { q: "Quelle méthode de verrouillage est la plus robuste ?", o: ["Schéma", "Balayer l'écran", "Mot de passe alphanumérique long", "Aucune"], a: 2, e: "Le mot de passe offre l'espace de combinaisons le plus grand." },
    { q: "Que fait l'option « Verrouillage » du menu d'alimentation ?", o: ["Elle éteint le téléphone", "Elle désactive la biométrie et Smart Lock jusqu'à la saisie du code", "Elle supprime les données", "Elle active le mode avion"], a: 1, e: "Seul le code permet alors de déverrouiller l'appareil." },
    { q: "Quel délai de verrouillage automatique est recommandé ?", o: ["30 minutes", "Immédiatement à quelques secondes", "Jamais", "1 heure"], a: 1, e: "Un délai court limite la fenêtre d'accès pour un tiers." }
  ]
},
/* ---------------------------------------------------------------- 3.2 */
{
  obj: "Choisir et mémoriser un code PIN réellement robuste, et comprendre les mécanismes qui limitent les tentatives.",
  intro: [
    "Un PIN à 4 chiffres offre 10 000 combinaisons ; un PIN à 6 chiffres en offre un million. Mais la vraie faiblesse vient des choix humains : dates de naissance, années, suites logiques, codes répétés.",
    "Un PIN robuste est long, aléatoire et n'a aucun lien avec votre vie."
  ],
  tech: [
    { h: "Pourquoi la longueur et le hasard comptent", p: [
      "Les composants sécurisés imposent des délais croissants entre les essais, ce qui rend impossible de tester toutes les combinaisons. Mais un attaquant commence toujours par les codes les plus probables : <code>123456</code>, <code>000000</code>, <code>111111</code>, années de naissance. Si votre code est parmi eux, il sera trouvé en quelques essais seulement."
    ]},
    { h: "Les protections complémentaires", ul: [
      "<b>Délais croissants</b> entre les essais, gérés par le matériel sur les appareils récents.",
      "<b>Effacement automatique</b> après un certain nombre d'échecs, proposé par certains fabricants (par exemple Samsung) et configurable par la gestion de flotte en entreprise.",
      "<b>Brouillage du clavier du PIN</b> sur GrapheneOS, pour limiter l'observation des gestes."
    ]}
  ],
  fig: "lockscreen",
  steps: [
    "Générez un code de 6 à 8 chiffres au hasard, par exemple en lançant un dé ou en utilisant le générateur d'un gestionnaire de mots de passe.",
    "Vérifiez qu'il ne contient ni date, ni suite, ni répétition, ni motif visuel sur le clavier.",
    "Remplacez votre code actuel dans les réglages de verrouillage (leçon précédente).",
    "Entraînez-vous à le saisir une dizaine de fois dans la journée pour le mémoriser.",
    "Si votre appareil le propose, désactivez l'animation ou l'affichage des chiffres saisis (option de confidentialité du PIN)."
  ],
  result: "Votre appareil est protégé par un PIN aléatoire de 6 chiffres ou plus, que vous saisissez sans hésitation.",
  ex: [
    "Le code 199204 (année et mois de naissance) sera trouvé rapidement par une personne qui connaît votre date de naissance.",
    "Le code 847 291 tiré au hasard ne peut pas être deviné à partir d'informations personnelles."
  ],
  err: [
    ["Réutiliser le code de sa carte bancaire.", "Utilisez un code unique pour le téléphone."],
    ["Noter le code sur la coque ou dans les contacts.", "Mémorisez-le ; si besoin, conservez-le dans un gestionnaire de mots de passe sur un autre appareil."],
    ["Saisir le code à la vue de tous dans les transports.", "Masquez le clavier avec la main et utilisez la biométrie en public."]
  ],
  reco: [
    "Six chiffres aléatoires constituent un minimum raisonnable ; huit chiffres ou plus pour un usage sensible.",
    "Changez de code si vous pensez qu'il a été observé.",
    "En entreprise, définissez une politique de complexité adaptée via l'outil de gestion des terminaux."
  ],
  sum: "La robustesse d'un PIN dépend de sa longueur et de son caractère aléatoire. La limitation matérielle des essais protège contre la force brute, mais pas contre un code prévisible. Un PIN aléatoire de 6 à 8 chiffres, unique et mémorisé, est une protection solide.",
  quiz: [
    { q: "Combien de combinaisons offre un PIN à 6 chiffres ?", o: ["10 000", "100 000", "1 000 000", "60"], a: 2, e: "10 puissance 6 = 1 000 000 combinaisons." },
    { q: "Pourquoi un PIN basé sur une date de naissance est-il faible ?", o: ["Parce qu'il est trop long", "Parce qu'il fait partie des premiers codes testés par un attaquant", "Parce qu'il désactive le chiffrement", "Il n'est pas faible"], a: 1, e: "Les attaquants testent d'abord les codes probables, dont les dates." },
    { q: "Quel est le meilleur moyen de générer un PIN robuste ?", o: ["Choisir son année de naissance", "Utiliser un tirage aléatoire", "Utiliser 123456", "Reprendre le code de sa carte bancaire"], a: 1, e: "Le hasard empêche toute déduction à partir d'informations personnelles." }
  ]
},
/* ---------------------------------------------------------------- 3.3 */
{
  obj: "Configurer la biométrie en connaissant ses niveaux de sécurité, ses avantages et ses limites.",
  intro: [
    "L'empreinte digitale et la reconnaissance faciale rendent le déverrouillage rapide, ce qui encourage à garder un code robuste et un délai de verrouillage court. Mais toutes les biométries ne se valent pas.",
    "La biométrie doit être vue comme une commodité qui complète le code, jamais comme un remplacement."
  ],
  tech: [
    { h: "Les classes de biométrie", p: [
      "Android classe les capteurs biométriques en niveaux. Les capteurs de <b>classe 3</b> (forte) répondent aux exigences les plus strictes et peuvent être utilisés pour déverrouiller des clés du Keystore et valider des paiements. Les capteurs de <b>classe 2</b> (faible), comme de nombreux systèmes de reconnaissance faciale basés sur une simple caméra 2D, ne peuvent pas protéger ces opérations sensibles. La documentation de votre appareil précise le niveau."
    ]},
    { h: "Où sont stockées les données", p: [
      "Les modèles biométriques sont traités et stockés dans l'environnement sécurisé de l'appareil. Ils ne sont pas envoyés dans le cloud et ne sont pas accessibles aux applications, qui reçoivent seulement un résultat « réussi » ou « échoué »."
    ]},
    { h: "Les limites", p: [
      "On peut vous contraindre physiquement à présenter votre doigt ou votre visage, ce qui est plus difficile avec un code mémorisé. Après un redémarrage, et après un certain délai sans saisie du code, Android exige de toute façon le code."
    ]}
  ],
  fig: "lockscreen",
  steps: [
    "Configurez d'abord un PIN ou un mot de passe robuste (obligatoire pour activer la biométrie).",
    "<b>Pixel</b> : <b>Paramètres › Sécurité et confidentialité › Déverrouillage de l'appareil › Déverrouillage par empreinte digitale et reconnaissance faciale</b>. <b>Samsung</b> : <b>Paramètres › Sécurité et confidentialité › Biométrie</b>.",
    "Enregistrez une ou deux empreintes (index et pouce de la main dominante, par exemple), avec soin et sous plusieurs angles.",
    "Si la reconnaissance faciale de votre appareil est de classe 2, réservez-la au simple déverrouillage ou désactivez-la.",
    "Supprimez toute empreinte que vous ne reconnaissez pas ou qui appartient à une autre personne.",
    "Mémorisez l'option Verrouillage du menu d'alimentation pour désactiver temporairement la biométrie."
  ],
  result: "La biométrie est active uniquement pour vos propres empreintes, en complément d'un code robuste.",
  ex: [
    "Une personne de l'entourage a enregistré son empreinte « pour dépanner » : elle peut déverrouiller l'appareil à tout moment. Supprimez-la.",
    "Sur un téléphone d'entrée de gamme, une photo suffit parfois à tromper la reconnaissance faciale 2D."
  ],
  err: [
    ["Enregistrer l'empreinte d'un proche.", "N'enregistrez que vos propres empreintes."],
    ["Utiliser uniquement la reconnaissance faciale 2D pour des paiements.", "Vérifiez la classe du capteur ; utilisez l'empreinte ou le code."],
    ["Oublier son code parce que l'on n'utilise que la biométrie.", "Saisissez régulièrement votre code pour le garder en mémoire."]
  ],
  reco: [
    "Utilisez la biométrie pour garder un code long tout en restant pratique au quotidien.",
    "Dans les situations à risque (manifestation, passage de frontière), activez l'option Verrouillage ou éteignez l'appareil.",
    "Sur GrapheneOS, envisagez le déverrouillage en deux facteurs : empreinte puis PIN (module 7)."
  ],
  sum: "La biométrie complète un code robuste sans le remplacer. Les capteurs de classe 3 sont adaptés aux opérations sensibles, ceux de classe 2 non. Les données biométriques restent dans l'environnement sécurisé de l'appareil. L'option Verrouillage permet de la désactiver temporairement.",
  quiz: [
    { q: "Quelle classe de biométrie peut protéger des clés du Keystore et des paiements ?", o: ["Classe 1", "Classe 2", "Classe 3", "Toutes"], a: 2, e: "Seule la biométrie forte (classe 3) est acceptée pour ces opérations." },
    { q: "Où sont stockés les modèles d'empreintes digitales ?", o: ["Sur les serveurs de Google", "Dans l'environnement sécurisé de l'appareil", "Dans la galerie photo", "Sur la carte SIM"], a: 1, e: "Ils restent dans l'environnement isolé et ne sont pas accessibles aux applications." },
    { q: "La biométrie peut-elle remplacer le code de verrouillage ?", o: ["Oui, totalement", "Non, elle le complète et le code reste exigé dans certains cas", "Oui, après un redémarrage", "Seulement sur tablette"], a: 1, e: "Le code est obligatoire pour l'activer et après un redémarrage." }
  ]
},
/* ---------------------------------------------------------------- 3.4 */
{
  obj: "Activer et vérifier toutes les mises à jour automatiques : système, Google Play et applications.",
  intro: [
    "La plupart des attaques de masse exploitent des failles déjà corrigées sur les appareils à jour. Activer les mises à jour automatiques est donc la mesure la plus rentable de toute cette formation.",
    "Android dispose de trois canaux distincts qu'il faut configurer séparément."
  ],
  tech: [
    { h: "Les trois canaux", ul: [
      "<b>Mise à jour logicielle du fabricant</b> : système complet, noyau, pilotes, correctif mensuel.",
      "<b>Mise à jour du système Google Play</b> : modules Mainline mis à jour par Google, indépendamment du fabricant.",
      "<b>Mises à jour des applications</b> : via Google Play ou le magasin du fabricant, y compris Chrome et Android System WebView."
    ]},
    { h: "Les mises à jour transparentes", p: [
      "Sur les appareils compatibles (dont les Pixel), les mises à jour sont installées en arrière-plan sur une partition inactive, puis appliquées au redémarrage : on parle de mises à jour A/B ou « transparentes ». Le redémarrage est rapide et, en cas d'échec, l'appareil revient automatiquement à la version précédente."
    ]}
  ],
  fig: "update-cycle",
  steps: [
    "<b>Système, Pixel</b> : <b>Paramètres › Système › Mise à jour logicielle</b>, puis <b>Mise à jour du système</b>. <b>Samsung</b> : <b>Paramètres › Mise à jour logicielle</b> et activez <b>Téléchargement auto via Wi-Fi</b>. <b>Xiaomi</b> : <b>Paramètres › À propos du téléphone › Version HyperOS</b>, puis les réglages de téléchargement automatique.",
    "Installez immédiatement toute mise à jour en attente et redémarrez.",
    "<b>Système Google Play</b> : <b>Paramètres › Sécurité et confidentialité › Système et mises à jour › Mise à jour du système Google Play</b> (libellé variable) et installez la mise à jour disponible.",
    "<b>Applications</b> : ouvrez <b>Google Play</b>, touchez votre photo de profil › <b>Paramètres › Préférences réseau › Mise à jour automatique des applis</b> et choisissez une option active.",
    "Dans Google Play, touchez votre profil › <b>Gérer les applis et l'appareil</b> et installez les mises à jour en attente.",
    "Répétez l'opération dans le magasin du fabricant s'il est utilisé (Galaxy Store, GetApps)."
  ],
  result: "Les trois canaux de mise à jour sont automatiques et aucune mise à jour n'est en attente.",
  ex: [
    "Une faille du navigateur est exploitée par des sites piégés : la mise à jour automatique de Chrome la corrige en quelques jours sur les appareils configurés.",
    "Un utilisateur ignore depuis des mois la notification « Redémarrer pour installer » : son correctif de sécurité reste ancien."
  ],
  err: [
    ["Désactiver les mises à jour pour « garder de l'espace ».", "Libérez de l'espace autrement (photos sauvegardées, applications inutiles)."],
    ["Reporter le redémarrage indéfiniment.", "Redémarrez le soir même ou programmez l'installation nocturne."],
    ["Oublier le magasin du fabricant.", "Activez aussi ses mises à jour automatiques."]
  ],
  reco: [
    "Gardez au moins 10 % d'espace libre pour que les mises à jour puissent s'installer.",
    "Branchez votre téléphone la nuit en Wi-Fi : c'est souvent le moment où les mises à jour s'appliquent.",
    "En entreprise, imposez un délai maximal d'installation via la gestion de flotte."
  ],
  sum: "Trois canaux de mises à jour coexistent : le système du fabricant, le système Google Play et les applications. Chacun doit être réglé en automatique. Installer rapidement et redémarrer sans tarder est la mesure de sécurité la plus efficace.",
  quiz: [
    { q: "Combien de canaux de mise à jour faut-il vérifier sur un Android avec services Google ?", o: ["Un seul", "Trois : système, système Google Play, applications", "Aucun, tout est automatique", "Deux : Wi-Fi et Bluetooth"], a: 1, e: "Chacun corrige des composants différents." },
    { q: "Que se passe-t-il en cas d'échec d'une mise à jour A/B ?", o: ["L'appareil est bloqué définitivement", "Il revient automatiquement à la version précédente", "Toutes les données sont effacées", "Il faut changer d'appareil"], a: 1, e: "La partition inactive permet un retour en arrière automatique." },
    { q: "Pourquoi mettre à jour Android System WebView ?", o: ["Il affiche le contenu web dans de nombreuses applications et est très exposé", "Il gère la batterie", "Il n'a aucune importance", "Il sert aux photos"], a: 0, e: "WebView traite du contenu web potentiellement hostile dans de nombreuses applications." }
  ]
},
/* ---------------------------------------------------------------- 3.5 */
{
  obj: "Vérifier précisément le niveau de correctif de sécurité de son appareil et l'interpréter correctement.",
  intro: [
    "Une notification « votre système est à jour » ne signifie pas que votre appareil est protégé : si le fabricant ne publie plus rien, le téléphone est « à jour » d'une version ancienne.",
    "Seule la date du correctif de sécurité indique réellement l'état de protection."
  ],
  tech: [
    { h: "Lire le niveau de correctif", p: [
      "Le niveau est une date de la forme AAAA-MM-JJ. Les bulletins Android définissent deux niveaux par mois : <code>AAAA-MM-01</code> (correctifs de la plateforme Android) et <code>AAAA-MM-05</code> (incluant aussi les composants du noyau et des fournisseurs). Un appareil au niveau <code>-05</code> couvre l'ensemble des failles publiées dans le bulletin du mois."
    ]},
    { h: "Interpréter l'écart", ul: [
      "Moins de 1 mois : excellent.",
      "1 à 3 mois : acceptable, mais vérifiez qu'une mise à jour n'est pas en attente.",
      "Plus de 3 mois : risque croissant ; renseignez-vous sur le support de votre modèle.",
      "Plus d'un an : l'appareil ne devrait plus contenir de données sensibles."
    ]}
  ],
  fig: "update-cycle",
  steps: [
    "<b>Pixel</b> : <b>Paramètres › Sécurité et confidentialité › Système et mises à jour › Mise à jour de sécurité</b>. <b>Samsung</b> : <b>Paramètres › À propos du téléphone › Informations sur le logiciel › Niveau du correctif de sécurité Android</b>. <b>Xiaomi</b> : <b>Paramètres › À propos du téléphone › Toutes les spécifications</b> (ou <b>Version Android</b>).",
    "Notez la date affichée.",
    "Calculez l'écart avec la date du jour.",
    "Vérifiez sur le site du fabricant si une mise à jour plus récente existe pour votre modèle et votre région.",
    "Consignez la date dans votre fiche d'appareil (module 1, leçon 1)."
  ],
  result: "Vous connaissez la date exacte du correctif installé et savez si votre appareil est en retard.",
  ex: [
    "Le 1er novembre 2026, un appareil affichant <code>2026-10-05</code> est parfaitement à jour.",
    "Un appareil affichant <code>2024-03-01</code> ignore plus de deux ans et demi de correctifs : ses failles connues sont publiques."
  ],
  err: [
    ["Confondre la date de la mise à jour système Google Play avec le correctif de sécurité.", "Lisez bien la ligne « Mise à jour de sécurité » ou « Niveau du correctif de sécurité »."],
    ["Se contenter du message « Votre système est à jour ».", "Vérifiez toujours la date du correctif."],
    ["Installer une ROM non officielle pour « avoir un correctif récent ».", "Une ROM non vérifiée peut afficher une date sans contenir les correctifs réels des composants."]
  ],
  reco: [
    "Vérifiez la date du correctif chaque mois, par exemple le premier lundi.",
    "Si le fabricant ne suit plus votre modèle, planifiez son remplacement.",
    "Pour aller plus loin, comparez avec le bulletin du mois sur source.android.com."
  ],
  sum: "Le niveau de correctif est une date (AAAA-MM-01 ou AAAA-MM-05). Il est le seul indicateur fiable de l'état de protection. Un écart de plus de trois mois doit alerter, et un appareil sans correctif depuis plus d'un an ne devrait plus contenir de données sensibles.",
  quiz: [
    { q: "Quelle différence entre les niveaux AAAA-MM-01 et AAAA-MM-05 ?", o: ["Aucune", "Le niveau -05 couvre aussi les composants du noyau et des fournisseurs", "Le niveau -01 est plus complet", "Le -05 est réservé aux tablettes"], a: 1, e: "Le niveau -05 inclut l'ensemble des correctifs du bulletin." },
    { q: "Le message « votre système est à jour » garantit-il un correctif récent ?", o: ["Oui, toujours", "Non, il indique seulement qu'aucune mise à jour n'est proposée", "Oui, si le Wi-Fi est actif", "Oui, sur Samsung uniquement"], a: 1, e: "Un appareil abandonné par son fabricant est « à jour » d'une version ancienne." },
    { q: "À partir de quel écart faut-il s'inquiéter sérieusement ?", o: ["Une semaine", "Plus de trois mois", "Dix ans", "Jamais"], a: 1, e: "Au-delà de trois mois, de nombreuses failles publiées restent ouvertes." }
  ]
},
/* ---------------------------------------------------------------- 3.6 */
{
  obj: "Mener une revue complète des autorisations des applications, y compris les accès spéciaux, et maintenir cette hygiène dans le temps.",
  intro: [
    "La leçon 5 du module 1 a présenté le modèle de permissions. Ici, vous passez à la pratique : une revue complète, méthodique, de toutes les autorisations de votre appareil.",
    "Comptez 20 à 30 minutes pour une première revue, puis quelques minutes par mois."
  ],
  tech: [
    "Android regroupe les autorisations par catégorie dans le gestionnaire d'autorisations, et les droits les plus puissants dans le menu des accès spéciaux. La fonction de <b>suppression des autorisations des applications inutilisées</b> retire automatiquement les droits des applications que vous n'avez pas ouvertes depuis plusieurs mois.",
    { h: "Les accès spéciaux à surveiller en priorité", ul: [
      "Applications d'administration de l'appareil.",
      "Accès à toutes les notifications.",
      "Affichage par-dessus d'autres applications.",
      "Installation d'applications inconnues.",
      "Accès à tous les fichiers.",
      "Accès aux données d'utilisation.",
      "Modification des paramètres système."
    ]}
  ],
  fig: "permissions",
  steps: [
    "Ouvrez le <b>Gestionnaire d'autorisations</b> (voir module 1, leçon 5 pour le chemin selon votre appareil).",
    "Passez en revue chaque catégorie, en commençant par Position, Caméra, Micro, Contacts, SMS, Journal d'appels, Appareils à proximité, Photos et vidéos.",
    "Pour chaque application, choisissez le niveau d'accès minimal compatible avec son usage.",
    "Ouvrez <b>Paramètres › Applications › Accès spécial des applis</b> (Samsung : <b>Paramètres › Applications</b>, menu ⋮ › <b>Accès spéciaux</b>).",
    "Retirez chaque accès spécial non justifié, en priorité ceux listés ci-dessus.",
    "Dans les détails des applications que vous utilisez rarement, vérifiez que l'option <b>Suspendre l'activité si l'appli n'est pas utilisée</b> (ou équivalent) est active."
  ],
  result: "Toutes les catégories sensibles et les accès spéciaux ont été revus, et les autorisations des applications inutilisées sont retirées automatiquement.",
  ex: [
    "Une application de clavier tiers dispose de l'accès Internet et voit tout ce que vous tapez : n'utilisez qu'un clavier de confiance.",
    "Une application de VPN gratuit est déclarée administrateur de l'appareil : retirez ce droit et désinstallez-la."
  ],
  err: [
    ["Revoir les permissions une fois puis ne plus jamais y revenir.", "Planifiez une revue mensuelle rapide."],
    ["Ignorer les applications préinstallées.", "Revoyez aussi leurs autorisations ; désactivez celles que vous n'utilisez pas."],
    ["Retirer une autorisation essentielle puis désinstaller par frustration.", "Réaccordez temporairement l'accès nécessaire en choisissant le niveau minimal."]
  ],
  reco: [
    "Tenez une courte liste des applications auxquelles vous accordez des accès sensibles, avec la justification.",
    "Pour un appareil professionnel, documentez les autorisations attendues de chaque application métier.",
    "Combinez cette revue avec l'inventaire des applications (module 9)."
  ],
  sum: "La revue des autorisations couvre les catégories sensibles du gestionnaire et les accès spéciaux, plus puissants. Le choix du niveau minimal, la suspension des applications inutilisées et une revue mensuelle maintiennent une bonne hygiène.",
  quiz: [
    { q: "Lequel de ces droits se trouve dans les accès spéciaux ?", o: ["Affichage par-dessus d'autres applications", "Vibreur", "Luminosité", "Volume"], a: 0, e: "La superposition est un accès spécial très sensible." },
    { q: "À quoi sert la suspension des applications inutilisées ?", o: ["À retirer automatiquement leurs autorisations et à limiter leur activité", "À les supprimer définitivement", "À les mettre à jour", "À les cacher"], a: 0, e: "Elle réduit l'exposition sans que vous ayez à y penser." },
    { q: "Pourquoi un clavier tiers est-il sensible ?", o: ["Il voit tout ce que vous tapez", "Il consomme beaucoup", "Il empêche les mises à jour", "Il n'est pas sensible"], a: 0, e: "Un clavier a accès à toutes vos saisies, y compris des mots de passe." }
  ]
},
/* ---------------------------------------------------------------- 3.7 */
{
  obj: "Limiter précisément l'accès à la localisation : autorisations par application, précision, recherche Wi-Fi et Bluetooth, historique.",
  intro: [
    "Votre position révèle votre domicile, votre lieu de travail, vos habitudes, vos fréquentations, votre lieu de culte ou vos rendez-vous médicaux. C'est l'une des données les plus sensibles qu'un téléphone produit.",
    "Android offre plusieurs niveaux de contrôle, souvent méconnus."
  ],
  tech: [
    { h: "Les sources de localisation", p: [
      "La position est calculée à partir du GPS, mais aussi des réseaux Wi-Fi et des appareils Bluetooth environnants, ainsi que des antennes mobiles. Même avec la localisation désactivée, l'opérateur connaît approximativement la position de la ligne grâce aux antennes."
    ]},
    { h: "Les réglages disponibles", ul: [
      "<b>Autorisation par application</b> : toujours, pendant l'utilisation, demander à chaque fois, refuser.",
      "<b>Position précise ou approximative</b> (Android 12 et versions ultérieures).",
      "<b>Recherche Wi-Fi et Bluetooth</b> : autorise la détection des réseaux même lorsque le Wi-Fi ou le Bluetooth est désactivé, pour améliorer la localisation.",
      "<b>Précision de la localisation Google</b> : utilise les services de Google pour affiner la position.",
      "<b>Historique ou chronologie</b> des trajets du compte Google."
    ]}
  ],
  fig: "permissions",
  steps: [
    "Ouvrez <b>Paramètres › Localisation</b> (Samsung : <b>Paramètres › Localisation</b>).",
    "Ouvrez <b>Autorisations des applis</b> et repérez les applications en <b>Toujours autorisé</b>.",
    "Passez-les en <b>Autoriser seulement si l'appli est en cours d'utilisation</b>, sauf justification forte.",
    "Pour chaque application qui n'a pas besoin d'une position exacte, désactivez <b>Utiliser la position exacte</b>.",
    "Ouvrez <b>Services de localisation</b> et désactivez <b>Recherche Wi-Fi</b> et <b>Recherche Bluetooth</b> si vous n'en avez pas l'usage.",
    "Ouvrez votre compte Google (<b>myaccount.google.com › Données et confidentialité</b>) et vérifiez les réglages de l'historique des positions ou de la chronologie."
  ],
  result: "Aucune application inutile n'a accès à votre position, et les sources indirectes de localisation sont maîtrisées.",
  ex: [
    "Une application de réseau social en « Toujours autorisé » peut reconstituer vos déplacements quotidiens.",
    "Une application de météo fonctionne parfaitement avec la position approximative."
  ],
  err: [
    ["Désactiver la localisation en pensant être invisible.", "L'opérateur et certaines applications utilisent d'autres signaux ; gérez aussi les autorisations et les recherches Wi-Fi/Bluetooth."],
    ["Laisser des applications de jeu en « Toujours autorisé ».", "Réservez « Toujours » aux cas indispensables (traceur de sport en cours, par exemple)."],
    ["Partager sa position en temps réel sans limite de durée.", "Définissez toujours une durée de partage."]
  ],
  reco: [
    "Désactivez la localisation globale lorsque vous n'en avez pas besoin.",
    "Supprimez régulièrement l'historique de positions conservé par vos comptes.",
    "Retirez les métadonnées de localisation des photos avant de les partager (module 8)."
  ],
  sum: "La localisation combine GPS, Wi-Fi, Bluetooth et antennes. Les autorisations « pendant l'utilisation », la position approximative, la désactivation des recherches Wi-Fi/Bluetooth et la gestion de l'historique du compte permettent de la maîtriser.",
  quiz: [
    { q: "Quel réglage permet de donner une position moins précise à une application ?", o: ["Position approximative", "Mode avion", "Mode sombre", "Économiseur de batterie"], a: 0, e: "Depuis Android 12, on peut désactiver la position exacte par application." },
    { q: "Que fait la « Recherche Wi-Fi » dans les services de localisation ?", o: ["Elle permet de détecter les réseaux même lorsque le Wi-Fi est désactivé", "Elle accélère le Wi-Fi", "Elle chiffre le Wi-Fi", "Elle désactive le GPS"], a: 0, e: "Cette détection améliore la localisation mais réduit votre maîtrise." },
    { q: "Désactiver la localisation empêche-t-il l'opérateur de connaître votre position approximative ?", o: ["Oui", "Non, il utilise les antennes mobiles", "Oui, si le Bluetooth est coupé", "Oui, la nuit"], a: 1, e: "Le réseau mobile connaît toujours l'antenne à laquelle la ligne est connectée." }
  ]
},
/* ---------------------------------------------------------------- 3.8 */
{
  obj: "Contrôler l'accès au microphone et à la caméra grâce aux autorisations, aux indicateurs et aux interrupteurs globaux.",
  intro: [
    "La crainte d'être écouté ou filmé par son téléphone est répandue. Android offre aujourd'hui des outils concrets pour savoir quand la caméra et le micro sont utilisés, et pour les couper entièrement.",
    "Cette leçon vous apprend à les utiliser efficacement."
  ],
  tech: [
    { h: "Les outils disponibles (Android 12 et versions ultérieures)", ul: [
      "<b>Indicateurs</b> : un point vert apparaît en haut à droite de l'écran lorsque la caméra ou le micro est utilisé. En le touchant, vous voyez l'application concernée.",
      "<b>Interrupteurs globaux</b> : « Accès à l'appareil photo » et « Accès au micro » dans les réglages rapides coupent ces capteurs pour toutes les applications.",
      "<b>Autorisations par application</b>, avec l'option « Seulement cette fois ».",
      "<b>Tableau de bord de confidentialité</b> : historique des accès."
    ]},
    { h: "Les restrictions en arrière-plan", p: [
      "Depuis Android 9, les applications en arrière-plan ne peuvent plus accéder au micro ni à la caméra. Les services au premier plan (avec notification visible) restent possibles : c'est pourquoi la notification permanente d'une application inconnue doit vous alerter."
    ]}
  ],
  fig: "permissions",
  steps: [
    "Faites glisser deux fois vers le bas pour ouvrir les <b>réglages rapides</b>, touchez l'icône crayon et ajoutez les tuiles <b>Accès à l'appareil photo</b> et <b>Accès au micro</b>.",
    "Ouvrez le gestionnaire d'autorisations, catégorie <b>Micro</b>, et ne laissez l'accès qu'aux applications d'appel, de messagerie et d'enregistrement que vous utilisez réellement.",
    "Faites de même pour la catégorie <b>Appareil photo</b>.",
    "Pour les usages ponctuels (scanner un QR code), choisissez <b>Seulement cette fois</b>.",
    "Coupez l'accès global au micro et à la caméra lors des réunions confidentielles, puis réactivez-le ensuite."
  ],
  result: "Vous savez à tout moment si la caméra ou le micro est utilisé, et vous pouvez les couper d'un geste.",
  ex: [
    "Pendant une réunion stratégique, coupez l'accès au micro dans les réglages rapides : aucune application ne pourra enregistrer.",
    "Un point vert apparaît alors que vous lisez un article : touchez-le pour identifier l'application en cause."
  ],
  err: [
    ["Couvrir la caméra mais ignorer le micro.", "Le micro est souvent plus sensible : utilisez l'interrupteur global."],
    ["Oublier de réactiver l'accès avant un appel important.", "Pensez à la tuile des réglages rapides si votre interlocuteur ne vous entend pas."],
    ["Accorder le micro à une application de clavier.", "Ne l'accordez que si vous utilisez la dictée et que le clavier est de confiance."]
  ],
  reco: [
    "Placez les deux tuiles en première position des réglages rapides.",
    "Consultez le tableau de bord de confidentialité après l'installation d'une nouvelle application.",
    "Retirez l'accès au micro aux applications de réseaux sociaux si vous n'envoyez pas de messages vocaux."
  ],
  sum: "Android signale l'usage de la caméra et du micro par un indicateur, permet de les couper globalement depuis les réglages rapides et limite leur usage en arrière-plan. Associées à des autorisations minimales, ces fonctions offrent un contrôle réel.",
  quiz: [
    { q: "Que permet l'interrupteur « Accès au micro » des réglages rapides ?", o: ["De couper le micro pour toutes les applications", "D'augmenter le volume", "D'enregistrer les appels", "De changer de sonnerie"], a: 0, e: "Il bloque le micro au niveau du système, pour toutes les applications." },
    { q: "Une application en arrière-plan peut-elle utiliser le micro sans aucun signe visible ?", o: ["Oui, sans restriction", "Non, Android l'interdit depuis Android 9 et signale l'usage par un indicateur", "Oui, la nuit", "Seulement en Wi-Fi"], a: 1, e: "L'accès en arrière-plan est bloqué et l'indicateur signale tout usage." },
    { q: "Quelle option choisir pour scanner un QR code ponctuellement ?", o: ["Toujours autoriser", "Seulement cette fois", "Administrateur de l'appareil", "Accès à tous les fichiers"], a: 1, e: "L'accès est accordé uniquement pour la session en cours." }
  ]
},
/* ---------------------------------------------------------------- 3.9 */
{
  obj: "Maîtriser l'autorisation d'installer des applications inconnues et activer les protections du fabricant contre les installations hors magasin.",
  intro: [
    "Depuis Android 8, il n'existe plus d'interrupteur global « Sources inconnues » : l'autorisation est accordée application par application (navigateur, gestionnaire de fichiers, messagerie). Une autorisation oubliée peut permettre une installation non désirée.",
    "Certains fabricants proposent en plus un blocage global des installations hors magasin."
  ],
  tech: [
    "Chaque application qui veut installer un APK doit disposer de l'accès spécial <b>Installer des applis inconnues</b>. Une messagerie disposant de cet accès peut proposer l'installation d'un APK reçu en un seul geste, ce qui facilite les attaques.",
    { h: "Les protections renforcées des fabricants", ul: [
      "<b>Samsung</b> : <b>Blocage automatique</b> (Auto Blocker), introduit avec One UI 6, bloque l'installation d'applications hors des sources autorisées et d'autres actions à risque.",
      "<b>Google</b> : le mode <b>Protection avancée</b> (Advanced Protection) des versions récentes d'Android regroupe plusieurs protections renforcées, dont la restriction des installations hors magasin."
    ]}
  ],
  fig: "apk-check",
  steps: [
    "Ouvrez <b>Paramètres › Applications › Accès spécial des applis › Installer des applis inconnues</b> (Samsung : <b>Paramètres › Applications</b>, menu ⋮ › <b>Accès spéciaux › Installer applis inconnues</b>).",
    "Repérez chaque application marquée <b>Autorisée</b>.",
    "Désactivez l'autorisation pour toutes, sauf si vous installez régulièrement des APK depuis une source vérifiée précise.",
    "<b>Samsung</b> : ouvrez <b>Paramètres › Sécurité et confidentialité › Blocage automatique</b> et activez-le.",
    "Si votre appareil propose la <b>Protection avancée</b> d'Android, évaluez son activation (voir les ressources officielles Google).",
    "Lorsque vous avez besoin d'installer un APK vérifié, réactivez temporairement l'accès, installez, puis désactivez-le."
  ],
  result: "Aucune application ne peut installer d'APK sans votre intervention explicite.",
  ex: [
    "Le navigateur dispose de l'autorisation depuis l'installation d'un jeu il y a un an : un site piégé peut proposer un APK installable immédiatement.",
    "Le Blocage automatique de Samsung empêche l'installation d'un APK reçu par message, même si l'utilisateur est manipulé."
  ],
  err: [
    ["Laisser l'autorisation active pour la messagerie.", "Retirez-la : c'est un vecteur d'attaque très fréquent."],
    ["Désactiver le Blocage automatique pour installer une application douteuse.", "Si une application n'est pas disponible dans une source fiable, renoncez-y."],
    ["Croire que l'interrupteur global « Sources inconnues » existe encore.", "Vérifiez l'autorisation application par application."]
  ],
  reco: [
    "Traitez l'autorisation d'installer des applications inconnues comme un accès temporaire.",
    "Pour les proches peu technophiles, activez les protections renforcées du fabricant.",
    "En entreprise, interdisez cette autorisation par la politique de gestion des terminaux."
  ],
  sum: "Depuis Android 8, l'installation d'APK est autorisée application par application. Il faut retirer cette autorisation partout où elle n'est pas indispensable, et activer les protections renforcées du fabricant, comme le Blocage automatique de Samsung ou la Protection avancée d'Android.",
  quiz: [
    { q: "Depuis Android 8, comment fonctionne l'installation d'applications inconnues ?", o: ["Un interrupteur global", "Une autorisation par application source", "Elle est impossible", "Elle nécessite le root"], a: 1, e: "Chaque application source doit disposer de l'accès spécial correspondant." },
    { q: "Quelle fonction Samsung bloque les installations hors des sources autorisées ?", o: ["Blocage automatique (Auto Blocker)", "Mode jeu", "Always On Display", "Bixby"], a: 0, e: "Introduit avec One UI 6, il bloque notamment le sideloading." },
    { q: "Que faire après avoir installé un APK vérifié ?", o: ["Laisser l'autorisation active", "Retirer l'autorisation à l'application source", "Désactiver les mises à jour", "Supprimer le Play Store"], a: 1, e: "L'autorisation doit rester temporaire." }
  ]
},
/* ---------------------------------------------------------------- 3.10 */
{
  obj: "Configurer Google Play Protect, comprendre ce qu'il détecte et ce qu'il ne détecte pas.",
  intro: [
    "Google Play Protect est le système de protection contre les applications malveillantes intégré aux appareils Android disposant des services Google. Il analyse les applications installées, y compris celles installées hors du Play Store.",
    "C'est une protection utile, mais pas une garantie absolue."
  ],
  tech: [
    { h: "Ce que fait Play Protect", ul: [
      "Analyse les applications avant et après leur installation.",
      "Analyse les applications installées hors du Play Store et peut les signaler ou les désactiver.",
      "Peut proposer d'envoyer des applications inconnues à Google pour analyse.",
      "Sur certains appareils récents, effectue une détection en temps réel des comportements suspects sur l'appareil."
    ]},
    { h: "Ses limites", p: [
      "Les nouveaux malwares ou les applications fortement ciblées peuvent échapper à la détection pendant un certain temps. Play Protect ne protège pas contre le phishing, ni contre une application légitime à laquelle vous donnez trop d'accès. Il fait partie de la défense en profondeur, sans la remplacer."
    ]}
  ],
  fig: "apk-check",
  steps: [
    "Ouvrez l'application <b>Google Play</b>.",
    "Touchez votre photo de profil, puis <b>Play Protect</b>.",
    "Touchez l'icône d'engrenage en haut à droite.",
    "Activez <b>Analyser les applis avec Play Protect</b>.",
    "Activez <b>Améliorer la détection des applis malveillantes</b> si vous acceptez l'envoi d'applications inconnues pour analyse.",
    "Revenez à l'écran Play Protect et lancez une <b>analyse</b> manuelle."
  ],
  result: "Play Protect est actif et l'analyse ne signale aucun problème.",
  ex: [
    "Play Protect désactive automatiquement une application installée hors magasin, identifiée comme cheval de Troie bancaire.",
    "Une application de phishing sous forme de simple site web n'est pas détectée par Play Protect : votre vigilance reste nécessaire."
  ],
  err: [
    ["Désactiver Play Protect parce qu'il bloque une application.", "Si Play Protect bloque une application, renoncez-y ou vérifiez soigneusement sa provenance."],
    ["Installer en plus plusieurs antivirus.", "Un seul outil de détection suffit ; certains antivirus tiers demandent des accès excessifs."],
    ["Croire que Play Protect rend inutiles les autres mesures.", "Gardez les mises à jour, les permissions minimales et la vigilance."]
  ],
  reco: [
    "Laissez Play Protect activé en permanence sur un Android avec services Google.",
    "Lisez attentivement ses alertes au lieu de les ignorer.",
    "Sur GrapheneOS, la protection repose sur d'autres mécanismes (module 7, leçon 14)."
  ],
  sum: "Play Protect analyse les applications installées, y compris hors magasin, et peut les désactiver. Il complète la défense en profondeur sans remplacer les mises à jour, la gestion des permissions et la vigilance face au phishing.",
  quiz: [
    { q: "Où se trouvent les réglages de Play Protect ?", o: ["Google Play › photo de profil › Play Protect › engrenage", "Paramètres › Écran", "Appareil photo › Options", "Contacts › Paramètres"], a: 0, e: "Les réglages sont accessibles depuis l'application Google Play." },
    { q: "Play Protect analyse-t-il les applications installées hors du Play Store ?", o: ["Non, jamais", "Oui", "Seulement les jeux", "Seulement sur tablette"], a: 1, e: "Il peut analyser et signaler les applications de toute provenance." },
    { q: "Play Protect protège-t-il contre un faux site de banque ?", o: ["Oui, toujours", "Non, le phishing web relève d'autres protections et de votre vigilance", "Oui, s'il est mis à jour", "Oui, la nuit"], a: 1, e: "Play Protect se concentre sur les applications." }
  ]
},
/* ---------------------------------------------------------------- 3.11 */
{
  obj: "Sécuriser son compte Google : mot de passe, informations de récupération, appareils connectés, accès tiers et Check-up Sécurité.",
  intro: [
    "Sur un Android classique, le compte Google est la clé de voûte : il donne accès aux e-mails, aux contacts, aux photos, aux sauvegardes, à la localisation de l'appareil et souvent à d'autres comptes via la fonction « Se connecter avec Google ».",
    "Un compte Google compromis est souvent plus grave qu'un téléphone volé."
  ],
  tech: [
    { h: "Les éléments à contrôler", ul: [
      "<b>Mot de passe</b> unique et long, jamais réutilisé ailleurs.",
      "<b>Numéro et e-mail de récupération</b> à jour : ils permettent de récupérer le compte, mais aussi, s'ils sont compromis, de le voler.",
      "<b>Appareils connectés</b> : chaque session ouverte est un accès potentiel.",
      "<b>Applications et services tiers</b> ayant accès au compte.",
      "<b>Activité de sécurité récente</b> : connexions inhabituelles, changements de réglages."
    ]},
    { h: "Le Check-up Sécurité", p: [
      "Google propose un outil guidé, le <b>Check-up Sécurité</b>, accessible sur <code>myaccount.google.com/security-checkup</code>. Il passe en revue ces éléments et propose des actions correctives."
    ]}
  ],
  fig: "account-mfa",
  steps: [
    "Sur le téléphone : <b>Paramètres › Google › Gérer votre compte Google › Sécurité</b> (ou ouvrez <code>myaccount.google.com</code>).",
    "Lancez le <b>Check-up Sécurité</b> et suivez chaque recommandation.",
    "Dans <b>Vos appareils</b>, déconnectez tout appareil que vous ne reconnaissez pas ou que vous n'utilisez plus.",
    "Dans <b>Vos connexions à des applis et services tiers</b>, supprimez les accès inutiles.",
    "Vérifiez le <b>numéro de téléphone</b> et l'<b>adresse e-mail de récupération</b>.",
    "Si le mot de passe est ancien ou réutilisé ailleurs, changez-le pour un mot de passe unique généré par un gestionnaire."
  ],
  result: "Le Check-up Sécurité ne signale plus d'action recommandée.",
  ex: [
    "Une ancienne tablette vendue il y a deux ans apparaît encore dans les appareils connectés : déconnectez-la.",
    "Un quiz en ligne utilisé une fois dispose d'un accès à votre compte Google : supprimez cet accès."
  ],
  err: [
    ["Utiliser comme e-mail de récupération une ancienne adresse non surveillée.", "Choisissez une adresse active et elle-même protégée par la double authentification."],
    ["Réutiliser le mot de passe Google sur d'autres sites.", "Utilisez un mot de passe unique pour chaque service."],
    ["Ignorer les alertes de sécurité de Google.", "Vérifiez chaque alerte depuis myaccount.google.com, jamais via un lien reçu."]
  ],
  reco: [
    "Effectuez le Check-up Sécurité tous les trois mois.",
    "Pour les profils très exposés, Google propose le Programme Protection Avancée, qui impose des clés d'accès ou clés de sécurité.",
    "Consultez régulièrement l'activité récente du compte."
  ],
  sum: "Le compte Google donne accès à l'essentiel de votre vie numérique. Un mot de passe unique, des informations de récupération à jour, la déconnexion des appareils inconnus et la suppression des accès tiers inutiles, guidés par le Check-up Sécurité, le protègent efficacement.",
  quiz: [
    { q: "Où lancer le Check-up Sécurité de Google ?", o: ["myaccount.google.com/security-checkup", "Dans l'appareil photo", "Dans le Play Store", "Dans les réglages Wi-Fi"], a: 0, e: "L'outil est accessible depuis la page de gestion du compte Google." },
    { q: "Pourquoi l'e-mail de récupération doit-il être lui-même bien protégé ?", o: ["Parce qu'il permet de récupérer, donc aussi de voler, le compte principal", "Parce qu'il reçoit des publicités", "Pour économiser de l'espace", "Ce n'est pas nécessaire"], a: 0, e: "Un attaquant qui contrôle l'adresse de récupération peut réinitialiser le compte." },
    { q: "Que faire d'un appareil inconnu dans la liste des appareils connectés ?", o: ["L'ignorer", "Le déconnecter puis changer le mot de passe", "Le renommer", "L'ajouter aux favoris"], a: 1, e: "Un appareil inconnu signale un possible accès illégitime." }
  ]
},
/* ---------------------------------------------------------------- 3.12 */
{
  obj: "Configurer l'authentification multifacteur sur ses comptes essentiels en choisissant les méthodes les plus résistantes.",
  intro: [
    "Un mot de passe peut être volé, deviné ou divulgué dans une fuite de données. L'authentification multifacteur (MFA) exige une preuve supplémentaire, ce qui bloque la grande majorité des prises de contrôle de comptes.",
    "Toutes les méthodes ne se valent pas : certaines résistent au phishing, d'autres non."
  ],
  tech: [
    { h: "Les méthodes, de la plus faible à la plus forte", ul: [
      "<b>Code par SMS</b> : vulnérable au SIM swapping et au phishing en temps réel. Mieux que rien.",
      "<b>Code d'une application d'authentification</b> (TOTP) : indépendant de l'opérateur, mais peut être saisi sur un faux site.",
      "<b>Notification de validation</b> sur un appareil de confiance : pratique, avec affichage du lieu de connexion.",
      "<b>Clés d'accès (passkeys)</b> et <b>clés de sécurité physiques</b> (FIDO2) : liées au domaine du site, elles résistent au phishing par conception."
    ]},
    { h: "Les codes de secours", p: [
      "Les services proposent des codes de secours à usage unique pour le cas où vous perdez vos facteurs. Ils doivent être conservés hors du téléphone, sur papier ou dans un gestionnaire de mots de passe sur un autre appareil."
    ]}
  ],
  fig: "account-mfa",
  steps: [
    "Ouvrez <code>myaccount.google.com</code> › <b>Sécurité › Validation en deux étapes</b> et activez-la.",
    "Ajoutez une <b>clé d'accès</b> (passkey) pour votre compte Google, depuis <b>Sécurité › Clés d'accès et clés de sécurité</b>.",
    "Ajoutez une seconde méthode : application d'authentification ou clé de sécurité physique.",
    "Générez des <b>codes de secours</b>, imprimez-les et rangez-les dans un endroit sûr.",
    "Si possible, retirez le SMS des méthodes de validation, ou gardez-le uniquement comme dernier recours.",
    "Répétez la démarche pour votre messagerie, votre banque, vos réseaux sociaux et votre gestionnaire de mots de passe."
  ],
  result: "Vos comptes essentiels exigent au moins deux facteurs, dont un résistant au phishing.",
  ex: [
    "Votre mot de passe apparaît dans une fuite de données : sans la clé d'accès stockée dans votre téléphone, l'attaquant ne peut pas se connecter.",
    "Un faux site vous demande votre code TOTP : il peut l'utiliser en temps réel. Une clé d'accès, elle, ne fonctionne pas sur un domaine frauduleux."
  ],
  err: [
    ["Stocker les codes de secours dans une note du téléphone non protégée.", "Imprimez-les ou rangez-les dans un gestionnaire chiffré sur un autre appareil."],
    ["Valider une notification de connexion que l'on n'a pas demandée.", "Refusez toujours et changez votre mot de passe."],
    ["N'avoir qu'un seul facteur de secours stocké sur le même téléphone.", "Prévoyez un second facteur indépendant (clé physique, autre appareil, codes papier)."]
  ],
  reco: [
    "Priorisez les comptes « racines » : messagerie, compte Google, gestionnaire de mots de passe, banque.",
    "Adoptez les clés d'accès partout où elles sont proposées.",
    "Pour les profils exposés, utilisez deux clés de sécurité physiques (une principale, une de secours)."
  ],
  sum: "La MFA bloque la plupart des prises de contrôle de comptes. Le SMS est la méthode la plus faible, les clés d'accès et clés de sécurité les plus fortes car résistantes au phishing. Les codes de secours doivent être conservés hors du téléphone.",
  quiz: [
    { q: "Quelle méthode MFA résiste au phishing par conception ?", o: ["Le code SMS", "Le code TOTP", "La clé d'accès (passkey)", "La question secrète"], a: 2, e: "La clé d'accès est liée au domaine légitime et ne fonctionne pas sur un faux site." },
    { q: "Où conserver les codes de secours ?", o: ["Dans une note non protégée du téléphone", "Hors du téléphone, sur papier ou dans un gestionnaire sur un autre appareil", "Dans un SMS envoyé à soi-même", "Sur un réseau social"], a: 1, e: "Ils doivent rester disponibles même si le téléphone est perdu." },
    { q: "Vous recevez une notification de connexion que vous n'avez pas demandée. Que faire ?", o: ["L'accepter", "La refuser et changer votre mot de passe", "L'ignorer", "La transférer à un ami"], a: 1, e: "C'est le signe que votre mot de passe est connu d'un tiers." }
  ]
},
/* ---------------------------------------------------------------- 3.13 */
{
  obj: "Mettre en place une stratégie de sauvegarde fiable, chiffrée et testée, qui protège vos données sans créer de nouvelle faille.",
  intro: [
    "La sauvegarde protège contre la perte, le vol, la panne, et sera indispensable avant toute réinstallation (modules 5 et 6). Mais une sauvegarde mal protégée peut devenir une copie de vos données accessible à un attaquant.",
    "L'objectif est double : pouvoir tout restaurer, et que personne d'autre ne le puisse."
  ],
  tech: [
    { h: "Ce que propose Android", p: [
      "La sauvegarde Google (via Google One) enregistre les données d'applications compatibles, l'historique des appels, les contacts, les réglages et les SMS. Google indique que ces sauvegardes d'appareil sont chiffrées à l'aide du code de verrouillage de l'écran. Les photos et vidéos sauvegardées dans Google Photos suivent un régime différent et ne bénéficient pas de ce chiffrement de bout en bout."
    ]},
    { h: "La règle 3-2-1", p: [
      "Gardez <b>3</b> copies de vos données importantes, sur <b>2</b> supports différents, dont <b>1</b> hors de votre domicile. Pour les documents sensibles, utilisez une archive chiffrée ou un service de stockage chiffré de bout en bout."
    ]},
    { h: "Les sauvegardes propres aux applications", p: [
      "Certaines applications gèrent leur propre sauvegarde : Signal (sauvegarde chiffrée par une phrase secrète), WhatsApp (sauvegarde chiffrée de bout en bout activable), applications d'authentification (export ou synchronisation). Elles doivent être vérifiées une par une."
    ]}
  ],
  fig: "encryption",
  steps: [
    "<b>Pixel</b> : <b>Paramètres › Système › Sauvegarde</b> (ou <b>Paramètres › Google › Sauvegarde</b>) et vérifiez la date de la dernière sauvegarde. <b>Samsung</b> : <b>Paramètres › Comptes et sauvegarde</b>.",
    "Lancez une sauvegarde manuelle avec <b>Sauvegarder maintenant</b>.",
    "Copiez vos photos et documents importants sur un second support (ordinateur, disque externe chiffré).",
    "Activez la sauvegarde chiffrée de vos messageries (WhatsApp : <b>Paramètres › Discussions › Sauvegarde › Sauvegarde chiffrée de bout en bout</b>).",
    "Vérifiez comment récupérer chaque application d'authentification et chaque clé d'accès en cas de perte.",
    "Testez une restauration partielle (un document, quelques photos) pour vous assurer que la sauvegarde est exploitable."
  ],
  result: "Vos données importantes existent en plusieurs copies, dont au moins une chiffrée et hors du téléphone, et la restauration a été testée.",
  ex: [
    "Après un vol, la restauration de la sauvegarde Google sur un nouvel appareil récupère contacts, réglages et applications en quelques minutes.",
    "Une sauvegarde de messagerie non chiffrée stockée dans un cloud mal protégé expose l'intégralité des conversations."
  ],
  err: [
    ["Ne jamais tester la restauration.", "Testez au moins une fois par an la récupération de quelques fichiers."],
    ["Oublier les applications d'authentification.", "Prévoyez leur export, leur synchronisation chiffrée ou les codes de secours de chaque service."],
    ["Stocker une sauvegarde complète non chiffrée sur une clé USB.", "Chiffrez le support ou l'archive."]
  ],
  reco: [
    "Programmez une sauvegarde automatique en Wi-Fi pendant la recharge nocturne.",
    "Avant une installation de GrapheneOS, faites une sauvegarde complète hors du téléphone, car l'installation efface tout.",
    "Limitez la synchronisation automatique de dossiers sensibles vers des services non chiffrés de bout en bout."
  ],
  sum: "Une bonne sauvegarde suit la règle 3-2-1, est chiffrée et testée. La sauvegarde Google d'appareil est chiffrée avec le code de verrouillage, mais pas les photos de Google Photos. Les messageries et applications d'authentification demandent une attention particulière.",
  quiz: [
    { q: "Que signifie la règle 3-2-1 ?", o: ["3 téléphones, 2 SIM, 1 compte", "3 copies, 2 supports, 1 hors site", "3 mots de passe, 2 PIN, 1 empreinte", "3 sauvegardes par jour"], a: 1, e: "Trois copies, sur deux supports différents, dont une hors du domicile." },
    { q: "Avec quoi Google indique-t-il chiffrer les sauvegardes d'appareil Android ?", o: ["Avec le code de verrouillage de l'écran", "Avec le numéro IMEI", "Avec l'adresse e-mail", "Elles ne sont pas chiffrées"], a: 0, e: "Le code de verrouillage intervient dans la protection des sauvegardes d'appareil." },
    { q: "Pourquoi tester une restauration ?", o: ["Pour vérifier que la sauvegarde est réellement exploitable", "Pour accélérer le téléphone", "Pour libérer de l'espace", "Ce n'est pas utile"], a: 0, e: "Une sauvegarde jamais testée peut s'avérer incomplète au mauvais moment." }
  ]
},
/* ---------------------------------------------------------------- 3.14 */
{
  obj: "Configurer les notifications de l'écran verrouillé pour qu'elles ne divulguent ni messages, ni codes de validation.",
  intro: [
    "Un téléphone verrouillé posé sur une table peut afficher le contenu de vos messages, le nom de vos correspondants et même les codes de validation reçus par SMS. Un voleur peut ainsi récupérer un code de réinitialisation de compte sans jamais déverrouiller l'appareil.",
    "Quelques réglages suffisent à fermer cette fuite."
  ],
  tech: [
    "Android permet de choisir ce qui apparaît sur l'écran verrouillé : toutes les notifications, les notifications sans leur contenu sensible, ou aucune notification. Le réglage peut aussi être affiné application par application. Les codes reçus par SMS et les aperçus de messageries sont les éléments les plus sensibles.",
    { h: "L'affichage permanent", p: [
      "Les fonctions d'affichage permanent (Always On Display) et d'écran de veille peuvent aussi montrer des notifications. Vérifiez leur configuration."
    ]}
  ],
  fig: "lockscreen",
  steps: [
    "<b>Pixel</b> : <b>Paramètres › Notifications › Notifications sur l'écran de verrouillage</b> et choisissez <b>Masquer les conversations et notifications silencieuses</b> ou <b>Ne pas afficher de notifications</b>. <b>Samsung</b> : <b>Paramètres › Notifications › Notifications de l'écran de verrouillage</b> et choisissez <b>Masquer le contenu</b>.",
    "Désactivez <b>Notifications sensibles</b> ou <b>Afficher le contenu sensible</b> lorsque l'appareil est verrouillé.",
    "Dans les réglages de votre messagerie (Signal, WhatsApp…), désactivez l'aperçu des messages dans les notifications si nécessaire.",
    "Dans <b>Paramètres › Applications › Messages › Notifications</b>, masquez le contenu des SMS sur l'écran verrouillé.",
    "Vérifiez le résultat : verrouillez l'appareil, envoyez-vous un message de test, et observez l'écran."
  ],
  result: "Sur l'écran verrouillé, aucune notification ne montre de contenu de message ni de code.",
  ex: [
    "Un voleur demande la réinitialisation de votre messagerie : le code s'affiche sur l'écran verrouillé, il prend le contrôle du compte sans déverrouiller le téléphone.",
    "Dans une réunion, l'aperçu d'un message personnel s'affiche sur votre téléphone posé sur la table."
  ],
  err: [
    ["Masquer les notifications mais laisser l'aperçu sur l'affichage permanent.", "Vérifiez aussi les réglages Always On Display."],
    ["Laisser la réponse rapide depuis l'écran verrouillé.", "Désactivez-la pour les messageries sensibles."],
    ["Ne pas tester le résultat.", "Envoyez-vous un message test appareil verrouillé."]
  ],
  reco: [
    "Choisissez au minimum « masquer le contenu sensible ».",
    "Pour les appareils professionnels, imposez le masquage via la gestion de flotte.",
    "Préférez les codes de validation dans une application d'authentification plutôt que par SMS."
  ],
  sum: "Les notifications de l'écran verrouillé peuvent divulguer messages et codes de validation. Masquer leur contenu sensible, vérifier l'affichage permanent et les réglages des messageries, puis tester le résultat suffisent à fermer cette fuite.",
  quiz: [
    { q: "Pourquoi les codes SMS sur l'écran verrouillé sont-ils dangereux ?", o: ["Ils consomment de la batterie", "Un voleur peut les lire et réinitialiser vos comptes sans déverrouiller", "Ils ralentissent le téléphone", "Ils ne sont pas dangereux"], a: 1, e: "L'écran verrouillé reste visible par toute personne qui tient l'appareil." },
    { q: "Quel réglage minimal est recommandé ?", o: ["Afficher tout le contenu", "Masquer le contenu sensible", "Agrandir les notifications", "Activer les sons"], a: 1, e: "Le contenu des messages et codes ne doit pas apparaître appareil verrouillé." },
    { q: "Quelle autre fonction peut afficher des notifications sur un téléphone verrouillé ?", o: ["L'affichage permanent (Always On Display)", "La lampe torche", "Le vibreur", "La calculatrice"], a: 0, e: "Ses réglages doivent être vérifiés en parallèle." }
  ]
},
/* ---------------------------------------------------------------- 3.15 */
{
  obj: "Préparer et mettre en œuvre la protection en cas de perte ou de vol : localisation, verrouillage et effacement à distance, protections antivol, démarches.",
  intro: [
    "La perte ou le vol d'un smartphone est un incident fréquent. Les dégâts dépendent presque entièrement de ce que vous avez préparé avant : un appareil verrouillé, chiffré, localisable et sauvegardé limite l'incident à une perte matérielle.",
    "Cette leçon couvre la préparation et la réaction."
  ],
  tech: [
    { h: "Les outils Google", ul: [
      "<b>Localiser mon appareil</b> (Find Hub) : localiser, faire sonner, verrouiller ou effacer l'appareil depuis <code>google.com/android/find</code>.",
      "<b>Protection contre le vol</b> (versions récentes, via les services Google) : verrouillage automatique en cas de détection d'un arrachage, verrouillage hors connexion après une déconnexion suspecte, verrouillage à distance par le seul numéro de téléphone.",
      "<b>Protection contre la réinitialisation (FRP)</b> : après une réinitialisation non autorisée, l'appareil exige le compte Google précédent, ce qui réduit sa valeur pour un voleur."
    ]},
    { h: "Les outils des fabricants", p: [
      "Samsung propose <b>SmartThings Find</b> et ses propres fonctions de verrouillage à distance. Les opérateurs peuvent bloquer la carte SIM et, dans de nombreux pays, inscrire l'IMEI sur une liste de blocage."
    ]}
  ],
  fig: "antitheft",
  steps: [
    "<b>Préparer</b> : vérifiez que <b>Localiser mon appareil</b> est activé (<b>Paramètres › Google › Tous les services › Localiser mon appareil</b>, ou <b>Paramètres › Sécurité › Localiser mon appareil</b> selon la version).",
    "Activez les fonctions de <b>Protection contre le vol</b> si elles sont proposées (<b>Paramètres › Google › Tous les services › Protection contre le vol</b>).",
    "Composez <code>*#06#</code>, notez l'<b>IMEI</b> affiché et conservez-le hors du téléphone avec le numéro de votre opérateur.",
    "<b>Réagir</b> : depuis un autre appareil, ouvrez <code>google.com/android/find</code>, localisez et verrouillez l'appareil en affichant un message et un numéro de contact.",
    "Changez les mots de passe de vos comptes principaux et déconnectez l'appareil perdu de vos sessions.",
    "Appelez votre opérateur pour bloquer la carte SIM, puis déposez plainte en fournissant l'IMEI.",
    "Si l'appareil est jugé irrécupérable et contient des données sensibles, lancez l'<b>effacement à distance</b>."
  ],
  result: "Vous êtes prêt à localiser, verrouiller et effacer l'appareil, et vous connaissez la procédure de réaction.",
  caution: "N'essayez pas de récupérer vous-même un appareil volé en vous rendant à la position affichée : transmettez l'information aux forces de l'ordre.",
  ex: [
    "Un téléphone est oublié dans un taxi : la localisation montre sa position, la sonnerie et le message affiché permettent au chauffeur de vous le rendre.",
    "Un téléphone arraché dans la rue se verrouille automatiquement grâce à la détection de vol."
  ],
  err: [
    ["Effacer l'appareil immédiatement alors qu'il est simplement égaré.", "Commencez par localiser et verrouiller ; l'effacement empêche ensuite de le localiser."],
    ["Ne pas noter l'IMEI à l'avance.", "Notez-le dès aujourd'hui avec *#06#."],
    ["Oublier de bloquer la carte SIM.", "Le voleur pourrait recevoir vos codes par SMS : appelez votre opérateur."]
  ],
  reco: [
    "Testez une fois la localisation de votre appareil depuis un ordinateur.",
    "Combinez verrouillage robuste, chiffrement et sauvegarde : ce sont eux qui protègent réellement les données.",
    "Ajoutez un code PIN à votre carte SIM pour empêcher son usage dans un autre téléphone."
  ],
  sum: "La protection contre la perte et le vol se prépare : localisation activée, protections antivol, IMEI noté, code PIN de la SIM, sauvegarde. En cas d'incident : localiser, verrouiller, sécuriser les comptes, bloquer la SIM, porter plainte, puis effacer si nécessaire.",
  quiz: [
    { q: "Quel code affiche l'IMEI sur la plupart des téléphones ?", o: ["*#06#", "#123#", "0000", "*999#"], a: 0, e: "Le code *#06# affiche l'IMEI, à noter et à conserver hors du téléphone." },
    { q: "Quelle est la bonne première action après la perte d'un téléphone ?", o: ["L'effacer immédiatement", "Le localiser et le verrouiller à distance", "Acheter un nouveau téléphone", "Ne rien faire"], a: 1, e: "L'effacement empêche ensuite la localisation : il vient en dernier recours." },
    { q: "Pourquoi bloquer la carte SIM ?", o: ["Pour éviter que le voleur reçoive vos codes de validation par SMS", "Pour récupérer du crédit", "Pour changer de forfait", "Ce n'est pas utile"], a: 0, e: "La SIM permet de recevoir les codes de nombreux services." }
  ]
}
];
