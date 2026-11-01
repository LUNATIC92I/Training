/* ==========================================================================
   interactions.js : interactions de l'accueil et du catalogue
   - terminal technique animé (accueil)
   - démonstrations animées des mécanismes de sécurité (accueil)
   - cartes interactives (effet de lueur suivant le pointeur)
   - programme de formation (accueil) et catalogue avec recherche/filtres
   ========================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------ cartes */
  ASG.bindCards = function (root) {
    if (reduced || !window.matchMedia("(hover: hover)").matches) return;
    (root || document).querySelectorAll(".card-interactive").forEach(function (card) {
      if (card._bound) return; card._bound = true;
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  };

  /* ------------------------------------------------------------ terminal */
  /* Les commandes affichées sont de vraies commandes ADB documentées par
     Android ; les sorties sont un exemple illustratif (simulation). */
  var SCRIPT = [
    { c: "adb devices", o: [["t-out", "List of devices attached"], ["t-out", "3A1B2C3D4E5F    device"]] },
    { c: "adb shell getprop ro.build.version.release", o: [["t-out", "16"]] },
    { c: "adb shell getprop ro.build.version.security_patch", o: [["t-out", "2026-10-05"], ["t-ok", "✓ correctif de sécurité récent"]] },
    { c: "adb shell getprop ro.boot.verifiedbootstate", o: [["t-out", "green"], ["t-ok", "✓ démarrage vérifié, bootloader verrouillé"]] },
    { c: "adb shell getenforce", o: [["t-out", "Enforcing"], ["t-ok", "✓ SELinux en mode strict"]] },
    { c: "adb shell pm list packages -3 | wc -l", o: [["t-out", "27"], ["t-warn", "! 27 applications tierces à passer en revue"]] },
    { c: "# audit terminé : 1 point d'attention", o: [] }
  ];

  function runTerminal(body) {
    var caret = document.createElement("span");
    caret.className = "terminal-caret";
    caret.setAttribute("aria-hidden", "true");

    function line(cls, txt) {
      var s = document.createElement("span");
      s.className = cls; s.textContent = txt;
      body.insertBefore(s, caret);
      body.insertBefore(document.createTextNode("\n"), caret);
      return s;
    }
    if (reduced) {
      SCRIPT.forEach(function (st) {
        var p = document.createElement("span"); p.className = "t-prompt"; p.textContent = "$ "; body.appendChild(p);
        var c = document.createElement("span"); c.className = st.c[0] === "#" ? "t-note" : "t-cmd"; c.textContent = st.c; body.appendChild(c);
        body.appendChild(document.createTextNode("\n"));
        st.o.forEach(function (o) { var s = document.createElement("span"); s.className = o[0]; s.textContent = o[1]; body.appendChild(s); body.appendChild(document.createTextNode("\n")); });
      });
      return;
    }
    body.appendChild(caret);
    var i = 0;
    function nextCommand() {
      if (i >= SCRIPT.length) { setTimeout(function () { body.innerHTML = ""; i = 0; body.appendChild(caret); nextCommand(); }, 6000); return; }
      var st = SCRIPT[i++];
      var p = document.createElement("span"); p.className = "t-prompt"; p.textContent = "$ ";
      body.insertBefore(p, caret);
      var c = document.createElement("span"); c.className = st.c[0] === "#" ? "t-note" : "t-cmd";
      body.insertBefore(c, caret);
      var k = 0;
      (function type() {
        if (k < st.c.length) { c.textContent += st.c[k++]; setTimeout(type, 22 + Math.random() * 40); return; }
        body.insertBefore(document.createTextNode("\n"), caret);
        var j = 0;
        (function out() {
          if (j < st.o.length) { line(st.o[j][0], st.o[j][1]); j++; setTimeout(out, 180); return; }
          setTimeout(nextCommand, 650);
        })();
      })();
    }
    // Ne démarre que lorsque le terminal est visible (économie de ressources)
    if ("IntersectionObserver" in window) {
      var started = false;
      new IntersectionObserver(function (en, obs) { if (en[0].isIntersecting && !started) { started = true; obs.disconnect(); setTimeout(nextCommand, 700); } }).observe(body);
    } else nextCommand();
  }

  /* ------------------------------------------------------------ démonstrations */
  function initDemos(root) {
    var tabs = root.querySelectorAll('[role="tab"]');
    var panels = root.querySelectorAll('[role="tabpanel"]');
    function select(tab) {
      tabs.forEach(function (t) { var on = t === tab; t.setAttribute("aria-selected", on ? "true" : "false"); t.tabIndex = on ? 0 : -1; });
      panels.forEach(function (p) { p.hidden = p.id !== tab.getAttribute("aria-controls"); });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = null;
        if (k === "ArrowDown" || k === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (k === "ArrowUp" || k === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (k === "Home") n = tabs[0];
        if (k === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n); n.focus(); }
      });
    });

    /* 1. Bac à sable */
    var sb = root.querySelector("#demo-sandbox");
    if (sb) {
      var log = sb.querySelector(".demo-log");
      var game = sb.querySelector('[data-app="jeu"]'), bank = sb.querySelector('[data-app="banque"]');
      function reset() { [game, bank].forEach(function (a) { a.classList.remove("is-blocked", "is-allowed"); }); }
      sb.querySelector('[data-action="attack"]').addEventListener("click", function () {
        reset(); void bank.offsetWidth;
        bank.classList.add("is-blocked");
        log.textContent = "Le jeu (UID u0_a203) tente de lire /data/data/banque/… → refusé par le noyau : chaque application ne peut lire que son propre répertoire. SELinux journalise : avc: denied { read }.";
      });
      sb.querySelector('[data-action="binder"]').addEventListener("click", function () {
        reset(); void bank.offsetWidth;
        game.classList.add("is-allowed");
        log.textContent = "Le jeu demande la position via Binder → le système vérifie la permission ACCESS_FINE_LOCATION, que l'utilisateur a refusée → aucune donnée transmise.";
      });
    }

    /* 2. Démarrage vérifié */
    var vb = root.querySelector("#demo-boot");
    if (vb) {
      var links = vb.querySelectorAll(".boot-link");
      var state = vb.querySelector(".boot-state");
      var vlog = vb.querySelector(".demo-log");
      var timer;
      function boot(tamper) {
        clearTimeout(timer);
        links.forEach(function (l) { l.classList.remove("ok", "bad"); });
        state.textContent = "Démarrage…"; state.style.color = "";
        var i = 0;
        (function step() {
          if (i >= links.length) { state.textContent = "État : VERT · système d'origine vérifié"; state.style.color = "var(--ok)"; vlog.textContent = "Chaque étage a vérifié la signature du suivant. Le système démarre en lecture seule vérifiée (dm-verity)."; return; }
          var l = links[i];
          if (tamper && i === 3) {
            l.classList.add("bad");
            state.textContent = "État : ROUGE · vérification échouée"; state.style.color = "var(--danger)";
            vlog.textContent = "Le hash de la partition boot ne correspond pas à celui signé dans vbmeta : l'appareil refuse de démarrer ce code ou affiche un avertissement bloquant.";
            return;
          }
          l.classList.add("ok"); i++;
          timer = setTimeout(step, reduced ? 0 : 520);
        })();
      }
      vb.querySelector('[data-action="boot"]').addEventListener("click", function () { boot(false); });
      vb.querySelector('[data-action="tamper"]').addEventListener("click", function () { boot(true); });
    }

    /* 3. Permissions à l'exécution */
    var pm = root.querySelector("#demo-perm");
    if (pm) {
      var screen = pm.querySelector(".perm-screen");
      var plog = pm.querySelector(".demo-log");
      var requests = [
        { app: "Lampe torche", perm: "votre position précise", verdict: "Une lampe torche n'a aucune raison d'accéder à la position. Refusez : c'est un signal d'alerte classique." },
        { app: "Navigation GPS", perm: "votre position précise", verdict: "Justifié pour le guidage. Choisissez « Pendant l'utilisation de l'application », jamais « Toujours »." },
        { app: "Calculatrice", perm: "vos contacts", verdict: "Aucune justification fonctionnelle. Refusez et envisagez de désinstaller l'application." },
        { app: "Visioconférence", perm: "le micro", verdict: "Justifié pendant un appel. « Seulement cette fois » limite l'accès à la session en cours." }
      ];
      var idx = 0;
      function show() {
        var r = requests[idx % requests.length];
        screen.innerHTML = "";
        var d = ASG.el("div", { className: "perm-dialog" }, [
          ASG.el("p", {}, ["Autoriser ", ASG.el("b", { text: r.app }), " à accéder à " + r.perm + " ?"])
        ]);
        ["Pendant l'utilisation de l'appli", "Seulement cette fois", "Ne pas autoriser"].forEach(function (lab) {
          d.appendChild(ASG.el("button", { className: "perm-opt", text: lab, attrs: { type: "button" }, on: { click: function () { plog.textContent = "Choix : « " + lab + " ». Analyse : " + r.verdict; } } }));
        });
        screen.appendChild(d);
        plog.textContent = "Évaluez la demande : la permission est-elle nécessaire à la fonction principale de l'application ?";
      }
      pm.querySelector('[data-action="next"]').addEventListener("click", function () { idx++; show(); });
      show();
    }
  }

  /* ------------------------------------------------------------ programme (accueil) */
  function renderProgram(list) {
    var el = ASG.el;
    ASG.catalog.forEach(function (m) {
      list.appendChild(el("li", {}, [el("a", { attrs: { href: "formation.html?module=" + m.id } }, [
        el("span", { className: "pl-num", text: "M" + (m.num < 10 ? "0" : "") + m.num }),
        el("span", { className: "pl-title" }, [m.title, el("small", { text: m.lessons.length + " leçons · " + ASG.levels[m.level] + " · " + m.duration })]),
        el("span", { className: "badge", html: "Ouvrir " + ASG.icon("arrow") })
      ])]));
    });
  }

  /* ------------------------------------------------------------ catalogue (modules.html) */
  function normalize(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }

  function initCatalog(root) {
    var el = ASG.el, P = ASG.Progress;
    var input = document.getElementById("module-search");
    var count = document.getElementById("result-count");
    var filterBtns = document.querySelectorAll("[data-level]");
    var level = "all";

    function highlight(text, q) {
      if (!q) return document.createTextNode(text);
      var n = normalize(text), i = n.indexOf(q);
      if (i === -1) return document.createTextNode(text);
      var frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode(text.slice(0, i)));
      frag.appendChild(el("mark", { text: text.slice(i, i + q.length) }));
      frag.appendChild(document.createTextNode(text.slice(i + q.length)));
      return frag;
    }

    function render() {
      var q = normalize(input.value.trim());
      var s = P.get();
      root.innerHTML = "";
      var shownModules = 0, shownLessons = 0;
      ASG.catalog.forEach(function (m) {
        var modText = normalize(m.title + " " + m.desc + " " + m.keywords);
        var modMatch = !q || modText.indexOf(q) !== -1;
        var lessons = m.lessons.map(function (l, i) { return { l: l, i: i, match: !q || normalize(l.t).indexOf(q) !== -1 }; });
        // Filtre par niveau : on garde les leçons du niveau choisi
        lessons = lessons.filter(function (x) { return level === "all" || x.l.lvl === level; });
        var matching = lessons.filter(function (x) { return x.match; });
        if (!lessons.length) return;
        if (!modMatch && !matching.length) return;
        var visible = modMatch && !matching.length ? lessons : (q ? matching : lessons);
        shownModules++; shownLessons += visible.length;
        var mc = P.moduleCounts(m.id);
        var pct = mc.total ? Math.round(mc.done / mc.total * 100) : 0;
        var ul = el("ol", { className: "lesson-list" });
        visible.forEach(function (x) {
          var id = m.id + "-l" + (x.i + 1);
          ul.appendChild(el("li", { className: s.done[id] ? "is-done" : "" }, [el("a", { attrs: { href: "formation.html?lecon=" + id } }, [
            el("span", { className: "ll-check", html: s.done[id] ? ASG.icon("check") : "" }),
            el("span", {}, [highlight(x.l.t, q)]),
            el("span", { className: "badge", text: ASG.levels[x.l.lvl] })
          ])]));
        });
        var det = el("details", { className: "mc-details", attrs: { open: !!q || level !== "all" } }, [
          el("summary", { text: (q || level !== "all" ? visible.length + " leçon(s) correspondante(s)" : "Les " + m.lessons.length + " leçons") }), ul
        ]);
        root.appendChild(el("article", { className: "card module-card card-interactive", attrs: { id: m.id, "aria-labelledby": m.id + "-t" } }, [
          el("header", {}, [
            el("span", { className: "mc-num", text: (m.num < 10 ? "0" : "") + m.num, attrs: { "aria-hidden": "true" } }),
            el("div", { className: "mc-meta" }, [el("span", { className: "badge", text: ASG.levels[m.level] }), el("span", { className: "badge", text: m.lessons.length + " leçons" }), el("span", { className: "badge", text: m.duration })])
          ]),
          el("h3", { attrs: { id: m.id + "-t" } }, [highlight("Module " + m.num + " : " + m.title, q)]),
          el("p", { text: m.desc }),
          m.id === "m5" ? el("p", { className: "badge badge-warn", text: "Obligatoire avant toute installation" }) : null,
          det,
          el("div", { className: "mc-progress" }, [
            el("div", { className: "mc-progress-label" }, [el("span", { text: "Progression" }), el("span", { text: mc.done + "/" + mc.total + " · " + pct + " %" })]),
            el("div", { className: "progress" + (pct === 100 ? " is-complete" : ""), attrs: { role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(pct), "aria-label": "Progression du module " + m.num } }, [el("span", { attrs: { style: "width:" + pct + "%" } })])
          ]),
          el("div", { className: "mc-actions" }, [
            el("a", { className: "btn btn-primary btn-sm", text: mc.done ? "Continuer le module" : "Commencer le module", attrs: { href: "formation.html?module=" + m.id } })
          ])
        ]));
      });
      if (!shownModules) root.appendChild(el("div", { className: "empty-state", text: "Aucun module ni aucune leçon ne correspond à votre recherche. Essayez un autre mot-clé, par exemple « permissions », « bootloader » ou « VPN »." }));
      count.textContent = shownModules + " module(s) · " + shownLessons + " leçon(s) affichée(s)";
      ASG.bindCards(root);
    }

    var t;
    input.addEventListener("input", function () { clearTimeout(t); t = setTimeout(render, 120); });
    filterBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        level = b.getAttribute("data-level");
        filterBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        render();
      });
    });
    // Pré-remplissage depuis l'URL : modules.html?q=vpn
    var m = /[?&]q=([^&]+)/.exec(location.search);
    if (m) input.value = decodeURIComponent(m[1].replace(/\+/g, " "));
    render();
    if (location.hash) { var tgt = document.getElementById(location.hash.slice(1)); if (tgt) tgt.scrollIntoView(); }
  }

  function init() {
    var term = document.querySelector("[data-terminal]");
    if (term) runTerminal(term);
    var demos = document.querySelector("[data-demos]");
    if (demos) initDemos(demos);
    var program = document.querySelector("[data-program]");
    if (program && ASG.catalog) renderProgram(program);
    var catalog = document.getElementById("catalog");
    if (catalog && ASG.catalog) initCatalog(catalog);
    ASG.bindCards(document);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
