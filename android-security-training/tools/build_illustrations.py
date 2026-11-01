#!/usr/bin/env python3
"""
Génère les illustrations techniques SVG de la formation (assets/illustrations).

Toutes les figures partagent la même grille, la même palette et la même
typographie, ce qui garantit une identité visuelle cohérente. Relancer ce
script après modification : python3 tools/build_illustrations.py
"""
from pathlib import Path
from xml.sax.saxutils import escape

OUT = Path(__file__).resolve().parent.parent / "assets" / "illustrations"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 800, 440
C = {
    "bg": "#0A1120", "panel": "#101B2D", "panel2": "#15233A", "line": "#2A3A52",
    "blue": "#247BFF", "cyan": "#00D9FF", "white": "#F5F7FA", "grey": "#8995A5",
    "green": "#19D49A", "amber": "#FFB547", "red": "#FF5C6C",
}
SANS = "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif"
MONO = "ui-monospace,Menlo,Consolas,monospace"


def frame(title, body, desc):
    grid = "".join(
        f'<path d="M{x} 0V{H}" stroke="#13203A" stroke-width="1"/>' for x in range(0, W, 40)
    ) + "".join(f'<path d="M0 {y}H{W}" stroke="#13203A" stroke-width="1"/>' for y in range(0, H, 40))
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-labelledby="t d">'
        f'<title id="t">{escape(title)}</title><desc id="d">{escape(desc)}</desc>'
        '<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
        f'<path d="M0 0L10 5L0 10z" fill="{C["cyan"]}"/></marker>'
        '<marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
        f'<path d="M0 0L10 5L0 10z" fill="{C["red"]}"/></marker>'
        '<linearGradient id="g1" x1="0" x2="1"><stop offset="0" stop-color="#247BFF"/><stop offset="1" stop-color="#00D9FF"/></linearGradient></defs>'
        f'<rect width="{W}" height="{H}" fill="{C["bg"]}"/>{grid}'
        f'<text x="24" y="34" font-family="{MONO}" font-size="12" letter-spacing="2" fill="{C["cyan"]}">{escape(title.upper())}</text>'
        f'<path d="M24 44H{W-24}" stroke="{C["line"]}"/>'
        f"{body}</svg>"
    )


def box(x, y, w, h, label, sub=None, stroke=None, fill=None, size=15, dashed=False, color=None):
    s = stroke or C["line"]
    f = fill or C["panel"]
    d = ' stroke-dasharray="6 5"' if dashed else ""
    out = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{f}" stroke="{s}" stroke-width="1.5"{d}/>'
    cy = y + h / 2 + (0 if sub is None else -7)
    out += f'<text x="{x + w/2}" y="{cy + 5}" text-anchor="middle" font-family="{SANS}" font-size="{size}" font-weight="600" fill="{color or C["white"]}">{escape(label)}</text>'
    if sub:
        out += f'<text x="{x + w/2}" y="{cy + 24}" text-anchor="middle" font-family="{MONO}" font-size="11" fill="{C["grey"]}">{escape(sub)}</text>'
    return out


def text(x, y, s, size=13, color=None, anchor="start", mono=False, weight=400):
    fam = MONO if mono else SANS
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="{fam}" font-size="{size}" font-weight="{weight}" fill="{color or C["grey"]}">{escape(s)}</text>'


def arrow(x1, y1, x2, y2, red=False, dashed=False):
    col = C["red"] if red else C["cyan"]
    m = "arr" if red else "ar"
    d = ' stroke-dasharray="5 5"' if dashed else ""
    return f'<path d="M{x1} {y1}L{x2} {y2}" stroke="{col}" stroke-width="1.8" marker-end="url(#{m})"{d}/>'


def phone(x, y, w=150, h=280, inner=""):
    return (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="22" fill="{C["panel"]}" stroke="{C["grey"]}" stroke-width="2"/>'
        f'<rect x="{x+w/2-22}" y="{y+10}" width="44" height="5" rx="3" fill="{C["line"]}"/>' + inner
    )


def cross(x, y, r=10):
    return f'<path d="M{x-r} {y-r}L{x+r} {y+r}M{x+r} {y-r}L{x-r} {y+r}" stroke="{C["red"]}" stroke-width="3" stroke-linecap="round"/>'


def tick(x, y, r=10):
    return f'<path d="M{x-r} {y}L{x-r/3} {y+r*0.7}L{x+r} {y-r*0.7}" fill="none" stroke="{C["green"]}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'


FIGS = {}

