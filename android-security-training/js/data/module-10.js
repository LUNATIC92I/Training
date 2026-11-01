/* Module 10 : Cas pratiques et évaluation finale
   Les scénarios sont fictifs et pédagogiques. L'examen final est dans
   js/data/exam.js. */
window.ASG = window.ASG || {}; ASG.content = ASG.content || {};
ASG.content.m10 = [
/* ---------------------------------------------------------------- 10.1 */
{
  obj: "Gérer de bout en bout la perte d'un smartphone : priorités, actions immédiates et retour d'expérience.",
  intro: [
    "<b>Scénario.</b> Awa, consultante, s'aperçoit à 19 h, en rentrant chez elle, qu'elle a perdu son téléphone Android professionnel et personnel, probablement dans un taxi. Il contient sa messagerie, son application bancaire, ses codes de validation et des documents clients.",
    "Votre mission : l'aider à réagir dans le bon ordre, puis à tirer les leçons de l'incident."
  ],
  tech: [
    { h: "Analyse de la situation", p: [
      "Les dégâts dépendent de la préparation : verrouillage robuste, chiffrement, localisation activée, notifications masquées. Le premier objectif est de garder le contrôle de l'appareil et des comptes ; le second, de récupérer l'appareil si possible ; le troisième, de limiter l'exposition des données des clients."
    ]},
    { h: "Les priorités", ul: [
      "Localiser et verrouiller l'appareil (module 3, leçon 15).",
      "Sécuriser les comptes, en commençant par la messagerie et le compte Google.",
      "Bloquer la carte SIM pour couper l'accès aux codes par SMS.",
      "Informer l'employeur, qui peut agir via la gestion de flotte et évaluer l'obligation de notification liée aux données clients.",
      "Effacer à distance si la récupération est jugée impossible."
    ]}
  ],
  fig: "antitheft",
  steps: [
    "Depuis un ordinateur, ouvrir <code>google.com/android/find</code>, localiser et faire sonner l'appareil.",
    "Verrouiller l'appareil avec un message et un numéro de contact.",
    "Contacter la compagnie de taxi avec la position affichée.",
    "Changer le mot de passe du compte Google et déconnecter l'appareil perdu dans <b>Vos appareils</b>.",
    "Appeler l'opérateur pour suspendre la ligne et bloquer la SIM.",
    "Prévenir l'employeur et le service informatique.",
    "Si l'appareil n'est pas retrouvé sous 24 à 48 heures (ou immédiatement en cas de données très sensibles), lancer l'effacement à distance.",
    "Déposer plainte avec l'IMEI, puis restaurer la sauvegarde sur un nouvel appareil."
  ],
  result: "L'appareil est verrouillé, les comptes sécurisés, la SIM bloquée, l'employeur informé, et les données protégées ou effacées.",
  ex: [
    "Grâce au verrouillage à distance et au message affiché, le chauffeur rapporte le téléphone le lendemain.",
    "Retour d'expérience : Awa active désormais le masquage des notifications et sépare ses usages professionnels dans un profil de travail."
  ],
  err: [
    ["Effacer immédiatement l'appareil sans avoir tenté la localisation.", "Localisez et verrouillez d'abord, sauf si les données sont extrêmement sensibles."],
    ["Oublier de bloquer la SIM.", "Appelez l'opérateur rapidement."],
    ["Ne pas informer l'employeur alors que des données clients sont concernées.", "Informez-le sans délai : il peut avoir des obligations légales."]
  ],
  reco: [
    "Préparez une fiche « perte ou vol » avec les liens, numéros utiles et l'IMEI.",
    "Testez la localisation une fois par an.",
    "Séparez les données professionnelles par un profil de travail géré."
  ],
  sum: "Face à une perte : localiser, verrouiller, sécuriser les comptes, bloquer la SIM, informer l'employeur, effacer si nécessaire, porter plainte et restaurer. La préparation (verrouillage, chiffrement, sauvegarde, notifications masquées) détermine l'ampleur des dégâts.",
  quiz: [
    { q: "Quelle est la toute première action recommandée dans ce scénario ?", o: ["Effacer l'appareil", "Localiser et verrouiller l'appareil à distance", "Acheter un nouveau téléphone", "Publier un message sur les réseaux sociaux"], a: 1, e: "L'effacement empêche ensuite la localisation : il vient en dernier recours." },
    { q: "Pourquoi informer l'employeur ?", o: ["Par politesse", "Parce que des données clients sont concernées et qu'il peut agir via la gestion de flotte", "Pour obtenir un congé", "Ce n'est pas utile"], a: 1, e: "L'employeur peut avoir des obligations de notification et des moyens d'action." },
    { q: "Quelle mesure aurait limité l'exposition des codes reçus par SMS ?", o: ["Masquer le contenu des notifications sur l'écran verrouillé", "Augmenter la luminosité", "Changer de sonnerie", "Désactiver le Wi-Fi"], a: 0, e: "Un téléphone verrouillé n'affiche alors plus les codes." }
  ]
},
/* ---------------------------------------------------------------- 10.2 */
{
  obj: "Évaluer une application qui demande des permissions excessives et décider de la conduite à tenir.",
  intro: [
    "<b>Scénario.</b> Kofi installe une application de retouche photo gratuite, très bien notée. Au premier lancement, elle demande l'accès aux contacts, à la position précise en permanence, au micro, à l'accessibilité et l'autorisation d'afficher par-dessus les autres applications.",
    "Votre mission : analyser chaque demande et conseiller Kofi."
  ],
  tech: [
    { h: "Analyse demande par demande", ul: [
      "<b>Photos</b> : justifiées, mais le sélecteur de photos ou l'accès partiel suffisent.",
      "<b>Contacts</b> : aucune justification pour la retouche.",
      "<b>Position précise permanente</b> : aucune justification ; tout au plus la lecture des métadonnées de lieu des photos.",
      "<b>Micro</b> : aucune justification, sauf fonction vidéo explicite.",
      "<b>Accessibilité et superposition</b> : drapeaux rouges majeurs pour une application de ce type."
    ]},
    { h: "Conclusion", p: [
      "Le cumul de demandes injustifiées, dont deux accès très puissants, est caractéristique soit d'une application malveillante, soit d'une application financée par une collecte massive de données. Dans les deux cas, la réponse est la même."
    ]}
  ],
  fig: "permissions",
  steps: [
    "Refuser toutes les permissions demandées au lancement.",
    "Vérifier l'éditeur : site officiel, politique de confidentialité, autres applications publiées.",
    "Consulter les avis récents (et non la note globale), en recherchant des mentions de publicités intrusives ou de comportements étranges.",
    "Désinstaller l'application.",
    "Choisir une alternative réputée qui fonctionne avec le sélecteur de photos.",
    "Vérifier dans les accès spéciaux qu'aucun droit n'a été accordé par erreur pendant l'installation."
  ],
  result: "L'application est désinstallée sans qu'aucun accès sensible n'ait été accordé, et une alternative sobre est utilisée.",
  ex: [
    "L'alternative choisie demande uniquement l'accès aux photos sélectionnées : c'est cohérent avec sa fonction.",
    "Sur GrapheneOS, Kofi aurait pu en plus lui retirer la permission Réseau, empêchant toute transmission des photos."
  ],
  err: [
    ["Accepter car « l'application est bien notée ».", "La note ne dit rien des permissions ; jugez chaque demande."],
    ["Accorder l'accessibilité pour « débloquer une fonction ».", "Une application de retouche n'en a pas besoin."],
    ["Garder l'application en refusant les accès mais sans vérifier les accès spéciaux.", "Contrôlez aussi les accès spéciaux."]
  ],
  reco: [
    "Appliquez la question clé : cette permission sert-elle la fonction principale ?",
    "Préférez les applications qui utilisent le sélecteur de photos du système."
  ],
  sum: "Une application qui cumule des demandes injustifiées (contacts, position permanente, micro, accessibilité, superposition) doit être refusée et désinstallée, quelle que soit sa note. Le principe du moindre privilège guide l'analyse.",
  quiz: [
    { q: "Pour une application de retouche photo, quelle demande est la plus inquiétante ?", o: ["L'accès aux photos sélectionnées", "L'accès au service d'accessibilité", "L'accès au stockage d'une image", "Aucune"], a: 1, e: "L'accessibilité permet de lire l'écran et d'agir à votre place." },
    { q: "Quel accès suffit généralement à une application de retouche ?", o: ["Le sélecteur de photos ou l'accès partiel", "L'accès à tous les fichiers", "L'administration de l'appareil", "Le journal d'appels"], a: 0, e: "L'application ne reçoit alors que les photos choisies." }
  ]
},
/* ---------------------------------------------------------------- 10.3 */
{
  obj: "Réagir efficacement après être tombé dans un piège de phishing, en limitant les dégâts.",
  intro: [
    "<b>Scénario.</b> Mariam reçoit un SMS « Votre colis est bloqué, réglez 2,49 € ». Elle clique, saisit les données de sa carte bancaire, puis un code reçu par SMS. Une heure plus tard, elle comprend qu'il s'agissait d'une arnaque.",
    "Votre mission : établir le plan de réaction et identifier ce qui aurait pu l'éviter."
  ],
  tech: [
    { h: "Ce que l'attaquant possède", ul: [
      "Les données de la carte bancaire (numéro, date, cryptogramme).",
      "Potentiellement, la validation d'un paiement ou l'ajout de la carte dans un portefeuille mobile, grâce au code saisi.",
      "Le numéro de téléphone de Mariam, désormais identifié comme réactif."
    ]},
    { h: "Le facteur temps", p: [
      "Les fraudeurs exploitent les données très rapidement. Chaque minute compte : l'opposition bancaire est l'action prioritaire."
    ]}
  ],
  fig: "phishing",
  steps: [
    "Appeler immédiatement le service d'opposition de la banque (numéro officiel au dos de la carte ou sur le site de la banque) et faire opposition.",
    "Signaler les opérations éventuellement réalisées et demander le remboursement selon la procédure de la banque.",
    "Vérifier dans l'application bancaire les appareils ou portefeuilles mobiles récemment associés et les supprimer.",
    "Si un mot de passe a été saisi sur le faux site, le changer partout où il était utilisé.",
    "Signaler le SMS frauduleux selon les dispositifs disponibles dans votre pays, puis le supprimer.",
    "Rester vigilant face aux appels de « faux conseillers » qui suivent souvent ce type d'arnaque.",
    "Déposer plainte si un préjudice est constaté."
  ],
  result: "La carte est en opposition, les opérations frauduleuses signalées, les accès supprimés et la victime préparée aux tentatives suivantes.",
  ex: [
    "Le lendemain, un « conseiller de la banque » appelle Mariam pour « annuler la fraude » et lui demande un nouveau code : c'est la seconde phase de l'arnaque, elle raccroche.",
    "Avec une clé d'accès et un gestionnaire de mots de passe, Mariam aurait été alertée par l'absence de remplissage automatique sur le faux domaine."
  ],
  err: [
    ["Attendre de constater un débit avant d'agir.", "Faites opposition immédiatement."],
    ["Rappeler le numéro figurant dans le SMS frauduleux.", "Utilisez uniquement les coordonnées officielles de la banque."],
    ["Communiquer un nouveau code à un « conseiller ».", "Aucun conseiller légitime ne demande de code."]
  ],
  reco: [
    "Ne jamais payer de « frais de livraison » via un lien reçu par SMS ; vérifiez sur le site officiel du transporteur.",
    "Activez les alertes de paiement de votre banque."
  ],
  sum: "Après un phishing bancaire : opposition immédiate, signalement des opérations, suppression des appareils associés, changement des mots de passe, signalement du SMS, vigilance face aux faux conseillers et plainte. La prévention repose sur la vérification par canal indépendant.",
  quiz: [
    { q: "Quelle est l'action prioritaire après avoir saisi ses données de carte sur un faux site ?", o: ["Faire opposition auprès de la banque immédiatement", "Attendre le relevé mensuel", "Répondre au SMS", "Changer de fond d'écran"], a: 0, e: "Les fraudeurs agissent vite : l'opposition bloque la carte." },
    { q: "Un « conseiller » appelle pour annuler la fraude et demande un code. Que faire ?", o: ["Donner le code", "Raccrocher : c'est la suite de l'arnaque", "Donner la moitié du code", "Lui envoyer par SMS"], a: 1, e: "Aucun conseiller légitime ne demande de code de validation." }
  ]
},
/* ---------------------------------------------------------------- 10.4 */
{
  obj: "Analyser un APK suspect de manière sûre et décider de son sort.",
  intro: [
    "<b>Scénario.</b> Le service comptable d'une PME reçoit par messagerie un fichier « Facture_2026.apk » envoyé par un fournisseur habituel. Un employé se demande s'il doit l'ouvrir. Vous êtes sollicité en tant que référent sécurité.",
    "Votre mission : analyser la situation sans prendre de risque."
  ],
  tech: [
    { h: "Premiers constats", ul: [
      "Une facture n'est jamais une application : un fichier <code>.apk</code> présenté comme une facture est un signal d'alerte majeur.",
      "Le compte du fournisseur a probablement été compromis, ou son identité usurpée.",
      "L'objectif probable : installer un cheval de Troie bancaire ou un logiciel espion."
    ]},
    { h: "Analyse sûre", p: [
      "Le fichier ne doit jamais être ouvert sur un appareil de production. Pour une analyse approfondie, il peut être examiné dans un environnement isolé de laboratoire, ou soumis à des services d'analyse reconnus par une personne habilitée, en tenant compte de la confidentialité du fichier. L'examen du manifeste révèle souvent des permissions incohérentes (SMS, accessibilité)."
    ]}
  ],
  fig: "apk-check",
  steps: [
    "Demander à l'employé de ne pas ouvrir le fichier et de ne pas le transférer.",
    "Contacter le fournisseur par un canal indépendant (téléphone connu) pour vérifier l'envoi.",
    "Informer le service informatique et conserver le message comme preuve.",
    "Vérifier que l'autorisation d'installer des applications inconnues est désactivée pour la messagerie sur les appareils concernés.",
    "Si un employé a installé le fichier, isoler l'appareil (mode avion), puis suivre la procédure d'incident : inventaire, retrait des droits, réinitialisation et changement des mots de passe depuis un appareil sain.",
    "Sensibiliser l'équipe à ce type d'attaque."
  ],
  result: "Le fichier n'est pas installé, l'incident est documenté, le fournisseur alerté et les appareils protégés.",
  ex: [
    "Le fournisseur confirme que sa messagerie a été piratée et que plusieurs clients ont reçu le même fichier.",
    "Sur un appareil Samsung avec le Blocage automatique, l'installation aurait de toute façon été bloquée."
  ],
  err: [
    ["Ouvrir le fichier « pour voir ».", "Ne l'ouvrez jamais sur un appareil de production."],
    ["Répondre au message pour demander des précisions.", "Contactez le fournisseur par un canal indépendant."],
    ["Supprimer le message sans le signaler.", "Conservez-le comme preuve et informez le service informatique."]
  ],
  reco: [
    "Interdire l'installation d'applications inconnues par la politique de gestion des terminaux.",
    "Former les équipes au principe : un document n'est jamais un fichier .apk."
  ],
  sum: "Un APK présenté comme un document est un signal d'alerte majeur. Ne pas l'ouvrir, vérifier par un canal indépendant, documenter, protéger les appareils et, en cas d'installation, appliquer une procédure d'incident complète.",
  quiz: [
    { q: "Une « facture » arrive sous forme de fichier .apk. Qu'en conclure ?", o: ["C'est un format normal de facture", "C'est un signal d'alerte majeur : une facture n'est pas une application", "Il faut l'ouvrir rapidement", "Il faut le partager"], a: 1, e: "Un APK est un programme d'installation, pas un document." },
    { q: "Comment vérifier l'envoi auprès du fournisseur ?", o: ["En répondant au message", "Par un canal indépendant, comme un numéro de téléphone connu", "En installant le fichier", "En publiant le fichier en ligne"], a: 1, e: "Le compte de messagerie du fournisseur peut être compromis." }
  ]
},
/* ---------------------------------------------------------------- 10.5 */
{
  obj: "Évaluer un appareil Android qui n'est plus mis à jour et proposer une solution adaptée.",
  intro: [
    "<b>Scénario.</b> Ibrahim utilise depuis 2020 un smartphone de milieu de gamme. Son correctif de sécurité date de 2023 et le fabricant n'annonce plus de mises à jour. Il y gère sa banque, sa messagerie professionnelle et ses photos familiales. Il ne souhaite pas dépenser beaucoup.",
    "Votre mission : évaluer le risque et proposer des options réalistes."
  ],
  tech: [
    { h: "Évaluation", p: [
      "Toutes les vulnérabilités publiées depuis 2023 dans le système et les composants de l'appareil restent ouvertes. Les mises à jour d'applications (navigateur, WebView) atténuent une partie du risque, mais pas celles du noyau ou des pilotes. Le risque est élevé pour des usages bancaires et professionnels."
    ]},
    { h: "Les options", ul: [
      "<b>Remplacer l'appareil</b> par un modèle doté d'une longue durée de support restante, éventuellement reconditionné.",
      "<b>Réduire les usages sensibles</b> de l'ancien appareil en attendant (banque et messagerie professionnelle déplacées).",
      "<b>Renforcer la configuration</b> au maximum pendant la transition.",
      "Envisager un Pixel compatible GrapheneOS, neuf ou reconditionné, si le budget le permet et que le profil le justifie."
    ]}
  ],
  fig: "update-cycle",
  steps: [
    "Relever la version d'Android, le niveau de correctif et la date de fin de support annoncée.",
    "Classer l'appareil comme non conforme (module 9).",
    "Mettre à jour toutes les applications, en particulier le navigateur et WebView.",
    "Déplacer temporairement les usages bancaires et professionnels vers un autre appareil à jour ou vers un ordinateur sécurisé.",
    "Comparer quelques modèles abordables selon le coût par année de support restante.",
    "Planifier la migration et le transfert des données (sauvegarde vérifiée)."
  ],
  result: "Ibrahim comprend le risque, a réduit ses usages sensibles sur l'ancien appareil et dispose d'un plan de remplacement adapté à son budget.",
  ex: [
    "Un modèle reconditionné récent avec cinq ans de support restant revient moins cher par année de protection qu'un modèle neuf d'entrée de gamme avec deux ans de support.",
    "L'ancien téléphone, réinitialisé, sert ensuite de réveil ou de lecteur de musique hors ligne."
  ],
  err: [
    ["Installer une ROM non officielle trouvée sur un forum pour « mettre à jour ».", "Une ROM non vérifiée, souvent avec bootloader déverrouillé, n'est pas une solution sûre."],
    ["Croire qu'un antivirus compense l'absence de correctifs.", "Il ne corrige pas les failles du système."],
    ["Revendre l'appareil sans le réinitialiser.", "Réinitialisez-le après avoir sauvegardé et retiré les comptes."]
  ],
  reco: [
    "Intégrez la durée de support restante dans chaque décision d'achat.",
    "Planifiez le remplacement avant la date de fin de support."
  ],
  sum: "Un appareil sans correctifs depuis longtemps présente un risque élevé pour les usages sensibles. La solution passe par la réduction de ces usages, une configuration renforcée transitoire et un remplacement par un modèle bien supporté, évalué selon le coût par année de support.",
  quiz: [
    { q: "Les mises à jour d'applications suffisent-elles sur un appareil sans correctifs système ?", o: ["Oui", "Non, le noyau et les pilotes restent vulnérables", "Oui, si l'antivirus est actif", "Oui, en Wi-Fi"], a: 1, e: "Seul le fabricant corrige le système et les composants." },
    { q: "Quel critère privilégier pour un achat à budget limité ?", o: ["Le coût par année de support restante", "La couleur", "Le nombre de caméras", "La taille de l'écran"], a: 0, e: "C'est le meilleur indicateur de la durée de protection." }
  ]
},
/* ---------------------------------------------------------------- 10.6 */
{
  obj: "Accompagner un utilisateur souhaitant migrer vers GrapheneOS, de l'évaluation à la vérification finale.",
  intro: [
    "<b>Scénario.</b> Fatou, journaliste indépendante, travaille sur des sujets sensibles et souhaite migrer vers GrapheneOS. Elle possède un Pixel 9 acheté auprès de Google. Elle utilise Signal, une application bancaire, une application de transport et un client de messagerie professionnelle.",
    "Votre mission : l'accompagner étape par étape, en appliquant les modules 4 à 7."
  ],
  tech: [
    { h: "Évaluation préalable", ul: [
      "Modèle de menaces : exposition à des logiciels espions ciblés et à la saisie de l'appareil : GrapheneOS est pertinent.",
      "Appareil : Pixel 9 (<code>tokay</code>), présent dans la liste officielle et recommandé, acheté auprès de Google (pas de variante opérateur).",
      "Applications : Signal fonctionne sans Google Play ; l'application de transport et la banque peuvent nécessiter Google Play en bac à sable ; la compatibilité bancaire doit être testée."
    ]},
    { h: "Organisation cible", p: [
      "Profil principal sans Google Play (Signal, navigateur, messagerie professionnelle), profil « Services » avec Google Play en bac à sable (transport, banque), redémarrage automatique court, déverrouillage en deux facteurs, Auditor pour la vérification."
    ]}
  ],
  fig: "install-flow",
  steps: [
    "Vérifier la compatibilité sur la page officielle et l'option Déverrouillage OEM (module 5).",
    "Sauvegarder toutes les données, y compris la sauvegarde Signal et les facteurs d'authentification (module 5, leçon 5).",
    "Installer GrapheneOS avec l'installateur Web officiel (module 6, étapes 1 à 16).",
    "Vérifier l'installation : désactivation du déverrouillage OEM, empreinte de la clé, Auditor (étape 17).",
    "Configurer le profil principal et restaurer Signal.",
    "Créer le profil « Services », y installer Google Play en bac à sable, puis l'application de transport et la banque (module 7).",
    "Activer les réglages avancés pertinents (module 7, leçon 13).",
    "Planifier une vérification Auditor régulière."
  ],
  result: "Fatou utilise GrapheneOS vérifié, avec une organisation en profils adaptée à son métier et ses applications fonctionnelles.",
  ex: [
    "L'application bancaire refuse de fonctionner : Fatou utilise le site web de la banque dans Vanadium, en attendant une évolution.",
    "Le profil « Services » est fermé avec Mettre fin à la session lorsqu'elle se rend à un rendez-vous sensible."
  ],
  err: [
    ["Commencer l'installation sans sauvegarde de Signal.", "Créez et vérifiez la sauvegarde avant toute manipulation."],
    ["Installer Google Play dans le profil principal.", "Isolez-le dans un profil dédié."],
    ["Négliger la vérification avec Auditor.", "Pour un profil à risque, elle est indispensable."]
  ],
  reco: [
    "Prévoir une demi-journée pour la migration complète.",
    "Documenter la configuration pour pouvoir la reproduire en cas de réinstallation."
  ],
  sum: "Une migration réussie suit l'ordre : évaluation (menaces, appareil, applications), sauvegarde, installation officielle, vérification, configuration en profils, réglages avancés et vérifications régulières. Les applications incompatibles sont anticipées.",
  quiz: [
    { q: "Dans ce scénario, où placer l'application bancaire nécessitant Google Play ?", o: ["Dans le profil principal avec Signal", "Dans un profil « Services » avec Google Play en bac à sable", "Sur un forum", "Nulle part"], a: 1, e: "L'isolement limite l'exposition du profil principal." },
    { q: "Quelle étape vérifie l'authenticité de l'installation ?", o: ["La comparaison de l'empreinte de la clé et l'attestation Auditor", "Le choix du fond d'écran", "L'installation de Signal", "Le redémarrage de l'ordinateur"], a: 0, e: "Ces vérifications détectent un système non authentique." }
  ]
},
/* ---------------------------------------------------------------- 10.7 */
{
  obj: "Diagnostiquer et corriger une mauvaise configuration des profils sur GrapheneOS.",
  intro: [
    "<b>Scénario.</b> Yao a installé GrapheneOS. Il a créé trois profils, mais : tous utilisent le même code ; Google Play est installé dans les trois ; l'application de messagerie sensible se trouve dans le profil qui contient aussi des jeux ; il ne met jamais fin aux sessions ; les notifications de tous les profils s'affichent en détail sur l'écran verrouillé.",
    "Votre mission : identifier chaque erreur et proposer une configuration corrigée."
  ],
  tech: [
    { h: "Diagnostic", ul: [
      "<b>Code identique</b> : un code observé ouvre tous les profils ; le cloisonnement est affaibli.",
      "<b>Google Play partout</b> : la séparation entre profils avec et sans services Google disparaît.",
      "<b>Messagerie sensible avec des jeux</b> : les applications à risque côtoient les données sensibles.",
      "<b>Sessions jamais fermées</b> : les données de tous les profils restent déchiffrées en mémoire.",
      "<b>Notifications détaillées</b> : les contenus fuient sur l'écran verrouillé."
    ]}
  ],
  fig: "profiles",
  steps: [
    "Définir un code distinct pour chaque profil.",
    "Réorganiser : profil propriétaire pour l'administration et les communications sensibles, profil « Services » avec Google Play, profil « Loisirs » pour les jeux, sans données sensibles.",
    "Désinstaller Google Play des profils qui n'en ont pas besoin.",
    "Déplacer la messagerie sensible dans le profil adapté, après sauvegarde.",
    "Prendre l'habitude de mettre fin aux sessions des profils inutilisés.",
    "Masquer le contenu sensible des notifications, y compris celles transférées depuis les autres profils."
  ],
  result: "Les profils sont cloisonnés, protégés par des codes distincts, avec Google Play limité au profil qui en a besoin et des notifications discrètes.",
  ex: [
    "Après correction, un jeu compromis dans le profil « Loisirs » n'a aucun accès aux conversations du profil principal.",
    "Le soir, Yao met fin aux sessions « Services » et « Loisirs » : leurs données repassent au repos."
  ],
  err: [
    ["Multiplier les profils sans plan.", "Définissez d'abord le rôle de chaque profil."],
    ["Transférer les notifications détaillées de tous les profils.", "Limitez le transfert et masquez le contenu."],
    ["Déplacer une application sans sauvegarder ses données.", "Sauvegardez avant toute réorganisation."]
  ],
  reco: [
    "Trois profils maximum suffisent à la plupart des usages.",
    "Réévaluez l'organisation tous les six mois."
  ],
  sum: "Une bonne organisation en profils repose sur des codes distincts, un rôle clair par profil, Google Play limité au profil qui en a besoin, des applications sensibles isolées des applications à risque, des sessions fermées et des notifications discrètes.",
  quiz: [
    { q: "Pourquoi utiliser un code différent par profil ?", o: ["Pour que la découverte d'un code n'ouvre pas tous les profils", "Pour économiser la batterie", "Parce que c'est obligatoire", "Ce n'est pas utile"], a: 0, e: "Des codes distincts renforcent le cloisonnement." },
    { q: "Quel est l'intérêt de mettre fin aux sessions inutilisées ?", o: ["Remettre leurs données au repos, chiffrées", "Accélérer le Wi-Fi", "Supprimer les applications", "Changer la langue"], a: 0, e: "Les clés du profil sont retirées de la mémoire." }
  ]
},
/* ---------------------------------------------------------------- 10.8 */
{
  obj: "Reprendre le contrôle d'un compte Google compromis et sécuriser durablement l'écosystème associé.",
  intro: [
    "<b>Scénario.</b> Aminata reçoit une alerte « Nouvelle connexion depuis un appareil inconnu » sur son compte Google, puis constate que son mot de passe a été modifié. Son téléphone Android est associé à ce compte, ainsi que ses photos, ses contacts et ses sauvegardes.",
    "Votre mission : récupérer le compte, limiter les dégâts et éviter une récidive."
  ],
  tech: [
    { h: "Ce que l'attaquant peut faire", ul: [
      "Lire les e-mails et réinitialiser les mots de passe d'autres services.",
      "Accéder aux photos, contacts, historique de position et sauvegardes.",
      "Localiser, verrouiller ou effacer les appareils associés.",
      "Ajouter ses propres méthodes de récupération pour garder l'accès."
    ]},
    { h: "La récupération", p: [
      "Google propose une procédure de récupération de compte (<code>accounts.google.com/signin/recovery</code>) qui s'appuie sur les informations de récupération et sur les appareils déjà connectés. Plus vite la procédure est lancée, plus les chances sont élevées."
    ]}
  ],
  fig: "account-mfa",
  steps: [
    "Depuis un appareil sain, lancer la procédure officielle de récupération de compte Google.",
    "Une fois l'accès retrouvé, définir un nouveau mot de passe unique et fort.",
    "Dans <b>Sécurité</b>, déconnecter tous les appareils inconnus et vérifier l'activité récente.",
    "Supprimer les méthodes de récupération, règles de transfert d'e-mails et accès tiers ajoutés par l'attaquant.",
    "Activer la validation en deux étapes avec une clé d'accès et générer de nouveaux codes de secours.",
    "Changer les mots de passe des services liés à cette adresse e-mail, en commençant par la banque.",
    "Rechercher l'origine : mot de passe réutilisé, phishing, application malveillante sur le téléphone (audit du module 9)."
  ],
  result: "Le compte est récupéré, nettoyé des accès de l'attaquant, protégé par une clé d'accès, et l'origine de la compromission est identifiée.",
  ex: [
    "L'attaquant avait ajouté une règle de transfert automatique de tous les e-mails vers son adresse : sa suppression coupe la fuite.",
    "L'origine était un mot de passe réutilisé, présent dans une fuite connue : Aminata adopte un gestionnaire de mots de passe."
  ],
  err: [
    ["Oublier les règles de transfert d'e-mails.", "Vérifiez les paramètres de transfert et de filtres de la messagerie."],
    ["Récupérer le compte depuis le téléphone potentiellement compromis.", "Utilisez un appareil sain."],
    ["Ne pas rechercher l'origine.", "Sans identifier la cause, la compromission peut se reproduire."]
  ],
  reco: [
    "Gardez vos informations de récupération à jour avant tout incident.",
    "Adoptez les clés d'accès et le Check-up Sécurité trimestriel."
  ],
  sum: "Face à un compte Google compromis : récupération officielle depuis un appareil sain, nouveau mot de passe, déconnexion des appareils, nettoyage des accès ajoutés (récupération, transferts, applications tierces), clé d'accès, changement des mots de passe liés et recherche de l'origine.",
  quiz: [
    { q: "Pourquoi vérifier les règles de transfert d'e-mails après une compromission ?", o: ["L'attaquant peut en avoir ajouté pour continuer à recevoir vos e-mails", "Pour trier les publicités", "Pour économiser de l'espace", "Ce n'est pas utile"], a: 0, e: "C'est une technique classique de persistance." },
    { q: "Depuis quel appareil mener la récupération ?", o: ["Depuis le téléphone potentiellement compromis", "Depuis un appareil sain", "Depuis un ordinateur public", "Peu importe"], a: 1, e: "Un appareil compromis pourrait capturer les nouveaux identifiants." },
    { q: "Quelle méthode de validation adopter ensuite ?", o: ["SMS uniquement", "Une clé d'accès (passkey), résistante au phishing", "Aucune", "Une question secrète"], a: 1, e: "La clé d'accès ne fonctionne pas sur un faux site." }
  ]
}
];
