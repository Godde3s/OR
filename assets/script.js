/* OR — portfolio interactions (vanilla, no dependencies) · v7 */
(function () {
  'use strict';

  // Progressive enhancement flag — reveals only hide content when JS runs
  document.documentElement.classList.add('js');

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
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Deepnote-style humans <-> agents toggle ----
     The lens slides; the whole hero copy crossfades to the matching state. */
  (function () {
    var toggle = document.getElementById('heroToggle');
    if (!toggle) return;
    var hero = document.querySelector('.hero');
    var lens = toggle.querySelector('.lens');
    var opts = Array.prototype.slice.call(toggle.querySelectorAll('.opt'));
    var states = Array.prototype.slice.call(document.querySelectorAll('.hero-state'));
    var idx = 0;

    function position(instant) {
      var opt = opts[idx];
      if (!opt || !lens) return;
      var pad = parseFloat(getComputedStyle(toggle).paddingTop) || 6;
      if (instant) lens.style.transition = 'none';
      lens.style.width = opt.offsetWidth + 'px';
      lens.style.transform = 'translateX(' + (opt.offsetLeft - pad) + 'px)';
      if (instant) {
        void lens.offsetWidth;
        lens.style.transition = '';
      }
    }

    function select(i) {
      idx = (i + opts.length) % opts.length;
      opts.forEach(function (o, j) {
        o.classList.toggle('is-active', j === idx);
        o.setAttribute('aria-selected', String(j === idx));
      });
      states.forEach(function (st, j) {
        var on = j === idx;
        st.classList.toggle('is-active', on);
        st.setAttribute('aria-hidden', String(!on));
      });
      if (hero) hero.classList.toggle('mode-agents', opts[idx].getAttribute('data-mode') === 'agents');
      position(false);
    }

    opts.forEach(function (o, i) {
      o.addEventListener('click', function () { select(i); });
    });

    // Arrow-key support on the toggle
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        select(idx + 1);
        opts[idx].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        select(idx - 1);
        opts[idx].focus();
      }
    });

    window.addEventListener('resize', function () { position(true); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { position(true); });
    }
    window.setTimeout(function () { position(true); }, 60);
  })();
})();