# 1. Pile logicielle Android
layers = [
    ("Applications", "APK système et applications installées", C["cyan"]),
    ("Framework Java / Kotlin", "ActivityManager, PackageManager, gestion des permissions", C["blue"]),
    ("Runtime ART et bibliothèques natives", "libc Bionic, médias, SQLite, BoringSSL", C["blue"]),
    ("Couche d'abstraction matérielle (HAL)", "Interfaces vers caméra, audio, capteurs, Keymint", C["grey"]),
    ("Noyau Linux", "Processus, mémoire, pilotes, SELinux, Binder", C["green"]),
]
b = ""
for i, (l, s, col) in enumerate(layers):
    y = 64 + i * 72
    b += box(70, y, 540, 60, l, s, stroke=col)
b += f'<rect x="640" y="64" width="130" height="348" rx="10" fill="{C["panel2"]}" stroke="{C["amber"]}" stroke-dasharray="6 5"/>'
b += text(705, 210, "Matériel", 15, C["white"], "middle", weight=600)
b += text(705, 232, "TEE / puce", 11, C["grey"], "middle", mono=True)
b += text(705, 250, "sécurisée", 11, C["grey"], "middle", mono=True)
b += text(705, 272, "Boot ROM", 11, C["grey"], "middle", mono=True)
b += arrow(612, 380, 636, 380)
FIGS["android-stack"] = ("Pile logicielle Android", b, "Les cinq couches d'Android, des applications jusqu'au noyau Linux, reposant sur le matériel sécurisé.")

# 2. Bac à sable
b = ""
apps = [("Banque", "u0_a142"), ("Messagerie", "u0_a157"), ("Jeu", "u0_a203")]
for i, (n, uid) in enumerate(apps):
    x = 60 + i * 240
    col = C["red"] if n == "Jeu" else C["cyan"]
    b += f'<rect x="{x}" y="74" width="200" height="190" rx="14" fill="none" stroke="{col}" stroke-dasharray="7 6" stroke-width="1.6"/>'
    b += box(x + 25, 96, 150, 50, n, uid)
    b += box(x + 25, 160, 150, 40, "/data/data/…", None, size=12, fill=C["panel2"])
    b += text(x + 100, 244, "processus isolé", 11, C["grey"], "middle", mono=True)
b += f'<path d="M600 74C520 40 240 40 160 74" fill="none" stroke="{C["red"]}" stroke-width="1.8" stroke-dasharray="5 5" marker-end="url(#arr)"/>'
b += cross(380, 49, 8)
b += text(400, 66, "lecture refusée", 11, C["red"], mono=True)
b += box(60, 300, 680, 50, "Noyau Linux : un UID par application, permissions de fichiers, SELinux", None, stroke=C["green"], size=14)
b += box(60, 366, 680, 46, "Binder : seul canal autorisé, contrôlé par des permissions", None, stroke=C["blue"], size=14)
FIGS["sandbox"] = ("Bac à sable applicatif", b, "Chaque application reçoit son propre identifiant Linux. Une application qui tente de lire les données d'une autre est bloquée par le noyau.")

# 3. Permissions
b = phone(60, 70, inner=(
    f'<rect x="76" y="140" width="118" height="120" rx="12" fill="{C["panel2"]}"/>'
    + text(135, 166, "Autoriser l'accès", 11, C["white"], "middle")
    + text(135, 182, "à la position ?", 11, C["white"], "middle")
    + f'<rect x="84" y="194" width="102" height="18" rx="6" fill="{C["line"]}"/>' + text(135, 207, "Seulement cette fois", 9, C["white"], "middle")
    + f'<rect x="84" y="216" width="102" height="18" rx="6" fill="{C["line"]}"/>' + text(135, 229, "Pendant l'utilisation", 9, C["white"], "middle")
    + f'<rect x="84" y="238" width="102" height="18" rx="6" fill="{C["line"]}"/>' + text(135, 251, "Refuser", 9, C["white"], "middle")
))
b += arrow(215, 200, 290, 200)
b += box(300, 80, 210, 56, "Normales", "accordées à l'installation", stroke=C["green"])
b += box(300, 150, 210, 56, "Dangereuses", "demandées à l'exécution", stroke=C["amber"])
b += box(300, 220, 210, 56, "Spéciales", "réglage dédié", stroke=C["red"])
b += box(300, 290, 210, 56, "Signature", "même certificat requis", stroke=C["blue"])
for i, (t1, t2) in enumerate([("INTERNET, NFC", "aucune invite"), ("CAMERA, RECORD_AUDIO", "position, contacts…"), ("Accessibilité, superposition", "administrateur, notifications"), ("Composants système", "applications de confiance")]):
    y = 108 + i * 70
    b += text(530, y, t1, 12, C["white"], mono=True)
    b += text(530, y + 18, t2, 12)
b += text(60, 390, "Principe : chaque accès sensible doit être justifié, limité dans le temps et révocable.", 13, C["grey"])
FIGS["permissions"] = ("Modèle de permissions", b, "Les quatre catégories de permissions Android et la boîte de dialogue d'autorisation à l'exécution.")

