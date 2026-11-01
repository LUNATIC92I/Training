/* Module 6 : Installation de GrapheneOS étape par étape
   Rédigé à partir du guide officiel https://grapheneos.org/install/web
   (consulté le 1er novembre 2026). Aucune commande ni option n'est ajoutée à
   la procédure officielle. En cas de différence, le guide officiel prévaut. */
window.ASG = window.ASG || {}; ASG.content = ASG.content || {};
(function () {
var OFFICIAL = "Cette étape suit le guide officiel <a href=\"https://grapheneos.org/install/web\" rel=\"noopener\" target=\"_blank\">grapheneos.org/install/web</a>. En cas de différence avec ce tutoriel, le guide officiel prévaut toujours.";
var WIPE = "<b>Effacement des données.</b> Cette étape efface intégralement le contenu du téléphone. Assurez-vous d'avoir réalisé et vérifié votre sauvegarde (module 5, leçon 5).";
ASG.content.m6 = [
/* ---------------------------------------------------------------- 6.1 */
{
  obj: "Réunir le matériel nécessaire à l'installation, conformément aux prérequis officiels.",
  intro: [
    "Bienvenue dans le tutoriel d'installation. Il suit fidèlement l'installateur Web officiel, que le projet GrapheneOS présente comme l'approche recommandée pour la plupart des utilisateurs. Une méthode en ligne de commande existe pour les utilisateurs avancés.",
    "La première étape consiste à réunir le matériel. La majorité des échecs d'installation viennent d'un matériel inadapté, en particulier des câbles."
  ],
  tech: [
    OFFICIAL,
    { h: "Le matériel requis", ul: [
      "Un <b>appareil pris en charge</b>, vérifié au module 5.",
      "Un <b>ordinateur</b> disposant d'au moins <b>2 Go de mémoire libre</b> et <b>32 Go d'espace de stockage libre</b>, selon le guide officiel. L'installateur peut aussi fonctionner depuis un autre téléphone ou une tablette Android compatible.",
      "Un <b>câble USB-C de qualité</b>, conforme aux normes ; le guide recommande, lorsque c'est possible, celui fourni avec l'appareil.",
      "Un <b>port USB direct</b> : port arrière d'un ordinateur de bureau ou port d'un ordinateur portable, sans concentrateur."
    ]}
  ],
  fig: "install-flow",
  steps: [
    "Placez le téléphone, l'ordinateur et le câble sur un plan de travail dégagé.",
    "Vérifiez l'espace libre de l'ordinateur (au moins 32 Go) et fermez les applications gourmandes en mémoire.",
    "Identifiez un port USB directement relié à la carte mère (port arrière sur un ordinateur de bureau).",
    "Préparez le câble fourni avec le téléphone ou, à défaut, un câble USB-C de qualité.",
    "Gardez à portée de main un second appareil pour consulter le guide officiel."
  ],
  result: "Le matériel conforme aux prérequis officiels est réuni.",
  ex: [
    "Un utilisateur tente l'installation avec un câble de charge rapide bon marché : déconnexions répétées. Avec le câble d'origine, tout fonctionne.",
    "Une utilisatrice prépare tout la veille : ordinateur à jour, 40 Go libres, câble d'origine, port arrière identifié."
  ],
  err: [
    ["Utiliser un câble de charge bas de gamme.", "Utilisez le câble fourni ou un câble USB-C conforme aux normes ; le guide indique que de nombreux câbles et concentrateurs sont défectueux."],
    ["Utiliser le port USB en façade d'un boîtier de bureau.", "Utilisez un port arrière, directement relié à la carte mère."],
    ["Lancer l'installation avec un disque presque plein.", "Libérez au moins 32 Go avant de commencer."]
  ],
  reco: [
    "Préparez tout la veille pour aborder l'installation sereinement.",
    "Évitez d'utiliser un ordinateur professionnel dont vous ne maîtrisez pas la configuration."
  ],
  sum: "Il faut un appareil pris en charge, un ordinateur avec au moins 2 Go de mémoire libre et 32 Go de stockage libre, un câble USB-C de qualité et un port USB direct, sans concentrateur.",
  quiz: [
    { q: "Quel espace de stockage libre le guide officiel demande-t-il sur l'ordinateur ?", o: ["2 Go", "8 Go", "32 Go", "128 Go"], a: 2, e: "Le guide indique 32 Go de stockage libre et 2 Go de mémoire libre." },
    { q: "Quelle est la source de problèmes la plus fréquente selon le guide officiel ?", o: ["Les câbles et concentrateurs USB défectueux", "La couleur du téléphone", "La version de la carte SIM", "Le fond d'écran"], a: 0, e: "Le guide le souligne explicitement." }
  ]
},
/* ---------------------------------------------------------------- 6.2 */
{
  obj: "Revérifier, le jour de l'installation, la compatibilité de l'appareil avec la liste officielle.",
  intro: [
    "Vous avez déjà vérifié la compatibilité au module 5. Pourquoi recommencer ? Parce que la liste officielle évolue, et qu'une erreur d'identification à ce stade aurait des conséquences importantes.",
    "C'est une vérification rapide, mais non négociable."
  ],
  warn: WIPE,
  tech: [
    OFFICIAL,
    "L'installateur Web télécharge l'image correspondant à l'appareil connecté. Néanmoins, vous devez vous-même vous assurer que votre appareil figure dans la liste officielle et qu'il n'a pas atteint sa fin de vie.",
    "Le tableau ci-dessous reprend la liste officielle à la date de vérification indiquée. Vérifiez la page officielle avant de continuer."
  ],
  extra: "devices",
  fig: "device-id",
  steps: [
    "Ouvrez <code>https://grapheneos.org/faq#supported-devices</code>.",
    "Retrouvez votre modèle exact et son nom de code.",
    "Vérifiez que la date de fin de support n'est pas dépassée, ou que vous acceptez cette situation en connaissance de cause.",
    "Confirmez une dernière fois que l'option Déverrouillage OEM est activable (module 5, leçon 4)."
  ],
  result: "La compatibilité est confirmée à la source le jour même.",
  ex: [
    "Un acheteur vérifie la liste officielle le jour même et constate que son modèle est bien listé, avec une date de fin de support lointaine.",
    "Un vendeur affirme qu'un modèle non listé « fonctionne aussi » : l'acheteur renonce, conformément à la liste officielle."
  ],
  err: [
    ["Se fier à une vérification ancienne.", "Revérifiez le jour de l'installation."],
    ["Confondre deux modèles proches.", "Comparez le nom de code, pas seulement le nom commercial."]
  ],
  reco: [
    "Conservez une capture d'écran de la page officielle consultée.",
    "En cas de doute, arrêtez-vous et demandez conseil sur les canaux officiels."
  ],
  sum: "Le jour de l'installation, revérifiez sur la page officielle que votre modèle exact est pris en charge et que le déverrouillage OEM est possible.",
  quiz: [
    { q: "Pourquoi revérifier la compatibilité le jour de l'installation ?", o: ["Parce que la liste officielle évolue", "Pour passer le temps", "Parce que le téléphone change de modèle", "Ce n'est pas utile"], a: 0, e: "La page officielle peut avoir été mise à jour." },
    { q: "Quel identifiant permet de distinguer avec certitude deux modèles proches ?", o: ["La couleur", "Le nom de code", "Le prix", "Le fond d'écran"], a: 1, e: "Chaque modèle a un nom de code unique." }
  ]
},
/* ---------------------------------------------------------------- 6.3 */
{
  obj: "Effectuer et vérifier une dernière sauvegarde complète juste avant l'installation.",
  intro: [
    "Entre votre sauvegarde du module 5 et aujourd'hui, de nouvelles données ont pu apparaître : photos, messages, documents. Cette étape consiste à les sauvegarder à leur tour.",
    "À partir de l'étape 12, plus aucun retour en arrière n'est possible pour les données."
  ],
  warn: WIPE,
  tech: [
    OFFICIAL,
    "La sauvegarde n'est pas décrite par le guide officiel, qui suppose qu'elle a été faite. Les recommandations ci-dessous relèvent des bonnes pratiques présentées au module 5."
  ],
  fig: "encryption",
  steps: [
    "Copiez les photos et fichiers créés depuis la dernière sauvegarde.",
    "Relancez la sauvegarde de vos messageries.",
    "Vérifiez une dernière fois l'accès à vos comptes essentiels depuis un autre appareil (messagerie, gestionnaire de mots de passe, banque).",
    "Vérifiez que vos codes de secours sont accessibles hors du téléphone.",
    "Notez la liste des applications à réinstaller."
  ],
  result: "Aucune donnée importante n'existe uniquement sur le téléphone.",
  ex: [
    "Le matin même, un utilisateur a pris des photos de famille : il les copie avant de commencer.",
    "Une utilisatrice vérifie qu'elle peut se connecter à sa messagerie depuis son ordinateur avant d'effacer son téléphone."
  ],
  err: [
    ["Oublier les photos prises le matin même.", "Faites une dernière copie juste avant de commencer."],
    ["Oublier de vérifier l'accès aux comptes.", "Testez une connexion depuis un autre appareil."]
  ],
  reco: [
    "Prenez cinq minutes pour vérifier, c'est le meilleur investissement de toute l'installation.",
    "Gardez la sauvegarde à portée de main pour la restauration après l'installation."
  ],
  sum: "Juste avant l'installation, sauvegardez les données récentes, vérifiez l'accès à vos comptes sans le téléphone et la disponibilité des codes de secours.",
  quiz: [
    { q: "À partir de quand les données du téléphone sont-elles définitivement effacées ?", o: ["Dès le déverrouillage du bootloader", "Seulement à la fin", "Jamais", "Au premier redémarrage de l'ordinateur"], a: 0, e: "Le déverrouillage du bootloader efface toutes les données." },
    { q: "Que vérifier en plus des fichiers ?", o: ["L'accès à vos comptes essentiels sans ce téléphone", "La couleur du câble", "Le volume de la sonnerie", "La luminosité"], a: 0, e: "Vous devez pouvoir accéder à vos comptes après l'effacement." }
  ]
},
/* ---------------------------------------------------------------- 6.4 */
{
  obj: "Vérifier le niveau de batterie du téléphone et l'alimentation de l'ordinateur pour éviter toute coupure.",
  intro: [
    "Une coupure d'alimentation pendant le flashage complique inutilement l'installation. Cette étape relève de la prudence élémentaire.",
    "Précision importante : le guide officiel ne fixe pas de seuil de batterie. Les valeurs ci-dessous sont des recommandations de prudence de cette formation."
  ],
  tech: [
    OFFICIAL,
    "Le téléphone se recharge généralement lorsqu'il est relié à l'ordinateur, mais le courant fourni par certains ports peut être faible. Partir avec une batterie bien chargée laisse une marge confortable. Côté ordinateur, un portable doit être branché sur secteur et la mise en veille automatique doit être désactivée le temps de l'opération."
  ],
  fig: "install-flow",
  steps: [
    "Chargez le téléphone au-delà de 50 % (recommandation de prudence de cette formation).",
    "Branchez l'ordinateur portable sur secteur.",
    "Désactivez temporairement la mise en veille automatique de l'ordinateur.",
    "Fermez les mises à jour système de l'ordinateur susceptibles de provoquer un redémarrage."
  ],
  result: "Le téléphone est suffisamment chargé et l'ordinateur ne risque ni coupure, ni mise en veille, ni redémarrage.",
  ex: [
    "Un ordinateur portable sur batterie se met en veille pendant le téléchargement : l'opération doit être relancée. Branché sur secteur, tout se passe bien.",
    "Un téléphone à 15 % est rechargé pendant la préparation des autres étapes."
  ],
  err: [
    ["Commencer avec une batterie à 10 %.", "Rechargez d'abord le téléphone."],
    ["Laisser l'ordinateur se mettre en veille pendant le téléchargement.", "Désactivez la mise en veille le temps de l'installation."],
    ["Lancer une mise à jour de l'ordinateur en parallèle.", "Reportez-la après l'installation."]
  ],
  reco: [
    "Réactivez la mise en veille de l'ordinateur une fois l'installation terminée.",
    "Si l'opération est interrompue, ne paniquez pas : relisez le guide officiel et reprenez à l'étape concernée."
  ],
  sum: "Le guide officiel ne fixe pas de seuil de batterie, mais par prudence, chargez le téléphone au-delà de 50 %, branchez l'ordinateur sur secteur et désactivez sa mise en veille et ses mises à jour pendant l'opération.",
  quiz: [
    { q: "Le guide officiel impose-t-il un pourcentage minimal de batterie ?", o: ["Oui, 80 %", "Non, la valeur de 50 % est une recommandation de prudence de cette formation", "Oui, 100 %", "Oui, 20 %"], a: 1, e: "La formation distingue clairement ce qui vient du guide officiel et ce qui relève de la prudence." },
    { q: "Que faire de la mise en veille de l'ordinateur ?", o: ["La laisser active", "La désactiver temporairement", "La réduire à 1 minute", "Elle n'a aucun effet"], a: 1, e: "Une mise en veille peut interrompre le téléchargement ou le flashage." }
  ]
},
/* ---------------------------------------------------------------- 6.5 */
{
  obj: "Préparer un ordinateur dont le système d'exploitation est pris en charge par l'installateur Web, y compris la configuration spécifique à Linux.",
  intro: [
    "L'installateur Web fonctionne depuis de nombreux systèmes, à condition qu'ils soient pris en charge et à jour. Linux demande une préparation particulière pour autoriser l'accès USB sans droits administrateur.",
    "Les listes ci-dessous reprennent le guide officiel à la date de consultation : vérifiez-les sur la page officielle, car elles évoluent."
  ],
  tech: [
    OFFICIAL,
    { h: "Systèmes pris en charge (selon le guide officiel consulté)", ul: [
      "Windows 10 et Windows 11.",
      "macOS Sonoma (14), Sequoia (15) et Tahoe (26).",
      "Arch Linux ; Debian 12 et 13 ; Ubuntu 22.04 LTS, 24.04 LTS et 25.04 ; Linux Mint 21 et 22, LMDE 6.",
      "ChromeOS.",
      "GrapheneOS, ainsi qu'Android 14, 15, 16 et 17 avec certification Play Protect, depuis un autre téléphone ou une tablette.",
      "Les versions en fin de vie ne sont pas officiellement prises en charge. Le système doit être à jour."
    ]},
    { h: "Linux : l'accès USB sans droits root", p: [
      "Le guide officiel explique que, sur les distributions Linux traditionnelles, les périphériques USB ne peuvent pas être utilisés sans droits root en l'absence de règles udev. Il indique d'installer le paquet <code>android-udev</code> sur Arch Linux, ou <code>android-sdk-platform-tools-common</code> sur Debian et Ubuntu.",
      "Le guide signale aussi que le service <code>fwupd</code> peut s'approprier les appareils en mode Fastboot, et propose de l'arrêter temporairement avec <code>sudo systemctl stop fwupd.service</code>. Cette commande ne désactive pas le service, qui redémarrera au prochain démarrage de l'ordinateur."
    ]}
  ],
  fig: "web-installer",
  steps: [
    "Vérifiez que votre système figure dans la liste officielle et installez toutes ses mises à jour.",
    "<b>Windows et macOS</b> : aucune préparation supplémentaire n'est décrite par le guide pour les Pixel récents (voir l'étape 10 pour les pilotes sous Windows).",
    "<b>Arch Linux</b> : installez le paquet <code>android-udev</code>.",
    "<b>Debian, Ubuntu et dérivés</b> : installez le paquet <code>android-sdk-platform-tools-common</code> (par exemple avec <code>sudo apt install android-sdk-platform-tools-common</code>).",
    "<b>Linux avec fwupd</b> : si le téléphone n'est pas détecté en mode Fastboot, arrêtez temporairement le service avec <code>sudo systemctl stop fwupd.service</code>.",
    "Redémarrez l'ordinateur si vous venez d'installer de nombreuses mises à jour."
  ],
  result: "L'ordinateur fonctionne sous un système pris en charge, à jour, et Linux dispose des règles udev nécessaires.",
  ex: [
    "Sous Ubuntu, le téléphone n'apparaît pas : l'installation de <code>android-sdk-platform-tools-common</code> puis la reconnexion du câble résolvent le problème.",
    "Sous Windows 11 à jour, aucune préparation particulière n'est nécessaire."
  ],
  err: [
    ["Utiliser une version de système en fin de vie.", "Mettez à jour vers une version prise en charge ou utilisez un autre ordinateur."],
    ["Lancer le navigateur avec sudo sous Linux pour contourner l'absence de règles udev.", "Installez le paquet de règles udev indiqué par le guide officiel."],
    ["Téléphone non détecté sous Linux en mode Fastboot.", "Vérifiez les règles udev, reconnectez le câble, puis arrêtez temporairement fwupd comme indiqué."]
  ],
  reco: [
    "Préférez un ordinateur personnel bien entretenu à un ordinateur partagé.",
    "Consultez la page officielle le jour même : la liste des systèmes pris en charge évolue."
  ],
  sum: "L'installateur Web fonctionne sous Windows 10/11, macOS récents, plusieurs distributions Linux, ChromeOS et Android récent, à condition d'être à jour. Sous Linux, installez les règles udev indiquées et arrêtez temporairement fwupd si besoin.",
  quiz: [
    { q: "Quel paquet le guide officiel indique-t-il pour Debian et Ubuntu ?", o: ["android-sdk-platform-tools-common", "grapheneos-installer", "fastboot-gui", "usb-root-access"], a: 0, e: "Ce paquet fournit les règles udev pour accéder aux appareils Android sans droits root." },
    { q: "Que fait la commande sudo systemctl stop fwupd.service ?", o: ["Elle désactive définitivement fwupd", "Elle arrête fwupd jusqu'au prochain redémarrage", "Elle installe GrapheneOS", "Elle formate le téléphone"], a: 1, e: "Le guide précise que le service redémarrera au prochain démarrage." },
    { q: "Peut-on lancer l'installateur depuis un autre téléphone Android ?", o: ["Non", "Oui, depuis GrapheneOS ou Android 14 à 17 avec certification Play Protect, selon le guide consulté", "Oui, depuis n'importe quel téléphone", "Seulement depuis un iPhone"], a: 1, e: "Le guide liste ces systèmes parmi ceux pris en charge." }
  ]
},
/* ---------------------------------------------------------------- 6.6 */
{
  obj: "Choisir et configurer un navigateur compatible avec WebUSB, condition indispensable au fonctionnement de l'installateur Web.",
  intro: [
    "L'installateur Web communique directement avec le téléphone depuis la page web, grâce à l'interface <b>WebUSB</b>. Tous les navigateurs ne la proposent pas.",
    "C'est souvent la cause d'un « téléphone introuvable » chez les débutants."
  ],
  tech: [
    OFFICIAL,
    { h: "Navigateurs pris en charge (selon le guide officiel consulté)", ul: [
      "Chromium (sauf sous Ubuntu, où il est distribué sous forme de paquet Snap).",
      "Vanadium (sur GrapheneOS).",
      "Google Chrome.",
      "Microsoft Edge.",
      "Brave, avec les protections « Brave Shields » désactivées pour la page."
    ]},
    { h: "Conditions à respecter", ul: [
      "Éviter les navigateurs installés sous forme de paquets Flatpak ou Snap.",
      "Ne pas utiliser de mode de navigation privée ou Incognito.",
      "Garder le navigateur à jour.",
      "Depuis un appareil Android, désactiver le mode d'affichage « bureau » du navigateur."
    ]},
    "Firefox et Safari ne proposent pas WebUSB : ils ne permettent pas d'utiliser l'installateur Web."
  ],
  fig: "web-installer",
  steps: [
    "Installez ou mettez à jour l'un des navigateurs pris en charge, depuis sa source officielle.",
    "Sous Linux, vérifiez que le navigateur n'est pas une version Flatpak ou Snap.",
    "Ouvrez une fenêtre normale (pas de navigation privée).",
    "Avec Brave, préparez-vous à désactiver Brave Shields sur la page de l'installateur.",
    "Fermez les autres onglets inutiles pour libérer de la mémoire."
  ],
  result: "Un navigateur compatible WebUSB, à jour, est prêt en fenêtre normale.",
  ex: [
    "Un utilisateur sous Firefox ne voit jamais la fenêtre de sélection USB : avec Chromium, elle apparaît immédiatement.",
    "Avec Brave, l'installateur ne détecte rien tant que Brave Shields reste actif sur la page."
  ],
  err: [
    ["Utiliser Firefox ou Safari.", "Utilisez Chromium, Chrome, Edge, Brave ou Vanadium."],
    ["Utiliser une fenêtre de navigation privée.", "Le guide l'exclut : ouvrez une fenêtre normale."],
    ["Utiliser Chromium installé via Snap sous Ubuntu.", "Utilisez un navigateur pris en charge non distribué sous forme de Snap ou Flatpak."]
  ],
  reco: [
    "Utilisez un navigateur sans extensions superflues pour l'installation.",
    "N'installez jamais d'extension « d'aide à l'installation » : l'installateur officiel n'en a pas besoin."
  ],
  sum: "L'installateur Web exige WebUSB : utilisez Chromium (hors Snap sous Ubuntu), Vanadium, Chrome, Edge ou Brave (Shields désactivés), à jour, en fenêtre normale, et évitez les versions Flatpak ou Snap.",
  quiz: [
    { q: "Pourquoi Firefox ne permet-il pas d'utiliser l'installateur Web ?", o: ["Il est trop lent", "Il ne propose pas WebUSB", "Il est payant", "Il bloque grapheneos.org"], a: 1, e: "WebUSB est indispensable à la communication avec le téléphone depuis la page." },
    { q: "Quelle précaution prendre avec Brave ?", o: ["Activer Shields au maximum", "Désactiver Brave Shields pour la page de l'installateur", "Utiliser le mode privé", "Installer une extension"], a: 1, e: "C'est l'indication du guide officiel." },
    { q: "Peut-on utiliser une fenêtre de navigation privée ?", o: ["Oui", "Non, le guide l'exclut", "Seulement sous Windows", "Seulement avec Edge"], a: 1, e: "Le guide demande de ne pas utiliser les modes Incognito ou privés." }
  ]
},
/* ---------------------------------------------------------------- 6.7 */
{
  obj: "Activer les options pour les développeurs sur le Pixel, sous le système d'origine.",
  intro: [
    "Les réglages nécessaires à l'installation se trouvent dans un menu caché, les « options pour les développeurs ». Les activer ne modifie rien au fonctionnement du téléphone : cela rend simplement le menu visible.",
    "Cette étape se fait sur le système d'origine du téléphone, avant toute modification."
  ],
  tech: [
    OFFICIAL,
    "Le guide officiel indique d'ouvrir <b>Paramètres › À propos du téléphone</b> (ou <b>À propos de la tablette</b>) et d'appuyer à plusieurs reprises sur <b>Numéro de build</b> jusqu'à ce que les options pour les développeurs soient activées. Le système demande généralement le code de verrouillage pour confirmer."
  ],
  fig: "dev-options",
  steps: [
    "Déverrouillez le téléphone et ouvrez <b>Paramètres</b>.",
    "Ouvrez <b>À propos du téléphone</b> (ou <b>À propos de la tablette</b>).",
    "Faites défiler jusqu'à <b>Numéro de build</b>.",
    "Touchez <b>Numéro de build</b> plusieurs fois de suite (généralement sept fois).",
    "Saisissez votre code de verrouillage si le système le demande.",
    "Un message confirme que vous êtes désormais développeur. Le menu apparaît dans <b>Paramètres › Système › Options pour les développeurs</b>."
  ],
  result: "Le menu « Options pour les développeurs » est visible dans Paramètres › Système.",
  ex: [
    "Après sept appuis sur Numéro de build et la saisie du code, le message « Vous êtes maintenant développeur » s'affiche.",
    "Sur un appareil déjà configuré, le message « Vous êtes déjà développeur » indique qu'il n'y a rien à faire."
  ],
  err: [
    ["Le message « Vous êtes déjà développeur » s'affiche.", "Les options sont déjà activées : passez directement à l'étape suivante."],
    ["Impossible de trouver « Numéro de build ».", "Utilisez la recherche des Paramètres en tapant « build »."],
    ["Modifier d'autres options du menu développeur « pour voir ».", "Ne touchez qu'aux options mentionnées dans ce tutoriel."]
  ],
  reco: [
    "Ne modifiez aucune autre option de ce menu.",
    "Les options pour les développeurs de l'ancien système disparaîtront de toute façon avec l'installation."
  ],
  sum: "Pour afficher les options pour les développeurs, touchez plusieurs fois Numéro de build dans À propos du téléphone, puis retrouvez le menu dans Paramètres › Système.",
  quiz: [
    { q: "Où se trouve la ligne « Numéro de build » ?", o: ["Paramètres › À propos du téléphone", "Paramètres › Batterie", "Dans l'appareil photo", "Dans les contacts"], a: 0, e: "C'est l'indication du guide officiel." },
    { q: "Activer les options pour les développeurs modifie-t-il le fonctionnement du téléphone ?", o: ["Oui, il devient plus rapide", "Non, cela rend simplement le menu visible", "Oui, il efface les données", "Oui, il désactive le Wi-Fi"], a: 1, e: "Aucun réglage n'est modifié par cette seule action." }
  ]
},
/* ---------------------------------------------------------------- 6.8 */
{
  obj: "Activer l'option Déverrouillage OEM, condition préalable au déverrouillage du bootloader.",
  intro: [
    "L'option Déverrouillage OEM autorise le bootloader à accepter une commande de déverrouillage. Elle ne déverrouille rien par elle-même ; elle rend le déverrouillage possible à l'étape 12.",
    "Elle n'est disponible que si l'appareil n'a pas été bloqué par un opérateur (module 5, leçon 4)."
  ],
  tech: [
    OFFICIAL,
    "Le guide officiel indique d'activer <b>Déverrouillage OEM</b> dans <b>Paramètres › Système › Options pour les développeurs</b>. Sur les modèles susceptibles d'être vendus verrouillés par un opérateur, l'activation nécessite un accès à Internet, afin que le système d'origine vérifie si l'appareil a été vendu verrouillé.",
    "Pour le Pixel 6a, le guide précise que l'option ne fonctionne pas avec la version du système installée en usine : il faut d'abord mettre à jour l'appareil (version de juin 2022 ou ultérieure) par mise à jour en ligne, puis le réinitialiser."
  ],
  fig: "dev-options",
  steps: [
    "Connectez le téléphone à Internet.",
    "Ouvrez <b>Paramètres › Système › Options pour les développeurs</b>.",
    "Activez l'interrupteur <b>Déverrouillage OEM</b>.",
    "Confirmez l'avertissement affiché et saisissez votre code si demandé.",
    "Vérifiez que l'interrupteur est bien en position activée."
  ],
  result: "L'option Déverrouillage OEM est activée.",
  caution: "Lorsque le déverrouillage OEM est activé, l'appareil perd une partie de sa protection contre la réinstallation par un tiers. Ne laissez pas le téléphone sans surveillance entre cette étape et la fin de l'installation.",
  ex: [
    "Sur un Pixel acheté auprès de Google, l'option s'active immédiatement une fois l'appareil connecté au Wi-Fi.",
    "Sur un Pixel 6a sorti d'usine, l'option ne s'active qu'après la mise à jour et la réinitialisation demandées par le guide."
  ],
  err: [
    ["L'option est grisée.", "Connectez l'appareil à Internet, installez les mises à jour et redémarrez. Si elle reste grisée, l'appareil est probablement bloqué par un opérateur : n'insistez pas."],
    ["Pixel 6a : l'option ne s'active pas.", "Mettez à jour le système (juin 2022 ou ultérieur) via une mise à jour en ligne, puis réinitialisez l'appareil, comme l'indique le guide."],
    ["Confondre « Déverrouillage OEM » et « Débogage USB ».", "Ce sont deux options distinctes ; seul le Déverrouillage OEM est requis ici."]
  ],
  reco: [
    "Enchaînez rapidement avec les étapes suivantes une fois l'option activée.",
    "Après l'installation, l'option sera désactivée à nouveau (étape 17)."
  ],
  sum: "Activez Déverrouillage OEM dans les options pour les développeurs, avec une connexion Internet. Si l'option est grisée, l'appareil est probablement bloqué par un opérateur. Le Pixel 6a nécessite une mise à jour préalable.",
  quiz: [
    { q: "Que fait l'option Déverrouillage OEM ?", o: ["Elle déverrouille immédiatement le bootloader", "Elle autorise le bootloader à accepter une commande de déverrouillage", "Elle installe GrapheneOS", "Elle active le root"], a: 1, e: "Le déverrouillage proprement dit a lieu à l'étape 12." },
    { q: "L'option Déverrouillage OEM est-elle la même chose que le Débogage USB ?", o: ["Oui", "Non, ce sont deux options distinctes", "Oui, sur Pixel 6", "Oui, sous Windows"], a: 1, e: "Seul le Déverrouillage OEM est nécessaire pour l'installateur Web." }
  ]
},
/* ---------------------------------------------------------------- 6.9 */
{
  obj: "Comprendre le rôle du débogage USB et savoir quand il est, ou n'est pas, nécessaire.",
  intro: [
    "De nombreux tutoriels non officiels demandent d'activer le débogage USB. Or l'installateur Web de GrapheneOS ne l'utilise pas : il communique avec le téléphone en mode Fastboot, une fois celui-ci redémarré dans l'interface du bootloader.",
    "Cette étape vous apprend à ne pas activer un accès inutile."
  ],
  tech: [
    OFFICIAL,
    { h: "ADB et Fastboot : deux protocoles différents", p: [
      "Le <b>débogage USB</b> active <b>ADB</b> (Android Debug Bridge), qui permet de piloter le système Android en fonctionnement depuis un ordinateur (module 9). <b>Fastboot</b> est un protocole du bootloader, utilisé lorsque le téléphone est arrêté dans l'interface du bootloader. L'installateur Web utilise Fastboot.",
      "La procédure officielle de l'installateur Web ne mentionne pas le débogage USB. Il n'est donc <b>pas nécessaire</b> de l'activer pour installer GrapheneOS par cette méthode."
    ]},
    { h: "Quand est-il utile ?", p: [
      "Le débogage USB peut servir, par exemple, pour redémarrer le téléphone dans le bootloader par une commande ADB dans la méthode en ligne de commande, ou pour les exercices d'audit du module 9. Dans ces cas, il doit être désactivé dès la fin de l'opération."
    ]}
  ],
  fig: "dev-options",
  steps: [
    "Ouvrez <b>Paramètres › Système › Options pour les développeurs</b>.",
    "Vérifiez l'état de <b>Débogage USB</b>.",
    "S'il est activé et que vous n'en avez pas d'autre usage, désactivez-le.",
    "Ne l'activez pas pour l'installation via l'installateur Web."
  ],
  result: "Le débogage USB est désactivé ; seul le Déverrouillage OEM est activé.",
  caution: "Un débogage USB laissé actif sur un appareil en usage quotidien ouvre une surface d'attaque inutile en cas d'accès physique. Désactivez-le systématiquement après usage.",
  ex: [
    "Un tutoriel vidéo demande d'activer le débogage USB : l'apprenant suit le guide officiel et laisse l'option désactivée, sans aucun effet sur l'installation.",
    "Après un exercice d'audit, un apprenant désactive le débogage USB et révoque les autorisations."
  ],
  err: [
    ["Activer le débogage USB « parce qu'un tutoriel vidéo le demande ».", "Suivez le guide officiel : il n'est pas requis par l'installateur Web."],
    ["Laisser le débogage USB actif après l'installation.", "Sur le nouveau système, il est désactivé par défaut ; ne l'activez que ponctuellement."]
  ],
  reco: [
    "Appliquez le principe du moindre privilège : n'activez que ce qui est nécessaire.",
    "Retenez la différence ADB / Fastboot : elle vous servira au module 9."
  ],
  sum: "L'installateur Web utilise le protocole Fastboot, pas ADB : le débogage USB n'est pas nécessaire pour cette méthode et doit rester désactivé. Il ne sert que ponctuellement, par exemple pour la méthode en ligne de commande ou des exercices d'audit.",
  quiz: [
    { q: "Quel protocole l'installateur Web utilise-t-il pour communiquer avec le téléphone ?", o: ["ADB", "Fastboot", "Bluetooth", "NFC"], a: 1, e: "Le téléphone est arrêté dans l'interface du bootloader, en mode Fastboot." },
    { q: "Faut-il activer le débogage USB pour l'installateur Web ?", o: ["Oui, obligatoirement", "Non, la procédure officielle ne le demande pas", "Oui, sous Linux", "Oui, pour les Pixel 10"], a: 1, e: "Il ne faut activer que ce qui est nécessaire." }
  ]
},
/* ---------------------------------------------------------------- 6.10 */
{
  obj: "Redémarrer le téléphone dans l'interface du bootloader (mode Fastboot) et le connecter correctement à l'ordinateur.",
  intro: [
    "Pour être piloté par l'installateur, le téléphone doit être démarré dans l'interface du bootloader, un environnement minimal qui s'exécute avant Android.",
    "Il doit y rester en pause pendant toute la suite des opérations."
  ],
  tech: [
    OFFICIAL,
    "Le guide officiel indique de maintenir le bouton <b>Volume bas</b> pendant le démarrage de l'appareil. L'opération a réussi lorsque l'écran affiche un <b>triangle d'avertissement rouge</b> et les mots <b>« Fastboot Mode »</b>. Il ne faut pas appuyer sur le bouton Marche/Arrêt pour sélectionner « Start » : l'appareil doit rester en pause en mode Fastboot.",
    { h: "Connexion et pilotes", p: [
      "Le guide précise que Windows 10 et 11 incluent un pilote Fastboot générique et qu'aucun pilote n'est nécessaire pour les Pixel 4a (5G) et ultérieurs, ce qui couvre tous les appareils actuellement pris en charge. Sous Linux, si les règles udev viennent d'être installées, il faut reconnecter l'appareil. Pour la Pixel Tablet, le guide indique de la retirer de son socle avant de continuer."
    ]}
  ],
  fig: "fastboot-screen",
  steps: [
    "Éteignez complètement le téléphone (menu d'alimentation › Éteindre).",
    "Maintenez le bouton <b>Volume bas</b> enfoncé.",
    "Tout en maintenant Volume bas, appuyez sur <b>Marche/Arrêt</b> pour allumer l'appareil, puis relâchez Marche/Arrêt en continuant de maintenir Volume bas.",
    "Relâchez Volume bas lorsque l'écran affiche le triangle rouge et « Fastboot Mode ».",
    "Relevez la ligne <b>Product name</b> (nom de code) et comparez-la avec le module 5.",
    "Ne sélectionnez pas « Start ». Reliez le téléphone à l'ordinateur avec le câble, directement sur un port USB.",
    "<b>Pixel Tablet</b> : retirez-la de son socle avant de continuer."
  ],
  result: "Le téléphone affiche « Fastboot Mode », reste en pause et est relié directement à l'ordinateur.",
  ex: [
    "L'écran affiche le triangle rouge et « Fastboot Mode » ; la ligne Product name indique <code>tokay</code>, cohérent avec un Pixel 9.",
    "Un utilisateur appuie par réflexe sur Marche/Arrêt et le téléphone démarre Android : il recommence en maintenant Volume bas."
  ],
  err: [
    ["Le téléphone démarre normalement sous Android.", "Éteignez-le et recommencez en maintenant Volume bas dès l'allumage."],
    ["L'appareil quitte le mode Fastboot.", "Vous avez probablement validé « Start » : recommencez sans toucher au bouton Marche/Arrêt."],
    ["Le nom de code ne correspond pas au modèle attendu.", "Arrêtez l'installation et vérifiez l'origine de l'appareil."]
  ],
  reco: [
    "Gardez le téléphone à plat, câble bien en place, sans le manipuler.",
    "Photographiez l'écran Fastboot : la ligne « Device state » vous servira pour comparer avant et après."
  ],
  sum: "Éteignez le téléphone, démarrez-le en maintenant Volume bas jusqu'à l'écran « Fastboot Mode » au triangle rouge, ne sélectionnez pas Start, puis reliez-le directement à l'ordinateur. Aucun pilote n'est nécessaire sous Windows 10/11 pour les Pixel pris en charge.",
  quiz: [
    { q: "Comment accéder au mode Fastboot sur un Pixel ?", o: ["Maintenir Volume bas pendant le démarrage", "Maintenir Volume haut pendant 30 secondes", "Taper un code dans le téléphone", "Retirer la carte SIM"], a: 0, e: "C'est la méthode indiquée par le guide officiel." },
    { q: "Que faut-il éviter une fois en mode Fastboot ?", o: ["Brancher le câble", "Valider « Start » avec le bouton Marche/Arrêt", "Lire le nom de code", "Rester immobile"], a: 1, e: "L'appareil doit rester en pause en mode Fastboot." },
    { q: "Faut-il installer un pilote sous Windows 11 pour un Pixel pris en charge ?", o: ["Oui, toujours", "Non, Windows 10 et 11 incluent un pilote générique suffisant pour ces appareils", "Oui, depuis un site tiers", "Oui, sur Pixel 10 uniquement"], a: 1, e: "Le guide précise qu'aucun pilote n'est nécessaire pour les Pixel 4a (5G) et ultérieurs." }
  ]
},
/* ---------------------------------------------------------------- 6.11 */
{
  obj: "Ouvrir l'installateur Web officiel en s'assurant de son authenticité, et établir la connexion avec le téléphone.",
  intro: [
    "L'installateur Web est une page du site officiel. C'est elle qui télécharge l'image signée et pilote le téléphone. Une fausse page pourrait installer un système malveillant : l'adresse doit donc être vérifiée avec soin.",
    "L'adresse officielle est : <code>https://grapheneos.org/install/web</code>."
  ],
  tech: [
    OFFICIAL,
    "La page présente les étapes de l'installation et des boutons d'action. Lorsqu'un bouton nécessite l'accès au téléphone, le navigateur affiche une fenêtre de sélection de périphérique USB (WebUSB) : il faut y choisir le téléphone pour autoriser la page à communiquer avec lui.",
    "Le guide officiel souligne que, même si l'ordinateur utilisé pour l'installation était compromis et qu'un attaquant remplaçait GrapheneOS par un système malveillant, cela pourrait être détecté grâce au démarrage vérifié et à l'attestation (étape 17)."
  ],
  fig: "web-installer",
  steps: [
    "Dans le navigateur compatible, saisissez vous-même l'adresse <code>https://grapheneos.org/install/web</code> (ne passez pas par un lien reçu ou une publicité).",
    "Vérifiez le nom de domaine exact dans la barre d'adresse : <b>grapheneos.org</b>.",
    "Lisez la page en entier ; gardez-la ouverte pendant toute l'installation.",
    "Repérez les boutons qui seront utilisés : <b>Unlock bootloader</b>, <b>Download release</b>, <b>Flash release</b>, <b>Lock bootloader</b>.",
    "Lorsque le navigateur affiche la fenêtre de sélection USB, choisissez le téléphone en mode Fastboot."
  ],
  result: "La page officielle est ouverte et le navigateur peut accéder au téléphone.",
  caution: "Méfiez-vous des sites ou vidéos proposant un « installateur GrapheneOS » sur un autre domaine. Seule l'adresse grapheneos.org est officielle.",
  ex: [
    "Un lien reçu sur un forum mène à « grapheneos-install.app » : l'utilisateur ferme la page et saisit lui-même l'adresse officielle.",
    "La fenêtre WebUSB affiche le téléphone en mode Fastboot ; l'utilisateur le sélectionne et poursuit."
  ],
  err: [
    ["Aucun appareil n'apparaît dans la fenêtre de sélection.", "Vérifiez le mode Fastboot, le câble, le port direct, le navigateur compatible, puis sous Linux les règles udev et fwupd (étape 5)."],
    ["Fenêtre de sélection absente.", "Le navigateur ne prend pas en charge WebUSB ou la page est ouverte en navigation privée : changez de navigateur ou de fenêtre."],
    ["Page ouverte depuis un lien raccourci.", "Fermez-la et saisissez l'adresse officielle vous-même."]
  ],
  reco: [
    "Ajoutez la page officielle à vos favoris pour l'avenir.",
    "Ne laissez aucune autre page demander l'accès USB pendant l'installation."
  ],
  sum: "Ouvrez vous-même https://grapheneos.org/install/web dans un navigateur compatible, vérifiez le domaine, gardez la page ouverte et sélectionnez le téléphone dans la fenêtre WebUSB lorsque le navigateur le demande.",
  quiz: [
    { q: "Quelle est l'adresse officielle de l'installateur Web ?", o: ["https://grapheneos.org/install/web", "https://graphene-install.com", "https://grapheneos.app/web", "https://install-graphene.org"], a: 0, e: "Seul le domaine grapheneos.org est officiel." },
    { q: "Pourquoi la compromission de l'ordinateur pourrait-elle être détectée après l'installation ?", o: ["Grâce au démarrage vérifié et à l'attestation", "Grâce à l'antivirus de l'ordinateur", "Grâce au Wi-Fi", "Elle ne peut pas l'être"], a: 0, e: "C'est ce qu'explique le guide officiel dans la section de vérification." }
  ]
},
/* ---------------------------------------------------------------- 6.12 */
{
  obj: "Déverrouiller le bootloader selon la procédure officielle, en comprenant ses conséquences.",
  intro: [
    "Déverrouiller le bootloader autorise l'installation d'un autre système. C'est une étape délicate : elle efface toutes les données et désactive temporairement la protection du démarrage vérifié.",
    "Elle sera annulée à l'étape 16, lors du reverrouillage."
  ],
  warn: WIPE,
  tech: [
    OFFICIAL,
    "Le guide officiel indique d'utiliser le bouton <b>Unlock bootloader</b> de l'installateur. La commande doit ensuite être confirmée sur le téléphone, et elle efface toutes les données. Pour confirmer, utilisez l'un des boutons de volume pour placer la sélection sur l'option d'acceptation, puis le bouton Marche/Arrêt pour valider."
  ],
  fig: "fastboot-screen",
  steps: [
    "Vérifiez que le téléphone est en mode Fastboot et relié directement à l'ordinateur.",
    "Dans la page officielle, cliquez sur <b>Unlock bootloader</b>.",
    "Si le navigateur le demande, sélectionnez le téléphone dans la fenêtre USB.",
    "Sur le téléphone, un écran de confirmation apparaît : utilisez <b>Volume haut</b> ou <b>Volume bas</b> pour sélectionner l'option qui accepte le déverrouillage.",
    "Appuyez sur <b>Marche/Arrêt</b> pour confirmer.",
    "Attendez que le téléphone revienne à l'interface du bootloader ; la ligne <b>Device state</b> doit indiquer <b>unlocked</b>."
  ],
  result: "Le bootloader est déverrouillé (Device state : unlocked) et le téléphone est de nouveau en mode Fastboot.",
  ex: [
    "Après confirmation avec les boutons de volume et Marche/Arrêt, la ligne Device state passe de locked à unlocked.",
    "Une utilisatrice sélectionne par erreur l'option de refus : rien n'est modifié, elle recommence."
  ],
  err: [
    ["Le bouton n'a aucun effet ou une erreur s'affiche.", "Vérifiez que l'option Déverrouillage OEM a bien été activée (étape 8) et que le téléphone est sélectionné dans la fenêtre USB."],
    ["L'écran de confirmation n'apparaît pas sur le téléphone.", "Vérifiez la connexion, reconnectez le câble et recommencez."],
    ["Mauvaise option sélectionnée sur le téléphone.", "Le déverrouillage est refusé et rien n'est modifié : recommencez depuis le bouton Unlock bootloader."]
  ],
  reco: [
    "Lisez attentivement l'écran de confirmation avant d'appuyer sur Marche/Arrêt.",
    "Ne débranchez rien pendant l'opération."
  ],
  sum: "Cliquez sur Unlock bootloader, confirmez sur le téléphone avec les boutons de volume puis Marche/Arrêt. Toutes les données sont effacées et l'interface du bootloader affiche alors « unlocked ».",
  quiz: [
    { q: "Comment confirme-t-on le déverrouillage sur le téléphone ?", o: ["Avec l'écran tactile", "Avec les boutons de volume pour sélectionner, puis Marche/Arrêt pour valider", "En tapant un code", "En secouant le téléphone"], a: 1, e: "C'est la procédure décrite par le guide officiel." },
    { q: "Que se passe-t-il pour les données lors du déverrouillage ?", o: ["Rien", "Elles sont entièrement effacées", "Elles sont transférées sur l'ordinateur", "Elles sont chiffrées une seconde fois"], a: 1, e: "Le déverrouillage efface toutes les données." }
  ]
},
/* ---------------------------------------------------------------- 6.13 */
{
  obj: "Télécharger l'image officielle de GrapheneOS et la flasher sur le téléphone avec l'installateur Web.",
  intro: [
    "C'est le cœur de l'installation : l'installateur télécharge l'image officielle correspondant à votre appareil, puis remplace le système existant.",
    "Il faut ensuite laisser le script travailler, sans toucher au téléphone."
  ],
  warn: WIPE,
  tech: [
    OFFICIAL,
    { h: "Obtenir l'image", p: [
      "Le guide indique de cliquer sur <b>Download release</b> pour télécharger l'image. Si le navigateur signale un quota de stockage faible, l'installateur affiche un avertissement : il peut alors ne pas y avoir assez d'espace pour l'image."
    ]},
    { h: "Flasher l'image", p: [
      "Le guide indique ensuite de cliquer sur <b>Flash release</b>. Cette opération remplace l'installation existante et efface toutes les données. Le script flashe d'abord le micrologiciel, redémarre dans le bootloader, puis flashe le système d'exploitation. Le guide demande d'éviter toute interaction avec l'appareil jusqu'à la fin du script. Un bouton <b>Reconnect device</b> est également proposé par l'installateur."
    ]}
  ],
  fig: "web-installer",
  steps: [
    "Dans la page officielle, cliquez sur <b>Download release</b>.",
    "Attendez la fin du téléchargement ; si un avertissement de quota de stockage apparaît, libérez de l'espace sur l'ordinateur puis recommencez.",
    "Cliquez sur <b>Flash release</b>.",
    "Sélectionnez le téléphone si le navigateur le demande.",
    "Ne touchez plus au téléphone ni au câble : le script flashe le micrologiciel, redémarre dans le bootloader, puis flashe le système.",
    "Attendez que la page indique que le flashage est terminé."
  ],
  result: "La page indique la fin du flashage et le téléphone est revenu à l'interface du bootloader.",
  ex: [
    "Le navigateur signale un quota de stockage faible : après avoir libéré de l'espace, le téléchargement aboutit.",
    "Pendant le flashage, le téléphone redémarre dans le bootloader ; l'utilisateur clique sur Reconnect device et le script reprend."
  ],
  err: [
    ["Avertissement de quota de stockage faible.", "Libérez de l'espace sur l'ordinateur (au moins 32 Go) et réessayez le téléchargement."],
    ["Le téléphone se déconnecte pendant un redémarrage du script.", "Utilisez le bouton <b>Reconnect device</b> de l'installateur et sélectionnez à nouveau le téléphone."],
    ["Erreurs répétées pendant le flashage.", "Changez de câble ou de port (sans concentrateur), redémarrez le navigateur, puis reprenez le flashage."]
  ],
  reco: [
    "Ne lancez pas d'autres tâches lourdes sur l'ordinateur pendant le flashage.",
    "Gardez le téléphone à plat, sans le déplacer."
  ],
  sum: "Cliquez sur Download release, puis sur Flash release. Le script flashe le micrologiciel, redémarre dans le bootloader et flashe le système. N'interagissez pas avec le téléphone ; utilisez Reconnect device en cas de déconnexion.",
  quiz: [
    { q: "Quel bouton remplace le système existant ?", o: ["Download release", "Flash release", "Lock bootloader", "Reconnect device"], a: 1, e: "Flash release remplace l'installation existante et efface les données." },
    { q: "Que faire si le téléphone se déconnecte pendant un redémarrage du script ?", o: ["Débrancher l'ordinateur", "Utiliser le bouton Reconnect device", "Valider Start sur le téléphone", "Abandonner"], a: 1, e: "L'installateur propose ce bouton pour reprendre la connexion." },
    { q: "Pendant le flashage, que recommande le guide officiel ?", o: ["Manipuler le téléphone pour l'aider", "Éviter toute interaction avec l'appareil jusqu'à la fin du script", "Retirer le câble à mi-parcours", "Ouvrir les paramètres"], a: 1, e: "Toute interaction risque d'interrompre l'opération." }
  ]
},
/* ---------------------------------------------------------------- 6.14 */
{
  obj: "Suivre le déroulement de l'installation, reconnaître les messages normaux et diagnostiquer les problèmes courants.",
  intro: [
    "Pendant le flashage, l'écran du téléphone change, l'appareil redémarre, la connexion USB est interrompue puis rétablie. Ces comportements sont normaux.",
    "Cette étape vous aide à distinguer ce qui est attendu de ce qui demande une intervention."
  ],
  tech: [
    OFFICIAL,
    { h: "Ce qui est normal", ul: [
      "La page affiche une progression et des messages successifs.",
      "Le téléphone redémarre dans le bootloader entre le flashage du micrologiciel et celui du système.",
      "Le navigateur peut redemander de sélectionner le téléphone.",
      "À la fin, le téléphone est de nouveau dans l'interface du bootloader, bootloader toujours déverrouillé."
    ]},
    { h: "Les causes de problèmes les plus fréquentes", ul: [
      "Câble ou concentrateur USB défectueux (cause la plus fréquente selon le guide).",
      "Navigateur non compatible, version Snap/Flatpak, ou navigation privée.",
      "Sous Linux : règles udev absentes ou fwupd qui s'approprie l'appareil.",
      "Espace de stockage insuffisant dans le navigateur.",
      "Installation depuis une machine virtuelle."
    ]}
  ],
  fig: "install-flow",
  steps: [
    "Observez la page sans quitter l'onglet.",
    "Notez les messages affichés à chaque phase.",
    "En cas d'erreur, lisez le message en entier avant toute action.",
    "Appliquez la solution correspondante dans le tableau des erreurs ci-dessous.",
    "Si l'erreur persiste, consultez le guide officiel puis, au besoin, les canaux de discussion officiels du projet, en décrivant précisément votre configuration."
  ],
  result: "Le flashage est terminé sans erreur, ou vous avez identifié et corrigé la cause d'un problème.",
  ex: [
    "Un utilisateur sur ordinateur de bureau subit des erreurs avec le port avant ; sur un port arrière, le flashage se termine sans incident.",
    "Sous Linux, fwupd s'approprie l'appareil ; après <code>sudo systemctl stop fwupd.service</code>, la connexion fonctionne."
  ],
  err: [
    ["Déconnexions répétées.", "Changez de câble (de préférence celui d'origine) et branchez sur un port arrière ou un port d'ordinateur portable, sans concentrateur."],
    ["Appareil introuvable dans la fenêtre USB sous Linux.", "Installez les règles udev indiquées par le guide, reconnectez le câble et arrêtez temporairement fwupd."],
    ["Erreur liée à l'espace de stockage.", "Libérez de l'espace et vérifiez que la fenêtre n'est pas en navigation privée."],
    ["Le téléphone a démarré sur un écran inattendu.", "Revenez en mode Fastboot (Volume bas au démarrage), puis reprenez l'étape interrompue."]
  ],
  reco: [
    "Restez calme : une installation interrompue se reprend généralement depuis l'étape concernée.",
    "Notez précisément chaque message d'erreur ; c'est indispensable pour obtenir de l'aide."
  ],
  sum: "Redémarrages, déconnexions temporaires et demandes de sélection USB sont normaux. Les erreurs viennent surtout des câbles, des concentrateurs, du navigateur, de la configuration Linux, de l'espace disque ou des machines virtuelles.",
  quiz: [
    { q: "Le téléphone redémarre dans le bootloader pendant le flashage. Est-ce normal ?", o: ["Non, il faut tout arrêter", "Oui, le script redémarre l'appareil entre le micrologiciel et le système", "Non, il faut valider Start", "Seulement sur Pixel 6"], a: 1, e: "C'est le comportement décrit par le guide officiel." },
    { q: "Quelle est la première chose à faire en cas d'erreur ?", o: ["Débrancher immédiatement", "Lire le message en entier", "Redémarrer l'ordinateur sans lire", "Changer de téléphone"], a: 1, e: "Le message oriente vers la bonne solution." }
  ]
},
/* ---------------------------------------------------------------- 6.15 */
{
  obj: "Comprendre les redémarrages de l'installation et la place du premier démarrage dans la procédure officielle.",
  intro: [
    "Après le flashage, il est tentant de démarrer immédiatement le nouveau système. La procédure officielle prévoit cependant de reverrouiller d'abord le bootloader, car le verrouillage efface à nouveau les données.",
    "Cette étape clarifie l'ordre des redémarrages."
  ],
  tech: [
    OFFICIAL,
    "Le guide officiel indique que, une fois le flashage terminé, il faut passer au verrouillage du bootloader <b>avant d'utiliser l'appareil</b>, puisque le verrouillage efface de nouveau les données. Le premier démarrage de GrapheneOS a donc lieu après l'étape 16.",
    "Concrètement, à ce stade, le téléphone doit simplement se trouver dans l'interface du bootloader, en mode Fastboot. Si ce n'est pas le cas (par exemple s'il a été éteint), il suffit de le redémarrer dans le bootloader en maintenant Volume bas au démarrage."
  ],
  fig: "fastboot-screen",
  steps: [
    "Vérifiez que le téléphone affiche l'interface du bootloader (« Fastboot Mode »).",
    "Si l'appareil s'est éteint ou a démarré ailleurs, éteignez-le, puis redémarrez-le en maintenant <b>Volume bas</b> jusqu'à l'écran Fastboot.",
    "Ne sélectionnez pas « Start » à ce stade.",
    "Vérifiez que le téléphone est toujours relié directement à l'ordinateur et passez à l'étape 16."
  ],
  result: "Le téléphone est dans l'interface du bootloader, prêt pour le reverrouillage.",
  ex: [
    "Après le flashage, le téléphone affiche de nouveau l'interface du bootloader : l'utilisateur passe directement au verrouillage.",
    "Un utilisateur démarre GrapheneOS et configure son compte avant de verrouiller : toute la configuration est perdue au verrouillage."
  ],
  err: [
    ["Démarrer GrapheneOS et commencer à le configurer avant le reverrouillage.", "Le verrouillage effacera tout : revenez en mode Fastboot et verrouillez d'abord."],
    ["Le téléphone ne revient pas en mode Fastboot.", "Éteignez-le complètement, puis maintenez Volume bas pendant l'allumage."]
  ],
  reco: [
    "Respectez l'ordre officiel : flasher, verrouiller, puis démarrer.",
    "Ne débranchez pas encore le câble."
  ],
  sum: "Selon la procédure officielle, le bootloader est reverrouillé avant le premier usage de l'appareil, car le verrouillage efface de nouveau les données. À ce stade, le téléphone doit simplement être en mode Fastboot.",
  quiz: [
    { q: "Pourquoi ne pas configurer GrapheneOS avant le reverrouillage ?", o: ["Parce que le verrouillage efface de nouveau les données", "Parce que l'écran ne fonctionne pas", "Parce que le Wi-Fi est désactivé", "Ce n'est pas un problème"], a: 0, e: "Toute configuration serait perdue au verrouillage." },
    { q: "Comment revenir en mode Fastboot si le téléphone s'est éteint ?", o: ["Maintenir Volume bas pendant l'allumage", "Retirer la carte SIM", "Recharger à 100 %", "Réinstaller le navigateur"], a: 0, e: "C'est la même méthode qu'à l'étape 10." }
  ]
},
/* ---------------------------------------------------------------- 6.16 */
{
  obj: "Reverrouiller le bootloader pour rétablir le démarrage vérifié complet, puis démarrer GrapheneOS.",
  intro: [
    "Le reverrouillage est essentiel : il rétablit la chaîne de confiance du démarrage vérifié, désormais avec la clé de GrapheneOS, et empêche l'utilisation de Fastboot pour flasher, formater ou effacer des partitions.",
    "Un appareil laissé déverrouillé perd une grande partie de sa protection."
  ],
  warn: WIPE,
  tech: [
    OFFICIAL,
    "Le guide officiel indique que le verrouillage du bootloader active le démarrage vérifié complet et empêche l'utilisation de Fastboot pour flasher, formater ou effacer des partitions. Il faut cliquer sur <b>Lock bootloader</b> alors que le téléphone est dans l'interface du bootloader. Le verrouillage efface à nouveau les données, et se confirme de la même façon que le déverrouillage.",
    "Ensuite, la section « Booting » du guide indique qu'il suffit d'appuyer sur le bouton Marche/Arrêt, l'option par défaut « Start » étant sélectionnée, pour démarrer GrapheneOS."
  ],
  fig: "boot-chain",
  steps: [
    "Le téléphone étant en mode Fastboot et relié à l'ordinateur, cliquez sur <b>Lock bootloader</b> dans la page officielle.",
    "Sélectionnez le téléphone si le navigateur le demande.",
    "Sur le téléphone, utilisez les boutons de volume pour sélectionner l'option qui accepte le verrouillage.",
    "Appuyez sur <b>Marche/Arrêt</b> pour confirmer.",
    "Vérifiez que la ligne <b>Device state</b> indique <b>locked</b>.",
    "Avec l'option par défaut <b>Start</b> sélectionnée, appuyez sur <b>Marche/Arrêt</b> pour démarrer GrapheneOS.",
    "Vous pouvez maintenant débrancher le câble."
  ],
  result: "Le bootloader est verrouillé (Device state : locked) et GrapheneOS démarre, en affichant au démarrage un avertissement jaune signalant un système d'exploitation différent.",
  caution: "Ne laissez jamais l'appareil en usage quotidien avec un bootloader déverrouillé : le démarrage vérifié ne protège alors plus le système.",
  ex: [
    "Après confirmation, Device state indique locked ; le démarrage affiche l'avertissement jaune attendu.",
    "Un utilisateur pressé débranche le câble avant de vérifier : il reconnecte, vérifie « locked » et démarre."
  ],
  err: [
    ["Mauvaise option sélectionnée lors de la confirmation.", "Le verrouillage est refusé : cliquez de nouveau sur Lock bootloader et recommencez."],
    ["Le téléphone n'est plus détecté.", "Utilisez Reconnect device ou reconnectez le câble, puis recommencez."],
    ["L'avertissement jaune au démarrage inquiète.", "Il est normal pour un système tiers verrouillé avec sa propre clé ; vous vérifierez l'empreinte à l'étape 17."]
  ],
  reco: [
    "Vérifiez systématiquement « locked » avant de débrancher.",
    "Notez la date d'installation dans votre fiche d'appareil."
  ],
  sum: "Cliquez sur Lock bootloader, confirmez sur le téléphone, vérifiez « locked », puis démarrez avec Start. Le démarrage vérifié complet est rétabli avec la clé de GrapheneOS, signalé par l'avertissement jaune au démarrage.",
  quiz: [
    { q: "Que permet le reverrouillage du bootloader ?", o: ["De rétablir le démarrage vérifié complet et d'empêcher le flashage via Fastboot", "D'installer Google Play", "D'accélérer le téléphone", "De désactiver le chiffrement"], a: 0, e: "C'est ce qu'indique le guide officiel." },
    { q: "Quel état de démarrage est attendu après le reverrouillage avec GrapheneOS ?", o: ["Vert", "Jaune, avec avertissement de système d'exploitation différent", "Orange", "Rouge"], a: 1, e: "Le bootloader est verrouillé avec une clé personnalisée." },
    { q: "Le verrouillage efface-t-il les données ?", o: ["Non", "Oui, de nouveau", "Seulement les photos", "Seulement sous Linux"], a: 1, e: "C'est pourquoi il faut verrouiller avant de configurer l'appareil." }
  ]
},
/* ---------------------------------------------------------------- 6.17 */
{
  obj: "Effectuer les vérifications finales : désactivation du déverrouillage OEM, contrôle de l'empreinte de la clé de démarrage et attestation matérielle avec Auditor.",
  intro: [
    "L'installation est terminée, mais une installation sérieuse se vérifie. GrapheneOS fournit deux méthodes complémentaires pour confirmer que le matériel, le micrologiciel et le système sont authentiques.",
    "Le guide officiel rappelle que ces vérifications permettraient de détecter un système malveillant installé par un ordinateur compromis."
  ],
  tech: [
    OFFICIAL,
    { h: "Désactiver le déverrouillage OEM", p: [
      "Selon le guide officiel, le dernier écran de la configuration initiale comporte une option, cochée par défaut, qui désactive le déverrouillage OEM ; cette désactivation est recommandée. Elle peut aussi être modifiée plus tard dans les options pour les développeurs."
    ]},
    { h: "L'empreinte de la clé de démarrage vérifié", p: [
      "Au démarrage d'un système tiers, l'appareil affiche une notice jaune avec l'identifiant de ce système, basé sur l'empreinte SHA-256 de la clé publique de démarrage vérifié. Le guide précise qu'à partir de la 6e génération de Pixel, l'empreinte complète est affichée et peut être comparée aux empreintes officielles publiées sur la page d'installation, une par appareil. Cette vérification manuelle est utile, mais pas nécessaire au fonctionnement du démarrage vérifié."
    ]},
    { h: "L'attestation matérielle avec Auditor", p: [
      "L'application <b>Auditor</b> utilise le démarrage vérifié et l'attestation matérielle pour vérifier que le matériel, le micrologiciel et le système sont authentiques. Les résultats ne s'affichent pas sur l'appareil vérifié : il faut un second appareil Android équipé d'Auditor, pour une vérification locale par code QR. Un service optionnel de surveillance planifiée avec alertes par e-mail existe aussi. Le tutoriel officiel se trouve sur <code>attestation.app/tutorial</code>."
    ]}
  ],
  fig: "boot-chain",
  steps: [
    "Pendant la configuration initiale, laissez cochée l'option de désactivation du <b>déverrouillage OEM</b> sur le dernier écran.",
    "Au prochain redémarrage, photographiez l'écran jaune affichant l'empreinte de la clé.",
    "Comparez cette empreinte, caractère par caractère, avec celle publiée pour votre modèle dans la section « Verified boot key hash » de <code>grapheneos.org/install/web</code>.",
    "Sur un second appareil Android, installez Auditor depuis une source officielle et suivez le tutoriel <code>attestation.app/tutorial</code> pour vérifier votre téléphone par code QR.",
    "Vérifiez que l'état de démarrage est bien « jaune » et que le bootloader est verrouillé."
  ],
  result: "Le déverrouillage OEM est désactivé, l'empreinte correspond à la valeur officielle et l'attestation Auditor confirme l'authenticité de l'installation.",
  ex: [
    "L'empreinte affichée au démarrage correspond caractère par caractère à la valeur officielle publiée pour son modèle.",
    "Auditor, sur le téléphone d'un proche de confiance, confirme l'authenticité de l'installation par code QR."
  ],
  err: [
    ["L'empreinte ne correspond pas à la valeur officielle.", "Ne faites pas confiance à l'appareil : n'y saisissez aucune donnée et demandez de l'aide sur les canaux officiels."],
    ["Pas de second appareil pour Auditor.", "La vérification par empreinte reste possible ; Auditor pourra être utilisé plus tard avec un appareil emprunté de confiance."],
    ["Déverrouillage OEM resté actif.", "Désactivez-le dans Paramètres › Système › Options pour les développeurs."]
  ],
  reco: [
    "Faites cette vérification à chaque installation, même si tout semble normal.",
    "Pour un usage professionnel ou à risque, envisagez la surveillance planifiée proposée par Auditor."
  ],
  sum: "Désactivez le déverrouillage OEM (dernier écran de la configuration), comparez l'empreinte de la clé affichée au démarrage avec la valeur officielle de votre modèle, et vérifiez l'appareil avec Auditor depuis un second appareil.",
  quiz: [
    { q: "Pourquoi un second appareil est-il nécessaire pour Auditor ?", o: ["Parce que les résultats ne s'affichent pas sur l'appareil vérifié", "Pour charger la batterie", "Pour télécharger GrapheneOS", "Ce n'est pas nécessaire"], a: 0, e: "La vérification locale se fait par code QR entre deux appareils." },
    { q: "Où trouver les empreintes officielles de la clé de démarrage vérifié ?", o: ["Sur la page officielle d'installation, section Verified boot key hash", "Dans un forum", "Sur la boîte du téléphone", "Dans les contacts"], a: 0, e: "Le guide publie une empreinte par appareil." },
    { q: "L'empreinte affichée ne correspond pas à la valeur officielle. Que faire ?", o: ["L'ignorer", "Ne pas faire confiance à l'appareil et demander de l'aide sur les canaux officiels", "Désactiver le chiffrement", "Installer Google Play"], a: 1, e: "Une différence peut signaler un système non authentique." }
  ]
},
/* ---------------------------------------------------------------- 6.18 */
{
  obj: "Réaliser la configuration initiale de GrapheneOS et mettre en place les réglages essentiels dès le premier jour.",
  intro: [
    "Félicitations : GrapheneOS est installé et vérifié. Les premiers réglages conditionnent le niveau de protection au quotidien.",
    "Cette étape couvre l'essentiel du premier jour ; le module 7 approfondit chaque sujet."
  ],
  tech: [
    OFFICIAL,
    "L'assistant de configuration propose notamment le choix de la langue, la connexion à un réseau, la configuration du verrouillage de l'écran et, sur son dernier écran, la désactivation du déverrouillage OEM. Les mises à jour du système sont ensuite gérées automatiquement par le système de mises à jour de GrapheneOS.",
    "Pour aller plus loin, le guide officiel renvoie au guide d'utilisation (<code>grapheneos.org/usage</code>) et à la FAQ."
  ],
  fig: "profiles",
  steps: [
    "Suivez l'assistant : langue, réseau, date et heure.",
    "Définissez un code PIN aléatoire de 6 chiffres ou plus, ou un mot de passe (module 3, leçon 2).",
    "Enregistrez vos empreintes digitales si vous le souhaitez.",
    "Sur le dernier écran, laissez cochée la désactivation du déverrouillage OEM.",
    "Ouvrez <b>Paramètres › Système › Mise à jour du système</b> et vérifiez que les mises à jour automatiques sont actives.",
    "Installez vos premières applications depuis des sources fiables, en accordant les permissions au minimum.",
    "Décidez de votre organisation en profils et de l'éventuelle installation de Google Play en bac à sable (module 7).",
    "Restaurez vos données depuis vos sauvegardes."
  ],
  result: "GrapheneOS est configuré avec un verrouillage robuste, des mises à jour automatiques et une première organisation des applications.",
  ex: [
    "Une utilisatrice réinstalle d'abord ses cinq applications essentielles, puis ajoute les autres au fil des semaines.",
    "Un utilisateur crée dès le premier jour un profil « Services » pour les applications qui exigent Google Play."
  ],
  err: [
    ["Installer immédiatement toutes ses anciennes applications.", "Réinstallez progressivement, en vous demandant pour chacune si elle est utile."],
    ["Accorder toutes les permissions pour « que tout marche ».", "Partez du minimum, y compris pour les permissions Réseau et Capteurs."],
    ["Installer Google Play dans le profil principal par réflexe.", "Évaluez d'abord si un profil dédié est plus adapté."]
  ],
  reco: [
    "Prenez une semaine pour vous familiariser avant d'activer les fonctions avancées.",
    "Enchaînez avec le module 7 pour configurer finement votre appareil.",
    "Conservez la fiche de votre appareil à jour : modèle, date d'installation, réglages choisis."
  ],
  sum: "La configuration initiale comprend la langue, le réseau, un verrouillage robuste, la désactivation du déverrouillage OEM et la vérification des mises à jour automatiques. Les applications et les données sont ensuite réintroduites progressivement, selon une organisation réfléchie.",
  quiz: [
    { q: "Quel réglage figure sur le dernier écran de la configuration initiale ?", o: ["La désactivation du déverrouillage OEM", "L'installation de Google Play", "Le choix du fond d'écran", "Le root"], a: 0, e: "L'option est cochée par défaut et sa désactivation est recommandée." },
    { q: "Quelle est la bonne approche pour réinstaller ses applications ?", o: ["Tout réinstaller immédiatement avec toutes les permissions", "Réinstaller progressivement, avec des permissions minimales", "Ne rien installer", "Installer depuis des sites miroirs"], a: 1, e: "C'est l'occasion de faire le tri et de réduire la surface d'exposition." }
  ]
}
];
})();
