/* ==========================================================================
   catalog.js : structure de la formation (modules, leçons, niveaux).
   Les contenus détaillés de chaque leçon sont dans js/data/module-XX.js
   et sont chargés à la demande par formation.js. L'ordre des leçons ici
   doit correspondre à l'ordre du tableau de contenus du module.
   Niveaux : "debutant", "intermediaire", "avance".
   ========================================================================== */
window.ASG = window.ASG || {};

ASG.levels = { debutant: "Débutant", intermediaire: "Intermédiaire", avance: "Avancé" };

ASG.catalog = [
  {
    id: "m1", num: 1, level: "debutant", duration: "4 h",
    title: "Comprendre la sécurité Android",
    desc: "L'architecture de sécurité d'Android, du noyau Linux au Keystore : bac à sable applicatif, permissions, SELinux, démarrage vérifié, chiffrement et cycle des correctifs.",
    keywords: "architecture noyau linux sandbox permissions selinux verified boot keystore chiffrement mises à jour",
    lessons: [
      { t: "Historique et fonctionnement d'Android", lvl: "debutant" },
      { t: "Architecture du système Android", lvl: "debutant" },
      { t: "Le noyau Linux et son rôle dans la sécurité", lvl: "intermediaire" },
      { t: "Le bac à sable applicatif (Application Sandbox)", lvl: "intermediaire" },
      { t: "La gestion des permissions", lvl: "debutant" },
      { t: "SELinux et le contrôle d'accès obligatoire", lvl: "avance" },
      { t: "Le démarrage vérifié (Verified Boot)", lvl: "intermediaire" },
      { t: "Android Keystore et la sécurité matérielle", lvl: "avance" },
      { t: "Le chiffrement des données", lvl: "intermediaire" },
      { t: "Les mises à jour de sécurité", lvl: "debutant" }
    ]
  },
  {
    id: "m2", num: 2, level: "debutant", duration: "4 h",
    title: "Identifier les menaces sur Android",
    desc: "Malwares, applications espionnes, chevaux de Troie, phishing, APK piégés, abus de permissions, ingénierie sociale et Wi-Fi publics, illustrés par des études de cas réalistes.",
    keywords: "malware spyware stalkerware trojan phishing apk permissions ingénierie sociale wifi vulnérabilités menaces",
    lessons: [
      { t: "Les principales familles de malwares Android", lvl: "debutant" },
      { t: "Les applications espionnes", lvl: "debutant" },
      { t: "Les chevaux de Troie", lvl: "intermediaire" },
      { t: "Les attaques par phishing", lvl: "debutant" },
      { t: "Les APK malveillants", lvl: "intermediaire" },
      { t: "Les abus de permissions", lvl: "intermediaire" },
      { t: "L'ingénierie sociale", lvl: "debutant" },
      { t: "Les risques des réseaux Wi-Fi publics", lvl: "debutant" },
      { t: "Les vulnérabilités Android", lvl: "avance" },
      { t: "Les techniques de protection contre ces menaces", lvl: "intermediaire" }
    ]
  },
  {
    id: "m3", num: 3, level: "debutant", duration: "5 h",
    title: "Sécuriser un smartphone Android classique",
    desc: "Une procédure pratique en quinze étapes, adaptée aux versions récentes d'Android et aux interfaces Pixel, Samsung One UI, Xiaomi HyperOS et autres surcouches.",
    keywords: "verrouillage code pin biométrie mises à jour correctifs autorisations localisation micro caméra sources inconnues play protect compte google mfa sauvegarde notifications vol perte",
    lessons: [
      { t: "Configurer un verrouillage sécurisé", lvl: "debutant" },
      { t: "Utiliser un code PIN robuste", lvl: "debutant" },
      { t: "Configurer correctement la biométrie", lvl: "debutant" },
      { t: "Activer les mises à jour automatiques", lvl: "debutant" },
      { t: "Vérifier les correctifs de sécurité", lvl: "debutant" },
      { t: "Contrôler les autorisations des applications", lvl: "debutant" },
      { t: "Limiter les accès à la localisation", lvl: "debutant" },
      { t: "Contrôler les accès au microphone et à la caméra", lvl: "debutant" },
      { t: "Désactiver les installations de sources inconnues", lvl: "intermediaire" },
      { t: "Configurer Google Play Protect", lvl: "debutant" },
      { t: "Sécuriser son compte Google", lvl: "debutant" },
      { t: "Configurer l'authentification multifacteur", lvl: "intermediaire" },
      { t: "Configurer correctement les sauvegardes", lvl: "intermediaire" },
      { t: "Sécuriser les notifications sur l'écran verrouillé", lvl: "debutant" },
      { t: "Se protéger en cas de perte ou de vol", lvl: "intermediaire" }
    ]
  },
  {
    id: "m4", num: 4, level: "intermediaire", duration: "4 h",
    title: "Introduction approfondie à GrapheneOS",
    desc: "Origine, architecture, renforcements de sécurité, modèle de confidentialité, Google Play en bac à sable et limites réelles du système, sans promesses irréalistes.",
    keywords: "grapheneos aosp hardened malloc vanadium sandboxed google play confidentialité limites comparaison",
    lessons: [
      { t: "Qu'est-ce que GrapheneOS ?", lvl: "debutant" },
      { t: "Pourquoi ce système a été développé", lvl: "debutant" },
      { t: "L'architecture de GrapheneOS", lvl: "intermediaire" },
      { t: "Les mécanismes de sécurité de GrapheneOS", lvl: "avance" },
      { t: "Le modèle de confidentialité", lvl: "intermediaire" },
      { t: "Les différences avec Android classique", lvl: "intermediaire" },
      { t: "Fonctionner sans Google Play", lvl: "intermediaire" },
      { t: "Google Play dans un environnement sandboxé", lvl: "avance" },
      { t: "Les fonctionnalités de sécurité avancées", lvl: "avance" },
      { t: "Limites et contraintes de GrapheneOS", lvl: "intermediaire" }
    ]
  },
  {
    id: "m5", num: 5, level: "intermediaire", duration: "2 h",
    title: "Vérifier la compatibilité de son smartphone",
    desc: "Module obligatoire avant toute installation : identification du modèle, liste officielle des Pixel pris en charge, bootloader, variantes opérateur, sauvegarde et état matériel.",
    keywords: "compatibilité pixel modèle génération codename bootloader opérateur sauvegarde état matériel précautions appareils pris en charge",
    lessons: [
      { t: "Identifier précisément son modèle", lvl: "debutant" },
      { t: "Vérifier sa génération de Pixel", lvl: "debutant" },
      { t: "Contrôler la compatibilité officielle", lvl: "intermediaire" },
      { t: "Vérifier les restrictions liées au bootloader", lvl: "intermediaire" },
      { t: "Sauvegarder ses données", lvl: "debutant" },
      { t: "Vérifier l'état matériel du téléphone", lvl: "debutant" },
      { t: "Les précautions à prendre avant l'installation", lvl: "intermediaire" }
    ]
  },
  {
    id: "m6", num: 6, level: "avance", duration: "4 h",
    title: "Installer GrapheneOS étape par étape",
    desc: "Le tutoriel complet de l'installateur Web officiel, en dix-huit étapes : préparation, déverrouillage OEM, flashage, reverrouillage, vérifications finales et premiers réglages.",
    keywords: "installation installateur web webusb fastboot bootloader déverrouillage oem flasher image reverrouiller auditor vérification",
    lessons: [
      { t: "Étape 1 : préparer le matériel", lvl: "debutant" },
      { t: "Étape 2 : vérifier la compatibilité du téléphone", lvl: "debutant" },
      { t: "Étape 3 : sauvegarder toutes les données importantes", lvl: "debutant" },
      { t: "Étape 4 : vérifier le niveau de batterie", lvl: "debutant" },
      { t: "Étape 5 : préparer un ordinateur compatible", lvl: "intermediaire" },
      { t: "Étape 6 : le navigateur et WebUSB", lvl: "intermediaire" },
      { t: "Étape 7 : accéder aux options pour les développeurs", lvl: "debutant" },
      { t: "Étape 8 : activer le déverrouillage OEM", lvl: "intermediaire" },
      { t: "Étape 9 : le débogage USB, quand est-il nécessaire ?", lvl: "intermediaire" },
      { t: "Étape 10 : connecter le téléphone à l'ordinateur", lvl: "intermediaire" },
      { t: "Étape 11 : ouvrir l'installateur Web officiel", lvl: "intermediaire" },
      { t: "Étape 12 : déverrouiller le bootloader", lvl: "avance" },
      { t: "Étape 13 : télécharger et installer l'image officielle", lvl: "avance" },
      { t: "Étape 14 : suivre et vérifier l'installation", lvl: "avance" },
      { t: "Étape 15 : redémarrer le téléphone", lvl: "intermediaire" },
      { t: "Étape 16 : reverrouiller le bootloader", lvl: "avance" },
      { t: "Étape 17 : effectuer les vérifications finales", lvl: "avance" },
      { t: "Étape 18 : configurer GrapheneOS après installation", lvl: "intermediaire" }
    ]
  },
  {
    id: "m7", num: 7, level: "avance", duration: "5 h",
    title: "Configuration avancée de GrapheneOS",
    desc: "Profils utilisateurs, espace privé, permissions Réseau et Capteurs, DNS chiffré, Google Play sandboxé, Storage Scopes, mises à jour et réglages de sécurité avancés.",
    keywords: "configuration profils espace privé permissions capteurs réseau dns sandboxed play applications stockage storage scopes mises à jour sécurité avancée",
    lessons: [
      { t: "La configuration initiale", lvl: "debutant" },
      { t: "Gérer les utilisateurs et les profils", lvl: "intermediaire" },
      { t: "Utiliser l'espace privé", lvl: "intermediaire" },
      { t: "Configurer les permissions", lvl: "intermediaire" },
      { t: "Gérer l'accès aux capteurs", lvl: "intermediaire" },
      { t: "Gérer les réseaux", lvl: "intermediaire" },
      { t: "Configurer un DNS sécurisé", lvl: "intermediaire" },
      { t: "Installer Google Play sandboxé", lvl: "intermediaire" },
      { t: "Gérer les applications", lvl: "intermediaire" },
      { t: "Configurer le stockage", lvl: "avance" },
      { t: "Protéger ses données", lvl: "intermediaire" },
      { t: "Gérer les mises à jour", lvl: "debutant" },
      { t: "Les paramètres de sécurité avancés", lvl: "avance" },
      { t: "Se protéger contre les applications malveillantes", lvl: "intermediaire" },
      { t: "Les bonnes pratiques de confidentialité", lvl: "debutant" }
    ]
  },
  {
    id: "m8", num: 8, level: "intermediaire", duration: "4 h",
    title: "Protection des communications et de la vie privée",
    desc: "Chiffrement de bout en bout, choix des messageries, protection des comptes, Wi-Fi, VPN et leurs limites, pistage publicitaire, métadonnées et stratégie de confidentialité.",
    keywords: "communications chiffrement bout en bout messagerie signal comptes wifi vpn pistage publicitaire métadonnées photos documents stratégie",
    lessons: [
      { t: "Sécuriser ses communications", lvl: "debutant" },
      { t: "Comprendre le chiffrement de bout en bout", lvl: "intermediaire" },
      { t: "Choisir une messagerie sécurisée", lvl: "debutant" },
      { t: "Protéger ses comptes", lvl: "debutant" },
      { t: "Sécuriser ses connexions Wi-Fi", lvl: "debutant" },
      { t: "Comprendre les VPN et leurs limites", lvl: "intermediaire" },
      { t: "Limiter le pistage publicitaire", lvl: "debutant" },
      { t: "Comprendre les métadonnées", lvl: "intermediaire" },
      { t: "Protéger ses photos et ses documents", lvl: "debutant" },
      { t: "Construire une stratégie de confidentialité mobile", lvl: "avance" }
    ]
  },
  {
    id: "m9", num: 9, level: "avance", duration: "4 h",
    title: "Audit et vérification de la sécurité",
    desc: "Exercices pratiques pour contrôler soi-même la configuration d'un téléphone : versions, correctifs, permissions, applications suspectes, bootloader, ADB et journaux en laboratoire.",
    keywords: "audit vérification version android correctifs permissions applications suspectes bootloader adb logcat journaux laboratoire",
    lessons: [
      { t: "Exercice : vérifier la version d'Android", lvl: "debutant" },
      { t: "Exercice : vérifier les correctifs de sécurité", lvl: "debutant" },
      { t: "Exercice : contrôler les permissions", lvl: "intermediaire" },
      { t: "Exercice : inventorier les applications installées", lvl: "intermediaire" },
      { t: "Exercice : identifier les applications suspectes", lvl: "intermediaire" },
      { t: "Exercice : vérifier l'état du bootloader", lvl: "avance" },
      { t: "Comprendre ADB", lvl: "avance" },
      { t: "Analyser les journaux système en laboratoire", lvl: "avance" },
      { t: "Exercice : vérifier les mises à jour", lvl: "debutant" },
      { t: "Réaliser un audit de sécurité mobile complet", lvl: "avance" }
    ]
  },
  {
    id: "m10", num: 10, level: "avance", duration: "4 h",
    title: "Cas pratiques et évaluation finale",
    desc: "Huit scénarios réalistes à résoudre pas à pas, puis un examen final de cinquante questions avec corrections détaillées.",
    keywords: "cas pratiques scénarios perte phishing apk suspect mise à jour migration profils compte compromis examen final",
    lessons: [
      { t: "Cas 1 : un smartphone perdu", lvl: "intermediaire" },
      { t: "Cas 2 : une application aux permissions excessives", lvl: "intermediaire" },
      { t: "Cas 3 : un téléphone victime de phishing", lvl: "intermediaire" },
      { t: "Cas 4 : un APK suspect", lvl: "avance" },
      { t: "Cas 5 : un appareil Android non mis à jour", lvl: "intermediaire" },
      { t: "Cas 6 : migrer vers GrapheneOS", lvl: "avance" },
      { t: "Cas 7 : une mauvaise configuration des profils", lvl: "avance" },
      { t: "Cas 8 : un compte Google compromis", lvl: "intermediaire" }
    ]
  }
];