# 4. SELinux
b = box(50, 150, 170, 70, "Sujet", "processus untrusted_app")
b += box(315, 120, 170, 130, "Politique SELinux", "règles allow", stroke=C["amber"])
b += text(400, 222, "mode enforcing", 11, C["amber"], "middle", mono=True)
b += box(580, 80, 170, 60, "Objet autorisé", "app_data_file", stroke=C["green"])
b += box(580, 230, 170, 60, "Objet refusé", "system_data_file", stroke=C["red"])
b += arrow(222, 185, 312, 185)
b += arrow(487, 160, 576, 115)
b += arrow(487, 210, 576, 255, red=True)
b += tick(760, 70) + cross(762, 222)
b += text(50, 340, "Contrôle d'accès obligatoire : même un processus compromis ne peut sortir de son domaine.", 13)
b += text(50, 364, "Tout ce qui n'est pas explicitement autorisé est refusé, puis journalisé (avc: denied).", 13)
FIGS["selinux"] = ("SELinux", b, "Un processus demande l'accès à un objet. La politique SELinux autorise l'accès à ses propres fichiers et refuse l'accès aux fichiers système.")

# 5. Chaîne de démarrage vérifié
chain = [("Boot ROM", "racine matérielle"), ("Bootloader", "vérifié par la ROM"), ("vbmeta", "signatures AVB"), ("boot / noyau", "hash vérifié"), ("system, vendor", "dm-verity")]
b = ""
for i, (l, s) in enumerate(chain):
    x = 30 + i * 152
    b += box(x, 110, 132, 76, l, s, stroke=C["green"])
    if i < len(chain) - 1:
        b += arrow(x + 134, 148, x + 150, 148)
b += box(30, 236, 360, 70, "État vert : clé d'origine, appareil verrouillé", None, stroke=C["green"], size=13)
b += box(410, 236, 360, 70, "État jaune : clé personnalisée enregistrée", None, stroke=C["amber"], size=13)
b += box(30, 322, 360, 70, "État orange : bootloader déverrouillé", None, stroke=C["amber"], size=13, color=C["amber"])
b += box(410, 322, 360, 70, "État rouge : vérification échouée", None, stroke=C["red"], size=13, color=C["red"])
FIGS["boot-chain"] = ("Démarrage vérifié (AVB)", b, "Chaque étage du démarrage vérifie la signature du suivant, de la ROM jusqu'aux partitions système. Les quatre états de démarrage sont indiqués.")

# 6. Keystore
b = box(40, 90, 200, 70, "Application", "demande une signature")
b += box(40, 280, 200, 70, "Keystore (système)", "API Android")
b += f'<rect x="330" y="70" width="420" height="300" rx="16" fill="{C["panel2"]}" stroke="{C["amber"]}" stroke-dasharray="7 6" stroke-width="1.6"/>'
b += text(350, 98, "ENVIRONNEMENT ISOLÉ : TEE / PUCE SÉCURISÉE (STRONGBOX)", 11, C["amber"], mono=True)
b += box(370, 130, 160, 70, "KeyMint", "opérations crypto")
b += box(560, 130, 160, 70, "Clé privée", "jamais exportée", stroke=C["green"])
b += box(370, 260, 350, 70, "Attestation : la puce signe un certificat décrivant la clé", None, size=13)
b += arrow(140, 162, 140, 276)
b += arrow(242, 315, 366, 175)
b += arrow(532, 165, 556, 165)
b += f'<path d="M370 220H290V140H244" fill="none" stroke="{C["green"]}" stroke-width="1.8" marker-end="url(#ar)"/>'
b += text(150, 212, "résultat seulement", 11, C["green"], mono=True)
FIGS["keystore"] = ("Android Keystore", b, "L'application demande une opération cryptographique ; la clé privée reste dans l'environnement matériel isolé et seul le résultat est renvoyé.")

# 7. Chiffrement
b = box(40, 100, 180, 64, "Code de verrouillage", "PIN / mot de passe")
b += box(40, 260, 180, 64, "Secret matériel", "TEE / puce sécurisée", stroke=C["amber"])
b += box(300, 180, 190, 70, "Dérivation de clé", "limitation des essais", stroke=C["cyan"])
b += box(570, 90, 190, 64, "Stockage CE", "après 1er déverrouillage", stroke=C["green"])
b += box(570, 190, 190, 64, "Stockage DE", "dès le démarrage", stroke=C["blue"])
b += box(570, 290, 190, 64, "Métadonnées", "chiffrées aussi", stroke=C["grey"])
b += arrow(222, 132, 296, 205) + arrow(222, 292, 296, 228)
b += arrow(492, 205, 566, 122) + arrow(492, 215, 566, 222) + arrow(492, 228, 566, 318)
b += text(40, 400, "Chiffrement basé sur les fichiers (FBE) : sans le code, les données CE restent illisibles.", 13)
FIGS["encryption"] = ("Chiffrement des données", b, "Le code de verrouillage et un secret matériel dérivent les clés qui protègent le stockage chiffré par identifiants (CE) et le stockage chiffré par appareil (DE).")

