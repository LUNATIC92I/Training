/* ==========================================================================
   countdown.js : compte à rebours jusqu'à la fin de la période de gratuité.
   Échéance : 31 décembre 2026 à 23h59, heure d'Abidjan.
   Abidjan (Côte d'Ivoire) applique GMT toute l'année, sans heure d'été :
   l'échéance correspond donc à 2026-12-31T23:59:00Z, quel que soit le
   fuseau horaire du visiteur.
   Utilisation : <div data-countdown></div>
   ========================================================================== */
(function () {
  "use strict";

  var DEADLINE = Date.UTC(2026, 11, 31, 23, 59, 0); // mois indexés à partir de 0
  var ENDED_MSG = "La période de gratuité de cette formation est officiellement terminée.";
  var ENDED_NOTE = "Les conditions d'accès gratuit sont susceptibles d'évoluer. Les contenus restent consultables tant qu'ils sont publiés sur ce site.";
  var UNITS = [
    { key: "d", label: "Jours" },
    { key: "h", label: "Heures" },
    { key: "m", label: "Minutes" },
    { key: "s", label: "Secondes" }
  ];

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function split(ms) {
    var total = Math.max(0, Math.floor(ms / 1000));
    return {
      d: Math.floor(total / 86400),
      h: Math.floor((total % 86400) / 3600),
      m: Math.floor((total % 3600) / 60),
      s: total % 60
    };
  }

  function renderEnded(root) {
    root.innerHTML = "";
    var box = document.createElement("div");
    box.className = "countdown-ended";
    box.setAttribute("role", "status");
    var p = document.createElement("p");
    p.style.fontWeight = "700";
    p.textContent = ENDED_MSG;
    var n = document.createElement("p");
    n.className = "muted";
    n.style.margin = "0";
    n.textContent = ENDED_NOTE;
    box.appendChild(p); box.appendChild(n);
    root.appendChild(box);
  }

  function build(root) {
    root.classList.add("countdown");
    root.setAttribute("role", "timer");
    root.setAttribute("aria-label", "Temps restant avant la fin de la gratuité, le 31 décembre 2026 à 23h59, heure d'Abidjan");
    var refs = {};
    UNITS.forEach(function (u) {
      var cell = document.createElement("div");
      cell.className = "cd-unit";
      var v = document.createElement("span");
      v.className = "cd-value";
      v.textContent = "--";
      v.setAttribute("aria-hidden", "true");
      var l = document.createElement("span");
      l.className = "cd-label";
      l.textContent = u.label;
      cell.appendChild(v); cell.appendChild(l);
      root.appendChild(cell);
      refs[u.key] = v;
    });
    // Texte lisible par les lecteurs d'écran, mis à jour chaque minute seulement
    var sr = document.createElement("span");
    sr.className = "visually-hidden";
    root.appendChild(sr);
    refs.sr = sr;
    return refs;
  }

  function start(root) {
    if (Date.now() >= DEADLINE) { renderEnded(root); return; }
    var refs = build(root);
    var lastMinute = -1;
    var timer;

    function update() {
      var left = DEADLINE - Date.now();
      if (left <= 0) { clearInterval(timer); root.classList.remove("countdown"); renderEnded(root); return; }
      var t = split(left);
      UNITS.forEach(function (u) {
        var txt = u.key === "d" ? String(t.d) : pad(t[u.key]);
        var el = refs[u.key];
        if (el.textContent !== txt) {
          el.textContent = txt;
          el.classList.remove("tick");
          void el.offsetWidth; // relance l'animation
          el.classList.add("tick");
        }
      });
      if (t.m !== lastMinute) {
        lastMinute = t.m;
        refs.sr.textContent = "Il reste " + t.d + " jours, " + t.h + " heures et " + t.m + " minutes.";
      }
    }
    update();
    timer = setInterval(update, 1000);
  }

  function init() {
    var nodes = document.querySelectorAll("[data-countdown]");
    for (var i = 0; i < nodes.length; i++) start(nodes[i]);
  }

  window.ASG = window.ASG || {};
  window.ASG.countdown = { deadline: DEADLINE, isOver: function () { return Date.now() >= DEADLINE; } };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
