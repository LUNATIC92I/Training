/* Examen final : 50 questions couvrant les dix modules.
   Format : { q, o: [options], a: index de la bonne réponse, e: explication } */
window.ASG = window.ASG || {};
ASG.exam = [
/* Module 1 */
{ q: "Que désigne AOSP ?", o: ["Un antivirus Android", "Le projet open source qui publie le code de base d'Android", "Un magasin d'applications", "Un protocole réseau"], a: 1, e: "L'Android Open Source Project publie le code de base, adapté ensuite par chaque fabricant." },
{ q: "Sur quoi repose l'isolement entre applications Android ?", o: ["Sur la carte SIM", "Sur un identifiant Linux (UID) unique par application, renforcé par SELinux", "Sur le Wi-Fi", "Sur la luminosité"], a: 1, e: "C'est le principe du bac à sable applicatif (module 1, leçon 4)." },
{ q: "Quel mode SELinux doit être actif sur un appareil sain ?", o: ["Permissive", "Disabled", "Enforcing", "Debug"], a: 2, e: "En mode Enforcing, tout accès non autorisé par la politique est refusé." },
{ q: "Que signifie l'état de démarrage orange ?", o: ["Système d'origine vérifié", "Bootloader déverrouillé", "Batterie faible", "Mise à jour réussie"], a: 1, e: "L'intégrité du système n'est plus garantie par le démarrage vérifié." },
{ q: "Où sont exécutées les opérations d'Android Keystore sur un appareil moderne ?", o: ["Dans le cloud", "Dans le TEE ou une puce sécurisée", "Dans l'application", "Sur la carte SD"], a: 1, e: "Les clés privées ne quittent pas l'environnement matériel isolé." },
{ q: "Quel geste remet un appareil en état BFU ?", o: ["Activer le mode avion", "Redémarrer sans déverrouiller", "Fermer les applications", "Baisser le volume"], a: 1, e: "Le redémarrage retire les clés des données utilisateur de la mémoire." },
{ q: "Comment s'exprime le niveau de correctif de sécurité Android ?", o: ["Par une date", "Par un pourcentage", "Par une couleur", "Par un nombre d'étoiles"], a: 0, e: "Par exemple 2026-10-05." },
/* Module 2 */
{ q: "Quel est le vecteur d'infection le plus courant sur Android ?", o: ["Une faille de l'écran", "L'installation volontaire d'une application trompeuse", "La recharge", "Le mode sombre"], a: 1, e: "La tromperie de l'utilisateur reste le premier vecteur." },
{ q: "Quel accès un cheval de Troie bancaire cherche-t-il le plus souvent à obtenir ?", o: ["La lampe torche", "Le service d'accessibilité", "Le vibreur", "Le fond d'écran"], a: 1, e: "Il permet de lire l'écran et d'agir à la place de l'utilisateur." },
{ q: "Que garantit le cadenas du navigateur ?", o: ["Que le site est légitime", "Que la connexion est chiffrée", "Que le site est gratuit", "Que Google l'a approuvé"], a: 1, e: "Un site frauduleux peut aussi afficher le cadenas." },
{ q: "Qu'est-ce que le SIM swapping ?", o: ["Un changement de forfait", "Le transfert frauduleux de votre numéro sur la SIM d'un attaquant", "Un jeu", "Une mise à jour"], a: 1, e: "L'attaquant reçoit alors vos codes par SMS." },
{ q: "Que désigne une attaque zero-click ?", o: ["Une attaque sans Internet", "Une attaque ne nécessitant aucune action de la victime", "Une attaque gratuite", "Une attaque par courrier"], a: 1, e: "Elle exploite des failles sans clic ni installation." },
{ q: "Quelle est la première question de la modélisation des menaces ?", o: ["Quel téléphone acheter ?", "Que dois-je protéger ?", "Quel antivirus choisir ?", "Quel forfait prendre ?"], a: 1, e: "On part toujours des actifs à protéger." },
/* Module 3 */
{ q: "Quelle méthode de verrouillage est la plus robuste ?", o: ["Schéma", "Balayage", "Mot de passe long", "Aucune"], a: 2, e: "Le mot de passe offre l'espace de combinaisons le plus grand." },
{ q: "Que fait l'option « Verrouillage » du menu d'alimentation ?", o: ["Elle éteint l'appareil", "Elle désactive la biométrie et Smart Lock jusqu'à la saisie du code", "Elle efface les données", "Elle active le Wi-Fi"], a: 1, e: "Utile si l'on risque d'être contraint à présenter son empreinte." },
{ q: "Quelle classe de biométrie peut protéger des paiements ?", o: ["Classe 1", "Classe 2", "Classe 3", "Toutes"], a: 2, e: "Seule la biométrie forte (classe 3) est acceptée pour ces opérations." },
{ q: "Combien de canaux de mise à jour vérifier sur un Android avec services Google ?", o: ["Un", "Trois : système, système Google Play, applications", "Aucun", "Cinq"], a: 1, e: "Chacun corrige des composants différents." },
{ q: "Depuis Android 8, comment fonctionne l'installation d'applications inconnues ?", o: ["Interrupteur global", "Autorisation par application source", "Impossible", "Nécessite le root"], a: 1, e: "Chaque application source doit disposer de l'accès spécial." },
{ q: "Quelle méthode d'authentification multifacteur résiste au phishing par conception ?", o: ["SMS", "Code TOTP", "Clé d'accès (passkey)", "Question secrète"], a: 2, e: "Elle est liée au domaine légitime du service." },
{ q: "Que signifie la règle de sauvegarde 3-2-1 ?", o: ["3 copies, 2 supports, 1 hors site", "3 téléphones, 2 SIM, 1 compte", "3 sauvegardes par jour", "3 mots de passe"], a: 0, e: "C'est la règle de base d'une sauvegarde résiliente." },
/* Module 4 */
{ q: "Sur quelle base GrapheneOS est-il construit ?", o: ["iOS", "AOSP", "Windows", "Une distribution Linux de bureau"], a: 1, e: "Cela assure la compatibilité avec les applications Android." },
{ q: "Pourquoi GrapheneOS ne prend-il en charge que certains Pixel ?", o: ["Pour des raisons commerciales", "Parce que ce sont les appareils qui remplissent ses exigences matérielles de sécurité", "Par hasard", "Parce qu'ils sont les moins chers"], a: 1, e: "Reverrouillage avec clé personnalisée, puce sécurisée, attestation, MTE…" },
{ q: "Quel est le nom de l'allocateur mémoire renforcé de GrapheneOS ?", o: ["hardened_malloc", "fastmalloc", "safe_heap", "jemalloc"], a: 0, e: "Il rend l'exploitation des erreurs mémoire plus difficile." },
{ q: "À partir de quelle génération de Pixel le marquage mémoire matériel (MTE) est-il disponible ?", o: ["6e", "7e", "8e", "10e"], a: 2, e: "Le Tensor G3 des Pixel 8 l'introduit." },
{ q: "Que permet la permission Réseau de GrapheneOS ?", o: ["Accélérer la 5G", "Retirer à une application tout accès au réseau", "Choisir l'opérateur", "Partager la connexion"], a: 1, e: "Elle n'existe pas sur Android standard." },
{ q: "Comment Google Play fonctionne-t-il sur GrapheneOS ?", o: ["Intégré au système avec des privilèges", "Comme une application ordinaire en bac à sable, sans privilèges", "Via le root", "Il ne fonctionne pas du tout"], a: 1, e: "Une couche de compatibilité lui permet de fonctionner sans accès spécial." },
{ q: "Quelle fonction n'est pas prise en charge sur GrapheneOS ?", o: ["Les notifications push", "Le paiement sans contact Google Wallet", "Les appels", "Le navigateur"], a: 1, e: "C'est l'une des limites connues du système." },
/* Module 5 */
{ q: "Quelle est la seule source qui fait foi pour la compatibilité d'un appareil ?", o: ["Un forum", "La page officielle grapheneos.org/faq", "Un vendeur", "Une vidéo"], a: 1, e: "Aucune autre source ne peut s'y substituer." },
{ q: "Quel est le nom de code du Pixel 8a ?", o: ["shiba", "akita", "husky", "tokay"], a: 1, e: "Le nom de code s'affiche dans la ligne Product name en mode Fastboot." },
{ q: "L'option Déverrouillage OEM reste grisée malgré Internet et les mises à jour. Que conclure ?", o: ["Il faut un outil de déblocage", "L'appareil est probablement une variante bloquée : ne pas poursuivre", "Il faut retirer la SIM", "Il faut charger à 100 %"], a: 1, e: "Les variantes opérateur peuvent désactiver le déverrouillage." },
{ q: "Combien de fois l'installation de GrapheneOS efface-t-elle les données ?", o: ["Jamais", "Une fois", "Plusieurs fois (déverrouillage, flashage, verrouillage)", "Seulement sur demande"], a: 2, e: "D'où l'importance d'une sauvegarde vérifiée." },
{ q: "Quelles générations de Pixel la FAQ officielle recommande-t-elle pour un achat ?", o: ["6e et ultérieures", "8e et ultérieures", "Uniquement la 10e", "Toutes"], a: 1, e: "En raison de leur sécurité et de leur longue durée de support." },
/* Module 6 */
{ q: "Quelle est l'adresse officielle de l'installateur Web ?", o: ["https://grapheneos.org/install/web", "https://graphene-install.com", "https://grapheneos.app", "https://install-graphene.org"], a: 0, e: "Seul le domaine grapheneos.org est officiel." },
{ q: "Quelle technologie du navigateur l'installateur Web utilise-t-il ?", o: ["WebUSB", "WebGL", "Bluetooth Web", "NFC"], a: 0, e: "D'où l'incompatibilité avec Firefox et Safari." },
{ q: "Faut-il activer le débogage USB pour l'installateur Web ?", o: ["Oui, obligatoirement", "Non, la procédure officielle utilise Fastboot et ne le demande pas", "Oui, sous Windows", "Oui, sur Pixel 6"], a: 1, e: "N'activez que ce qui est nécessaire." },
{ q: "Comment accéder au mode Fastboot sur un Pixel ?", o: ["Maintenir Volume bas pendant le démarrage", "Maintenir Volume haut 30 secondes", "Taper un code", "Retirer la SIM"], a: 0, e: "L'écran affiche alors un triangle rouge et « Fastboot Mode »." },
{ q: "Selon la procédure officielle, quand démarre-t-on GrapheneOS pour la première fois ?", o: ["Avant le flashage", "Juste après le flashage, avant le verrouillage", "Après le reverrouillage du bootloader", "Jamais"], a: 2, e: "Le verrouillage efface de nouveau les données : il se fait avant tout usage." },
{ q: "Quel état de démarrage est attendu après l'installation et le reverrouillage ?", o: ["Vert", "Jaune, avec l'empreinte de la clé GrapheneOS", "Orange", "Rouge"], a: 1, e: "L'empreinte peut être comparée aux valeurs officielles." },
{ q: "Pourquoi un second appareil est-il nécessaire pour Auditor ?", o: ["Pour la recharge", "Parce que les résultats ne s'affichent pas sur l'appareil vérifié", "Pour télécharger l'image", "Ce n'est pas nécessaire"], a: 1, e: "La vérification locale se fait par code QR." },
/* Module 7 */
{ q: "Que se passe-t-il lorsqu'on met fin à la session d'un profil secondaire ?", o: ["Il est supprimé", "Ses données repassent au repos, chiffrées", "Il est copié dans le cloud", "Rien"], a: 1, e: "Les clés du profil sont retirées de la mémoire." },
{ q: "Que fait Storage Scopes ?", o: ["Chiffre la carte SD", "Limite l'application aux fichiers et dossiers choisis", "Supprime les photos", "Accélère le stockage"], a: 1, e: "L'application croit avoir l'accès, mais ne voit que la sélection." },
{ q: "Que fait le redémarrage automatique de GrapheneOS ?", o: ["Il efface l'appareil", "Il remet l'appareil en état BFU après une période sans déverrouillage", "Il installe Google Play", "Il désactive le chiffrement"], a: 1, e: "C'est une protection majeure des données au repos." },
{ q: "Avant de configurer un code de contrainte (duress), que faut-il faire ?", o: ["Installer Google Play", "Disposer de sauvegardes fiables et choisir un code très différent", "Désactiver le chiffrement", "Rien"], a: 1, e: "Sa saisie efface l'appareil de façon irréversible." },
/* Module 8 */
{ q: "Les conversations Telegram sont-elles chiffrées de bout en bout par défaut ?", o: ["Oui, toutes", "Non, seules les conversations secrètes le sont", "Oui, les groupes", "Oui, sur Android"], a: 1, e: "Les conversations ordinaires ne sont pas chiffrées de bout en bout." },
{ q: "Un VPN vous rend-il anonyme ?", o: ["Oui", "Non, il déplace la confiance vers son fournisseur et vos comptes vous identifient toujours", "Oui, s'il est gratuit", "Oui, en 5G"], a: 1, e: "Il masque l'adresse IP, pas votre identité." },
{ q: "Que peuvent révéler les données EXIF d'une photo ?", o: ["Rien", "La date, l'appareil et parfois la position GPS", "Le mot de passe", "Le numéro de carte bancaire"], a: 1, e: "Supprimez-les avant de partager une photo sensible." },
/* Module 9 */
{ q: "Quelle commande liste les applications tierces avec leur installateur ?", o: ["adb shell pm list packages -i -3", "adb reboot", "adb devices", "adb kill-server"], a: 0, e: "L'installateur révèle notamment les installations manuelles." },
{ q: "Que faire à la fin d'une session d'audit ADB ?", o: ["Laisser le débogage actif", "Désactiver le débogage USB et révoquer les autorisations", "Déverrouiller le bootloader", "Installer un antivirus"], a: 1, e: "L'accès ADB est puissant : il doit être refermé." },
/* Module 10 */
{ q: "Après la perte d'un téléphone, quelle est la première action ?", o: ["L'effacer", "Le localiser et le verrouiller à distance", "Acheter un autre téléphone", "Attendre"], a: 1, e: "L'effacement vient en dernier recours, car il empêche la localisation." },
{ q: "Une « facture » est reçue sous forme de fichier .apk. Que faire ?", o: ["L'ouvrir rapidement", "Ne pas l'ouvrir et vérifier auprès de l'expéditeur par un canal indépendant", "La partager avec les collègues", "Désactiver les mises à jour"], a: 1, e: "Une facture n'est jamais une application : c'est un signal d'alerte majeur." }
];
