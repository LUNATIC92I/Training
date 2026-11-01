/* Module 4 : Introduction approfondie à GrapheneOS
   Les fonctionnalités décrites sont documentées sur https://grapheneos.org/features
   et https://grapheneos.org/usage. Les libellés exacts des réglages peuvent
   évoluer d'une version à l'autre. */
window.ASG = window.ASG || {}; ASG.content = ASG.content || {};
ASG.content.m4 = [
/* ---------------------------------------------------------------- 4.1 */
{
  obj: "Définir précisément GrapheneOS, son statut, son périmètre et ce qui le distingue d'une simple « ROM personnalisée ».",
  intro: [
    "GrapheneOS est un système d'exploitation mobile libre et open source, centré sur la protection de la vie privée et la sécurité, compatible avec les applications Android. Il est développé par un projet à but non lucratif.",
    "Il est souvent confondu avec les « ROM personnalisées » : la différence est fondamentale, et cette leçon l'explique."
  ],
  tech: [
    { h: "Ce qu'est GrapheneOS", p: [
      "GrapheneOS est construit à partir de l'<b>Android Open Source Project</b> (AOSP). Il en conserve la compatibilité avec les applications, mais y apporte de nombreux renforcements de sécurité et de confidentialité. Il n'intègre ni les applications ni les services Google par défaut ; ceux-ci peuvent être installés de façon optionnelle, comme des applications ordinaires (leçon 8)."
    ]},
    { h: "Ce qui le distingue d'une ROM personnalisée", ul: [
      "Il préserve et renforce le modèle de sécurité d'Android au lieu de l'affaiblir : pas de root, SELinux strict.",
      "Il permet de <b>reverrouiller le bootloader</b> avec sa propre clé, conservant le démarrage vérifié complet.",
      "Il ne prend en charge que des appareils répondant à des exigences matérielles de sécurité strictes.",
      "Il publie rapidement les correctifs de sécurité et des mises à jour transparentes.",
      "Il propose la vérification de l'installation par attestation matérielle (application Auditor)."
    ]},
    { h: "Les applications du projet", p: [
      "GrapheneOS fournit quelques applications : le navigateur <b>Vanadium</b> (basé sur Chromium, renforcé, qui fournit aussi la WebView du système), une application <b>Appareil photo</b>, un lecteur <b>PDF</b> sécurisé, l'<b>App Store</b> du projet, et <b>Auditor</b> pour l'attestation."
    ]}
  ],
  fig: "graphene-layers",
  steps: [
    "Rendez-vous sur le site officiel <code>https://grapheneos.org/</code> en vérifiant soigneusement l'adresse.",
    "Ouvrez la page <b>Features</b> et parcourez le sommaire des fonctionnalités.",
    "Ouvrez la page <b>FAQ</b> et lisez la section sur les appareils pris en charge.",
    "Notez trois fonctionnalités qui répondent à vos besoins identifiés au module 2 (leçon 10).",
    "Notez aussi une contrainte qui pourrait vous gêner au quotidien."
  ],
  result: "Vous savez ce qu'est GrapheneOS et vous avez identifié ses apports et contraintes pour votre situation.",
  ex: [
    "Une ROM personnalisée populaire peut fonctionner sur des centaines d'appareils, mais souvent avec un bootloader déverrouillé en permanence : le démarrage vérifié est alors perdu.",
    "GrapheneOS ne fonctionne que sur certains Pixel, mais reverrouille le bootloader et conserve toutes les protections matérielles."
  ],
  err: [
    ["Considérer GrapheneOS comme une ROM « pour geeks » qui sacrifie la sécurité.", "C'est l'inverse : il renforce le modèle de sécurité d'Android."],
    ["Croire que GrapheneOS est une distribution Linux de bureau.", "C'est un système mobile compatible avec les applications Android."],
    ["Télécharger GrapheneOS depuis un site miroir non officiel.", "Utilisez exclusivement grapheneos.org et son installateur Web officiel."]
  ],
  reco: [
    "Considérez la documentation officielle comme la seule référence ; cette formation l'explique sans la remplacer.",
    "Avant de décider, terminez les modules 4 et 5.",
    "Méfiez-vous des vendeurs de « téléphones GrapheneOS préinstallés » : vous ne pouvez pas vérifier ce qu'ils ont fait de l'appareil sans le réinstaller."
  ],
  sum: "GrapheneOS est un système mobile libre, basé sur AOSP, qui renforce la sécurité et la confidentialité tout en restant compatible avec les applications Android. Contrairement à la plupart des ROM personnalisées, il préserve le démarrage vérifié avec un bootloader reverrouillé et ne vise que des appareils au matériel adapté.",
  quiz: [
    { q: "Sur quelle base GrapheneOS est-il construit ?", o: ["Sur iOS", "Sur l'Android Open Source Project (AOSP)", "Sur Windows Mobile", "Sur une distribution Linux de bureau"], a: 1, e: "Il part d'AOSP, ce qui lui assure la compatibilité avec les applications Android." },
    { q: "Quelle différence majeure avec la plupart des ROM personnalisées ?", o: ["Il fonctionne sur tous les téléphones", "Il permet de reverrouiller le bootloader et conserve le démarrage vérifié", "Il est payant", "Il inclut le root"], a: 1, e: "Le reverrouillage avec la clé GrapheneOS conserve la chaîne de confiance." },
    { q: "Quel est le navigateur fourni par GrapheneOS ?", o: ["Vanadium", "Firefox", "Opera", "Safari"], a: 0, e: "Vanadium, basé sur Chromium et renforcé, fournit aussi la WebView du système." }
  ]
},
/* ---------------------------------------------------------------- 4.2 */
{
  obj: "Comprendre les motivations à l'origine de GrapheneOS et les choix de conception qui en découlent, notamment le choix des Pixel.",
  intro: [
    "GrapheneOS trouve son origine dans un projet personnel lancé en 2014 par Daniel Micay, chercheur en sécurité. Il porte son nom actuel depuis 2019 et est aujourd'hui soutenu par une fondation à but non lucratif.",
    "Comprendre pourquoi il existe permet de comprendre ses choix, parfois contraignants."
  ],
  tech: [
    { h: "Le constat de départ", p: [
      "Android dispose d'un bon modèle de sécurité, mais une large part des failles exploitées provient d'erreurs de gestion de la mémoire, et l'écosystème laisse de nombreux appareils sans mises à jour. Par ailleurs, la configuration par défaut d'Android et des services associés n'est pas conçue pour minimiser la collecte de données."
    ]},
    { h: "Les objectifs du projet", ul: [
      "Rendre l'exploitation des failles beaucoup plus difficile, même lorsqu'elles ne sont pas encore connues.",
      "Donner à l'utilisateur un contrôle réel sur ce que les applications peuvent faire.",
      "Ne pas dépendre de services propriétaires pour fonctionner, tout en restant compatible avec les applications qui en ont besoin.",
      "Ne jamais sacrifier la sécurité au profit de la compatibilité avec un grand nombre d'appareils."
    ]},
    { h: "Pourquoi uniquement des Pixel", p: [
      "GrapheneOS impose des exigences matérielles : possibilité de reverrouiller le bootloader avec une clé personnalisée, puce sécurisée, mises à jour régulières du micrologiciel, attestation matérielle, isolation des composants comme le modem, et, sur les générations récentes, le marquage mémoire matériel (MTE). Les Pixel actuels sont les appareils qui remplissent ces critères. Le projet a annoncé travailler avec un fabricant pour proposer à l'avenir d'autres appareils répondant à ces exigences ; tant qu'un appareil n'apparaît pas dans la liste officielle, il n'est pas pris en charge."
    ]}
  ],
  fig: "graphene-layers",
  steps: [
    "Relisez votre modèle de menaces (module 2, leçon 10).",
    "Pour chaque menace prioritaire, notez si GrapheneOS apporte une protection supplémentaire (exploitation de failles, contrôle des permissions, collecte de données).",
    "Notez les menaces sur lesquelles GrapheneOS ne change rien (phishing, mot de passe faible).",
    "Concluez : GrapheneOS est-il adapté, utile mais secondaire, ou disproportionné pour vous ?"
  ],
  result: "Vous savez si les objectifs de GrapheneOS correspondent à vos besoins réels.",
  ex: [
    "Un militant exposé à des logiciels espions commerciaux bénéficie directement des protections contre l'exploitation de failles.",
    "Une personne dont la priorité est la protection contre le phishing tirera davantage de bénéfices des clés d'accès que d'un changement de système."
  ],
  err: [
    ["Choisir GrapheneOS uniquement « parce que c'est à la mode ».", "Partez de vos besoins : le module 2 vous y aide."],
    ["Croire que la limitation aux Pixel est un choix commercial.", "Elle découle d'exigences matérielles de sécurité."],
    ["Installer un « portage » non officiel sur un autre téléphone.", "Il ne s'agit pas de GrapheneOS : les garanties ne s'appliquent pas."]
  ],
  reco: [
    "Lisez la page « Features » du site officiel pour comprendre chaque objectif.",
    "Évaluez le coût d'un appareil compatible face à vos besoins réels.",
    "Gardez à l'esprit que les bonnes pratiques des modules 2, 3 et 8 restent indispensables."
  ],
  sum: "GrapheneOS est né du constat que les failles mémoire et la collecte par défaut limitent la protection offerte par Android. Il vise à rendre l'exploitation plus difficile, à donner plus de contrôle à l'utilisateur et à se passer des services propriétaires. Ses exigences matérielles expliquent la limitation à certains Pixel.",
  quiz: [
    { q: "Pourquoi GrapheneOS ne prend-il en charge que certains Pixel ?", o: ["Pour des raisons commerciales", "Parce que ce sont les appareils qui remplissent ses exigences matérielles de sécurité", "Parce que les autres téléphones sont trop lents", "Par hasard"], a: 1, e: "Reverrouillage avec clé personnalisée, puce sécurisée, attestation, mises à jour du micrologiciel, MTE…" },
    { q: "GrapheneOS protège-t-il contre la saisie volontaire de votre mot de passe sur un faux site ?", o: ["Oui, totalement", "Non, le phishing relève d'autres protections", "Oui, grâce au bootloader", "Oui, grâce au Wi-Fi"], a: 1, e: "Aucun système ne protège entièrement d'une action volontaire de l'utilisateur." },
    { q: "Un « portage » non officiel de GrapheneOS sur un autre téléphone offre-t-il les mêmes garanties ?", o: ["Oui", "Non", "Oui, s'il est gratuit", "Oui, s'il est récent"], a: 1, e: "Seuls les appareils de la liste officielle bénéficient des garanties du projet." }
  ]
},
/* ---------------------------------------------------------------- 4.3 */
{
  obj: "Décrire l'architecture de GrapheneOS : ce qui est conservé d'AOSP, ce qui est renforcé, et ce qui est ajouté.",
  intro: [
    "GrapheneOS n'est pas un système réécrit de zéro : il reprend l'architecture d'Android étudiée au module 1 et la renforce couche par couche.",
    "Cette approche préserve la compatibilité des applications tout en élevant le niveau de protection."
  ],
  tech: [
    { h: "Ce qui est conservé", p: [
      "Le noyau Linux, le framework Android, ART, le bac à sable applicatif, SELinux, le démarrage vérifié, le Keystore, le chiffrement basé sur les fichiers et le modèle de permissions. Les applications Android fonctionnent donc normalement."
    ]},
    { h: "Ce qui est renforcé", ul: [
      "<b>Allocateur mémoire</b> : <code>hardened_malloc</code>, conçu pour rendre l'exploitation des erreurs mémoire plus difficile.",
      "<b>Bibliothèque C et compilateur</b> : vérifications supplémentaires et options de compilation renforcées.",
      "<b>Noyau</b> : configuration et correctifs de durcissement.",
      "<b>Lancement des applications</b> : chaque application est lancée de façon à disposer de sa propre disposition mémoire aléatoire, au lieu de partager celle d'un processus parent commun (zygote).",
      "<b>Politiques SELinux et restrictions</b> supplémentaires.",
      "<b>Navigateur et WebView</b> : Vanadium, version renforcée de Chromium."
    ]},
    { h: "Ce qui est ajouté", p: [
      "Des contrôles pour l'utilisateur (permissions Réseau et Capteurs, Storage Scopes, Contact Scopes), des fonctions de protection des données (redémarrage automatique, contrôle du port USB-C, code de contrainte) et une couche de compatibilité permettant d'exécuter Google Play en bac à sable."
    ]}
  ],
  fig: "graphene-layers",
  steps: [
    "Reprenez le schéma de la pile Android (module 1, leçon 2).",
    "Pour chaque couche, notez le renforcement correspondant apporté par GrapheneOS à partir de cette leçon.",
    "Identifiez les éléments ajoutés visibles par l'utilisateur (permissions, réglages).",
    "Identifiez les éléments invisibles (allocateur, compilation, noyau).",
    "Gardez ce tableau : il vous servira au module 7."
  ],
  result: "Vous disposez d'une cartographie des renforcements de GrapheneOS par couche.",
  ex: [
    "Une application qui contient une erreur mémoire exploitable sur Android standard peut planter sans être exploitée sous GrapheneOS, grâce à hardened_malloc.",
    "Une application de messagerie fonctionne normalement, car le framework Android et ses API sont conservés."
  ],
  err: [
    ["Penser que les renforcements invisibles sont secondaires.", "Ils sont au cœur de la protection contre l'exploitation de failles."],
    ["Croire que GrapheneOS supprime le modèle de permissions d'Android.", "Il le conserve et l'enrichit."],
    ["Désactiver les protections dès qu'une application plante.", "Utilisez les modes de compatibilité par application, pas une désactivation globale (module 7)."]
  ],
  reco: [
    "Lisez la section « Exploit protection » de la page Features.",
    "Comprenez que la compatibilité des applications est un objectif, mais pas au détriment de la sécurité.",
    "Signalez les problèmes de compatibilité via les canaux officiels plutôt que de désactiver les protections."
  ],
  sum: "GrapheneOS conserve l'architecture d'Android, renforce l'allocateur mémoire, la libc, le noyau, le lancement des applications, SELinux et le navigateur, et ajoute des contrôles utilisateur et une compatibilité optionnelle avec Google Play en bac à sable.",
  quiz: [
    { q: "Quel est le nom de l'allocateur mémoire renforcé de GrapheneOS ?", o: ["hardened_malloc", "jemalloc", "malloc_fast", "safe_heap"], a: 0, e: "hardened_malloc rend l'exploitation des erreurs mémoire plus difficile." },
    { q: "Pourquoi les applications Android fonctionnent-elles sous GrapheneOS ?", o: ["Parce que le framework et les API d'Android sont conservés", "Parce qu'elles sont réécrites", "Parce qu'elles tournent dans un émulateur", "Elles ne fonctionnent pas"], a: 0, e: "La base AOSP est conservée." },
    { q: "Quel est l'intérêt du lancement de chaque application avec sa propre disposition mémoire aléatoire ?", o: ["Accélérer le démarrage", "Éviter qu'une fuite d'adresses dans une application aide à attaquer les autres", "Réduire la consommation", "Changer l'icône"], a: 1, e: "Le modèle zygote partage une partie de la disposition mémoire entre applications." }
  ]
},
/* ---------------------------------------------------------------- 4.4 */
{
  obj: "Comprendre en détail les principaux mécanismes de sécurité de GrapheneOS contre l'exploitation des vulnérabilités.",
  intro: [
    "La force principale de GrapheneOS réside dans la réduction de la surface d'attaque et dans le durcissement contre l'exploitation. Concrètement, il s'agit de rendre beaucoup plus coûteux, voire impossible, le passage d'une faille à une compromission réelle.",
    "Cette leçon est technique : elle s'adresse aux apprenants qui veulent comprendre le « comment »."
  ],
  tech: [
    { h: "Durcissement de la mémoire", ul: [
      "<b>hardened_malloc</b> : isolation des métadonnées, régions de garde, mise en quarantaine et effacement des allocations libérées, ce qui détecte ou neutralise de nombreuses erreurs de type « use-after-free » et débordement.",
      "<b>Marquage mémoire matériel (MTE)</b> : sur les Pixel 8 et ultérieurs, GrapheneOS utilise MTE pour le système et pour les applications compatibles. Un accès mémoire invalide est détecté par le matériel et le processus est arrêté."
    ]},
    { h: "Réduction de la surface d'attaque", ul: [
      "Restrictions sur le chargement dynamique de code et le débogage natif des applications.",
      "Désactivation de fonctionnalités rarement utiles mais exposées.",
      "Contrôle du port USB-C lorsque l'appareil est verrouillé, contre les attaques par connexion physique.",
      "Désactivation automatique possible du Wi-Fi et du Bluetooth lorsqu'ils ne sont pas connectés."
    ]},
    { h: "Protection des données au repos", ul: [
      "<b>Redémarrage automatique</b> après une période sans déverrouillage, pour remettre l'appareil en état BFU (module 1, leçon 9).",
      "Exploitation complète de la puce sécurisée pour la limitation des essais de code."
    ]}
  ],
  fig: "graphene-layers",
  steps: [
    "Rouvrez la leçon 9 du module 2 (vulnérabilités) et relisez la notion de chaîne d'exploitation.",
    "Pour chaque maillon (exécution de code, sortie du bac à sable, élévation de privilèges), associez le ou les mécanismes de GrapheneOS qui le rendent plus difficile.",
    "Identifiez le mécanisme qui protège les données si l'appareil est saisi allumé.",
    "Notez quels mécanismes dépendent du matériel (MTE, puce sécurisée)."
  ],
  result: "Vous savez relier chaque mécanisme de GrapheneOS à l'étape de l'attaque qu'il entrave.",
  ex: [
    "Une faille de type « use-after-free » dans une bibliothèque d'images : MTE ou hardened_malloc la font souvent échouer en provoquant l'arrêt du processus.",
    "Un appareil saisi allumé et verrouillé : le redémarrage automatique le remet en état BFU après le délai configuré."
  ],
  err: [
    ["Croire que ces protections rendent l'appareil invulnérable.", "Elles augmentent fortement le coût d'une attaque ; aucune ne la rend impossible."],
    ["Désactiver le redémarrage automatique pour éviter de saisir son code.", "Gardez un délai raisonnable : c'est une protection importante des données au repos."],
    ["Ignorer les plantages liés à MTE.", "Ils peuvent révéler un bug réel ; utilisez le mode de compatibilité de l'application si nécessaire et signalez-le au développeur."]
  ],
  reco: [
    "Choisissez un Pixel 8 ou ultérieur pour bénéficier de MTE.",
    "Laissez les protections par défaut actives ; n'utilisez les modes de compatibilité qu'au cas par cas.",
    "Consultez la page Features pour suivre l'évolution des mécanismes."
  ],
  sum: "GrapheneOS entrave l'exploitation par hardened_malloc et MTE, réduit la surface d'attaque (chargement dynamique de code, débogage, port USB-C, radios) et protège les données au repos grâce au redémarrage automatique et à la puce sécurisée.",
  quiz: [
    { q: "Sur quels Pixel GrapheneOS peut-il utiliser le marquage mémoire matériel (MTE) ?", o: ["Pixel 3 et ultérieurs", "Pixel 8 et ultérieurs", "Tous les Pixel", "Aucun"], a: 1, e: "MTE est disponible à partir de la génération Pixel 8." },
    { q: "Quel mécanisme remet automatiquement l'appareil en état BFU ?", o: ["Le redémarrage automatique après inactivité", "Le mode avion", "Le mode sombre", "La sauvegarde"], a: 0, e: "Le redémarrage efface les clés des données utilisateur de la mémoire." },
    { q: "Pourquoi contrôler le port USB-C quand l'appareil est verrouillé ?", o: ["Pour économiser la batterie", "Pour réduire les attaques par connexion physique", "Pour charger plus vite", "Pour écouter de la musique"], a: 1, e: "Le port USB est une surface d'attaque exploitée par certains outils d'extraction." }
  ]
},
/* ---------------------------------------------------------------- 4.5 */
{
  obj: "Comprendre le modèle de confidentialité de GrapheneOS : minimisation des connexions, contrôles fins et absence de services intégrés.",
  intro: [
    "La sécurité protège contre les attaquants ; la confidentialité protège contre la collecte, y compris légitime. GrapheneOS traite les deux, avec une approche fondée sur la minimisation.",
    "Le principe : le système ne devrait envoyer que ce qui est nécessaire, et l'utilisateur devrait pouvoir limiter ce que chaque application envoie."
  ],
  tech: [
    { h: "Connexions par défaut minimales et documentées", p: [
      "GrapheneOS documente dans sa FAQ les connexions que le système effectue par défaut (vérification des mises à jour, contrôle de connectivité, heure réseau, etc.). Elles sont dirigées vers des serveurs du projet ou des services relais, et plusieurs peuvent être modifiées ou désactivées."
    ]},
    { h: "Pas de services intégrés", p: [
      "Sans Google Play installé, aucun service propriétaire ne collecte de données au niveau du système. Si vous installez Google Play en bac à sable, il n'a accès qu'à ce que vous lui accordez, comme n'importe quelle application."
    ]},
    { h: "Des contrôles supplémentaires", ul: [
      "<b>Permission Réseau</b> : retire à une application tout accès direct ou indirect au réseau.",
      "<b>Permission Capteurs</b> : bloque l'accès aux capteurs non couverts par les permissions Android (accéléromètre, gyroscope, boussole…).",
      "<b>Storage Scopes</b> et <b>Contact Scopes</b> : l'application croit disposer de l'accès, mais ne voit que les fichiers ou contacts choisis.",
      "<b>Randomisation de l'adresse MAC</b> renforcée et réglages réseau protecteurs.",
      "<b>Profils séparés</b> pour cloisonner les usages."
    ]}
  ],
  fig: "permissions",
  steps: [
    "Consultez la section de la FAQ officielle consacrée aux connexions par défaut du système.",
    "Listez les connexions que vous souhaiteriez modifier ou désactiver.",
    "Identifiez trois applications que vous utilisez et qui n'ont pas besoin du réseau (calculatrice, clavier, galerie hors ligne).",
    "Prévoyez de leur retirer la permission Réseau lors de la configuration (module 7).",
    "Identifiez les applications qui demandent l'accès à tous vos fichiers et prévoyez d'utiliser Storage Scopes."
  ],
  result: "Vous savez quelles données votre futur système émet et comment limiter celles de chaque application.",
  ex: [
    "Un clavier tiers privé de la permission Réseau ne peut plus transmettre vos frappes.",
    "Une messagerie à qui l'on applique Contact Scopes ne voit que les quelques contacts choisis, pas tout le carnet."
  ],
  err: [
    ["Croire que GrapheneOS empêche une application de collecter ce que vous lui donnez.", "Il vous donne des outils ; c'est à vous de les utiliser."],
    ["Installer Google Play par habitude sans en avoir besoin.", "Testez d'abord vos applications sans Google Play."],
    ["Confondre confidentialité et anonymat.", "Votre opérateur, vos comptes et vos usages vous identifient toujours."]
  ],
  reco: [
    "Appliquez la minimisation : n'accordez le réseau, les capteurs et les fichiers qu'aux applications qui en ont besoin.",
    "Utilisez des profils distincts pour séparer les applications intrusives.",
    "Combinez avec les pratiques du module 8 (messageries, métadonnées, pistage)."
  ],
  sum: "GrapheneOS minimise et documente les connexions du système, n'intègre aucun service propriétaire par défaut et ajoute des contrôles fins : permissions Réseau et Capteurs, Storage Scopes, Contact Scopes, profils. La confidentialité dépend ensuite de l'usage que vous faites de ces outils.",
  quiz: [
    { q: "Que fait Storage Scopes ?", o: ["Il chiffre la carte SD", "Il donne à l'application l'accès aux seuls fichiers ou dossiers choisis", "Il supprime les photos", "Il accélère le stockage"], a: 1, e: "L'application croit avoir l'accès, mais ne voit que ce que vous avez sélectionné." },
    { q: "Que permet la permission Réseau de GrapheneOS ?", o: ["De retirer à une application tout accès au réseau", "D'accélérer la 5G", "De partager la connexion", "De choisir l'opérateur"], a: 0, e: "Elle bloque l'accès direct et indirect au réseau pour l'application." },
    { q: "Confidentialité et anonymat sont-ils équivalents ?", o: ["Oui", "Non : l'opérateur et les comptes vous identifient toujours", "Oui, avec GrapheneOS", "Oui, avec un VPN"], a: 1, e: "Réduire la collecte ne rend pas anonyme." }
  ]
},
/* ---------------------------------------------------------------- 4.6 */
{
  obj: "Comparer techniquement Android standard, Android en configuration renforcée et GrapheneOS, pour faire un choix éclairé.",
  intro: [
    "Entre un Android laissé par défaut et GrapheneOS, il existe une voie intermédiaire : un Android standard sérieusement configuré, avec les mesures du module 3. Pour beaucoup d'utilisateurs, c'est déjà une amélioration considérable.",
    "Cette comparaison vous aide à situer l'apport réel de chaque option."
  ],
  tech: [
    "Le tableau ci-dessous compare les trois configurations sur les critères essentiels. « Android renforcé » désigne un appareil récent, à jour, configuré selon le module 3, avec éventuellement la Protection avancée d'Android ou les protections renforcées du fabricant.",
    { h: "Lecture du tableau", p: [
      "La plus grande différence entre un Android par défaut et un Android renforcé tient à la configuration et à l'hygiène. La différence entre un Android renforcé et GrapheneOS tient surtout à la résistance à l'exploitation des failles, aux contrôles fins sur les applications et à la place des services Google."
    ]}
  ],
  table: {
    cap: "Comparaison technique simplifiée. Les capacités exactes varient selon le fabricant, le modèle et la version.",
    head: ["Critère", "Android par défaut", "Android renforcé (module 3)", "GrapheneOS"],
    rows: [
      ["Appareils", "Très large choix", "Très large choix", "Pixel listés officiellement"],
      ["Correctifs", "Selon le fabricant", "Selon le fabricant, installés rapidement", "Publication rapide, suit le support des Pixel"],
      ["Verrouillage", "Souvent faible", "PIN long, délai court, option Verrouillage", "Idem, plus brouillage du PIN, empreinte + PIN, code de contrainte"],
      ["Résistance à l'exploitation", "Protections Android standard", "Protections Android standard", "hardened_malloc, MTE étendu, durcissements supplémentaires"],
      ["Contrôle réseau par application", "Non", "Non (sauf pare-feu via VPN local)", "Permission Réseau native"],
      ["Capteurs", "Non contrôlés", "Non contrôlés", "Permission Capteurs"],
      ["Accès aux fichiers et contacts", "Permissions standard", "Sélecteur de photos, accès partiel", "Storage Scopes, Contact Scopes"],
      ["Services Google", "Privilégiés, intégrés", "Privilégiés, réglages ajustés", "Optionnels, en bac à sable"],
      ["Données au repos", "Chiffrement", "Chiffrement, redémarrages manuels", "Chiffrement, redémarrage automatique, contrôle USB-C"],
      ["Compatibilité des applications", "Maximale", "Maximale", "Très bonne ; certaines applis bancaires et le paiement Google Wallet posent problème"]
    ]
  },
  fig: "graphene-layers",
  steps: [
    "Positionnez votre appareil actuel dans l'une des trois colonnes.",
    "Si vous êtes dans la première colonne, appliquez d'abord le module 3 : c'est le gain le plus important.",
    "Identifiez les lignes où GrapheneOS apporterait une différence utile pour vous.",
    "Identifiez la ligne de compatibilité : testez la liste de vos applications indispensables.",
    "Décidez : rester en « Android renforcé » ou préparer une migration (modules 5 et 6)."
  ],
  result: "Vous avez choisi la configuration la plus adaptée à vos besoins et à vos contraintes.",
  ex: [
    "Un utilisateur dont l'application bancaire indispensable refuse GrapheneOS peut rester sur un Android renforcé, ou utiliser un second appareil pour la banque.",
    "Une journaliste choisit GrapheneOS pour la résistance à l'exploitation et la séparation par profils."
  ],
  err: [
    ["Passer directement à GrapheneOS sans appliquer les bonnes pratiques.", "Le module 3 reste valable : verrouillage, comptes, vigilance."],
    ["Négliger la vérification de compatibilité des applications.", "Listez vos applications indispensables et renseignez-vous avant de migrer."],
    ["Penser qu'Android renforcé est « inutile ».", "C'est une amélioration majeure par rapport à la configuration par défaut."]
  ],
  reco: [
    "Commencez toujours par renforcer votre configuration actuelle.",
    "Considérez GrapheneOS lorsque votre modèle de menaces inclut l'exploitation de failles ou que vous souhaitez réduire fortement la dépendance aux services Google.",
    "Réévaluez votre choix lors du renouvellement de votre appareil."
  ],
  sum: "Le premier gain vient de la configuration (module 3). GrapheneOS apporte ensuite une résistance accrue à l'exploitation, des contrôles fins (réseau, capteurs, fichiers, contacts) et un Google Play optionnel en bac à sable, au prix d'une compatibilité matérielle et applicative plus restreinte.",
  quiz: [
    { q: "Quelle est la plus grande différence entre un Android par défaut et un Android renforcé ?", o: ["Le matériel", "La configuration et l'hygiène numérique", "La couleur de l'interface", "Le forfait mobile"], a: 1, e: "Les réglages du module 3 apportent un gain très important." },
    { q: "Quel contrôle est natif sur GrapheneOS mais absent d'Android standard ?", o: ["La permission Réseau par application", "Le verrouillage par PIN", "Le Wi-Fi", "Les notifications"], a: 0, e: "Android standard ne propose pas de permission Réseau par application." },
    { q: "Quel est un inconvénient réel de GrapheneOS ?", o: ["Il ne reçoit pas de mises à jour", "Certaines applications bancaires et le paiement Google Wallet posent problème", "Il ne chiffre pas les données", "Il n'a pas de navigateur"], a: 1, e: "Certaines applications s'appuient sur des vérifications d'intégrité qui excluent les systèmes non certifiés par Google." }
  ]
},
/* ---------------------------------------------------------------- 4.7 */
{
  obj: "Comprendre comment fonctionne un téléphone sans Google Play : applications, notifications, localisation et alternatives.",
  intro: [
    "Par défaut, GrapheneOS fonctionne sans aucun service Google. De nombreux utilisateurs l'utilisent ainsi au quotidien. D'autres installent Google Play en bac à sable dans un profil séparé.",
    "Cette leçon vous permet d'évaluer si un usage sans Google Play est réaliste pour vous."
  ],
  tech: [
    { h: "Ce qui fonctionne sans Google Play", ul: [
      "Les applications du système et du projet (navigateur, appareil photo, téléphone, messages, contacts, PDF).",
      "Les applications qui ne dépendent pas des services Google : de nombreuses applications open source, certaines messageries comme Signal (avec son propre mécanisme de notifications lorsque Google Play est absent).",
      "La localisation par GPS, fournie par le système."
    ]},
    { h: "Ce qui peut poser problème", ul: [
      "Les applications qui exigent les services Google Play (notifications push via Firebase Cloud Messaging, cartes, connexion Google, achats intégrés).",
      "Les applications qui vérifient l'intégrité de l'appareil via les API de Google.",
      "Les applications distribuées uniquement sur le Play Store."
    ]},
    { h: "Les sources d'applications", p: [
      "L'<b>App Store de GrapheneOS</b> distribue les applications du projet et Google Play en bac à sable. D'autres magasins existent, avec des modèles de confiance différents : vérifiez toujours comment les applications y sont signées et mises à jour."
    ]}
  ],
  fig: "play-sandbox",
  steps: [
    "Listez toutes les applications que vous utilisez chaque semaine.",
    "Pour chacune, notez si elle a un équivalent ne dépendant pas des services Google, ou si elle fonctionne sans eux.",
    "Classez-les : « fonctionne sans Google Play », « nécessite Google Play », « inconnu ».",
    "Pour les applications « inconnu », consultez leur documentation ou le site de l'éditeur.",
    "Décidez d'une organisation : profil principal sans Google Play, et éventuellement un profil secondaire avec Google Play pour les applications qui l'exigent."
  ],
  result: "Vous savez quelles applications fonctionneront sans Google Play et comment organiser votre appareil.",
  ex: [
    "Une utilisatrice garde un profil principal sans Google Play pour ses communications et un profil « Services » avec Google Play pour le transport et la livraison.",
    "Une application de VTC ne reçoit pas ses notifications sans Google Play : elle est placée dans le profil qui en dispose."
  ],
  err: [
    ["Installer des « microG » ou services Google modifiés pour contourner les limites.", "Utilisez la solution officielle de GrapheneOS : Google Play en bac à sable."],
    ["Télécharger les APK du Play Store sur des sites miroirs.", "Ces sites ne garantissent pas l'authenticité des APK."],
    ["Renoncer immédiatement si une application manque.", "Organisez vos usages par profils."]
  ],
  reco: [
    "Commencez par un usage sans Google Play pour mesurer vos besoins réels.",
    "Réservez Google Play à un profil dédié si seules quelques applications en dépendent.",
    "Préférez des applications open source réputées lorsque c'est possible."
  ],
  sum: "Sans Google Play, GrapheneOS fait fonctionner les applications système et de nombreuses applications indépendantes. Les applications dépendant des services Google ou de leurs vérifications d'intégrité peuvent nécessiter Google Play en bac à sable, idéalement dans un profil dédié.",
  quiz: [
    { q: "Quel service Google est souvent nécessaire pour les notifications push des applications ?", o: ["Firebase Cloud Messaging", "Gmail", "YouTube", "Google Drive"], a: 0, e: "De nombreuses applications utilisent FCM, fourni par les services Google Play." },
    { q: "Quelle est la solution officielle de GrapheneOS pour les applications qui exigent Google Play ?", o: ["microG", "Google Play en bac à sable", "Le root", "Des APK de sites miroirs"], a: 1, e: "Google Play s'installe comme une application ordinaire, sans privilèges particuliers." },
    { q: "Pourquoi éviter les APK téléchargés sur des sites miroirs ?", o: ["Ils sont plus lourds", "Leur authenticité n'est pas garantie", "Ils sont payants", "Ils sont trop récents"], a: 1, e: "Un miroir peut distribuer une version modifiée." }
  ]
},
/* ---------------------------------------------------------------- 4.8 */
{
  obj: "Comprendre le fonctionnement de Google Play en bac à sable sur GrapheneOS, ce qu'il permet et ce qu'il ne permet pas.",
  intro: [
    "Sur Android standard, les services Google Play font partie du système et disposent de privilèges étendus. GrapheneOS propose une approche radicalement différente : Google Play est installé comme une application ordinaire, soumise au bac à sable et aux permissions.",
    "C'est l'une des fonctionnalités les plus appréciées du projet."
  ],
  tech: [
    { h: "Le principe", p: [
      "Les composants Google Play (Services, Play Store, Google Services Framework) sont installés comme des applications normales, dans un profil donné, sans aucun accès spécial. GrapheneOS fournit une <b>couche de compatibilité</b> qui leur permet de fonctionner malgré l'absence de privilèges : elle adapte les appels qui en auraient normalement besoin."
    ]},
    { h: "Les conséquences", ul: [
      "Google Play n'a accès qu'aux permissions que vous lui accordez (vous pouvez par exemple lui refuser la localisation).",
      "Il est limité au profil dans lequel il est installé : les autres profils n'en savent rien.",
      "Il peut être désinstallé à tout moment comme toute application.",
      "Les applications qui en dépendent (notifications FCM, cartes, achats intégrés) fonctionnent dans la plupart des cas.",
      "Par défaut, les demandes de localisation adressées à Google Play peuvent être redirigées vers la localisation du système, plutôt que vers le service de localisation de Google."
    ]},
    { h: "Les limites", p: [
      "Certaines fonctions nécessitant une intégration profonde au système ne sont pas disponibles, comme le paiement sans contact via Google Wallet. Certaines applications utilisant les vérifications d'intégrité de Google refusent de fonctionner sur un système qui n'est pas certifié par Google."
    ]}
  ],
  fig: "play-sandbox",
  steps: [
    "Identifiez le profil dans lequel vous installerez Google Play (principal ou secondaire).",
    "Préparez la liste des permissions que vous comptez lui accorder, en partant du minimum.",
    "Notez les applications qui en dépendent et qui iront dans ce profil.",
    "Lisez la section « Sandboxed Google Play » du guide d'utilisation officiel (<code>grapheneos.org/usage</code>).",
    "La procédure d'installation pas à pas est détaillée au module 7, leçon 8."
  ],
  result: "Vous comprenez le fonctionnement de Google Play en bac à sable et vous avez planifié son usage.",
  ex: [
    "Google Play est installé dans un profil « Travail » : les applications professionnelles reçoivent leurs notifications, tandis que le profil principal reste sans service Google.",
    "Vous refusez la localisation aux services Google Play : les applications de cartes utilisent la localisation du système via la redirection."
  ],
  err: [
    ["Croire que Google Play en bac à sable a les mêmes droits que sur Android standard.", "Il n'a que les permissions que vous lui accordez."],
    ["Installer Google Play dans tous les profils par défaut.", "Installez-le uniquement là où il est nécessaire."],
    ["Accorder toutes les permissions à Google Play pour « éviter les problèmes ».", "Partez du minimum et ajoutez au besoin."]
  ],
  reco: [
    "Séparez les usages : un profil sans Google Play pour le plus sensible.",
    "Revoyez régulièrement les permissions accordées aux services Google Play.",
    "Consultez le guide officiel en cas de problème de compatibilité avant toute modification."
  ],
  sum: "Sur GrapheneOS, Google Play est une application ordinaire, sans privilèges, limitée à son profil et à vos permissions, grâce à une couche de compatibilité. La plupart des applications qui en dépendent fonctionnent ; quelques fonctions profondément intégrées, comme le paiement sans contact Google Wallet, restent indisponibles.",
  quiz: [
    { q: "Comment Google Play est-il installé sur GrapheneOS ?", o: ["Comme une application ordinaire, sans privilèges", "Comme partie intégrante du système", "Via le root", "Il ne peut pas l'être"], a: 0, e: "C'est le principe du bac à sable : aucun accès spécial." },
    { q: "Google Play installé dans un profil secondaire a-t-il accès au profil principal ?", o: ["Oui", "Non, il est limité à son profil", "Seulement la nuit", "Seulement aux photos"], a: 1, e: "Chaque profil est cloisonné." },
    { q: "Quelle fonction n'est pas disponible avec Google Play en bac à sable ?", o: ["Les notifications push", "Le Play Store", "Le paiement sans contact Google Wallet", "Les mises à jour d'applications"], a: 2, e: "Le paiement sans contact via Google Wallet n'est pas pris en charge." }
  ]
},
/* ---------------------------------------------------------------- 4.9 */
{
  obj: "Découvrir les fonctionnalités de sécurité avancées de GrapheneOS destinées aux situations à risque.",
  intro: [
    "Au-delà des protections automatiques, GrapheneOS propose des fonctions que l'utilisateur active selon son niveau de risque. Elles répondent à des scénarios concrets : vol, saisie, contrainte, observation.",
    "Leur configuration est détaillée au module 7 ; cette leçon en présente le rôle."
  ],
  tech: [
    { h: "Verrouillage et contrainte", ul: [
      "<b>Brouillage du clavier du PIN</b> : la disposition des chiffres change, ce qui complique l'observation des gestes.",
      "<b>Déverrouillage en deux facteurs</b> : empreinte digitale suivie du PIN.",
      "<b>Code ou mot de passe de contrainte (duress)</b> : un code secondaire qui, s'il est saisi, efface l'appareil de façon irréversible. À utiliser avec la plus grande prudence."
    ]},
    { h: "Surface d'attaque physique et radio", ul: [
      "<b>Contrôle du port USB-C</b> : limitation des fonctions de données lorsque l'appareil est verrouillé.",
      "<b>Désactivation automatique du Wi-Fi et du Bluetooth</b> après un délai sans connexion.",
      "<b>Mode réseau mobile restreint</b> pour limiter la surface d'attaque du modem et éviter certaines générations de réseau."
    ]},
    { h: "Vérification et isolation", ul: [
      "<b>Auditor</b> : vérification de l'intégrité de l'appareil par attestation matérielle, ponctuelle ou planifiée.",
      "<b>Réglages de protection contre l'exploitation par application</b> : modes de compatibilité ciblés lorsque c'est nécessaire.",
      "<b>Profils</b> avec fin de session, pour remettre les données d'un profil au repos."
    ]}
  ],
  fig: "profiles",
  steps: [
    "Reprenez votre modèle de menaces.",
    "Pour chaque fonction ci-dessus, notez le scénario qu'elle couvre (vol, observation, contrainte, attaque physique).",
    "Sélectionnez celles qui correspondent à votre situation.",
    "Pour le code de contrainte, évaluez soigneusement le risque d'effacement accidentel avant de l'envisager.",
    "Planifiez leur activation lors de la configuration avancée (module 7, leçon 13)."
  ],
  result: "Vous avez sélectionné les fonctions avancées utiles à votre profil, en connaissant leurs implications.",
  ex: [
    "Un voyageur fréquent active le brouillage du PIN et la désactivation automatique du Bluetooth.",
    "Une personne à très haut risque envisage le code de contrainte, après s'être assurée que ses sauvegardes sont à jour."
  ],
  err: [
    ["Activer le code de contrainte sans sauvegarde.", "L'effacement est irréversible : sauvegardez d'abord."],
    ["Choisir un code de contrainte proche du code principal.", "Choisissez un code distinct pour éviter un effacement par erreur de frappe."],
    ["Activer toutes les options sans comprendre leurs effets.", "Activez-les une par une et testez votre usage quotidien."]
  ],
  reco: [
    "Choisissez les fonctions selon votre modèle de menaces, pas « au cas où ».",
    "Documentez vos réglages pour pouvoir les reproduire après une réinstallation.",
    "Consultez la page Features pour la description officielle de chaque fonction."
  ],
  sum: "GrapheneOS propose des fonctions activables selon le risque : brouillage du PIN, déverrouillage en deux facteurs, code de contrainte, contrôle du port USB-C, désactivation automatique des radios, restrictions réseau mobile, Auditor et réglages de protection par application. Elles doivent être choisies en fonction de votre modèle de menaces.",
  quiz: [
    { q: "Que fait le code de contrainte (duress) de GrapheneOS ?", o: ["Il appelle les secours", "Il efface l'appareil de façon irréversible lorsqu'il est saisi", "Il cache les applications", "Il désactive l'écran"], a: 1, e: "C'est une fonction d'effacement d'urgence : elle demande prudence et sauvegardes." },
    { q: "À quoi sert le brouillage du clavier du PIN ?", o: ["À compliquer l'observation des gestes lors de la saisie", "À rendre le PIN plus long", "À accélérer la saisie", "À changer de langue"], a: 0, e: "La position des chiffres change, ce qui rend l'observation moins utile." },
    { q: "Avant d'activer le code de contrainte, que faut-il impérativement faire ?", o: ["Changer de fond d'écran", "Disposer de sauvegardes à jour", "Désactiver le Wi-Fi", "Installer Google Play"], a: 1, e: "Une saisie, même accidentelle, efface toutes les données." }
  ]
},
/* ---------------------------------------------------------------- 4.10 */
{
  obj: "Connaître avec honnêteté les limites et contraintes de GrapheneOS pour prendre une décision éclairée.",
  intro: [
    "Une formation sérieuse doit présenter les limites autant que les avantages. GrapheneOS est un excellent système pour de nombreux profils, mais il n'est ni magique, ni adapté à tout le monde.",
    "Connaître ces limites évite les déceptions et les faux sentiments de sécurité."
  ],
  tech: [
    { h: "Limites matérielles", ul: [
      "Uniquement les appareils de la liste officielle (Pixel), avec des durées de support limitées par celles du matériel.",
      "Les variantes vendues verrouillées par certains opérateurs peuvent être impossibles à déverrouiller.",
      "L'achat d'un Pixel neuf a un coût et implique un fabricant particulier."
    ]},
    { h: "Limites applicatives", ul: [
      "Paiement sans contact Google Wallet non pris en charge.",
      "Certaines applications bancaires ou d'entreprise refusent les systèmes non certifiés par Google.",
      "Certaines fonctions de l'écosystème Google ou du fabricant ne sont pas disponibles."
    ]},
    { h: "Limites de protection", ul: [
      "Aucune protection contre le phishing, l'ingénierie sociale ou un mot de passe faible.",
      "Une application à laquelle vous accordez des permissions peut toujours les utiliser.",
      "Vos comptes en ligne, votre opérateur et vos contacts restent des sources de données.",
      "Une faille encore inconnue peut, en théorie, être exploitée : le risque est réduit, pas nul."
    ]},
    { h: "Contraintes d'usage", p: [
      "L'installation efface l'appareil, la configuration demande du temps et certaines habitudes doivent évoluer. L'aide passe principalement par la documentation et les canaux communautaires officiels."
    ]}
  ],
  fig: "graphene-layers",
  steps: [
    "Reprenez la liste de vos applications indispensables (leçon 7).",
    "Vérifiez que vous pouvez vous passer du paiement sans contact Google Wallet ou le remplacer.",
    "Identifiez les applications qui pourraient refuser de fonctionner.",
    "Évaluez votre temps disponible pour l'installation et la configuration (plusieurs heures la première fois).",
    "Prenez votre décision et consignez-la, avec ses raisons."
  ],
  result: "Votre décision est prise en connaissance de cause.",
  ex: [
    "Un commerçant dépend d'une application de paiement qui refuse les systèmes non certifiés : il conserve un Android renforcé pour son activité.",
    "Une étudiante utilise essentiellement des applications open source : GrapheneOS lui convient parfaitement."
  ],
  err: [
    ["Croire que GrapheneOS dispense de toute vigilance.", "Les modules 2, 3 et 8 restent pleinement applicables."],
    ["Migrer sans tester la compatibilité de ses applications critiques.", "Vérifiez avant de migrer."],
    ["Acheter un Pixel d'opérateur sans vérifier qu'il peut être déverrouillé.", "Suivez le module 5."]
  ],
  reco: [
    "Ne présentez jamais GrapheneOS à un proche comme une solution « inviolable ».",
    "Gardez un plan de retour : il est possible de réinstaller le système d'origine (procédure officielle de Google, détaillée dans le guide d'installation de GrapheneOS).",
    "Si vous migrez, commencez par une période de test avec les applications non critiques."
  ],
  sum: "GrapheneOS est limité à certains Pixel, ne prend pas en charge le paiement sans contact Google Wallet, peut être refusé par certaines applications et ne protège ni contre le phishing ni contre les permissions que vous accordez. Ces limites doivent être pesées avant toute migration.",
  quiz: [
    { q: "GrapheneOS protège-t-il contre l'ingénierie sociale ?", o: ["Oui, totalement", "Non", "Oui, avec Google Play", "Oui, sur Pixel 10"], a: 1, e: "L'ingénierie sociale vise l'utilisateur, pas le système." },
    { q: "Est-il possible de revenir au système d'origine après avoir installé GrapheneOS ?", o: ["Non, jamais", "Oui, via la procédure officielle de Google décrite dans le guide de GrapheneOS", "Seulement en magasin", "Seulement sur Pixel 6"], a: 1, e: "Le guide officiel explique comment réinstaller le système d'origine." },
    { q: "Quelle est une limite matérielle de GrapheneOS ?", o: ["Il fonctionne sur tous les téléphones", "Il ne fonctionne que sur les appareils de la liste officielle", "Il nécessite un ordinateur en permanence", "Il ne fonctionne qu'en Wi-Fi"], a: 1, e: "La liste officielle est limitée à certains Pixel." }
  ]
}
];
