/* Module 5 : Vérifier la compatibilité de son smartphone
   Données des appareils : js/data/devices.js (source : grapheneos.org/faq). */
window.ASG = window.ASG || {}; ASG.content = ASG.content || {};
(function () {
var WARN = "<b>Avertissement.</b> L'installation d'un système d'exploitation alternatif peut entraîner l'effacement complet des données de votre téléphone. Effectuez une sauvegarde avant toute intervention.";
ASG.content.m5 = [
/* ---------------------------------------------------------------- 5.1 */
{
  obj: "Identifier avec certitude le modèle exact de son téléphone, son nom commercial, sa référence et son nom de code.",
  intro: [
    "Ce module est obligatoire avant toute installation. GrapheneOS ne prend officiellement en charge qu'une liste précise d'appareils, et chaque image système est conçue pour un modèle exact. Installer l'image d'un autre modèle est impossible ou dangereux.",
    "Première étape : savoir précisément quel appareil vous avez entre les mains."
  ],
  warn: WARN,
  tech: [
    { h: "Trois identifiants complémentaires", ul: [
      "<b>Nom commercial</b> : par exemple « Pixel 8a ». C'est celui qui figure dans la liste officielle.",
      "<b>Référence matérielle</b> (numéro de modèle) : par exemple une référence alphanumérique indiquée dans les réglages ou sur la boîte. Elle varie selon les régions.",
      "<b>Nom de code</b> : par exemple <code>akita</code> pour le Pixel 8a. C'est l'identifiant technique utilisé par les images système et affiché en mode Fastboot."
    ]},
    { h: "Pourquoi croiser les sources", p: [
      "Le nom affiché dans les réglages peut avoir été modifié sur un appareil d'occasion trafiqué. Le nom de code affiché par le bootloader, lui, provient d'une couche inférieure du système. Croiser les deux sources est une bonne pratique."
    ]}
  ],
  fig: "device-id",
  steps: [
    "Ouvrez <b>Paramètres › À propos du téléphone</b> et relevez le <b>Modèle</b>.",
    "Ouvrez la rubrique <b>Modèle et matériel</b> (si elle existe) et relevez la référence matérielle.",
    "Comparez avec l'étiquette de la boîte d'origine si vous l'avez.",
    "Plus tard, lors du passage en mode Fastboot (module 6, étape 10), relevez la ligne <b>Product name</b>, qui contient le nom de code.",
    "Vérifiez que le nom commercial et le nom de code correspondent dans le tableau officiel (leçon 3)."
  ],
  result: "Vous connaissez le nom commercial, la référence et le nom de code de votre appareil.",
  ex: [
    "Un Pixel 8a affiche « Pixel 8a » dans les réglages ; son nom de code est <code>akita</code>.",
    "Un appareil d'occasion affiche « Pixel 9 » dans les réglages, mais un autre nom de code en mode Fastboot : il faut renoncer à l'installation et vérifier l'origine de l'appareil."
  ],
  err: [
    ["Se fier au nom indiqué dans l'annonce du vendeur.", "Vérifiez vous-même dans les réglages et en mode Fastboot."],
    ["Confondre Pixel 9 Pro et Pixel 9 Pro XL.", "Ce sont deux appareils distincts avec des noms de code différents (<code>caiman</code> et <code>komodo</code>)."],
    ["Confondre la version d'Android et le modèle.", "Le modèle est une caractéristique matérielle, indépendante de la version installée."]
  ],
  reco: [
    "Photographiez l'écran « À propos du téléphone » pour garder une trace.",
    "Pour un achat d'occasion, demandez une photo de l'écran Fastboot avant l'achat.",
    "Conservez la boîte d'origine, utile pour la référence et la revente."
  ],
  sum: "Un appareil s'identifie par son nom commercial, sa référence matérielle et son nom de code. Croiser les réglages, la boîte et l'écran Fastboot garantit l'identification exacte, indispensable avant toute installation.",
  quiz: [
    { q: "Quel identifiant est affiché par le bootloader en mode Fastboot ?", o: ["Le nom de code (Product name)", "Le numéro de téléphone", "L'adresse e-mail", "La version de l'application Téléphone"], a: 0, e: "La ligne Product name contient le nom de code de l'appareil." },
    { q: "Quel est le nom de code du Pixel 8a ?", o: ["shiba", "akita", "husky", "tokay"], a: 1, e: "Le Pixel 8a a pour nom de code akita." },
    { q: "Pourquoi croiser réglages et écran Fastboot ?", o: ["Pour gagner du temps", "Parce que le nom affiché dans les réglages peut avoir été modifié sur un appareil trafiqué", "Pour activer le Wi-Fi", "Ce n'est pas utile"], a: 1, e: "Le bootloader fournit une information issue d'une couche inférieure." }
  ]
},
/* ---------------------------------------------------------------- 5.2 */
{
  obj: "Situer son Pixel dans les générations successives et comprendre ce que la génération implique pour la sécurité et la durée de support.",
  intro: [
    "Les Pixel sont regroupés en générations, liées à leur processeur. La génération détermine des capacités de sécurité (comme le marquage mémoire matériel) et la durée pendant laquelle l'appareil recevra des mises à jour.",
    "Choisir ou garder un appareil, c'est aussi choisir une date de fin de support."
  ],
  warn: WARN,
  tech: [
    { h: "Les générations prises en charge", ul: [
      "<b>6e génération</b> (processeur Tensor de première génération) : Pixel 6, 6 Pro, 6a.",
      "<b>7e génération</b> (Tensor G2) : Pixel 7, 7 Pro, 7a, ainsi que Pixel Tablet et Pixel Fold.",
      "<b>8e génération</b> (Tensor G3) : Pixel 8, 8 Pro, 8a. Première génération avec le marquage mémoire matériel (MTE) et sept ans de support annoncés par Google.",
      "<b>9e génération</b> (Tensor G4) : Pixel 9, 9 Pro, 9 Pro XL, 9 Pro Fold, 9a.",
      "<b>10e génération</b> (Tensor G5) : Pixel 10, 10 Pro, 10 Pro XL, 10 Pro Fold, 10a."
    ]},
    { h: "Ce que dit la FAQ officielle", p: [
      "La FAQ de GrapheneOS recommande fortement, pour un achat, les appareils de 8e génération et ultérieurs, en raison de leur sécurité et de leur longue durée de support minimale garantie. Elle indique aussi que les appareils restent pris en charge jusqu'à leur fin de vie, même s'ils ne répondent plus aux exigences actuelles, et que des versions de support prolongé peuvent servir de solution transitoire."
    ]}
  ],
  fig: "device-id",
  steps: [
    "À partir du nom commercial relevé à la leçon 1, identifiez la génération dans la liste ci-dessus.",
    "Notez si votre appareil dispose du marquage mémoire matériel (8e génération et ultérieures).",
    "Relevez la date de fin de support minimal dans le tableau de la leçon 3.",
    "Si cette date est déjà passée ou proche, envisagez un appareil plus récent plutôt qu'une installation.",
    "Consignez la génération et la date de fin de support dans votre fiche d'appareil."
  ],
  result: "Vous connaissez la génération de votre Pixel, ses capacités et sa date de fin de support.",
  ex: [
    "Un Pixel 8a (8e génération) bénéficie du MTE et d'un support minimal annoncé jusqu'en mai 2031.",
    "Un Pixel 6 (6e génération) avait un support minimal annoncé par Google jusqu'en octobre 2026 : en novembre 2026, il est préférable de choisir un appareil plus récent pour une nouvelle installation."
  ],
  err: [
    ["Acheter un ancien Pixel parce qu'il est bon marché.", "Calculez le coût par année de support restante."],
    ["Croire que tous les Pixel ont les mêmes protections matérielles.", "Le MTE n'existe qu'à partir de la 8e génération."],
    ["Ignorer la date de fin de support.", "Planifiez le renouvellement avant cette date."]
  ],
  reco: [
    "Pour un achat, suivez la recommandation officielle : 8e génération ou ultérieure.",
    "Revérifiez la FAQ officielle au moment de l'achat : la liste et les recommandations évoluent.",
    "Privilégiez un appareil neuf ou reconditionné par une source fiable."
  ],
  sum: "Les Pixel pris en charge s'étendent de la 6e à la 10e génération. La génération détermine notamment la présence du MTE (8e et ultérieures) et la durée de support. La FAQ officielle recommande les générations 8 et ultérieures pour un achat.",
  quiz: [
    { q: "À partir de quelle génération les Pixel disposent-ils du marquage mémoire matériel (MTE) ?", o: ["6e", "7e", "8e", "10e"], a: 2, e: "Le Tensor G3 de la 8e génération introduit le MTE." },
    { q: "Quelles générations la FAQ officielle recommande-t-elle pour un achat ?", o: ["6e et ultérieures", "8e et ultérieures", "Uniquement la 10e", "Toutes"], a: 1, e: "La FAQ recommande fortement les appareils de 8e génération et ultérieurs." },
    { q: "À quelle génération appartiennent la Pixel Tablet et le Pixel Fold ?", o: ["6e", "7e (Tensor G2)", "9e", "10e"], a: 1, e: "Ils utilisent le Tensor G2, comme les Pixel 7." }
  ]
},
/* ---------------------------------------------------------------- 5.3 */
{
  obj: "Vérifier la compatibilité officielle de son appareil à l'aide de la liste publiée par GrapheneOS, et savoir distinguer un appareil pris en charge d'un appareil qui ne l'est pas.",
  intro: [
    "Règle absolue : un appareil n'est compatible que s'il figure sur la liste officielle publiée sur <code>grapheneos.org/faq</code>. Aucune autre source (forum, vidéo, vendeur) ne peut se substituer à cette page.",
    "Le tableau ci-dessous reproduit la liste officielle à la date de vérification indiquée. Il est fourni à titre pédagogique : vérifiez toujours la page officielle avant d'acheter ou d'installer."
  ],
  warn: WARN,
  tech: [
    "Utilisez le champ de recherche pour retrouver votre modèle ou son nom de code. Le filtre permet d'afficher les appareils recommandés pour un achat, ceux dont la fin du support constructeur est proche ou atteinte, et les anciens appareils qui ne sont plus pris en charge.",
    "Le statut « fin proche » ou « support constructeur terminé » est calculé à partir de la date de support minimal annoncée par Google, relevée dans la FAQ officielle. Il ne préjuge pas des décisions du projet GrapheneOS, qui sont publiées sur son site."
  ],
  extra: "devices",
  fig: "device-id",
  steps: [
    "Ouvrez la page officielle <code>https://grapheneos.org/faq#supported-devices</code> dans votre navigateur.",
    "Recherchez le nom commercial exact de votre appareil dans la liste « official production support ».",
    "Vérifiez que le nom de code correspond à celui relevé en mode Fastboot.",
    "Consultez la section sur la durée de support pour connaître la date de fin de support minimal.",
    "Si votre appareil n'apparaît pas dans la liste officielle, n'allez pas plus loin : il n'est pas compatible."
  ],
  result: "Votre appareil figure (ou non) sur la liste officielle, vérifiée à la source.",
  ex: [
    "Un Pixel 9a (<code>tegu</code>) figure dans la liste officielle et fait partie des appareils recommandés.",
    "Un Pixel 5 (<code>redfin</code>) figure dans la liste des appareils en fin de vie qui ne sont plus pris en charge.",
    "Un smartphone d'une autre marque n'apparaît pas : aucune version officielle n'existe pour lui."
  ],
  err: [
    ["Se fier à une vidéo affirmant qu'un appareil « fonctionne avec GrapheneOS ».", "Seule la liste officielle fait foi."],
    ["Installer une version « non officielle » pour un appareil non listé.", "Ce n'est pas GrapheneOS : les garanties de sécurité ne s'appliquent pas."],
    ["Se fier uniquement à ce tableau pédagogique.", "Il reflète une date précise ; la page officielle peut avoir évolué."]
  ],
  reco: [
    "Revérifiez la liste officielle le jour même de l'installation.",
    "Pour un achat, croisez la liste des appareils pris en charge et celle des appareils recommandés.",
    "Signalez à l'auteur de la formation toute différence constatée entre ce tableau et la page officielle."
  ],
  sum: "La compatibilité se vérifie uniquement sur la liste officielle de grapheneos.org. Le tableau de cette leçon la reproduit à une date donnée, avec les dates de support minimal. Un appareil absent de la liste officielle n'est pas compatible.",
  quiz: [
    { q: "Quelle est la seule source qui fait foi pour la compatibilité ?", o: ["Un forum", "La page officielle grapheneos.org/faq", "Un vendeur en ligne", "Une vidéo de démonstration"], a: 1, e: "La liste officielle est la seule référence." },
    { q: "Le Pixel 5 est-il pris en charge par GrapheneOS ?", o: ["Oui, recommandé", "Non, il fait partie des appareils en fin de vie qui ne sont plus pris en charge", "Oui, en version bêta", "Uniquement en mode avion"], a: 1, e: "La FAQ le classe parmi les appareils qui ne sont plus pris en charge." },
    { q: "Votre appareil n'apparaît pas dans la liste officielle. Que faire ?", o: ["Chercher une version non officielle", "Renoncer à l'installation : il n'est pas compatible", "Installer l'image d'un modèle proche", "Réessayer le lendemain"], a: 1, e: "Installer l'image d'un autre modèle ou une version non officielle est à proscrire." }
  ]
},
/* ---------------------------------------------------------------- 5.4 */
{
  obj: "Vérifier que le bootloader de son Pixel pourra être déverrouillé, en particulier pour les appareils vendus par des opérateurs.",
  intro: [
    "Pour installer GrapheneOS, le bootloader doit être déverrouillé temporairement. Or certains appareils sont vendus avec un blocage qui empêche ce déverrouillage. Il faut le vérifier avant toute démarche, et idéalement avant l'achat.",
    "Cette vérification ne modifie rien sur l'appareil."
  ],
  warn: WARN,
  tech: [
    { h: "Les variantes opérateur", p: [
      "Le guide officiel d'installation recommande d'éviter les variantes opérateur des appareils. Il explique que ces variantes utilisent le même système et le même micrologiciel, mais avec un identifiant d'opérateur inscrit en usine, qui active une configuration propre à l'opérateur, y compris la désactivation du déverrouillage. La FAQ précise qu'il s'agit principalement d'un problème lié aux opérateurs américains, peu courant ailleurs dans le monde."
    ]},
    { h: "L'option « Déverrouillage OEM »", p: [
      "Le déverrouillage passe par l'option <b>Déverrouillage OEM</b> des options pour les développeurs. Sur les modèles susceptibles d'être vendus verrouillés par un opérateur, son activation nécessite une connexion Internet, afin que le système d'origine vérifie si l'appareil a été vendu verrouillé. Si l'option reste grisée malgré une connexion, l'appareil est probablement bloqué."
    ]},
    { h: "Le cas particulier du Pixel 6a", p: [
      "Le guide officiel indique que, sur le Pixel 6a, le déverrouillage OEM ne fonctionne pas avec la version du système installée en usine : il faut d'abord mettre l'appareil à jour (version de juin 2022 ou ultérieure) par mise à jour en ligne, puis effectuer une réinitialisation."
    ]}
  ],
  fig: "dev-options",
  steps: [
    "Connectez le téléphone à Internet (Wi-Fi ou réseau mobile).",
    "Activez les options pour les développeurs : <b>Paramètres › À propos du téléphone</b>, touchez plusieurs fois <b>Numéro de build</b> jusqu'au message de confirmation.",
    "Ouvrez <b>Paramètres › Système › Options pour les développeurs</b>.",
    "Observez l'option <b>Déverrouillage OEM</b> : si elle est activable, le bootloader pourra être déverrouillé. Vous pouvez la laisser désactivée pour l'instant.",
    "Si l'option est grisée, vérifiez la connexion Internet, installez les mises à jour, redémarrez, puis réessayez.",
    "Si elle reste grisée, l'appareil est probablement une variante bloquée : ne poursuivez pas."
  ],
  result: "Vous savez si l'option Déverrouillage OEM est disponible sur votre appareil.",
  ex: [
    "Un Pixel acheté directement auprès de Google ou d'un revendeur non lié à un opérateur présente généralement une option activable.",
    "Un Pixel acheté d'occasion, provenant d'un opérateur américain, affiche une option grisée : l'installation est impossible."
  ],
  err: [
    ["Vérifier l'option sans connexion Internet.", "Connectez l'appareil : la vérification de l'opérateur a besoin d'Internet."],
    ["Acheter un Pixel d'occasion sans vérifier l'option.", "Demandez au vendeur une capture de l'option activable, ou vérifiez sur place."],
    ["Rechercher des « outils de déblocage » non officiels.", "Ils sont risqués et souvent frauduleux : choisissez un autre appareil."]
  ],
  reco: [
    "Achetez de préférence un appareil non lié à un opérateur.",
    "Pour un Pixel 6a, suivez précisément l'indication officielle sur la mise à jour préalable.",
    "Ne laissez pas le déverrouillage OEM activé si vous ne procédez pas tout de suite à l'installation."
  ],
  sum: "Le déverrouillage du bootloader dépend de l'option Déverrouillage OEM, qui peut être bloquée sur les variantes opérateur, problème surtout rencontré avec les opérateurs américains. Son activation demande une connexion Internet. Le Pixel 6a nécessite une mise à jour préalable.",
  quiz: [
    { q: "Pourquoi l'activation du Déverrouillage OEM nécessite-t-elle parfois Internet ?", o: ["Pour télécharger GrapheneOS", "Pour que le système vérifie si l'appareil a été vendu verrouillé par un opérateur", "Pour envoyer vos données", "Pour régler l'heure"], a: 1, e: "C'est ce qu'indique le guide officiel pour les modèles concernés." },
    { q: "L'option Déverrouillage OEM reste grisée malgré Internet et les mises à jour. Que conclure ?", o: ["Il faut un outil de déblocage", "L'appareil est probablement une variante bloquée : ne pas poursuivre", "Il faut retirer la carte SIM", "Il faut changer de câble"], a: 1, e: "Le déverrouillage n'est alors pas possible de façon officielle." },
    { q: "Que faut-il faire sur un Pixel 6a avant le déverrouillage OEM ?", o: ["Rien", "Le mettre à jour (juin 2022 ou ultérieur) puis le réinitialiser", "Remplacer la batterie", "Installer Google Play"], a: 1, e: "C'est l'exigence décrite par le guide officiel." }
  ]
},
/* ---------------------------------------------------------------- 5.5 */
{
  obj: "Réaliser une sauvegarde complète et vérifiée de ses données avant une installation qui effacera intégralement l'appareil.",
  intro: [
    "L'installation de GrapheneOS efface toutes les données du téléphone, à plusieurs reprises (déverrouillage, flashage, reverrouillage). Il n'existe aucun moyen de les récupérer après coup.",
    "La sauvegarde n'est donc pas une précaution facultative : c'est une étape obligatoire."
  ],
  warn: WARN,
  tech: [
    { h: "Ce qu'il faut sauvegarder", ul: [
      "Photos, vidéos, documents, enregistrements.",
      "Contacts (export au format vCard) et agenda.",
      "Conversations des messageries, avec leurs procédures propres de sauvegarde et de transfert.",
      "Applications d'authentification à deux facteurs : c'est le point le plus critique.",
      "Clés d'accès (passkeys) enregistrées dans le gestionnaire de mots de passe.",
      "Notes, mots de passe, fichiers d'applications métiers."
    ]},
    { h: "Ce qui ne se restaure pas directement", p: [
      "Une sauvegarde Google d'appareil se restaure sur un appareil disposant des services Google : sur GrapheneOS, cela suppose Google Play en bac à sable, et la restauration n'est pas garantie pour toutes les données. Privilégiez des sauvegardes indépendantes du système : fichiers copiés sur un ordinateur, exports des applications, sauvegardes chiffrées propres aux messageries."
    ]},
    { h: "La carte eSIM", p: [
      "Si vous utilisez une eSIM, renseignez-vous auprès de votre opérateur sur la procédure pour la réinstaller en cas de besoin (nouveau code QR ou réactivation) avant de commencer."
    ]}
  ],
  fig: "encryption",
  steps: [
    "Copiez photos, vidéos et documents sur un ordinateur ou un disque externe, puis vérifiez que les fichiers s'ouvrent.",
    "Exportez les contacts au format <code>.vcf</code> depuis l'application Contacts.",
    "Pour chaque messagerie, suivez sa procédure officielle de sauvegarde ou de transfert (par exemple, sauvegarde chiffrée de Signal protégée par une phrase secrète).",
    "Pour chaque compte protégé par une application d'authentification, vérifiez que vous disposez des codes de secours ou d'un second facteur indépendant.",
    "Vérifiez que votre gestionnaire de mots de passe est synchronisé ou exporté de façon chiffrée.",
    "Contactez votre opérateur au sujet de l'eSIM si nécessaire.",
    "Dressez une liste des applications installées, pour les réinstaller ensuite."
  ],
  result: "Toutes vos données importantes existent hors du téléphone, et vous pouvez accéder à vos comptes sans lui.",
  caution: "Ne commencez jamais l'installation tant que vous n'avez pas vérifié que vous pouvez vous connecter à vos comptes essentiels sans ce téléphone.",
  ex: [
    "Un utilisateur efface son téléphone sans avoir exporté son application d'authentification : il perd l'accès à plusieurs comptes et doit passer par de longues procédures de récupération.",
    "Une utilisatrice copie ses photos, exporte ses contacts, active la sauvegarde chiffrée de sa messagerie et imprime ses codes de secours : la migration se passe sans perte."
  ],
  err: [
    ["Compter uniquement sur la sauvegarde Google pour tout récupérer sous GrapheneOS.", "Faites des sauvegardes indépendantes du système."],
    ["Oublier l'application d'authentification.", "Vérifiez codes de secours et facteurs alternatifs compte par compte."],
    ["Ne pas vérifier la sauvegarde.", "Ouvrez quelques fichiers sur l'ordinateur avant de continuer."]
  ],
  reco: [
    "Conservez deux copies de la sauvegarde sur deux supports différents.",
    "Chiffrez le support si la sauvegarde contient des documents sensibles.",
    "Gardez l'ancien appareil intact jusqu'à ce que le nouveau soit entièrement configuré, si vous changez de téléphone."
  ],
  sum: "L'installation efface tout, plusieurs fois. Sauvegardez fichiers, contacts, messageries, mots de passe et surtout les facteurs d'authentification, de façon indépendante du système, puis vérifiez la sauvegarde. Anticipez la réinstallation de l'eSIM.",
  quiz: [
    { q: "Combien de fois l'installation de GrapheneOS efface-t-elle les données ?", o: ["Jamais", "Une seule fois", "Plusieurs fois (déverrouillage, flashage, reverrouillage)", "Seulement si on le demande"], a: 2, e: "Le guide officiel signale un effacement à chacune de ces étapes." },
    { q: "Quel élément est le plus critique à sauvegarder ?", o: ["Le fond d'écran", "Les facteurs d'authentification à deux facteurs", "Les sonneries", "Le cache des applications"], a: 1, e: "Sans eux, vous risquez de perdre l'accès à vos comptes." },
    { q: "Pourquoi privilégier des sauvegardes indépendantes du système ?", o: ["Parce que la restauration d'une sauvegarde Google n'est pas garantie sous GrapheneOS", "Parce qu'elles sont plus jolies", "Parce qu'elles sont plus lentes", "Ce n'est pas nécessaire"], a: 0, e: "Les fichiers et exports d'applications se restaurent quel que soit le système." }
  ]
},
/* ---------------------------------------------------------------- 5.6 */
{
  obj: "Vérifier l'état matériel du téléphone pour éviter qu'une panne ne compromette l'installation.",
  intro: [
    "L'installation sollicite le port USB, les boutons physiques et la batterie. Un appareil défaillant peut rendre l'opération pénible, voire impossible à terminer correctement.",
    "Quelques vérifications simples évitent la plupart des mauvaises surprises, en particulier sur un appareil d'occasion."
  ],
  warn: WARN,
  tech: [
    { h: "Les points à contrôler", ul: [
      "<b>Port USB-C</b> : propre, sans jeu, connexion stable. Un port encrassé provoque des déconnexions pendant le flashage.",
      "<b>Boutons</b> : le bouton Volume bas est indispensable pour accéder au mode Fastboot ; les boutons de volume et Marche/Arrêt servent à confirmer le déverrouillage et le verrouillage.",
      "<b>Batterie</b> : elle doit tenir la charge et ne présenter aucun gonflement.",
      "<b>Écran tactile</b> : utilisé pour la configuration initiale.",
      "<b>Absence de dommages</b> : traces d'oxydation, chocs, réparations non officielles."
    ]},
    { h: "Pour un appareil d'occasion", p: [
      "Vérifiez que l'appareil n'est pas déclaré volé (IMEI) et qu'il n'est plus associé au compte de l'ancien propriétaire. Une réinitialisation complète par l'ancien propriétaire, en votre présence, est préférable."
    ]}
  ],
  fig: "device-id",
  steps: [
    "Inspectez le port USB-C à la lumière ; si besoin, retirez délicatement les poussières avec un outil non métallique.",
    "Branchez le câble que vous utiliserez : la charge doit démarrer immédiatement et rester stable quand vous bougez légèrement le câble.",
    "Testez chaque bouton : volume haut, volume bas, Marche/Arrêt.",
    "Vérifiez l'état de la batterie dans les réglages, si l'information est disponible (rubrique Batterie).",
    "Vérifiez l'absence de gonflement (écran ou dos qui se soulève).",
    "Pour un appareil d'occasion, notez l'IMEI (<code>*#06#</code>) et vérifiez qu'il n'est pas signalé volé auprès des services disponibles dans votre pays."
  ],
  result: "Le port USB, les boutons, la batterie et l'écran fonctionnent correctement.",
  ex: [
    "Un port USB encrassé provoque une déconnexion au milieu du flashage : après nettoyage, l'opération se déroule normalement.",
    "Un bouton Volume bas défectueux empêche l'accès au mode Fastboot : l'appareil doit être réparé avant l'installation."
  ],
  err: [
    ["Ignorer une connexion USB instable.", "Nettoyez le port ou changez de câble avant de commencer."],
    ["Poursuivre avec une batterie gonflée.", "Arrêtez : une batterie gonflée est dangereuse, faites-la remplacer."],
    ["Acheter un appareil d'occasion sans vérifier l'IMEI.", "Vérifiez systématiquement l'origine de l'appareil."]
  ],
  reco: [
    "Utilisez de préférence le câble USB-C fourni avec l'appareil, comme le recommande le guide officiel.",
    "Faites réparer l'appareil auprès d'un service agréé avant l'installation si nécessaire.",
    "Notez l'état de l'appareil dans votre fiche (date, observations)."
  ],
  sum: "Avant l'installation, contrôlez le port USB-C, les boutons (en particulier Volume bas), la batterie, l'écran et l'absence de dommages. Pour un appareil d'occasion, vérifiez aussi son origine et son IMEI.",
  quiz: [
    { q: "Quel bouton est indispensable pour accéder au mode Fastboot ?", o: ["Volume haut", "Volume bas", "Le bouton d'appareil photo", "Aucun"], a: 1, e: "Le mode Fastboot s'atteint en maintenant Volume bas pendant le démarrage." },
    { q: "Que faire en cas de batterie gonflée ?", o: ["Poursuivre rapidement", "Arrêter et la faire remplacer", "La charger à fond", "Mettre l'appareil au réfrigérateur"], a: 1, e: "Une batterie gonflée présente un risque pour la sécurité." },
    { q: "Pourquoi tester la stabilité de la connexion USB ?", o: ["Pour éviter des déconnexions pendant le flashage", "Pour accélérer Internet", "Pour améliorer le son", "Ce n'est pas utile"], a: 0, e: "Les câbles et ports défaillants sont une cause fréquente d'échec." }
  ]
},
/* ---------------------------------------------------------------- 5.7 */
{
  obj: "Rassembler toutes les précautions à prendre avant l'installation dans une liste de contrôle finale.",
  intro: [
    "Vous avez identifié votre appareil, vérifié sa compatibilité, son bootloader, son état matériel, et sauvegardé vos données. Il reste à réunir les bonnes conditions pour l'installation elle-même.",
    "Cette dernière leçon du module 5 est une liste de contrôle à valider point par point."
  ],
  warn: WARN,
  tech: [
    { h: "Les précautions issues du guide officiel", ul: [
      "Utiliser exclusivement l'installateur officiel à l'adresse <code>https://grapheneos.org/install/web</code>.",
      "Utiliser un câble de qualité, de préférence celui fourni avec l'appareil, et éviter les concentrateurs USB : brancher directement sur un port arrière d'un ordinateur de bureau ou sur un port d'ordinateur portable.",
      "Ne pas installer depuis une machine virtuelle.",
      "Utiliser un système d'exploitation et un navigateur pris en charge et à jour, sans mode de navigation privée.",
      "Ne pas interagir avec l'appareil pendant le flashage."
    ]},
    { h: "Les précautions de bon sens", ul: [
      "Prévoir un créneau sans interruption (au moins une à deux heures la première fois).",
      "Travailler sur un ordinateur de confiance, à jour, branché sur secteur.",
      "Avoir lu l'intégralité du module 6 et du guide officiel avant de commencer.",
      "Disposer d'un second appareil pour consulter la documentation et vos comptes."
    ]}
  ],
  fig: "install-flow",
  steps: [
    "Appareil présent dans la liste officielle, vérifié le jour même.",
    "Option Déverrouillage OEM activable.",
    "Sauvegarde complète réalisée et vérifiée ; accès à vos comptes sans ce téléphone confirmé.",
    "Port USB, boutons et batterie contrôlés ; appareil chargé.",
    "Câble de qualité et port USB direct identifiés sur l'ordinateur.",
    "Système d'exploitation et navigateur pris en charge et à jour.",
    "Créneau d'au moins une à deux heures sans interruption.",
    "Module 6 et guide officiel lus en entier."
  ],
  result: "Tous les points de la liste sont validés : vous pouvez passer au module 6.",
  caution: "Si un seul point n'est pas validé, ne commencez pas. Une installation interrompue n'est généralement pas dramatique, mais elle est source de stress et d'erreurs.",
  ex: [
    "Une personne commence l'installation sur un ordinateur de bureau via le port avant du boîtier : déconnexions répétées. En branchant sur un port arrière, tout fonctionne.",
    "Un utilisateur lance l'installation dans une machine virtuelle : le passage USB est instable, conformément à l'avertissement du guide officiel."
  ],
  err: [
    ["Commencer sans avoir lu toute la procédure.", "Lisez le module 6 et le guide officiel jusqu'au bout avant de toucher à l'appareil."],
    ["Utiliser un concentrateur USB ou une rallonge.", "Branchez directement sur l'ordinateur."],
    ["Utiliser un site autre que grapheneos.org.", "Vérifiez l'adresse : seul l'installateur officiel est fiable."]
  ],
  reco: [
    "Imprimez ou affichez cette liste sur un second écran pendant l'installation.",
    "Gardez le guide officiel ouvert sur un second appareil.",
    "En cas de doute à n'importe quelle étape, arrêtez-vous et consultez la documentation officielle."
  ],
  sum: "Avant l'installation : appareil listé officiellement, déverrouillage OEM possible, sauvegarde vérifiée, matériel en bon état, câble direct sans concentrateur, ordinateur et navigateur pris en charge, pas de machine virtuelle, temps suffisant et procédure lue en entier.",
  quiz: [
    { q: "Que recommande le guide officiel au sujet des concentrateurs USB ?", o: ["Les utiliser pour plus de stabilité", "Les éviter et brancher directement sur l'ordinateur", "Utiliser le port avant du boîtier", "Utiliser deux câbles"], a: 1, e: "Les câbles et concentrateurs défaillants sont la source la plus fréquente de problèmes." },
    { q: "Peut-on installer GrapheneOS depuis une machine virtuelle ?", o: ["Oui, c'est recommandé", "Ce n'est pas recommandé : le passage USB est souvent peu fiable", "Oui, uniquement sous Windows", "Oui, en mode privé"], a: 1, e: "Le guide officiel le déconseille explicitement." },
    { q: "Un point de la liste de contrôle n'est pas validé. Que faire ?", o: ["Commencer quand même", "Ne pas commencer tant qu'il n'est pas résolu", "Sauter l'étape de sauvegarde", "Utiliser un autre site"], a: 1, e: "Chaque point conditionne la réussite et la sécurité de l'installation." }
  ]
}
];
})();
