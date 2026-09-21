/* OR — portfolio interactions (vanilla, no dependencies) */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function syncToggle() {
    var dark = root.getAttribute('data-theme') === 'dark';
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }
  syncToggle();
  // Follow OS changes only when the user has not chosen explicitly
  try {
    if (!localStorage.getItem('or-theme')) {
      prefersDark.addEventListener && prefersDark.addEventListener('change', function (e) {
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        syncToggle();
      });
    }
  } catch (e) {}
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-anim');
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('or-theme', next); } catch (e) {}
      syncToggle();
      window.setTimeout(function () { root.classList.remove('theme-anim'); }, 350);
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Sticky nav shadow ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
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

  /* ---------- Reveal on scroll ---------- */
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

  /* ---------- Notebook "Run all" ---------- */
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

  /* ---------- Laptop slider (ported from Usf, vanilla) ---------- */
  var STORIES = [
    {
      title: 'One binary that answers every network question',
      author: 'Built with: netpilot · Go',
      href: 'https://github.com/Godde3s/netpilot',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>'
    },
    {
      title: 'One router in front of every AI model',
      author: 'Built with: omnirouter · Go',
      href: 'https://github.com/Godde3s/omnirouter',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2h6M9 22h6M2 9v6m20-6v6M2 12h4m12 0h4M12 2v4m0 12v4"/></svg>'
    },
    {
      title: 'A VLESS panel that survives real censorship',
      author: 'Built with: Usf Panel · Python',
      href: 'https://github.com/Godde3s/Usf-panel',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
    },
    {
      title: 'This portfolio — designed, built, shipped',
      author: 'Built with: OR · HTML/CSS/JS',
      href: 'https://godde3s.github.io/Usf/',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>'
    }
  ];

  var laptop = document.getElementById('laptop');
  if (laptop) {
    var slides = Array.prototype.slice.call(laptop.querySelectorAll('.slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('#storyDots .dot-btn'));
    var titleEl = document.getElementById('storyTitle');
    var authorEl = document.getElementById('storyAuthor');
    var avatarEl = document.getElementById('storyAvatar');
    var linkEl = document.getElementById('screenLink');
    var current = 0;
    var locked = false;
    var timer = null;
    var AUTOPLAY_MS = 4500;

    function renderInfo() {
      var s = STORIES[current];
      if (titleEl) titleEl.textContent = s.title;
      if (authorEl) authorEl.textContent = s.author;
      if (avatarEl) avatarEl.innerHTML = s.icon;
      if (linkEl) {
        linkEl.href = s.href;
        linkEl.setAttribute('aria-label', 'Open: ' + s.title);
      }
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }

    function goTo(index, dir) {
      var n = (index + slides.length) % slides.length;
      if (locked || n === current) return;
      locked = true;
      var d = dir || (n > current ? 'next' : 'prev');
      slides[current].classList.remove('active');
      slides[current].classList.add(d === 'next' ? 'pos-left' : 'pos-right');
      slides[n].classList.remove('pos-left', 'pos-right');
      slides[n].classList.add('active');
      current = n;
      renderInfo();
      window.setTimeout(function () { locked = false; }, reduceMotion ? 60 : 700);
    }
    function nextSlide() { goTo(current + 1, 'next'); }
    function prevSlide() { goTo(current - 1, 'prev'); }

    function startAutoplay() {
      if (reduceMotion || timer) return;
      timer = window.setInterval(function () {
        if (!locked) nextSlide();
      }, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }

    renderInfo();

    var prevBtn = document.getElementById('lapPrev');
    var nextBtn = document.getElementById('lapNext');
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { goTo(i); });
    });

    // Pause on hover / keyboard focus
    laptop.addEventListener('mouseenter', stopAutoplay);
    laptop.addEventListener('mouseleave', startAutoplay);
    laptop.addEventListener('focusin', stopAutoplay);
    laptop.addEventListener('focusout', startAutoplay);

    // Keyboard navigation while focused inside the laptop area
    laptop.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
    });

    // Touch swipe
    var touchX = null;
    laptop.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].clientX;
      stopAutoplay();
    }, { passive: true });
    laptop.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide(); }
      touchX = null;
      startAutoplay();
    }, { passive: true });

    // Horizontal wheel (trackpad) — mirrors the Usf behaviour
    laptop.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > 20 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        e.deltaX > 0 ? nextSlide() : prevSlide();
      }
    }, { passive: false });

    // Autoplay only while the slider is actually on screen
    if ('IntersectionObserver' in window) {
      var lapIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.isIntersecting ? startAutoplay() : stopAutoplay();
        });
      }, { threshold: 0.3 });
      lapIo.observe(laptop);
    } else {
      startAutoplay();
    }
  }

  /* ---------- "More builds" rail: drag to scroll ---------- */
  var rail = document.getElementById('rail');
  if (rail) {
    var isDown = false, startX = 0, startLeft = 0, moved = false;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return; // native scroll on touch
      isDown = true; moved = false;
      startX = e.clientX;
      startLeft = rail.scrollLeft;
      rail.classList.add('dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      rail.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!isDown) return;
      isDown = false;
      rail.classList.remove('dragging');
    });
    // Prevent accidental link opens right after a drag
    rail.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); moved = false; }
    });
  }
})();
