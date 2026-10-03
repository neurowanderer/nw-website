(function () {
  'use strict';

  document.getElementById('y').textContent = new Date().getFullYear();

  // Sliding glass thumb + experience filter
  var seg = document.querySelector('.seg');
  var tabs = Array.prototype.slice.call(seg.querySelectorAll('button'));
  var thumb = seg.querySelector('.thumb');
  var roles = Array.prototype.slice.call(document.querySelectorAll('#roles article'));

  function moveThumb(btn) {
    thumb.style.width = btn.offsetWidth + 'px';
    thumb.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
  }

  function select(btn) {
    var f = btn.dataset.f;
    tabs.forEach(function (t) { t.setAttribute('aria-selected', t === btn ? 'true' : 'false'); });
    moveThumb(btn);
    roles.forEach(function (r) {
      r.hidden = f !== 'all' && r.dataset.c.split(' ').indexOf(f) === -1;
    });
  }

  tabs.forEach(function (t) { t.addEventListener('click', function () { select(t); }); });
  window.addEventListener('resize', function () {
    moveThumb(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0]);
  });
  moveThumb(tabs[0]);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { moveThumb(tabs[0]); });
  }

  // Light follows the pointer across glass surfaces
  document.addEventListener('pointermove', function (e) {
    var g = e.target.closest && e.target.closest('.glass');
    if (!g) return;
    var r = g.getBoundingClientRect();
    g.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    g.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  // Highlight current section in the nav
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav nav a'));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('on'); });
          if (map[en.target.id]) map[en.target.id].classList.add('on');
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }
})();