# 8. Cycle des mises à jour
steps = [("Découverte", "chercheur, Google"), ("Correctif", "AOSP, puces"), ("Bulletin", "mensuel"), ("Fabricant", "intégration"), ("Opérateur", "selon les cas"), ("Votre appareil", "installation")]
b = ""
for i, (l, s) in enumerate(steps):
    x = 30 + (i % 3) * 255
    y = 90 if i < 3 else 250
    col = C["green"] if i == 5 else C["cyan"]
    b += box(x, y, 220, 76, l, s, stroke=col)
b += arrow(252, 128, 282, 128) + arrow(507, 128, 537, 128)
b += f'<path d="M640 168V210H140V246" fill="none" stroke="{C["cyan"]}" stroke-width="1.8" marker-end="url(#ar)"/>'
b += arrow(252, 288, 282, 288) + arrow(507, 288, 537, 288)
b += text(30, 380, "Chaque intermédiaire ajoute un délai. Un appareil sans support fabricant ne reçoit plus rien.", 13)
b += text(30, 404, "Niveau de correctif visible dans Paramètres : « Mise à jour de sécurité Android ».", 13, C["white"])
FIGS["update-cycle"] = ("Cycle des correctifs", b, "Le trajet d'un correctif de sécurité, de la découverte de la vulnérabilité jusqu'à l'installation sur l'appareil.")

# 9. Cartographie des menaces
b = phone(325, 90, inner=text(400, 240, "Vos données", 14, C["white"], "middle", weight=600))
threats = [(60, 80, "Applications malveillantes"), (60, 190, "Phishing, faux SMS"), (60, 300, "Réseau non fiable"),
           (560, 80, "Logiciel espion"), (560, 190, "Vol, perte"), (560, 300, "Vulnérabilité non corrigée")]
for x, y, l in threats:
    b += box(x, y, 190, 54, l, None, stroke=C["red"], size=13)
    if x < 300:
        b += arrow(252, y + 27, 322, 230, red=True, dashed=True)
    else:
        b += arrow(558, y + 27, 478, 230, red=True, dashed=True)
FIGS["threat-map"] = ("Surface d'attaque mobile", b, "Les six grandes familles de menaces qui visent les données d'un smartphone.")

# 10. Phishing
b = phone(40, 70, inner=(
    f'<rect x="54" y="120" width="122" height="96" rx="10" fill="{C["panel2"]}"/>'
    + text(62, 140, "SMS · Livraison", 10, C["amber"], mono=True)
    + text(62, 160, "Votre colis est", 11, C["white"])
    + text(62, 176, "bloqué. Réglez", 11, C["white"])
    + text(62, 192, "1,99 € ici :", 11, C["white"])
    + text(62, 208, "livr-suivi.co…", 11, C["cyan"])
))
b += arrow(198, 170, 268, 170, red=True)
b += box(275, 130, 210, 80, "Faux site", "copie visuelle parfaite", stroke=C["red"])
b += arrow(487, 170, 557, 170, red=True)
b += box(565, 130, 200, 80, "Attaquant", "carte, identifiants, OTP", stroke=C["red"])
b += text(275, 260, "Indices à vérifier :", 14, C["white"], weight=600)
for i, s in enumerate(["Urgence ou menace inhabituelle", "Domaine ressemblant mais différent", "Demande de code reçu par SMS", "Paiement minime pour « débloquer »"]):
    b += text(290, 290 + i * 26, "› " + s, 13)
FIGS["phishing"] = ("Anatomie d'un phishing", b, "Un SMS frauduleux redirige vers un faux site qui transmet les informations saisies à l'attaquant. Les indices de détection sont listés.")

# 11. Vérification APK
b = box(40, 170, 160, 70, "Fichier APK", "source inconnue", stroke=C["amber"])
checks = [("Source officielle ?", "store, site de l'éditeur"), ("Permissions demandées", "cohérentes avec la fonction ?"), ("Certificat de signature", "identique à l'éditeur"), ("Analyse", "Play Protect, réputation")]
for i, (l, s) in enumerate(checks):
    y = 66 + i * 82
    b += box(290, y, 250, 64, l, s)
    b += arrow(202, 205, 286, y + 32, dashed=True)
b += arrow(542, 205, 610, 150) + arrow(542, 225, 610, 300, red=True)
b += box(615, 115, 150, 64, "Installer", "si tout est conforme", stroke=C["green"])
b += box(615, 270, 150, 64, "Supprimer", "au moindre doute", stroke=C["red"])
FIGS["apk-check"] = ("Évaluer un APK", b, "Les quatre vérifications à mener avant d'installer un fichier APK obtenu hors d'un magasin d'applications.")

