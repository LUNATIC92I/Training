/* Module 8 : Protection des communications et de la vie privée */
window.ASG = window.ASG || {}; ASG.content = ASG.content || {};
ASG.content.m8 = [
/* ---------------------------------------------------------------- 8.1 */
{
  obj: "Identifier les différents canaux de communication d'un smartphone et leur niveau de protection respectif.",
  intro: [
    "Appels téléphoniques, SMS, messageries, e-mails, visioconférences : chaque canal offre un niveau de protection différent, souvent méconnu. Un message très sensible envoyé par SMS est beaucoup plus exposé qu'il n'y paraît.",
    "Cette leçon dresse la carte de vos communications."
  ],
  tech: [
    { h: "Les canaux et leur protection", ul: [
      "<b>Appels et SMS classiques</b> : transitent par le réseau de l'opérateur ; ils ne sont pas chiffrés de bout en bout et sont accessibles à l'opérateur, voire interceptables dans certaines conditions.",
      "<b>RCS</b> (messages « avancés ») : selon l'application et les interlocuteurs, certaines conversations sont chiffrées de bout en bout, d'autres non.",
      "<b>Messageries chiffrées de bout en bout</b> (Signal, WhatsApp…) : le contenu n'est lisible que par les participants.",
      "<b>E-mail</b> : généralement chiffré entre serveurs, mais lisible par les fournisseurs de messagerie, sauf usage de solutions de chiffrement de bout en bout.",
      "<b>Visioconférence</b> : chiffrement variable selon le service et les options activées."
    ]}
  ],
  fig: "e2ee",
  steps: [
    "Listez les canaux que vous utilisez chaque semaine.",
    "Pour chacun, indiquez s'il est chiffré de bout en bout, chiffré seulement en transit, ou non chiffré.",
    "Identifiez les échanges sensibles (santé, finances, travail, vie privée).",
    "Vérifiez qu'ils passent par un canal chiffré de bout en bout.",
    "Déplacez les échanges sensibles vers un canal adapté."
  ],
  result: "Vous savez quel canal utiliser selon la sensibilité de chaque échange.",
  ex: [
    "Un code d'accès à un local professionnel envoyé par SMS peut être lu par l'opérateur et intercepté en cas de SIM swapping.",
    "Des documents médicaux échangés via une messagerie chiffrée de bout en bout ne sont lisibles que par les participants."
  ],
  err: [
    ["Croire que le SMS est un canal privé.", "Réservez-le aux échanges non sensibles."],
    ["Supposer qu'une application est chiffrée sans le vérifier.", "Consultez sa documentation officielle."],
    ["Oublier que l'e-mail classique est lisible par les fournisseurs.", "Utilisez un canal chiffré de bout en bout pour le sensible."]
  ],
  reco: [
    "Associez un canal à chaque niveau de sensibilité.",
    "Convenez avec vos interlocuteurs réguliers d'un canal sécurisé commun."
  ],
  sum: "Les appels et SMS classiques ne sont pas chiffrés de bout en bout ; le RCS l'est selon les cas ; les messageries comme Signal le sont par défaut ; l'e-mail est généralement lisible par les fournisseurs. Choisissez le canal selon la sensibilité de l'échange.",
  quiz: [
    { q: "Les SMS classiques sont-ils chiffrés de bout en bout ?", o: ["Oui", "Non", "Seulement en 5G", "Seulement sur Pixel"], a: 1, e: "Ils sont accessibles à l'opérateur." },
    { q: "Pour un échange médical sensible, quel canal privilégier ?", o: ["SMS", "Messagerie chiffrée de bout en bout", "E-mail non chiffré", "Commentaire public"], a: 1, e: "Seuls les participants peuvent alors lire le contenu." }
  ]
},
/* ---------------------------------------------------------------- 8.2 */
{
  obj: "Comprendre le principe du chiffrement de bout en bout, ses garanties et ses limites.",
  intro: [
    "Le chiffrement de bout en bout (E2EE) est souvent cité comme la référence de la confidentialité. Encore faut-il comprendre ce qu'il protège exactement, et ce qu'il ne protège pas.",
    "Cette compréhension évite à la fois la méfiance excessive et la confiance aveugle."
  ],
  tech: [
    { h: "Le principe", p: [
      "Chaque participant dispose d'une paire de clés générée sur son appareil. Le message est chiffré sur l'appareil de l'expéditeur avec des clés que seul le destinataire peut utiliser pour le déchiffrer. Le serveur ne fait que relayer des données illisibles. Les protocoles modernes, comme le protocole Signal, renouvellent les clés en permanence, ce qui limite l'impact d'une éventuelle compromission (confidentialité persistante)."
    ]},
    { h: "La vérification des clés", p: [
      "Pour s'assurer de parler à la bonne personne, les messageries proposent un <b>numéro de sécurité</b> ou un code QR à comparer en personne ou par un autre canal. Un changement de numéro de sécurité signale un changement d'appareil ou, plus rarement, une tentative d'interception."
    ]},
    { h: "Les limites", ul: [
      "Les <b>appareils</b> eux-mêmes : un téléphone compromis lit les messages avant chiffrement ou après déchiffrement.",
      "Les <b>métadonnées</b> : qui communique avec qui, quand (leçon 8).",
      "Les <b>sauvegardes</b> : une sauvegarde non chiffrée peut exposer les messages.",
      "Les <b>destinataires</b> : ils peuvent faire des captures d'écran ou transférer les messages."
    ]}
  ],
  fig: "e2ee",
  steps: [
    "Ouvrez une conversation avec un proche dans une messagerie chiffrée de bout en bout.",
    "Affichez le <b>numéro de sécurité</b> ou le code de vérification (dans les informations de la conversation).",
    "Comparez-le avec celui affiché sur le téléphone de votre interlocuteur, en personne si possible.",
    "Marquez le contact comme vérifié si l'application le propose.",
    "Activez les alertes de changement de numéro de sécurité si elles existent."
  ],
  result: "Vos conversations les plus importantes sont vérifiées et vous savez réagir à un changement de clé.",
  ex: [
    "Un message « le numéro de sécurité a changé » apparaît : votre interlocuteur a changé de téléphone. Vérifiez à nouveau avant d'échanger des informations sensibles.",
    "Un téléphone infecté par un logiciel espion lit vos messages chiffrés directement à l'écran : le chiffrement de bout en bout ne protège pas un appareil compromis."
  ],
  err: [
    ["Ignorer les alertes de changement de clé.", "Revérifiez le numéro de sécurité par un autre canal."],
    ["Croire que l'E2EE protège contre un téléphone compromis.", "Sécurisez aussi les appareils (modules 3 et 7)."],
    ["Sauvegarder ses conversations sans chiffrement.", "Activez les sauvegardes chiffrées des messageries."]
  ],
  reco: [
    "Vérifiez les numéros de sécurité de vos contacts les plus importants.",
    "Activez les messages éphémères pour les conversations sensibles."
  ],
  sum: "Le chiffrement de bout en bout chiffre les messages sur l'appareil de l'expéditeur et ne les déchiffre que sur celui du destinataire. La vérification des numéros de sécurité garantit l'identité de l'interlocuteur. Il ne protège ni un appareil compromis, ni les métadonnées, ni les sauvegardes non chiffrées.",
  quiz: [
    { q: "Avec le chiffrement de bout en bout, que voit le serveur de la messagerie ?", o: ["Le contenu en clair", "Des données illisibles", "Les photos en clair", "Le mot de passe du téléphone"], a: 1, e: "Seuls les appareils des participants détiennent les clés." },
    { q: "À quoi sert le numéro de sécurité ?", o: ["À vérifier l'identité de l'interlocuteur et l'absence d'interception", "À payer l'abonnement", "À accélérer l'envoi", "À changer de numéro de téléphone"], a: 0, e: "Sa comparaison confirme que vous échangez avec la bonne personne." },
    { q: "Le chiffrement de bout en bout protège-t-il contre un logiciel espion sur votre téléphone ?", o: ["Oui", "Non", "Seulement sur Wi-Fi", "Seulement la nuit"], a: 1, e: "Le logiciel espion lit les messages en clair sur l'appareil." }
  ]
},
/* ---------------------------------------------------------------- 8.3 */
{
  obj: "Choisir une messagerie sécurisée selon des critères objectifs, et la configurer correctement.",
  intro: [
    "Toutes les messageries ne se valent pas. Certaines chiffrent tout par défaut, d'autres seulement certaines conversations ; certaines collectent beaucoup de métadonnées, d'autres très peu.",
    "Cette leçon vous donne une grille de lecture, plutôt qu'un classement figé."
  ],
  tech: [
    { h: "Les critères", ul: [
      "<b>Chiffrement de bout en bout par défaut</b> pour toutes les conversations, y compris de groupe.",
      "<b>Protocole reconnu et audité.</b>",
      "<b>Code source ouvert</b>, au moins pour l'application.",
      "<b>Collecte de métadonnées minimale.</b>",
      "<b>Modèle économique</b> : qui paie le service, et comment ?",
      "<b>Fonctions de confidentialité</b> : messages éphémères, verrouillage, sauvegardes chiffrées."
    ]},
    { h: "Quelques exemples", p: [
      "<b>Signal</b> chiffre toutes les conversations par défaut avec le protocole Signal, est open source, est géré par une fondation à but non lucratif et vise à collecter un minimum de métadonnées. <b>WhatsApp</b> chiffre aussi les conversations de bout en bout avec le protocole Signal, mais appartient à Meta, qui collecte davantage de métadonnées. <b>Telegram</b> ne chiffre pas de bout en bout les conversations par défaut : seules les « conversations secrètes », entre deux personnes, le sont."
    ]}
  ],
  table: {
    cap: "Comparaison simplifiée, à vérifier dans la documentation officielle de chaque service.",
    head: ["Critère", "Signal", "WhatsApp", "Telegram (par défaut)"],
    rows: [
      ["E2EE par défaut", "Oui", "Oui", "Non (conversations secrètes uniquement)"],
      ["Groupes chiffrés de bout en bout", "Oui", "Oui", "Non"],
      ["Application open source", "Oui", "Non", "Partiellement"],
      ["Métadonnées", "Minimisées", "Collectées par Meta", "Stockées sur les serveurs"]
    ]
  },
  fig: "e2ee",
  steps: [
    "Choisissez une messagerie chiffrée de bout en bout par défaut pour vos échanges sensibles.",
    "Installez-la depuis une source officielle.",
    "Activez le verrouillage de l'application (code ou biométrie) si proposé.",
    "Activez les messages éphémères par défaut pour les conversations sensibles.",
    "Configurez une sauvegarde chiffrée ou désactivez la sauvegarde selon vos besoins.",
    "Masquez le contenu des notifications (module 3, leçon 14)."
  ],
  result: "Vous utilisez une messagerie adaptée, configurée avec ses options de confidentialité.",
  ex: [
    "Une équipe de journalistes adopte Signal avec messages éphémères pour ses échanges de travail.",
    "Une famille continue d'utiliser WhatsApp pour le quotidien, mais passe par Signal pour les sujets sensibles."
  ],
  err: [
    ["Croire que toutes les conversations Telegram sont chiffrées de bout en bout.", "Seules les conversations secrètes le sont."],
    ["Négliger les métadonnées dans le choix.", "Intégrez ce critère à votre évaluation."],
    ["Laisser les sauvegardes non chiffrées dans le cloud.", "Activez le chiffrement des sauvegardes ou désactivez-les."]
  ],
  reco: [
    "Choisissez selon des critères, pas selon la popularité.",
    "Sur GrapheneOS, vérifiez le fonctionnement des notifications de votre messagerie sans Google Play."
  ],
  sum: "Une bonne messagerie chiffre tout de bout en bout par défaut, repose sur un protocole audité, est open source et limite les métadonnées. Signal répond à ces critères ; WhatsApp chiffre le contenu mais collecte plus de métadonnées ; Telegram ne chiffre pas de bout en bout par défaut.",
  quiz: [
    { q: "Les conversations Telegram sont-elles chiffrées de bout en bout par défaut ?", o: ["Oui, toutes", "Non, seules les conversations secrètes le sont", "Oui, les groupes uniquement", "Oui, sur Android"], a: 1, e: "Les conversations ordinaires et les groupes ne sont pas chiffrés de bout en bout." },
    { q: "Quel protocole utilisent Signal et WhatsApp pour le chiffrement de bout en bout ?", o: ["Le protocole Signal", "HTTP", "FTP", "SMS"], a: 0, e: "WhatsApp utilise le protocole Signal pour chiffrer le contenu." }
  ]
},
/* ---------------------------------------------------------------- 8.4 */
{
  obj: "Protéger l'ensemble de ses comptes en ligne grâce à un gestionnaire de mots de passe, aux clés d'accès et à la surveillance des fuites.",
  intro: [
    "Votre smartphone est la clé de nombreux comptes. Un seul mot de passe réutilisé et divulgué dans une fuite peut ouvrir la porte à plusieurs services.",
    "Cette leçon élargit le module 3 à l'ensemble de vos comptes."
  ],
  tech: [
    { h: "Les trois piliers", ul: [
      "<b>Un mot de passe unique par service</b>, généré et mémorisé par un gestionnaire de mots de passe.",
      "<b>L'authentification multifacteur</b>, idéalement par clé d'accès (passkey) ou clé de sécurité.",
      "<b>La surveillance des fuites</b> : des services comme Have I Been Pwned indiquent si une adresse apparaît dans une fuite connue."
    ]},
    { h: "Les clés d'accès", p: [
      "Une clé d'accès remplace le mot de passe par une paire de clés cryptographiques : la clé privée reste sur votre appareil ou dans votre gestionnaire, protégée par votre verrouillage. Elle est liée au domaine du service, ce qui la rend résistante au phishing."
    ]}
  ],
  fig: "account-mfa",
  steps: [
    "Choisissez un gestionnaire de mots de passe réputé et protégez-le par une phrase de passe longue et une authentification multifacteur.",
    "Commencez par vos comptes racines : messagerie, compte Google, banque, gestionnaire lui-même.",
    "Remplacez chaque mot de passe réutilisé par un mot de passe unique généré.",
    "Créez des clés d'accès pour les services qui les proposent.",
    "Vérifiez vos adresses e-mail sur <code>haveibeenpwned.com</code> et changez les mots de passe des services concernés.",
    "Supprimez les comptes que vous n'utilisez plus."
  ],
  result: "Chaque compte important a un mot de passe unique, une authentification multifacteur et, si possible, une clé d'accès.",
  ex: [
    "Une fuite chez un site de commerce expose votre ancien mot de passe : grâce à des mots de passe uniques, aucun autre compte n'est affecté.",
    "Un faux site de banque ne déclenche pas le remplissage automatique du gestionnaire : l'utilisateur comprend qu'il s'agit d'un piège."
  ],
  err: [
    ["Utiliser une variante du même mot de passe partout.", "Générez des mots de passe réellement différents."],
    ["Protéger le gestionnaire par un mot de passe faible.", "Utilisez une phrase de passe longue et la double authentification."],
    ["Conserver des comptes inutilisés.", "Supprimez-les : ce sont autant de cibles."]
  ],
  reco: [
    "Migrez progressivement : quelques comptes par semaine.",
    "Prévoyez l'accès d'urgence à votre gestionnaire (codes de secours, contact de confiance si le service le propose)."
  ],
  sum: "Un gestionnaire de mots de passe, des mots de passe uniques, l'authentification multifacteur, les clés d'accès et la surveillance des fuites protègent l'ensemble de vos comptes. Commencez par les comptes racines et supprimez les comptes inutilisés.",
  quiz: [
    { q: "Pourquoi un mot de passe unique par service est-il essentiel ?", o: ["Pour qu'une fuite chez un service n'affecte pas les autres", "Pour aller plus vite", "Parce que c'est plus court", "Ce n'est pas essentiel"], a: 0, e: "La réutilisation transforme une fuite isolée en compromission en chaîne." },
    { q: "Que permet Have I Been Pwned ?", o: ["Vérifier si une adresse apparaît dans une fuite connue", "Chiffrer ses SMS", "Installer GrapheneOS", "Localiser son téléphone"], a: 0, e: "Le service recense les fuites de données publiques." }
  ]
},
/* ---------------------------------------------------------------- 8.5 */
{
  obj: "Sécuriser ses connexions Wi-Fi, à domicile comme à l'extérieur.",
  intro: [
    "Le module 2 a présenté les risques des Wi-Fi publics. Cette leçon couvre aussi votre propre réseau domestique, souvent négligé : un routeur mal configuré expose tous les appareils de la maison.",
    "Elle complète le module 7 pour GrapheneOS."
  ],
  tech: [
    { h: "Le réseau domestique", ul: [
      "Chiffrement <b>WPA3</b> (ou WPA2-AES au minimum) avec une phrase de passe longue.",
      "Mot de passe d'administration du routeur changé.",
      "Micrologiciel du routeur à jour.",
      "Fonction <b>WPS</b> désactivée.",
      "Réseau invité séparé pour les visiteurs et les objets connectés."
    ]},
    { h: "À l'extérieur", ul: [
      "Préférer le réseau mobile pour les opérations sensibles.",
      "Vérifier le nom exact du réseau, éviter les reconnexions automatiques.",
      "DNS privé, HTTPS et, si besoin, VPN de confiance."
    ]}
  ],
  fig: "network",
  steps: [
    "Connectez-vous à l'interface d'administration de votre box ou routeur (adresse indiquée sur l'étiquette ou dans la documentation de l'opérateur).",
    "Changez le mot de passe d'administration par défaut.",
    "Choisissez le chiffrement WPA3 (ou WPA2/WPA3 mixte) et une phrase de passe Wi-Fi d'au moins 16 caractères.",
    "Désactivez le WPS.",
    "Activez un réseau invité pour les visiteurs et les objets connectés.",
    "Vérifiez et installez les mises à jour du micrologiciel.",
    "Sur le téléphone, supprimez les réseaux publics mémorisés."
  ],
  result: "Votre réseau domestique est chiffré, administré avec un mot de passe robuste, et vos appareils ne se reconnectent pas automatiquement aux réseaux publics.",
  ex: [
    "Une box utilisant encore son mot de passe d'administration par défaut permet à un voisin malveillant de modifier ses réglages DNS.",
    "Une caméra connectée vulnérable placée sur le réseau invité ne peut pas atteindre vos ordinateurs et téléphones."
  ],
  err: [
    ["Conserver le mot de passe Wi-Fi imprimé sur la box depuis des années, partagé avec de nombreux visiteurs.", "Changez-le et utilisez un réseau invité pour les visiteurs."],
    ["Laisser le WPS activé.", "Désactivez-le."],
    ["Ne jamais mettre à jour la box.", "Vérifiez régulièrement les mises à jour, ou leur application automatique par l'opérateur."]
  ],
  reco: [
    "Placez les objets connectés sur un réseau séparé.",
    "Notez la phrase de passe dans votre gestionnaire de mots de passe."
  ],
  sum: "Un réseau domestique sûr utilise WPA3 ou WPA2-AES, une phrase de passe longue, un mot de passe d'administration changé, un micrologiciel à jour, le WPS désactivé et un réseau invité. À l'extérieur, appliquez les réflexes du module 2.",
  quiz: [
    { q: "Quel chiffrement Wi-Fi privilégier ?", o: ["WEP", "WPA3 (ou WPA2-AES au minimum)", "Aucun", "WPS"], a: 1, e: "WEP est obsolète ; WPA3 est la norme actuelle." },
    { q: "Pourquoi créer un réseau invité ?", o: ["Pour isoler visiteurs et objets connectés de vos appareils principaux", "Pour accélérer Internet", "Pour économiser de l'électricité", "Ce n'est pas utile"], a: 0, e: "Une compromission sur le réseau invité n'atteint pas vos appareils principaux." }
  ]
},
/* ---------------------------------------------------------------- 8.6 */
{
  obj: "Comprendre ce que fait réellement un VPN, ce qu'il ne fait pas, et savoir choisir et configurer un VPN si nécessaire.",
  intro: [
    "Les VPN font l'objet de publicités promettant « l'anonymat total » et « la protection contre les pirates ». La réalité est plus nuancée : un VPN déplace la confiance de votre réseau vers le fournisseur du VPN.",
    "Utilisé à bon escient, c'est un outil utile ; mal compris, c'est un faux sentiment de sécurité."
  ],
  tech: [
    { h: "Ce que fait un VPN", ul: [
      "Il chiffre le trafic entre votre téléphone et le serveur du VPN.",
      "Il masque votre adresse IP aux services visités, qui voient celle du VPN.",
      "Il masque les services que vous contactez au réseau local et au fournisseur d'accès."
    ]},
    { h: "Ce qu'il ne fait pas", ul: [
      "Il ne vous rend pas anonyme : vos comptes, cookies et empreintes d'appareil vous identifient.",
      "Il ne protège pas contre le phishing ou les applications malveillantes.",
      "Le fournisseur du VPN voit votre trafic (ou au moins les destinations) : il doit être digne de confiance.",
      "Un VPN gratuit peut se financer par la collecte et la revente de données."
    ]},
    { h: "Les réglages Android utiles", p: [
      "Android propose les options <b>VPN permanent</b> (Always-on) et <b>Bloquer les connexions sans VPN</b>, qui empêchent toute fuite de trafic hors du tunnel. Ces options se trouvent dans les réglages du VPN concerné."
    ]}
  ],
  fig: "network",
  steps: [
    "Définissez votre besoin : protection sur Wi-Fi public, masquage de l'adresse IP, accès au réseau de l'entreprise.",
    "Si un VPN est justifié, choisissez un fournisseur au modèle économique clair (payant), à la politique de journalisation publique et auditée.",
    "Installez son application depuis une source officielle.",
    "Ouvrez <b>Paramètres › Réseau et Internet › VPN</b>, touchez l'engrenage du VPN choisi.",
    "Activez <b>VPN permanent</b> et <b>Bloquer les connexions sans VPN</b>.",
    "Vérifiez que la connexion fonctionne et que les applications sensibles passent bien par le tunnel."
  ],
  result: "Si un VPN est utilisé, il est fiable, permanent et bloque les connexions hors tunnel.",
  ex: [
    "Un salarié utilise le VPN de son entreprise pour accéder aux ressources internes depuis l'extérieur : c'est un usage légitime et nécessaire.",
    "Un utilisateur installe un VPN gratuit inconnu qui injecte des publicités et collecte son historique."
  ],
  err: [
    ["Croire qu'un VPN rend anonyme.", "Vos comptes et habitudes vous identifient toujours."],
    ["Choisir un VPN gratuit au modèle économique opaque.", "Préférez un fournisseur transparent et audité, ou pas de VPN."],
    ["Laisser le trafic fuiter lors d'une coupure du VPN.", "Activez Bloquer les connexions sans VPN."]
  ],
  reco: [
    "Un VPN n'est pas indispensable pour tout le monde : HTTPS et le DNS privé couvrent déjà beaucoup de risques.",
    "Pour un anonymat réel, des outils spécialisés comme le réseau Tor existent, avec leurs propres contraintes."
  ],
  sum: "Un VPN chiffre le trafic jusqu'à son serveur et masque votre adresse IP, mais il ne rend pas anonyme et déplace la confiance vers son fournisseur. Choisissez-le avec soin, et activez VPN permanent et Bloquer les connexions sans VPN.",
  quiz: [
    { q: "Un VPN vous rend-il anonyme ?", o: ["Oui, totalement", "Non, vos comptes et votre comportement vous identifient toujours", "Oui, s'il est gratuit", "Oui, en 5G"], a: 1, e: "Le VPN masque l'adresse IP, pas votre identité." },
    { q: "Quelle option Android empêche le trafic de sortir hors du VPN ?", o: ["Bloquer les connexions sans VPN", "Mode sombre", "Économiseur de batterie", "Partage de connexion"], a: 0, e: "Combinée au VPN permanent, elle empêche toute fuite." },
    { q: "Qui voit votre trafic lorsque vous utilisez un VPN ?", o: ["Personne", "Le fournisseur du VPN", "Uniquement vous", "Uniquement Google"], a: 1, e: "La confiance est déplacée vers le fournisseur du VPN." }
  ]
},
/* ---------------------------------------------------------------- 8.7 */
{
  obj: "Limiter le pistage publicitaire sur Android grâce aux réglages du système, du navigateur et des applications.",
  intro: [
    "Le pistage publicitaire consiste à suivre votre activité à travers les applications et les sites pour construire un profil commercial. Ces profils peuvent ensuite être revendus à des courtiers en données.",
    "Vous pouvez en réduire fortement l'ampleur."
  ],
  tech: [
    { h: "Les vecteurs de pistage", ul: [
      "<b>Identifiant publicitaire</b> : identifiant attribué par les services Google Play sur Android standard, utilisé par les applications pour relier votre activité.",
      "<b>SDK publicitaires</b> intégrés aux applications.",
      "<b>Cookies et empreintes</b> du navigateur.",
      "<b>Localisation</b> partagée avec les applications."
    ]},
    { h: "Les réglages", p: [
      "Depuis Android 12, il est possible de <b>supprimer l'identifiant publicitaire</b> : les applications reçoivent alors une valeur nulle. Les réglages de personnalisation des annonces du compte Google permettent aussi de limiter l'usage de vos données. Sur GrapheneOS sans Google Play, cet identifiant n'existe pas."
    ]}
  ],
  fig: "threat-map",
  steps: [
    "<b>Android standard</b> : ouvrez <b>Paramètres › Sécurité et confidentialité › Autres paramètres de confidentialité › Annonces</b> (ou <b>Paramètres › Google › Annonces</b>) et choisissez <b>Supprimer l'identifiant publicitaire</b>.",
    "Ouvrez votre compte Google (<b>myaccount.google.com › Données et confidentialité</b>) et désactivez la personnalisation des annonces si vous le souhaitez.",
    "Dans votre navigateur, bloquez les cookies tiers et utilisez un navigateur orienté confidentialité.",
    "Retirez la localisation aux applications qui n'en ont pas besoin.",
    "Désinstallez les applications gratuites dont le modèle économique repose manifestement sur la publicité intrusive."
  ],
  result: "L'identifiant publicitaire est supprimé, la personnalisation des annonces limitée et les vecteurs de pistage réduits.",
  ex: [
    "Après suppression de l'identifiant publicitaire, deux applications de jeux ne peuvent plus relier facilement votre activité entre elles.",
    "Un navigateur qui bloque les cookies tiers limite le suivi d'un site à l'autre."
  ],
  err: [
    ["Croire qu'une fois l'identifiant supprimé, tout pistage disparaît.", "Les SDK utilisent aussi d'autres signaux : limitez les permissions et les applications."],
    ["Accepter tous les cookies par lassitude.", "Utilisez les options de refus ou un navigateur qui les bloque."],
    ["Laisser la localisation à des applications gratuites.", "Retirez-la systématiquement si elle n'est pas justifiée."]
  ],
  reco: [
    "Préférez des applications payantes ou open source aux applications gratuites financées par la publicité.",
    "Revoyez les réglages publicitaires de votre compte une fois par an."
  ],
  sum: "Le pistage publicitaire repose sur l'identifiant publicitaire, les SDK, les cookies et la localisation. Supprimer l'identifiant (Android 12 et ultérieurs), limiter la personnalisation des annonces, bloquer les cookies tiers et réduire les permissions en limitent fortement l'ampleur.",
  quiz: [
    { q: "Depuis quelle version d'Android peut-on supprimer l'identifiant publicitaire ?", o: ["Android 6", "Android 9", "Android 12", "Android 17"], a: 2, e: "La suppression est possible depuis Android 12." },
    { q: "Supprimer l'identifiant publicitaire supprime-t-il tout pistage ?", o: ["Oui", "Non, d'autres signaux restent utilisés", "Oui, sur Wi-Fi", "Oui, la nuit"], a: 1, e: "Les SDK et cookies utilisent d'autres moyens." }
  ]
},
/* ---------------------------------------------------------------- 8.8 */
{
  obj: "Comprendre la notion de métadonnées, ce qu'elles révèlent et comment en limiter l'exposition.",
  intro: [
    "Les métadonnées sont les « données sur les données » : qui a appelé qui, quand, pendant combien de temps, depuis où. Elles semblent anodines, mais leur accumulation dessine un portrait très précis de votre vie.",
    "Elles échappent souvent au chiffrement de bout en bout."
  ],
  tech: [
    { h: "Exemples de métadonnées", ul: [
      "Communications : expéditeur, destinataire, horodatage, fréquence, durée.",
      "Réseau : adresse IP, antenne mobile, réseau Wi-Fi.",
      "Fichiers : données <b>EXIF</b> des photos (date, modèle d'appareil, parfois coordonnées GPS).",
      "Documents : auteur, logiciel, historique de modifications."
    ]},
    { h: "Ce qu'elles révèlent", p: [
      "Un appel tardif et répété à un service médical spécialisé, une présence régulière dans un lieu de culte, des contacts fréquents avec un journaliste : sans lire un seul message, les métadonnées racontent beaucoup."
    ]},
    { h: "Les protections", p: [
      "Choisir des services qui minimisent les métadonnées, retirer les métadonnées des fichiers partagés, limiter la localisation. Sur Android, l'accès des applications aux coordonnées GPS intégrées aux photos est soumis à une permission spécifique depuis Android 10. L'application Appareil photo de GrapheneOS propose une option de retrait des métadonnées EXIF."
    ]}
  ],
  fig: "metadata",
  steps: [
    "Dans l'application Appareil photo, désactivez l'enregistrement de la position dans les photos si vous n'en avez pas besoin.",
    "Avant de partager une photo sensible, utilisez une fonction de suppression des métadonnées (option de l'application de partage, de la messagerie ou outil dédié).",
    "Vérifiez les métadonnées d'une photo dans les informations de la galerie.",
    "Pour les documents, supprimez les informations d'auteur avant diffusion (fonction d'inspection du logiciel de bureautique).",
    "Privilégiez les messageries qui minimisent les métadonnées pour les communications sensibles."
  ],
  result: "Les fichiers que vous partagez ne divulguent plus d'informations involontaires.",
  ex: [
    "Une photo d'un objet à vendre publiée en ligne contient les coordonnées GPS de votre domicile.",
    "Les relevés d'appels d'une source révèlent ses contacts avec un journaliste, sans qu'aucun contenu ne soit lu."
  ],
  err: [
    ["Penser que le chiffrement suffit à protéger une relation sensible.", "Réduisez aussi les métadonnées : service adapté, discrétion sur les horaires et les canaux."],
    ["Partager des photos originales sans vérifier les EXIF.", "Supprimez les métadonnées avant partage."],
    ["Oublier les métadonnées des documents bureautiques.", "Inspectez et nettoyez les documents avant diffusion."]
  ],
  reco: [
    "Désactivez par défaut la géolocalisation des photos.",
    "Considérez les métadonnées comme aussi sensibles que le contenu."
  ],
  sum: "Les métadonnées (qui, quand, où, avec quel appareil) révèlent beaucoup, même sans le contenu. Elles échappent souvent au chiffrement. Limiter la localisation, nettoyer les EXIF et les documents, et choisir des services sobres en métadonnées réduit leur exposition.",
  quiz: [
    { q: "Que sont les données EXIF d'une photo ?", o: ["Les pixels de l'image", "Des métadonnées : date, appareil, parfois position GPS", "Un filtre de couleur", "Le nom du fichier"], a: 1, e: "Elles peuvent révéler où et quand la photo a été prise." },
    { q: "Le chiffrement de bout en bout masque-t-il les métadonnées ?", o: ["Toujours", "Pas nécessairement : qui communique avec qui et quand reste souvent visible", "Oui, sur Android", "Oui, en Wi-Fi"], a: 1, e: "C'est pourquoi le choix du service compte aussi." }
  ]
},
/* ---------------------------------------------------------------- 8.9 */
{
  obj: "Protéger ses photos et documents sensibles, sur l'appareil, lors du partage et dans le cloud.",
  intro: [
    "Photos d'identité, documents administratifs, contrats, images privées : ces fichiers sont parmi les plus sensibles d'un smartphone. Ils sont exposés à plusieurs niveaux : l'appareil, les applications, le partage et la synchronisation.",
    "Cette leçon propose une stratégie couvrant ces quatre niveaux."
  ],
  tech: [
    { h: "Les quatre niveaux", ul: [
      "<b>Sur l'appareil</b> : verrouillage robuste, chiffrement, espace privé ou profil dédié.",
      "<b>Vis-à-vis des applications</b> : sélecteur de photos, accès partiel, Storage Scopes sur GrapheneOS.",
      "<b>Lors du partage</b> : canal chiffré de bout en bout, suppression des métadonnées, messages éphémères.",
      "<b>Dans le cloud</b> : les services de synchronisation classiques peuvent accéder aux fichiers ; les services chiffrés de bout en bout ou une archive chiffrée avant envoi offrent une meilleure protection."
    ]}
  ],
  fig: "encryption",
  steps: [
    "Identifiez les dossiers contenant des documents sensibles (pièces d'identité, documents bancaires, médicaux).",
    "Déplacez-les dans un espace protégé : espace privé, profil dédié ou coffre chiffré.",
    "Vérifiez quelles applications ont accès à vos photos et réduisez cet accès (accès partiel, sélecteur).",
    "Désactivez la synchronisation automatique des dossiers sensibles vers des services non chiffrés de bout en bout.",
    "Pour partager un document d'identité, utilisez un canal chiffré, ajoutez un filigrane indiquant l'usage prévu, et supprimez-le après envoi si possible."
  ],
  result: "Vos documents sensibles sont isolés, peu accessibles aux applications, partagés de façon chiffrée et non synchronisés en clair.",
  ex: [
    "Une copie de passeport envoyée par e-mail à une agence reste indéfiniment dans plusieurs boîtes de réception : un filigrane « Pour location appartement X, date » limite son réemploi frauduleux.",
    "La sauvegarde automatique de toutes les captures d'écran envoie dans le cloud des captures de codes et de relevés bancaires."
  ],
  err: [
    ["Garder des photos de pièces d'identité dans la galerie principale.", "Déplacez-les dans un espace protégé."],
    ["Accorder l'accès à toutes les photos à de nombreuses applications.", "Utilisez l'accès partiel ou le sélecteur."],
    ["Synchroniser automatiquement les captures d'écran.", "Excluez ce dossier de la synchronisation."]
  ],
  reco: [
    "Supprimez régulièrement les captures d'écran et documents temporaires.",
    "Utilisez un filigrane sur les copies de documents d'identité transmises."
  ],
  sum: "Protégez photos et documents à quatre niveaux : sur l'appareil (verrouillage, espace dédié), face aux applications (accès partiel), lors du partage (canal chiffré, métadonnées, filigrane) et dans le cloud (chiffrement de bout en bout ou archives chiffrées).",
  quiz: [
    { q: "Pourquoi ajouter un filigrane sur une copie de pièce d'identité envoyée ?", o: ["Pour l'embellir", "Pour limiter sa réutilisation frauduleuse", "Pour réduire sa taille", "C'est obligatoire"], a: 1, e: "Le filigrane indique l'usage prévu et complique les détournements." },
    { q: "Quel dossier est souvent synchronisé dans le cloud à tort ?", o: ["Les captures d'écran", "Les sonneries", "Les fonds d'écran", "Les polices"], a: 0, e: "Les captures contiennent souvent des informations sensibles." }
  ]
},
/* ---------------------------------------------------------------- 8.10 */
{
  obj: "Construire une stratégie de confidentialité mobile personnelle, cohérente et durable.",
  intro: [
    "Cette leçon de synthèse rassemble les modules précédents en une stratégie personnelle. L'objectif n'est pas la perfection, mais un niveau de protection adapté, que vous pourrez maintenir dans le temps.",
    "Elle s'appuie sur la modélisation des menaces du module 2."
  ],
  tech: [
    { h: "Les cinq axes de la stratégie", ul: [
      "<b>Appareil</b> : système à jour, verrouillage robuste, configuration renforcée ou GrapheneOS.",
      "<b>Applications</b> : minimisation, sources fiables, permissions minimales, cloisonnement.",
      "<b>Comptes</b> : mots de passe uniques, MFA, clés d'accès, surveillance des fuites.",
      "<b>Communications</b> : canaux chiffrés, métadonnées limitées, notifications masquées.",
      "<b>Données</b> : sauvegardes chiffrées, documents protégés, partage maîtrisé."
    ]},
    { h: "Les niveaux", p: [
      "<b>Essentiel</b> : mises à jour, verrouillage, MFA, vigilance. <b>Renforcé</b> : en plus, permissions minimales, messagerie chiffrée, gestionnaire de mots de passe, DNS privé. <b>Élevé</b> : en plus, GrapheneOS, profils, clés de sécurité, redémarrages fréquents, réduction des métadonnées."
    ]}
  ],
  fig: "audit",
  steps: [
    "Reprenez votre modèle de menaces (module 2, leçon 10).",
    "Choisissez le niveau visé : essentiel, renforcé ou élevé.",
    "Pour chacun des cinq axes, listez les mesures déjà en place et celles à mettre en œuvre.",
    "Planifiez les actions manquantes sur quatre semaines.",
    "Fixez une routine : 15 minutes par mois, revue complète tous les six mois.",
    "Préparez-vous à l'audit du module 9, qui vérifiera la mise en œuvre."
  ],
  result: "Vous disposez d'une stratégie écrite, couvrant les cinq axes, avec un plan d'action et une routine.",
  ex: [
    "Niveau essentiel pour un parent : mises à jour automatiques, PIN à 6 chiffres, MFA sur le compte Google, vigilance face aux SMS frauduleux.",
    "Niveau élevé pour une avocate : GrapheneOS, profil « Cabinet », Signal avec messages éphémères, clés de sécurité, redémarrage automatique court."
  ],
  err: [
    ["Viser le niveau élevé sans en avoir besoin, puis tout abandonner.", "Choisissez un niveau soutenable."],
    ["Négliger un axe entier (souvent les comptes).", "Couvrez les cinq axes, même au niveau essentiel."],
    ["Ne pas écrire sa stratégie.", "Une stratégie écrite est plus facile à suivre et à réviser."]
  ],
  reco: [
    "Commencez par le niveau essentiel, puis progressez.",
    "Partagez la démarche avec votre entourage professionnel et familial."
  ],
  sum: "Une stratégie de confidentialité mobile couvre cinq axes (appareil, applications, comptes, communications, données) à un niveau adapté (essentiel, renforcé, élevé). Écrite, planifiée et révisée régulièrement, elle reste efficace dans le temps.",
  quiz: [
    { q: "Quels sont les cinq axes de la stratégie proposée ?", o: ["Appareil, applications, comptes, communications, données", "Écran, batterie, son, Wi-Fi, Bluetooth", "Prix, marque, couleur, taille, poids", "Matin, midi, soir, nuit, week-end"], a: 0, e: "Ces cinq axes couvrent l'ensemble des risques étudiés." },
    { q: "Pourquoi choisir un niveau soutenable ?", o: ["Pour que les mesures soient maintenues dans le temps", "Pour dépenser moins de batterie", "Parce que le niveau élevé est interdit", "Ce n'est pas important"], a: 0, e: "Des mesures abandonnées ne protègent plus." }
  ]
}
];
