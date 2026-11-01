/* Module 2 : Identifier les menaces sur Android */
window.ASG = window.ASG || {}; ASG.content = ASG.content || {};
ASG.content.m2 = [
/* ---------------------------------------------------------------- 2.1 */
{
  obj: "Reconnaître les grandes familles de logiciels malveillants Android, leurs objectifs et leurs modes de diffusion.",
  intro: [
    "Le terme « malware » recouvre des réalités très différentes : une application qui affiche des publicités abusives n'a pas le même impact qu'un cheval de Troie qui vide un compte bancaire. Les distinguer permet d'évaluer la gravité d'une situation et de réagir de façon proportionnée.",
    "Sur Android, la grande majorité des infections ne résulte pas d'une faille technique sophistiquée, mais de l'installation volontaire d'une application trompeuse."
  ],
  tech: [
    { h: "Les principales familles", ul: [
      "<b>Adwares et fraudes publicitaires</b> : affichage agressif de publicités, clics simulés en arrière-plan.",
      "<b>Chevaux de Troie bancaires</b> : vol d'identifiants via de faux écrans superposés ou le service d'accessibilité.",
      "<b>Logiciels espions (spywares, stalkerwares)</b> : collecte de messages, position, appels, à l'insu de la victime.",
      "<b>Droppers et loaders</b> : applications d'apparence anodine qui téléchargent ensuite la charge malveillante.",
      "<b>Fraudes aux services surtaxés</b> : abonnements SMS ou facturation opérateur à l'insu de l'utilisateur.",
      "<b>Rançongiciels mobiles</b> : blocage de l'écran ou chiffrement de fichiers accessibles, avec demande de paiement.",
      "<b>Botnets</b> : appareils enrôlés pour envoyer du spam, relayer du trafic ou participer à des attaques."
    ]},
    { h: "Les vecteurs de diffusion", p: [
      "Les vecteurs les plus fréquents sont les APK diffusés par SMS, messageries ou sites web, les fausses versions d'applications populaires, les applications du magasin officiel devenues malveillantes après une mise à jour, et plus rarement l'exploitation de vulnérabilités."
    ]}
  ],
  fig: "threat-map",
  steps: [
    "Dressez la liste des applications installées au cours des trois derniers mois.",
    "Pour chacune, notez sa provenance : magasin officiel, site de l'éditeur, lien reçu, fichier partagé.",
    "Identifiez celles qui n'ont pas été installées depuis une source officielle.",
    "Vérifiez leurs autorisations, en particulier l'accessibilité, les SMS et la superposition d'écran.",
    "Supprimez toute application dont l'origine ou l'utilité est douteuse."
  ],
  result: "Vous disposez d'un inventaire de vos applications classées par provenance et par niveau de risque.",
  ex: [
    "Une fausse application de « suivi de colis » reçue par SMS installe un cheval de Troie bancaire.",
    "Une application de lampe torche du magasin officiel, saine au départ, est rachetée puis mise à jour avec un module publicitaire abusif."
  ],
  err: [
    ["Penser que seules les applications hors magasin peuvent être malveillantes.", "Les magasins officiels filtrent beaucoup mais pas tout : restez attentif aux autorisations et aux avis récents."],
    ["Se fier uniquement au nombre de téléchargements.", "Les chiffres peuvent être gonflés ; vérifiez l'éditeur, son site et l'historique de l'application."],
    ["Ignorer une hausse soudaine de consommation de batterie ou de données.", "Ce sont des signaux d'alerte ; analysez les applications concernées dans les réglages."]
  ],
  reco: [
    "Installez vos applications uniquement depuis des sources fiables et vérifiables.",
    "Réduisez le nombre d'applications installées au strict nécessaire.",
    "Activez les protections du magasin d'applications et maintenez le système à jour."
  ],
  sum: "Les malwares Android vont de l'adware au logiciel espion, en passant par les chevaux de Troie bancaires, les droppers, la fraude surtaxée et les rançongiciels. La plupart arrivent par une installation volontaire trompée. L'inventaire régulier des applications et de leur provenance est une défense simple et efficace.",
  quiz: [
    { q: "Quel est le vecteur d'infection le plus fréquent sur Android ?", o: ["Une faille matérielle de l'écran", "L'installation volontaire d'une application trompeuse", "La recharge sur une prise murale", "Le mode sombre"], a: 1, e: "La plupart des infections reposent sur la tromperie de l'utilisateur, non sur une faille technique." },
    { q: "Qu'est-ce qu'un dropper ?", o: ["Une application qui télécharge ensuite la charge malveillante", "Un câble USB défectueux", "Un antivirus", "Une mise à jour système"], a: 0, e: "Le dropper semble anodin pour passer les contrôles, puis récupère le code malveillant." },
    { q: "Une application saine du magasin officiel peut-elle devenir malveillante ?", o: ["Non, jamais", "Oui, après un rachat ou une mise à jour", "Seulement sur iPhone", "Seulement si le Wi-Fi est coupé"], a: 1, e: "Des applications ont changé de comportement après un rachat ou une mise à jour." }
  ]
},
/* ---------------------------------------------------------------- 2.2 */
{
  obj: "Comprendre le fonctionnement des applications espionnes, reconnaître les signes de leur présence et savoir réagir sans se mettre en danger.",
  intro: [
    "Les applications espionnes (stalkerwares) sont souvent installées par une personne de l'entourage ayant eu un accès physique au téléphone : conjoint, ancien partenaire, employeur abusif. Elles transmettent en continu messages, appels, photos et position.",
    "Ce sujet touche à la sécurité personnelle : la réaction doit être réfléchie, car supprimer brutalement l'application peut alerter la personne qui surveille."
  ],
  tech: [
    { h: "Comment elles fonctionnent", p: [
      "Ces applications s'installent généralement hors du magasin officiel et demandent des accès très larges : service d'accessibilité, lecture des notifications, administration de l'appareil, position en arrière-plan, SMS, micro. Elles masquent souvent leur icône et prennent un nom anodin (« Service système », « Sync »)."
    ]},
    { h: "Les signes possibles", ul: [
      "Application inconnue disposant de l'accès à l'accessibilité ou aux notifications.",
      "Application d'administration de l'appareil que vous n'avez pas activée.",
      "Option « sources inconnues » activée pour une application inattendue.",
      "Consommation anormale de batterie ou de données en arrière-plan.",
      "Une personne connaît des informations qu'elle ne devrait pas connaître."
    ]},
    { h: "Les surveillances sans application", p: [
      "La surveillance peut aussi passer par vos comptes : un tiers connaissant le mot de passe de votre compte Google peut consulter votre historique de position, vos photos synchronisées ou vos e-mails sans rien installer sur le téléphone. Le contrôle des comptes fait donc partie de l'analyse."
    ]}
  ],
  fig: "threat-map",
  steps: [
    "Avant toute action, évaluez votre sécurité personnelle ; si nécessaire, contactez une structure d'aide spécialisée depuis un autre appareil.",
    "Ouvrez <b>Paramètres › Accessibilité</b> et notez les services activés.",
    "Ouvrez les <b>accès spéciaux des applications</b> : accès aux notifications, applications d'administration de l'appareil, installation d'applications inconnues.",
    "Consultez <b>Paramètres › Applications</b> en affichant aussi les applications système, et recherchez les noms inconnus.",
    "Vérifiez dans votre compte Google la liste des appareils connectés et le partage de position.",
    "Selon votre situation, documentez (captures d'écran) avant de supprimer, puis changez vos mots de passe depuis un appareil sûr."
  ],
  result: "Vous savez si des accès anormaux existent et vous avez un plan d'action adapté à votre situation.",
  caution: "Si vous pensez être surveillé par une personne violente, privilégiez votre sécurité : la suppression de l'application peut être remarquée. Faites-vous accompagner par une structure spécialisée.",
  ex: [
    "Une application nommée « Wi-Fi Service » dispose de l'accessibilité et de l'accès aux notifications : c'est le profil type d'un stalkerware.",
    "Un ancien partenaire connaît vos déplacements alors qu'aucune application suspecte n'est installée : le partage de position du compte Google était resté actif."
  ],
  err: [
    ["Supprimer l'application sans réfléchir aux conséquences.", "Évaluez d'abord le risque personnel et conservez des preuves si une démarche est envisagée."],
    ["Changer ses mots de passe depuis le téléphone potentiellement surveillé.", "Utilisez un appareil sûr pour modifier les mots de passe."],
    ["Oublier les comptes en ligne.", "Vérifiez appareils connectés, partages de position et méthodes de récupération."]
  ],
  reco: [
    "Ne laissez jamais votre téléphone déverrouillé sans surveillance et ne partagez pas votre code.",
    "En cas de doute sérieux, une réinitialisation complète, suivie d'un changement de tous les mots de passe depuis un appareil sûr, reste la solution la plus fiable.",
    "Pour une analyse technique approfondie, des outils comme MVT existent, mais leur usage demande des compétences avancées."
  ],
  sum: "Les applications espionnes exploitent l'accès physique, l'accessibilité, les notifications et l'administration de l'appareil. Leur détection passe par l'examen de ces accès et des comptes en ligne. La réaction doit tenir compte de la sécurité personnelle de la victime.",
  quiz: [
    { q: "Quel accès est particulièrement révélateur d'une application espionne ?", o: ["L'accès au service d'accessibilité par une application inconnue", "L'accès à la lampe torche", "Le mode sombre", "Le choix de la sonnerie"], a: 0, e: "L'accessibilité permet de lire l'écran et d'agir : c'est un accès recherché par les espions." },
    { q: "Pourquoi faut-il changer ses mots de passe depuis un autre appareil ?", o: ["Pour aller plus vite", "Parce que le téléphone surveillé peut transmettre les nouveaux mots de passe", "Parce que c'est obligatoire", "Pour économiser la batterie"], a: 1, e: "Un logiciel espion actif capturerait les nouveaux identifiants." },
    { q: "Une surveillance peut-elle avoir lieu sans aucune application installée ?", o: ["Non, jamais", "Oui, via l'accès à vos comptes en ligne", "Seulement par Bluetooth", "Seulement la nuit"], a: 1, e: "L'accès au compte Google suffit pour consulter position, photos ou e-mails synchronisés." }
  ]
},
/* ---------------------------------------------------------------- 2.3 */
{
  obj: "Comprendre le mode opératoire des chevaux de Troie Android, en particulier bancaires, et identifier les réglages qui limitent leur efficacité.",
  intro: [
    "Un cheval de Troie se présente comme une application utile (lecteur PDF, mise à jour, outil de nettoyage) tout en cachant une fonction malveillante. Sur Android, les chevaux de Troie bancaires sont parmi les menaces les plus rentables pour les criminels.",
    "Leur force repose rarement sur une faille : ils convainquent l'utilisateur de leur accorder des accès puissants."
  ],
  tech: [
    { h: "La chaîne d'attaque typique", ul: [
      "<b>Appât</b> : message ou publicité incitant à installer une application.",
      "<b>Installation</b> : souvent hors magasin, après activation de l'installation d'applications inconnues.",
      "<b>Escalade</b> : demande insistante du service d'accessibilité, présenté comme « nécessaire au fonctionnement ».",
      "<b>Exploitation</b> : faux écrans de connexion superposés aux applications bancaires, lecture des codes reçus par SMS ou notification, actions à distance.",
      "<b>Persistance</b> : masquage de l'icône, blocage de la désinstallation via l'accessibilité."
    ]},
    { h: "Les protections d'Android", p: [
      "Les versions récentes d'Android restreignent l'accès à certains réglages sensibles (accessibilité, accès aux notifications) pour les applications installées hors magasin : on parle de <b>paramètres restreints</b>, introduits avec Android 13. L'utilisateur doit les autoriser explicitement. Les attaquants contournent parfois cette protection en guidant la victime pas à pas : la vigilance reste indispensable."
    ]}
  ],
  fig: "threat-map",
  steps: [
    "Ouvrez <b>Paramètres › Accessibilité</b> et vérifiez que seules des applications connues y figurent.",
    "Désactivez tout service que vous ne reconnaissez pas.",
    "Ouvrez <b>Accès spéciaux des applications › Affichage par-dessus d'autres applications</b> et retirez ce droit aux applications qui n'en ont pas besoin.",
    "Ouvrez <b>Accès aux notifications</b> et retirez l'accès aux applications inconnues.",
    "Si une application empêche sa désinstallation, redémarrez en mode sans échec (procédure variable selon le fabricant) puis supprimez-la."
  ],
  result: "Aucune application inconnue ne dispose de l'accessibilité, de la superposition ou de l'accès aux notifications.",
  ex: [
    "Une application « Lecteur PDF » insiste pour obtenir l'accessibilité afin de « lire les documents » : une fois accordée, elle affiche un faux écran de connexion bancaire.",
    "Un cheval de Troie intercepte le code de validation envoyé par SMS par la banque et valide un virement à votre insu."
  ],
  err: [
    ["Accorder l'accessibilité parce que l'application « ne fonctionne pas sinon ».", "Une application légitime d'usage courant n'a pas besoin de l'accessibilité : désinstallez-la."],
    ["Autoriser les paramètres restreints sur demande d'un interlocuteur au téléphone.", "Aucune banque ni aucun service client ne vous le demandera : raccrochez."],
    ["Continuer à utiliser l'appli bancaire après une infection.", "Contactez immédiatement votre banque et changez vos identifiants depuis un appareil sain."]
  ],
  reco: [
    "Préférez une validation bancaire par l'application officielle ou par clé de sécurité plutôt que par SMS.",
    "Considérez toute demande d'accessibilité comme exceptionnelle.",
    "Activez les alertes de transactions bancaires pour détecter rapidement une opération suspecte."
  ],
  sum: "Les chevaux de Troie bancaires se déguisent en applications utiles, obtiennent l'accessibilité ou la superposition, puis volent identifiants et codes. Les paramètres restreints d'Android limitent ces abus, mais la vigilance face aux demandes d'accès reste la meilleure protection.",
  quiz: [
    { q: "Quel accès un cheval de Troie bancaire cherche-t-il le plus souvent à obtenir ?", o: ["Le service d'accessibilité", "La lampe torche", "Le vibreur", "Le fond d'écran"], a: 0, e: "L'accessibilité lui permet de lire l'écran et d'agir à votre place." },
    { q: "À quoi servent les « paramètres restreints » introduits par Android 13 ?", o: ["À limiter l'accès aux réglages sensibles pour les applications installées hors magasin", "À réduire la luminosité", "À bloquer les appels", "À désactiver le Wi-Fi"], a: 0, e: "Ils imposent une autorisation explicite avant d'accorder l'accessibilité ou l'accès aux notifications à ces applications." },
    { q: "Un conseiller au téléphone vous demande d'autoriser un paramètre restreint. Que faire ?", o: ["Obéir rapidement", "Raccrocher : c'est une manœuvre d'escroquerie", "Redémarrer puis obéir", "Lui donner votre code"], a: 1, e: "Aucun service légitime ne demande cette manipulation." }
  ]
},
/* ---------------------------------------------------------------- 2.4 */
{
  obj: "Reconnaître les différentes formes de phishing sur mobile (SMS, messageries, e-mails, appels) et adopter des réflexes de vérification fiables.",
  intro: [
    "Le phishing, ou hameçonnage, vise à vous faire saisir vos informations sur un faux site ou à vous faire réaliser une action à votre détriment. Sur smartphone, il est particulièrement efficace : les adresses web sont tronquées, les messages arrivent à tout moment, et l'on réagit vite.",
    "Aucun système d'exploitation, même très sécurisé, ne vous protège entièrement si vous saisissez vous-même vos identifiants sur un faux site."
  ],
  tech: [
    { h: "Les variantes", ul: [
      "<b>Smishing</b> : phishing par SMS (colis bloqué, amende, remboursement).",
      "<b>Phishing par messagerie</b> : WhatsApp, Telegram, réseaux sociaux, souvent depuis le compte piraté d'un proche.",
      "<b>Vishing</b> : appel d'un faux conseiller bancaire ou d'un faux support technique.",
      "<b>Quishing</b> : QR code piégé collé sur un horodateur ou envoyé par courrier.",
      "<b>Fraude au code de vérification</b> : un interlocuteur vous demande de lui transmettre un code reçu par SMS."
    ]},
    { h: "Les leviers psychologiques", p: [
      "Urgence (« votre compte sera bloqué dans 2 heures »), peur, appât du gain, autorité apparente, ou familiarité (« c'est moi, j'ai changé de numéro »). Ces leviers court-circuitent la réflexion."
    ]},
    { h: "Les indices techniques", p: [
      "Domaine ressemblant mais différent (lettre ajoutée, tiret, extension inhabituelle), lien raccourci, demande de paiement minime, demande de code reçu par SMS. Le cadenas du navigateur indique seulement que la connexion est chiffrée, <b>pas</b> que le site est légitime."
    ]}
  ],
  fig: "phishing",
  steps: [
    "Face à un message inattendu, ne cliquez pas : prenez dix secondes de recul.",
    "Identifiez le levier utilisé (urgence, peur, gain, autorité).",
    "Ouvrez vous-même l'application officielle ou tapez l'adresse connue du service, sans passer par le lien.",
    "En cas d'appel, raccrochez et rappelez le numéro officiel figurant sur votre carte ou le site du service.",
    "Ne communiquez jamais un code reçu par SMS à un interlocuteur.",
    "Signalez le message comme spam dans l'application de messagerie, puis supprimez-le."
  ],
  result: "Vous vérifiez systématiquement par un canal indépendant avant toute action.",
  ex: [
    "« Votre colis est en attente, réglez 1,99 € de frais » : le lien mène à un faux site qui collecte les données de votre carte.",
    "Un « conseiller bancaire » appelle pour « bloquer une fraude » et demande le code reçu par SMS : ce code sert en réalité à valider un paiement."
  ],
  err: [
    ["Se fier au nom d'expéditeur affiché.", "Les noms d'expéditeur de SMS et les numéros peuvent être usurpés : vérifiez par un autre canal."],
    ["Croire qu'un site avec cadenas est forcément légitime.", "Le cadenas n'indique que le chiffrement ; vérifiez le nom de domaine exact."],
    ["Transmettre un code de vérification à un proche « en difficulté » sur une messagerie.", "Appelez directement la personne : son compte a pu être piraté."]
  ],
  reco: [
    "Utilisez un gestionnaire de mots de passe : il ne remplira pas automatiquement vos identifiants sur un faux domaine.",
    "Privilégiez les clés d'accès (passkeys), résistantes au phishing par conception.",
    "Activez les filtres anti-spam de l'application Messages."
  ],
  sum: "Le phishing mobile prend la forme de SMS, messages, appels ou QR codes, et exploite l'urgence et la peur. La vérification par un canal indépendant, le refus de transmettre tout code et l'usage de clés d'accès sont les défenses les plus efficaces.",
  quiz: [
    { q: "Que garantit le cadenas affiché dans la barre d'adresse ?", o: ["Que le site est légitime", "Que la connexion est chiffrée, pas que le site est authentique", "Que le site est gratuit", "Que le site est approuvé par Google"], a: 1, e: "Un site frauduleux peut parfaitement disposer d'un certificat et du cadenas." },
    { q: "Un interlocuteur vous demande le code reçu par SMS pour « annuler une fraude ». Que faire ?", o: ["Le lui donner rapidement", "Refuser et raccrocher, puis contacter le service par son numéro officiel", "Lui donner seulement la moitié", "Le publier pour vérification"], a: 1, e: "Ce code sert à valider une opération : ne le communiquez jamais." },
    { q: "Pourquoi un gestionnaire de mots de passe aide-t-il contre le phishing ?", o: ["Il bloque tous les SMS", "Il ne propose pas les identifiants sur un domaine qui ne correspond pas", "Il accélère le navigateur", "Il chiffre les photos"], a: 1, e: "Le remplissage automatique est lié au domaine exact enregistré." }
  ]
},
/* ---------------------------------------------------------------- 2.5 */
{
  obj: "Comprendre ce qu'est un fichier APK, les risques liés à l'installation hors magasin, et savoir évaluer un APK avant de l'installer.",
  intro: [
    "Un APK (Android Package) est le fichier d'installation d'une application Android. Installer un APK obtenu en dehors d'un magasin d'applications, ce que l'on appelle le « sideloading », est possible et parfois légitime, mais c'est aussi le principal vecteur des malwares Android.",
    "L'objectif n'est pas d'interdire toute installation hors magasin, mais de savoir évaluer le risque."
  ],
  tech: [
    { h: "Ce que contient un APK", p: [
      "Un APK est une archive contenant le code de l'application, ses ressources, son manifeste (qui déclare notamment les permissions demandées) et une <b>signature</b>. Android exige que chaque APK soit signé ; les mises à jour d'une application doivent être signées avec la même clé. Le format AAB (Android App Bundle) est utilisé pour la publication sur Google Play, qui génère ensuite les APK adaptés à chaque appareil."
    ]},
    { h: "Les risques spécifiques", ul: [
      "<b>Applications modifiées</b> : versions « premium gratuites » ou « mods » contenant du code ajouté.",
      "<b>Fausses applications</b> : imitation d'une application connue, signée par un inconnu.",
      "<b>APK envoyés par message</b> : souvent présentés comme une mise à jour ou une application de suivi.",
      "<b>Absence de mises à jour automatiques</b> : l'application installée manuellement peut rester vulnérable."
    ]},
    { h: "Les sources plus fiables", p: [
      "Le site officiel de l'éditeur, un magasin reconnu (Google Play, magasin du fabricant), ou des magasins spécialisés dont le modèle de confiance est documenté. Sur GrapheneOS, l'App Store officiel du projet distribue les applications du projet."
    ]}
  ],
  fig: "apk-check",
  steps: [
    "Demandez-vous d'abord si l'application est disponible dans un magasin officiel : si oui, installez-la depuis ce magasin.",
    "Vérifiez que le lien de téléchargement provient du domaine officiel de l'éditeur.",
    "Si l'éditeur publie une empreinte de son certificat de signature, comparez-la avec celle de l'APK (outil <code>apksigner</code> du SDK Android, usage avancé).",
    "Pendant l'installation, comparez les permissions demandées avec la fonction de l'application.",
    "Une fois l'APK installé, désactivez à nouveau l'autorisation « installer des applications inconnues » pour l'application qui a servi à l'installer.",
    "Supprimez le fichier APK téléchargé."
  ],
  result: "Seuls des APK provenant de sources vérifiées sont installés, et l'autorisation d'installation est refermée après usage.",
  ex: [
    "Un message WhatsApp propose « la nouvelle version de l'application de la banque » sous forme de fichier APK : une banque ne distribue jamais ses applications ainsi.",
    "Une version « débloquée » d'une application de streaming payante contient un module qui intercepte les SMS."
  ],
  err: [
    ["Installer une version « mod » gratuite d'une application payante.", "Ces versions sont souvent modifiées de façon malveillante ; utilisez la version officielle."],
    ["Laisser l'installation d'applications inconnues activée pour le navigateur.", "Désactivez cette autorisation dès que l'installation est terminée."],
    ["Ouvrir un APK reçu par message d'un proche.", "Le compte de votre proche a pu être piraté ; vérifiez par un appel."]
  ],
  reco: [
    "Limitez l'installation hors magasin aux cas justifiés et aux éditeurs que vous pouvez vérifier.",
    "Dans un contexte professionnel, bloquez l'installation d'applications inconnues par la gestion de flotte.",
    "Conservez une liste des applications installées manuellement pour en suivre les mises à jour."
  ],
  sum: "Un APK est un paquet signé contenant code, ressources et manifeste. L'installation hors magasin est le principal vecteur de malwares : vérifiez la source, la signature et les permissions, puis refermez l'autorisation d'installation. Un APK reçu par message est un signal d'alerte.",
  quiz: [
    { q: "Qu'est-ce que le « sideloading » ?", o: ["L'installation d'une application en dehors d'un magasin d'applications", "La recharge sans fil", "Le partage de connexion", "Le chiffrement des photos"], a: 0, e: "Le sideloading consiste à installer un APK obtenu hors magasin." },
    { q: "Que faire après avoir installé un APK depuis le navigateur ?", o: ["Laisser l'autorisation active pour plus tard", "Désactiver l'autorisation d'installer des applications inconnues pour le navigateur", "Désinstaller le navigateur", "Désactiver les mises à jour"], a: 1, e: "Refermer l'autorisation empêche une installation silencieuse ultérieure." },
    { q: "Pourquoi les mises à jour d'une application doivent-elles être signées avec la même clé ?", o: ["Pour garantir qu'elles proviennent du même éditeur", "Pour réduire leur taille", "Pour accélérer l'installation", "Ce n'est pas le cas"], a: 0, e: "La continuité de signature empêche un tiers de remplacer l'application par une version piégée." }
  ]
},
/* ---------------------------------------------------------------- 2.6 */
{
  obj: "Identifier les abus de permissions les plus courants, comprendre comment ils sont exploités et savoir les détecter grâce aux outils d'Android.",
  intro: [
    "Toutes les menaces ne sont pas des malwares au sens strict. De nombreuses applications légitimes demandent plus d'accès que nécessaire, souvent pour alimenter des modèles publicitaires ou des courtiers en données.",
    "Savoir repérer une demande disproportionnée est une compétence clé de l'hygiène numérique."
  ],
  tech: [
    { h: "Les abus fréquents", ul: [
      "<b>Position en arrière-plan</b> pour des applications sans fonction de localisation continue.",
      "<b>Contacts</b> aspirés pour « trouver des amis » puis exploités commercialement.",
      "<b>Photos et fichiers</b> : accès complet alors qu'une seule image est nécessaire.",
      "<b>Appareils à proximité, Bluetooth et Wi-Fi</b> utilisés pour déduire la position.",
      "<b>Liste des applications installées</b> : elle révèle beaucoup (santé, religion, finances). Depuis Android 11, les applications doivent déclarer ce besoin, et Google Play encadre cet usage.",
      "<b>Accès spéciaux</b> : superposition, notifications, accessibilité."
    ]},
    { h: "Les SDK tiers", p: [
      "Une application peut intégrer des kits de développement de régies publicitaires ou d'analyse qui bénéficient des mêmes permissions qu'elle. Une permission accordée à l'application l'est de fait à tous ses composants."
    ]},
    { h: "Les outils de détection", p: [
      "Le <b>tableau de bord de confidentialité</b> (Android 12 et versions ultérieures) montre quelles applications ont utilisé la position, la caméra et le micro au cours des dernières 24 heures (7 jours sur les versions récentes). Les <b>indicateurs</b> verts en haut de l'écran signalent un usage en cours de la caméra ou du micro."
    ]}
  ],
  fig: "permissions",
  steps: [
    "Ouvrez le <b>Tableau de bord de confidentialité</b> (Pixel : <b>Paramètres › Sécurité et confidentialité › Confidentialité</b> ; Samsung : <b>Paramètres › Sécurité et confidentialité › Confidentialité</b>).",
    "Pour la position, la caméra et le micro, consultez la chronologie des accès.",
    "Repérez toute application ayant accédé à un capteur alors que vous ne l'utilisiez pas.",
    "Ouvrez cette application dans les réglages et retirez l'autorisation concernée.",
    "Si l'application cesse de fonctionner pour une raison injustifiée, remplacez-la par une alternative plus respectueuse."
  ],
  result: "Les accès injustifiés sont identifiés et retirés.",
  ex: [
    "Une application de scanner de documents accède au micro à 3 h du matin : retirez l'autorisation et désinstallez-la.",
    "Un jeu demande les contacts pour « inviter des amis » : refusez, la fonction reste souvent utilisable par d'autres moyens."
  ],
  err: [
    ["Croire qu'une application célèbre ne peut pas abuser.", "La notoriété ne garantit pas la sobriété : jugez chaque permission sur pièces."],
    ["Ignorer le point vert de la caméra ou du micro.", "Touchez l'indicateur pour voir quelle application est en cause."],
    ["Accorder l'accès à toutes les photos par habitude.", "Utilisez le sélecteur de photos ou l'accès partiel lorsqu'il est proposé."]
  ],
  reco: [
    "Consultez le tableau de bord de confidentialité au moins une fois par mois.",
    "Préférez les applications open source ou dont la politique de confidentialité est claire.",
    "Sur GrapheneOS, utilisez en complément Storage Scopes et Contact Scopes (module 7)."
  ],
  sum: "Les abus de permissions concernent la position, les contacts, les photos, les capteurs indirects et la liste des applications. Les SDK tiers héritent des permissions de l'application. Le tableau de bord de confidentialité et les indicateurs de capteurs permettent de les détecter.",
  quiz: [
    { q: "Quel outil d'Android montre l'historique récent d'accès à la position, à la caméra et au micro ?", o: ["Le tableau de bord de confidentialité", "Le gestionnaire de batterie", "Le Play Store", "Le mode développeur"], a: 0, e: "Introduit avec Android 12, il affiche la chronologie de ces accès." },
    { q: "Pourquoi un SDK publicitaire intégré à une application est-il un risque ?", o: ["Il bénéficie des mêmes permissions que l'application", "Il consomme du crédit téléphonique", "Il désactive le chiffrement", "Il n'y a aucun risque"], a: 0, e: "Les composants intégrés partagent l'identité et donc les permissions de l'application." },
    { q: "Que signale un point vert en haut de l'écran ?", o: ["Une mise à jour disponible", "L'utilisation en cours de la caméra ou du micro", "Une batterie pleine", "Une connexion Wi-Fi sécurisée"], a: 1, e: "Les indicateurs de confidentialité signalent l'usage en cours de ces capteurs." }
  ]
},
/* ---------------------------------------------------------------- 2.7 */
{
  obj: "Comprendre les techniques d'ingénierie sociale utilisées contre les utilisateurs de smartphones et construire des réflexes de défense.",
  intro: [
    "L'ingénierie sociale consiste à manipuler une personne pour obtenir une information ou une action. C'est la technique d'attaque la moins coûteuse et souvent la plus efficace : pourquoi chercher une faille dans Android quand il suffit de convaincre l'utilisateur ?",
    "Cette leçon élargit le phishing à l'ensemble des manipulations, y compris en face à face."
  ],
  tech: [
    { h: "Les scénarios classiques", ul: [
      "<b>Faux support technique</b> qui demande d'installer une application de prise de contrôle à distance.",
      "<b>Usurpation d'un proche</b> en détresse sur une messagerie.",
      "<b>Échange de carte SIM (SIM swapping)</b> : l'attaquant convainc l'opérateur de transférer votre numéro sur sa carte SIM, puis reçoit vos codes par SMS.",
      "<b>Accès physique</b> : « Je peux passer un appel avec ton téléphone ? », suivi de l'installation discrète d'une application.",
      "<b>Faux recrutement ou investissement</b> menant à l'installation d'applications piégées."
    ]},
    { h: "Pourquoi cela fonctionne", p: [
      "Les attaquants préparent leur scénario à partir d'informations publiques : réseaux sociaux, fuites de données, annuaires. Plus ils en savent, plus leur discours est crédible. Réduire les informations publiées est donc une mesure de sécurité."
    ]}
  ],
  fig: "phishing",
  steps: [
    "Définissez une règle personnelle : aucune information sensible ni aucun code n'est donné à la suite d'une sollicitation entrante.",
    "Convenez avec vos proches d'une question ou d'un mot de vérification en cas de demande urgente d'argent.",
    "Demandez à votre opérateur s'il propose un code de protection ou une vérification renforcée pour les changements de carte SIM.",
    "Remplacez, lorsque c'est possible, la validation par SMS par une application d'authentification ou une clé d'accès.",
    "Limitez la visibilité de votre numéro de téléphone et de votre date de naissance sur les réseaux sociaux."
  ],
  result: "Vous disposez de règles claires et vos comptes dépendent moins du SMS.",
  ex: [
    "Un « technicien » vous appelle au sujet d'un problème sur votre ligne et vous fait installer une application de contrôle à distance : il accède ensuite à votre application bancaire.",
    "Après un SIM swapping, l'attaquant réinitialise le mot de passe de votre messagerie grâce au code reçu par SMS."
  ],
  err: [
    ["Installer une application de contrôle à distance à la demande d'un inconnu.", "Refusez : aucun service légitime ne l'exige lors d'un appel non sollicité."],
    ["Prêter son téléphone déverrouillé à un inconnu.", "Composez vous-même le numéro et gardez l'appareil en main."],
    ["Utiliser le SMS comme unique second facteur pour les comptes importants.", "Ajoutez une clé d'accès ou une application d'authentification."]
  ],
  reco: [
    "Formez votre entourage : les personnes âgées et les adolescents sont des cibles privilégiées.",
    "Méfiez-vous de toute demande qui combine urgence et secret.",
    "En entreprise, établissez des procédures de vérification pour toute demande inhabituelle."
  ],
  sum: "L'ingénierie sociale exploite la confiance, l'urgence et les informations publiques. Faux supports, usurpation de proches, SIM swapping et accès physique en sont les formes courantes. Des règles personnelles, des mots de vérification et la réduction de la dépendance au SMS limitent fortement ces attaques.",
  quiz: [
    { q: "Qu'est-ce que le SIM swapping ?", o: ["Changer de forfait", "Le transfert frauduleux de votre numéro sur la carte SIM d'un attaquant", "Un jeu mobile", "Le passage en 5G"], a: 1, e: "L'attaquant reçoit alors vos SMS, y compris les codes de validation." },
    { q: "Quelle mesure réduit l'impact d'un SIM swapping ?", o: ["Utiliser une clé d'accès ou une application d'authentification plutôt que le SMS", "Changer de fond d'écran", "Désactiver le Wi-Fi", "Utiliser un PIN à 4 chiffres"], a: 0, e: "Sans dépendance au SMS, le transfert du numéro ne donne pas accès aux comptes." },
    { q: "Pourquoi limiter les informations publiées en ligne ?", o: ["Pour économiser de la batterie", "Parce que les attaquants s'en servent pour rendre leurs scénarios crédibles", "Parce que c'est illégal", "Cela n'a aucun effet"], a: 1, e: "Les données publiques alimentent la préparation des attaques." }
  ]
},
/* ---------------------------------------------------------------- 2.8 */
{
  obj: "Évaluer les risques réels des réseaux Wi-Fi publics et adopter des pratiques de connexion sûres.",
  intro: [
    "Gares, aéroports, hôtels, cafés : les Wi-Fi publics sont pratiques mais vous placent sur un réseau partagé avec des inconnus, géré par un tiers que vous ne connaissez pas.",
    "Le risque a diminué depuis la généralisation du chiffrement HTTPS, mais il n'a pas disparu."
  ],
  tech: [
    { h: "Les attaques possibles", ul: [
      "<b>Faux point d'accès (evil twin)</b> : un réseau portant le même nom que le réseau légitime.",
      "<b>Portail captif piégé</b> : la page de connexion demande vos identifiants de messagerie ou de réseau social.",
      "<b>Observation du trafic non chiffré</b> : les connexions en HTTP simple restent lisibles.",
      "<b>Collecte des noms de domaine</b> visités via les requêtes DNS non chiffrées.",
      "<b>Attaques contre l'appareil</b> exposé sur le réseau local, surtout s'il n'est pas à jour."
    ]},
    { h: "Ce qui vous protège", p: [
      "Le chiffrement <b>TLS</b> (HTTPS) protège le contenu des échanges avec les sites et applications correctement conçus. Le <b>DNS privé</b> d'Android (DNS over TLS, depuis Android 9) masque les noms de domaine au réseau local. La <b>randomisation de l'adresse MAC</b>, activée par défaut depuis Android 10, limite le pistage de l'appareil d'un réseau à l'autre."
    ]}
  ],
  fig: "network",
  steps: [
    "Avant de vous connecter, vérifiez le nom exact du réseau auprès de l'établissement.",
    "Ne saisissez jamais d'identifiants de messagerie ou de réseau social sur un portail captif.",
    "Activez le <b>DNS privé</b> : <b>Paramètres › Réseau et Internet › DNS privé</b> (Samsung : <b>Connexions › Plus de paramètres de connexion › DNS privé</b>) et indiquez le nom d'hôte d'un fournisseur de confiance.",
    "Vérifiez dans les détails du réseau que l'option <b>Utiliser une adresse MAC aléatoire</b> est active.",
    "Après usage, demandez au téléphone d'<b>oublier</b> le réseau pour éviter les reconnexions automatiques.",
    "Pour les opérations sensibles, préférez la connexion mobile (4G/5G) ou un VPN de confiance (module 8)."
  ],
  result: "Vous vous connectez aux réseaux publics en limitant l'exposition et sans reconnexion automatique.",
  ex: [
    "À l'aéroport, deux réseaux « Airport_Free_WiFi » apparaissent : l'un est un faux point d'accès. Demandez le nom exact au comptoir d'information.",
    "Un portail captif d'hôtel propose de « se connecter avec votre compte de messagerie » : utilisez plutôt le code fourni à l'accueil."
  ],
  err: [
    ["Se connecter automatiquement à tout réseau ouvert.", "Désactivez la connexion automatique aux réseaux publics et oubliez les réseaux après usage."],
    ["Croire qu'un VPN rend toute connexion parfaitement sûre.", "Le VPN déplace la confiance vers son fournisseur ; il ne protège pas d'un faux site."],
    ["Ignorer les avertissements de certificat du navigateur.", "Un avertissement de certificat sur un Wi-Fi public peut signaler une interception : n'allez pas plus loin."]
  ],
  reco: [
    "Privilégiez le partage de connexion de votre propre téléphone plutôt qu'un Wi-Fi public pour un ordinateur professionnel.",
    "Gardez le Wi-Fi désactivé lorsque vous ne l'utilisez pas, ou utilisez la désactivation automatique proposée par GrapheneOS.",
    "Maintenez l'appareil à jour : c'est votre meilleure protection sur un réseau hostile."
  ],
  sum: "Les Wi-Fi publics exposent aux faux points d'accès, aux portails piégés et à l'observation du trafic non chiffré. HTTPS, le DNS privé et la randomisation MAC réduisent ces risques. Vérifier le réseau, éviter les reconnexions automatiques et préférer le réseau mobile pour les opérations sensibles sont de bons réflexes.",
  quiz: [
    { q: "Qu'est-ce qu'un « evil twin » ?", o: ["Un faux point d'accès imitant un réseau légitime", "Un téléphone jumeau", "Un antivirus", "Un câble de recharge"], a: 0, e: "Le faux point d'accès porte le même nom que le réseau légitime pour attirer les connexions." },
    { q: "Que masque le DNS privé d'Android au réseau local ?", o: ["Le contenu des pages HTTPS", "Les noms de domaine que vous consultez", "Votre numéro de téléphone", "La marque de votre téléphone"], a: 1, e: "Le DNS chiffré empêche le réseau local de lire vos requêtes de noms de domaine." },
    { q: "Un portail captif demande vos identifiants de messagerie. Que faire ?", o: ["Les saisir pour obtenir Internet", "Refuser et demander un code d'accès à l'établissement", "Saisir un faux mot de passe", "Redémarrer et les saisir"], a: 1, e: "Un portail légitime n'a pas besoin de vos identifiants de messagerie." }
  ]
},
/* ---------------------------------------------------------------- 2.9 */
{
  obj: "Comprendre la nature des vulnérabilités Android, leur classification et leur cycle de vie, de la découverte à l'exploitation.",
  intro: [
    "Une vulnérabilité est une faiblesse dans le code ou la conception d'un logiciel, qui peut permettre à un attaquant de faire ce que le système ne devrait pas autoriser. Android, comme tout logiciel complexe, en contient : chaque bulletin mensuel en corrige.",
    "Comprendre leur fonctionnement aide à saisir pourquoi les mises à jour sont si importantes et pourquoi certains systèmes investissent dans la réduction de la surface d'attaque."
  ],
  tech: [
    { h: "Classification", ul: [
      "<b>Exécution de code à distance (RCE)</b> : l'attaquant exécute du code via un fichier, un message ou une connexion réseau.",
      "<b>Élévation de privilèges (EoP)</b> : passage d'un domaine restreint à un domaine plus privilégié, par exemple vers le noyau.",
      "<b>Divulgation d'informations (ID)</b> : accès à des données normalement protégées.",
      "<b>Déni de service (DoS)</b> : blocage ou plantage de l'appareil."
    ]},
    { h: "Chaînes d'exploitation et « zero-click »", p: [
      "Les attaques avancées enchaînent plusieurs failles : une première pour exécuter du code dans une application (navigateur, messagerie), une seconde pour sortir du bac à sable, une troisième pour obtenir les privilèges du noyau. Une attaque <b>zero-click</b> ne nécessite aucune action de la victime. Ces chaînes, très coûteuses, sont surtout utilisées contre des cibles spécifiques (journalistes, militants, responsables)."
    ]},
    { h: "Les failles de mémoire", p: [
      "Une large part des vulnérabilités graves provient d'erreurs de gestion de la mémoire dans le code écrit en C et C++. Android adopte progressivement le langage Rust, sûr en mémoire, pour le nouveau code. Certains processeurs récents proposent le <b>marquage mémoire (MTE)</b>, qui permet de détecter une partie de ces erreurs ; GrapheneOS l'exploite largement sur les appareils compatibles."
    ]}
  ],
  fig: "update-cycle",
  steps: [
    "Rendez-vous sur <b>source.android.com/docs/security/bulletin</b>.",
    "Ouvrez le bulletin du mois en cours.",
    "Repérez la section de synthèse et les vulnérabilités de gravité « Critique ».",
    "Notez leur type (RCE, EoP, ID) et le composant concerné.",
    "Vérifiez que le niveau de correctif de votre appareil est égal ou postérieur à la date du bulletin."
  ],
  result: "Vous savez lire un bulletin de sécurité et vérifier que votre appareil couvre les failles publiées.",
  ex: [
    "Une faille de type RCE dans un composant de traitement multimédia peut être déclenchée par l'ouverture d'une image ou d'une vidéo piégée.",
    "Une chaîne zero-click visant une messagerie peut compromettre un téléphone sans aucune interaction ; les correctifs rapides et le durcissement du système en réduisent le risque."
  ],
  err: [
    ["Penser que « personne ne s'intéresse à moi » rend les mises à jour inutiles.", "Les failles publiées sont rapidement intégrées à des attaques de masse : mettez à jour."],
    ["Croire qu'un antivirus détecte les exploits.", "Les exploits ciblent le système lui-même : seuls les correctifs les corrigent durablement."],
    ["Confondre la gravité d'une faille et son exploitation réelle.", "Consultez les bulletins : ils signalent les failles exploitées de manière ciblée."]
  ],
  reco: [
    "Installez les correctifs dans les jours suivant leur publication.",
    "Si vous appartenez à une population à risque, envisagez un système renforcé comme GrapheneOS et les modes de protection avancée proposés par Android.",
    "Réduisez votre surface d'attaque : moins d'applications, moins de services exposés."
  ],
  sum: "Les vulnérabilités sont classées en RCE, EoP, divulgation d'informations et déni de service. Les attaques avancées enchaînent plusieurs failles, parfois sans aucun clic. Les erreurs de mémoire sont une cause majeure, combattue par Rust, MTE et le durcissement. Les correctifs rapides restent la réponse principale.",
  quiz: [
    { q: "Que désigne une vulnérabilité de type EoP ?", o: ["Une élévation de privilèges", "Une erreur d'affichage", "Un problème de batterie", "Une coupure réseau"], a: 0, e: "Elevation of Privilege : l'attaquant obtient plus de droits qu'il ne devrait." },
    { q: "Qu'est-ce qu'une attaque zero-click ?", o: ["Une attaque qui ne nécessite aucune action de la victime", "Une attaque sans Internet", "Une attaque qui ne coûte rien", "Une attaque par SMS uniquement"], a: 0, e: "La victime n'a ni à cliquer ni à installer quoi que ce soit." },
    { q: "Quelle technologie matérielle aide à détecter certaines erreurs mémoire sur les processeurs récents ?", o: ["Le NFC", "Le marquage mémoire (MTE)", "Le GPS", "Le Bluetooth"], a: 1, e: "Memory Tagging Extension associe des étiquettes aux zones mémoire pour détecter des accès invalides." }
  ]
},
/* ---------------------------------------------------------------- 2.10 */
{
  obj: "Construire une stratégie de protection cohérente contre l'ensemble des menaces étudiées, adaptée à son propre profil de risque.",
  intro: [
    "Après avoir étudié les menaces une à une, il faut les relier : quelles protections couvrent quels risques, et lesquelles sont prioritaires pour vous ? Un journaliste d'investigation, un dirigeant d'entreprise et un étudiant n'ont pas les mêmes besoins.",
    "Cette démarche s'appelle la <b>modélisation des menaces</b>."
  ],
  tech: [
    { h: "Les quatre questions de la modélisation", ul: [
      "<b>Que dois-je protéger ?</b> Données, comptes, communications, localisation.",
      "<b>Contre qui ?</b> Criminels opportunistes, entourage, concurrents, acteurs étatiques.",
      "<b>Quelle est la probabilité et la gravité ?</b>",
      "<b>Quels efforts suis-je prêt à fournir ?</b>"
    ]},
    { h: "La défense en profondeur", p: [
      "Aucune mesure isolée ne suffit. La défense en profondeur superpose des couches indépendantes : un système à jour, un verrouillage robuste, des applications limitées, des permissions minimales, des comptes protégés par plusieurs facteurs, des sauvegardes et une vigilance face à la manipulation."
    ]}
  ],
  table: {
    cap: "Correspondance entre menaces et protections principales.",
    head: ["Menace", "Protections prioritaires", "Module"],
    rows: [
      ["Malwares et APK piégés", "Sources officielles, Play Protect, permissions, accessibilité contrôlée", "2, 3"],
      ["Phishing et ingénierie sociale", "Vérification par canal indépendant, clés d'accès, gestionnaire de mots de passe", "2, 8"],
      ["Vol ou perte", "Verrouillage robuste, chiffrement, localisation et effacement à distance", "3"],
      ["Vulnérabilités", "Mises à jour rapides, appareil supporté, système durci", "1, 4"],
      ["Pistage et collecte", "Permissions minimales, réglages publicitaires, applications sobres", "3, 8"],
      ["Surveillance ciblée", "GrapheneOS, profils, redémarrages, attestation", "4 à 7"]
    ]
  },
  fig: "threat-map",
  steps: [
    "Listez vos trois données ou comptes les plus sensibles.",
    "Identifiez les adversaires plausibles pour chacun.",
    "Pour chaque couple « donnée / adversaire », choisissez au moins deux protections indépendantes dans le tableau.",
    "Classez les actions par effort : réalisables aujourd'hui, cette semaine, ce mois-ci.",
    "Planifiez une revue de cette stratégie tous les six mois."
  ],
  result: "Vous disposez d'un plan de protection personnel, priorisé et réaliste.",
  ex: [
    "Profil étudiant : priorité aux mises à jour, au verrouillage, à la protection du compte Google et à la vigilance face au phishing.",
    "Profil journaliste : en plus, appareil durci, messagerie chiffrée avec messages éphémères, séparation des usages par profils et redémarrages fréquents."
  ],
  err: [
    ["Chercher l'outil miracle qui protège de tout.", "Combinez plusieurs protections simples et indépendantes."],
    ["Adopter des mesures trop contraignantes, vite abandonnées.", "Choisissez des mesures que vous pourrez maintenir dans le temps."],
    ["Ne jamais réévaluer son plan.", "Révisez-le à chaque changement de situation (nouveau travail, voyage, nouvel appareil)."]
  ],
  reco: [
    "Commencez par les mesures à fort impact et faible effort : mises à jour, verrouillage, double authentification.",
    "Documentez votre plan : il servira de base à votre audit (module 9).",
    "Pour les profils à risque élevé, faites-vous accompagner par des professionnels."
  ],
  sum: "La modélisation des menaces part de ce que l'on protège, contre qui, avec quelle probabilité et quel effort. La défense en profondeur combine plusieurs protections indépendantes. Un plan priorisé et révisé régulièrement est plus efficace qu'une accumulation d'outils.",
  quiz: [
    { q: "Quelle est la première question de la modélisation des menaces ?", o: ["Quel téléphone acheter ?", "Que dois-je protéger ?", "Quel antivirus installer ?", "Quel forfait choisir ?"], a: 1, e: "On part toujours des actifs à protéger." },
    { q: "Qu'est-ce que la défense en profondeur ?", o: ["Superposer plusieurs protections indépendantes", "Utiliser un seul antivirus très puissant", "Cacher son téléphone", "Ne jamais se connecter à Internet"], a: 0, e: "Si une couche échoue, les autres continuent de protéger." },
    { q: "Pour un utilisateur ordinaire, quelle mesure offre le meilleur rapport efficacité/effort ?", o: ["Installer cinq antivirus", "Maintenir le système et les applications à jour", "Changer de téléphone tous les mois", "Désactiver l'écran"], a: 1, e: "Les mises à jour corrigent les failles exploitées à grande échelle, pour un effort minimal." }
  ]
}
];
