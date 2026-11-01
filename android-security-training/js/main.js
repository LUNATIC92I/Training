/* ==========================================================================
   main.js : comportements communs à toutes les pages
   (thème, révélation au défilement, notifications, utilitaires DOM).
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  window.ASG = window.ASG || {};

  /* ---------- Utilitaires DOM sûrs (pas d'injection de HTML externe) ---------- */
  /**
   * Crée un élément. `props` accepte : className, text, html (réservé aux
   * contenus pédagogiques internes au site), attrs (objet), on (événements).
   */
  function el(tag, props, children) {
    var node = document.createElement(tag);
    props = props || {};
    if (props.className) node.className = props.className;
    if (props.text != null) node.textContent = props.text;
    if (props.html != null) node.innerHTML = props.html;
    if (props.attrs) Object.keys(props.attrs).forEach(function (k) {
      if (props.attrs[k] !== false && props.attrs[k] != null) node.setAttribute(k, props.attrs[k] === true ? "" : props.attrs[k]);
    });
    if (props.on) Object.keys(props.on).forEach(function (k) { node.addEventListener(k, props.on[k]); });
    (children || []).forEach(function (c) { if (c != null) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  ASG.el = el;
  ASG.escapeHTML = escapeHTML;

  /* Petit jeu d'icônes SVG (traits simples, cohérents avec la charte) */
  ASG.icon = function (name) {
    var p = {
      check: '<path d="M4 12.5l5 5L20 6.5"/>',
      arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
      warn: '<path d="M12 3l9.5 17h-19L12 3z"/><path d="M12 10v4.5M12 17.5v.5"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
      shield: '<path d="M12 3l8 3v6c0 4.6-3.3 8.4-8 9-4.7-.6-8-4.4-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
      ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'
    }[name] || "";
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + p + "</svg>";
  };

  /* ---------- Notification flottante ---------- */
  var toastEl, toastTimer;
  ASG.toast = function (msg) {
    if (!toastEl) {
      toastEl = el("div", { className: "toast", attrs: { role: "status", "aria-live": "polite" } });
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 2800);
  };

  /* ---------- Thème sombre / clair (préférence mémorisée) ---------- */
  var THEME_KEY = "asg-theme";
  function applyTheme(t) {
    if (t === "light") document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", t === "light" ? "true" : "false");
      b.setAttribute("aria-label", t === "light" ? "Activer le thème sombre" : "Activer le thème clair");
    });
  }
  var saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
  applyTheme(saved === "light" ? "light" : "dark");

  /* ---------- Révélation au défilement ---------- */
  ASG.observeReveal = function (root) {
    var items = (root || document).querySelectorAll(".reveal:not(.is-visible), .reveal-stagger:not(.is-visible)");
    if (!("IntersectionObserver" in window)) { items.forEach(function (i) { i.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (i) { io.observe(i); });
  };

  function init() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      });
    });
    applyTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
    ASG.observeReveal(document);
    document.querySelectorAll("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
