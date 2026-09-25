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

/* ---- Project stories laptop — faithful vanilla port of Usf VibeStories.vue ---- */
(function () {
  'use strict';

  var container = document.getElementById('vibeStories');
  if (!container) return;

  // Same data (EN defaults) as `tStories` in VibeStories.vue
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

  // Icons verbatim from Usf UiIcon.vue (viewBox 24, stroke 1.8)
  var ICON_ATTRS = 'class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var ICONS = {
    activity: '<svg ' + ICON_ATTRS + ' width="26" height="26"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    network: '<svg ' + ICON_ATTRS + ' width="26" height="26"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><line x1="12" y1="12" x2="12" y2="8"/></svg>',
    shield: '<svg ' + ICON_ATTRS + ' width="26" height="26"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
    layout: '<svg ' + ICON_ATTRS + ' width="26" height="26"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>'
  };

  // Same timings as VibeStories.vue
  var AUTOPLAY_MS = 4000;      // startAutoplay interval
  var PAGINATE_LOCK_MS = 800;  // next/prev guard
  var TRANSITION_MS = 600;     // slide transition duration

  var screenLink = container.querySelector('.screen-link');
  var avatarEl = container.querySelector('.story-avatar');
  var titleEl = container.querySelector('.story-title');
  var authorEl = container.querySelector('.story-author');
  var dots = Array.prototype.slice.call(container.querySelectorAll('.indicator-dot'));
  var wrapperEl = container.querySelector('.laptop-wrapper');

  var currentIndex = 0;
  var isPaginating = false;
  var autoplayTimer = null;

  function story(i) { return STORIES[i] || STORIES[0]; }

  // Keep story info, avatar icon, dots and links in sync with currentIndex
  function syncInfo() {
    var s = story(currentIndex);
    if (avatarEl) avatarEl.innerHTML = ICONS[s.avatar] || '';
    if (titleEl) {
      titleEl.textContent = s.title;
      titleEl.href = s.link;
    }
    if (authorEl) authorEl.textContent = 'Built with: ' + s.author;
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

  // Mimic Vue <transition name="slide-left|slide-right">
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

  // Controls
  var prevBtn = container.querySelector('.nav-btn.prev');
  var nextBtn = container.querySelector('.nav-btn.next');
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { setIndex(i); });
  });

  // Pause autoplay on hover — same as @mouseenter/@mouseleave in VibeStories.vue
  if (wrapperEl) {
    wrapperEl.addEventListener('mouseenter', stopAutoplay);
    wrapperEl.addEventListener('mouseleave', startAutoplay);
  }

  // Horizontal trackpad/wheel — same thresholds as VibeStories.vue
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
