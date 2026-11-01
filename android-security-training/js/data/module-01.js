/* Module 1 : Comprendre la sécurité Android
   Format de chaque leçon : voir README (section « Ajouter ou modifier une leçon »). */
window.ASG = window.ASG || {}; ASG.content = ASG.content || {};
ASG.content.m1 = [
/* ---------------------------------------------------------------- 1.1 */
{
  obj: "Retracer les grandes étapes de l'histoire d'Android, comprendre son modèle open source et savoir identifier la version installée sur votre propre appareil.",
  intro: [
    "Android équipe aujourd'hui la grande majorité des smartphones dans le monde. Pour comprendre sa sécurité, il faut d'abord comprendre d'où il vient : un système ouvert, conçu pour être adapté par des centaines de fabricants, ce qui est à la fois une force et une source de fragilités.",
    "Cette leçon pose le vocabulaire de base que vous utiliserez dans toute la formation : AOSP, version, surcouche fabricant, services Google."
  ],
  tech: [
    { h: "Des origines à aujourd'hui", p: [
      "La société Android Inc. est fondée en 2003, puis rachetée par Google en 2005. Le système est présenté en novembre 2007 avec l'Open Handset Alliance, un consortium de fabricants et d'opérateurs. Le premier téléphone commercialisé, le HTC Dream (T-Mobile G1), sort en 2008.",
      "Jusqu'à Android 9 (2018), les versions portaient des noms de desserts. Depuis Android 10 (2019), seul le numéro est utilisé. Depuis Android 16, Google publie la version majeure au deuxième trimestre, complétée par une mise à jour intermédiaire en fin d'année."
    ]},
    { h: "AOSP, surcouches et services Google", p: [
      "Le cœur d'Android est publié sous licence libre dans l'<b>Android Open Source Project (AOSP)</b>. Les fabricants (Samsung, Xiaomi, Google, etc.) partent de ce code, y ajoutent leurs pilotes, leur interface (One UI, HyperOS…) et, sous contrat avec Google, les <b>Google Mobile Services</b> : Play Store, services Google Play, applications Google.",
      "Conséquence directe pour la sécurité : deux téléphones « Android 16 » peuvent avoir des niveaux de protection, des réglages et des calendriers de mises à jour très différents selon le fabricant."
    ]},
    { h: "Le fonctionnement général", p: [
      "Android repose sur un noyau Linux, exécute les applications dans une machine virtuelle optimisée (ART, Android Runtime) et isole chaque application dans son propre environnement. Les applications communiquent avec le système par un mécanisme contrôlé appelé Binder. Ces notions sont détaillées dans les leçons suivantes."
    ]}
  ],
  fig: "android-stack",
  steps: [
    "Ouvrez l'application <b>Paramètres</b>.",
    "Faites défiler jusqu'à <b>À propos du téléphone</b> (sur Samsung : <b>À propos du téléphone › Informations sur le logiciel</b> ; sur Xiaomi : <b>À propos du téléphone</b>).",
    "Relevez la ligne <b>Version d'Android</b>.",
    "Relevez également le nom de l'interface du fabricant (One UI, HyperOS, etc.) si elle est indiquée.",
    "Notez ces informations : elles serviront à adapter les procédures des modules suivants."
  ],
  result: "Vous connaissez la version d'Android et la surcouche de votre appareil.",
  ex: [
    "Un Pixel 9 et un Galaxy S24 peuvent tous deux fonctionner sous Android 16, mais leurs menus de sécurité ne portent pas les mêmes noms.",
    "Un téléphone d'entrée de gamme vendu en 2021 peut être resté bloqué sur Android 11 : il ne reçoit plus de nouvelles fonctions de confidentialité ni, souvent, de correctifs."
  ],
  err: [
    ["Confondre la version d'Android et la version de l'interface du fabricant (par exemple One UI 8 et Android 16).", "Lisez bien la ligne « Version d'Android » ; la version de l'interface est une information distincte."],
    ["Penser qu'un téléphone neuf est forcément à jour.", "Un appareil peut rester en stock des mois : installez toutes les mises à jour dès la première mise en service."],
    ["Croire qu'Android est entièrement contrôlé par Google.", "Le code de base est ouvert ; chaque fabricant le modifie et gère ses propres mises à jour."]
  ],
  reco: [
    "Avant d'acheter un téléphone, vérifiez la durée de support logiciel annoncée officiellement par le fabricant.",
    "Gardez une fiche décrivant votre appareil : modèle, version d'Android, surcouche, date du dernier correctif.",
    "Privilégiez les sources officielles (source.android.com, sites des fabricants) pour toute information technique."
  ],
  sum: "Android est un système ouvert (AOSP) adapté par chaque fabricant, qui y ajoute son interface et souvent les services Google. Cette diversité explique les grands écarts de sécurité entre appareils. Savoir identifier sa version d'Android et sa surcouche est le point de départ de toute démarche de sécurisation.",
  quiz: [
    { q: "Que désigne l'acronyme AOSP ?", o: ["Android Online Security Platform", "Android Open Source Project", "Advanced Operating System Protection", "Application Open Security Policy"], a: 1, e: "AOSP est le projet open source qui publie le code de base d'Android." },
    { q: "Pourquoi deux téléphones sous la même version d'Android peuvent-ils avoir des niveaux de sécurité différents ?", o: ["Parce que la version d'Android est purement décorative", "Parce que chaque fabricant adapte le système et gère ses propres mises à jour", "Parce que seuls les Pixel reçoivent le noyau Linux", "Ce n'est jamais le cas"], a: 1, e: "Les surcouches, les pilotes et le calendrier de mises à jour dépendent du fabricant." },
    { q: "Où trouver la version d'Android sur la plupart des appareils ?", o: ["Paramètres › À propos du téléphone", "Play Store › Mon compte", "Paramètres › Batterie", "Dans l'application Téléphone"], a: 0, e: "La rubrique « À propos du téléphone » (parfois via « Informations sur le logiciel ») indique la version." }
  ]
},
/* ---------------------------------------------------------------- 1.2 */
{
  obj: "Décrire les couches de l'architecture Android et distinguer clairement la sécurité du système, la sécurité des applications et la confidentialité des données.",
  intro: [
    "Un smartphone Android n'est pas un bloc unique : c'est un empilement de couches logicielles qui reposent sur du matériel spécialisé. Chaque couche a ses propres protections, et une attaque réussie consiste souvent à franchir l'une d'elles.",
    "Comprendre cette architecture vous permettra de savoir, pour chaque réglage étudié plus loin, quelle couche il protège."
  ],
  tech: [
    { h: "Les cinq couches", ul: [
      "<b>Applications</b> : applications système et applications installées, chacune isolée dans son bac à sable.",
      "<b>Framework</b> : services Java/Kotlin (gestionnaire d'activités, de paquets, de permissions) exécutés notamment dans le processus <code>system_server</code>.",
      "<b>Runtime et bibliothèques natives</b> : ART exécute le code des applications ; la libc Bionic, BoringSSL, les bibliothèques médias fournissent les fonctions de base.",
      "<b>HAL</b> (Hardware Abstraction Layer) : interfaces standardisées entre Android et les composants matériels. Depuis Android 8 (projet Treble), la partie fabricant est séparée du reste du système, ce qui facilite les mises à jour.",
      "<b>Noyau Linux</b> : gestion des processus, de la mémoire, des pilotes, et application des règles d'isolement."
    ]},
    { h: "Binder, le passage obligé", p: [
      "Les applications ne s'adressent jamais directement au matériel. Elles passent par <b>Binder</b>, le mécanisme de communication interprocessus d'Android. À chaque appel, le système connaît l'identité de l'application appelante et peut vérifier ses permissions."
    ]},
    { h: "Trois notions à ne pas confondre", p: [
      "La <b>sécurité du système</b> protège l'intégrité de l'OS lui-même (démarrage vérifié, SELinux, correctifs). La <b>sécurité des applications</b> concerne la façon dont chaque application est isolée, signée et contrôlée. La <b>confidentialité des données</b> porte sur ce que les applications et services ont le droit de collecter, même sans aucune attaque."
    ]}
  ],
  table: {
    cap: "Trois dimensions complémentaires de la protection d'un smartphone.",
    head: ["Dimension", "Question posée", "Exemples de protections"],
    rows: [
      ["Sécurité du système", "L'OS est-il intact et à jour ?", "Démarrage vérifié, SELinux, correctifs mensuels"],
      ["Sécurité des applications", "Une application peut-elle nuire aux autres ?", "Bac à sable, signature des APK, Play Protect"],
      ["Confidentialité des données", "Qui accède à mes informations, et pourquoi ?", "Permissions, localisation approximative, réglages publicitaires"]
    ]
  },
  fig: "android-stack",
  steps: [
    "Ouvrez <b>Paramètres › À propos du téléphone</b> et repérez les informations sur le matériel et le logiciel.",
    "Ouvrez ensuite <b>Paramètres › Applications</b> et choisissez une application installée.",
    "Consultez ses <b>Autorisations</b> : vous observez ici la couche « confidentialité ».",
    "Revenez à <b>Paramètres › Sécurité</b> (ou <b>Sécurité et confidentialité</b>) : vous observez la couche « système » (mises à jour, verrouillage).",
    "Notez, pour chaque menu visité, la dimension qu'il protège."
  ],
  result: "Vous savez associer chaque grand menu de sécurité à la couche qu'il protège.",
  ex: [
    "Une faille dans une bibliothèque de décodage d'images (couche native) peut être exploitée par une simple image reçue : c'est un problème de sécurité du système, corrigé par une mise à jour.",
    "Une application de lampe torche qui collecte vos contacts n'exploite aucune faille : c'est un problème de confidentialité, réglé par les permissions."
  ],
  err: [
    ["Penser qu'un antivirus règle tous les problèmes.", "Un antivirus agit surtout sur la sécurité des applications ; il ne remplace ni les mises à jour système ni la gestion des permissions."],
    ["Négliger la confidentialité parce que « le téléphone n'est pas piraté ».", "Une collecte excessive de données est légale dans bien des cas : c'est à vous de la limiter."],
    ["Croire que les applications accèdent librement au matériel.", "Tout passe par Binder et les services système, qui contrôlent les permissions."]
  ],
  reco: [
    "Raisonnez toujours en couches : pour chaque risque, identifiez la couche concernée et la protection adaptée.",
    "Combinez les trois dimensions : un système à jour, des applications de confiance, des permissions minimales.",
    "Consultez la documentation « Android Security » d'AOSP pour approfondir l'architecture."
  ],
  sum: "Android empile applications, framework, runtime et bibliothèques, HAL et noyau Linux. Binder est le canal contrôlé entre applications et système. La sécurité du système, la sécurité des applications et la confidentialité des données sont trois dimensions distinctes et complémentaires.",
  quiz: [
    { q: "Quel mécanisme permet aux applications de communiquer avec les services système de manière contrôlée ?", o: ["Bluetooth", "Binder", "NFC", "Le Play Store"], a: 1, e: "Binder est le mécanisme de communication interprocessus d'Android ; il transmet l'identité de l'appelant." },
    { q: "Une application de calculatrice qui lit vos contacts relève avant tout de :", o: ["La sécurité du système", "La confidentialité des données", "Du démarrage vérifié", "Du noyau Linux"], a: 1, e: "Il n'y a pas forcément de faille : c'est une question d'accès aux données, réglée par les permissions." },
    { q: "Quel est l'intérêt principal du projet Treble introduit avec Android 8 ?", o: ["Accélérer les jeux", "Séparer la partie fabricant du reste du système pour faciliter les mises à jour", "Supprimer le noyau Linux", "Chiffrer les SMS"], a: 1, e: "Treble sépare l'implémentation fabricant (vendor) du framework Android." }
  ]
},
/* ---------------------------------------------------------------- 1.3 */
{
  obj: "Comprendre le rôle du noyau Linux dans la sécurité d'Android : isolement des processus, contrôle d'accès, filtrage des appels système et durcissement.",
  intro: [
    "Le noyau est la partie la plus privilégiée du système logiciel. Tout ce qui s'exécute sur le téléphone dépend de lui pour accéder à la mémoire, aux fichiers et au matériel. S'il est compromis, toutes les autres protections peuvent être contournées.",
    "C'est pourquoi les failles du noyau sont parmi les plus recherchées par les attaquants et les plus surveillées par les équipes de sécurité."
  ],
  tech: [
    { h: "Isolement des processus et identités", p: [
      "Le noyau attribue à chaque processus un identifiant d'utilisateur (UID) et de groupe (GID). Android exploite ce mécanisme UNIX classique en donnant un UID distinct à chaque application : c'est le contrôle d'accès discrétionnaire (DAC). Les permissions de fichiers empêchent une application de lire les fichiers d'une autre."
    ]},
    { h: "Contrôles supplémentaires", ul: [
      "<b>SELinux</b> ajoute un contrôle d'accès obligatoire (leçon 6).",
      "<b>seccomp-bpf</b> filtre les appels système autorisés pour les applications depuis Android 8, réduisant la surface d'attaque du noyau.",
      "<b>Durcissements du compilateur et du noyau</b> : intégrité du flot de contrôle (CFI), protections de la pile, randomisation de l'espace d'adressage (ASLR), restrictions d'accès aux informations sensibles du noyau."
    ]},
    { h: "Le noyau générique (GKI)", p: [
      "Historiquement, chaque fabricant maintenait sa propre version du noyau, ce qui ralentissait la diffusion des correctifs. Avec le projet <b>Generic Kernel Image</b>, Google fournit un noyau commun, auquel les fabricants ajoutent des modules. Le but est d'accélérer et d'uniformiser les mises à jour."
    ]},
    { h: "Le cas du « root »", p: [
      "« Rooter » un téléphone consiste à obtenir les droits de l'UID 0, le super-utilisateur. Cela contourne une partie du modèle de sécurité : une application malveillante qui obtient ces droits peut lire toutes les données. Pour un usage quotidien, un téléphone rooté est moins sûr, pas plus."
    ]}
  ],
  fig: "android-stack",
  steps: [
    "Ouvrez <b>Paramètres › À propos du téléphone</b>.",
    "Repérez la ligne <b>Version du noyau</b> (parfois dans <b>Informations sur le logiciel</b> ou <b>Version d'Android</b>).",
    "Notez le numéro de version (par exemple 6.1.x) et sa date de compilation.",
    "Comparez cette date avec celle du correctif de sécurité indiqué sur le même écran.",
    "Si les deux dates sont très anciennes, consultez le module 3 pour mettre à jour l'appareil."
  ],
  result: "Vous savez localiser la version du noyau et la situer par rapport au niveau de correctif.",
  ex: [
    "Une faille permettant une élévation de privilèges dans le noyau peut transformer une application anodine en logiciel espion disposant de tous les droits : c'est pourquoi ces failles sont corrigées en priorité dans les bulletins.",
    "Sur un téléphone rooté, une application de « nettoyage » à qui l'on accorde l'accès root peut lire les messages de toutes les autres applications."
  ],
  err: [
    ["Rooter son téléphone « pour mieux le sécuriser ».", "Le root affaiblit l'isolement ; préférez un système à jour et, si besoin, un OS renforcé comme GrapheneOS qui reste verrouillé."],
    ["Ignorer les mises à jour car « elles ne changent rien de visible ».", "Les correctifs du noyau sont invisibles mais essentiels : installez-les systématiquement."],
    ["Installer des « optimiseurs de noyau » trouvés sur des forums.", "N'installez jamais de noyau modifié sur un appareil contenant des données sensibles."]
  ],
  reco: [
    "Considérez le noyau comme la fondation : aucune application de sécurité ne compense un noyau vulnérable.",
    "Refusez toute application qui demande l'accès root sans raison professionnelle légitime.",
    "Dans un contexte professionnel, interdisez les appareils rootés par la politique de gestion de flotte."
  ],
  sum: "Le noyau Linux isole les processus grâce aux UID, complété par SELinux, seccomp et divers durcissements. Le projet GKI vise à accélérer la diffusion des correctifs. Rooter un téléphone contourne ces protections et dégrade la sécurité.",
  quiz: [
    { q: "Que procure le « root » à une application ?", o: ["Des notifications prioritaires", "Les droits du super-utilisateur (UID 0)", "Une meilleure autonomie", "Le chiffrement des données"], a: 1, e: "Le root donne les droits du super-utilisateur, ce qui permet de contourner l'isolement entre applications." },
    { q: "Quel mécanisme limite les appels système qu'une application peut effectuer ?", o: ["seccomp-bpf", "Bluetooth LE", "Le Play Store", "Le mode avion"], a: 0, e: "seccomp-bpf filtre les appels système autorisés, ce qui réduit la surface d'attaque du noyau." },
    { q: "Quel est l'objectif du projet Generic Kernel Image (GKI) ?", o: ["Remplacer Linux par un autre noyau", "Fournir un noyau commun pour accélérer et uniformiser les mises à jour", "Supprimer les pilotes", "Interdire le multitâche"], a: 1, e: "Le GKI réduit la fragmentation des noyaux entre fabricants." }
  ]
},
/* ---------------------------------------------------------------- 1.4 */
{
  obj: "Expliquer le fonctionnement du bac à sable applicatif (Application Sandbox) et en mesurer les forces et les limites.",
  intro: [
    "Le bac à sable est la pierre angulaire de la sécurité d'Android. Son principe est simple : chaque application vit dans son propre espace clos, et ne peut en sortir qu'en passant par des portes contrôlées par le système.",
    "C'est ce mécanisme qui empêche, en temps normal, un jeu téléchargé de lire les messages de votre application bancaire."
  ],
  tech: [
    { h: "Un UID par application", p: [
      "À l'installation, Android attribue à chaque application un identifiant Linux unique (par exemple <code>u0_a142</code> : utilisateur 0, application 142). Ses données privées sont stockées dans un répertoire qui n'appartient qu'à elle. Le noyau refuse tout accès d'un autre UID."
    ]},
    { h: "Les couches du bac à sable", ul: [
      "<b>Permissions de fichiers UNIX</b> : chaque répertoire privé n'est lisible que par son application.",
      "<b>SELinux</b> : les applications tierces s'exécutent dans le domaine <code>untrusted_app</code>, très restreint.",
      "<b>seccomp</b> : filtrage des appels système.",
      "<b>Stockage limité (scoped storage)</b> : depuis Android 10 et 11, les applications n'accèdent plus librement à tout le stockage partagé.",
      "<b>Processus isolés</b> : certains composants à risque, comme le moteur de rendu de WebView, s'exécutent dans des processus encore plus restreints."
    ]},
    { h: "Les limites", p: [
      "Le bac à sable n'empêche pas une application d'utiliser les droits que vous lui avez accordés. Si vous autorisez une application à lire vos SMS ou à utiliser le service d'accessibilité, elle le fera légitimement du point de vue du système. Il ne protège pas non plus contre une faille du noyau qui permettrait de s'en échapper."
    ]}
  ],
  fig: "sandbox",
  steps: [
    "Ouvrez <b>Paramètres › Applications</b> et sélectionnez une application.",
    "Ouvrez <b>Stockage et cache</b> : vous voyez la taille de ses données privées, qui lui sont réservées.",
    "Ouvrez <b>Autorisations</b> : ce sont les « portes » que vous avez ouvertes dans son bac à sable.",
    "Retirez toute autorisation non nécessaire à la fonction principale de l'application.",
    "Répétez l'opération pour les applications que vous utilisez le moins."
  ],
  result: "Chaque application ne dispose plus que des accès strictement nécessaires.",
  ex: [
    "Une application de messagerie et une application de jeu installées sur le même téléphone ne peuvent pas lire les fichiers l'une de l'autre, même si elles proviennent du même éditeur, sauf si elles sont signées avec le même certificat et configurées pour partager des données.",
    "Un cheval de Troie bancaire ne « casse » généralement pas le bac à sable : il trompe l'utilisateur pour obtenir le service d'accessibilité, puis lit l'écran."
  ],
  err: [
    ["Croire que le bac à sable rend les permissions inutiles.", "Le bac à sable isole, mais chaque permission accordée ouvre une porte : gérez-les activement."],
    ["Accorder le service d'accessibilité à une application inconnue.", "Ce service permet de lire l'écran et d'agir à votre place : réservez-le aux outils d'assistance de confiance."],
    ["Penser qu'une application supprimée laisse toujours ses données.", "Les données privées sont effacées à la désinstallation ; seuls les fichiers placés dans le stockage partagé peuvent subsister."]
  ],
  reco: [
    "Installez moins d'applications : chaque application est un bac à sable supplémentaire à surveiller.",
    "Supprimez les applications inutilisées plutôt que de les garder « au cas où ».",
    "Méfiez-vous particulièrement des demandes d'accessibilité, de superposition d'écran et d'administration de l'appareil."
  ],
  sum: "Chaque application Android reçoit un UID unique et un répertoire privé. Les permissions UNIX, SELinux, seccomp et le stockage limité renforcent cet isolement. Le bac à sable ne protège pas contre les droits que vous accordez vous-même : la gestion des permissions reste indispensable.",
  quiz: [
    { q: "Sur quoi repose principalement l'isolement entre applications Android ?", o: ["Sur l'antivirus préinstallé", "Sur un identifiant Linux (UID) unique par application", "Sur la carte SIM", "Sur la luminosité de l'écran"], a: 1, e: "Le noyau sépare les applications grâce à des UID distincts, renforcés par SELinux." },
    { q: "Une application de jeu peut-elle lire directement le répertoire privé de votre application bancaire ?", o: ["Oui, si elles sont installées le même jour", "Non, le noyau et SELinux bloquent l'accès", "Oui, si le Wi-Fi est activé", "Oui, après un redémarrage"], a: 1, e: "Le répertoire privé n'est accessible qu'à l'application propriétaire." },
    { q: "Pourquoi le service d'accessibilité est-il recherché par les malwares ?", o: ["Il accélère le processeur", "Il permet de lire l'écran et d'agir à la place de l'utilisateur", "Il désactive les mises à jour", "Il chiffre les fichiers"], a: 1, e: "Le service d'accessibilité donne une visibilité et un contrôle très larges : il doit être réservé aux outils de confiance." }
  ]
},
/* ---------------------------------------------------------------- 1.5 */
{
  obj: "Connaître les catégories de permissions Android, leur évolution selon les versions, et savoir les gérer de façon méthodique.",
  intro: [
    "Les permissions sont le contrat entre vous et chaque application. Elles déterminent ce qu'une application peut faire en dehors de son bac à sable : utiliser la caméra, connaître votre position, lire vos contacts.",
    "Bien gérées, elles réduisent considérablement les risques de collecte abusive et l'impact d'une application malveillante."
  ],
  tech: [
    { h: "Les catégories", ul: [
      "<b>Permissions normales</b> : faible risque (accès à Internet, vibration). Elles sont accordées automatiquement à l'installation.",
      "<b>Permissions dangereuses ou d'exécution</b> : position, caméra, micro, contacts, SMS, journal d'appels, appareils à proximité… Depuis Android 6, elles sont demandées au moment de l'usage et révocables.",
      "<b>Accès spéciaux</b> : superposition d'écran, accès à toutes les notifications, administration de l'appareil, installation d'applications inconnues, accès à tous les fichiers. Ils se règlent dans un menu dédié.",
      "<b>Permissions de signature</b> : réservées aux applications signées avec le même certificat que le composant qui les définit, en pratique le système."
    ]},
    { h: "Les progrès récents", ul: [
      "Android 10 : la position en arrière-plan devient une autorisation distincte.",
      "Android 11 : autorisations « Seulement cette fois » et réinitialisation automatique pour les applications inutilisées.",
      "Android 12 : position approximative, indicateurs de caméra et de micro, tableau de bord de confidentialité.",
      "Android 13 : autorisation explicite pour les notifications et sélecteur de photos.",
      "Android 14 : accès partiel aux photos et vidéos (« photos sélectionnées »)."
    ]}
  ],
  fig: "permissions",
  steps: [
    "Ouvrez le gestionnaire d'autorisations : sur Pixel, <b>Paramètres › Sécurité et confidentialité › Confidentialité › Gestionnaire d'autorisations</b> ; sur Samsung, <b>Paramètres › Sécurité et confidentialité › Autorisations</b> (les libellés varient selon les versions).",
    "Sélectionnez une catégorie sensible, par exemple <b>Position</b>.",
    "Pour chaque application listée, demandez-vous si l'accès est indispensable à sa fonction principale.",
    "Choisissez <b>Autoriser seulement si l'application est en cours d'utilisation</b>, <b>Toujours demander</b> ou <b>Ne pas autoriser</b>.",
    "Répétez pour Caméra, Micro, Contacts, SMS, Journal d'appels et Appareils à proximité.",
    "Ouvrez enfin le menu des <b>accès spéciaux des applications</b> et vérifiez la superposition, l'accès aux notifications et les applications d'administration."
  ],
  result: "Seules les applications qui en ont réellement besoin conservent les accès sensibles.",
  ex: [
    "Une application de navigation a besoin de la position précise pendant l'utilisation, mais presque jamais « tout le temps ».",
    "Une application météo fonctionne très bien avec la position approximative.",
    "Un jeu qui demande l'accès au journal d'appels n'a aucune justification fonctionnelle."
  ],
  err: [
    ["Tout accepter lors de la première ouverture pour « que ça marche ».", "Refusez par défaut ; l'application redemandera si la fonction le nécessite vraiment."],
    ["Oublier les accès spéciaux, qui n'apparaissent pas dans le gestionnaire classique.", "Contrôlez régulièrement le menu « Accès spéciaux des applications »."],
    ["Désactiver la réinitialisation automatique des autorisations.", "Laissez-la active : elle retire les droits des applications que vous n'utilisez plus."]
  ],
  reco: [
    "Appliquez le principe du moindre privilège : le minimum d'accès, pour la durée minimale.",
    "Préférez « Seulement cette fois » pour les usages ponctuels (caméra pour scanner un document, par exemple).",
    "Faites une revue des autorisations tous les trois mois, ou après l'installation de nouvelles applications."
  ],
  sum: "Android distingue permissions normales, d'exécution, accès spéciaux et permissions de signature. Les versions récentes ont ajouté l'accès ponctuel, la position approximative, les indicateurs et l'accès partiel aux photos. Une revue régulière, guidée par le principe du moindre privilège, réduit fortement les risques.",
  quiz: [
    { q: "Depuis quelle version d'Android les permissions sensibles sont-elles demandées au moment de l'utilisation ?", o: ["Android 2", "Android 6", "Android 14", "Elles ne le sont jamais"], a: 1, e: "Le modèle de permissions à l'exécution a été introduit avec Android 6." },
    { q: "Pour une application météo, quel réglage de position est généralement suffisant ?", o: ["Position précise, toujours", "Position approximative, pendant l'utilisation", "Accès à tous les fichiers", "Administration de l'appareil"], a: 1, e: "La position approximative suffit pour la météo et limite la collecte." },
    { q: "Où se règlent la superposition d'écran et l'accès aux notifications ?", o: ["Dans les accès spéciaux des applications", "Dans le Play Store", "Dans les réglages de l'appareil photo", "Dans le menu Batterie"], a: 0, e: "Ces droits très sensibles se trouvent dans un menu dédié aux accès spéciaux." }
  ]
},
/* ---------------------------------------------------------------- 1.6 */
{
  obj: "Comprendre le contrôle d'accès obligatoire SELinux, son mode de fonctionnement sur Android et sa contribution au confinement des attaques.",
  intro: [
    "Les permissions de fichiers classiques reposent sur la bonne configuration de chaque propriétaire : c'est le contrôle d'accès discrétionnaire. SELinux ajoute une couche indépendante, définie par le système et que même un processus privilégié ne peut pas modifier.",
    "Son rôle est de limiter les dégâts lorsqu'un composant est compromis."
  ],
  tech: [
    { h: "MAC contre DAC", p: [
      "Avec le <b>DAC</b> (Discretionary Access Control), le propriétaire d'un fichier décide qui peut y accéder. Avec le <b>MAC</b> (Mandatory Access Control) de SELinux, une politique centrale décide, pour chaque couple « domaine du processus / type de l'objet », des opérations autorisées. Tout ce qui n'est pas explicitement autorisé est refusé."
    ]},
    { h: "SELinux sur Android", p: [
      "Introduit en mode permissif avec Android 4.3, SELinux est appliqué en mode strict (<i>enforcing</i>) pour l'ensemble du système depuis Android 5. Chaque service système a son propre domaine ; les applications tierces s'exécutent dans <code>untrusted_app</code>. Des règles <code>neverallow</code> interdisent certaines configurations dangereuses, et la conformité est vérifiée lors de la certification des appareils."
    ]},
    { h: "Ce que l'on observe", p: [
      "Lorsqu'un accès est refusé, le noyau journalise un message contenant <code>avc: denied</code>. En laboratoire, ces journaux aident à comprendre le comportement d'une application. Sur un appareil de production, SELinux doit toujours être en mode <b>Enforcing</b>."
    ]}
  ],
  fig: "selinux",
  steps: [
    "Sur un appareil de test qui vous appartient, installez les outils ADB officiels (module 9, leçon 7).",
    "Activez le débogage USB dans les options pour les développeurs et connectez l'appareil.",
    "Exécutez <code>adb shell getenforce</code>.",
    "Vérifiez que la réponse est <code>Enforcing</code>.",
    "Désactivez le débogage USB une fois la vérification terminée."
  ],
  result: "La commande renvoie « Enforcing » : la politique SELinux est appliquée.",
  caution: "Un appareil commercial ne doit jamais être en mode « Permissive ». Si c'est le cas, il a probablement été modifié : ne l'utilisez pas pour des données sensibles.",
  ex: [
    "Une faille dans un service multimédia permet d'exécuter du code dans ce service. Grâce à SELinux, ce code reste confiné dans le domaine du service et ne peut pas lire les données des applications.",
    "Certaines ROM non officielles passent SELinux en mode permissif pour « résoudre des bugs » : elles suppriment ainsi une protection majeure."
  ],
  err: [
    ["Installer une ROM ou un noyau qui désactive SELinux.", "Refusez toute modification qui passe SELinux en mode permissif."],
    ["Laisser le débogage USB actif après un contrôle.", "Désactivez-le systématiquement après usage."],
    ["Croire que SELinux remplace les permissions Android.", "Les deux mécanismes sont complémentaires : SELinux protège le système, les permissions protègent vos données."]
  ],
  reco: [
    "Ajoutez la vérification de SELinux à votre grille d'audit (module 9).",
    "Dans une flotte professionnelle, considérez un appareil en mode permissif comme compromis.",
    "Pour aller plus loin, consultez la page « SELinux in Android » sur source.android.com."
  ],
  sum: "SELinux impose une politique de contrôle d'accès obligatoire : tout ce qui n'est pas autorisé est refusé. Appliqué strictement depuis Android 5, il confine chaque service et chaque application, limitant l'impact d'une compromission. Un appareil sain doit afficher « Enforcing ».",
  quiz: [
    { q: "Quelle est la différence essentielle entre DAC et MAC ?", o: ["Le MAC est réservé aux iPhone", "Avec le MAC, une politique centrale décide des accès, indépendamment du propriétaire", "Le DAC chiffre les fichiers", "Il n'y en a aucune"], a: 1, e: "Le MAC impose une politique globale que même un processus privilégié ne peut contourner." },
    { q: "Quelle réponse attend-on de la commande adb shell getenforce sur un appareil sain ?", o: ["Permissive", "Disabled", "Enforcing", "Unknown"], a: 2, e: "Enforcing signifie que la politique SELinux est appliquée." },
    { q: "Que signifie un message « avc: denied » dans les journaux ?", o: ["La batterie est faible", "SELinux a refusé un accès non autorisé par la politique", "Le Wi-Fi est coupé", "Une mise à jour est disponible"], a: 1, e: "Ces messages tracent les accès refusés par SELinux." }
  ]
},
/* ---------------------------------------------------------------- 1.7 */
{
  obj: "Expliquer la chaîne de confiance du démarrage vérifié (Android Verified Boot), interpréter les états de démarrage et comprendre le rôle du verrouillage du bootloader.",
  intro: [
    "Comment être sûr que le système qui démarre est bien celui prévu par l'éditeur, et non une version modifiée par un attaquant ? C'est le rôle du démarrage vérifié.",
    "Cette notion est centrale pour la suite de la formation : l'installation de GrapheneOS consiste justement à déverrouiller puis reverrouiller le bootloader avec une nouvelle clé de confiance."
  ],
  tech: [
    { h: "La chaîne de confiance", p: [
      "Au démarrage, un code gravé dans le processeur (la <b>Boot ROM</b>) vérifie la signature du <b>bootloader</b>. Celui-ci vérifie à son tour la structure <b>vbmeta</b>, qui contient les signatures et empreintes des partitions <code>boot</code>, <code>system</code>, <code>vendor</code>, etc. Les grandes partitions sont ensuite vérifiées bloc par bloc pendant leur lecture grâce à <b>dm-verity</b>. Si une vérification échoue, l'appareil refuse de démarrer ou affiche un avertissement."
    ]},
    { h: "Protection contre le retour en arrière", p: [
      "Android Verified Boot 2.0 (AVB), introduit avec Android 8, intègre une <b>protection anti-rollback</b> : l'appareil refuse une ancienne version signée mais vulnérable, ce qui empêche un attaquant de réinstaller un système dont les failles sont connues."
    ]},
    { h: "Les états de démarrage", ul: [
      "<b>Vert</b> : bootloader verrouillé, système signé avec la clé d'origine du fabricant.",
      "<b>Jaune</b> : bootloader verrouillé avec une clé personnalisée enregistrée par l'utilisateur ; un avertissement indique l'empreinte de cette clé. C'est le cas de GrapheneOS correctement installé.",
      "<b>Orange</b> : bootloader déverrouillé ; l'intégrité du système n'est plus garantie.",
      "<b>Rouge</b> : la vérification a échoué ; le système est corrompu ou modifié."
    ]}
  ],
  fig: "boot-chain",
  steps: [
    "Redémarrez votre téléphone et observez attentivement le premier écran.",
    "Aucun avertissement ne s'affiche : l'appareil est très probablement dans l'état vert.",
    "Un message signale un bootloader déverrouillé (état orange) : l'appareil n'est pas protégé contre la modification du système.",
    "Un message signale un système d'exploitation différent avec une empreinte de clé (état jaune) : vérifiez que cette empreinte correspond à celle de l'éditeur légitime (module 6, étape 17).",
    "En cas de doute, la commande <code>adb shell getprop ro.boot.verifiedbootstate</code> renvoie <code>green</code>, <code>yellow</code> ou <code>orange</code>."
  ],
  result: "Vous connaissez l'état de démarrage de votre appareil et savez l'interpréter.",
  ex: [
    "Un téléphone d'occasion affiche au démarrage un avertissement de bootloader déverrouillé : son système a pu être modifié par le vendeur. Il faut le réinitialiser avec une image officielle et reverrouiller le bootloader avant usage.",
    "Un voleur ne peut pas installer un système modifié sur un appareil au bootloader verrouillé sans effacer toutes les données."
  ],
  err: [
    ["Ignorer l'avertissement orange au démarrage.", "Un bootloader déverrouillé en usage quotidien annule la protection du démarrage vérifié : reverrouillez-le avec un système officiel."],
    ["Laisser le bootloader déverrouillé après avoir installé un autre système.", "Si le système le permet (cas de GrapheneOS), reverrouillez toujours le bootloader."],
    ["Confondre l'avertissement jaune avec une infection.", "L'état jaune est normal pour un système tiers signé, à condition de vérifier l'empreinte de la clé."]
  ],
  reco: [
    "N'achetez pas un téléphone d'occasion dont le bootloader est déverrouillé sans le réinitialiser entièrement.",
    "Intégrez l'état de démarrage à vos audits réguliers.",
    "Gardez à l'esprit que le déverrouillage du bootloader efface toutes les données : c'est une protection, pas un défaut."
  ],
  sum: "Le démarrage vérifié construit une chaîne de confiance de la Boot ROM jusqu'au système, avec protection anti-rollback. Les états vert, jaune, orange et rouge renseignent sur l'intégrité du système. Un bootloader verrouillé est indispensable à cette protection.",
  quiz: [
    { q: "Que signifie l'état de démarrage orange ?", o: ["Batterie faible", "Bootloader déverrouillé, intégrité non garantie", "Système d'origine vérifié", "Mise à jour en cours"], a: 1, e: "L'état orange indique un bootloader déverrouillé." },
    { q: "Quel est l'état attendu pour GrapheneOS correctement installé et reverrouillé ?", o: ["Vert", "Jaune", "Orange", "Rouge"], a: 1, e: "Le bootloader est verrouillé avec une clé personnalisée : l'appareil affiche l'état jaune avec l'empreinte de la clé." },
    { q: "À quoi sert la protection anti-rollback ?", o: ["À empêcher l'installation d'une ancienne version vulnérable", "À sauvegarder les photos", "À accélérer le démarrage", "À désactiver le Wi-Fi"], a: 0, e: "Elle empêche de revenir à une version signée mais dont les failles sont connues." }
  ]
},
/* ---------------------------------------------------------------- 1.8 */
{
  obj: "Comprendre le rôle d'Android Keystore, de l'environnement d'exécution de confiance (TEE) et de la puce sécurisée dans la protection des clés cryptographiques et du code de verrouillage.",
  intro: [
    "Les clés cryptographiques sont les secrets les plus précieux d'un téléphone : elles protègent vos paiements, vos connexions, vos données chiffrées. Si elles pouvaient être copiées, toute la sécurité s'effondrerait.",
    "Android les place donc, autant que possible, dans des composants matériels isolés du système principal."
  ],
  tech: [
    { h: "TEE et puce sécurisée", p: [
      "Le <b>TEE</b> (Trusted Execution Environment) est un environnement isolé, exécuté par le processeur principal mais séparé matériellement d'Android. Certains appareils disposent en plus d'une <b>puce sécurisée dédiée</b> (StrongBox, disponible depuis Android 9), comme la puce Titan M2 des Pixel récents. Même si Android est compromis, les clés qui s'y trouvent ne peuvent pas être extraites."
    ]},
    { h: "Android Keystore et KeyMint", p: [
      "Les applications utilisent l'API <b>Android Keystore</b> pour créer et utiliser des clés. Les opérations sont exécutées par <b>KeyMint</b> (successeur de Keymaster depuis Android 12) dans le TEE ou la puce sécurisée. L'application reçoit uniquement le résultat : la clé privée n'est jamais exportée.",
      "Une clé peut être liée à l'authentification de l'utilisateur : elle n'est utilisable qu'après un déverrouillage récent ou une validation biométrique."
    ]},
    { h: "Attestation et limitation des essais", p: [
      "L'<b>attestation de clé</b> permet de prouver, par un certificat signé par le matériel, qu'une clé est bien protégée et que l'appareil est dans un état donné. C'est ce mécanisme qu'utilise l'application Auditor pour vérifier une installation de GrapheneOS.",
      "Le code de verrouillage est lui aussi vérifié par des composants sécurisés qui imposent des <b>délais croissants</b> entre les essais, rendant l'attaque par force brute impraticable."
    ]}
  ],
  fig: "keystore",
  steps: [
    "Ouvrez <b>Paramètres › Sécurité</b> (ou <b>Sécurité et confidentialité</b>).",
    "Cherchez une rubrique du type <b>Chiffrement et identifiants</b> ou <b>Autres paramètres de sécurité</b>.",
    "Ouvrez <b>Type de stockage</b> : la mention « Intégré au matériel » indique que les identifiants sont protégés par le matériel.",
    "Consultez <b>Identifiants de confiance</b> et <b>Identifiants utilisateur</b> : supprimez tout certificat utilisateur que vous n'avez pas installé vous-même."
  ],
  result: "Vous savez si votre appareil protège les clés par le matériel et vous avez vérifié l'absence de certificats inconnus.",
  ex: [
    "Une application bancaire génère une clé dans le Keystore lors de l'enrôlement ; chaque opération sensible est signée par le matériel après validation de votre empreinte.",
    "Un certificat d'autorité installé à votre insu permettrait d'intercepter certaines connexions chiffrées : c'est une technique utilisée par certains logiciels de surveillance."
  ],
  err: [
    ["Installer un certificat d'autorité demandé par un site ou une application inconnue.", "N'installez de certificat que sur instruction de votre service informatique, pour un appareil professionnel géré."],
    ["Penser que la biométrie stocke votre empreinte « sur Internet ».", "Les données biométriques sont traitées localement dans un environnement isolé et ne quittent pas l'appareil."],
    ["Choisir un appareil sans protection matérielle pour des usages sensibles.", "Privilégiez un appareil récent disposant d'une puce sécurisée."]
  ],
  reco: [
    "Pour un usage professionnel ou sensible, choisissez un appareil disposant d'une puce sécurisée dédiée.",
    "Vérifiez régulièrement la liste des certificats utilisateur.",
    "Retenez que la qualité du code de verrouillage reste déterminante : le matériel limite les essais, mais un code évident peut être deviné en peu de tentatives."
  ],
  sum: "Android Keystore confie les clés au TEE ou à une puce sécurisée via KeyMint ; elles ne sont jamais exportées. L'attestation prouve l'état de l'appareil et la limitation matérielle des essais protège le code de verrouillage. Les certificats utilisateur inconnus doivent être supprimés.",
  quiz: [
    { q: "Où sont exécutées les opérations cryptographiques d'Android Keystore sur un appareil moderne ?", o: ["Dans le cloud de Google", "Dans le TEE ou une puce sécurisée", "Dans la carte SIM uniquement", "Dans l'application elle-même"], a: 1, e: "KeyMint s'exécute dans un environnement matériel isolé." },
    { q: "À quoi sert l'attestation de clé ?", o: ["À prouver qu'une clé est protégée par le matériel et à décrire l'état de l'appareil", "À accélérer le Wi-Fi", "À sauvegarder les contacts", "À désactiver la biométrie"], a: 0, e: "L'attestation fournit un certificat signé par le matériel ; Auditor s'en sert pour vérifier GrapheneOS." },
    { q: "Un certificat utilisateur que vous n'avez pas installé apparaît dans les identifiants. Que faire ?", o: ["Le laisser, il est sans risque", "Le supprimer et rechercher l'application responsable", "Redémarrer simplement", "Désactiver le Bluetooth"], a: 1, e: "Un certificat inconnu peut permettre l'interception de connexions chiffrées." }
  ]
},
/* ---------------------------------------------------------------- 1.9 */
{
  obj: "Comprendre comment Android chiffre les données stockées, distinguer les états avant et après le premier déverrouillage, et en tirer des règles pratiques.",
  intro: [
    "Si quelqu'un met la main sur votre téléphone éteint et extrait sa mémoire, que peut-il lire ? Grâce au chiffrement, en principe rien d'exploitable, à condition que votre code de verrouillage soit solide.",
    "Cette leçon explique ce qui est chiffré, quand les clés sont disponibles, et pourquoi un simple redémarrage peut renforcer votre protection."
  ],
  tech: [
    { h: "Le chiffrement basé sur les fichiers (FBE)", p: [
      "Les appareils lancés avec Android 10 ou une version ultérieure doivent utiliser le <b>chiffrement basé sur les fichiers</b>. Chaque fichier est chiffré avec des clés dérivées de votre code de verrouillage et d'un secret matériel. Les métadonnées du système de fichiers sont également chiffrées."
    ]},
    { h: "Deux types de stockage", ul: [
      "<b>Stockage chiffré par l'appareil (DE)</b> : disponible dès le démarrage, pour les fonctions essentielles comme le réveil ou l'appel d'urgence (mode Direct Boot).",
      "<b>Stockage chiffré par les identifiants (CE)</b> : contient la grande majorité de vos données, et n'est déchiffrable qu'après la saisie de votre code."
    ]},
    { h: "BFU et AFU", p: [
      "Après un redémarrage et avant toute saisie du code, l'appareil est dans l'état <b>BFU</b> (Before First Unlock) : les clés CE ne sont pas en mémoire. Après le premier déverrouillage, il passe en état <b>AFU</b> (After First Unlock) : les clés restent disponibles en mémoire même lorsque l'écran est verrouillé. Les techniques d'extraction avancées sont nettement plus efficaces en état AFU. Redémarrer un appareil avant une situation à risque (passage d'une frontière, garde à vue, dépôt en réparation) le remet en état BFU."
    ]}
  ],
  fig: "encryption",
  steps: [
    "Vérifiez qu'un code de verrouillage est défini : sans code, le chiffrement ne protège presque rien.",
    "Ouvrez <b>Paramètres › Sécurité › Chiffrement et identifiants</b> (libellé variable) et vérifiez la mention <b>Chiffré</b> ou <b>Téléphone chiffré</b>.",
    "Repérez dans votre quotidien les situations à risque où un redémarrage est utile.",
    "Avant une telle situation, éteignez ou redémarrez l'appareil sans le déverrouiller ensuite.",
    "Sur GrapheneOS, configurez le redémarrage automatique après inactivité (module 7)."
  ],
  result: "Votre appareil est chiffré, protégé par un code, et vous savez le remettre en état BFU.",
  ex: [
    "Un téléphone volé allumé et verrouillé est en état AFU : un attaquant disposant d'outils spécialisés a davantage de possibilités que sur un appareil éteint.",
    "Lors d'un dépôt en réparation, éteindre le téléphone et, mieux, sauvegarder puis réinitialiser l'appareil protège vos données."
  ],
  err: [
    ["Ne pas définir de code de verrouillage.", "Sans code, les clés ne dépendent d'aucun secret utilisateur : définissez au minimum un PIN de 6 chiffres aléatoires."],
    ["Croire que le chiffrement protège un téléphone déverrouillé.", "Une fois l'écran déverrouillé, les données sont accessibles : verrouillez toujours l'appareil."],
    ["Ne jamais redémarrer son téléphone.", "Redémarrez régulièrement et avant toute situation à risque."]
  ],
  reco: [
    "Combinez un code robuste, le verrouillage automatique rapide et des redémarrages réguliers.",
    "Pour un usage professionnel, imposez un délai de verrouillage court via la gestion de flotte.",
    "Sauvegardez vos données de façon chiffrée : le chiffrement de l'appareil ne protège pas vos sauvegardes externes."
  ],
  sum: "Android chiffre les fichiers et leurs métadonnées avec des clés dérivées du code et d'un secret matériel. Le stockage CE n'est accessible qu'après le premier déverrouillage. L'état BFU, obtenu par un redémarrage, offre la meilleure protection contre l'extraction.",
  quiz: [
    { q: "Que signifie l'état BFU ?", o: ["Batterie entièrement chargée", "Avant le premier déverrouillage depuis le démarrage", "Bluetooth activé", "Bootloader déverrouillé"], a: 1, e: "Before First Unlock : les clés des données utilisateur ne sont pas encore en mémoire." },
    { q: "Quel geste simple remet l'appareil dans l'état le plus protégé contre l'extraction ?", o: ["Activer le mode avion", "Redémarrer sans déverrouiller", "Baisser la luminosité", "Fermer toutes les applications"], a: 1, e: "Le redémarrage efface les clés CE de la mémoire." },
    { q: "Pourquoi le code de verrouillage est-il essentiel au chiffrement ?", o: ["Il sert à dériver les clés qui protègent les données", "Il accélère le processeur", "Il active le GPS", "Il n'a aucun lien"], a: 0, e: "Les clés du stockage CE dépendent du code de l'utilisateur et d'un secret matériel." }
  ]
},
/* ---------------------------------------------------------------- 1.10 */
{
  obj: "Comprendre le cycle de publication des correctifs de sécurité Android, savoir lire un niveau de correctif et évaluer la durée de support d'un appareil.",
  intro: [
    "Chaque mois, des dizaines de vulnérabilités sont corrigées dans Android et dans les composants des fabricants de puces. Un appareil qui ne reçoit plus ces correctifs devient progressivement vulnérable, même si vous ne changez rien à vos habitudes.",
    "Les mises à jour sont la mesure de sécurité la plus efficace et la plus simple à appliquer."
  ],
  tech: [
    { h: "Les bulletins de sécurité", p: [
      "Google publie chaque mois l'<b>Android Security Bulletin</b>, qui liste les vulnérabilités corrigées, leur gravité et le niveau de correctif correspondant, exprimé sous forme de date (par exemple <code>2026-10-01</code> ou <code>2026-10-05</code>). Les fabricants publient leurs propres bulletins pour leurs composants (Pixel, Samsung, etc.)."
    ]},
    { h: "Plusieurs canaux de mise à jour", ul: [
      "<b>Mises à jour système du fabricant</b> : noyau, pilotes, système complet.",
      "<b>Mises à jour système Google Play</b> (projet Mainline, depuis Android 10) : certains modules du système sont mis à jour indépendamment du fabricant.",
      "<b>Mises à jour des applications</b> via le magasin d'applications, y compris le navigateur et WebView, très exposés."
    ]},
    { h: "La durée de support", p: [
      "Chaque fabricant fixe une durée de support. Google garantit sept ans de mises à jour pour les Pixel à partir de la gamme Pixel 8. D'autres fabricants offrent des durées comparables sur leurs modèles haut de gamme, souvent moins sur l'entrée de gamme. Après la fin du support, plus aucune faille n'est corrigée."
    ]}
  ],
  fig: "update-cycle",
  steps: [
    "Ouvrez <b>Paramètres › Sécurité</b> ou <b>Paramètres › À propos du téléphone › Version d'Android</b>.",
    "Relevez la date de la <b>Mise à jour de sécurité Android</b>.",
    "Relevez également la date de la <b>Mise à jour du système Google Play</b> si elle est affichée.",
    "Comparez avec la date du jour : un retard de plus de deux ou trois mois doit vous alerter.",
    "Recherchez sur le site officiel du fabricant la date de fin de support de votre modèle."
  ],
  result: "Vous connaissez l'âge du dernier correctif installé et la date de fin de support de votre appareil.",
  ex: [
    "En novembre 2026, un téléphone affichant un correctif d'octobre 2026 est à jour. Un téléphone affichant un correctif de 2023 est exposé à toutes les failles publiées depuis.",
    "Un appareil peut recevoir des mises à jour système Google Play alors que son fabricant a cessé le support : ces mises à jour partielles ne remplacent pas les correctifs du noyau et des pilotes."
  ],
  err: [
    ["Reporter indéfiniment l'installation des mises à jour.", "Installez-les dès leur disponibilité, en programmant au besoin un redémarrage la nuit."],
    ["Croire qu'un appareil « qui fonctionne bien » n'a pas besoin d'être remplacé.", "Après la fin du support, le risque augmente chaque mois : planifiez son remplacement."],
    ["Mettre à jour le système mais pas les applications.", "Activez la mise à jour automatique des applications, en particulier du navigateur et de WebView."]
  ],
  reco: [
    "Ne confiez pas de données sensibles à un appareil qui ne reçoit plus de correctifs.",
    "À l'achat, privilégiez les modèles dont la durée de support restante est la plus longue.",
    "Consultez les bulletins officiels sur source.android.com pour comprendre les failles corrigées."
  ],
  sum: "Les correctifs Android sont publiés chaque mois et identifiés par une date. Ils arrivent par le fabricant, par les mises à jour système Google Play et par les mises à jour d'applications. Vérifier son niveau de correctif et connaître la date de fin de support de son appareil sont des réflexes indispensables.",
  quiz: [
    { q: "Comment est exprimé le niveau de correctif de sécurité Android ?", o: ["Par un nombre de points", "Par une date", "Par une couleur", "Par la version du Play Store"], a: 1, e: "Le niveau de correctif est une date, par exemple 2026-10-05." },
    { q: "Combien d'années de mises à jour Google garantit-il pour les Pixel à partir du Pixel 8 ?", o: ["2 ans", "3 ans", "5 ans", "7 ans"], a: 3, e: "Google annonce sept ans de support pour les Pixel 8 et modèles suivants." },
    { q: "Les mises à jour système Google Play suffisent-elles sur un appareil dont le fabricant a cessé le support ?", o: ["Oui, elles corrigent tout", "Non, elles ne couvrent pas le noyau ni les pilotes", "Oui, si l'appareil est récent", "Elles n'existent pas"], a: 1, e: "Elles ne mettent à jour que certains modules ; le noyau et les pilotes restent vulnérables." }
  ]
}
];
