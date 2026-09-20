/* OR — portfolio interactions (vanilla, no dependencies) */
(function () {
  'use strict';

  // Current year in footer
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Sticky nav shadow on scroll
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target && e.target.tagName === 'A') {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Notebook "Run all" — the Deepnote touch
  var notebook = document.getElementById('notebook');
  var runBtn = document.getElementById('runBtn');
  if (notebook && runBtn) {
    var run = function () {
      if (runBtn.classList.contains('running')) return;
      runBtn.classList.add('running');
      runBtn.textContent = 'Running…';
      notebook.classList.add('pending');
      window.setTimeout(function () {
        notebook.classList.remove('pending');
        notebook.classList.add('ran');
        runBtn.classList.remove('running');
        runBtn.innerHTML = '&#10003; Ran';
        window.setTimeout(function () {
          runBtn.innerHTML = '&#9654; Run all';
        }, 1600);
      }, 700);
    };
    runBtn.addEventListener('click', run);
    // Auto-run once when the notebook first scrolls into view
    if ('IntersectionObserver' in window) {
      var nbIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            nbIo.disconnect();
            window.setTimeout(run, 500);
          }
        });
      }, { threshold: 0.35 });
      nbIo.observe(notebook);
    } else {
      notebook.classList.add('ran');
    }
  }
})();