# 12. Réseau
b = phone(40, 80, w=120, h=230)
b += box(230, 150, 150, 70, "Point d'accès", "Wi-Fi public", stroke=C["amber"])
b += box(450, 150, 130, 70, "Résolveur DNS", "DoT / DoH", stroke=C["blue"])
b += box(640, 150, 130, 70, "Service", "HTTPS / TLS", stroke=C["green"])
b += arrow(162, 185, 226, 185) + arrow(382, 185, 446, 185) + arrow(582, 185, 636, 185)
b += box(230, 280, 150, 60, "Attaquant", "faux point d'accès", stroke=C["red"])
b += arrow(305, 278, 305, 224, red=True, dashed=True)
b += f'<path d="M162 120C350 60 520 60 700 146" fill="none" stroke="{C["green"]}" stroke-width="2.5" stroke-dasharray="2 6"/>'
b += text(430, 60, "tunnel chiffré de bout en bout (TLS)", 12, C["green"], "middle", mono=True)
b += text(40, 380, "Le chiffrement TLS protège le contenu ; le DNS chiffré masque les noms de domaine au réseau local.", 13)
FIGS["network"] = ("Chemin réseau", b, "Le trajet des données d'un smartphone vers un service en ligne via un Wi-Fi public, avec les protections TLS et DNS chiffré.")

# 13. Écran de verrouillage
b = ""
opts = [("Aucun / balayage", "aucune protection", C["red"]), ("Schéma", "traces visibles, faible", C["amber"]), ("PIN 4 chiffres", "10 000 combinaisons", C["amber"]),
        ("PIN 6 chiffres aléatoire", "1 000 000 combinaisons", C["green"]), ("Mot de passe long", "le plus robuste", C["green"])]
for i, (l, s, col) in enumerate(opts):
    y = 64 + i * 70
    b += box(60, y, 300, 58, l, s, stroke=col)
    b += f'<rect x="400" y="{y+20}" width="{60 + i*80}" height="18" rx="9" fill="{col}" opacity="0.85"/>'
b += text(60, 428, "Barres : résistance relative à la devinette, avec limitation matérielle des essais", 12, mono=True)
FIGS["lockscreen"] = ("Méthodes de verrouillage", b, "Comparaison de la robustesse des méthodes de verrouillage d'écran, de l'absence de verrouillage au mot de passe long.")

# 14. Compte et MFA
b = box(40, 170, 160, 70, "Vous", "identifiant")
b += box(270, 90, 200, 64, "Mot de passe", "ce que vous savez")
b += box(270, 180, 200, 64, "Clé d'accès / clé FIDO", "ce que vous possédez", stroke=C["green"])
b += box(270, 270, 200, 64, "Biométrie locale", "ce que vous êtes", stroke=C["blue"])
b += arrow(202, 205, 266, 122) + arrow(202, 205, 266, 212) + arrow(202, 205, 266, 302)
b += box(560, 170, 200, 70, "Compte protégé", "au moins 2 facteurs", stroke=C["green"])
b += arrow(472, 122, 556, 195) + arrow(472, 212, 556, 205) + arrow(472, 302, 556, 215)
b += text(40, 390, "Le SMS reste le second facteur le plus faible : préférez une clé d'accès ou une application d'authentification.", 13)
FIGS["account-mfa"] = ("Authentification multifacteur", b, "Les trois familles de facteurs d'authentification qui protègent un compte en ligne.")

# 15. Antivol
b = phone(50, 80, w=130, h=240, inner=text(115, 210, "Perdu", 14, C["red"], "middle", weight=600))
acts = [("1. Localiser", "si la localisation est active"), ("2. Verrouiller", "message, numéro de contact"), ("3. Sécuriser les comptes", "déconnexion, mots de passe"), ("4. Effacer", "en dernier recours"), ("5. Signaler", "opérateur : blocage SIM / IMEI")]
for i, (l, s) in enumerate(acts):
    y = 64 + i * 70
    b += box(300, y, 300, 58, l, s, stroke=C["green"] if i < 4 else C["blue"])
    b += arrow(184, 200, 296, y + 29, dashed=True)
FIGS["antitheft"] = ("Réagir à une perte ou un vol", b, "Les cinq actions à mener rapidement après la perte ou le vol d'un smartphone.")

# 16. Couches GrapheneOS
b = ""
gl = [("Applications et Google Play en bac à sable", "applications ordinaires, sans privilèges", C["cyan"]),
      ("Permissions Réseau, Capteurs, Storage / Contact Scopes", "contrôles supplémentaires pour l'utilisateur", C["cyan"]),
      ("Base AOSP renforcée", "bibliothèques, runtime et services durcis", C["blue"]),
      ("hardened_malloc, durcissement de la libc et du noyau", "réduction de la surface d'exploitation", C["blue"]),
      ("Démarrage vérifié, puce Titan M2, attestation", "fonctions matérielles des Pixel", C["green"])]
