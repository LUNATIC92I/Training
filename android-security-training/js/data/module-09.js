/* Module 9 : Audit et vérification de la sécurité
   Toutes les commandes ADB citées sont des commandes standard documentées
   (developer.android.com/tools/adb). Les exercices se pratiquent uniquement
   sur vos propres appareils ou dans un laboratoire autorisé. */
window.ASG = window.ASG || {}; ASG.content = ASG.content || {};
(function () {
var ETHICS = "<b>Cadre éthique et légal.</b> Ces exercices se réalisent uniquement sur vos appareils personnels ou dans un environnement de laboratoire autorisé. Accéder à l'appareil d'une autre personne sans son autorisation est illégal.";
ASG.content.m9 = [
/* ---------------------------------------------------------------- 9.1 */
{
  obj: "Vérifier la version d'Android d'un appareil, par l'interface puis par ADB, et l'évaluer au regard du support.",
  intro: [
    "Un audit commence toujours par l'inventaire : quel système, quelle version, quel état. La version d'Android conditionne les fonctions de sécurité disponibles.",
    "Ce premier exercice se fait d'abord sans outil, puis avec ADB pour les apprenants avancés."
  ],
  warn: ETHICS,
  tech: [
    "La version d'Android (par exemple 16) et le niveau d'API (par exemple 36) sont deux informations liées : le niveau d'API identifie précisément la version de la plateforme pour les développeurs. ADB permet de lire ces informations dans les propriétés du système avec <code>getprop</code>.",
    { h: "Propriétés utiles", ul: [
      "<code>ro.build.version.release</code> : version d'Android.",
      "<code>ro.build.version.sdk</code> : niveau d'API.",
      "<code>ro.product.model</code> : modèle de l'appareil.",
      "<code>ro.build.fingerprint</code> : empreinte de la version installée (fabricant, modèle, version, type de build)."
    ]}
  ],
  fig: "audit",
  steps: [
    "<b>Interface</b> : ouvrez <b>Paramètres › À propos du téléphone</b> et relevez la version d'Android et le modèle.",
    "<b>ADB</b> (appareil de test avec débogage USB activé) : exécutez <code>adb shell getprop ro.build.version.release</code>.",
    "Exécutez <code>adb shell getprop ro.build.version.sdk</code>.",
    "Exécutez <code>adb shell getprop ro.product.model</code>.",
    "Exécutez <code>adb shell getprop ro.build.fingerprint</code> et vérifiez que le type de build se termine par <code>release-keys</code> (build officiel signé).",
    "Consignez les résultats dans votre grille d'audit."
  ],
  result: "La version, le niveau d'API, le modèle et l'empreinte de build sont relevés et cohérents entre l'interface et ADB.",
  ex: [
    "Un appareil affiche Android 11 et un niveau d'API 30 : il ne bénéficie pas des protections introduites depuis Android 12 (position approximative, indicateurs de confidentialité, etc.).",
    "Une empreinte se terminant par <code>test-keys</code> sur un appareil de production signale un système non officiel."
  ],
  err: [
    ["« adb: command not found ».", "Installez les Platform Tools officiels (leçon 7) et ajoutez-les au chemin d'exécution, ou lancez la commande depuis leur dossier."],
    ["« unauthorized » dans <code>adb devices</code>.", "Déverrouillez le téléphone et acceptez la demande d'autorisation de l'ordinateur."],
    ["Résultats incohérents entre interface et ADB.", "Signalez l'anomalie : l'appareil a pu être modifié."]
  ],
  reco: [
    "Commencez chaque audit par cet inventaire.",
    "Désactivez le débogage USB à la fin de l'exercice."
  ],
  sum: "La version d'Android, le niveau d'API, le modèle et l'empreinte de build se lisent dans les Paramètres et via <code>adb shell getprop</code>. Une empreinte en release-keys indique un build officiel signé.",
  quiz: [
    { q: "Quelle propriété donne la version d'Android ?", o: ["ro.build.version.release", "ro.boot.serialno", "persist.sys.timezone", "ro.product.brand"], a: 0, e: "ro.build.version.release contient la version de la plateforme." },
    { q: "Que suggère une empreinte de build se terminant par test-keys sur un téléphone du commerce ?", o: ["Un build officiel", "Un système non officiel signé avec des clés de test", "Une mise à jour en cours", "Rien de particulier"], a: 1, e: "Les builds officiels sont signés avec des release-keys." }
  ]
},
/* ---------------------------------------------------------------- 9.2 */
{
  obj: "Vérifier le niveau de correctif de sécurité et le comparer aux bulletins officiels.",
  intro: [
    "Le niveau de correctif est l'indicateur le plus parlant de l'exposition d'un appareil aux failles connues. Cet exercice vous apprend à le relever et à l'interpréter comme un auditeur.",
    "Il complète la leçon 5 du module 3."
  ],
  warn: ETHICS,
  tech: [
    "Le niveau de correctif est stocké dans la propriété <code>ro.build.version.security_patch</code>. Il se compare au bulletin de sécurité Android du mois correspondant sur <code>source.android.com/docs/security/bulletin</code>, et, pour les Pixel, au bulletin Pixel.",
    "La propriété <code>ro.vendor.build.security_patch</code>, lorsqu'elle existe, indique le niveau de correctif de la partition du fabricant, qui peut différer."
  ],
  fig: "update-cycle",
  steps: [
    "<b>Interface</b> : relevez la date de la mise à jour de sécurité dans les Paramètres.",
    "<b>ADB</b> : exécutez <code>adb shell getprop ro.build.version.security_patch</code>.",
    "Exécutez <code>adb shell getprop ro.vendor.build.security_patch</code> et comparez.",
    "Calculez l'écart avec la date du jour.",
    "Ouvrez le bulletin du dernier mois et relevez le nombre de vulnérabilités critiques non couvertes si l'appareil est en retard.",
    "Notez votre conclusion : conforme (moins d'un mois), à surveiller (1 à 3 mois), non conforme (plus de 3 mois)."
  ],
  result: "Le niveau de correctif est relevé, comparé aux bulletins et classé.",
  ex: [
    "Le 1er novembre 2026, un appareil au niveau <code>2026-10-05</code> est classé conforme.",
    "Un appareil au niveau <code>2025-01-01</code> est classé non conforme : près de deux ans de vulnérabilités connues restent ouvertes."
  ],
  err: [
    ["La propriété vendor est vide.", "Elle n'existe pas sur tous les appareils : ne retenez alors que le niveau principal."],
    ["Confondre la date du bulletin et la date d'installation.", "Le niveau indique la date du bulletin couvert, pas la date d'installation."]
  ],
  reco: [
    "Fixez dans votre politique d'audit un écart maximal toléré (par exemple 60 jours).",
    "Pour une flotte, automatisez la collecte de cette information via l'outil de gestion des terminaux."
  ],
  sum: "Relevez <code>ro.build.version.security_patch</code> (et la propriété vendor si elle existe), comparez aux bulletins officiels et classez l'appareil en conforme, à surveiller ou non conforme selon l'écart.",
  quiz: [
    { q: "Quelle propriété contient le niveau de correctif de sécurité ?", o: ["ro.build.version.security_patch", "ro.product.model", "ro.boot.mode", "net.hostname"], a: 0, e: "Elle contient la date du bulletin couvert." },
    { q: "Un appareil a un correctif de plus de trois mois. Quel classement ?", o: ["Conforme", "Non conforme selon la grille proposée", "Excellent", "Sans importance"], a: 1, e: "Au-delà de trois mois, de nombreuses failles publiées restent ouvertes." }
  ]
},
/* ---------------------------------------------------------------- 9.3 */
{
  obj: "Contrôler méthodiquement les permissions accordées aux applications, par l'interface et par ADB.",
  intro: [
    "Le contrôle des permissions est au cœur de l'audit d'un téléphone. L'interface permet une revue visuelle ; ADB permet une revue exhaustive, application par application.",
    "Cet exercice s'appuie sur les leçons 5 du module 1 et 6 du module 3."
  ],
  warn: ETHICS,
  tech: [
    { h: "Commandes utiles", ul: [
      "<code>adb shell dumpsys package &lt;paquet&gt;</code> : informations détaillées sur une application, dont les permissions demandées et accordées (<code>granted=true</code>).",
      "<code>adb shell appops get &lt;paquet&gt;</code> : état des opérations sensibles (AppOps) de l'application.",
      "<code>adb shell settings get secure enabled_accessibility_services</code> : services d'accessibilité activés.",
      "<code>adb shell settings get secure enabled_notification_listeners</code> : applications ayant accès aux notifications.",
      "<code>adb shell dumpsys device_policy</code> : applications d'administration de l'appareil."
    ]}
  ],
  fig: "permissions",
  steps: [
    "<b>Interface</b> : passez en revue le gestionnaire d'autorisations et les accès spéciaux (module 3, leçon 6).",
    "<b>ADB</b> : exécutez <code>adb shell settings get secure enabled_accessibility_services</code> et identifiez chaque service listé.",
    "Exécutez <code>adb shell settings get secure enabled_notification_listeners</code>.",
    "Exécutez <code>adb shell dumpsys device_policy</code> et repérez les administrateurs actifs.",
    "Pour une application suspecte, exécutez <code>adb shell dumpsys package &lt;paquet&gt;</code> et relevez les permissions accordées.",
    "Consignez toute permission sensible non justifiée."
  ],
  result: "Toutes les permissions sensibles, services d'accessibilité, accès aux notifications et administrateurs sont identifiés et justifiés.",
  ex: [
    "La commande sur l'accessibilité révèle un service appartenant à une application « Battery Saver » inconnue : signal fort de malware ou de stalkerware.",
    "<code>dumpsys device_policy</code> montre une application de gestion professionnelle légitime sur un appareil d'entreprise : c'est attendu."
  ],
  err: [
    ["Sortie de <code>dumpsys</code> trop longue pour être lue.", "Redirigez-la vers un fichier (<code>adb shell dumpsys package &lt;paquet&gt; &gt; paquet.txt</code>) et recherchez « granted=true »."],
    ["Désactiver un service sans identifier l'application.", "Identifiez d'abord le paquet, puis décidez."]
  ],
  reco: [
    "Commencez par les accès les plus puissants : accessibilité, notifications, administration.",
    "Archivez les résultats pour comparer lors du prochain audit."
  ],
  sum: "L'audit des permissions combine la revue visuelle et des commandes ADB : services d'accessibilité, accès aux notifications, administrateurs de l'appareil, puis permissions détaillées par application avec dumpsys et appops.",
  quiz: [
    { q: "Quelle commande liste les services d'accessibilité activés ?", o: ["adb shell settings get secure enabled_accessibility_services", "adb reboot", "adb shell ls /sdcard", "adb devices"], a: 0, e: "Ce réglage sécurisé contient la liste des services actifs." },
    { q: "Dans la sortie de dumpsys package, quelle mention indique une permission accordée ?", o: ["granted=true", "enabled=false", "visible=yes", "allowed=maybe"], a: 0, e: "Les permissions accordées sont marquées granted=true." }
  ]
},
/* ---------------------------------------------------------------- 9.4 */
{
  obj: "Réaliser l'inventaire complet des applications installées et de leur provenance.",
  intro: [
    "On ne protège bien que ce que l'on connaît. L'inventaire des applications, avec leur source d'installation, est la base de l'identification des applications suspectes.",
    "ADB permet un inventaire exhaustif, y compris des applications masquées du lanceur."
  ],
  warn: ETHICS,
  tech: [
    { h: "Commandes utiles", ul: [
      "<code>adb shell pm list packages -3</code> : applications tierces installées.",
      "<code>adb shell pm list packages -s</code> : applications système.",
      "<code>adb shell pm list packages -d</code> : applications désactivées.",
      "<code>adb shell pm list packages -i -3</code> : applications tierces avec leur installateur (par exemple le Play Store, l'App Store de GrapheneOS, ou un gestionnaire de fichiers en cas d'installation manuelle)."
    ]}
  ],
  fig: "audit",
  steps: [
    "<b>Interface</b> : <b>Paramètres › Applications › Voir toutes les applications</b>, incluez les applications système si l'option existe.",
    "<b>ADB</b> : exécutez <code>adb shell pm list packages -3</code> et enregistrez la liste dans un fichier.",
    "Exécutez <code>adb shell pm list packages -i -3</code> et relevez l'installateur de chaque application.",
    "Identifiez les applications installées par un gestionnaire de fichiers, un navigateur ou une messagerie (installation manuelle).",
    "Identifiez les applications sans icône dans le lanceur.",
    "Classez chaque application : légitime et utile, légitime mais inutile, inconnue."
  ],
  result: "Un inventaire complet, avec la provenance de chaque application, est disponible.",
  ex: [
    "L'inventaire révèle une application installée par la messagerie : elle provient d'un APK reçu, à examiner en priorité.",
    "Une application sans icône dans le lanceur correspond à un service légitime d'un fabricant : elle est documentée comme telle."
  ],
  err: [
    ["Se limiter aux icônes visibles.", "Utilisez la liste complète de l'interface ou ADB."],
    ["Supprimer des applications système à la légère.", "Ne touchez pas aux applications système sans comprendre leur rôle."]
  ],
  reco: [
    "Conservez l'inventaire daté pour le comparer au suivant.",
    "Profitez de l'inventaire pour supprimer les applications inutiles."
  ],
  sum: "<code>pm list packages</code> avec les options -3, -s, -d et -i permet d'inventorier toutes les applications et leur installateur. Les installations manuelles et les applications sans icône méritent une attention particulière.",
  quiz: [
    { q: "Quelle option de pm list packages affiche l'installateur ?", o: ["-i", "-z", "-q", "-x"], a: 0, e: "L'option -i ajoute l'installateur de chaque paquet." },
    { q: "Quelle option liste uniquement les applications tierces ?", o: ["-3", "-s", "-d", "-a"], a: 0, e: "L'option -3 filtre les applications tierces." }
  ]
},
/* ---------------------------------------------------------------- 9.5 */
{
  obj: "Identifier les applications suspectes à partir d'indicateurs objectifs et décider de la réponse adaptée.",
  intro: [
    "Après l'inventaire, il faut repérer les applications qui méritent une analyse. Il ne s'agit pas de soupçonner tout le monde, mais d'appliquer des critères objectifs.",
    "Cet exercice combine les résultats des leçons 3 et 4."
  ],
  warn: ETHICS,
  tech: [
    { h: "Indicateurs de suspicion", ul: [
      "Installation manuelle depuis une source non identifiée.",
      "Accès à l'accessibilité, aux notifications ou à l'administration sans justification.",
      "Nom générique (« Service », « System Update ») ou imitant une application système.",
      "Absence d'icône dans le lanceur.",
      "Consommation anormale de batterie ou de données en arrière-plan.",
      "Éditeur introuvable ou sans site officiel."
    ]},
    { h: "Grille de décision", p: [
      "Un indicateur isolé justifie une vérification. Deux indicateurs ou plus justifient la désinstallation, ou une analyse approfondie si l'appareil est un élément de preuve. En cas de suspicion de logiciel espion dans un contexte de violence, reportez-vous à la leçon 2 du module 2 avant toute action."
    ]}
  ],
  fig: "apk-check",
  steps: [
    "Reprenez l'inventaire et l'audit des permissions.",
    "Pour chaque application, comptez les indicateurs de suspicion présents.",
    "Recherchez l'éditeur et le nom du paquet sur des sources fiables.",
    "Consultez la consommation de batterie et de données de l'application dans les Paramètres.",
    "Appliquez la grille de décision et consignez la décision.",
    "Pour désinstaller : <b>Paramètres › Applications</b> ; si l'application est administratrice, retirez d'abord ce droit."
  ],
  result: "Chaque application suspecte est identifiée, analysée et traitée selon une grille objective.",
  ex: [
    "« Device Health » : installée par une messagerie, sans icône, avec l'accessibilité et l'accès aux notifications : trois indicateurs, désinstallation après documentation.",
    "Une application bancaire légitime dispose de l'accès aux notifications pour une fonction documentée : un seul indicateur, justifié."
  ],
  err: [
    ["Désinstaller une application qui empêche sa suppression sans retirer ses droits d'administration.", "Retirez d'abord le droit d'administration, ou utilisez le mode sans échec."],
    ["Supprimer une preuve dans un contexte judiciaire.", "Documentez (captures, inventaire) avant toute suppression."]
  ],
  reco: [
    "Documentez systématiquement les raisons de chaque décision.",
    "Après la suppression d'une application malveillante, changez les mots de passe depuis un appareil sain."
  ],
  sum: "Une application est suspecte selon des indicateurs objectifs : installation manuelle, accès puissants, nom trompeur, absence d'icône, consommation anormale, éditeur inconnu. Une grille de décision permet de réagir de façon proportionnée et documentée.",
  quiz: [
    { q: "Combien d'indicateurs justifient la désinstallation selon la grille proposée ?", o: ["Un seul, toujours", "Deux ou plus", "Cinq minimum", "Aucun"], a: 1, e: "Un indicateur isolé justifie une vérification, plusieurs justifient l'action." },
    { q: "Que faire avant de désinstaller une application administratrice de l'appareil ?", o: ["Lui retirer le droit d'administration", "Redémarrer en mode avion", "Augmenter le volume", "Rien"], a: 0, e: "Une application administratrice peut bloquer sa désinstallation." }
  ]
},
/* ---------------------------------------------------------------- 9.6 */
{
  obj: "Vérifier l'état du bootloader et du démarrage vérifié, par l'écran de démarrage, le mode Fastboot et ADB.",
  intro: [
    "Un bootloader déverrouillé sur un appareil de production est un écart de sécurité majeur. Cet exercice vous apprend à le détecter par plusieurs méthodes.",
    "Il s'appuie sur la leçon 7 du module 1."
  ],
  warn: ETHICS,
  tech: [
    { h: "Trois méthodes", ul: [
      "<b>Écran de démarrage</b> : un avertissement signale un bootloader déverrouillé (orange) ou un système tiers (jaune).",
      "<b>Mode Fastboot</b> : la ligne <b>Device state</b> indique <code>locked</code> ou <code>unlocked</code>.",
      "<b>ADB</b> : <code>adb shell getprop ro.boot.verifiedbootstate</code> renvoie <code>green</code>, <code>yellow</code> ou <code>orange</code> ; <code>adb shell getprop ro.boot.vbmeta.device_state</code> renvoie <code>locked</code> ou <code>unlocked</code>."
    ]},
    "Pour GrapheneOS, l'outil le plus fiable reste l'attestation avec Auditor, qui repose sur le matériel et non sur des informations fournies par le système lui-même."
  ],
  fig: "boot-chain",
  steps: [
    "Redémarrez l'appareil et observez l'écran de démarrage.",
    "<b>ADB</b> : exécutez <code>adb shell getprop ro.boot.verifiedbootstate</code>.",
    "Exécutez <code>adb shell getprop ro.boot.vbmeta.device_state</code>.",
    "Exécutez <code>adb shell getenforce</code> pour vérifier SELinux.",
    "Pour un appareil sous GrapheneOS, réalisez une vérification avec Auditor depuis un second appareil.",
    "Consignez : état vert ou jaune avec bootloader verrouillé = conforme ; orange = non conforme."
  ],
  result: "L'état du bootloader et du démarrage vérifié est confirmé par au moins deux méthodes.",
  ex: [
    "Un appareil d'occasion renvoie <code>orange</code> et <code>unlocked</code> : il doit être réinstallé avec une image officielle et reverrouillé.",
    "Un appareil GrapheneOS renvoie <code>yellow</code> et <code>locked</code>, et Auditor confirme l'authenticité : conforme."
  ],
  err: [
    ["Se fier uniquement aux propriétés système sur un appareil potentiellement compromis.", "Un système compromis peut mentir : préférez l'attestation matérielle (Auditor) pour GrapheneOS."],
    ["Interpréter l'état jaune comme une anomalie.", "Il est normal pour un système tiers verrouillé ; vérifiez l'empreinte de la clé."]
  ],
  reco: [
    "Intégrez cette vérification à chaque audit.",
    "Pour les flottes sensibles, utilisez l'attestation matérielle de manière planifiée."
  ],
  sum: "L'état du bootloader se vérifie à l'écran de démarrage, en mode Fastboot (Device state) et avec getprop (verifiedbootstate, vbmeta.device_state). Pour GrapheneOS, l'attestation Auditor est la méthode la plus fiable.",
  quiz: [
    { q: "Quelle valeur de ro.boot.verifiedbootstate signale un bootloader déverrouillé ?", o: ["green", "yellow", "orange", "blue"], a: 2, e: "L'état orange correspond à un bootloader déverrouillé." },
    { q: "Pourquoi l'attestation matérielle est-elle plus fiable que getprop ?", o: ["Parce qu'elle repose sur le matériel, et non sur des informations fournies par un système éventuellement compromis", "Parce qu'elle est plus rapide", "Parce qu'elle est colorée", "Elle ne l'est pas"], a: 0, e: "Un système compromis pourrait falsifier ses propres propriétés." }
  ]
},
/* ---------------------------------------------------------------- 9.7 */
{
  obj: "Comprendre ce qu'est ADB, comment l'installer depuis la source officielle et comment l'utiliser de façon sûre.",
  intro: [
    "ADB (Android Debug Bridge) est l'outil officiel de communication entre un ordinateur et un appareil Android. Il est indispensable pour l'audit avancé, mais il ouvre aussi un accès puissant à l'appareil.",
    "Il faut donc savoir l'utiliser, et savoir le refermer."
  ],
  warn: ETHICS,
  tech: [
    { h: "Le fonctionnement", p: [
      "ADB est un outil client-serveur : un client et un serveur s'exécutent sur l'ordinateur, et un démon (<code>adbd</code>) sur l'appareil. La connexion n'est possible que si le <b>débogage USB</b> est activé et si l'utilisateur a <b>autorisé l'empreinte de la clé</b> de l'ordinateur, affichée sur le téléphone lors de la première connexion."
    ]},
    { h: "Installation", p: [
      "ADB fait partie des <b>Android SDK Platform Tools</b>, téléchargeables sur <code>developer.android.com/tools/releases/platform-tools</code>. Certains gestionnaires de paquets Linux les proposent également."
    ]},
    { h: "Commandes de base", ul: [
      "<code>adb devices</code> : liste les appareils connectés et leur état.",
      "<code>adb shell</code> : ouvre un interpréteur de commandes sur l'appareil.",
      "<code>adb kill-server</code> : arrête le serveur ADB de l'ordinateur."
    ]}
  ],
  fig: "audit",
  steps: [
    "Téléchargez les Platform Tools depuis la page officielle et décompressez l'archive.",
    "Sur l'appareil de test, activez les options pour les développeurs puis le <b>Débogage USB</b>.",
    "Connectez l'appareil et exécutez <code>adb devices</code>.",
    "Sur le téléphone, vérifiez l'empreinte affichée et autorisez l'ordinateur (sans cocher « toujours autoriser » sur un ordinateur partagé).",
    "Exécutez de nouveau <code>adb devices</code> : l'état doit être <code>device</code>.",
    "À la fin, exécutez <code>adb kill-server</code>, désactivez le débogage USB et, dans les options pour les développeurs, utilisez <b>Révoquer les autorisations de débogage USB</b>."
  ],
  result: "Vous savez installer ADB, établir une connexion autorisée et la refermer proprement.",
  caution: "Ne laissez jamais le débogage USB activé sur un appareil en usage quotidien, et n'autorisez jamais un ordinateur que vous ne contrôlez pas.",
  ex: [
    "Un technicien de réparation obtient un accès ADB autorisé « temporairement » : sans révocation, l'ordinateur reste autorisé.",
    "Un auditeur révoque systématiquement les autorisations à la fin de chaque session."
  ],
  err: [
    ["Télécharger ADB depuis un site tiers.", "Utilisez exclusivement la page officielle Android Developers."],
    ["Autoriser un ordinateur inconnu.", "Refusez la demande d'autorisation."],
    ["Laisser l'autorisation permanente après l'audit.", "Révoquez les autorisations de débogage USB."]
  ],
  reco: [
    "Utilisez un ordinateur dédié et sain pour l'audit.",
    "Documentez chaque session ADB : date, appareil, commandes exécutées."
  ],
  sum: "ADB relie un ordinateur à un appareil Android via le débogage USB et une autorisation explicite. Installez-le depuis les Platform Tools officiels, vérifiez l'empreinte de l'ordinateur, et refermez l'accès en fin de session (kill-server, désactivation, révocation).",
  quiz: [
    { q: "Où télécharger ADB de façon fiable ?", o: ["Sur la page officielle des Platform Tools d'Android Developers", "Sur un forum", "Dans un e-mail", "Sur un site de téléchargement générique"], a: 0, e: "La source officielle garantit l'authenticité de l'outil." },
    { q: "Que faire à la fin d'une session d'audit ?", o: ["Laisser le débogage actif", "Désactiver le débogage USB et révoquer les autorisations", "Installer Google Play", "Déverrouiller le bootloader"], a: 1, e: "L'accès ADB est puissant : il doit être refermé." }
  ]
},
/* ---------------------------------------------------------------- 9.8 */
{
  obj: "Collecter et analyser les journaux système (logcat) dans un environnement de laboratoire.",
  intro: [
    "Les journaux système enregistrent ce qui se passe sur l'appareil : démarrage d'applications, erreurs, refus SELinux, connexions. Leur analyse permet de comprendre le comportement d'une application ou de rechercher des traces d'activité suspecte.",
    "Cet exercice se fait en laboratoire, sur un appareil de test."
  ],
  warn: ETHICS,
  tech: [
    { h: "Les outils", ul: [
      "<code>adb logcat</code> : affiche les journaux en continu.",
      "<code>adb logcat -d</code> : affiche le contenu actuel du tampon puis s'arrête.",
      "<code>adb logcat -b events</code> : tampon des événements système.",
      "<code>adb bugreport</code> : produit une archive complète de diagnostic (journaux, état du système). Elle contient beaucoup d'informations personnelles et doit être manipulée avec précaution."
    ]},
    { h: "Ce que l'on peut rechercher", p: [
      "Les refus SELinux (<code>avc: denied</code>), les plantages d'applications (<code>FATAL EXCEPTION</code>), le démarrage de services par une application, ou des tentatives répétées d'accès à des ressources. Les journaux sont volumineux : il faut filtrer."
    ]}
  ],
  fig: "selinux",
  steps: [
    "Sur un appareil de test, connectez ADB (leçon 7).",
    "Exécutez <code>adb logcat -d &gt; journal.txt</code> pour enregistrer le tampon actuel.",
    "Recherchez les refus SELinux dans le fichier (par exemple avec la fonction de recherche de votre éditeur, motif <code>avc: denied</code>).",
    "Lancez une application de test, puis enregistrez de nouveau les journaux et recherchez son nom de paquet.",
    "Recherchez les plantages avec le motif <code>FATAL EXCEPTION</code>.",
    "Supprimez les fichiers de journaux à la fin de l'exercice s'ils contiennent des données personnelles."
  ],
  result: "Vous savez extraire, filtrer et interpréter les journaux d'un appareil de test.",
  ex: [
    "Une application de test génère des refus SELinux en tentant d'accéder à des fichiers système : comportement anormal à documenter.",
    "Un plantage répétitif d'une application sous GrapheneOS révèle une erreur mémoire détectée par le durcissement."
  ],
  err: [
    ["Partager un bugreport complet sur un forum public.", "Il contient des données personnelles : ne le partagez qu'avec des personnes de confiance et après analyse."],
    ["Chercher à tout lire sans filtrer.", "Filtrez par paquet, par niveau ou par motif."],
    ["Analyser l'appareil d'un tiers sans autorisation.", "Limitez-vous à vos appareils ou à un laboratoire autorisé."]
  ],
  reco: [
    "Constituez un laboratoire avec un appareil dédié, sans données personnelles.",
    "Pour l'analyse forensique approfondie, des outils comme MVT existent, réservés à un usage avancé et encadré."
  ],
  sum: "logcat (en continu, avec -d ou sur le tampon events) et bugreport permettent d'analyser le comportement d'un appareil. Filtrez les refus SELinux, les plantages et l'activité d'un paquet, en laboratoire, en protégeant les données personnelles contenues.",
  quiz: [
    { q: "Que fait adb logcat -d ?", o: ["Il efface le téléphone", "Il affiche le contenu actuel du tampon de journaux puis s'arrête", "Il désactive les journaux", "Il installe une application"], a: 1, e: "L'option -d vide le tampon à l'écran sans rester en écoute." },
    { q: "Pourquoi manipuler un bugreport avec précaution ?", o: ["Il est trop léger", "Il contient de nombreuses informations personnelles", "Il est chiffré", "Il ne contient rien"], a: 1, e: "Il regroupe journaux et état détaillé du système." }
  ]
},
/* ---------------------------------------------------------------- 9.9 */
{
  obj: "Vérifier que toutes les sources de mises à jour fonctionnent et sont à jour.",
  intro: [
    "Un appareil peut afficher un correctif récent mais avoir des applications critiques obsolètes, ou l'inverse. Cet exercice vérifie l'ensemble des canaux de mise à jour.",
    "Il clôt la partie « contrôles » de l'audit."
  ],
  warn: ETHICS,
  tech: [
    "Les canaux à vérifier sont ceux de la leçon 4 du module 3 sur Android standard (système, système Google Play, applications), et sur GrapheneOS le système de mise à jour du projet, l'App Store et les sources d'applications choisies. Pour une application précise, ADB permet de lire sa version : <code>adb shell dumpsys package &lt;paquet&gt;</code> affiche notamment <code>versionName</code> et la date de dernière mise à jour (<code>lastUpdateTime</code>)."
  ],
  fig: "update-cycle",
  steps: [
    "Vérifiez la mise à jour système dans les Paramètres et notez la date du dernier contrôle.",
    "Sur Android standard, vérifiez la mise à jour du système Google Play.",
    "Ouvrez chaque magasin d'applications utilisé et vérifiez l'absence de mise à jour en attente.",
    "Pour le navigateur et WebView, relevez la version et comparez-la à la dernière version publiée.",
    "En ADB, pour une application critique, exécutez <code>adb shell dumpsys package &lt;paquet&gt;</code> et relevez <code>versionName</code> et <code>lastUpdateTime</code>.",
    "Consignez les applications installées manuellement et vérifiez leur version auprès de l'éditeur."
  ],
  result: "Tous les canaux de mise à jour sont actifs et aucune mise à jour critique n'est en attente.",
  ex: [
    "Une application installée manuellement il y a un an n'a jamais été mise à jour : elle est soit remplacée par la version d'un magasin, soit supprimée.",
    "Le navigateur est à jour, mais une mise à jour système attend un redémarrage depuis trois semaines : le redémarrage est effectué."
  ],
  err: [
    ["Oublier les applications installées manuellement.", "Listez-les et vérifiez-les à chaque audit."],
    ["Négliger une mise à jour en attente de redémarrage.", "Redémarrez pour l'appliquer."]
  ],
  reco: [
    "Ajoutez la date du dernier redémarrage à votre grille d'audit.",
    "Limitez le nombre de sources d'applications pour simplifier le suivi."
  ],
  sum: "L'audit des mises à jour vérifie le système, les composants Google Play le cas échéant, chaque magasin d'applications, le navigateur et WebView, ainsi que les applications installées manuellement. dumpsys package fournit la version et la date de mise à jour d'une application.",
  quiz: [
    { q: "Quel champ de dumpsys package indique la version d'une application ?", o: ["versionName", "colorName", "userName", "networkName"], a: 0, e: "versionName contient la version lisible de l'application." },
    { q: "Une mise à jour système attend un redémarrage depuis des semaines. Que faire ?", o: ["Attendre encore", "Redémarrer pour l'appliquer", "La supprimer", "Désactiver les mises à jour"], a: 1, e: "Le correctif n'est actif qu'après redémarrage." }
  ]
},
/* ---------------------------------------------------------------- 9.10 */
{
  obj: "Conduire un audit de sécurité mobile complet, de la préparation au rapport, avec une grille réutilisable.",
  intro: [
    "Cette leçon assemble tous les exercices du module en une démarche d'audit complète, telle qu'un professionnel la mènerait. Le livrable est un rapport court, clair et actionnable.",
    "Réalisez-la sur votre propre téléphone : c'est la meilleure façon de consolider vos acquis."
  ],
  warn: ETHICS,
  tech: [
    { h: "Les phases de l'audit", ul: [
      "<b>Cadrage</b> : périmètre (quel appareil, quels comptes), autorisation écrite si l'appareil n'est pas le vôtre, objectifs.",
      "<b>Collecte</b> : inventaire, versions, correctifs, permissions, applications, bootloader, comptes, sauvegardes.",
      "<b>Analyse</b> : comparaison avec la grille de référence, identification des écarts.",
      "<b>Restitution</b> : rapport avec écarts classés par gravité et recommandations priorisées.",
      "<b>Suivi</b> : vérification de la correction des écarts."
    ]}
  ],
  table: {
    cap: "Grille d'audit de référence (à adapter à votre contexte).",
    head: ["Point de contrôle", "Attendu", "Méthode"],
    rows: [
      ["Version d'Android", "Version encore prise en charge", "Paramètres, getprop"],
      ["Correctif de sécurité", "Moins de 60 à 90 jours", "Paramètres, getprop"],
      ["Verrouillage", "PIN 6+ aléatoire ou mot de passe, délai court", "Paramètres"],
      ["Bootloader et démarrage vérifié", "Verrouillé, état vert ou jaune vérifié", "Écran de démarrage, getprop, Auditor"],
      ["SELinux", "Enforcing", "getenforce"],
      ["Accessibilité, notifications, administrateurs", "Uniquement des applications justifiées", "Paramètres, settings, dumpsys"],
      ["Applications", "Sources identifiées, aucune inconnue", "pm list packages -i -3"],
      ["Sources inconnues", "Aucune autorisation permanente", "Accès spéciaux"],
      ["Comptes", "MFA activée, appareils connectés connus", "Check-up Sécurité"],
      ["Sauvegardes", "Chiffrées, récentes, testées", "Paramètres, test de restauration"],
      ["Notifications écran verrouillé", "Contenu sensible masqué", "Paramètres"],
      ["Débogage USB", "Désactivé", "Options pour les développeurs"]
    ]
  },
  fig: "audit",
  steps: [
    "<b>Cadrage</b> : rédigez en trois lignes le périmètre et l'objectif de l'audit.",
    "<b>Collecte</b> : appliquez les leçons 1 à 9 et remplissez la grille point par point.",
    "<b>Analyse</b> : pour chaque point, indiquez conforme, non conforme ou non applicable.",
    "<b>Classement</b> : attribuez une gravité (élevée, moyenne, faible) à chaque écart.",
    "<b>Rapport</b> : rédigez une page : synthèse, tableau des écarts, trois actions prioritaires.",
    "<b>Correction et suivi</b> : corrigez les écarts, puis planifiez le prochain audit dans six mois."
  ],
  result: "Un rapport d'audit d'une page, avec écarts classés et actions prioritaires, est produit et suivi.",
  ex: [
    "Rapport type : « 2 écarts élevés (correctif de 5 mois, application inconnue avec accessibilité), 1 écart moyen (pas de MFA sur la messagerie). Actions : mise à jour, suppression et changement de mots de passe, activation de la MFA. »",
    "Un responsable informatique applique la grille à dix téléphones professionnels et identifie un modèle qui n'est plus mis à jour."
  ],
  err: [
    ["Auditer l'appareil d'un tiers sans autorisation écrite.", "Obtenez toujours une autorisation explicite et écrite."],
    ["Produire un rapport trop long et technique.", "Une page, des priorités claires, des actions concrètes."],
    ["Ne pas vérifier la correction des écarts.", "Planifiez une vérification de suivi."]
  ],
  reco: [
    "Réutilisez la même grille à chaque audit pour mesurer les progrès.",
    "Pour un audit professionnel, conservez les preuves (captures, sorties de commandes) de façon sécurisée."
  ],
  sum: "Un audit complet suit cinq phases : cadrage, collecte, analyse, restitution, suivi. La grille de référence couvre version, correctifs, verrouillage, bootloader, SELinux, accès puissants, applications, comptes, sauvegardes, notifications et débogage USB. Le livrable est un rapport court et actionnable.",
  quiz: [
    { q: "Quelle est la première phase d'un audit ?", o: ["Le cadrage", "La restitution", "Le suivi", "La correction"], a: 0, e: "Le cadrage définit le périmètre, l'autorisation et les objectifs." },
    { q: "Que faut-il obtenir avant d'auditer l'appareil d'un tiers ?", o: ["Son mot de passe en secret", "Une autorisation explicite et écrite", "Rien", "L'avis d'un forum"], a: 1, e: "Sans autorisation, l'accès à l'appareil d'autrui est illégal." },
    { q: "Quel état est attendu pour SELinux ?", o: ["Permissive", "Disabled", "Enforcing", "Unknown"], a: 2, e: "SELinux doit être en mode Enforcing." }
  ]
}
];
})();
