/* ==========================================================================
   formation.js : espace apprenant.
   Routage par paramètres d'URL (fonctionne aussi en ouvrant le fichier
   localement, sans serveur) :
     formation.html                 → tableau de bord
     formation.html?lecon=m3-l2     → leçon 2 du module 3
     formation.html?module=m3       → première leçon du module 3
     formation.html?examen=final    → examen final (50 questions)
   Les contenus sont chargés à la demande depuis js/data/module-XX.js.
   ========================================================================== */
(function () {
  "use strict";

  var el, P, root;
  window.ASG = window.ASG || {};
  ASG.content = ASG.content || {};

  /* Légendes des illustrations (fichiers dans assets/illustrations) */
  var FIGURES = {
    "android-stack": "Les couches d'Android : applications, framework, runtime et bibliothèques, HAL, noyau Linux, au-dessus du matériel sécurisé.",
    "sandbox": "Chaque application reçoit un identifiant Linux distinct (UID). Une tentative de lecture des données d'une autre application est bloquée par le noyau.",
    "permissions": "Les quatre catégories de permissions et la boîte de dialogue d'autorisation à l'exécution.",
    "selinux": "SELinux autorise un processus à accéder à ses propres fichiers et refuse tout ce que la politique n'autorise pas explicitement.",
    "boot-chain": "Chaîne de confiance du démarrage vérifié et les quatre états de démarrage possibles.",
    "keystore": "La clé privée reste dans l'environnement matériel isolé ; l'application ne reçoit que le résultat de l'opération.",
    "encryption": "Le code de verrouillage, combiné à un secret matériel, protège les clés du stockage chiffré.",
    "update-cycle": "Le trajet d'un correctif, de la découverte de la faille jusqu'à votre appareil.",
    "threat-map": "Les grandes familles de menaces visant un smartphone.",
    "phishing": "Déroulement d'une attaque par SMS frauduleux (smishing) et indices pour la reconnaître.",
    "apk-check": "Les vérifications à mener avant d'installer un APK obtenu hors d'un magasin d'applications.",
    "network": "Le trajet réseau des données et les protections TLS et DNS chiffré.",
    "lockscreen": "Robustesse comparée des méthodes de verrouillage.",
    "account-mfa": "Les familles de facteurs d'authentification.",
    "antitheft": "Les actions à mener après une perte ou un vol.",
    "graphene-layers": "Les couches de renforcement de GrapheneOS.",
    "play-sandbox": "Google Play exécuté comme une application ordinaire, sans privilèges système.",
    "profiles": "Cloisonnement par profils : applications, données et clés séparées.",
    "device-id": "Identifier le nom commercial et le nom de code de l'appareil, puis les comparer à la liste officielle.",
    "install-flow": "Les grandes phases de l'installation ; les phases en rouge effacent les données.",
    "fastboot-screen": "Schéma de l'écran Fastboot Mode d'un Pixel (représentation simplifiée, non une capture d'écran).",
    "web-installer": "Schéma des boutons de l'installateur Web officiel (représentation simplifiée, non une capture d'écran).",
    "dev-options": "Activation des options pour les développeurs puis du déverrouillage OEM.",
    "e2ee": "Principe du chiffrement de bout en bout.",
    "metadata": "Ce que le chiffrement protège (contenu) et ce qu'il laisse souvent visible (métadonnées).",
    "audit": "Grille de contrôle d'un audit de sécurité mobile."
  };

  var SECTION_TITLES = {
    obj: "Objectif pédagogique", intro: "Introduction", tech: "Explications techniques", fig: "Illustration",
    steps: "Procédure pas à pas", ex: "Exemples pratiques", err: "Erreurs fréquentes et solutions",
    reco: "Recommandations professionnelles", sum: "Résumé", quiz: "Questionnaire de validation"
  };

  /* ---------------------------------------------------------------- utilitaires */
  function params() {
    var out = {};
    location.search.replace(/^\?/, "").split("&").forEach(function (kv) {
      if (!kv) return;
      var p = kv.split("=");
      out[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || "").replace(/\+/g, " "));
    });
    return out;
  }
  function moduleById(id) { return ASG.catalog.filter(function (m) { return m.id === id; })[0]; }
  function lessonUrl(id) { return "formation.html?lecon=" + id; }
  function parseLessonId(id) {
    var m = /^m(\d{1,2})-l(\d{1,2})$/.exec(id || "");
    if (!m) return null;
    var mod = moduleById("m" + Number(m[1]));
    var idx = Number(m[2]) - 1;
    if (!mod || idx < 0 || idx >= mod.lessons.length) return null;
    return { mod: mod, idx: idx, id: mod.id + "-l" + (idx + 1) };
  }
  function lessonTitle(id) { var p = parseLessonId(id); return p ? p.mod.lessons[p.idx].t : ""; }
  function pad2(n) { return n < 10 ? "0" + n : "" + n; }
  function html(s) { return el("div", { html: s }).childNodes; }
  function para(s) { return el("p", { html: s }); }

  /** Charge un fichier de données une seule fois (script classique, compatible file://). */
  var loading = {};
  function loadScript(src) {
    if (loading[src]) return loading[src];
    loading[src] = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src; s.async = true;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("Chargement impossible : " + src)); };
      document.head.appendChild(s);
    });
    return loading[src];
  }
  function loadModule(mod) {
    if (ASG.content[mod.id]) return Promise.resolve(ASG.content[mod.id]);
    return loadScript("js/data/module-" + pad2(mod.num) + ".js").then(function () { return ASG.content[mod.id] || []; });
  }

  function setTitle(t) { document.title = t + " | Formation Sécurité Android & GrapheneOS"; }

  /* ---------------------------------------------------------------- tableau de bord */
  function renderDashboard() {
    setTitle("Espace apprenant");
    var s = P.get(), c = P.counts(), pct = P.percent();
    var resume = P.resumeId();
    var quizIds = Object.keys(s.quiz);

    var circ = 2 * Math.PI * 84;
    var ring = el("div", { className: "ring", html:
      '<svg viewBox="0 0 190 190" aria-hidden="true"><defs><linearGradient id="ringGrad" x1="0" x2="1"><stop offset="0" stop-color="#247BFF"/><stop offset="1" stop-color="#00D9FF"/></linearGradient></defs>' +
      '<circle class="ring-bg" cx="95" cy="95" r="84"/><circle class="ring-fg" cx="95" cy="95" r="84" stroke-dasharray="' + circ + '" stroke-dashoffset="' + circ + '"/></svg>' +
      '<div class="ring-label"><div><b>' + pct + '%</b><span>de la formation</span></div></div>' });

    var avgQuiz = 0;
    if (quizIds.length) {
      var sum = 0; quizIds.forEach(function (k) { sum += s.quiz[k].total ? s.quiz[k].best / s.quiz[k].total : 0; });
      avgQuiz = Math.round((sum / quizIds.length) * 100);
    }

    var panel = el("aside", { className: "dash-panel", attrs: { "aria-labelledby": "dash-title" } }, [
      el("h2", { text: "Ma progression", attrs: { id: "dash-title" }, className: "visually-hidden" }),
      ring,
      el("div", { className: "kv" }, [el("span", { text: "Leçons terminées" }), el("b", { text: c.done + " / " + c.total })]),
      el("div", { className: "kv" }, [el("span", { text: "Quiz réalisés" }), el("b", { text: String(quizIds.length) })]),
      el("div", { className: "kv" }, [el("span", { text: "Réussite moyenne aux quiz" }), el("b", { text: quizIds.length ? avgQuiz + " %" : "–" })]),
      el("div", { className: "kv" }, [el("span", { text: "Examen final (meilleur)" }), el("b", { text: s.exam ? s.exam.best + " / " + s.exam.total : "–" })]),
      el("div", { className: "mc-actions" }, [
        el("a", { className: "btn btn-primary", text: c.done ? "Reprendre la formation" : "Commencer la formation", attrs: { href: lessonUrl(resume) } }),
        el("a", { className: "btn btn-ghost btn-sm", text: "Examen final", attrs: { href: "formation.html?examen=final" } })
      ]),
      el("p", { className: "muted", attrs: { style: "font-size:.85rem;margin-top:16px" }, text: "Votre progression est enregistrée uniquement dans ce navigateur (localStorage). Aucun compte n'est nécessaire et aucune donnée n'est transmise." }),
      el("button", { className: "btn btn-ghost btn-sm", text: "Réinitialiser ma progression", attrs: { type: "button" }, on: { click: function () {
        if (window.confirm("Effacer toute votre progression et vos résultats enregistrés dans ce navigateur ?")) { P.reset(); renderDashboard(); ASG.toast("Progression réinitialisée."); }
      } } })
    ]);

    // Liste des modules
    var list = el("div", { className: "module-grid" });
    ASG.catalog.forEach(function (m) {
      var mc = P.moduleCounts(m.id);
      var mp = mc.total ? Math.round(mc.done / mc.total * 100) : 0;
      var firstOpen = m.id + "-l1";
      for (var i = 0; i < m.lessons.length; i++) { if (!s.done[m.id + "-l" + (i + 1)]) { firstOpen = m.id + "-l" + (i + 1); break; } }
      var lessons = el("ol", { className: "lesson-list" });
      m.lessons.forEach(function (l, i) {
        var id = m.id + "-l" + (i + 1);
        var q = s.quiz[id];
        lessons.appendChild(el("li", { className: s.done[id] ? "is-done" : "" }, [
          el("a", { attrs: { href: lessonUrl(id) } }, [
            el("span", { className: "ll-check", html: s.done[id] ? ASG.icon("check") : "" }),
            el("span", { text: l.t }),
            el("span", { className: "mono muted", attrs: { style: "font-size:.75rem" }, text: q ? "quiz " + q.best + "/" + q.total : "" })
          ])
        ]));
      });
      list.appendChild(el("article", { className: "card module-card card-interactive" }, [
        el("header", {}, [
          el("span", { className: "mc-num", text: pad2(m.num), attrs: { "aria-hidden": "true" } }),
          el("div", { className: "mc-meta" }, [el("span", { className: "badge", text: ASG.levels[m.level] }), el("span", { className: "badge", text: m.duration })])
        ]),
        el("h3", { text: "Module " + m.num + " : " + m.title }),
        el("div", { className: "mc-progress" }, [
          el("div", { className: "mc-progress-label" }, [el("span", { text: mc.done + " / " + mc.total + " leçons" }), el("span", { text: mp + " %" })]),
          el("div", { className: "progress" + (mp === 100 ? " is-complete" : ""), attrs: { role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(mp), "aria-label": "Progression du module " + m.num } }, [el("span", { attrs: { "data-w": mp } })])
        ]),
        el("details", { className: "mc-details" }, [el("summary", { text: "Voir les leçons" }), lessons]),
        el("div", { className: "mc-actions" }, [el("a", { className: "btn btn-sm", text: mc.done === mc.total ? "Revoir le module" : (mc.done ? "Continuer" : "Commencer"), attrs: { href: lessonUrl(firstOpen) } })])
      ]));
    });

    // Résultats des quiz
    var scoreBlock;
    if (quizIds.length) {
      var tbody = el("tbody");
      P.allLessonIds().filter(function (id) { return s.quiz[id]; }).forEach(function (id) {
        var q = s.quiz[id];
        tbody.appendChild(el("tr", {}, [
          el("th", { attrs: { scope: "row" } }, [el("a", { text: lessonTitle(id), attrs: { href: lessonUrl(id) + "#quiz" } })]),
          el("td", { className: "mono", text: q.score + " / " + q.total }),
          el("td", { className: "mono", text: q.best + " / " + q.total }),
          el("td", { className: "mono", text: String(q.attempts) }),
          el("td", {}, [el("a", { className: "btn btn-sm btn-ghost", text: "Refaire", attrs: { href: lessonUrl(id) + "#quiz" } })])
        ]));
      });
      scoreBlock = el("section", { className: "section", attrs: { "aria-labelledby": "res-title", style: "padding-block:48px 0" } }, [
        el("h2", { text: "Mes résultats aux quiz", attrs: { id: "res-title" } }),
        el("div", { className: "compare-wrap" }, [el("table", { className: "score-table" }, [
          el("thead", {}, [el("tr", {}, ["Leçon", "Dernier score", "Meilleur score", "Tentatives", "Action"].map(function (h) { return el("th", { text: h, attrs: { scope: "col" } }); }))]),
          tbody
        ])])
      ]);
    } else {
      scoreBlock = el("section", { attrs: { style: "padding-top:48px" } }, [el("div", { className: "empty-state", text: "Vos résultats aux quiz apparaîtront ici dès votre premier questionnaire de validation." })]);
    }

    root.innerHTML = "";
    root.appendChild(el("div", { className: "page-hero" }, [el("div", { className: "container" }, [
      el("nav", { className: "breadcrumb", attrs: { "aria-label": "Fil d'Ariane" } }, [el("ol", {}, [el("li", {}, [el("a", { text: "Accueil", attrs: { href: "index.html" } })]), el("li", { text: "Espace apprenant", attrs: { "aria-current": "page" } })])]),
      el("p", { className: "eyebrow", text: "Espace apprenant" }),
      el("h1", { text: "Votre formation, à votre rythme" }),
      el("p", { className: "lead", text: "Dix modules, " + c.total + " leçons et un examen final. Reprenez là où vous vous êtes arrêté, consultez vos résultats et refaites les évaluations autant de fois que nécessaire." })
    ])]));
    var container = el("div", { className: "container", attrs: { style: "padding-block:40px 96px" } }, [
      el("div", { className: "dash page-enter" }, [panel, el("div", {}, [el("h2", { text: "Les modules" }), list])]),
      scoreBlock
    ]);
    root.appendChild(container);

    // Animation de l'anneau et des barres
    requestAnimationFrame(function () {
      setTimeout(function () {
        var fg = root.querySelector(".ring-fg");
        if (fg) fg.style.strokeDashoffset = String(circ * (1 - pct / 100));
        root.querySelectorAll(".progress span[data-w]").forEach(function (b) { b.style.width = b.getAttribute("data-w") + "%"; });
      }, 120);
    });
    if (ASG.bindCards) ASG.bindCards(root);
    window.scrollTo(0, 0);
  }

  /* ---------------------------------------------------------------- composants de leçon */
  function section(key, num, children, id) {
    return el("section", { attrs: { id: id || "sec-" + key, "aria-labelledby": "h-" + key } }, [
      el("h2", { attrs: { id: "h-" + key } }, [el("span", { className: "sec-num", text: pad2(num), attrs: { "aria-hidden": "true" } }), SECTION_TITLES[key]])
    ].concat(children));
  }

  function renderTech(items) {
    var out = [];
    (items || []).forEach(function (t) {
      if (typeof t === "string") out.push(para(t));
      else if (t && t.h) {
        out.push(el("h3", { text: t.h }));
        (t.p || []).forEach(function (p) { out.push(para(p)); });
        if (t.ul) out.push(el("ul", {}, t.ul.map(function (li) { return el("li", { html: li }); })));
      }
    });
    return out;
  }

  function renderTable(t) {
    return el("div", { className: "compare-wrap", attrs: { style: "margin:1.2rem 0" } }, [el("table", {}, [
      t.cap ? el("caption", { text: t.cap }) : null,
      el("thead", {}, [el("tr", {}, t.head.map(function (h) { return el("th", { text: h, attrs: { scope: "col" } }); }))]),
      el("tbody", {}, t.rows.map(function (r) {
        return el("tr", {}, r.map(function (c, i) { return i === 0 ? el("th", { html: c, attrs: { scope: "row" } }) : el("td", { html: c }); }));
      }))
    ])]);
  }

  function alertBox(kind, content) {
    var icon = kind === "danger" || kind === "warn" ? "warn" : (kind === "ok" ? "shield" : "info");
    return el("div", { className: "alert alert-" + kind, attrs: { role: kind === "danger" ? "alert" : "note" } }, [
      el("span", { html: ASG.icon(icon) }), el("div", { html: content })
    ]);
  }

  /* Tableau dynamique des appareils pris en charge (module 5 et module 6) */
  function renderDevices() {
    var D = ASG.devices;
    if (!D) return el("p", { text: "Tableau des appareils indisponible." });
    var wrap = el("div", { className: "device-block" });
    var search = el("input", { className: "input", attrs: { type: "search", placeholder: "Rechercher un modèle ou un nom de code (ex. akita)", "aria-label": "Rechercher un appareil" } });
    var filterSel = el("select", { className: "input", attrs: { "aria-label": "Filtrer par statut", style: "padding-left:14px;flex:0 1 260px" } }, [
      el("option", { text: "Tous les appareils listés", attrs: { value: "all" } }),
      el("option", { text: "Recommandés pour un achat", attrs: { value: "rec" } }),
      el("option", { text: "Fin du support constructeur proche ou atteinte", attrs: { value: "eol" } }),
      el("option", { text: "Plus pris en charge", attrs: { value: "unsupported" } })
    ]);
    var count = el("p", { className: "result-count", attrs: { "aria-live": "polite" } });
    var tbody = el("tbody");
    var table = el("div", { className: "compare-wrap" }, [el("table", { className: "device-table" }, [
      el("caption", { text: "Source : " + D.source + ", consultée le " + D.checked + ". Cette liste évolue : vérifiez toujours la page officielle avant d'acheter ou d'installer." }),
      el("thead", {}, [el("tr", {}, ["Appareil", "Nom de code", "Génération", "Support minimal annoncé par Google", "Statut GrapheneOS"].map(function (h) { return el("th", { text: h, attrs: { scope: "col" } }); }))]),
      tbody
    ])]);
    var now = new Date();
    function statusOf(d) {
      if (d.unsupported) return { cls: "badge-danger", txt: "Plus pris en charge (fin de vie)" };
      var end = d.endDate ? new Date(d.endDate + "-28") : null;
      if (end && end < now) return { cls: "badge-warn", txt: "Listé ; support constructeur terminé" };
      if (end && (end - now) < 1000 * 60 * 60 * 24 * 400) return { cls: "badge-warn", txt: "Pris en charge ; fin proche" };
      if (d.recommended) return { cls: "badge-ok", txt: "Pris en charge, recommandé" };
      return { cls: "badge-info", txt: "Pris en charge" };
    }
    function update() {
      var q = search.value.trim().toLowerCase();
      var f = filterSel.value;
      var rows = D.supported.concat(f === "unsupported" || q ? D.unsupported.map(function (u) { return { name: u.name, code: u.code, gen: u.gen || "", unsupported: true }; }) : []);
      tbody.innerHTML = "";
      var n = 0;
      rows.forEach(function (d) {
        var st = statusOf(d);
        if (f === "rec" && !d.recommended) return;
        if (f === "eol" && st.cls !== "badge-warn") return;
        if (f === "unsupported" && !d.unsupported) return;
        if (q && (d.name + " " + d.code).toLowerCase().indexOf(q) === -1) return;
        n++;
        tbody.appendChild(el("tr", {}, [
          el("th", { text: d.name, attrs: { scope: "row" } }),
          el("td", {}, [el("code", { text: d.code })]),
          el("td", { text: d.gen || "–" }),
          el("td", { text: d.end || "–" }),
          el("td", {}, [el("span", { className: "badge " + st.cls, text: st.txt })])
        ]));
      });
      if (!n) tbody.appendChild(el("tr", {}, [el("td", { attrs: { colspan: "5" }, text: "Aucun appareil ne correspond. Un appareil absent de la liste officielle n'est pas compatible avec GrapheneOS." })]));
      count.textContent = n + " appareil" + (n > 1 ? "s" : "") + " affiché" + (n > 1 ? "s" : "");
    }
    search.addEventListener("input", update);
    filterSel.addEventListener("change", update);
    wrap.appendChild(el("div", { className: "device-toolbar" }, [search, filterSel]));
    wrap.appendChild(count);
    wrap.appendChild(table);
    wrap.appendChild(el("p", { className: "verify-stamp" }, [
      "Vérification de la liste en vigueur : ",
      el("a", { text: "grapheneos.org/faq#supported-devices", attrs: { href: "https://grapheneos.org/faq#supported-devices", rel: "noopener", target: "_blank" } }),
      " (ouvre un nouvel onglet)"
    ]));
    update();
    return wrap;
  }

  /* ---------------------------------------------------------------- quiz */
  /**
   * Crée un questionnaire. `onDone(score, total)` est appelé à la validation.
   * Chaque question : { q, o: [options], a: index de la bonne réponse, e: explication }
   */
  function buildQuiz(questions, name, onDone, opts) {
    opts = opts || {};
    var form = el("form", { className: "quiz", attrs: { novalidate: true, "aria-describedby": name + "-help" } });
    var resultBox = el("div", { attrs: { "aria-live": "polite", tabindex: "-1" } });
    form.appendChild(resultBox);
    form.appendChild(el("p", { className: "muted", attrs: { id: name + "-help" }, text: opts.help || "Choisissez une réponse par question, puis validez pour afficher la correction détaillée." }));
    questions.forEach(function (qq, qi) {
      var fs = el("fieldset", { attrs: { "data-q": qi } });
      fs.appendChild(el("legend", {}, [el("span", { className: "q-num", text: "Q" + (qi + 1) }), qq.q]));
      // Les réponses sont mélangées à l'affichage (Fisher-Yates) : la position
      // de la bonne réponse n'est donc jamais prévisible. La valeur de chaque
      // bouton radio reste l'index d'origine, utilisé pour la correction.
      var order = qq.o.map(function (_, i) { return i; });
      for (var k = order.length - 1; k > 0; k--) {
        var r = Math.floor(Math.random() * (k + 1));
        var tmp = order[k]; order[k] = order[r]; order[r] = tmp;
      }
      order.forEach(function (oi) {
        var opt = qq.o[oi];
        var id = name + "-q" + qi + "-o" + oi;
        fs.appendChild(el("label", { className: "q-opt", attrs: { for: id, "data-oi": oi } }, [
          el("input", { attrs: { type: "radio", name: name + "-q" + qi, id: id, value: String(oi) } }),
          el("span", { text: opt })
        ]));
      });
      fs.appendChild(el("div", { className: "q-expl", attrs: { hidden: true } }));
      form.appendChild(fs);
    });
    var submit = el("button", { className: "btn btn-primary", text: "Valider mes réponses", attrs: { type: "submit" } });
    var retry = el("button", { className: "btn btn-ghost", text: "Refaire le questionnaire", attrs: { type: "button", hidden: true } });
    form.appendChild(el("div", { className: "quiz-actions" }, [submit, retry]));

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var unanswered = [];
      questions.forEach(function (qq, qi) { if (!form.querySelector('input[name="' + name + "-q" + qi + '"]:checked')) unanswered.push(qi + 1); });
      if (unanswered.length && !window.confirm("Vous n'avez pas répondu à " + unanswered.length + " question(s). Valider quand même ?")) return;
      var score = 0;
      questions.forEach(function (qq, qi) {
        var fs = form.querySelector('[data-q="' + qi + '"]');
        var checked = fs.querySelector("input:checked");
        var chosen = checked ? Number(checked.value) : -1;
        if (chosen === qq.a) score++;
        fs.querySelectorAll(".q-opt").forEach(function (lab) {
          var oi = Number(lab.getAttribute("data-oi"));
          lab.classList.toggle("is-correct", oi === qq.a);
          lab.classList.toggle("is-wrong", oi === chosen && chosen !== qq.a);
          lab.querySelector("input").disabled = true;
        });
        var ex = fs.querySelector(".q-expl");
        ex.hidden = false;
        ex.innerHTML = "";
        ex.appendChild(el("strong", { text: chosen === qq.a ? "Bonne réponse. " : (chosen === -1 ? "Sans réponse. " : "Réponse incorrecte. ") }));
        ex.appendChild(document.createTextNode("Réponse attendue : « " + qq.o[qq.a] + " ». " + (qq.e || "")));
      });
      var ratio = score / questions.length;
      resultBox.className = "quiz-result " + (ratio >= 0.7 ? "good" : "mid");
      resultBox.textContent = "Résultat : " + score + " / " + questions.length + " (" + Math.round(ratio * 100) + " %). " +
        (ratio >= 0.7 ? "Objectif atteint. Relisez les explications pour consolider vos acquis." : "Relisez la leçon, en particulier les points corrigés ci-dessous, puis refaites le questionnaire.");
      submit.hidden = true; retry.hidden = false;
      resultBox.focus();
      onDone(score, questions.length);
    });
    retry.addEventListener("click", function () {
      form.reset();
      form.querySelectorAll(".q-opt").forEach(function (l) { l.classList.remove("is-correct", "is-wrong"); l.querySelector("input").disabled = false; });
      form.querySelectorAll(".q-expl").forEach(function (x) { x.hidden = true; });
      resultBox.className = ""; resultBox.textContent = "";
      submit.hidden = false; retry.hidden = true;
      var first = form.querySelector("input"); if (first) first.focus();
    });
    return form;
  }

  /* ---------------------------------------------------------------- navigation latérale */
  function renderAside(current) {
    var s = P.get();
    var body = el("div", { className: "aside-body", attrs: { id: "aside-body" } });
    ASG.catalog.forEach(function (m) {
      var open = m.id === current.mod.id;
      var mc = P.moduleCounts(m.id);
      var ol = el("ol", { attrs: { id: "aside-" + m.id, hidden: !open } });
      m.lessons.forEach(function (l, i) {
        var id = m.id + "-l" + (i + 1);
        ol.appendChild(el("li", {}, [el("a", { text: l.t, className: s.done[id] ? "is-done" : "", attrs: { href: lessonUrl(id), "aria-current": id === current.id ? "page" : false } })]));
      });
      var btn = el("button", { attrs: { type: "button", "aria-expanded": open ? "true" : "false", "aria-controls": "aside-" + m.id } }, [
        el("span", { text: m.num + ". " + m.title }), el("span", { className: "mono", text: mc.done + "/" + mc.total })
      ]);
      btn.addEventListener("click", function () {
        var ex = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", ex ? "false" : "true");
        ol.hidden = ex;
      });
      body.appendChild(el("div", { className: "aside-module" }, [btn, ol]));
    });
    body.appendChild(el("div", { className: "aside-module" }, [el("a", { className: "btn btn-sm btn-ghost", text: "Examen final", attrs: { href: "formation.html?examen=final", style: "width:100%;margin-top:10px" } })]));
    var toggle = el("button", { className: "btn btn-sm aside-toggle", text: "Sommaire de la formation", attrs: { type: "button", "aria-expanded": "false", "aria-controls": "aside-body" } });
    var mq = window.matchMedia("(max-width: 960px)");
    if (mq.matches) body.hidden = true;
    toggle.addEventListener("click", function () {
      var ex = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", ex ? "false" : "true");
      body.hidden = ex;
    });
    var pct = P.percent();
    return el("nav", { className: "lesson-aside", attrs: { "aria-label": "Sommaire de la formation" } }, [
      el("h2", { text: "Sommaire" }),
      el("div", { className: "mc-progress-label" }, [el("span", { text: "Progression globale" }), el("span", { text: pct + " %" })]),
      el("div", { className: "progress", attrs: { role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(pct), "aria-label": "Progression globale", style: "margin-bottom:14px" } }, [el("span", { attrs: { style: "width:" + pct + "%" } })]),
      toggle, body
    ]);
  }

  /* ---------------------------------------------------------------- leçon */
  function renderLesson(ref) {
    var mod = ref.mod, idx = ref.idx, id = ref.id;
    var meta = mod.lessons[idx];
    setTitle(meta.t);
    root.innerHTML = "";
    root.appendChild(el("div", { className: "container" }, [el("p", { className: "muted", attrs: { style: "padding:40px 0" }, text: "Chargement de la leçon…" })]));

    loadModule(mod).then(function (content) {
      var L = content[idx];
      if (!L) throw new Error("Contenu manquant");
      P.setLast(id);
      var n = 0;
      var art = el("article", { className: "lesson lesson-content page-enter", attrs: { "aria-labelledby": "lesson-title" } });

      art.appendChild(el("header", { className: "lesson-head" }, [
        el("nav", { className: "breadcrumb", attrs: { "aria-label": "Fil d'Ariane" } }, [el("ol", {}, [
          el("li", {}, [el("a", { text: "Espace apprenant", attrs: { href: "formation.html" } })]),
          el("li", {}, [el("a", { text: "Module " + mod.num, attrs: { href: "modules.html#" + mod.id } })]),
          el("li", { text: "Leçon " + (idx + 1), attrs: { "aria-current": "page" } })
        ])]),
        el("p", { className: "eyebrow", text: "Module " + mod.num + " · " + mod.title }),
        el("h1", { text: meta.t, attrs: { id: "lesson-title" } }),
        el("div", { className: "meta" }, [
          el("span", { className: "badge", text: "Leçon " + (idx + 1) + " / " + mod.lessons.length }),
          el("span", { className: "badge", text: ASG.levels[meta.lvl] }),
          el("span", { className: "badge" + (P.isDone(id) ? " badge-ok" : ""), text: P.isDone(id) ? "Terminée" : "En cours", attrs: { "data-status": "" } })
        ])
      ]));

      art.appendChild(section("obj", ++n, [el("div", { className: "objective" }, [el("b", { text: "À l'issue de cette leçon" }), el("p", { html: L.obj, attrs: { style: "margin:0" } })])]));
      art.appendChild(section("intro", ++n, [].concat(L.intro).map(para)));
      if (L.warn) art.appendChild(alertBox("danger", L.warn));
      var techChildren = renderTech(L.tech);
      if (L.table) techChildren.push(renderTable(L.table));
      if (L.extra === "devices") techChildren.push(renderDevices());
      art.appendChild(section("tech", ++n, techChildren));
      if (L.fig) {
        art.appendChild(section("fig", ++n, [el("figure", { className: "figure" }, [
          el("img", { attrs: { src: "assets/illustrations/" + L.fig + ".svg", alt: L.figAlt || FIGURES[L.fig] || "", loading: "lazy", width: "800", height: "440", decoding: "async" } }),
          el("figcaption", { text: L.figCap || FIGURES[L.fig] || "" })
        ])]));
      }
      if (L.steps && L.steps.length) {
        var stepKids = [];
        if (L.stepsIntro) stepKids.push(para(L.stepsIntro));
        stepKids.push(el("ol", { className: "steps" }, L.steps.map(function (s) { return el("li", { html: s }); })));
        if (L.result) stepKids.push(el("div", { className: "result-box" }, [el("b", { text: "Résultat attendu : " }), el("span", { html: L.result })]));
        if (L.caution) stepKids.push(alertBox("warn", L.caution));
        art.appendChild(section("steps", ++n, stepKids));
      }
      if (L.ex && L.ex.length) art.appendChild(section("ex", ++n, [el("ul", { className: "examples" }, L.ex.map(function (s) { return el("li", { html: s }); }))]));
      if (L.err && L.err.length) {
        art.appendChild(section("err", ++n, [el("div", { className: "compare-wrap" }, [el("table", { className: "err-table" }, [
          el("thead", {}, [el("tr", {}, [el("th", { text: "Erreur ou problème", attrs: { scope: "col" } }), el("th", { text: "Solution", attrs: { scope: "col" } })])]),
          el("tbody", {}, L.err.map(function (r) { return el("tr", {}, [el("td", { html: r[0] }), el("td", { html: r[1] })]); }))
        ])])]));
      }
      if (L.reco && L.reco.length) art.appendChild(section("reco", ++n, [el("ul", { className: "reco" }, L.reco.map(function (s) { return el("li", { html: s }); }))]));
      art.appendChild(section("sum", ++n, [el("div", { className: "summary-box", html: L.sum })]));
      if (L.quiz && L.quiz.length) {
        art.appendChild(section("quiz", ++n, [buildQuiz(L.quiz, "quiz-" + id, function (score, total) {
          P.saveQuiz(id, score, total);
          if (score / total >= 0.7 && !P.isDone(id)) ASG.toast("Quiz réussi. Pensez à marquer la leçon comme terminée.");
        })], "quiz"));
      }

      // Marquer comme terminée
      var doneBtn = el("button", { className: "btn " + (P.isDone(id) ? "btn-ok" : "btn-primary"), attrs: { type: "button", "aria-pressed": P.isDone(id) ? "true" : "false" } });
      function syncDone() {
        var d = P.isDone(id);
        doneBtn.textContent = d ? "Leçon terminée ✓ (annuler)" : "Marquer la leçon comme terminée";
        doneBtn.className = "btn " + (d ? "btn-ok" : "btn-primary");
        doneBtn.setAttribute("aria-pressed", d ? "true" : "false");
        var st = art.querySelector("[data-status]");
        if (st) { st.textContent = d ? "Terminée" : "En cours"; st.className = "badge" + (d ? " badge-ok" : ""); }
      }
      doneBtn.addEventListener("click", function () {
        P.setDone(id, !P.isDone(id));
        syncDone();
        ASG.toast(P.isDone(id) ? "Leçon enregistrée comme terminée. Progression : " + P.percent() + " %" : "Leçon marquée comme non terminée.");
        var a = root.querySelector('.lesson-aside a[aria-current="page"]'); if (a) a.classList.toggle("is-done", P.isDone(id));
      });
      syncDone();
      art.appendChild(el("div", { className: "lesson-complete" }, [
        el("div", {}, [el("strong", { text: "Avez-vous terminé cette leçon ?" }), el("p", { className: "muted", attrs: { style: "margin:0" }, text: "Votre progression est enregistrée dans ce navigateur." })]),
        doneBtn
      ]));

      // Précédent / Suivant (y compris entre modules)
      var ids = P.allLessonIds(), pos = ids.indexOf(id);
      var nav = el("nav", { className: "lesson-nav", attrs: { "aria-label": "Navigation entre les leçons" } });
      if (pos > 0) nav.appendChild(el("a", { className: "prev", attrs: { href: lessonUrl(ids[pos - 1]), rel: "prev" } }, [el("small", { text: "← Précédent" }), lessonTitle(ids[pos - 1])]));
      if (pos < ids.length - 1) nav.appendChild(el("a", { className: "next", attrs: { href: lessonUrl(ids[pos + 1]), rel: "next" } }, [el("small", { text: "Suivant →" }), lessonTitle(ids[pos + 1])]));
      else nav.appendChild(el("a", { className: "next", attrs: { href: "formation.html?examen=final" } }, [el("small", { text: "Étape finale →" }), "Examen final de 50 questions"]));
      art.appendChild(nav);

      root.innerHTML = "";
      root.appendChild(el("div", { className: "container" }, [el("div", { className: "lesson-layout" }, [renderAside(ref), art])]));
      if (location.hash) {
        var target = document.getElementById(location.hash.slice(1));
        if (target) setTimeout(function () { target.scrollIntoView(); }, 50);
      } else window.scrollTo(0, 0);
      var h1 = document.getElementById("lesson-title"); if (h1) { h1.setAttribute("tabindex", "-1"); }
    }).catch(function (err) {
      root.innerHTML = "";
      root.appendChild(el("div", { className: "container", attrs: { style: "padding:60px 0" } }, [alertBox("danger", "Impossible de charger cette leçon. Vérifiez que le dossier <code>js/data</code> est présent, puis rechargez la page. (" + ASG.escapeHTML(err.message) + ")")]));
    });
  }

  /* ---------------------------------------------------------------- examen final */
  function renderExam() {
    setTitle("Examen final");
    root.innerHTML = "";
    loadScript("js/data/exam.js").then(function () {
      var Q = ASG.exam || [];
      var s = P.get();
      var counter = el("span", { className: "mono", text: "0 / " + Q.length + " réponses" });
      var bar = el("div", { className: "progress" }, [el("span")]);
      var form = buildQuiz(Q, "exam", function (score, total) {
        P.saveExam(score, total);
        ASG.toast("Examen enregistré : " + score + " / " + total);
      }, { help: "50 questions couvrant les dix modules. Chaque réponse est suivie d'une correction détaillée. Seuil de réussite conseillé : 35 / 50 (70 %)." });
      form.addEventListener("change", function () {
        var n = form.querySelectorAll("input:checked").length;
        counter.textContent = n + " / " + Q.length + " réponses";
        bar.firstChild.style.width = Math.round(n / Q.length * 100) + "%";
      });
      root.appendChild(el("div", { className: "page-hero" }, [el("div", { className: "container container-narrow" }, [
        el("nav", { className: "breadcrumb", attrs: { "aria-label": "Fil d'Ariane" } }, [el("ol", {}, [el("li", {}, [el("a", { text: "Espace apprenant", attrs: { href: "formation.html" } })]), el("li", { text: "Examen final", attrs: { "aria-current": "page" } })])]),
        el("p", { className: "eyebrow", text: "Module 10 · Évaluation" }),
        el("h1", { text: "Examen final" }),
        el("p", { className: "lead", text: "Cinquante questions pour valider l'ensemble de vos connaissances, du fonctionnement d'Android jusqu'à la configuration avancée de GrapheneOS." }),
        s.exam ? el("p", { className: "badge badge-info", text: "Meilleur score : " + s.exam.best + " / " + s.exam.total + " · " + s.exam.attempts + " tentative(s)" }) : null
      ])]));
      root.appendChild(el("div", { className: "container container-narrow", attrs: { style: "padding-bottom:96px" } }, [
        el("div", { className: "exam-progress" }, [el("div", { className: "mc-progress-label" }, [el("span", { text: "Avancement" }), counter]), bar]),
        form,
        el("nav", { className: "lesson-nav", attrs: { "aria-label": "Navigation" } }, [
          el("a", { className: "prev", attrs: { href: lessonUrl("m10-l8") } }, [el("small", { text: "← Précédent" }), "Cas 8 : un compte Google compromis"]),
          el("a", { className: "next", attrs: { href: "formation.html" } }, [el("small", { text: "Retour →" }), "Espace apprenant"])
        ])
      ]));
      window.scrollTo(0, 0);
    }).catch(function () {
      root.appendChild(el("div", { className: "container", attrs: { style: "padding:60px 0" } }, [alertBox("danger", "Impossible de charger l'examen.")]));
    });
  }

  /* ---------------------------------------------------------------- démarrage */
  function init() {
    el = ASG.el; P = ASG.Progress;
    root = document.getElementById("app");
    if (!root) return;
    var p = params();
    if (p.examen) return renderExam();
    if (p.module) {
      var m = moduleById(p.module);
      if (m) return renderLesson({ mod: m, idx: 0, id: m.id + "-l1" });
    }
    if (p.lecon) {
      var ref = parseLessonId(p.lecon);
      if (ref) return renderLesson(ref);
    }
    renderDashboard();
  }

  ASG.renderDevices = function () { return renderDevices(); };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
