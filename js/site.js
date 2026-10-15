(function () {
  'use strict';

  /* mobile menu */
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('menu');
  if (btn && nav) {
    var label = btn.querySelector('.menu-btn-label');
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) { label.textContent = open ? 'Sulge' : 'Menüü'; }
    };
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        btn.focus();
      }
    });
    var mq = window.matchMedia('(min-width: 900px)');
    var onChange = function (e) { if (e.matches) { setOpen(false); } };
    if (mq.addEventListener) { mq.addEventListener('change', onChange); } else if (mq.addListener) { mq.addListener(onChange); }
  }

  /* contact form: validate, then open the mail program with a ready letter */
  var form = document.getElementById('paringuvorm');
  if (form) {
    var val = function (id) { return (document.getElementById(id).value || '').trim(); };
    var required = [
      { id: 'f-susteem', err: 'e-susteem' },
      { id: 'f-objekt', err: 'e-objekt' },
      { id: 'f-tegevus', err: 'e-tegevus' },
      { id: 'f-nimi', err: 'e-nimi' }
    ];
    var alertBox = document.getElementById('vormi-viga');

    form.buildMailto = function () {
      var lines = [
        'Tere!',
        '',
        'Süsteem: ' + val('f-susteem'),
        'Objekt ja asukoht: ' + val('f-objekt'),
        'Mida on vaja teha: ' + val('f-tegevus')
      ];
      if (val('f-lisa')) { lines.push('Lisainfo: ' + val('f-lisa')); }
      lines.push('Mulle sobiv aeg: ' + val('f-aeg'));
      lines.push('Nimi ja telefon: ' + val('f-nimi'));
      var subject = 'Hinnapäring: ' + val('f-susteem').toLowerCase();
      return 'mailto:' + form.getAttribute('data-to') +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\r\n') + '\r\n');
    };

    var check = function () {
      var firstBad = null;
      required.forEach(function (r) {
        var el = document.getElementById(r.id);
        var msg = document.getElementById(r.err);
        var bad = val(r.id) === '';
        el.setAttribute('aria-invalid', bad ? 'true' : 'false');
        msg.hidden = !bad;
        if (bad && !firstBad) { firstBad = el; }
      });
      alertBox.hidden = !firstBad;
      return firstBad;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = check();
      if (bad) { bad.focus(); return; }
      window.location.href = form.buildMailto();
    });

    required.forEach(function (r) {
      var el = document.getElementById(r.id);
      var onInput = function () {
        if (val(r.id) !== '') {
          el.setAttribute('aria-invalid', 'false');
          document.getElementById(r.err).hidden = true;
        }
      };
      el.addEventListener('input', onInput);
      el.addEventListener('change', onInput);
    });
  }
})();
