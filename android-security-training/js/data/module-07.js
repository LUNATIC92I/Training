/* Module 7 : Configuration avancée de GrapheneOS
   Référence : https://grapheneos.org/usage et https://grapheneos.org/features
   Les noms et emplacements des réglages évoluent avec les versions : en cas
   de doute, utilisez la recherche des Paramètres et le guide d'utilisation. */
window.ASG = window.ASG || {}; ASG.content = ASG.content || {};
(function () {
var REF = "Les emplacements indiqués correspondent aux versions récentes de GrapheneOS et peuvent évoluer. Utilisez la recherche des Paramètres (loupe) et le guide officiel <a href=\"https://grapheneos.org/usage\" rel=\"noopener\" target=\"_blank\">grapheneos.org/usage</a> en cas de différence.";
ASG.content.m7 = [
/* ---------------------------------------------------------------- 7.1 */
{
  obj: "Compléter la configuration initiale de GrapheneOS et établir une base saine avant toute personnalisation.",
  intro: [
    "Après l'assistant de démarrage, quelques réglages de base méritent d'être vérifiés avant d'installer la moindre application. Ils forment le socle sur lequel reposeront les réglages avancés.",
    "Prenez le temps de les faire dans l'ordre."
  ],
  tech: [
    REF,
    "GrapheneOS est conçu pour être sûr par défaut : la plupart des protections sont actives sans intervention. La configuration initiale consiste surtout à vérifier le verrouillage, les mises à jour et les connexions, puis à découvrir les applications fournies (Vanadium, Appareil photo, lecteur PDF, App Store, Auditor)."
  ],
  fig: "graphene-layers",
  steps: [
    "Vérifiez le verrouillage : <b>Paramètres › Sécurité et confidentialité › Déverrouillage de l'appareil</b>. Code de 6 chiffres ou plus, ou mot de passe.",
    "Vérifiez les mises à jour : <b>Paramètres › Système › Mise à jour du système</b>.",
    "Ouvrez l'<b>App Store</b> de GrapheneOS et mettez à jour les applications du projet.",
    "Ouvrez <b>Vanadium</b> et parcourez ses réglages de confidentialité.",
    "Vérifiez l'heure, la langue et le clavier.",
    "Désactivez le Wi-Fi et le Bluetooth si vous ne les utilisez pas."
  ],
  result: "Le verrouillage, les mises à jour et les applications de base sont vérifiés.",
  ex: [
    "Un utilisateur découvre que l'App Store propose une mise à jour d'Auditor dès le premier jour : il l'installe avant toute autre application.",
    "Une utilisatrice remplace son PIN provisoire de 4 chiffres choisi pendant l'assistant par un code aléatoire de 8 chiffres."
  ],
  err: [
    ["Installer de nombreuses applications avant de vérifier la base.", "Commencez par ces vérifications, puis installez progressivement."],
    ["Désactiver des protections par curiosité.", "Laissez les réglages par défaut tant que vous ne maîtrisez pas leurs effets."]
  ],
  reco: [
    "Notez dans votre fiche d'appareil les réglages modifiés.",
    "Explorez le guide d'utilisation officiel au fil de la configuration."
  ],
  sum: "La base d'une configuration GrapheneOS : un verrouillage robuste, les mises à jour automatiques actives, les applications du projet à jour et les radios inutiles désactivées. La plupart des protections sont actives par défaut.",
  quiz: [
    { q: "GrapheneOS est-il protégé dès l'installation, sans réglages particuliers ?", o: ["Non, tout doit être activé manuellement", "Oui, la plupart des protections sont actives par défaut", "Seulement avec Google Play", "Seulement en mode avion"], a: 1, e: "Le système est conçu pour être sûr par défaut." },
    { q: "Quel magasin met à jour les applications du projet GrapheneOS ?", o: ["L'App Store de GrapheneOS", "Un site miroir", "Le Galaxy Store", "Aucun"], a: 0, e: "L'App Store du projet distribue et met à jour ses applications." }
  ]
},
/* ---------------------------------------------------------------- 7.2 */
{
  obj: "Créer et gérer des profils utilisateurs pour cloisonner ses usages, et utiliser les fonctions propres à GrapheneOS.",
  intro: [
    "Les profils utilisateurs sont l'un des outils les plus puissants de GrapheneOS. Chaque profil est un espace séparé avec ses propres applications, données et clés de chiffrement.",
    "Ils permettent par exemple de séparer vie personnelle et professionnelle, ou d'isoler des applications intrusives."
  ],
  tech: [
    REF,
    { h: "Le fonctionnement", p: [
      "Chaque profil dispose de son propre stockage chiffré, protégé par son propre code. Lorsqu'on <b>met fin à la session</b> d'un profil secondaire, ses données repassent au repos : ses clés sont retirées de la mémoire. Le profil propriétaire (le premier créé) administre l'appareil et les mises à jour."
    ]},
    { h: "Les améliorations de GrapheneOS", ul: [
      "Un nombre de profils secondaires plus élevé qu'Android standard.",
      "Un bouton pour mettre fin à la session d'un profil secondaire.",
      "La possibilité de transférer les notifications d'un profil vers le profil actif.",
      "La possibilité d'installer dans un profil une application déjà présente dans un autre, sans la retélécharger.",
      "La possibilité d'empêcher un profil secondaire d'utiliser les réseaux mobiles ou d'autres fonctions (réglages du propriétaire)."
    ]}
  ],
  fig: "profiles",
  steps: [
    "Depuis le profil propriétaire, ouvrez <b>Paramètres › Système › Utilisateurs multiples</b> (ou <b>Utilisateurs</b>) et activez la fonction si nécessaire.",
    "Touchez <b>Ajouter un utilisateur</b>, donnez-lui un nom explicite (par exemple « Travail » ou « Services »).",
    "Basculez vers le nouveau profil et définissez un code de verrouillage distinct.",
    "Installez dans ce profil uniquement les applications qui lui sont destinées.",
    "Dans les réglages du profil, depuis le propriétaire, activez si vous le souhaitez le transfert des notifications.",
    "Lorsque vous avez fini, utilisez <b>Mettre fin à la session</b> pour remettre les données du profil au repos."
  ],
  result: "Vous disposez d'au moins un profil secondaire, protégé par son propre code, avec des applications dédiées.",
  ex: [
    "Profil « Principal » sans Google Play pour les communications personnelles ; profil « Services » avec Google Play pour les applications de transport et de livraison.",
    "Profil « Travail » pour les applications de l'employeur, fermé le soir avec Mettre fin à la session."
  ],
  err: [
    ["Utiliser le même code pour tous les profils.", "Utilisez des codes différents pour renforcer le cloisonnement."],
    ["Installer toutes les applications dans le profil propriétaire.", "Réservez le propriétaire à l'administration et aux usages les plus sensibles, selon votre organisation."],
    ["Oublier de mettre fin à la session des profils secondaires.", "Fermez les sessions inutilisées pour remettre leurs données au repos."]
  ],
  reco: [
    "Concevez votre organisation sur papier avant de créer les profils.",
    "Gardez un nombre raisonnable de profils pour ne pas vous perdre.",
    "Consultez la section « Multiple users » du guide d'utilisation officiel."
  ],
  sum: "Chaque profil possède ses applications, ses données et ses clés. GrapheneOS ajoute la fin de session, le transfert de notifications, l'installation entre profils et davantage de profils. Un cloisonnement réfléchi isole les applications intrusives des données sensibles.",
  quiz: [
    { q: "Que se passe-t-il lorsqu'on met fin à la session d'un profil secondaire ?", o: ["Il est supprimé", "Ses données repassent au repos, ses clés sont retirées de la mémoire", "Il est copié dans le cloud", "Rien"], a: 1, e: "C'est l'équivalent d'un état BFU pour ce profil." },
    { q: "Chaque profil possède-t-il ses propres clés de chiffrement ?", o: ["Oui", "Non", "Seulement le propriétaire", "Seulement avec Google Play"], a: 0, e: "Le cloisonnement inclut le chiffrement." }
  ]
},
/* ---------------------------------------------------------------- 7.3 */
{
  obj: "Utiliser l'espace privé pour isoler des applications sensibles au sein du profil principal, et le comparer aux profils.",
  intro: [
    "L'espace privé, introduit avec Android 15 et disponible sur GrapheneOS, est un espace séparé à l'intérieur du profil principal. Ses applications sont masquées et verrouillées par un code ou par le code de l'appareil.",
    "C'est une alternative légère aux profils secondaires, adaptée à certains usages."
  ],
  tech: [
    REF,
    "Techniquement, l'espace privé est un profil distinct, avec ses propres données. Lorsqu'il est verrouillé, ses applications sont arrêtées et n'apparaissent pas dans les applications récentes ni dans les notifications. Contrairement à un profil secondaire, on y accède sans changer d'utilisateur, depuis le lanceur d'applications.",
    { h: "Profil secondaire ou espace privé ?", ul: [
      "<b>Espace privé</b> : accès rapide, idéal pour quelques applications sensibles (santé, finances, rencontre).",
      "<b>Profil secondaire</b> : cloisonnement plus complet, adapté à un ensemble d'usages (travail, services avec Google Play)."
    ]}
  ],
  fig: "profiles",
  steps: [
    "Ouvrez <b>Paramètres › Sécurité et confidentialité › Espace privé</b>.",
    "Suivez l'assistant de création.",
    "Choisissez un code de verrouillage spécifique à l'espace privé plutôt que celui de l'appareil.",
    "Installez dans l'espace privé les applications que vous souhaitez masquer et isoler.",
    "Verrouillez l'espace privé après usage et vérifiez que ses applications n'apparaissent plus."
  ],
  result: "Un espace privé, protégé par son propre code, contient vos applications les plus sensibles.",
  ex: [
    "Une application de suivi médical est placée dans l'espace privé : elle n'apparaît ni dans le lanceur, ni dans les notifications lorsque l'espace est verrouillé.",
    "Une application bancaire secondaire est isolée de vos autres applications dans l'espace privé."
  ],
  err: [
    ["Utiliser le même code que l'appareil.", "Choisissez un code distinct si vous voulez une réelle séparation."],
    ["Croire que l'espace privé protège contre un logiciel espion installé dans le même espace.", "Il isole les applications de l'espace principal, pas d'une application installée dans l'espace privé lui-même."],
    ["Oublier de verrouiller l'espace privé.", "Configurez son verrouillage automatique."]
  ],
  reco: [
    "Utilisez l'espace privé pour un petit nombre d'applications.",
    "Combinez-le avec des profils secondaires pour une organisation complète."
  ],
  sum: "L'espace privé est un profil léger intégré au profil principal, masqué et verrouillé à part. Il convient à quelques applications sensibles, tandis que les profils secondaires offrent un cloisonnement plus complet.",
  quiz: [
    { q: "Avec quelle version d'Android l'espace privé a-t-il été introduit ?", o: ["Android 10", "Android 12", "Android 15", "Android 17"], a: 2, e: "L'espace privé est une fonction d'Android 15, disponible sur GrapheneOS." },
    { q: "Que deviennent les applications de l'espace privé lorsqu'il est verrouillé ?", o: ["Elles continuent de fonctionner", "Elles sont arrêtées et masquées", "Elles sont supprimées", "Elles sont déplacées"], a: 1, e: "Elles n'apparaissent plus et ne s'exécutent plus." }
  ]
},
/* ---------------------------------------------------------------- 7.4 */
{
  obj: "Configurer finement les permissions sur GrapheneOS, y compris les permissions Réseau et Capteurs ainsi que Storage Scopes et Contact Scopes.",
  intro: [
    "GrapheneOS conserve le modèle de permissions d'Android et y ajoute des contrôles. C'est là que se joue une grande partie de la confidentialité au quotidien.",
    "Cette leçon vous montre comment les utiliser concrètement."
  ],
  tech: [
    REF,
    { h: "La permission Réseau", p: [
      "Lors de l'installation d'une application, GrapheneOS affiche la permission <b>Réseau</b>, que vous pouvez accorder ou refuser. Retirer cette permission bloque l'accès direct et indirect de l'application au réseau. Elle se modifie ensuite dans les autorisations de l'application."
    ]},
    { h: "Storage Scopes et Contact Scopes", p: [
      "Avec <b>Storage Scopes</b>, une application qui demande l'accès au stockage reçoit l'illusion de cet accès, mais ne voit que les fichiers et dossiers que vous lui désignez. <b>Contact Scopes</b> applique le même principe aux contacts. Ces options se trouvent dans les informations de l'application."
    ]}
  ],
  fig: "permissions",
  steps: [
    "À l'installation d'une application, décochez la permission <b>Réseau</b> si l'application n'a pas besoin d'Internet.",
    "Ouvrez <b>Paramètres › Applications</b>, choisissez une application, puis <b>Autorisations</b>, et revoyez Réseau, Capteurs et les autorisations classiques.",
    "Pour une application qui exige l'accès aux fichiers, ouvrez ses informations et activez <b>Storage Scopes</b>, puis ajoutez uniquement les fichiers ou dossiers nécessaires.",
    "Pour une application qui exige l'accès aux contacts, activez <b>Contact Scopes</b> et sélectionnez les contacts autorisés.",
    "Répétez l'opération pour chaque application installée."
  ],
  result: "Chaque application dispose uniquement des accès réseau, capteurs, fichiers et contacts nécessaires.",
  ex: [
    "Une application de prise de notes hors ligne fonctionne sans la permission Réseau : vos notes ne peuvent pas quitter l'appareil par son intermédiaire.",
    "Une messagerie refuse de fonctionner sans accès aux contacts : avec Contact Scopes, elle ne voit que vos trois interlocuteurs habituels."
  ],
  err: [
    ["Accorder le réseau à toutes les applications par habitude.", "Refusez-le par défaut pour les applications hors ligne."],
    ["Accorder l'accès à tous les fichiers à une application de retouche photo.", "Utilisez Storage Scopes ou le sélecteur de photos."],
    ["Oublier que certaines applications ont besoin du réseau pour leurs mises à jour internes.", "Les mises à jour passent par le magasin d'applications ; vérifiez le fonctionnement après réglage."]
  ],
  reco: [
    "Faites de la permission Réseau un réflexe à chaque installation.",
    "Privilégiez Storage Scopes et Contact Scopes à un refus pur et simple qui bloquerait l'application.",
    "Revoyez les permissions après chaque mise à jour importante d'une application."
  ],
  sum: "GrapheneOS ajoute la permission Réseau (accordée ou refusée dès l'installation), la permission Capteurs, Storage Scopes et Contact Scopes. Ces outils permettent de donner à chaque application le strict nécessaire sans la rendre inutilisable.",
  quiz: [
    { q: "Quand la permission Réseau peut-elle être refusée pour la première fois ?", o: ["Lors de l'installation de l'application", "Uniquement après un redémarrage", "Jamais", "Seulement par ADB"], a: 0, e: "GrapheneOS la présente dès l'installation." },
    { q: "Une application exige les contacts. Quelle option permet de ne lui en montrer que quelques-uns ?", o: ["Contact Scopes", "Le mode avion", "Le profil invité", "Le débogage USB"], a: 0, e: "Contact Scopes limite la visibilité aux contacts choisis." }
  ]
},
/* ---------------------------------------------------------------- 7.5 */
{
  obj: "Comprendre et gérer la permission Capteurs de GrapheneOS.",
  intro: [
    "Sur Android standard, l'accéléromètre, le gyroscope, la boussole ou le baromètre sont accessibles à toutes les applications, sans autorisation. Ces capteurs peuvent pourtant révéler des informations : déplacements, activité, voire caractéristiques permettant d'identifier l'appareil.",
    "GrapheneOS ajoute une permission dédiée."
  ],
  tech: [
    REF,
    "La permission <b>Capteurs</b> couvre les capteurs qui ne sont pas déjà protégés par une permission Android (la caméra, le micro, la position et les capteurs corporels ont leurs propres permissions). Lorsqu'elle est refusée, l'application reçoit des données neutres plutôt que les mesures réelles. Un réglage permet de choisir si cette permission est accordée par défaut aux nouvelles applications, et GrapheneOS peut afficher une notification lorsqu'une application tente d'utiliser un capteur bloqué."
  ],
  fig: "permissions",
  steps: [
    "Repérez le réglage d'accord par défaut de la permission Capteurs dans <b>Paramètres › Sécurité et confidentialité</b> (rubrique des réglages de confidentialité supplémentaires) et choisissez de ne pas l'accorder par défaut.",
    "Pour chaque application existante, ouvrez <b>Autorisations › Capteurs</b> et refusez-la si elle n'en a pas besoin.",
    "Accordez-la uniquement aux applications qui en ont un usage clair (boussole, podomètre, jeu utilisant l'inclinaison, réalité augmentée).",
    "Lorsqu'une notification signale une tentative d'accès bloquée, évaluez si elle est légitime."
  ],
  result: "Seules les applications qui en ont réellement besoin accèdent aux capteurs de mouvement et d'environnement.",
  ex: [
    "Une application de lecture n'a aucune raison d'accéder au gyroscope : la permission est refusée sans effet sur son fonctionnement.",
    "Une application de randonnée a besoin de la boussole : la permission lui est accordée."
  ],
  err: [
    ["Accorder les capteurs par défaut à toutes les applications.", "Désactivez l'accord par défaut et accordez au cas par cas."],
    ["Penser que la permission Capteurs couvre la caméra et le micro.", "Ceux-ci ont leurs propres permissions Android."],
    ["Ignorer les notifications de tentatives bloquées.", "Elles révèlent des comportements intéressants à analyser."]
  ],
  reco: [
    "Refusez par défaut, accordez par exception.",
    "Combinez avec la permission Réseau : une application sans réseau ne peut de toute façon pas transmettre les mesures."
  ],
  sum: "La permission Capteurs de GrapheneOS protège l'accès aux capteurs de mouvement et d'environnement, librement accessibles sur Android standard. Refusée, elle fournit des données neutres à l'application. Il est recommandé de ne pas l'accorder par défaut.",
  quiz: [
    { q: "Sur Android standard, l'accéléromètre est-il protégé par une permission ?", o: ["Oui", "Non", "Seulement sur Pixel", "Seulement la nuit"], a: 1, e: "C'est précisément ce que la permission Capteurs de GrapheneOS ajoute." },
    { q: "Que reçoit une application à qui l'on refuse la permission Capteurs ?", o: ["Des données neutres", "Les données réelles", "Une erreur fatale systématique", "Les données d'une autre application"], a: 0, e: "Cela évite de casser l'application tout en protégeant les données." }
  ]
},
/* ---------------------------------------------------------------- 7.6 */
{
  obj: "Configurer les réseaux Wi-Fi, Bluetooth et mobiles de façon à réduire l'exposition et le pistage.",
  intro: [
    "Les radios (Wi-Fi, Bluetooth, réseau mobile) sont à la fois des portes d'entrée potentielles et des sources de pistage. GrapheneOS propose plusieurs réglages pour les maîtriser.",
    "L'objectif est de garder ce qui est utile, et d'éteindre le reste."
  ],
  tech: [
    REF,
    { h: "Les protections réseau", ul: [
      "<b>Randomisation de l'adresse MAC</b> : GrapheneOS la renforce, de façon à limiter le suivi de l'appareil d'une connexion à l'autre.",
      "<b>Désactivation automatique du Wi-Fi et du Bluetooth</b> après un délai sans connexion.",
      "<b>Restriction des générations de réseau mobile</b> : option permettant de limiter le modem à certaines technologies, ce qui réduit la surface d'attaque, au prix d'une couverture parfois moindre.",
      "<b>Permission Réseau</b> par application (leçon 4)."
    ]}
  ],
  fig: "network",
  steps: [
    "Ouvrez <b>Paramètres › Réseau et Internet</b> et parcourez les options du Wi-Fi.",
    "Activez la <b>désactivation automatique du Wi-Fi</b> après un délai sans connexion, si l'option vous convient.",
    "Dans <b>Paramètres › Appareils connectés › Préférences de connexion › Bluetooth</b>, activez la désactivation automatique du Bluetooth.",
    "Dans les paramètres du réseau mobile (<b>Paramètres › Réseau et Internet › SIM</b>), examinez le type de réseau préféré et l'option de restriction proposée, en fonction de la couverture de votre opérateur.",
    "Supprimez les réseaux Wi-Fi enregistrés que vous n'utilisez plus."
  ],
  result: "Les radios inutilisées se coupent automatiquement et les réseaux mémorisés sont limités.",
  ex: [
    "En déplacement, le Wi-Fi se coupe automatiquement après quelques minutes sans connexion, évitant les détections par les bornes commerciales.",
    "Un utilisateur dans une zone bien couverte en 4G restreint son modem à cette technologie, réduisant la surface d'attaque."
  ],
  err: [
    ["Restreindre le réseau mobile sans vérifier la couverture.", "Testez les appels et les données ; revenez en arrière si la couverture est insuffisante."],
    ["Laisser le Bluetooth actif en permanence sans usage.", "Activez la désactivation automatique."],
    ["Conserver des dizaines de réseaux Wi-Fi mémorisés.", "Supprimez ceux que vous n'utilisez plus."]
  ],
  reco: [
    "Gardez les radios coupées lorsque vous n'en avez pas besoin.",
    "Assurez-vous que les appels d'urgence restent possibles avec votre configuration réseau."
  ],
  sum: "GrapheneOS renforce la randomisation MAC, permet la désactivation automatique du Wi-Fi et du Bluetooth et la restriction des technologies de réseau mobile. Ces réglages réduisent l'exposition et le pistage, à adapter à votre couverture.",
  quiz: [
    { q: "Quel est l'intérêt de la randomisation de l'adresse MAC ?", o: ["Accélérer le Wi-Fi", "Limiter le suivi de l'appareil d'un réseau à l'autre", "Économiser la batterie", "Améliorer la qualité audio"], a: 1, e: "Une adresse fixe permet de reconnaître l'appareil partout." },
    { q: "Que vérifier avant de restreindre les technologies du réseau mobile ?", o: ["La couleur de l'écran", "La couverture de votre opérateur", "La version de Vanadium", "Rien"], a: 1, e: "Une restriction peut dégrader la couverture." }
  ]
},
/* ---------------------------------------------------------------- 7.7 */
{
  obj: "Configurer un DNS chiffré (DNS privé) et comprendre son rôle, ses limites et son articulation avec un VPN.",
  intro: [
    "Chaque fois qu'une application contacte un service, elle demande d'abord à un serveur DNS l'adresse correspondant au nom de domaine. Par défaut, ces requêtes peuvent être lisibles par le réseau local et par le fournisseur d'accès.",
    "Le DNS privé d'Android chiffre ces requêtes."
  ],
  tech: [
    REF,
    "Android propose depuis la version 9 le <b>DNS privé</b>, qui utilise DNS-over-TLS. Trois modes existent : désactivé, automatique (utilise le chiffrement si le serveur du réseau le propose), ou un nom d'hôte de fournisseur choisi. Le DNS privé masque vos requêtes au réseau local, mais le fournisseur DNS choisi, lui, voit les domaines consultés : le choix de ce fournisseur est donc une question de confiance.",
    "Lorsqu'un VPN est actif, ses propres réglages DNS s'appliquent généralement. Certains fournisseurs DNS proposent aussi un filtrage des domaines malveillants ou publicitaires."
  ],
  fig: "network",
  steps: [
    "Ouvrez <b>Paramètres › Réseau et Internet › DNS privé</b>.",
    "Choisissez <b>Nom d'hôte du fournisseur DNS privé</b>.",
    "Saisissez le nom d'hôte DNS-over-TLS fourni dans la documentation officielle du fournisseur que vous avez choisi.",
    "Enregistrez, puis vérifiez que la navigation fonctionne normalement.",
    "Si un réseau public impose une page de connexion (portail captif), passez temporairement en mode automatique le temps de vous connecter, puis revenez au fournisseur choisi."
  ],
  result: "Les requêtes DNS sont chiffrées vers un fournisseur choisi en connaissance de cause.",
  ex: [
    "Dans un café, le réseau local ne peut plus voir la liste des sites que vous consultez via les requêtes DNS.",
    "Un fournisseur DNS avec filtrage bloque l'accès à un domaine de phishing connu."
  ],
  err: [
    ["Saisir une adresse IP au lieu d'un nom d'hôte.", "Le DNS privé d'Android attend un nom d'hôte DNS-over-TLS."],
    ["Choisir un fournisseur au hasard.", "Lisez sa politique de confidentialité ; il voit les domaines consultés."],
    ["Impossible de se connecter à un portail captif.", "Repassez temporairement en mode automatique."]
  ],
  reco: [
    "Choisissez un fournisseur réputé, à la politique de journalisation claire.",
    "Comprenez que le DNS chiffré ne masque pas les adresses IP contactées."
  ],
  sum: "Le DNS privé d'Android chiffre les requêtes DNS avec DNS-over-TLS, ce qui les masque au réseau local. Le fournisseur choisi voit toutefois les domaines consultés. Il se configure avec un nom d'hôte, à adapter temporairement en présence d'un portail captif.",
  quiz: [
    { q: "Quel protocole utilise le DNS privé d'Android ?", o: ["DNS-over-TLS", "FTP", "Bluetooth", "SMS"], a: 0, e: "Le DNS privé repose sur DNS-over-TLS." },
    { q: "Le fournisseur DNS choisi voit-il les domaines que vous consultez ?", o: ["Oui", "Non", "Seulement en Wi-Fi", "Seulement la nuit"], a: 0, e: "Le chiffrement protège du réseau local, pas du fournisseur DNS." }
  ]
},
/* ---------------------------------------------------------------- 7.8 */
{
  obj: "Installer et configurer Google Play en bac à sable, dans le profil adapté, avec des permissions minimales.",
  intro: [
    "Si certaines de vos applications nécessitent les services Google, GrapheneOS permet d'installer Google Play comme une application ordinaire (module 4, leçon 8).",
    "L'installation passe par l'App Store officiel du projet."
  ],
  tech: [
    REF,
    "L'App Store de GrapheneOS propose les composants de Google Play (services Google Play, Google Play Store et leurs dépendances). L'installation se fait profil par profil : Google Play n'est présent que dans les profils où vous l'installez. Une page de réglages dédiée (<b>Paramètres › Applications › Sandboxed Google Play</b>) regroupe les options de la couche de compatibilité, dont la redirection des demandes de localisation vers le système.",
    "Le guide d'utilisation officiel détaille ces réglages et les éventuelles limitations connues."
  ],
  fig: "play-sandbox",
  steps: [
    "Basculez vers le profil choisi pour Google Play (par exemple « Services »).",
    "Ouvrez l'<b>App Store</b> de GrapheneOS.",
    "Installez le groupe <b>Google Play</b> proposé (services Google Play et Google Play Store).",
    "Ouvrez <b>Paramètres › Applications › Sandboxed Google Play</b> et laissez activée la redirection de la localisation vers le système, sauf besoin particulier.",
    "Dans les autorisations des services Google Play, n'accordez que ce qui est nécessaire.",
    "Connectez-vous à un compte Google uniquement si vos applications l'exigent, éventuellement un compte dédié.",
    "Installez ensuite les applications qui dépendent de Google Play dans ce même profil."
  ],
  result: "Google Play fonctionne dans un profil dédié, sans privilèges, avec des permissions minimales.",
  ex: [
    "Les applications de banque et de transport reçoivent leurs notifications dans le profil « Services », tandis que le profil principal reste sans Google.",
    "Une application de cartes obtient la position via la localisation du système, sans recourir au service de localisation de Google."
  ],
  err: [
    ["Installer Google Play depuis une source autre que l'App Store officiel.", "Utilisez exclusivement l'App Store de GrapheneOS."],
    ["Accorder toutes les permissions aux services Google Play.", "Partez du minimum et ajoutez au besoin."],
    ["Une application bancaire refuse de fonctionner.", "Certaines vérifications d'intégrité excluent les systèmes non certifiés par Google ; consultez le guide officiel et, au besoin, conservez une autre solution pour cette application."]
  ],
  reco: [
    "Un compte Google dédié au profil « Services » limite le croisement des données.",
    "Désinstallez Google Play d'un profil dès qu'il n'y est plus utile."
  ],
  sum: "Google Play s'installe depuis l'App Store de GrapheneOS, profil par profil, comme une application ordinaire. Sa page de réglages permet notamment de rediriger la localisation vers le système. Permissions minimales et profil dédié sont recommandés.",
  quiz: [
    { q: "D'où s'installe Google Play sur GrapheneOS ?", o: ["De l'App Store de GrapheneOS", "D'un site miroir", "Du Galaxy Store", "Par ADB uniquement"], a: 0, e: "C'est la méthode officielle." },
    { q: "Google Play installé dans un profil est-il disponible dans les autres profils ?", o: ["Oui", "Non, l'installation se fait profil par profil", "Seulement dans l'espace privé", "Seulement le soir"], a: 1, e: "Chaque profil est indépendant." }
  ]
},
/* ---------------------------------------------------------------- 7.9 */
{
  obj: "Gérer les applications sur GrapheneOS : sources, mises à jour, protections par application et nettoyage.",
  intro: [
    "Les applications restent la principale porte d'entrée sur un téléphone. Sur GrapheneOS comme ailleurs, la sécurité dépend largement de ce que vous installez et de la façon dont vous le gérez.",
    "GrapheneOS offre en plus des réglages de protection par application."
  ],
  tech: [
    REF,
    { h: "Les sources", p: [
      "L'App Store de GrapheneOS distribue les applications du projet. Pour les autres applications, plusieurs sources existent, chacune avec son modèle de confiance : Google Play (dans un profil qui en dispose), les sites officiels des éditeurs, des magasins tiers. Privilégiez les sources qui vérifient la signature des mises à jour."
    ]},
    { h: "Les réglages de protection par application", p: [
      "Dans les informations d'une application, GrapheneOS propose des réglages de protection contre l'exploitation (par exemple le mode de compatibilité de l'allocateur renforcé, ou les restrictions de chargement dynamique de code). Ils permettent de faire fonctionner une application incompatible <b>sans affaiblir le reste du système</b>. Ils ne doivent être modifiés qu'en cas de besoin avéré."
    ]}
  ],
  fig: "apk-check",
  steps: [
    "Faites l'inventaire des applications installées dans chaque profil.",
    "Pour chacune, notez sa source et vérifiez qu'elle se met à jour automatiquement.",
    "Désinstallez celles que vous n'avez pas utilisées depuis un mois.",
    "Si une application plante systématiquement, consultez ses informations et, en dernier recours, activez uniquement pour elle le mode de compatibilité suggéré.",
    "Signalez le problème au développeur de l'application."
  ],
  result: "Vos applications proviennent de sources identifiées, se mettent à jour, et seules les exceptions nécessaires sont configurées.",
  ex: [
    "Une application ancienne plante au démarrage : le mode de compatibilité de l'allocateur, activé pour elle seule, résout le problème sans toucher aux autres.",
    "Un inventaire révèle quatre applications inutilisées : leur suppression réduit la surface d'exposition."
  ],
  err: [
    ["Activer les modes de compatibilité pour toutes les applications.", "Réservez-les aux applications qui en ont besoin."],
    ["Installer des applications depuis des sites de téléchargement génériques.", "Utilisez les sources officielles."],
    ["Laisser des applications sans mise à jour.", "Vérifiez leur canal de mise à jour."]
  ],
  reco: [
    "Une application de moins, c'est un risque de moins.",
    "Préférez les applications open source réputées et activement maintenues."
  ],
  sum: "Sur GrapheneOS, gérez vos applications par source et par mise à jour, supprimez celles qui sont inutiles, et n'utilisez les réglages de compatibilité par application qu'en dernier recours, sans affaiblir le reste du système.",
  quiz: [
    { q: "À quoi servent les réglages de protection par application ?", o: ["À faire fonctionner une application incompatible sans affaiblir le reste du système", "À accélérer toutes les applications", "À installer Google Play", "À désactiver le chiffrement"], a: 0, e: "Ils s'appliquent uniquement à l'application concernée." },
    { q: "Quelle est la meilleure réponse à une application inutilisée depuis longtemps ?", o: ["La garder au cas où", "La désinstaller", "Lui donner plus de permissions", "La dupliquer dans tous les profils"], a: 1, e: "Moins d'applications, c'est moins de risques." }
  ]
},
/* ---------------------------------------------------------------- 7.10 */
{
  obj: "Configurer le stockage de façon cloisonnée et protégée, grâce à Storage Scopes, au sélecteur de fichiers et à la sauvegarde chiffrée.",
  intro: [
    "Le stockage partagé (photos, téléchargements, documents) est l'endroit où se croisent les données de nombreuses applications. Mal géré, il devient un point de fuite.",
    "Cette leçon approfondit la gestion du stockage sur GrapheneOS."
  ],
  tech: [
    REF,
    { h: "Les outils", ul: [
      "<b>Sélecteur de fichiers et de photos</b> du système : l'application ne reçoit que le fichier choisi.",
      "<b>Storage Scopes</b> : pour les applications qui exigent la permission de stockage, accès limité aux fichiers et dossiers désignés.",
      "<b>Profils</b> : chaque profil a son propre stockage partagé.",
      "<b>Sauvegarde</b> : GrapheneOS intègre une solution de sauvegarde chiffrée (Seedvault), accessible dans <b>Paramètres › Système › Sauvegarde</b>, qui peut cibler un support externe ou un emplacement de stockage."
    ]}
  ],
  fig: "profiles",
  steps: [
    "Pour chaque application demandant l'accès au stockage, préférez le sélecteur de fichiers lorsqu'il est proposé.",
    "Sinon, activez <b>Storage Scopes</b> et désignez uniquement les dossiers nécessaires.",
    "Organisez vos documents sensibles dans un profil ou l'espace privé dédié.",
    "Ouvrez <b>Paramètres › Système › Sauvegarde</b>, configurez une sauvegarde chiffrée vers un support de votre choix et notez précieusement le code de récupération.",
    "Testez la restauration d'un fichier."
  ],
  result: "Les applications n'accèdent qu'aux fichiers nécessaires et une sauvegarde chiffrée, testée, est en place.",
  ex: [
    "Une application de scanner de documents est limitée à un dossier « Scans » grâce à Storage Scopes.",
    "Une sauvegarde chiffrée sur clé USB permet de restaurer les données après un incident."
  ],
  err: [
    ["Égarer le code de récupération de la sauvegarde.", "Conservez-le hors du téléphone, en lieu sûr ; sans lui, la sauvegarde est inexploitable."],
    ["Accorder l'accès à tous les fichiers à une application de lecture.", "Utilisez le sélecteur de fichiers."],
    ["Ne jamais tester la restauration.", "Testez au moins une fois."]
  ],
  reco: [
    "Combinez sauvegarde système et sauvegardes propres aux applications (messageries).",
    "Appliquez la règle 3-2-1 (module 3, leçon 13)."
  ],
  sum: "Sur GrapheneOS, le stockage se protège par le sélecteur de fichiers, Storage Scopes, le cloisonnement par profils et une sauvegarde chiffrée intégrée, dont le code de récupération doit être conservé en lieu sûr et la restauration testée.",
  quiz: [
    { q: "Quelle option privilégier pour donner un seul fichier à une application ?", o: ["Le sélecteur de fichiers du système", "L'accès à tous les fichiers", "Le débogage USB", "Le root"], a: 0, e: "L'application ne reçoit que le fichier choisi." },
    { q: "Que se passe-t-il si l'on perd le code de récupération d'une sauvegarde chiffrée ?", o: ["Rien, Google le conserve", "La sauvegarde devient inexploitable", "Elle se déchiffre automatiquement", "Elle est envoyée par e-mail"], a: 1, e: "Le chiffrement protège la sauvegarde, y compris contre vous si vous perdez le code." }
  ]
},
/* ---------------------------------------------------------------- 7.11 */
{
  obj: "Mettre en place les protections des données au repos : redémarrage automatique, contrôle du port USB-C et bonnes pratiques de verrouillage.",
  intro: [
    "Les données au repos, c'est-à-dire sur un appareil verrouillé, sont la cible des techniques d'extraction physique. GrapheneOS propose plusieurs réglages dédiés.",
    "Ils sont particulièrement utiles en cas de vol, de saisie ou de dépôt de l'appareil."
  ],
  tech: [
    REF,
    { h: "Le redémarrage automatique", p: [
      "GrapheneOS peut redémarrer automatiquement l'appareil s'il n'a pas été déverrouillé depuis un délai donné. Les données repassent alors en état BFU (module 1, leçon 9). Le délai est configurable dans les paramètres de sécurité."
    ]},
    { h: "Le contrôle du port USB-C", p: [
      "GrapheneOS permet de limiter les fonctions du port USB-C lorsque l'appareil est verrouillé, voire en permanence (par exemple recharge uniquement). Cela réduit la surface d'attaque exploitée par certains outils d'extraction connectés au port."
    ]}
  ],
  fig: "encryption",
  steps: [
    "Ouvrez <b>Paramètres › Sécurité et confidentialité</b> et repérez les réglages de protection contre l'exploitation.",
    "Réglez le <b>redémarrage automatique</b> sur un délai compatible avec votre usage (plus il est court, plus la protection est forte).",
    "Réglez le <b>port USB-C</b> sur une option qui limite les données lorsque l'appareil est verrouillé.",
    "Vérifiez que la recharge fonctionne toujours appareil verrouillé.",
    "Prenez l'habitude d'éteindre l'appareil avant une situation à risque."
  ],
  result: "L'appareil revient automatiquement en état BFU après inactivité, et son port USB est restreint lorsqu'il est verrouillé.",
  ex: [
    "Un téléphone volé et laissé verrouillé redémarre automatiquement après le délai configuré : ses données repassent en état chiffré inaccessible.",
    "Un outil d'extraction branché sur le port USB d'un appareil verrouillé ne peut pas établir de connexion de données."
  ],
  err: [
    ["Désactiver le redémarrage automatique pour ne pas ressaisir son code.", "Gardez un délai raisonnable : c'est une protection majeure."],
    ["Restreindre le port au point d'empêcher la recharge.", "Choisissez une option qui conserve la recharge."],
    ["Oublier que les accessoires USB ne fonctionneront pas appareil verrouillé.", "Déverrouillez l'appareil avant de brancher un accessoire."]
  ],
  reco: [
    "Les profils à haut risque gagnent à choisir un délai de redémarrage court.",
    "Combinez avec un code long : c'est lui qui protège les données en état BFU."
  ],
  sum: "Le redémarrage automatique remet l'appareil en état BFU après inactivité, et le contrôle du port USB-C limite les attaques par connexion physique sur un appareil verrouillé. Associés à un code robuste, ils protègent efficacement les données au repos.",
  quiz: [
    { q: "Quel est l'effet du redémarrage automatique sur les données ?", o: ["Elles sont effacées", "Elles repassent en état BFU, chiffrées et inaccessibles sans le code", "Elles sont envoyées dans le cloud", "Aucun effet"], a: 1, e: "Le redémarrage retire les clés de la mémoire." },
    { q: "Pourquoi restreindre le port USB-C appareil verrouillé ?", o: ["Pour charger plus vite", "Pour réduire les attaques par outils d'extraction connectés", "Pour écouter de la musique", "Pour économiser des données"], a: 1, e: "Le port USB est une surface d'attaque physique." }
  ]
},
/* ---------------------------------------------------------------- 7.12 */
{
  obj: "Gérer les mises à jour de GrapheneOS : fonctionnement, canaux de publication et bonnes pratiques.",
  intro: [
    "GrapheneOS publie fréquemment des mises à jour, qui intègrent les correctifs d'Android, du micrologiciel et ses propres améliorations. Le système de mise à jour est conçu pour être automatique et sûr.",
    "Votre rôle : le laisser travailler et redémarrer régulièrement."
  ],
  tech: [
    REF,
    "Le système de mise à jour télécharge et installe les mises à jour en arrière-plan sur la partition inactive, puis les applique au redémarrage, avec retour automatique à la version précédente en cas d'échec. Les mises à jour sont signées et vérifiées. Plusieurs canaux de publication existent (par exemple stable et bêta) ; le canal stable convient à la grande majorité des utilisateurs. Les notes de version sont publiées sur <code>grapheneos.org/releases</code>.",
    "Les applications du projet se mettent à jour via l'App Store ; les autres applications via leur source respective."
  ],
  fig: "update-cycle",
  steps: [
    "Ouvrez <b>Paramètres › Système › Mise à jour du système</b>.",
    "Vérifiez le canal de publication (stable recommandé).",
    "Vérifiez les conditions de téléchargement (par exemple, réseau non limité).",
    "Lorsque la notification de redémarrage apparaît, redémarrez dès que possible.",
    "Ouvrez l'App Store et vérifiez les mises à jour des applications du projet.",
    "Consultez de temps à autre les notes de version officielles."
  ],
  result: "Le système et les applications du projet se mettent à jour automatiquement, et vous redémarrez rapidement pour appliquer les mises à jour.",
  ex: [
    "Une mise à jour corrigeant une faille critique est installée en arrière-plan ; le redémarrage du soir l'applique en quelques secondes.",
    "Une mise à jour échoue au démarrage : l'appareil revient automatiquement à la version précédente."
  ],
  err: [
    ["Choisir le canal bêta sans en mesurer les conséquences.", "Restez sur le canal stable pour un usage quotidien."],
    ["Reporter indéfiniment le redémarrage.", "Redémarrez dès que possible pour appliquer les correctifs."],
    ["Restreindre le téléchargement à un réseau rarement disponible.", "Assurez-vous que l'appareil peut télécharger régulièrement."]
  ],
  reco: [
    "Redémarrez au moins une fois par semaine, ce qui applique aussi les mises à jour en attente.",
    "Surveillez les dates de fin de support de votre appareil."
  ],
  sum: "GrapheneOS installe ses mises à jour signées en arrière-plan, avec retour arrière automatique en cas d'échec. Restez sur le canal stable, laissez les téléchargements automatiques et redémarrez rapidement pour appliquer les correctifs.",
  quiz: [
    { q: "Quel canal de publication convient à la majorité des utilisateurs ?", o: ["Stable", "Bêta", "Développement", "Aucun"], a: 0, e: "Le canal stable est destiné à l'usage quotidien." },
    { q: "Où consulter les notes de version officielles ?", o: ["grapheneos.org/releases", "Un forum quelconque", "La boîte du téléphone", "Le Play Store"], a: 0, e: "Le projet publie ses notes de version sur cette page." }
  ]
},
/* ---------------------------------------------------------------- 7.13 */
{
  obj: "Activer, selon son modèle de menaces, les paramètres de sécurité avancés de GrapheneOS : brouillage du PIN, déverrouillage en deux facteurs, code de contrainte et autres options.",
  intro: [
    "Le module 4 a présenté les fonctions avancées. Cette leçon explique comment les configurer, une par une, avec leurs précautions.",
    "Activez uniquement celles qui répondent à un besoin identifié."
  ],
  tech: [
    REF,
    { h: "Les principaux réglages", ul: [
      "<b>Brouillage du PIN</b> : dans les réglages du verrouillage de l'écran, option de disposition aléatoire du clavier.",
      "<b>Déverrouillage en deux facteurs</b> : empreinte puis PIN, dans les réglages de déverrouillage par empreinte.",
      "<b>Code ou mot de passe de contrainte</b> : dans les réglages de déverrouillage de l'appareil. Sa saisie efface l'appareil de façon irréversible.",
      "<b>Réglages de protection contre l'exploitation</b> : options globales (par exemple concernant les capteurs par défaut, le débogage natif) et par application.",
      "<b>Option Verrouillage</b> du menu d'alimentation, comme sur Android."
    ]}
  ],
  fig: "lockscreen",
  steps: [
    "Relisez votre modèle de menaces et choisissez les options pertinentes.",
    "Activez le <b>brouillage du PIN</b> si vous saisissez souvent votre code en public.",
    "Activez le <b>déverrouillage en deux facteurs</b> si vous voulez combiner commodité et résistance à la contrainte.",
    "Pour le <b>code de contrainte</b> : vérifiez d'abord vos sauvegardes, choisissez un code très différent du code principal, puis configurez-le en connaissance de cause.",
    "Testez votre usage quotidien pendant quelques jours avant d'ajouter d'autres options.",
    "Documentez vos choix dans votre fiche d'appareil."
  ],
  result: "Les options avancées correspondant à votre profil sont actives et maîtrisées.",
  caution: "Le code de contrainte efface l'appareil sans possibilité d'annulation. Ne le configurez qu'après avoir mis en place des sauvegardes fiables et choisi un code impossible à saisir par erreur.",
  ex: [
    "Un consultant qui saisit son code dans les transports active le brouillage du PIN.",
    "Une militante active le déverrouillage en deux facteurs : une empreinte seule ne suffit plus à déverrouiller son téléphone."
  ],
  err: [
    ["Choisir un code de contrainte proche du code principal.", "Choisissez un code totalement différent."],
    ["Activer toutes les options d'un coup.", "Procédez progressivement pour identifier l'effet de chacune."],
    ["Ne pas documenter ses réglages.", "Notez-les pour pouvoir les reproduire."]
  ],
  reco: [
    "Révisez vos choix lorsque votre situation change.",
    "Consultez la page Features pour la description officielle de chaque option."
  ],
  sum: "Le brouillage du PIN, le déverrouillage en deux facteurs, le code de contrainte et les réglages de protection contre l'exploitation s'activent selon le modèle de menaces, progressivement, avec une attention particulière au caractère irréversible du code de contrainte.",
  quiz: [
    { q: "Que faut-il impérativement faire avant de configurer un code de contrainte ?", o: ["Vérifier ses sauvegardes", "Installer Google Play", "Désactiver le chiffrement", "Rien"], a: 0, e: "La saisie du code efface tout, de façon irréversible." },
    { q: "Quel réglage combine empreinte digitale et PIN ?", o: ["Le déverrouillage en deux facteurs", "Le brouillage du PIN", "Le DNS privé", "Storage Scopes"], a: 0, e: "L'empreinte seule ne suffit alors plus." }
  ]
},
/* ---------------------------------------------------------------- 7.14 */
{
  obj: "Se protéger contre les applications malveillantes sur GrapheneOS, en l'absence d'antivirus intégré.",
  intro: [
    "GrapheneOS n'intègre pas d'antivirus et, sans Google Play, Play Protect n'est pas présent. La protection repose sur d'autres principes : un bac à sable renforcé, des permissions fines et des choix d'installation rigoureux.",
    "Cette leçon rassemble ces principes en une méthode."
  ],
  tech: [
    REF,
    "Le modèle de sécurité d'Android, renforcé par GrapheneOS, limite fortement ce qu'une application malveillante peut faire sans les permissions que vous lui accordez. Le risque principal reste donc l'installation d'une application trompeuse et l'octroi de permissions puissantes (accessibilité, notifications, administration de l'appareil). Les profils permettent en outre de contenir une application douteuse loin de vos données sensibles."
  ],
  fig: "sandbox",
  steps: [
    "Installez uniquement depuis des sources identifiées (leçon 9).",
    "Refusez par défaut les permissions Réseau et Capteurs aux applications qui n'en ont pas besoin.",
    "N'accordez jamais l'accessibilité, l'accès aux notifications ou l'administration de l'appareil à une application dont vous n'êtes pas certain.",
    "Placez les applications dont la réputation est incertaine dans un profil secondaire, sans données sensibles.",
    "Revoyez les accès spéciaux chaque mois.",
    "En cas de doute sur une application, désinstallez-la ; en cas de doute sur un profil, supprimez-le."
  ],
  result: "Vos applications sont installées et cloisonnées de façon à limiter l'impact d'une éventuelle application malveillante.",
  ex: [
    "Une application de jeu douteuse est installée dans un profil « Bac à sable » sans réseau : elle ne peut ni exfiltrer de données, ni accéder au profil principal.",
    "Une application demande l'accessibilité pour « améliorer l'expérience » : refus et désinstallation."
  ],
  err: [
    ["Installer un antivirus tiers demandant des accès étendus.", "Ses accès créeraient plus de risques qu'ils n'en couvrent."],
    ["Croire que GrapheneOS rend toute application inoffensive.", "Une application dispose toujours des permissions que vous lui accordez."],
    ["Installer une application douteuse dans le profil principal.", "Utilisez un profil séparé."]
  ],
  reco: [
    "Le cloisonnement par profils est votre meilleur outil contre une application douteuse.",
    "Gardez le principe : moins d'applications, moins de permissions, plus de profils."
  ],
  sum: "Sans antivirus intégré, GrapheneOS s'appuie sur le bac à sable renforcé, les permissions fines (Réseau, Capteurs, accès spéciaux) et le cloisonnement par profils. Des sources fiables et le refus des accès puissants constituent la meilleure protection.",
  quiz: [
    { q: "Quel est le risque principal face aux malwares sur GrapheneOS ?", o: ["Une faille de l'écran", "L'installation d'une application trompeuse et l'octroi de permissions puissantes", "Le mode sombre", "La recharge rapide"], a: 1, e: "Comme sur Android, l'utilisateur reste la cible principale." },
    { q: "Où placer une application de réputation incertaine ?", o: ["Dans le profil propriétaire", "Dans un profil secondaire sans données sensibles", "Dans l'espace privé avec vos documents", "Partout"], a: 1, e: "Le cloisonnement limite l'impact d'une éventuelle compromission." }
  ]
},
/* ---------------------------------------------------------------- 7.15 */
{
  obj: "Adopter les bonnes pratiques de confidentialité au quotidien sur GrapheneOS.",
  intro: [
    "Un système protecteur ne suffit pas : ce sont les usages qui déterminent la quantité de données que vous exposez. Cette dernière leçon du module 7 rassemble les bonnes pratiques à adopter durablement.",
    "Elle fait le lien avec le module 8, consacré aux communications et à la vie privée."
  ],
  tech: [
    REF,
    { h: "Les principes", ul: [
      "<b>Minimisation</b> : moins d'applications, moins de comptes, moins de permissions.",
      "<b>Cloisonnement</b> : profils et espace privé selon les usages.",
      "<b>Maîtrise des identifiants</b> : comptes dédiés lorsque c'est utile, adresses e-mail distinctes.",
      "<b>Sobriété réseau</b> : permission Réseau refusée par défaut, radios coupées quand elles ne servent pas.",
      "<b>Hygiène régulière</b> : revue mensuelle des permissions, des applications et des profils."
    ]}
  ],
  fig: "profiles",
  steps: [
    "Établissez une routine mensuelle de 15 minutes : mises à jour, permissions, accès spéciaux, applications inutilisées.",
    "Utilisez Vanadium pour la navigation et réglez ses options de confidentialité.",
    "Limitez le nombre de comptes connectés sur l'appareil.",
    "Retirez les métadonnées des photos avant de les partager (module 8).",
    "Redémarrez régulièrement l'appareil.",
    "Réévaluez votre organisation en profils tous les six mois."
  ],
  result: "Vous disposez d'une routine de confidentialité simple et durable.",
  ex: [
    "Un utilisateur consacre le premier dimanche du mois à sa routine : il supprime deux applications et retire trois permissions inutiles.",
    "Une utilisatrice crée une adresse e-mail dédiée aux inscriptions commerciales dans son profil « Services »."
  ],
  err: [
    ["Configurer parfaitement l'appareil puis ne plus jamais y revenir.", "Instaurez une routine régulière."],
    ["Multiplier les comptes connectés sur l'appareil.", "Limitez-les au nécessaire."],
    ["Partager des photos avec leurs coordonnées GPS.", "Retirez les métadonnées avant le partage."]
  ],
  reco: [
    "La confidentialité est un ensemble d'habitudes, pas un réglage unique.",
    "Partagez ces bonnes pratiques avec vos proches : leur téléphone contient aussi vos données."
  ],
  sum: "La confidentialité au quotidien repose sur la minimisation, le cloisonnement, la maîtrise des identifiants, la sobriété réseau et une hygiène régulière. Une routine mensuelle courte permet de maintenir ce niveau dans le temps.",
  quiz: [
    { q: "Quel principe consiste à réduire le nombre d'applications, de comptes et de permissions ?", o: ["La minimisation", "La duplication", "L'optimisation graphique", "La compression"], a: 0, e: "Moins d'éléments, c'est moins de données exposées." },
    { q: "Pourquoi sensibiliser ses proches ?", o: ["Parce que leur téléphone contient aussi vos données (contacts, messages, photos)", "Pour vendre une formation", "Ce n'est pas utile", "Pour économiser de la batterie"], a: 0, e: "Votre vie privée dépend aussi des appareils de vos interlocuteurs." }
  ]
}
];
})();
