/**
 * Linguist — Profile system
 * Reads the lng_profile cookie and applies a class to <html> immediately,
 * before the page renders, so CSS can show/hide profile-specific content
 * without a flash.
 *
 * Profiles: newrole | professional | maker
 */
(function () {
  var VALID = ['newrole', 'professional', 'maker'];
  var COOKIE = 'lng_profile';

  function readCookie() {
    var m = document.cookie.match(/(?:^|;\s*)lng_profile=([^;]+)/);
    return (m && VALID.indexOf(m[1]) !== -1) ? m[1] : null;
  }

  function writeCookie(profile) {
    document.cookie = COOKIE + '=' + profile + '; path=/; max-age=31536000; SameSite=Lax';
  }

  function applyClass(profile) {
    var html = document.documentElement;
    VALID.forEach(function (p) { html.classList.remove('profile-' + p); });
    if (profile) html.classList.add('profile-' + profile);
  }

  var current = readCookie();
  applyClass(current);

  // Public API — used by /start page
  window.LinguistProfile = {
    current: current,

    set: function (profile, redirectTo) {
      if (VALID.indexOf(profile) === -1) return;
      writeCookie(profile);
      applyClass(profile);
      window.LinguistProfile.current = profile;
      window.location.href = redirectTo || '/course';
    },

    clear: function () {
      document.cookie = COOKIE + '=; path=/; max-age=0';
      applyClass(null);
      window.LinguistProfile.current = null;
    }
  };
})();
