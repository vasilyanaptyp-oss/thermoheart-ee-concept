(function () {
  'use strict';
  var d = document;
  var root = d.documentElement;

  /* phone menu: one full-screen sheet, opened from the header or the dock */
  var sheet = d.getElementById('menu');
  var openers = d.querySelectorAll('[aria-controls="menu"]');
  var lastOpener = null;
  function setMenu(open, opener) {
    if (!sheet) { return; }
    sheet.hidden = !open;
    root.classList.toggle('menu-on', open);
    for (var i = 0; i < openers.length; i++) {
      openers[i].setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (open) {
      lastOpener = opener || null;
      var first = sheet.querySelector('nav a');
      if (first) { first.focus(); }
    } else if (lastOpener) {
      lastOpener.focus();
    }
  }
  for (var i = 0; i < openers.length; i++) {
    openers[i].addEventListener('click', function (e) {
      setMenu(sheet.hidden, e.currentTarget);
    });
  }
  if (sheet) {
    sheet.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) { setMenu(false); }
    });
  }
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sheet && !sheet.hidden) { setMenu(false); }
  });
  var wide = window.matchMedia('(min-width: 900px)');
  var onWide = function (e) { if (e.matches && sheet && !sheet.hidden) { setMenu(false); } };
  if (wide.addEventListener) { wide.addEventListener('change', onWide); } else if (wide.addListener) { wide.addListener(onWide); }

  /* phone dock: shows after the hero button has scrolled away, hides over the contact block */
  var dock = d.querySelector('.dock');
  var heroAct = d.querySelector('.hero-act');
  var contact = d.querySelector('.warm .row');
  if (dock) {
    if (!('IntersectionObserver' in window) || !heroAct) {
      dock.classList.add('is-on');
    } else {
      var passed = false;
      var atContact = false;
      var sync = function () { dock.classList.toggle('is-on', passed && !atContact); };
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          passed = !en.isIntersecting && en.boundingClientRect.top < 0;
        });
        sync();
      }).observe(heroAct);
      if (contact) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { atContact = en.isIntersecting; });
          sync();
        }).observe(contact);
      }
    }
  }

  /* "Kust te alustate?": one answer open at a time (for browsers without details[name]) */
  var opts = d.querySelectorAll('details.opt');
  for (var j = 0; j < opts.length; j++) {
    opts[j].addEventListener('toggle', function (e) {
      var me = e.currentTarget;
      if (!me.open) { return; }
      for (var k = 0; k < opts.length; k++) {
        if (opts[k] !== me && opts[k].open) { opts[k].open = false; }
      }
    });
  }
})();
