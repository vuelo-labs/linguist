/**
 * Linguist — Progress tracking
 *
 * localStorage keys:
 *   lng_completed  — JSON array of module codes, e.g. ["b-01","b-02"]
 *   lng_email      — saved email address (set at stage completion)
 *   lng_dismissed  — JSON array of dismissed prompt IDs
 */
(function () {

  var STORAGE = {
    completed:  'lng_completed',
    email:      'lng_email',
    dismissed:  'lng_dismissed'
  };

  var STAGE_ENDS = {
    'b-10': { label: 'Stage 1 complete', next: 'ten modules' },
    'e-07': { label: 'Stage 2 complete', next: 'seventeen modules' },
    'a-09': { label: 'Course complete',  next: 'all twenty-seven modules' }
  };

  // ── Storage helpers ──────────────────────────────────────────

  function getCompleted() {
    try { return JSON.parse(localStorage.getItem(STORAGE.completed) || '[]'); }
    catch (e) { return []; }
  }

  function saveCompleted(list) {
    try { localStorage.setItem(STORAGE.completed, JSON.stringify(list)); }
    catch (e) {}
  }

  function getDismissed() {
    try { return JSON.parse(localStorage.getItem(STORAGE.dismissed) || '[]'); }
    catch (e) { return []; }
  }

  // ── Module code from URL ─────────────────────────────────────

  function codeFromURL() {
    var m = window.location.pathname.match(/\/course\/([a-z])\/0*(\d+)\/?$/);
    if (!m) return null;
    return m[1] + '-' + ('0' + m[2]).slice(-2);
  }

  // ── Public API ────────────────────────────────────────────────

  window.LinguistProgress = {

    complete: function (code) {
      var list = getCompleted();
      if (list.indexOf(code) === -1) {
        list.push(code);
        saveCompleted(list);
      }
    },

    isComplete: function (code) {
      return getCompleted().indexOf(code) !== -1;
    },

    getCompleted: getCompleted,

    getEmail: function () {
      return localStorage.getItem(STORAGE.email) || null;
    },

    saveEmail: function () {
      var input = document.getElementById('stage-email-input');
      if (!input) return;
      var raw = input.value.trim().toLowerCase().replace(/[^a-z0-9@._+\-]/g, '').slice(0, 254);
      if (!raw || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw)) {
        input.style.borderColor = '#c0392b';
        input.focus();
        return;
      }
      localStorage.setItem(STORAGE.email, raw);
      LinguistProgress._syncToSupabase(raw);
      LinguistProgress._showSaved();
    },

    dismissPrompt: function () {
      var code = codeFromURL();
      if (!code) return;
      var dismissed = getDismissed();
      if (dismissed.indexOf(code) === -1) {
        dismissed.push(code);
        try { localStorage.setItem(STORAGE.dismissed, JSON.stringify(dismissed)); } catch (e) {}
      }
      var prompt = document.getElementById('stage-complete-prompt');
      if (prompt) prompt.style.display = 'none';
    },

    _syncToSupabase: function (email) {
      try {
        var profile = (document.cookie.match(/(?:^|;\s*)lng_profile=([^;]+)/) || [])[1] || null;
        fetch('/functions/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            profile: profile,
            completed: getCompleted()
          })
        });
      } catch (e) {}
    },

    // Mark current module done and navigate to next
    markDoneAndNext: function () {
      var code = codeFromURL();
      if (code) LinguistProgress.complete(code);

      var btn = document.getElementById('module-already-done');
      if (btn) { btn.textContent = '✓ Done'; btn.classList.add('is-done'); }

      var nextLink = document.querySelector('.module-pagination-next');
      if (nextLink) {
        var href = nextLink.getAttribute('href');
        if (href) setTimeout(function () { window.location.href = href; }, 250);
      }
    },

    _showSaved: function () {
      var form = document.getElementById('stage-email-form');
      var saved = document.getElementById('stage-email-saved');
      if (form) form.style.display = 'none';
      if (saved) saved.style.display = 'block';
    }
  };

  // ── Init on DOM ready ────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    var code = codeFromURL();

    // Auto-mark complete when Next is clicked
    var nextBtn = document.querySelector('.module-pagination-next');
    if (nextBtn && code) {
      nextBtn.addEventListener('click', function () {
        LinguistProgress.complete(code);
      });
    }

    // Populate top nav prev/next from bottom pagination links
    (function populateTopNav() {
      var prevLink = document.querySelector('.module-pagination-prev');
      var nextLink = document.querySelector('.module-pagination-next');
      var topPrevEl = document.getElementById('module-nav-top-prev');
      var topNextEl = document.getElementById('module-nav-top-next');
      var sepEl     = document.getElementById('module-nav-top-sep');

      if (topPrevEl && prevLink) {
        var a = document.createElement('a');
        a.href = prevLink.getAttribute('href');
        a.className = 'module-nav-top-link';
        var t = prevLink.querySelector('.module-pagination-title');
        a.textContent = t ? '← ' + t.textContent.replace(/^←\s*/, '').split(':')[0].trim() : '← Back';
        topPrevEl.appendChild(a);
      }

      if (topNextEl && nextLink) {
        var a = document.createElement('a');
        a.href = nextLink.getAttribute('href');
        a.className = 'module-nav-top-link';
        var t = nextLink.querySelector('.module-pagination-title');
        a.textContent = t ? t.textContent.replace(/\s*→$/, '').split(':')[0].trim() + ' →' : 'Next →';
        topNextEl.appendChild(a);
      }

      // Show separator only when both prev and next exist
      if (sepEl && prevLink && nextLink) sepEl.style.display = 'inline';
    })();

    // Mark already-done button if module is already complete
    if (code) {
      var btn = document.getElementById('module-already-done');
      if (btn && LinguistProgress.isComplete(code)) {
        btn.textContent = '✓ Done';
        btn.classList.add('is-done');
      }
    }

    // Course index: add completion checkmarks
    if (/^\/course\/?$/.test(window.location.pathname)) {
      var completed = getCompleted();
      document.querySelectorAll('.module-card').forEach(function (card) {
        var href = card.getAttribute('href') || '';
        var m = href.match(/\/course\/([a-z])\/0*(\d+)/);
        if (!m) return;
        var cardCode = m[1] + '-' + ('0' + m[2]).slice(-2);
        if (completed.indexOf(cardCode) !== -1) {
          card.classList.add('module-card--complete');
        }
      });
      return; // nothing else to do on index
    }

    // Stage-end prompt: show if this is a stage-end module,
    // email not yet saved, and not previously dismissed
    if (!code || !STAGE_ENDS[code]) return;
    if (LinguistProgress.getEmail()) return;
    if (getDismissed().indexOf(code) !== -1) return;

    var prompt = document.getElementById('stage-complete-prompt');
    if (prompt) prompt.style.display = 'block';
  });

})();