for i, (l, s, col) in enumerate(gl):
    b += box(80, 64 + i * 72, 640, 60, l, s, stroke=col)
FIGS["graphene-layers"] = ("Architecture de GrapheneOS", b, "Les couches de renforcement de GrapheneOS, des fonctions matérielles du Pixel jusqu'aux contrôles offerts à l'utilisateur.")

# 17. Google Play en bac à sable
b = f'<rect x="40" y="70" width="460" height="230" rx="16" fill="none" stroke="{C["cyan"]}" stroke-dasharray="7 6" stroke-width="1.6"/>'
b += text(60, 96, "PROFIL UTILISATEUR · APPLICATIONS ORDINAIRES", 11, C["cyan"], mono=True)
b += box(60, 120, 130, 64, "Play Store", None)
b += box(205, 120, 130, 64, "Play services", None)
b += box(350, 120, 130, 64, "Vos applis", None)
b += box(60, 210, 420, 64, "Mêmes permissions que n'importe quelle application", None, size=13)
b += box(560, 70, 200, 100, "Couche de compatibilité", "fournie par GrapheneOS", stroke=C["green"])
b += box(560, 200, 200, 100, "Système GrapheneOS", "aucun accès privilégié", stroke=C["blue"])
b += arrow(502, 150, 556, 120) + arrow(660, 172, 660, 196)
b += box(40, 330, 720, 70, "Contraste : sur Android standard, les services Google Play sont intégrés au système avec des privilèges étendus.", None, size=13, stroke=C["amber"])
FIGS["play-sandbox"] = ("Google Play en bac à sable", b, "Sur GrapheneOS, le Play Store et les services Google Play s'exécutent comme des applications ordinaires dans un profil, sans privilèges système.")

# 18. Profils
b = ""
profs = [("Propriétaire", "administration", C["green"]), ("Profil secondaire", "applications à risque", C["amber"]), ("Espace privé", "applications sensibles", C["cyan"]), ("Invité", "prêt temporaire", C["grey"])]
for i, (l, s, col) in enumerate(profs):
    x = 30 + i * 190
    b += f'<rect x="{x}" y="70" width="170" height="250" rx="14" fill="{C["panel"]}" stroke="{col}" stroke-width="1.6"/>'
    b += text(x + 85, 104, l, 15, C["white"], "middle", weight=600)
    b += text(x + 85, 124, s, 11, C["grey"], "middle", mono=True)
    for j in range(3):
        b += f'<rect x="{x + 22 + j*45}" y="150" width="36" height="36" rx="9" fill="{C["panel2"]}" stroke="{C["line"]}"/>'
    b += box(x + 15, 210, 140, 44, "Clé de chiffrement", None, size=11, fill=C["panel2"])
    b += box(x + 15, 262, 140, 44, "Données séparées", None, size=11, fill=C["panel2"])
b += text(30, 368, "Chaque profil a ses propres applications, données et clés. Fermer la session remet ses données au repos (chiffrées).", 13)
FIGS["profiles"] = ("Profils et cloisonnement", b, "Quatre espaces séparés sur le même appareil, chacun avec ses applications, ses données et ses clés de chiffrement.")

# 19. Identification de l'appareil
b = phone(40, 70, w=170, h=300, inner=(
    text(60, 130, "Paramètres", 12, C["white"], weight=600)
    + text(60, 156, "› À propos du téléphone", 11)
    + f'<rect x="56" y="172" width="138" height="56" rx="8" fill="{C["panel2"]}"/>'
    + text(64, 192, "Modèle", 10, C["grey"]) + text(64, 212, "Pixel 8a", 12, C["cyan"], mono=True)
    + text(60, 252, "› Version d'Android", 11)
    + text(60, 274, "› Matériel", 11)
))
b += arrow(212, 200, 286, 140) + arrow(212, 200, 286, 250)
b += box(290, 100, 230, 76, "Nom commercial", "ex. « Pixel 8a »")
b += box(290, 210, 230, 76, "Nom de code", "ex. akita (Fastboot)", stroke=C["cyan"])
b += arrow(522, 190, 576, 190)
b += box(580, 140, 190, 100, "Liste officielle", "grapheneos.org/faq", stroke=C["green"])
b += text(290, 340, "Croisez toujours deux sources : le nom affiché dans le système", 13)
b += text(290, 362, "et le nom de code affiché en mode Fastboot.", 13)
FIGS["device-id"] = ("Identifier son modèle", b, "Le nom commercial et le nom de code de l'appareil sont comparés à la liste officielle de GrapheneOS.")

