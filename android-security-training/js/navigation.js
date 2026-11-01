/* ==========================================================================
   navigation.js : en-tête fixe, menu mobile accessible, lien actif
   et indicateur de progression dans l'en-tête.
   ========================================================================== */
(function () {
  "use strict";

  function init() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".menu-toggle");
    var menu = document.getElementById("mobile-menu");
    var closeBtn = menu ? menu.querySelector("[data-menu-close]") : null;
    var lastFocus = null;

    /* Ombre de l'en-tête après défilement */
    function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* Lien actif selon la page courante */
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (page === "") page = "index.html";
    document.querySelectorAll("[data-nav] a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("?")[0].split("#")[0].toLowerCase();
      if (href === page) a.setAttribute("aria-current", "page");
    });

    /* Menu mobile : ouverture, fermeture, piège de focus, touche Échap */
    function focusables() {
      return Array.prototype.slice.call(menu.querySelectorAll("a[href], button:not([disabled])"));
    }
    function openMenu() {
      lastFocus = document.activeElement;
      menu.classList.add("is-open");
      menu.removeAttribute("inert");
      menu.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      var f = focusables();
      if (f.length) setTimeout(function () { f[0].focus(); }, 60);
    }
    function closeMenu() {
      menu.classList.remove("is-open");
      menu.setAttribute("inert", "");
      menu.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    if (toggle && menu) {
      menu.setAttribute("inert", "");
      toggle.addEventListener("click", openMenu);
      if (closeBtn) closeBtn.addEventListener("click", closeMenu);
      menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
      document.addEventListener("keydown", function (e) {
        if (!menu.classList.contains("is-open")) return;
        if (e.key === "Escape") { closeMenu(); return; }
        if (e.key === "Tab") {
          var f = focusables(); if (!f.length) return;
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
      window.addEventListener("resize", function () { if (window.innerWidth > 960 && menu.classList.contains("is-open")) closeMenu(); });
    }

    /* Indicateur de progression global dans l'en-tête */
    function updateHeaderProgress() {
      if (!window.ASG || !ASG.Progress || !ASG.catalog) return;
      var pct = ASG.Progress.percent();
      document.querySelectorAll("[data-header-progress]").forEach(function (el) {
        var bar = el.querySelector(".bar span");
        var txt = el.querySelector("[data-pct]");
        if (bar) bar.style.width = pct + "%";
        if (txt) txt.textContent = pct + " %";
        el.setAttribute("aria-label", "Ma progression : " + pct + " pour cent. Ouvrir l'espace apprenant");
      });
    }
    updateHeaderProgress();
    document.addEventListener("asg:progress", updateHeaderProgress);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
