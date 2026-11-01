/* ==========================================================================
   progress.js : sauvegarde locale de la progression de l'apprenant.
   Aucune donnée ne quitte le navigateur : tout est stocké dans localStorage
   sous une seule clé versionnée. Chaque lecture est protégée (navigation
   privée, stockage désactivé) et les données sont validées avant usage.
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "asg-formation-progress-v1";
  var memoryFallback = null; // utilisé si localStorage est indisponible

  function emptyState() {
    return { v: 1, done: {}, quiz: {}, exam: null, last: null };
  }

  /** Lit l'état depuis localStorage en le validant strictement. */
  function read() {
    var raw = null;
    try { raw = window.localStorage.getItem(KEY); } catch (e) { return memoryFallback || emptyState(); }
    if (!raw) return emptyState();
    try {
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object" || data.v !== 1) return emptyState();
      var state = emptyState();
      if (data.done && typeof data.done === "object") {
        Object.keys(data.done).forEach(function (k) { if (/^m\d{1,2}-l\d{1,2}$/.test(k)) state.done[k] = Number(data.done[k]) || Date.now(); });
      }
      if (data.quiz && typeof data.quiz === "object") {
        Object.keys(data.quiz).forEach(function (k) {
          var q = data.quiz[k];
          if (/^m\d{1,2}-l\d{1,2}$/.test(k) && q && typeof q === "object") {
            state.quiz[k] = { score: Number(q.score) || 0, total: Number(q.total) || 0, best: Number(q.best) || 0, attempts: Number(q.attempts) || 0, ts: Number(q.ts) || 0 };
          }
        });
      }
      if (data.exam && typeof data.exam === "object") {
        state.exam = { score: Number(data.exam.score) || 0, total: Number(data.exam.total) || 50, best: Number(data.exam.best) || 0, attempts: Number(data.exam.attempts) || 0, ts: Number(data.exam.ts) || 0 };
      }
      if (typeof data.last === "string" && /^m\d{1,2}-l\d{1,2}$/.test(data.last)) state.last = data.last;
      return state;
    } catch (e) {
      return emptyState();
    }
  }

  function write(state) {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { memoryFallback = state; }
    document.dispatchEvent(new CustomEvent("asg:progress", { detail: state }));
  }

  /** Liste ordonnée de tous les identifiants de leçons, à partir du catalogue. */
  function allLessonIds() {
    var ids = [];
    (window.ASG && ASG.catalog || []).forEach(function (m) {
      m.lessons.forEach(function (_, i) { ids.push(m.id + "-l" + (i + 1)); });
    });
    return ids;
  }

  var Progress = {
    get: read,
    isDone: function (id) { return !!read().done[id]; },
    setDone: function (id, value) {
      var s = read();
      if (value) s.done[id] = Date.now(); else delete s.done[id];
      write(s);
    },
    setLast: function (id) { var s = read(); s.last = id; write(s); },
    saveQuiz: function (id, score, total) {
      var s = read();
      var prev = s.quiz[id] || { best: 0, attempts: 0 };
      s.quiz[id] = { score: score, total: total, best: Math.max(prev.best || 0, score), attempts: (prev.attempts || 0) + 1, ts: Date.now() };
      write(s);
    },
    saveExam: function (score, total) {
      var s = read();
      var prev = s.exam || { best: 0, attempts: 0 };
      s.exam = { score: score, total: total, best: Math.max(prev.best || 0, score), attempts: (prev.attempts || 0) + 1, ts: Date.now() };
      write(s);
    },
    /** Pourcentage global (leçons terminées / total). */
    percent: function () {
      var ids = allLessonIds();
      if (!ids.length) return 0;
      var s = read();
      var n = ids.filter(function (id) { return s.done[id]; }).length;
      return Math.round((n / ids.length) * 100);
    },
    counts: function () {
      var ids = allLessonIds(), s = read();
      return { done: ids.filter(function (id) { return s.done[id]; }).length, total: ids.length };
    },
    moduleCounts: function (moduleId) {
      var m = (ASG.catalog || []).filter(function (x) { return x.id === moduleId; })[0];
      if (!m) return { done: 0, total: 0 };
      var s = read(), done = 0;
      m.lessons.forEach(function (_, i) { if (s.done[moduleId + "-l" + (i + 1)]) done++; });
      return { done: done, total: m.lessons.length };
    },
    /** Première leçon non terminée (ou la dernière consultée) pour « reprendre ». */
    resumeId: function () {
      var s = read();
      if (s.last && !s.done[s.last]) return s.last;
      var ids = allLessonIds();
      for (var i = 0; i < ids.length; i++) if (!s.done[ids[i]]) return ids[i];
      return ids[0] || "m1-l1";
    },
    reset: function () { try { window.localStorage.removeItem(KEY); } catch (e) {} memoryFallback = null; write(emptyState()); },
    allLessonIds: allLessonIds
  };

  window.ASG = window.ASG || {};
  window.ASG.Progress = Progress;
})();