# 20. Parcours d'installation
st = ["Préparer", "OEM unlock", "Fastboot", "Déverrouiller", "Télécharger", "Flasher", "Reverrouiller", "Vérifier"]
b = ""
for i, l in enumerate(st):
    x = 30 + (i % 4) * 190
    y = 90 if i < 4 else 260
    col = C["red"] if l in ("Déverrouiller", "Reverrouiller") else C["cyan"]
    b += box(x, y, 165, 80, l, f"phase {i+1}", stroke=col if l not in ("Vérifier",) else C["green"])
    if i % 4 != 3:
        b += arrow(x + 167, y + 40, x + 187, y + 40)
b += f'<path d="M682 172V214H112V256" fill="none" stroke="{C["cyan"]}" stroke-width="1.8" marker-end="url(#ar)"/>'
b += text(30, 380, "Phases en rouge : effacement complet des données du téléphone.", 13, C["red"])
FIGS["install-flow"] = ("Parcours d'installation", b, "Les huit grandes phases de l'installation de GrapheneOS ; le déverrouillage et le reverrouillage effacent les données.")

# 21. Écran Fastboot (schématique)
b = phone(300, 60, w=200, h=360, inner=(
    f'<path d="M400 100L430 152H370Z" fill="none" stroke="{C["red"]}" stroke-width="3"/>'
    + text(400, 146, "!", 18, C["red"], "middle", weight=700)
    + text(400, 186, "Fastboot Mode", 15, C["red"], "middle", weight=700)
    + f'<rect x="318" y="204" width="164" height="30" rx="6" fill="{C["green"]}" opacity="0.18" stroke="{C["green"]}"/>'
    + text(400, 224, "Start", 13, C["green"], "middle", mono=True)
    + text(320, 262, "Product name - …", 10, mono=True)
    + text(320, 280, "Bootloader version …", 10, mono=True)
    + text(320, 298, "Device state - locked", 10, C["white"], mono=True)
))
b += text(40, 120, "Accès :", 14, C["white"], weight=600)
b += text(40, 146, "appareil éteint, maintenir", 13)
b += text(40, 166, "Volume bas pendant le", 13)
b += text(40, 186, "démarrage.", 13)
b += text(540, 120, "Ne pas valider « Start » :", 14, C["white"], weight=600)
b += text(540, 146, "le téléphone doit rester", 13)
b += text(540, 166, "en pause en mode Fastboot.", 13)
b += text(540, 300, "« Device state » indique", 13)
b += text(540, 320, "locked ou unlocked.", 13)
b += arrow(536, 296, 486, 296)
FIGS["fastboot-screen"] = ("Interface du bootloader (schéma)", b, "Représentation schématique de l'écran Fastboot Mode d'un Pixel, avec le triangle d'avertissement rouge et la ligne Device state.")

# 22. Installateur Web (schématique)
b = f'<rect x="60" y="64" width="680" height="350" rx="12" fill="{C["panel"]}" stroke="{C["line"]}"/>'
b += f'<rect x="60" y="64" width="680" height="34" rx="12" fill="{C["panel2"]}"/>'
b += f'<rect x="150" y="72" width="400" height="18" rx="9" fill="{C["bg"]}"/>' + text(166, 86, "https://grapheneos.org/install/web", 11, C["green"], mono=True)
btns = ["Unlock bootloader", "Download release", "Flash release", "Lock bootloader"]
for i, l in enumerate(btns):
    y = 130 + i * 68
    b += f'<rect x="100" y="{y}" width="220" height="44" rx="8" fill="#1B3F7A" stroke="{C["blue"]}"/>'
    b += text(210, y + 27, l, 14, C["white"], "middle", weight=600)
    b += text(350, y + 27, ["confirmer sur le téléphone · efface les données", "téléchargement dans le navigateur", "remplace le système · efface les données", "confirmer sur le téléphone · efface les données"][i], 12)
FIGS["web-installer"] = ("Installateur Web (schéma)", b, "Représentation schématique des quatre boutons principaux de l'installateur Web officiel de GrapheneOS, dans l'ordre d'utilisation.")