/* ---- Project stories laptop — faithful vanilla port of Usf VibeStories.vue ---- */
(function () {
  'use strict';

  var container = document.getElementById('vibeStories');
  if (!container) return;

  var STORIES = [
    {
      id: 1,
      title: 'A backend where every security claim has a test',
      author: 'taskflow-api · Python',
      avatar: 'shield',
      image: 'assets/stories/story-1.webp',
      srcset: 'assets/stories/story-1-640.webp 640w, assets/stories/story-1.webp 1280w',
      imageHeight: 959,
      objectPosition: 'center center',
      link: 'https://godde3s.github.io/Usf/en/vibe-stories/story-1/'
    },
    {
      id: 2,
      title: 'A messenger with no server to breach',
      author: 'veilchat · Python',
      avatar: 'network',
      image: 'assets/stories/story-2.webp',
      srcset: 'assets/stories/story-2-640.webp 640w, assets/stories/story-2.webp 1280w',
      imageHeight: 959,
      objectPosition: 'center center',
      link: 'https://godde3s.github.io/Usf/en/vibe-stories/story-2/'
    },
    {
      id: 3,
      title: 'NLP that ships like a real service',
      author: 'textsense · Python',
      avatar: 'activity',
      image: 'assets/stories/story-3.webp',
      srcset: 'assets/stories/story-3-640.webp 640w, assets/stories/story-3.webp 1280w',
      imageHeight: 959,
      objectPosition: 'center center',
      link: 'https://godde3s.github.io/Usf/en/vibe-stories/story-3/'
    },
    {
      id: 4,
      title: 'Realtime chat you self-host in one command',
      author: 'goftego · Node.js',
      avatar: 'layout',
      image: 'assets/stories/story-4.webp',
      srcset: 'assets/stories/story-4-640.webp 640w, assets/stories/story-4.webp 1280w',
      imageHeight: 959,
      objectPosition: 'center center',
      link: 'https://godde3s.github.io/Usf/en/vibe-stories/story-4/'
    }
  ];

  var AUTOPLAY_MS = 4000;
  var PAGINATE_LOCK_MS = 800;
  var TRANSITION_MS = 600;

  var screenLink = container.querySelector('.screen-link');
  var dots = Array.prototype.slice.call(container.querySelectorAll('.indicator-dot'));
  var wrapperEl = container.querySelector('.laptop-wrapper');

  var currentIndex = 0;
  var isPaginating = false;
  var autoplayTimer = null;

  function story(i) { return STORIES[i] || STORIES[0]; }

  function syncInfo() {
    var s = story(currentIndex);
    if (screenLink) screenLink.href = s.link;
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function mountImage(s) {
    var wrap = document.createElement('div');
    wrap.className = 'screen-image-wrapper';
    var img = document.createElement('img');
    img.className = 'screen-image';
    img.src = s.image;
    img.srcset = s.srcset;
    img.sizes = '(max-width: 760px) 62vw, 440px';
    img.alt = 'Story cover';
    img.width = 1280;
    img.height = s.imageHeight;
    img.style.objectPosition = s.objectPosition;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.setAttribute('fetchpriority', 'low');
    wrap.appendChild(img);
    return wrap;
  }

  function slideTo(index, name) {
    var enter = mountImage(story(index));
    screenLink.appendChild(enter);

    var leaving = [];
    Array.prototype.forEach.call(screenLink.querySelectorAll('.screen-image-wrapper'), function (el) {
      if (el !== enter) leaving.push(el);
    });

    enter.classList.add(name + '-enter-active', name + '-enter-from');
    leaving.forEach(function (el) { el.classList.add(name + '-leave-active'); });
    void enter.offsetWidth; // force reflow so the enter-from state applies
    enter.classList.remove(name + '-enter-from');
    leaving.forEach(function (el) { el.classList.add(name + '-leave-to'); });

    window.setTimeout(function () {
      enter.classList.remove(name + '-enter-active');
      leaving.forEach(function (el) {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    }, TRANSITION_MS);
  }

  var next = function () {
    if (isPaginating) return;
    isPaginating = true;
    slideTo((currentIndex + 1) % STORIES.length, 'slide-left');
    currentIndex = (currentIndex + 1) % STORIES.length;
    syncInfo();
    window.setTimeout(function () { isPaginating = false; }, PAGINATE_LOCK_MS);
  };

  var prev = function () {
    if (isPaginating) return;
    isPaginating = true;
    slideTo((currentIndex - 1 + STORIES.length) % STORIES.length, 'slide-right');
    currentIndex = (currentIndex - 1 + STORIES.length) % STORIES.length;
    syncInfo();
    window.setTimeout(function () { isPaginating = false; }, PAGINATE_LOCK_MS);
  };

  var setIndex = function (index) {
    if (index === currentIndex) return;
    slideTo(index, index > currentIndex ? 'slide-left' : 'slide-right');
    currentIndex = index;
    syncInfo();
  };

  var startAutoplay = function () {
    stopAutoplay();
    autoplayTimer = window.setInterval(function () {
      if (!isPaginating) {
        slideTo((currentIndex + 1) % STORIES.length, 'slide-left');
        currentIndex = (currentIndex + 1) % STORIES.length;
        syncInfo();
      }
    }, AUTOPLAY_MS);
  };

  var stopAutoplay = function () {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  var prevBtn = container.querySelector('.nav-btn.prev');
  var nextBtn = container.querySelector('.nav-btn.next');
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); stopAutoplay(); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); stopAutoplay(); startAutoplay(); });
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { setIndex(i); stopAutoplay(); startAutoplay(); });
  });

  if (wrapperEl) {
    wrapperEl.addEventListener('mouseenter', stopAutoplay);
    wrapperEl.addEventListener('mouseleave', startAutoplay);
  }

  container.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaX) > 20 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      if (e.deltaX > 0) {
        next();
      } else {
        prev();
      }
    }
  }, { passive: false });

  syncInfo();
  startAutoplay();
})();