# 23. Options développeur
b = phone(60, 60, w=200, h=360, inner=(
    text(80, 120, "À propos du téléphone", 12, C["white"], weight=600)
    + f'<rect x="76" y="140" width="168" height="40" rx="8" fill="{C["panel2"]}" stroke="{C["cyan"]}"/>'
    + text(86, 158, "Numéro de build", 11, C["white"]) + text(86, 172, "touchez 7 fois", 9, C["cyan"], mono=True)
))
b += arrow(262, 160, 336, 160)
b += phone(340, 60, w=200, h=360, inner=(
    text(360, 120, "Options pour les", 12, C["white"], weight=600) + text(360, 136, "développeurs", 12, C["white"], weight=600)
    + f'<rect x="356" y="156" width="168" height="40" rx="8" fill="{C["panel2"]}" stroke="{C["green"]}"/>'
    + text(366, 180, "Déverrouillage OEM", 11, C["white"])
    + f'<rect x="490" y="168" width="26" height="14" rx="7" fill="{C["green"]}"/>'
    + f'<rect x="356" y="206" width="168" height="40" rx="8" fill="{C["panel2"]}"/>'
    + text(366, 230, "Débogage USB", 11, C["grey"])
    + f'<rect x="490" y="218" width="26" height="14" rx="7" fill="{C["line"]}"/>'
))
b += text(580, 150, "Déverrouillage OEM :", 13, C["white"], weight=600)
b += text(580, 172, "requis pour GrapheneOS.", 12)
b += text(580, 220, "Débogage USB :", 13, C["white"], weight=600)
b += text(580, 242, "non requis par", 12)
b += text(580, 262, "l'installateur Web.", 12)
FIGS["dev-options"] = ("Options pour les développeurs", b, "Activation des options pour les développeurs en touchant sept fois le numéro de build, puis réglage du déverrouillage OEM.")

# 24. E2EE
b = box(40, 160, 150, 80, "Alice", "clé privée A", stroke=C["green"])
b += box(610, 160, 150, 80, "Bob", "clé privée B", stroke=C["green"])
b += box(325, 160, 150, 80, "Serveur", "relaie sans lire", stroke=C["grey"])
b += arrow(192, 200, 321, 200) + arrow(477, 200, 606, 200)
b += text(256, 186, "8f3a…c1", 12, C["amber"], "middle", mono=True)
b += text(542, 186, "8f3a…c1", 12, C["amber"], "middle", mono=True)
b += text(115, 278, "« Bonjour »", 13, C["white"], "middle", mono=True)
b += text(685, 278, "« Bonjour »", 13, C["white"], "middle", mono=True)
b += text(400, 278, "contenu illisible", 12, C["grey"], "middle", mono=True)
b += text(40, 350, "Le contenu est chiffré sur l'appareil de l'expéditeur et déchiffré uniquement sur celui du destinataire.", 13)
b += text(40, 374, "Le serveur peut toutefois voir des métadonnées : qui, quand, combien.", 13, C["amber"])
FIGS["e2ee"] = ("Chiffrement de bout en bout", b, "Un message est chiffré sur l'appareil d'Alice, relayé sous forme illisible par le serveur et déchiffré seulement sur l'appareil de Bob.")

# 25. Métadonnées
b = f'<rect x="40" y="70" width="320" height="300" rx="14" fill="{C["panel"]}" stroke="{C["green"]}"/>'
b += text(60, 100, "CONTENU (protégé par E2EE)", 11, C["green"], mono=True)
b += text(60, 140, "« Rendez-vous chez le", 14, C["white"]) + text(60, 162, "médecin à 15 h. »", 14, C["white"])
b += f'<rect x="420" y="70" width="340" height="300" rx="14" fill="{C["panel"]}" stroke="{C["amber"]}"/>'
b += text(440, 100, "MÉTADONNÉES (souvent visibles)", 11, C["amber"], mono=True)
for i, s in enumerate(["Expéditeur, destinataire", "Date et heure d'envoi", "Fréquence des échanges", "Adresse IP, localisation approx.", "Taille des messages", "Données EXIF des photos"]):
    b += text(440, 140 + i * 34, "› " + s, 13, C["white"])
b += text(40, 410, "Les métadonnées révèlent les relations et les habitudes, même sans lire les messages.", 13)
FIGS["metadata"] = ("Contenu et métadonnées", b, "Le contenu d'un message est protégé par le chiffrement de bout en bout, mais ses métadonnées restent souvent visibles.")

# 26. Audit
b = ""
items = [("Version Android", "Paramètres › À propos"), ("Correctif de sécurité", "date du bulletin"), ("Permissions", "gestionnaire d'autorisations"), ("Applications", "inventaire, origine"),
         ("Accessibilité / admin", "services sensibles"), ("Bootloader", "verrouillé ?"), ("Comptes", "MFA, appareils connectés"), ("Sauvegardes", "chiffrées, testées")]
for i, (l, s) in enumerate(items):
    x = 30 + (i % 4) * 190
    y = 80 if i < 4 else 230
    b += box(x, y, 170, 110, l, s, stroke=C["cyan"])
    b += tick(x + 150, y + 18, 7)
b += text(30, 390, "Grille d'audit : chaque point est noté conforme, à corriger ou non applicable, puis documenté.", 13)
FIGS["audit"] = ("Grille d'audit mobile", b, "Les huit points de contrôle d'un audit de sécurité mobile.")


if __name__ == "__main__":
    for key, (title, body, desc) in FIGS.items():
        (OUT / f"{key}.svg").write_text(frame(title, body, desc), encoding="utf-8")
    print(f"{len(FIGS)} illustrations écrites dans {OUT}")
