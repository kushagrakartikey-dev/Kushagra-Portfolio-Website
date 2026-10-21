/* ==========================================================================
   Kushagra Kartikey — Portfolio scripts
   Vanilla JavaScript, no build step. Every module is optional: if one fails,
   the page content stays visible and the rest keeps working.
   Modules: header, menu, scroll spy, split headings, reveal, counters, one
   shared scroll loop (word lighting, timeline spine, project
   frames), floating windows, tile lean, copy email, footer year, and three 3D
   scenes built with three.js (loaded lazily from assets/vendor): the hero
   globe, the capacity-roadmap model and the container yard.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var finePointerQuery = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;

  /* Motion has two modes, set on <html data-motion> before first paint (see index.html):
     "full", and "reduced", a gentle mode that keeps fades, counts and fills but drops travel, turns,
     spin and parallax. A system request for reduced motion starts the page reduced; the Animations
     switch lets any visitor choose, and the choice is remembered. */
  function reducedMotion() { return root.getAttribute('data-motion') === 'reduced'; }
  function savedMotion() {
    try { var m = window.localStorage.getItem('motion'); return m === 'full' || m === 'reduced' ? m : null; }
    catch (e) { return null; }
  }
  function setMotion(mode, remember) {
    if (root.getAttribute('data-motion') === mode) return;
    root.setAttribute('data-motion', mode);
    if (remember) { try { window.localStorage.setItem('motion', mode); } catch (e) { /* private mode */ } }
    window.dispatchEvent(new Event('motionchange'));
  }
  if (!root.getAttribute('data-motion')) root.setAttribute('data-motion', motionQuery && motionQuery.matches ? 'reduced' : 'full');
  // Follow a change to the system setting, unless the visitor has made their own choice
  if (motionQuery && motionQuery.addEventListener) {
    motionQuery.addEventListener('change', function (e) { if (!savedMotion()) setMotion(e.matches ? 'reduced' : 'full', false); });
  }
  function finePointer() { return !!(finePointerQuery && finePointerQuery.matches); }

  function warn(name, err) {
    if (window.console && console.warn) console.warn('[portfolio] ' + name + ' disabled:', err);
  }

  /** Runs a module and contains any error so one failure never blocks the others. */
  function safely(name, fn) {
    try { fn(); } catch (err) { warn(name, err); }
  }

  /* ---------- Motion maths shared by the 3D scenes: the same curves as the CSS tokens ---------- */
  var DEG = Math.PI / 180;
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smoothstep(e0, e1, x) { var t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }

  /** cubic-bezier(x1, y1, x2, y2) as a function of progress, solved the way browsers do. */
  function cubicBezier(x1, y1, x2, y2) {
    var cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    var cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    function curveX(t) { return ((ax * t + bx) * t + cx) * t; }
    function curveY(t) { return ((ay * t + by) * t + cy) * t; }
    function slopeX(t) { return (3 * ax * t + 2 * bx) * t + cx; }
    function solveX(x) {
      var t = x, i;
      for (i = 0; i < 8; i++) {               // Newton–Raphson
        var err = curveX(t) - x;
        if (Math.abs(err) < 1e-6) return t;
        var d = slopeX(t);
        if (Math.abs(d) < 1e-6) break;
        t -= err / d;
      }
      var lo = 0, hi = 1;                     // bisection fallback
      t = x;
      for (i = 0; i < 32; i++) {
        var v = curveX(t);
        if (Math.abs(v - x) < 1e-6) break;
        if (v < x) lo = t; else hi = t;
        t = (lo + hi) / 2;
      }
      return t;
    }
    return function (x) { return x <= 0 ? 0 : x >= 1 ? 1 : curveY(solveX(x)); };
  }
  var easeOut = cubicBezier(0.23, 1, 0.32, 1);     // --ease-out
  var easeInOut = cubicBezier(0.77, 0, 0.175, 1);  // --ease-in-out
  /** Lands with a small, settled overshoot (about 4%); used for markers, never for text. */
  function easeOutBack(t) { var c = 1.1; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }

  /** Small seeded random generator, so each 3D scene looks the same on every visit. */
  function seeded(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- Header: hairline appears once the page scrolls ---------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Mobile menu: aria-expanded, Escape, outside click, close on select ---------- */
  function initMenu() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.getElementById('site-menu');
    if (!header || !toggle || !menu) return;

    var label = toggle.querySelector('.menu-toggle__label');
    var desktop = window.matchMedia('(min-width: 1200px)');

    function setOpen(open, returnFocus) {
      header.setAttribute('data-menu', open ? 'open' : 'closed');
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Close' : 'Menu';
      if (!open && returnFocus) toggle.focus();
    }
    function isOpen() { return toggle.getAttribute('aria-expanded') === 'true'; }

    toggle.addEventListener('click', function () {
      var open = !isOpen();
      setOpen(open, false);
      if (open) {
        var first = menu.querySelector('a');
        if (first) first.focus({ preventScroll: true });
      }
    });

    // Close after choosing a section (or the resume link)
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a') && isOpen()) setOpen(false, false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) setOpen(false, true);
    });

    document.addEventListener('click', function (e) {
      if (isOpen() && !header.contains(e.target)) setOpen(false, false);
    });

    // Leaving the mobile layout resets the menu
    var onChange = function (e) { if (e.matches) setOpen(false, false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ---------- Scroll spy: marks the nav link of the section in view ---------- */
  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    var map = {};
    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) map[id] = { link: link, section: section };
    });
    var ids = Object.keys(map);
    if (!ids.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.removeAttribute('aria-current'); });
        var hit = map[entry.target.id];
        if (hit) hit.link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    ids.forEach(function (id) { observer.observe(map[id].section); });

    // Above the first tracked section, nothing is current
    var hero = document.getElementById('top');
    if (hero) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && entries[0].intersectionRatio > 0.5) {
          links.forEach(function (l) { l.removeAttribute('aria-current'); });
        }
      }, { threshold: [0.5] }).observe(hero);
    }
  }

  /* ---------- Scroll reveal: elements that arrive together rise in a short stagger, once ---------- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!items.length || !('IntersectionObserver' in window)) return; // content simply stays visible

    function show(el, order) {
      el.style.setProperty('--i', String(Math.min(order, 6)));
      el.classList.add('is-visible');
    }

    // Tiles in a staggered list arrive in order: each one's place becomes --k for its delays
    Array.prototype.forEach.call(document.querySelectorAll('.stagger'), function (list) {
      Array.prototype.forEach.call(list.children, function (child, k) { child.style.setProperty('--k', String(Math.min(k, 9))); });
    });

    var observer = new IntersectionObserver(function (entries) {
      // Stagger only among the elements entering in this batch, top to bottom, left to right
      var arriving = entries.filter(function (entry) { return entry.isIntersecting; });
      arriving.sort(function (a, b) {
        return (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left);
      });
      arriving.forEach(function (entry, n) {
        show(entry.target, n);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { observer.observe(el); });
    root.classList.add('reveal-ready');

    // Failsafe: after scrolling settles (or an anchor jump), reveal everything already reached,
    // so a skipped observer callback can never leave content hidden.
    var settleTimer = 0;
    function revealReached() {
      var limit = window.innerHeight;
      items.forEach(function (el) {
        if (!el.classList.contains('is-visible') && el.getBoundingClientRect().top < limit) {
          show(el, 0);
          observer.unobserve(el);
        }
      });
    }
    window.addEventListener('scroll', function () {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(revealReached, 150);
    }, { passive: true });
    window.addEventListener('hashchange', function () { window.setTimeout(revealReached, 50); });
    window.setTimeout(revealReached, 400);

    // Printing should never leave content hidden
    window.addEventListener('beforeprint', function () { items.forEach(function (el) { show(el, 0); }); });
  }

  /* ---------- Counters: each figure counts from its "before" reading to the result as it comes
     into view; the hero's keep time with the ledger's entrance, the rest with their tile's ---------- */
  function initCounters() {
    if (!('IntersectionObserver' in window)) return; // final values are already in the HTML
    var nodes = document.querySelectorAll('[data-count-to]');
    var duration = 1400;

    function count(node, delay) {
      var from = parseFloat(node.getAttribute('data-count-from'));
      var to = parseFloat(node.getAttribute('data-count-to'));
      var decimals = parseInt(node.getAttribute('data-decimals') || '0', 10);
      var finalText = node.textContent;
      if (isNaN(from) || isNaN(to)) return;
      // A figure written with thousands separators (1,899) keeps them while it counts
      var grouped = finalText.indexOf(',') >= 0;
      function show(v) {
        node.textContent = grouped ? v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : v.toFixed(decimals);
      }

      show(from);
      var start = null;
      function frame(now) {
        if (start === null) start = now + delay;
        var t = Math.min(Math.max((now - start) / duration, 0), 1);
        show(from + (to - from) * easeInOut(t));
        if (t < 1) window.requestAnimationFrame(frame);
        else node.textContent = finalText;
      }
      window.requestAnimationFrame(frame);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var tile = entry.target.closest('.stagger > *');
        var k = tile ? parseFloat(tile.style.getPropertyValue('--k')) || 0 : 0;
        count(entry.target, entry.target.closest('.hero') ? 600 : 300 + k * 75);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(nodes, function (node) { io.observe(node); });
  }

  /* ---------- One scroll loop for every scroll-linked effect ----------
     Each effect reads what it needs and returns a function that writes (transforms, classes),
     so every read in a frame happens before any write. */
  var scrollEffects = [];
  var scrollRaf = 0;
  function runScrollFrame() {
    scrollRaf = 0;
    var vh = window.innerHeight;
    var writes = scrollEffects.map(function (read) { return read(vh); });
    writes.forEach(function (write) { if (write) write(); });
  }
  function requestScrollFrame() { if (!scrollRaf) scrollRaf = window.requestAnimationFrame(runScrollFrame); }
  function onScroll(read) {
    if (!scrollEffects.length) {
      window.addEventListener('scroll', requestScrollFrame, { passive: true });
      window.addEventListener('resize', requestScrollFrame);
    }
    scrollEffects.push(read);
    requestScrollFrame();
  }

  /* ---------- Display headings: split into words (letters for one-word headings) so each part can
     stand up in 3D as the heading is revealed. A visually hidden copy keeps the full text for
     assistive technology, with the footer's arrows read as commas; the split copy is aria-hidden. ---------- */
  function initSplitText() {
    if (!('IntersectionObserver' in window)) return; // no scroll reveal, so nothing to stagger
    Array.prototype.forEach.call(document.querySelectorAll('.section-title, .footer__chain'), function (el) {
      var text = el.textContent.replace(/\s+/g, ' ').trim();
      var words = text.split(' ');
      var byLetter = words.length === 1;
      var said = document.createElement('span');
      said.className = 'visually-hidden';
      said.textContent = text.replace(/ → /g, ', ');
      var shown = document.createElement('span');
      shown.setAttribute('aria-hidden', 'true');
      var order = 0;
      var word;
      words.forEach(function (w) {
        var arrow = w === '→';
        // An arrow joins the word before it (words never break inside), so it never starts a line
        if (arrow && word) word.appendChild(document.createTextNode('\u00A0'));
        else {
          if (word) shown.appendChild(document.createTextNode(' '));
          word = document.createElement('span');
          word.className = 'split-word';
          shown.appendChild(word);
        }
        (byLetter ? w.split('') : [w]).forEach(function (piece) {
          var part = document.createElement('span');
          part.className = arrow ? 'split-part split-arrow' : 'split-part';
          part.textContent = piece;
          // --n is the part's place, so a gradient can run across the whole heading part by part
          part.style.setProperty('--n', String(order));
          part.style.setProperty('--d', String(order++ * (byLetter ? 28 : 75)));
          word.appendChild(part);
        });
      });
      el.textContent = '';
      el.appendChild(said);
      el.appendChild(shown);
      el.style.setProperty('--count', String(Math.max(2, order)));
      el.classList.add('split');
    });
  }

  /* ---------- The About statement lights word by word as it moves up the screen ---------- */
  function initWordLight() {
    var el = document.querySelector('[data-light]');
    if (!el) return;
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    var spans = words.map(function (w, i) {
      var s = document.createElement('span');
      s.className = 'light-w';
      s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      return s;
    });
    el.classList.add('is-lighting');
    var lit = -1;
    onScroll(function (vh) {
      var r = el.getBoundingClientRect();
      // From the statement's top at 90% of the screen to its foot at 72%, so it is fully lit
      // by the time the section settles under the header
      var p = clamp((vh * 0.9 - r.top) / (vh * 0.18 + r.height), 0, 1);
      var n = Math.round(p * spans.length);
      if (n === lit) return null;
      return function () {
        lit = n;
        spans.forEach(function (s, i) { s.classList.toggle('is-lit', i < n); });
      };
    });
  }

  /* ---------- Experience: the spine fills as a reading line (55% down the screen) moves through
     the roles, and each role's dot turns amber when the fill reaches it ---------- */
  function initSpine() {
    var wrap = document.querySelector('.timeline-wrap');
    var fill = wrap && wrap.querySelector('.timeline__fill');
    var head = wrap && wrap.querySelector('.timeline__head');
    if (!fill) return;
    var roles = Array.prototype.slice.call(wrap.querySelectorAll('.role'));
    var dotOffset = 64;
    function measure() {
      var t = parseFloat(window.getComputedStyle(roles[0], '::before').top);
      if (!isNaN(t)) dotOffset = t + 7;
    }
    measure();
    window.addEventListener('resize', measure);
    onScroll(function (vh) {
      var line = vh * 0.55;
      var r = wrap.getBoundingClientRect();
      var p = clamp((line - r.top) / r.height, 0, 1);
      var reached = roles.map(function (role) { return role.getBoundingClientRect().top + dotOffset <= line; });
      var headY = p * r.height;
      return function () {
        fill.style.transform = 'scaleY(' + p.toFixed(4) + ')';
        // A glowing head rides the end of the fill
        if (head) head.style.transform = 'translate3d(0,' + headY.toFixed(1) + 'px,0)';
        roles.forEach(function (role, i) { role.classList.toggle('is-reached', reached[i]); });
      };
    });
  }

  /* ---------- Hero: the floating dashboards lean away from a mouse pointer, each by its depth,
     so they read as further back than the globe. They never drift with the scroll, which would
     carry them over the caption. ---------- */
  function initFloatWindows() {
    var hero = document.getElementById('top');
    var tracks = Array.prototype.slice.call(document.querySelectorAll('.float-window__track'));
    if (!hero || !tracks.length) return;
    var depth = tracks.map(function (t) { return parseFloat(t.getAttribute('data-depth')) || 1; });
    var lean = { x: 0, y: 0, tx: 0, ty: 0 }, raf = 0, last = 0;
    function write() {
      tracks.forEach(function (t, i) {
        var d = depth[i];
        t.style.transform = 'translate3d(' + (-lean.x * 18 * d).toFixed(2) + 'px,' + (-lean.y * 12 * d).toFixed(2) + 'px,0)';
      });
    }
    function frame(time) {
      raf = 0;
      var dt = last ? Math.min(0.05, (time - last) / 1000) : 1 / 60;
      last = time;
      var k = 1 - Math.exp(-dt * 4);
      lean.x += (lean.tx - lean.x) * k;
      lean.y += (lean.ty - lean.y) * k;
      write();
      if (Math.abs(lean.tx - lean.x) + Math.abs(lean.ty - lean.y) > 0.002) raf = window.requestAnimationFrame(frame);
      else last = 0;
    }
    function kick() { if (!raf) raf = window.requestAnimationFrame(frame); }
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || !finePointer() || reducedMotion()) return;
      lean.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      lean.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      kick();
    });
    hero.addEventListener('pointerleave', function () { lean.tx = 0; lean.ty = 0; kick(); });
  }

  /* ---------- Projects: each framed dashboard straightens into focus as it nears the middle of
     the screen, leans toward a mouse pointer, and can be dragged to spin; it springs back on release.
     Positions are read from the untransformed parent, so the frame's own turn never feeds back. ---------- */
  function initShowcase() {
    var frames = Array.prototype.slice.call(document.querySelectorAll('[data-spin]'));
    if (!frames.length) return;
    var items = frames.map(function (el) {
      return { el: el, box: el.parentElement, side: 1, near: true, s: 0, spin: 0, vel: 0, dragging: false,
               lastX: 0, hx: 0, hy: 0, tx: 0, ty: 0, raf: 0, last: 0 };
    });

    // A frame left of its text opens toward the right, and the reverse; a stacked frame faces front
    function measureSides() {
      items.forEach(function (it) {
        var r = it.box.getBoundingClientRect(), rr = it.box.parentElement.getBoundingClientRect();
        var mid = r.left + r.width / 2, rowMid = rr.left + rr.width / 2;
        it.side = Math.abs(mid - rowMid) < 8 ? 0 : (mid < rowMid ? 1 : -1);
      });
    }

    function render(it) {
      var still = reducedMotion();
      var s = still ? 0 : it.s;
      var rotY = (still ? 0 : it.side * (3 + 13 * Math.abs(s))) + it.spin + it.hx * 6;
      var rotX = s * 10 - it.hy * 4;
      var scale = 1 - Math.abs(s) * 0.06;
      it.el.style.transform = 'perspective(1600px) rotateY(' + rotY.toFixed(2) + 'deg) rotateX(' +
        rotX.toFixed(2) + 'deg) scale(' + scale.toFixed(4) + ')';
    }

    function step(it, time) {
      it.raf = 0;
      var dt = it.last ? Math.min(0.05, (time - it.last) / 1000) : 1 / 60;
      it.last = time;
      if (!it.dragging) {
        // A light spring returns the spin to rest, with a small, settled overshoot
        it.vel += (-90 * it.spin - 14 * it.vel) * dt;
        it.spin += it.vel * dt;
      }
      var k = 1 - Math.exp(-dt * 8);
      it.hx += (it.tx - it.hx) * k;
      it.hy += (it.ty - it.hy) * k;
      render(it);
      var moving = it.dragging || Math.abs(it.spin) > 0.05 || Math.abs(it.vel) > 0.05 ||
        Math.abs(it.tx - it.hx) + Math.abs(it.ty - it.hy) > 0.002;
      if (moving) it.raf = window.requestAnimationFrame(function (t) { step(it, t); });
      else it.last = 0;
    }
    function kick(it) { if (!it.raf) it.raf = window.requestAnimationFrame(function (t) { step(it, t); }); }

    items.forEach(function (it) {
      var el = it.el;
      el.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        it.dragging = true;
        it.lastX = e.clientX;
        it.vel = 0;
        el.classList.add('is-dragging');
        if (el.setPointerCapture) el.setPointerCapture(e.pointerId);
        kick(it);
      });
      el.addEventListener('pointermove', function (e) {
        if (it.dragging) {
          var dx = e.clientX - it.lastX;
          it.lastX = e.clientX;
          it.spin = clamp(it.spin + dx * 0.35, -42, 42);
          kick(it);
        } else if (e.pointerType === 'mouse' && finePointer() && !reducedMotion()) {
          var r = it.box.getBoundingClientRect();
          it.tx = (e.clientX - r.left) / r.width - 0.5;
          it.ty = (e.clientY - r.top) / r.height - 0.5;
          kick(it);
        }
      });
      function release() {
        if (!it.dragging) return;
        it.dragging = false;
        el.classList.remove('is-dragging');
        if (reducedMotion()) { it.spin = 0; it.vel = 0; render(it); return; }
        kick(it);
      }
      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', release);
      el.addEventListener('lostpointercapture', release);
      el.addEventListener('pointerleave', function () { it.tx = 0; it.ty = 0; kick(it); });
    });

    // Only frames near the screen follow the scroll
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var it = items[frames.indexOf(entry.target)];
          if (it) it.near = entry.isIntersecting;
        });
      }, { rootMargin: '25% 0px' });
      frames.forEach(function (el) { io.observe(el); });
    }
    measureSides();
    window.addEventListener('resize', measureSides);

    onScroll(function (vh) {
      var reads = items.map(function (it) {
        if (!it.near) return null;
        var r = it.box.getBoundingClientRect();
        return clamp((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
      });
      return function () {
        items.forEach(function (it, i) {
          if (reads[i] === null) return;
          it.s = reads[i];
          if (!it.raf) render(it);
        });
      };
    });
  }

  /* ---------- Projects gallery: on wide screens the section pins under the header and the scroll
     slides the projects sideways, one scrolled pixel to one pixel of travel. Each card turns in 3D by
     its distance from the centre, like a coverflow, and the count and steps follow; each step
     jumps to its project. Elsewhere, under reduced motion, or when the screen is too short to hold a
     whole card, the projects stay a stacked list. Keyboard focus inside a card scrolls the page until
     that card is centred, so a focused link is never off to the side. ---------- */
  function initGallery() {
    var gallery = document.querySelector('[data-gallery]');
    if (!gallery || !('IntersectionObserver' in window)) return;
    var pin = gallery.querySelector('.gallery__pin');
    var track = gallery.querySelector('.projects');
    var progress = gallery.querySelector('.gallery__progress');
    var cards = Array.prototype.slice.call(track.children);
    var faces = cards.map(function (c) { return c.querySelector('.project__card'); });
    var steps = Array.prototype.slice.call(gallery.querySelectorAll('.gallery__step'));
    var count = gallery.querySelector('.gallery__count b');
    var query = window.matchMedia('(min-width: 1024px) and (min-height: 620px)');
    var on = false, top = 0, travel = 0, vw = 0, pinTop = 0, centres = [], current = -1;

    function setOn(next) {
      if (next === on) return;
      on = next;
      gallery.classList.toggle('is-active', on);
      if (on) return;
      gallery.style.height = '';
      track.style.transform = '';
      faces.forEach(function (f) { f.style.transform = ''; f.style.opacity = ''; });
      cards.forEach(function (c) { c.classList.remove('is-current'); });
      steps.forEach(function (s) { s.classList.remove('is-current'); s.removeAttribute('aria-current'); });
      current = -1;
    }

    function measure() {
      setOn(query.matches && !reducedMotion());
      // The pinned view must hold a whole card and the steps beneath it; if it cannot, keep the list
      if (on && track.offsetHeight + progress.offsetHeight + (parseFloat(window.getComputedStyle(pin).rowGap) || 0) > pin.clientHeight) setOn(false);
      if (!on) return;
      vw = pin.clientWidth;
      travel = Math.max(0, track.scrollWidth - vw);
      pinTop = parseFloat(window.getComputedStyle(pin).top) || 0;
      gallery.style.height = (pin.offsetHeight + travel) + 'px';
      top = gallery.getBoundingClientRect().top + window.scrollY;
      centres = cards.map(function (c) { return c.offsetLeft + c.offsetWidth / 2; });
      requestScrollFrame();
    }

    // The page position at which card i sits in the centre
    function scrollFor(i) {
      return top - pinTop + clamp((centres[i] - vw / 2) / travel, 0, 1) * travel;
    }

    onScroll(function () {
      if (!on) return null;
      var p = travel > 0 ? clamp((window.scrollY + pinTop - top) / travel, 0, 1) : 0;
      var x = -p * travel;
      var turns = centres.map(function (c) { return clamp((c + x - vw / 2) / (vw * 0.62), -1, 1); });
      var idx = Math.round(p * (cards.length - 1));
      return function () {
        track.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
        faces.forEach(function (f, i) {
          var t = turns[i], a = Math.abs(t);
          f.style.transform = 'rotateY(' + (-t * 24).toFixed(2) + 'deg) translateZ(' + (-a * 140).toFixed(1) + 'px) scale(' + (1 - a * 0.06).toFixed(4) + ')';
          f.style.opacity = (1 - a * 0.5).toFixed(3);
        });
        if (idx !== current) {
          if (cards[current]) cards[current].classList.remove('is-current');
          if (steps[current]) { steps[current].classList.remove('is-current'); steps[current].removeAttribute('aria-current'); }
          current = idx;
          cards[current].classList.add('is-current');
          if (steps[current]) { steps[current].classList.add('is-current'); steps[current].setAttribute('aria-current', 'step'); }
          if (count) count.textContent = String(current + 1);
        }
      };
    });

    steps.forEach(function (step, i) {
      step.addEventListener('click', function () {
        if (!on || travel <= 0) return;
        window.scrollTo({ top: scrollFor(i), behavior: 'smooth' });
      });
    });

    track.addEventListener('focusin', function (e) {
      if (!on) return;
      var i = cards.indexOf(e.target.closest('.project'));
      if (i < 0 || travel <= 0) return;
      // The browser scrolls a newly focused element into view after this event, so wait a frame,
      // then undo any offset it gave the clipped box and scroll the page to centre the card
      window.requestAnimationFrame(function () {
        pin.scrollLeft = 0;
        window.scrollTo({ top: scrollFor(i), behavior: 'auto' });
      });
    });

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    if (query.addEventListener) query.addEventListener('change', measure);
    window.addEventListener('motionchange', measure);
  }

  /* ---------- Tiles lean toward a mouse pointer in 3D and settle back when it leaves. One listener
     serves every [data-lean] element; bigger tiles lean less, so their far edge stays close to the page.
     The tile's box is measured when the pointer arrives, so its own lean never feeds back. ---------- */
  function initLean() {
    if (!finePointerQuery) return;
    var moving = [], current = null, box = null, raf = 0, last = 0;

    function state(el) {
      if (!el.leanState) el.leanState = { el: el, x: 0, y: 0, tx: 0, ty: 0, max: 4 };
      return el.leanState;
    }
    function frame(time) {
      raf = 0;
      var dt = last ? Math.min(0.05, (time - last) / 1000) : 1 / 60;
      last = time;
      var k = 1 - Math.exp(-dt * 10);
      moving = moving.filter(function (s) {
        s.x += (s.tx - s.x) * k;
        s.y += (s.ty - s.y) * k;
        var settled = Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) < 0.001;
        if (settled && !s.tx && !s.ty) { s.x = 0; s.y = 0; s.el.style.transform = ''; return false; }
        s.el.style.transform = 'perspective(900px) rotateX(' + (-s.y * s.max).toFixed(2) + 'deg) rotateY(' + (s.x * s.max).toFixed(2) + 'deg)';
        return !settled;
      });
      if (moving.length) raf = window.requestAnimationFrame(frame);
      else last = 0;
    }
    function track(s) {
      if (moving.indexOf(s) < 0) moving.push(s);
      if (!raf) raf = window.requestAnimationFrame(frame);
    }
    function release(el) {
      if (!el) return;
      var s = state(el);
      s.tx = 0; s.ty = 0;
      track(s);
    }

    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || !finePointer() || reducedMotion()) return;
      var el = e.target.closest ? e.target.closest('[data-lean]') : null;
      if (el !== current) { release(current); current = el; box = null; }
      if (!el) return;
      if (!box) box = el.getBoundingClientRect();
      var s = state(el);
      s.max = clamp(1100 / Math.max(box.width, box.height), 1.5, 6);
      s.tx = clamp((e.clientX - box.left) / box.width - 0.5, -0.5, 0.5) * 2;
      s.ty = clamp((e.clientY - box.top) / box.height - 0.5, -0.5, 0.5) * 2;
      // The tile's spotlight (styles.css) follows the pointer
      el.style.setProperty('--mx', (e.clientX - box.left).toFixed(0) + 'px');
      el.style.setProperty('--my', (e.clientY - box.top).toFixed(0) + 'px');
      track(s);
    }, { passive: true });
    // A scroll moves the tile under a still pointer, so measure it again on the next move
    window.addEventListener('scroll', function () { box = null; }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { release(current); current = null; });
  }

  /* ---------- Magnetic buttons: [data-magnet] buttons drift a few pixels toward a mouse pointer and
     settle back when it leaves. The offset uses the CSS translate property, so the press scale on
     transform stays independent. ---------- */
  function initMagnetic() {
    if (!finePointerQuery) return;
    Array.prototype.forEach.call(document.querySelectorAll('[data-magnet]'), function (btn) {
      var x = 0, y = 0, tx = 0, ty = 0, raf = 0, last = 0;
      function frame(time) {
        raf = 0;
        var dt = last ? Math.min(0.05, (time - last) / 1000) : 1 / 60;
        last = time;
        var k = 1 - Math.exp(-dt * 12);
        x += (tx - x) * k;
        y += (ty - y) * k;
        if (Math.abs(tx - x) + Math.abs(ty - y) < 0.05) { x = tx; y = ty; last = 0; }
        else raf = window.requestAnimationFrame(frame);
        btn.style.translate = (x || y) ? x.toFixed(2) + 'px ' + y.toFixed(2) + 'px' : '';
      }
      function kick() { if (!raf) raf = window.requestAnimationFrame(frame); }
      btn.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse' || !finePointer() || reducedMotion()) return;
        // Measure the resting box, without the button's own drift
        var r = btn.getBoundingClientRect();
        tx = ((e.clientX - (r.left - x)) / r.width - 0.5) * 10;
        ty = ((e.clientY - (r.top - y)) / r.height - 0.5) * 8;
        kick();
      });
      btn.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
    });
  }

  /* ---------- Continuous CSS animations (the auroras, the marquee) pause while out of view, so the
     compositor does no work for what nobody can see ---------- */
  function initIdleAnimations() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.target.classList.toggle('is-idle', !entry.isIntersecting); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.hero, .marquee, .contact__grid'), function (el) { io.observe(el); });
  }

  /* ---------- Animations switch: turns full motion on or off for this visitor and remembers it ---------- */
  function initMotionToggle() {
    var btn = document.querySelector('[data-motion-toggle]');
    if (!btn) return;
    function sync() { btn.setAttribute('aria-pressed', String(!reducedMotion())); }
    btn.hidden = false;
    sync();
    btn.addEventListener('click', function () { setMotion(reducedMotion() ? 'full' : 'reduced', true); });
    window.addEventListener('motionchange', sync);
  }

  /* ---------- Motion note: on a device that asks for reduced motion, a small prompt offers the full
     animations until the visitor chooses. Either answer is remembered, so it never returns. ---------- */
  function initMotionNote() {
    var note = document.querySelector('[data-motion-note]');
    if (!note) return;
    var answered = false;
    function update() {
      note.hidden = answered || !!savedMotion() || !reducedMotion() || !(motionQuery && motionQuery.matches);
    }
    note.querySelector('[data-motion-on]').addEventListener('click', function () {
      answered = true;
      setMotion('full', true);
      update();
    });
    note.querySelector('[data-motion-keep]').addEventListener('click', function () {
      answered = true;
      try { window.localStorage.setItem('motion', 'reduced'); } catch (e) { /* private mode: this visit only */ }
      update();
    });
    window.addEventListener('motionchange', function () { if (savedMotion()) answered = true; update(); });
    update();
  }

  /* ---------- Copy email: progressive enhancement, shown only when the Clipboard API exists ---------- */
  function initCopy() {
    var btn = document.querySelector('[data-copy]');
    var status = document.querySelector('.copy-status');
    if (!btn || !navigator.clipboard || !window.isSecureContext) return;
    btn.hidden = false;
    var timer = 0;
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () {
        if (status) status.textContent = 'Email copied';
      }, function () {
        if (status) status.textContent = 'Copy failed. Select the address instead.';
      }).then(function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () { if (status) status.textContent = ''; }, 2600);
      });
    });
  }

  function initYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ==========================================================================
     3D foundation (three.js)
     three.js loads once, after the page itself has loaded, and all three
     scenes share it. Each scene gets a "stage": a renderer sized to its host, a
     render loop that stops off screen or in a background tab, DPR capped at 2.
     ========================================================================== */
  function webglAvailable() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('Could not load ' + src)); };
      document.head.appendChild(s);
    });
  }

  var threeReady = null;
  /** Loads three.js after window load, in idle time, so it never delays first paint. */
  function loadThree() {
    if (!threeReady) {
      threeReady = new Promise(function (resolve, reject) {
        function start() {
          if (window.THREE) { resolve(window.THREE); return; }
          loadScript('assets/vendor/three.min.js').then(function () {
            if (window.THREE) resolve(window.THREE);
            else reject(new Error('three.js unavailable'));
          }, reject);
        }
        function schedule() {
          if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1200 });
          else window.setTimeout(start, 200);
        }
        if (document.readyState === 'complete') schedule();
        else window.addEventListener('load', schedule, { once: true });
      });
    }
    return threeReady;
  }

  /** sRGB colour as a shader vector. Custom shaders write it unconverted, so it renders exactly as the hex. */
  function srgb(THREE, hex) {
    return new THREE.Vector3(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255);
  }
  /** Mixes two hex colours: used to derive tone steps from the design tokens. */
  function mixHex(a, b, t) {
    function ch(c, s) { return (c >> s) & 255; }
    function m(s) { return Math.round(lerp(ch(a, s), ch(b, s), t)); }
    return (m(16) << 16) | (m(8) << 8) | m(0);
  }

  function createStage(host, fov) {
    var THREE = window.THREE;
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    host.insertBefore(renderer.domElement, host.firstChild);

    var stage = {
      renderer: renderer,
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(fov, 1, 0.1, 100),
      pixelRatio: pixelRatio,
      width: 0,
      height: 0,
      onScreen: true,
      update: null,       // (dt) → advance the scene
      afterRender: null,  // → position HTML labels
      onResize: null,     // (width, height)
      animating: function () { return true; }
    };
    var rafId = 0, last = 0, lost = false;

    function frame(time) {
      rafId = 0;
      if (lost) return;
      var dt = last ? Math.min(0.05, (time - last) / 1000) : 1 / 60;
      last = time;
      if (stage.update) stage.update(dt);
      renderer.render(stage.scene, stage.camera);
      if (stage.afterRender) stage.afterRender();
      if (stage.animating() && stage.onScreen && !document.hidden) rafId = window.requestAnimationFrame(frame);
      else last = 0;
    }
    stage.requestRender = function () {
      if (!rafId && !lost && stage.onScreen && !document.hidden) rafId = window.requestAnimationFrame(frame);
    };

    stage.resize = function () {
      var rect = host.getBoundingClientRect();
      var w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
      if (w === stage.width && h === stage.height) return;
      stage.width = w;
      stage.height = h;
      renderer.setSize(w, h, false);
      stage.camera.aspect = w / h;
      stage.camera.updateProjectionMatrix();
      if (stage.onResize) stage.onResize(w, h);
      stage.requestRender();
    };

    // Render only while on screen and while the tab is visible
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        stage.onScreen = entries[0].isIntersecting;
        if (stage.onScreen) stage.requestRender();
      }).observe(host);
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) stage.requestRender(); });
    window.addEventListener('motionchange', stage.requestRender);
    if ('ResizeObserver' in window) new ResizeObserver(stage.resize).observe(host);
    else window.addEventListener('resize', stage.resize);

    renderer.domElement.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      lost = true;
      host.classList.add('is-unavailable');
    });
    return stage;
  }

  /**
   * Drag to turn a model: az and el are camera offsets in radians, within range, that coast after
   * a flick and ease back to the framed view after a pause. A mouse over the model sets leanX and
   * leanY (−1 to 1) so it can lean toward the pointer. Call step(dt, still) once per frame.
   */
  function dragToTurn(host, stage, range) {
    var turn = { az: 0, el: 0, leanX: 0, leanY: 0 };
    var on = false, x = 0, y = 0, vaz = 0, idle = 0, tx = 0, ty = 0;
    host.addEventListener('pointerdown', function (e) {
      on = true; x = e.clientX; y = e.clientY; vaz = 0; idle = 0;
      host.classList.add('is-dragging');
      if (host.setPointerCapture) host.setPointerCapture(e.pointerId);
      stage.requestRender();
    });
    host.addEventListener('pointermove', function (e) {
      if (on) {
        vaz = -(e.clientX - x) * 0.006;
        turn.az = clamp(turn.az + vaz, -range.az, range.az);
        turn.el = clamp(turn.el + (e.clientY - y) * 0.004, range.down, range.up);
        x = e.clientX; y = e.clientY;
        stage.requestRender();
      } else if (e.pointerType === 'mouse' && finePointer()) {
        var r = host.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      }
    });
    function end() {
      if (!on) return;
      on = false;
      host.classList.remove('is-dragging');
      stage.requestRender();
    }
    host.addEventListener('pointerup', end);
    host.addEventListener('pointercancel', end);
    host.addEventListener('lostpointercapture', end);
    host.addEventListener('pointerleave', function () { tx = 0; ty = 0; });

    turn.moving = function () { return on || Math.abs(turn.az) + Math.abs(turn.el) > 0.001; };
    turn.step = function (dt, still) {
      if (on) {
        idle = 0;
      } else {
        turn.az = clamp(turn.az + vaz, -range.az, range.az);
        vaz *= Math.pow(0.9, dt * 60);
        idle += dt;
        if (idle > 3) {
          var back = Math.exp(-dt * 2.2);
          turn.az *= back; turn.el *= back;
        }
      }
      var k = 1 - Math.exp(-dt * 3);
      turn.leanX += ((still ? 0 : tx) - turn.leanX) * k;
      turn.leanY += ((still ? 0 : ty) - turn.leanY) * k;
    };
    return turn;
  }

  /** Round, anti-aliased points whose size is set in world units, so they shrink with distance. */
  var DOT_VERTEX = [
    'uniform float uTime;',
    'uniform float uSize;',
    'uniform float uHalfHeight;',
    'uniform float uRise;',
    'attribute float aDelay;',
    'attribute float aShade;',
    'attribute float aAlpha;',
    'varying float vAlpha;',
    'varying float vShade;',
    'varying float vFeather;',
    'void main() {',
    '  float k = clamp((uTime - aDelay) / 0.65, 0.0, 1.0);',
    '  float e = 1.0 - pow(1.0 - k, 3.0);',
    '  vec3 p = position;',
    '  p.y -= (1.0 - e) * uRise;',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  gl_PointSize = max(1.0, uSize * projectionMatrix[1][1] * uHalfHeight / -mv.z);',
    '  vAlpha = smoothstep(0.0, 0.6, k) * aAlpha;',
    '  vShade = aShade;',
    '  vFeather = clamp(1.5 / gl_PointSize, 0.02, 0.5);',
    '}'
  ].join('\n');
  var DOT_FRAGMENT = [
    'uniform vec3 uColor;',
    'uniform float uOpacity;',
    'varying float vAlpha;',
    'varying float vShade;',
    'varying float vFeather;',
    'void main() {',
    '  float r = length(gl_PointCoord - 0.5);',
    '  float a = 1.0 - smoothstep(0.5 - vFeather, 0.5, r);',
    '  if (a * vAlpha <= 0.001) discard;',
    '  gl_FragColor = vec4(uColor * vShade, a * vAlpha * uOpacity);',
    '}'
  ].join('\n');

  /** Lines drawn as thin tubes: they draw in along their length, and a bright pulse can travel along them. */
  var PATH_VERTEX = [
    'varying float vU;',
    'void main() {',
    '  vU = uv.x;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');
  var PATH_FRAGMENT = [
    'uniform vec3 uColor;',
    'uniform vec3 uHot;',
    'uniform float uDraw;',
    'uniform float uHead;',
    'uniform float uTail;',
    'uniform float uBase;',
    'uniform float uFadeEnd;',
    'varying float vU;',
    'void main() {',
    '  if (vU > uDraw) discard;',
    '  float d = uHead - vU;',
    '  float c = (d >= 0.0 && d <= uTail) ? 1.0 - d / uTail : 0.0;',
    '  c *= c;',
    '  float a = uBase + (1.0 - uBase) * c;',
    '  if (uFadeEnd > 0.0) a *= 1.0 - smoothstep(1.0 - uFadeEnd, 1.0, vU);',
    '  gl_FragColor = vec4(mix(uColor, uHot, c), a);',
    '}'
  ].join('\n');

  /** Flat three-tone shading (top, lit side, shaded side) with optional corrugation ribs:
      a technical-illustration look that needs no lights. Shared by the roadmap model and the yard. */
  var FACE_VERTEX = [
    'varying vec3 vN;',
    'varying vec3 vL;',
    'void main() {',
    '  vN = normalize(mat3(modelMatrix) * normal);',
    '  vL = position;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');
  var FACE_FRAGMENT = [
    'uniform vec3 uTop;',
    'uniform vec3 uLit;',
    'uniform vec3 uShade;',
    'uniform float uOpacity;',
    'uniform float uRibs;',
    'varying vec3 vN;',
    'varying vec3 vL;',
    'void main() {',
    '  vec3 n = normalize(vN);',
    '  vec3 c = n.y > 0.55 ? uTop : (abs(n.z) >= abs(n.x) ? uLit : uShade);',
    '  if (uRibs > 0.0 && abs(n.z) > 0.5) {',
    '    float rib = abs(fract(vL.x * uRibs) - 0.5);',
    '    c *= 0.93 + 0.16 * smoothstep(0.38, 0.5, rib);',
    '  }',
    '  gl_FragColor = vec4(c, uOpacity);',
    '}'
  ].join('\n');

  /** Positions HTML labels over a scene, kept inside its frame. */
  function makeLabels(container, className, texts) {
    return texts.map(function (text) {
      var el = document.createElement('span');
      el.className = className;
      el.textContent = text;
      if (container) container.appendChild(el);
      return { el: el, w: 0, h: 0, visible: false, x: 0, y: 0 };
    });
  }
  function measureLabels(labels) {
    labels.forEach(function (l) { l.w = l.el.offsetWidth; l.h = l.el.offsetHeight; });
  }
  function setLabel(l, x, y, visible) {
    l.x = x; l.y = y;
    l.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    if (visible !== l.visible) {
      l.visible = visible;
      l.el.classList.toggle('is-visible', visible);
    }
  }

  /* ==========================================================================
     Hero globe
     Land is drawn as dots sampled from a 240 × 120 land mask (1.5° cells),
     derived from the NOAA GLOBE dataset via the global-land-mask package.
     Arcs connect the places named in the caption. The canvas is decorative
     (aria-hidden); the figcaption carries the same information as text.
     On arrival the dots gather into the continents while the camera eases in;
     the globe then turns slowly, leans toward the pointer and recedes as the
     hero scrolls away. Under reduced motion it is still (it can be dragged).
     ========================================================================== */
  var LAND_MASK_W = 240, LAND_MASK_H = 120;
  var LAND_MASK = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/+H///4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP3/h/////AAAAAAAAAAAAOAAAAAAAAAAAAAAAAAADv4P////8AAAPgAAAAAAAAIAAAAAAAAAAAAAAAAAAPwP////8AAAAAAAAAAAAAMAAAAAAAAAAAAAAAZBhAAAH///8AAAAAAAACAAAP/4AAKAAAAAAAAAAIAAAAAAD///8AAAAAAAAYAAD//gAAAAAAAAAAAAAfwxkXYAB///wAAAAAAABgDA/////wAAAAAAAAAAAA/wMf/AAf//oAAAAAAAAgHfv////y/+AAAAA//gCAf8GGH4AP//wAAAAPwAAAHf////////+AggD/////gwXmF4AP/4AAAAD//gBf7r///////////6A////////+B/A//gAAAAH//4v//f///////////GH////////0D4Af4AHwAAPx+H///////////////AAf///////EA+AP4ABAAAfj////////////////+AD///////8AIAAHwAAAAD/P///////////////v4AD/5/////4APgAAgAAAAD/H//////////////wdAAA+AD////4APyAAAAAAAD/B////////////+ABgAAAEAAf///8AH/AAAAAAMAOD////////////4AHAAAAAAAf////gH/gAAAAAMAkP////////////wAPAAAAAAAH////+P/4AAAAASAgP////////////gAOAAAAAAAD////+P/8AAAAAzD//////////////8AMAAAAAAAB/////f/+AAAAAHn//////////////8AAAAAAAAAB//////9AAAAAAAf//////////////9AAAAAAAAAAP/////2HAAAAAB///////////////4AAAAAAAAAAf/////+AAAAAAB///////////////wAAAAAAAAAAP//////AAAAAAB///yf//////////wAAAAAAAAAAf/////yAAAAAAB+T/gP//////////AAAAAAAAAAAf/////gAAAAAA/wY/AD/////////4BAAAAAAAAAAf////+AAAAAAA/gGfHD/////////wAAAAAAAAAAAP////8AAAAAAA/AAY//////////hgEAAAAAAAAAAP////4AAAAAAA/AAM//////////gwEAAAAAAAAAAH////4AAAAAAAICgAW/////////4QcAAAAAAAAAAD////4AAAAAAAJ/gAA/////////ww4AAAAAAAAAAB////gAAAAAAAf/gAA/////////wAAAAAAAAAAAAA////AAAAAAAA//8IB/////////4EAAAAAAAAAAAAH///AAAAAAAA///fv/////////4AAAAAAAAAAAAAH/wBAAAAAAAB//////z///////4AAAAAAAAAAAAAL/gBAAAAAAAD////8/x///////wAAAAAAAAAAAAAB/gAAAAAAAAH////+/4P//////wAAAAAAAAAAAAAA/gAAAAAAAAP////+f8QH/////gAAAAAAAAAAAAAAfgAAAAAAAAf/////P/4D/////IAAAAAAAAAAAAAAPgAQAAAAAAf/////P/4B/8f/QAAAAAAAAAAAAAAAPgwAAAAAAAf/////n/4Af4P+AAAAAAAAAAAAAAAAHxgAgAAAAAf/////j/wAfwH8AAAAAAAAAAAAAAAAB/gAAAAAAAf/////z/AAfgH+AIAAAAAAAAAAAAAAADgAAAAAAAf/////x8AAfAB/AIAAAAAAAAAAAAAAAB8AAAAAAAf/////5wAAOAB/gAAAAAAAAAAAAAAAAAMAAAAAAAf/////+AAAOAAvgAAAAAAAAAAAAAAAAAEBQAAAAAP/////+EAAGAAHAAAAAAAAAAAAAAAAAACDfgAAAAH//////8AAGAACAAAAAAAAAAAAAAAAAAAP/wAAAAH//////4AABAAgABAAAAAAAAAAAAAAAAAP/4AAAAB//////4AABAAAABAAAAAAAAAAAAAAAAAH//gAAAAyD////wAAAAAYBgAAAAAAAAAAAAAAAAAH//wAAAAAA////gAAAABYDAAAAAAAAAAAAAAAAAAP//wAAAAAAf///AAAAAAoPAAAAAAAAAAAAAAAAAAf//wAAAAAA///+AAAAAA4fgAAAAAAAAAAAAAAAAA///8AAAAAA///8AAAAAAYfACAAAAAAAAAAAAAAAA////AAAAAAf//4AAAAAAcOICYAAAAAAAAAAAAAAA////8AAAAAf//wAAAAAAMAEA/AAAAAAAAAAAAAAA/////AAAAAP//wAAAAAAAAAAPgAAAAAAAAAAAAAAf////gAAAAH//wAAAAAABAAAHwAAAAAAAAAAAAAAf////gAAAAH//wAAAAAAAAAAHIAAAAAAAAAAAAAAP////AAAAAH//wAAAAAAAAAAAAAAAAAAAAAAAAAAP///+AAAAAH//4AAAAAAAAAAAAAAAAAAAAAAAAAAH///8AAAAAH//4AAAAAAAAAHgAAAAAAAAAAAAAAAH///8AAAAAP//4IAAAAAAAAnBAAAAAAAAAAAAAAAB///8AAAAAP//4YAAAAAAAB/jgAAAAAAAAAAAAAAA///8AAAAAP//g4AAAAAAAD/7gAAAAAAAAAAAAAAAf//4AAAAAP//A4AAAAAAAH//gAAAAAAAAAAAAAAAf//4AAAAAH/+AwAAAAAAAP//4AAAAAAAAAAAAAAAf//wAAAAAH/+BwAAAAAAB///4AAAAAAAAAAAAAAAf//AAAAAAD//BwAAAAAAD///8AAAAAAAAAAAAAAAf/8AAAAAAD/+AgAAAAAAD///+AAAAAAAAAAAAAAAf/4AAAAAAD/8AAAAAAAAD////AAAAAAAAAAAAAAAf/4AAAAAAB/8AAAAAAAAD////AAAAAAAAAAAAAAAf/4AAAAAAB/4AAAAAAAAB////AAAAAAAAAAAAAAA//wAAAAAAA/wAAAAAAAAB////AAAAAAAAAAAAAAA//gAAAAAAA/gAAAAAAAAB/B/+AAAAAAAAAAAAAAA//AAAAAAAA+AAAAAAAAABwAv+AAAAAAAAAAAAAAA/4AAAAAAAAAAAAAAAAAAAAAH8AAAAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAAAH8AAAAAAAAAAAAAAB/4AAAAAAAAAAAAAAAAAAAAABQAAGAAAAAAAAAAAB/AAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAB+AAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAQAAgAAAAAAAAAAAB8AAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAADwAAAD/MAHwAAAAAAAAAAAAAAAAEAAAAAAAAAAAB//8B///////wAAAAAAAAAAAAAAA3AAAAAAAAAADP//8H////////8AAAAAAAAAAAAAAXgAAAAAQf//////8//////////8AAAAAAAAABAAAHgAAAAD///////////////////+AAAAAAAAAB////gAAAAf///////////////////wAAAAAf///////8AAAAD////////////////////AAAAAD///////4AAAAH/////////////////////gAAAA////////AAAHgf/////////////////////AAAAAP///////4AAPAD////////////////////+AAAAA/////////8AAP//////////////////////AAAAH//////////H////////////////////////8A/AAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////';

  var PLACES = {
    delhi:   { name: 'Delhi',          lat: 28.61, lon: 77.21,  side: 'left'  },
    lucknow: { name: 'Lucknow',        lat: 26.85, lon: 80.95,  side: 'right' },
    mumbai:  { name: 'Mumbai',         lat: 19.08, lon: 72.88,  side: 'left'  },
    uganda:  { name: 'Uganda',         lat: 1.37,  lon: 32.29,  side: 'right' },
    eu:      { name: 'EU market',      lat: 50.85, lon: 4.35,   side: 'left'  },
    varna:   { name: 'Varna',          lat: 43.21, lon: 27.91,  side: 'right' },
    dc:      { name: 'Washington, DC', lat: 38.90, lon: -77.04, side: 'right' }
  };
  // [from, to, primary?] — Uganda → EU is the coffee export lane
  var ARCS = [
    ['uganda', 'eu', true],
    ['dc', 'uganda', false],
    ['delhi', 'varna', false],
    ['delhi', 'mumbai', false],
    ['delhi', 'lucknow', false]
  ];

  function decodeMask() {
    var bin = window.atob(LAND_MASK);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return function isLand(lat, lon) {
      var r = Math.min(LAND_MASK_H - 1, Math.max(0, Math.floor((90 - lat) / 180 * LAND_MASK_H)));
      var c = Math.min(LAND_MASK_W - 1, Math.max(0, Math.floor((lon + 180) / 360 * LAND_MASK_W)));
      var idx = r * LAND_MASK_W + c;
      return ((bytes[idx >> 3] >> (7 - (idx & 7))) & 1) === 1;
    };
  }

  function initGlobe() {
    var host = document.querySelector('[data-globe]');
    if (!host) return;
    if (!webglAvailable()) { host.classList.add('is-unavailable'); return; }
    loadThree().then(function () { buildGlobe(host); }).catch(function (err) {
      host.classList.add('is-unavailable');
      warn('globe', err);
    });
  }

  function buildGlobe(host) {
    var THREE = window.THREE;
    // Lanes in cyan (the coffee export lane in emerald), places in amber, land shaded blue to cyan
    var COLOR_LANE = 0x8FB4FF, COLOR_EXPORT = 0xE8EEFF, COLOR_HOT = 0xFFFFFF, COLOR_PLACE = 0xE3AE55;
    var R = 1;
    var small = window.innerWidth < 600;
    var baseZ = small ? 4.2 : 4.6;
    var rand = seeded(1729);

    var stage = createStage(host, 32);
    var scene = stage.scene, camera = stage.camera;
    camera.position.set(0, 0, baseZ);

    // rig: leans toward the pointer · tilt: fixed lean plus vertical drag · spin: turning
    var rig = new THREE.Group();
    var tilt = new THREE.Group();
    var spin = new THREE.Group();
    tilt.rotation.x = 0.36;
    rig.add(tilt);
    tilt.add(spin);
    scene.add(rig);

    function toVec3(lat, lon, radius) {
      var phi = (90 - lat) * DEG;
      var theta = (lon + 180) * DEG;
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    // Ocean body: opaque, so dots and arcs on the far side are hidden by depth
    spin.add(new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.985, 64, 48),
      new THREE.MeshBasicMaterial({ color: 0x0C1C36 })
    ));

    // Atmosphere: a halo just outside the outline that fades to nothing, and a bright rim on the
    // globe's own edge. Both add light (premultiplied, additive), so they glow over the page behind.
    var glowVertex = [
      'varying vec3 vN;',
      'varying vec3 vV;',
      'void main() {',
      '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
      '  vN = normalize(normalMatrix * normal);',
      '  vV = normalize(-mv.xyz);',
      '  gl_Position = projectionMatrix * mv;',
      '}'
    ].join('\n');
    function glowMaterial(fragment, color, side) {
      var m = new THREE.ShaderMaterial({
        uniforms: { uColor: { value: srgb(THREE, color) }, uStrength: { value: 0 } },
        vertexShader: glowVertex,
        fragmentShader: fragment,
        side: side,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
      });
      m.premultipliedAlpha = true;
      return m;
    }
    var haloMat = glowMaterial([
      'uniform vec3 uColor;',
      'uniform float uStrength;',
      'varying vec3 vN;',
      'varying vec3 vV;',
      'void main() {',
      '  float k = pow(clamp(-dot(normalize(vN), normalize(vV)), 0.0, 1.0), 1.7) * uStrength;',
      '  gl_FragColor = vec4(uColor * k, k);',
      '}'
    ].join('\n'), 0x3F74E0, THREE.BackSide);
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.2, 64, 48), haloMat));
    var rimMat = glowMaterial([
      'uniform vec3 uColor;',
      'uniform float uStrength;',
      'varying vec3 vN;',
      'varying vec3 vV;',
      'void main() {',
      '  float k = pow(1.0 - clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0), 3.2) * uStrength;',
      '  gl_FragColor = vec4(uColor * k, k);',
      '}'
    ].join('\n'), 0x8FB4FF, THREE.FrontSide);
    var rim = new THREE.Mesh(new THREE.SphereGeometry(R * 1.002, 64, 48), rimMat);
    rim.renderOrder = 4;
    scene.add(rim);

    // Silhouette ring: a faint hairline laid exactly on the sphere's visible outline, facing the camera
    var ringMat = new THREE.MeshBasicMaterial({ color: 0xBFD3FF, transparent: true, opacity: 0, depthWrite: false });
    var silhouette = new THREE.Mesh(new THREE.RingGeometry(1, 1.006, 192), ringMat);
    scene.add(silhouette);
    function placeSilhouette() {
      var d = camera.position.z;
      silhouette.position.set(0, 0, (R * R) / d);
      silhouette.scale.setScalar(R * Math.sqrt(1 - (R * R) / (d * d)) * 1.004);
    }

    // Land dots on a Fibonacci sphere; each starts a little above the surface and settles,
    // in a wave that spreads out from the side facing the viewer
    var isLand = decodeMask();
    var N = small ? 11000 : 18000;
    var golden = Math.PI * (3 - Math.sqrt(5));
    var focus = toVec3(20.6, 45, 1).normalize();
    var land = [], delays = [], lifts = [];
    for (var i = 0; i < N; i++) {
      var y = 1 - 2 * (i + 0.5) / N;
      var rad = Math.sqrt(1 - y * y);
      var t = i * golden;
      var x = Math.cos(t) * rad, z = Math.sin(t) * rad;
      var lat = Math.asin(y) / DEG;
      var lon = Math.atan2(z, -x) / DEG - 180;
      if (lon < -180) lon += 360;
      if (!isLand(lat, lon)) continue;
      land.push(x * R, y * R, z * R);
      var away = Math.acos(clamp(x * focus.x + y * focus.y + z * focus.z, -1, 1)) / Math.PI;
      delays.push(away * 0.55 + rand() * 0.12);
      lifts.push(0.06 + rand() * 0.3);
    }
    var dotCanvas = document.createElement('canvas');
    dotCanvas.width = dotCanvas.height = 64;
    var ctx = dotCanvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(32, 32, 28, 0, Math.PI * 2); ctx.fill();

    var landGeo = new THREE.BufferGeometry();
    landGeo.setAttribute('position', new THREE.Float32BufferAttribute(land, 3));
    landGeo.setAttribute('aDelay', new THREE.Float32BufferAttribute(delays, 1));
    landGeo.setAttribute('aLift', new THREE.Float32BufferAttribute(lifts, 1));
    var intro = { value: 0 };
    // Built-in materials expect working (linear) colour, which THREE.Color converts to from hex
    var landSouth = { value: new THREE.Color(0x4F7FE0) }, landNorth = { value: new THREE.Color(0x9DBBFF) };
    var landMat = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: small ? 0.05 : 0.042,
      sizeAttenuation: true,
      map: new THREE.CanvasTexture(dotCanvas),
      transparent: true,
      alphaTest: 0.35,
      depthWrite: false
    });
    // Extends the stock points shader: the gathering intro, dots that thin and dim toward the rim,
    // and a tint from blue in the south to cyan in the north
    landMat.onBeforeCompile = function (shader) {
      shader.uniforms.uIntro = intro;
      shader.uniforms.uSouth = landSouth;
      shader.uniforms.uNorth = landNorth;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', [
          '#include <common>',
          'attribute float aDelay;',
          'attribute float aLift;',
          'uniform float uIntro;',
          'varying float vShade;',
          'varying float vLat;'
        ].join('\n'))
        .replace('#include <begin_vertex>', [
          '#include <begin_vertex>',
          'vLat = normalize(position).y;',
          'float kIn = clamp((uIntro - aDelay) / 0.5, 0.0, 1.0);',
          'float eIn = 1.0 - pow(1.0 - kIn, 4.0);',
          'transformed *= 1.0 + aLift * (1.0 - eIn);'
        ].join('\n'))
        .replace('#include <project_vertex>', [
          '#include <project_vertex>',
          'vec3 nView = normalize(normalMatrix * normalize(position));',
          'float facing = clamp(dot(nView, normalize(-mvPosition.xyz)), 0.0, 1.0);',
          'vShade = smoothstep(0.0, 0.7, kIn) * mix(0.55, 1.0, smoothstep(0.0, 0.5, facing));'
        ].join('\n'))
        .replace('#include <logdepthbuf_vertex>', [
          'gl_PointSize *= mix(0.62, 1.0, smoothstep(0.0, 0.45, facing));',
          '#include <logdepthbuf_vertex>'
        ].join('\n'));
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying float vShade;\nvarying float vLat;\nuniform vec3 uSouth;\nuniform vec3 uNorth;')
        .replace('#include <alphatest_fragment>', [
          '#include <alphatest_fragment>',
          'diffuseColor.rgb *= mix(uSouth, uNorth, smoothstep(-0.55, 0.8, vLat));',
          'diffuseColor.a *= vShade;'
        ].join('\n'));
    };
    spin.add(new THREE.Points(landGeo, landMat));

    // Place markers: an amber dot that lands with a small settle, and a pulsing ring flat on the surface
    var markers = {};
    var dotGeo = new THREE.SphereGeometry(0.014, 16, 12);
    var ringGeo = new THREE.RingGeometry(0.018, 0.026, 40);
    var zAxis = new THREE.Vector3(0, 0, 1);
    Object.keys(PLACES).forEach(function (key, order) {
      var p = PLACES[key];
      var pos = toVec3(p.lat, p.lon, R * 1.004);
      var dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: COLOR_PLACE, transparent: true, opacity: 0 }));
      dot.position.copy(pos);
      spin.add(dot);

      var ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
        color: COLOR_PLACE, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false
      }));
      ring.position.copy(pos).multiplyScalar(1.002);
      ring.quaternion.setFromUnitVectors(zAxis, pos.clone().normalize());
      spin.add(ring);

      markers[key] = { dot: dot, ring: ring, phase: rand() * Math.PI * 2, appear: 1.0 + order * 0.07, shown: 0 };
    });

    // Arcs along great circles, lifted in proportion to distance. Each draws in once,
    // then a short bright pulse carries a traveller along it, like a shipment on its lane.
    var arcs = ARCS.map(function (def, idx) {
      var a = toVec3(PLACES[def[0]].lat, PLACES[def[0]].lon, 1).normalize();
      var b = toVec3(PLACES[def[1]].lat, PLACES[def[1]].lon, 1).normalize();
      var omega = Math.acos(clamp(a.dot(b), -1, 1));
      var lift = 0.04 + 0.24 * (omega / Math.PI);
      var segs = Math.max(24, Math.round(omega * 64));
      var pts = [];
      for (var s = 0; s <= segs; s++) {
        var u = s / segs;
        var v = omega < 1e-4 ? a.clone() :
          a.clone().multiplyScalar(Math.sin((1 - u) * omega) / Math.sin(omega))
            .add(b.clone().multiplyScalar(Math.sin(u * omega) / Math.sin(omega)));
        pts.push(v.normalize().multiplyScalar(R * (1.006 + lift * Math.sin(Math.PI * u))));
      }
      var primary = def[2];
      var curve = new THREE.CatmullRomCurve3(pts);
      var mat = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: srgb(THREE, primary ? COLOR_EXPORT : COLOR_LANE) },
          uHot: { value: srgb(THREE, COLOR_HOT) },
          uDraw: { value: 0 },
          uHead: { value: -1 },
          uTail: { value: primary ? 0.24 : 0.18 },
          uBase: { value: primary ? 0.9 : 0.55 },
          uFadeEnd: { value: 0 }
        },
        vertexShader: PATH_VERTEX,
        fragmentShader: PATH_FRAGMENT,
        transparent: true,
        depthWrite: false
      });
      var tube = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(64, segs * 2), primary ? 0.0048 : 0.0032, 6, false), mat);
      tube.renderOrder = 2;
      spin.add(tube);

      var traveller = new THREE.Mesh(
        new THREE.SphereGeometry(primary ? 0.016 : 0.011, 12, 10),
        new THREE.MeshBasicMaterial({ color: COLOR_HOT, transparent: true, opacity: 0 })
      );
      traveller.renderOrder = 3;
      spin.add(traveller);

      return {
        curve: curve, mat: mat, traveller: traveller,
        speed: primary ? 0.16 : 0.11 + (idx % 3) * 0.02,
        tail: mat.uniforms.uTail.value,
        rest: 0.3 + idx * 0.07,
        drawDelay: 1.3 + idx * 0.18,
        cycle: idx * 0.31
      };
    });

    // HTML labels, positioned from projected marker positions
    var keys = Object.keys(PLACES);
    var labels = makeLabels(host.querySelector('[data-globe-labels]'), 'globe__label',
      keys.map(function (key) { return PLACES[key].name; }));

    // Initial view: centred near 45°E so India, East Africa and Europe face the viewer
    var startSpin = -(45 + 90) * DEG;

    // Hero position, for the scroll response
    var hero = document.getElementById('top') || host;
    var heroTop = 0, heroH = 1;
    function measureHero() {
      var r = hero.getBoundingClientRect();
      heroTop = r.top + window.scrollY;
      heroH = Math.max(1, r.height);
    }

    stage.onResize = function () {
      measureLabels(labels);
      measureHero();
    };

    // Drag to rotate, with inertia
    var dragging = false, lastX = 0, lastY = 0, velocity = 0, idleTimer = 0, userIdle = true, spinBase = 0;
    host.addEventListener('pointerdown', function (e) {
      dragging = true; userIdle = false;
      lastX = e.clientX; lastY = e.clientY; velocity = 0;
      host.classList.add('is-dragging');
      if (host.setPointerCapture) host.setPointerCapture(e.pointerId);
      window.clearTimeout(idleTimer);
      stage.requestRender();
    });
    host.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      velocity = dx * 0.006;
      spinBase += velocity;
      tilt.rotation.x = clamp(tilt.rotation.x + dy * 0.004, -0.2, 0.9);
      stage.requestRender();
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      host.classList.remove('is-dragging');
      idleTimer = window.setTimeout(function () { userIdle = true; stage.requestRender(); }, 2500);
      stage.requestRender();
    }
    host.addEventListener('pointerup', endDrag);
    host.addEventListener('pointercancel', endDrag);
    host.addEventListener('lostpointercapture', endDrag);

    // The globe leans gently toward a mouse pointer anywhere over the hero
    var lean = { x: 0, y: 0, tx: 0, ty: 0 };
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || !finePointer()) return;
      lean.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      lean.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    hero.addEventListener('pointerleave', function () { lean.tx = 0; lean.ty = 0; });

    var clock = 0, scrolled = 0;
    var tmp = new THREE.Vector3(), toCamera = new THREE.Vector3();

    stage.animating = function () {
      return !reducedMotion() || dragging || Math.abs(velocity) > 0.0001;
    };

    stage.update = function (dt) {
      var still = reducedMotion();
      clock = still ? Math.max(clock, 60) : clock + dt;
      var t = clock;

      // Intro: dots gather, the camera eases in and the globe turns into place
      intro.value = Math.min(1.2, t / 1.6);
      var arrive = easeOut(clamp(t / 2.4, 0, 1));
      var turnIn = -0.55 * (1 - easeOut(clamp(t / 2.8, 0, 1)));

      if (!dragging) {
        if (Math.abs(velocity) > 0.0001) { spinBase += velocity * dt * 60; velocity *= Math.pow(0.94, dt * 60); }
        else if (userIdle && !still) spinBase += dt * 0.07;
      }

      // Pointer lean and scroll depth, eased so they never feel attached to the input
      var k = 1 - Math.exp(-dt * 3.5);
      lean.x += ((still ? 0 : lean.tx) - lean.x) * k;
      lean.y += ((still ? 0 : lean.ty) - lean.y) * k;
      var p = still ? 0 : clamp((window.scrollY - heroTop) / heroH, 0, 1);
      scrolled += (p - scrolled) * (1 - Math.exp(-dt * 8));

      rig.rotation.y = lean.x * 0.12;
      rig.rotation.x = lean.y * 0.07;
      spin.rotation.y = startSpin + spinBase + turnIn + scrolled * 0.6;
      camera.position.z = baseZ + 1.1 * (1 - arrive) + scrolled * 0.8;
      placeSilhouette();
      ringMat.opacity = 0.14 * smoothstep(0.4, 1.5, t);
      // The atmosphere brightens as the globe gathers
      var air = smoothstep(0.2, 1.6, t);
      haloMat.uniforms.uStrength.value = 0.85 * air;
      rimMat.uniforms.uStrength.value = 0.9 * air;

      keys.forEach(function (key) {
        var m = markers[key];
        m.shown = clamp((t - m.appear) / 0.5, 0, 1);
        m.dot.scale.setScalar(0.55 + 0.45 * easeOutBack(m.shown));
        m.dot.material.opacity = smoothstep(0, 0.4, m.shown);
        var pulse = still ? 0.5 : (Math.sin(t * 2.2 + m.phase) + 1) / 2;
        var rs = 1 + pulse * 0.9;
        m.ring.scale.set(rs, rs, rs);
        m.ring.material.opacity = (0.65 - pulse * 0.45) * m.shown;
      });

      arcs.forEach(function (arc) {
        var drawn = easeInOut(clamp((t - arc.drawDelay) / 1.1, 0, 1));
        arc.mat.uniforms.uDraw.value = drawn;
        var head = -1;
        if (still) {
          // Reduced motion: no pulse; the traveller rests at the middle of its lane
          arc.traveller.position.copy(arc.curve.getPointAt(0.5));
          arc.traveller.material.opacity = drawn;
        } else if (drawn >= 1) {
          arc.cycle += dt * arc.speed;
          head = arc.cycle % (1 + arc.tail + arc.rest); // runs past the end so the tail leaves, then rests
          if (head <= 1) {
            arc.traveller.position.copy(arc.curve.getPointAt(head));
            arc.traveller.material.opacity = smoothstep(0, 0.04, head) * (1 - smoothstep(0.95, 1, head));
          } else {
            arc.traveller.material.opacity = 0;
          }
        } else {
          arc.traveller.material.opacity = 0;
        }
        arc.mat.uniforms.uHead.value = head;
      });
    };

    var placedLabels = [];
    stage.afterRender = function () {
      var w = stage.width, h = stage.height;
      placedLabels.length = 0;
      keys.forEach(function (key, i) {
        var l = labels[i];
        // Facing = how directly the surface at the marker looks at the camera (the globe sits at the origin)
        markers[key].dot.getWorldPosition(tmp);
        toCamera.subVectors(camera.position, tmp).normalize();
        var facing = toCamera.dot(tmp.normalize());
        markers[key].dot.getWorldPosition(tmp);
        tmp.project(camera);
        var sx = (tmp.x * 0.5 + 0.5) * w;
        var sy = (-tmp.y * 0.5 + 0.5) * h;
        var left = PLACES[key].side === 'left';
        var ly = sy - 11;
        // Keep labels inside the frame; if one would cover a label already placed (close places such as
        // Delhi and Lucknow), try the other side of its marker, and only then move it below
        function at(onLeft) { return clamp(sx + (onLeft ? -(l.w + 10) : 10), 2, w - l.w - 2); }
        function hits(x, y) {
          return placedLabels.some(function (o) { return x < o.x + o.w + 3 && x + l.w + 3 > o.x && y < o.y + o.h + 3 && y + l.h + 3 > o.y; });
        }
        var lx = at(left);
        var visible = facing > 0.28 && markers[key].shown > 0.6;
        if (visible) {
          // First clear spot nearest the marker: its own side, the other side, then just above, then just below
          var step = l.h + 4;
          var spots = [[at(left), ly], [at(!left), ly], [at(left), ly - step], [at(left), ly + step]];
          var pick = spots[spots.length - 1];
          for (var n = 0; n < spots.length; n++) {
            var y = clamp(spots[n][1], 2, h - l.h - 2);
            if (!hits(spots[n][0], y)) { pick = [spots[n][0], y]; break; }
          }
          lx = pick[0];
          ly = clamp(pick[1], 2, h - l.h - 2);
          placedLabels.push({ x: lx, y: ly, w: l.w, h: l.h });
        }
        setLabel(l, lx, ly, visible);
      });
    };

    // Labels are measured in the web font, so place them again once it has arrived
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measureLabels(labels); stage.requestRender(); });
    stage.resize();
    measureHero();
    host.classList.add('is-ready');
    stage.requestRender();
  }

  /* ==========================================================================
     Capacity-roadmap model
     A small 3D model of the cooperative's export supply chain, built only from
     the resume figures: 2,000 smallholder farms, washing stations from 3 to 6
     (recommended) and a roadmap to 20 export containers (384 MT) a year for
     the EU market. Solid = in place; dashed outline = recommended or roadmap.
     It assembles when it scrolls into view, can be dragged to turn it, and is
     still under reduced motion. The figcaption carries the same facts.
     ========================================================================== */
  var ROADMAP = { farms: 2000, stationsNow: 3, stationsRecommended: 3, containers: 20 };

  function initRoadmap() {
    var host = document.querySelector('[data-roadmap]');
    if (!host) return;
    if (!webglAvailable()) { host.classList.add('is-unavailable'); return; }
    var started = false;
    function start() {
      if (started) return;
      started = true;
      loadThree().then(function () { buildRoadmap(host); }).catch(function (err) {
        host.classList.add('is-unavailable');
        warn('roadmap', err);
      });
    }
    // Build shortly before the model scrolls into view
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { io.disconnect(); start(); }
      }, { rootMargin: '800px 0px' });
      io.observe(host);
    } else {
      start();
    }
  }

  function buildRoadmap(host) {
    var THREE = window.THREE;
    var rand = seeded(2000);
    var stage = createStage(host, 26);
    var scene = stage.scene, camera = stage.camera;

    // Colour-coded by role: farms in a muted green, washing stations cobalt, the container roadmap in
    // muted amber, lanes pale cobalt with amber flow; the recommended stations stay dark with dashed edges
    var NAVY = 0x0C1A2C, BLUE = 0x5B8DEF, CYAN = 0x8FB4FF, AMBER = 0xE3AE55;
    var C = {
      farm: 0x6FBF9A,
      grid: mixHex(NAVY, CYAN, 0.16),
      pad: mixHex(NAVY, 0x07111F, 0.7),
      solidTop: mixHex(BLUE, 0xFFFFFF, 0.18),
      solidLit: BLUE,
      solidShade: mixHex(BLUE, NAVY, 0.42),
      solidEdge: 0xB9D3FF,
      ghostTop: mixHex(NAVY, CYAN, 0.16),
      ghostLit: mixHex(NAVY, CYAN, 0.1),
      ghostShade: mixHex(NAVY, CYAN, 0.05),
      ghostEdge: CYAN,
      boxTop: mixHex(NAVY, AMBER, 0.26),
      boxLit: mixHex(NAVY, AMBER, 0.17),
      boxShade: mixHex(NAVY, AMBER, 0.09),
      boxEdge: AMBER,
      road: mixHex(NAVY, CYAN, 0.55),
      accent: AMBER,
      accentBright: 0xF0C77E
    };

    // Layout in world units; the flow runs along +x
    var FARM = { x: -3.3, z: 0, rx: 1.55, rz: 1.72 };
    var ST = { x: -0.75, w: 0.46, d: 0.5, h: 0.2, roof: 0.13, pitch: 0.62 };
    var BOX = { x: 1.8, l: 0.62, w: 0.25, h: 0.26, gap: 0.025 };
    var LANE_END = new THREE.Vector3(4.3, 0, 0.5);

    var world = new THREE.Group();
    scene.add(world);

    function terrain(x, z) {
      var dx = (x - FARM.x) / FARM.rx, dz = (z - FARM.z) / FARM.rz;
      var fall = 1 - smoothstep(0.5, 1.08, Math.sqrt(dx * dx + dz * dz));
      var hills = 0.5 + 0.5 * Math.sin(x * 2.1 + 0.8) * Math.cos(z * 1.7 - 0.3);
      var ripple = 0.5 + 0.5 * Math.sin(x * 4.3 - z * 3.1 + 1.1);
      return fall * (0.3 * hills + 0.08 * ripple);
    }

    // Shared shaders
    var dotUniforms = [];
    function dotMaterial(color, size, rise) {
      var u = {
        uTime: { value: 0 }, uSize: { value: size }, uHalfHeight: { value: 300 }, uRise: { value: rise },
        uColor: { value: srgb(THREE, color) }, uOpacity: { value: 1 }
      };
      dotUniforms.push(u);
      return new THREE.ShaderMaterial({
        uniforms: u, vertexShader: DOT_VERTEX, fragmentShader: DOT_FRAGMENT,
        transparent: true, depthWrite: false
      });
    }
    function faceMaterial(top, lit, shade, ribs) {
      return new THREE.ShaderMaterial({
        uniforms: {
          uTop: { value: srgb(THREE, top) }, uLit: { value: srgb(THREE, lit) }, uShade: { value: srgb(THREE, shade) },
          uOpacity: { value: 0 }, uRibs: { value: ribs || 0 }
        },
        vertexShader: FACE_VERTEX, fragmentShader: FACE_FRAGMENT,
        transparent: true
      });
    }
    function edges(geo, color, dashed, dash) {
      var mat = dashed
        ? new THREE.LineDashedMaterial({ color: color, dashSize: dash || 0.045, gapSize: (dash || 0.045) * 0.6, transparent: true, opacity: 0 })
        : new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0 });
      var lines = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), mat);
      if (dashed) lines.computeLineDistances();
      return lines;
    }
    function pad(w, d, x, z) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, d),
        new THREE.MeshBasicMaterial({ color: C.pad, transparent: true, opacity: 0, depthWrite: false }));
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, 0.001, z);
      world.add(m);
      return m;
    }

    // Ground: a faint dot grid gives the model a floor and a sense of scale
    var grid = [], gridDelay = [], gridShade = [], gridAlpha = [];
    for (var gx = -5.6; gx <= 5.6; gx += 0.25) {
      for (var gz = -2.25; gz <= 2.25; gz += 0.25) {
        grid.push(gx, 0, gz);
        gridDelay.push((gx + 5.6) / 11.2 * 0.5);
        gridShade.push(1); gridAlpha.push(1);
      }
    }
    var gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(grid, 3));
    gridGeo.setAttribute('aDelay', new THREE.Float32BufferAttribute(gridDelay, 1));
    gridGeo.setAttribute('aShade', new THREE.Float32BufferAttribute(gridShade, 1));
    gridGeo.setAttribute('aAlpha', new THREE.Float32BufferAttribute(gridAlpha, 1));
    world.add(new THREE.Points(gridGeo, dotMaterial(C.grid, 0.016, 0)));

    // 2,000 smallholder farms: evenly spaced dots (Poisson disc) over rolling hills
    function placeFarms(count) {
      var minD = 0.048, pts = [];
      for (var attempt = 0; attempt < 6 && pts.length < count; attempt++) {
        pts = [];
        var cell = minD / Math.SQRT2, cells = {}, tries = 0;
        while (pts.length < count && tries < count * 60) {
          tries++;
          var a = rand() * Math.PI * 2, rr = Math.sqrt(rand());
          var edge = 1 + 0.1 * Math.sin(a * 5 + 1.3) + 0.05 * Math.sin(a * 9 + 0.4);
          var x = FARM.x + Math.cos(a) * rr * FARM.rx * edge;
          var z = FARM.z + Math.sin(a) * rr * FARM.rz * edge;
          var cx = Math.floor(x / cell), cz = Math.floor(z / cell), ok = true;
          for (var i = -2; i <= 2 && ok; i++) {
            for (var j = -2; j <= 2 && ok; j++) {
              var q = cells[(cx + i) + ',' + (cz + j)];
              if (q && (q[0] - x) * (q[0] - x) + (q[1] - z) * (q[1] - z) < minD * minD) ok = false;
            }
          }
          if (!ok) continue;
          var pt = [x, z];
          cells[cx + ',' + cz] = pt;
          pts.push(pt);
        }
        minD *= 0.88;
      }
      return pts.slice(0, count);
    }
    var farmPts = placeFarms(ROADMAP.farms);
    var farmPos = [], farmDelay = [], farmShade = [], farmAlpha = [];
    farmPts.forEach(function (p) {
      farmPos.push(p[0], terrain(p[0], p[1]) + 0.012, p[1]);
      farmDelay.push(0.05 + (p[0] - (FARM.x - FARM.rx)) / (FARM.rx * 2) * 0.75 + rand() * 0.25);
      farmShade.push(0.72 + rand() * 0.28);
      farmAlpha.push(1);
    });
    var farmGeo = new THREE.BufferGeometry();
    farmGeo.setAttribute('position', new THREE.Float32BufferAttribute(farmPos, 3));
    farmGeo.setAttribute('aDelay', new THREE.Float32BufferAttribute(farmDelay, 1));
    farmGeo.setAttribute('aShade', new THREE.Float32BufferAttribute(farmShade, 1));
    farmGeo.setAttribute('aAlpha', new THREE.Float32BufferAttribute(farmAlpha, 1));
    world.add(new THREE.Points(farmGeo, dotMaterial(C.farm, 0.03, 0.22)));

    // Washing stations: one row across the flow. The three nearest are in place (solid);
    // the three beyond are the recommended expansion (dashed outline).
    var bodyGeo = new THREE.BoxGeometry(ST.w, ST.h, ST.d);
    bodyGeo.translate(0, ST.h / 2, 0);
    var roofShape = new THREE.Shape();
    roofShape.moveTo(-ST.w / 2 - 0.02, 0);
    roofShape.lineTo(ST.w / 2 + 0.02, 0);
    roofShape.lineTo(0, ST.roof);
    roofShape.lineTo(-ST.w / 2 - 0.02, 0);
    var roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: ST.d + 0.04, bevelEnabled: false });
    roofGeo.translate(0, ST.h, -(ST.d + 0.04) / 2);

    var stations = [];
    var total = ROADMAP.stationsNow + ROADMAP.stationsRecommended;
    for (var s = 0; s < total; s++) {
      var recommended = s < ROADMAP.stationsRecommended;
      var sz = (s - (total - 1) / 2) * ST.pitch;
      var g = new THREE.Group();
      g.position.set(ST.x, 0, sz);
      var mat = recommended
        ? faceMaterial(C.ghostTop, C.ghostLit, C.ghostShade)
        : faceMaterial(C.solidTop, C.solidLit, C.solidShade);
      var lines = [
        edges(bodyGeo, recommended ? C.ghostEdge : C.solidEdge, recommended),
        edges(roofGeo, recommended ? C.ghostEdge : C.solidEdge, recommended)
      ];
      g.add(new THREE.Mesh(bodyGeo, mat), new THREE.Mesh(roofGeo, mat), lines[0], lines[1]);
      world.add(g);
      stations.push({
        group: g, mat: mat, lines: lines, recommended: recommended, z: sz,
        pad: pad(ST.w + 0.16, ST.d + 0.16, ST.x, sz),
        appear: recommended ? 1.4 + (ROADMAP.stationsRecommended - 1 - s) * 0.12 : 0.9 + (s - ROADMAP.stationsRecommended) * 0.12
      });
    }
    var nowStations = stations.filter(function (st) { return !st.recommended; });

    // Export containers on the roadmap: 20, stacked 2 long × 5 wide × 2 high, dropped in one by one
    var boxGeo = new THREE.BoxGeometry(BOX.l, BOX.h, BOX.w);
    var containers = [];
    var stackPad = pad(BOX.l * 2 + BOX.gap + 0.2, (BOX.w + BOX.gap) * 5 + 0.2, BOX.x, 0);
    for (var c = 0; c < ROADMAP.containers; c++) {
      var layer = Math.floor(c / 10), rest = c % 10;
      var col = rest % 2, row = Math.floor(rest / 2);
      var mesh = new THREE.Mesh(boxGeo, faceMaterial(C.boxTop, C.boxLit, C.boxShade, 14));
      var outline = edges(boxGeo, C.boxEdge, true, 0.07);
      var box = new THREE.Group();
      box.add(mesh, outline);
      box.position.set(
        BOX.x + (col - 0.5) * (BOX.l + BOX.gap),
        BOX.h / 2 + layer * (BOX.h + 0.01),
        (row - 2) * (BOX.w + BOX.gap)
      );
      world.add(box);
      containers.push({ group: box, mesh: mesh, outline: outline, y: box.position.y, appear: 1.75 + c * 0.055 });
    }

    // Roads: stations to the stack, and the export lane out toward the EU market
    var pathMats = [];
    function road(points, radius, base, fadeEnd, delay) {
      var curve = new THREE.CatmullRomCurve3(points);
      var mat = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: srgb(THREE, C.road) }, uHot: { value: srgb(THREE, C.accent) },
          uDraw: { value: 0 }, uHead: { value: -1 }, uTail: { value: 0.2 }, uBase: { value: base },
          uFadeEnd: { value: fadeEnd }
        },
        vertexShader: PATH_VERTEX, fragmentShader: PATH_FRAGMENT,
        transparent: true, depthWrite: false
      });
      world.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 96, radius, 5, false), mat));
      pathMats.push({ mat: mat, delay: delay });
      return curve;
    }
    var stackIn = BOX.x - BOX.l - 0.08;
    var roads = nowStations.map(function (st, i) {
      return road([
        new THREE.Vector3(ST.x + ST.w / 2 + 0.04, 0.012, st.z),
        new THREE.Vector3(lerp(ST.x, stackIn, 0.5), 0.012, st.z * 0.55),
        new THREE.Vector3(stackIn, 0.012, st.z * 0.22)
      ], 0.0045, 0.75, 0, 2.3 + i * 0.1);
    });
    var lane = road([
      new THREE.Vector3(BOX.x + BOX.l + 0.08, 0.012, 0),
      new THREE.Vector3(3.15, 0.012, 0.1),
      new THREE.Vector3(3.75, 0.012, 0.3),
      LANE_END.clone().setY(0.012)
    ], 0.006, 0.85, 0, 2.5);

    // The EU market marker matches the globe's: an amber dot with a pulsing ring at the end of the lane
    var euDot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12),
      new THREE.MeshBasicMaterial({ color: C.accent, transparent: true, opacity: 0 }));
    var euAt = LANE_END;
    euDot.position.set(euAt.x, 0.04, euAt.z);
    var euRing = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.075, 40),
      new THREE.MeshBasicMaterial({ color: C.accent, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
    euRing.rotation.x = -Math.PI / 2;
    euRing.position.set(euAt.x, 0.004, euAt.z);
    world.add(euDot, euRing);

    // Flow: amber dots from individual farms into the stations in place, on to the stack, then out to market
    var FARM_FLOW = 44, ROAD_FLOW = 3, LANE_FLOW = 6;
    var flow = [];
    function respawn(f) {
      var i = Math.floor(rand() * farmPts.length);
      var fx = farmPts[i][0], fz = farmPts[i][1];
      var best = nowStations[0];
      nowStations.forEach(function (st) { if (Math.abs(st.z - fz) < Math.abs(best.z - fz)) best = st; });
      f.from.set(fx, terrain(fx, fz) + 0.03, fz);
      f.to.set(ST.x - ST.w / 2 - 0.05, 0.06, best.z + (rand() - 0.5) * 0.24);
      f.u = 0;
      f.rate = (0.45 + rand() * 0.25) / Math.max(0.5, f.from.distanceTo(f.to));
    }
    for (var fi = 0; fi < FARM_FLOW; fi++) {
      var f = { kind: 'farm', from: new THREE.Vector3(), to: new THREE.Vector3(), u: 0, rate: 0.2 };
      respawn(f);
      f.u = rand();
      flow.push(f);
    }
    roads.forEach(function (curve) {
      for (var r = 0; r < ROAD_FLOW; r++) flow.push({ kind: 'path', curve: curve, u: r / ROAD_FLOW, rate: 0.22 });
    });
    for (var li = 0; li < LANE_FLOW; li++) flow.push({ kind: 'path', curve: lane, u: li / LANE_FLOW, rate: 0.16, fade: true });

    var flowPos = new Float32Array(flow.length * 3);
    var flowAlpha = new Float32Array(flow.length);
    var flowGeo = new THREE.BufferGeometry();
    flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPos, 3));
    flowGeo.setAttribute('aAlpha', new THREE.BufferAttribute(flowAlpha, 1));
    flowGeo.setAttribute('aDelay', new THREE.Float32BufferAttribute(new Array(flow.length).fill(0), 1));
    flowGeo.setAttribute('aShade', new THREE.Float32BufferAttribute(flow.map(function (_, i) { return i % 4 ? 1 : 1.12; }), 1));
    var flowMat = dotMaterial(C.accent, 0.055, 0);
    var flowPoints = new THREE.Points(flowGeo, flowMat);
    flowPoints.frustumCulled = false;
    world.add(flowPoints);
    var tmpV = new THREE.Vector3();

    function placeFlow(dt, moving) {
      flow.forEach(function (f, i) {
        if (moving) {
          f.u += dt * f.rate;
          if (f.u >= 1) { if (f.kind === 'farm') respawn(f); else f.u -= 1; }
        }
        var a;
        if (f.kind === 'farm') {
          tmpV.lerpVectors(f.from, f.to, f.u);
          tmpV.y = lerp(f.from.y, f.to.y, f.u) + 0.1 * Math.sin(Math.PI * f.u);
          a = smoothstep(0, 0.12, f.u) * (1 - smoothstep(0.88, 1, f.u));
        } else {
          f.curve.getPointAt(f.u, tmpV);
          tmpV.y += 0.035;
          a = smoothstep(0, 0.1, f.u) * (1 - smoothstep(f.fade ? 0.7 : 0.9, f.fade ? 0.95 : 1, f.u));
        }
        flowPos[i * 3] = tmpV.x; flowPos[i * 3 + 1] = tmpV.y; flowPos[i * 3 + 2] = tmpV.z;
        flowAlpha[i] = a;
      });
      flowGeo.attributes.position.needsUpdate = true;
      flowGeo.attributes.aAlpha.needsUpdate = true;
    }

    // Labels: anchored above each part of the model
    var labelDefs = [
      { text: '2,000 smallholder farms', at: new THREE.Vector3(FARM.x + 0.1, 0.5, FARM.z - 0.25), show: 1.0 },
      { text: '3 washing stations', at: new THREE.Vector3(ST.x, 0.5, nowStations[1].z), show: 1.5 },
      { text: '3 more recommended', at: new THREE.Vector3(ST.x, 0.5, stations[1].z), show: 1.9 },
      { text: 'Roadmap: 20 containers (384 MT) a year', at: new THREE.Vector3(BOX.x, 0.78, 0), show: 2.8 },
      { text: 'EU market', at: new THREE.Vector3(euAt.x, 0.14, euAt.z), show: 3.0 }
    ];
    var labels = makeLabels(host.querySelector('[data-roadmap-labels]'), 'roadmap__label',
      labelDefs.map(function (d) { return d.text; }));

    // Camera: a three-quarter view, framed to fit the panel's shape. Wide panels look across the
    // flow; tall ones look down it, so farms sit at the back and the stack in front.
    var view = { az: 0, el: 0, dist: 10, target: new THREE.Vector3() };
    // Points that must stay in frame: the field's outline, every building's footprint, the stack,
    // the market marker and the label anchors
    var fitPoints = [];
    (function () {
      for (var a = 0; a < Math.PI * 2; a += Math.PI / 16) {
        var edge = 1 + 0.1 * Math.sin(a * 5 + 1.3) + 0.05 * Math.sin(a * 9 + 0.4);
        fitPoints.push(new THREE.Vector3(FARM.x + Math.cos(a) * FARM.rx * edge, 0, FARM.z + Math.sin(a) * FARM.rz * edge));
      }
      stations.forEach(function (st) {
        [-1, 1].forEach(function (sx) {
          [-1, 1].forEach(function (sz) {
            fitPoints.push(new THREE.Vector3(ST.x + sx * (ST.w / 2 + 0.08), 0, st.z + sz * (ST.d / 2 + 0.08)));
          });
        });
      });
      [BOX.x - BOX.l - 0.05, BOX.x + BOX.l + 0.05].forEach(function (x) {
        [0, BOX.h * 2 + 0.01].forEach(function (y) {
          [-0.7, 0.7].forEach(function (z) { fitPoints.push(new THREE.Vector3(x, y, z)); });
        });
      });
      fitPoints.push(new THREE.Vector3(euAt.x + 0.12, 0, euAt.z), new THREE.Vector3(euAt.x, 0, euAt.z + 0.12));
    })();
    function frameView(aspect) {
      var t = clamp((aspect - 0.85) / (2 - 0.85), 0, 1);
      var az = lerp(64, 34, t) * DEG, el = lerp(44, 37, t) * DEG;
      var pts = fitPoints.concat(labelDefs.map(function (d) { return d.at; }));
      var dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
      var target = new THREE.Vector3(0, 0.15, 0), dist = 11, v = new THREE.Vector3();
      var right = new THREE.Vector3(), up = new THREE.Vector3();
      // Labels sit above their anchors, so reserve about 34px at the top of the frame
      var top = 1 - 34 / (stage.height / 2), bottom = -0.92, side = 0.94;
      for (var it = 0; it < 10; it++) {
        camera.position.copy(target).addScaledVector(dir, dist);
        camera.lookAt(target);
        camera.updateMatrixWorld();
        var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        pts.forEach(function (p) {
          v.copy(p).project(camera);
          minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x);
          minY = Math.min(minY, v.y); maxY = Math.max(maxY, v.y);
        });
        var halfH = dist * Math.tan(camera.fov * DEG / 2), halfW = halfH * camera.aspect;
        right.setFromMatrixColumn(camera.matrixWorld, 0);
        up.setFromMatrixColumn(camera.matrixWorld, 1);
        target.addScaledVector(right, (minX + maxX) / 2 * halfW);
        target.addScaledVector(up, ((minY + maxY) / 2 - (top + bottom) / 2) * halfH);
        dist *= Math.max((maxX - minX) / 2 / side, (maxY - minY) / (top - bottom));
      }
      view.az = az; view.el = el; view.dist = dist; view.target.copy(target);
    }

    stage.onResize = function (w, h) {
      frameView(w / h);
      var halfHeight = h * stage.pixelRatio / 2;
      dotUniforms.forEach(function (u) { u.uHalfHeight.value = halfHeight; });
      measureLabels(labels);
    };

    // Drag to turn the model; it eases back to its framed view after a pause.
    // A mouse over the model makes it lean slightly toward the pointer.
    var turn = dragToTurn(host, stage, { az: 0.6, down: -0.2, up: 0.32 });

    // The intro starts once a third of the model is in view
    var playing = false, clock = 0;
    if ('IntersectionObserver' in window) {
      var seen = new IntersectionObserver(function (entries) {
        if (entries[0].intersectionRatio >= 0.3) { playing = true; seen.disconnect(); stage.requestRender(); }
      }, { threshold: [0, 0.3, 0.6] });
      seen.observe(host);
    } else {
      playing = true;
    }

    stage.animating = function () { return !reducedMotion() || turn.moving(); };

    var dir = new THREE.Vector3();
    stage.update = function (dt) {
      var still = reducedMotion();
      if (still) clock = Math.max(clock, 60);
      else if (playing) clock += dt;
      var t = clock;

      dotUniforms.forEach(function (u) { u.uTime.value = t; });

      stations.forEach(function (st) {
        var k = clamp((t - st.appear) / 0.6, 0, 1);
        var e = easeOutBack(k);
        st.group.scale.y = st.recommended ? 1 : Math.max(0.05, lerp(0.15, 1, e));
        st.group.position.y = st.recommended ? (1 - easeOut(k)) * 0.08 : 0;
        st.mat.uniforms.uOpacity.value = smoothstep(0, 0.45, k);
        st.lines.forEach(function (l) { l.material.opacity = smoothstep(0.1, 0.7, k) * (st.recommended ? 0.95 : 0.9); });
        st.pad.material.opacity = smoothstep(0, 0.6, k);
        if (k >= 1) st.mat.transparent = false;
      });

      stackPad.material.opacity = smoothstep(1.6, 2.2, t);
      containers.forEach(function (ct) {
        var k = clamp((t - ct.appear) / 0.55, 0, 1);
        ct.group.position.y = ct.y + (1 - easeOut(k)) * 0.7;
        var a = smoothstep(0, 0.35, k);
        ct.mesh.material.uniforms.uOpacity.value = a;
        ct.outline.material.opacity = a * 0.95;
        if (k >= 1) ct.mesh.material.transparent = false;
      });

      pathMats.forEach(function (p) { p.mat.uniforms.uDraw.value = easeInOut(clamp((t - p.delay) / 0.9, 0, 1)); });

      var markerIn = clamp((t - 2.9) / 0.5, 0, 1);
      euDot.material.opacity = smoothstep(0, 0.4, markerIn);
      euDot.scale.setScalar(0.55 + 0.45 * easeOutBack(markerIn));
      var pulse = still ? 0.5 : (Math.sin(t * 2.2) + 1) / 2;
      euRing.scale.setScalar(1 + pulse * 0.9);
      euRing.material.opacity = (0.65 - pulse * 0.45) * markerIn;

      flowMat.uniforms.uOpacity.value = smoothstep(2.4, 3.2, t);
      placeFlow(dt, !still && t > 2.4);

      // Camera: framed view, plus a slow sway, the pointer lean and any drag offset
      turn.step(dt, still);
      var sway = still ? 0 : 1;
      var az = view.az + turn.az + turn.leanX * 0.035 + sway * 0.03 * Math.sin(t * 0.23);
      var el = clamp(view.el + turn.el + turn.leanY * 0.02 + sway * 0.012 * Math.sin(t * 0.17), 8 * DEG, 70 * DEG);
      var dolly = 1 + 0.14 * (1 - easeOut(clamp(t / 2.8, 0, 1)));
      dir.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
      camera.position.copy(view.target).addScaledVector(dir, view.dist * dolly);
      camera.lookAt(view.target);
    };

    var placed = [];
    stage.afterRender = function () {
      var w = stage.width, h = stage.height;
      placed.length = 0;
      labelDefs.forEach(function (d, i) {
        var l = labels[i];
        tmpV.copy(d.at).project(camera);
        var sx = (tmpV.x * 0.5 + 0.5) * w;
        var sy = (-tmpV.y * 0.5 + 0.5) * h;
        var x = clamp(sx - l.w / 2, 4, w - l.w - 4);
        var y = sy - l.h - 10;
        // Nudge a label up if it would cover one already placed
        for (var n = 0; n < placed.length; n++) {
          var o = placed[n];
          if (x < o.x + o.w + 4 && x + l.w + 4 > o.x && y < o.y + o.h + 4 && y + l.h + 4 > o.y) y = o.y - l.h - 6;
        }
        y = clamp(y, 4, h - l.h - 4);
        placed.push({ x: x, y: y, w: l.w, h: l.h });
        setLabel(l, x, y, clock >= d.show);
      });
    };

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measureLabels(labels); stage.requestRender(); });
    stage.resize();
    host.classList.add('is-ready');
    stage.requestRender();
  }

  /* ==========================================================================
     Container yard (three.js)
     A gantry crane stacks one container per tool from the Skills list: SAP,
     WMS, Excel, Power BI, Tableau, MySQL, Python and RPA. On wide screens the
     section's scroll drives the crane while the yard stays pinned beside the
     lists, and each tool in the list gains an amber marker as its container
     lands; on narrow screens it plays once when it comes into view. Dragging
     turns the yard, like the roadmap model. Under reduced motion the stack is
     shown complete. The figcaption names the tools.
     ========================================================================== */
  var YARD_TOOLS = ['SAP', 'WMS', 'Excel', 'Power BI', 'Tableau', 'MySQL', 'Python', 'RPA'];

  function initYard() {
    var host = document.querySelector('[data-yard]');
    if (!host) return;
    if (!webglAvailable()) { host.classList.add('is-unavailable'); return; }
    var started = false;
    function start() {
      if (started) return;
      started = true;
      // The labels are painted in the page's typeface, so give it a moment to arrive first
      var font = document.fonts && document.fonts.load
        ? Promise.race([document.fonts.load('700 160px "Source Sans 3"'), new Promise(function (r) { window.setTimeout(r, 1500); })])
        : Promise.resolve();
      Promise.all([loadThree(), font]).then(function () { buildYard(host); }).catch(function (err) {
        host.classList.add('is-unavailable');
        warn('yard', err);
      });
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { io.disconnect(); start(); }
      }, { rootMargin: '800px 0px' });
      io.observe(host);
    } else {
      start();
    }
  }

  function buildYard(host) {
    var THREE = window.THREE;
    var stage = createStage(host, 28);
    var scene = stage.scene, camera = stage.camera;
    var grid = host.closest('.skills') || host;
    var toolList = document.querySelector('.tool-list');
    var chips = toolList ? Array.prototype.slice.call(toolList.querySelectorAll('li')) : [];
    var wide = window.matchMedia('(min-width: 1024px)');

    var NAVY = 0x0C1A2C, NAVY_950 = 0x07111F, NAVY_700 = 0x182C44, SOFT = 0xB6C0CE, INK = 0x06101D, CHALK = 0xF1F4F8;
    var ACCENT = 0xE3AE55, CYAN = 0x8FB4FF;
    // One livery per tool in the muted colours of real shipping containers, each with the ink that
    // reads on it: SAP cobalt, WMS steel, Excel green, Power BI ochre, Tableau rust, MySQL light grey,
    // Python navy, RPA olive
    var LIVERY = [[0x3767C9, CHALK], [0x5D6F86, CHALK], [0x2E7D55, CHALK], [0xD9A441, INK],
                  [0xB5523B, CHALK], [0xCFD6DF, INK], [0x2C4A7A, CHALK], [0x6F7F52, CHALK]];
    // A 20 ft container's proportions (6.06 × 2.59 × 2.44 m)
    var L = 1.5, H = 0.64, W = 0.6, GAP = 0.06;
    var STACK_X = -1.25, PICK_X = 1.95, LEG_X = 3.15, LEG_Z = 0.62, LEG_H = 3.9;
    var TRUCK_Y = 0.42 + H / 2;                        // container centre on the truck
    var CARRY_Y = 4 * (H + 0.02) + H / 2 + 0.18;       // container centre while carried over the stack
    var REST_Y = LEG_H - 0.5;                           // spreader height when idle
    var GRIP = H / 2 + 0.035;                           // spreader sits this far above a held container's centre

    var world = new THREE.Group();
    scene.add(world);

    function face(hex, ribs) {
      return new THREE.ShaderMaterial({
        uniforms: {
          uTop: { value: srgb(THREE, mixHex(hex, 0xFFFFFF, 0.14)) },
          uLit: { value: srgb(THREE, hex) },
          uShade: { value: srgb(THREE, mixHex(hex, NAVY, 0.34)) },
          uOpacity: { value: 1 },
          uRibs: { value: ribs || 0 }
        },
        vertexShader: FACE_VERTEX,
        fragmentShader: FACE_FRAGMENT
      });
    }
    function block(w, h, d, x, y, z, mat) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      world.add(m);
      return m;
    }
    function pad(w, d, x) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ color: mixHex(NAVY, NAVY_950, 0.9) }));
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, 0.001, 0);
      world.add(m);
    }

    // Quay: a faint dot grid, with darker pads under the stack and the truck lane
    var dots = [];
    for (var gx = -4.4; gx <= 4.41; gx += 0.3) {
      for (var gz = -2.1; gz <= 2.11; gz += 0.3) dots.push(gx, 0, gz);
    }
    var count = dots.length / 3;
    var dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    dotGeo.setAttribute('aDelay', new THREE.Float32BufferAttribute(new Array(count).fill(0), 1));
    dotGeo.setAttribute('aShade', new THREE.Float32BufferAttribute(new Array(count).fill(1), 1));
    dotGeo.setAttribute('aAlpha', new THREE.Float32BufferAttribute(new Array(count).fill(1), 1));
    var dotUniforms = {
      uTime: { value: 100 }, uSize: { value: 0.02 }, uHalfHeight: { value: 300 }, uRise: { value: 0 },
      uColor: { value: srgb(THREE, mixHex(NAVY, CYAN, 0.3)) }, uOpacity: { value: 1 }
    };
    world.add(new THREE.Points(dotGeo, new THREE.ShaderMaterial({
      uniforms: dotUniforms, vertexShader: DOT_VERTEX, fragmentShader: DOT_FRAGMENT, transparent: true, depthWrite: false
    })));
    pad(L * 2 + GAP + 0.36, W + 0.5, STACK_X);
    pad(L + 0.6, W + 0.5, PICK_X);

    // Gantry crane: two portal frames joined by girders. The moving parts, trolley and spreader, are amber.
    var steel = face(mixHex(NAVY_700, SOFT, 0.55));
    [-1, 1].forEach(function (sx) {
      [-1, 1].forEach(function (sz) { block(0.14, LEG_H, 0.14, sx * LEG_X, LEG_H / 2, sz * LEG_Z, steel); });
      block(0.18, 0.12, LEG_Z * 2 + 0.2, sx * LEG_X, 0.06, 0, steel);
      block(0.18, 0.18, LEG_Z * 2 + 0.2, sx * LEG_X, LEG_H, 0, steel);
    });
    [-1, 1].forEach(function (sz) { block(LEG_X * 2 + 0.34, 0.2, 0.14, 0, LEG_H + 0.02, sz * LEG_Z, steel); });
    var amber = face(ACCENT);
    var trolley = block(0.6, 0.22, LEG_Z * 2 + 0.34, PICK_X, LEG_H + 0.22, 0, amber);
    var spreader = block(L * 0.96, 0.07, W * 0.96, PICK_X, REST_Y, 0, amber);
    var cablePos = new Float32Array(12);
    var cableGeo = new THREE.BufferGeometry();
    cableGeo.setAttribute('position', new THREE.BufferAttribute(cablePos, 3));
    var cables = new THREE.LineSegments(cableGeo, new THREE.LineBasicMaterial({ color: mixHex(NAVY, SOFT, 0.65) }));
    cables.frustumCulled = false;
    world.add(cables);

    // Truck chassis on the lane, where each container arrives
    var chassis = face(mixHex(NAVY_950, NAVY_700, 0.5));
    block(L + 0.24, 0.12, W + 0.04, PICK_X, 0.34, 0, chassis);
    [-0.52, 0, 0.52].forEach(function (dx) {
      [-1, 1].forEach(function (sz) { block(0.24, 0.24, 0.08, PICK_X + dx, 0.14, sz * (W / 2 - 0.02), chassis); });
    });

    // Containers, each painted with its tool's name in the page's typeface
    var labelW = L * 0.84, labelH = H * 0.6;
    function labelTexture(text, ink) {
      var c = document.createElement('canvas');
      c.width = 1024;
      c.height = Math.round(1024 * labelH / labelW);
      var ctx = c.getContext('2d');
      var family = '"Source Sans 3", "Segoe UI", system-ui, -apple-system, Arial, sans-serif';
      var size = Math.round(c.height * 0.62);
      ctx.font = '700 ' + size + 'px ' + family;
      while (ctx.measureText(text).width > c.width * 0.9 && size > 40) {
        size -= 6;
        ctx.font = '700 ' + size + 'px ' + family;
      }
      ctx.fillStyle = '#' + ('00000' + ink.toString(16)).slice(-6);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, c.width / 2, c.height / 2 + size * 0.04);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(8, stage.renderer.capabilities.getMaxAnisotropy());
      return tex;
    }
    var boxGeo = new THREE.BoxGeometry(L, H, W);
    var edgeGeo = new THREE.EdgesGeometry(boxGeo, 20);
    var labelGeo = new THREE.PlaneGeometry(labelW, labelH);
    var containers = YARD_TOOLS.map(function (name, i) {
      var livery = LIVERY[i];
      var mesh = new THREE.Mesh(boxGeo, face(livery[0], 16));
      mesh.add(new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: mixHex(livery[0], NAVY, 0.6) })));
      var label = new THREE.Mesh(labelGeo, new THREE.MeshBasicMaterial({
        map: labelTexture(name, livery[1]), transparent: true, depthWrite: false
      }));
      label.position.z = W / 2 + 0.004;
      mesh.add(label);
      mesh.visible = false;
      world.add(mesh);
      var col = i % 2, tier = Math.floor(i / 2);
      return { mesh: mesh, x: STACK_X + (col - 0.5) * (L + GAP), y: H / 2 + tier * (H + 0.02) };
    });

    // One lift per container: arrive on the truck, spreader down, lift, carry, lower into the slot,
    // release and return. p runs 0 → 1 across all eight; returns how many have landed.
    function phase(u, a, b) { return easeInOut(clamp((u - a) / (b - a), 0, 1)); }
    function pose(p) {
      var sx = PICK_X, sy = REST_Y, placed = 0, n = containers.length;
      containers.forEach(function (ct, i) {
        var u = clamp(p * n - i, 0, 1);
        if (u <= 0) { ct.mesh.visible = false; return; }
        ct.mesh.visible = true;
        var x, y;
        if (u < 0.26) {
          x = lerp(PICK_X + 4.2, PICK_X, phase(u, 0, 0.14));
          y = TRUCK_Y;
        } else {
          var travel = phase(u, 0.4, 0.66);
          x = lerp(PICK_X, ct.x, travel);
          y = travel < 1 ? lerp(TRUCK_Y, CARRY_Y, phase(u, 0.26, 0.4)) : lerp(CARRY_Y, ct.y, phase(u, 0.66, 0.86));
        }
        ct.mesh.position.set(x, y, 0);
        if (u >= 0.86) placed++;
        if (u < 1) {
          // This container is on the hook, so the spreader follows it
          if (u < 0.14) { sx = PICK_X; sy = REST_Y; }
          else if (u < 0.26) { sx = PICK_X; sy = lerp(REST_Y, TRUCK_Y + GRIP, phase(u, 0.14, 0.26)); }
          else if (u < 0.86) { sx = x; sy = y + GRIP; }
          else { sx = lerp(ct.x, PICK_X, phase(u, 0.93, 1)); sy = lerp(ct.y + GRIP, REST_Y, phase(u, 0.86, 0.93)); }
        }
      });
      spreader.position.set(sx, sy, 0);
      trolley.position.x = sx;
      var top = LEG_H + 0.1, bottom = sy + 0.035;
      cablePos[0] = sx; cablePos[1] = top; cablePos[2] = -0.2;
      cablePos[3] = sx; cablePos[4] = bottom; cablePos[5] = -0.2;
      cablePos[6] = sx; cablePos[7] = top; cablePos[8] = 0.2;
      cablePos[9] = sx; cablePos[10] = bottom; cablePos[11] = 0.2;
      cableGeo.attributes.position.needsUpdate = true;
      return placed;
    }

    // Camera: a low three-quarter view from the lane side, framed to the stage's shape
    var view = { az: 0, el: 0, dist: 12, target: new THREE.Vector3() };
    var fitPoints = [];
    [-LEG_X - 0.2, LEG_X + 0.2].forEach(function (x) {
      [0, LEG_H + 0.35].forEach(function (y) {
        [-LEG_Z - 0.3, LEG_Z + 0.3].forEach(function (z) { fitPoints.push(new THREE.Vector3(x, y, z)); });
      });
    });
    function frameView(aspect) {
      var t = clamp((aspect - 0.8) / 0.8, 0, 1);
      view.az = lerp(20, 30, t) * DEG;
      view.el = lerp(15, 11, t) * DEG;
      var dir = new THREE.Vector3(Math.sin(view.az) * Math.cos(view.el), Math.sin(view.el), Math.cos(view.az) * Math.cos(view.el));
      var target = new THREE.Vector3(0, LEG_H / 2, 0), dist = 12, v = new THREE.Vector3();
      var right = new THREE.Vector3(), up = new THREE.Vector3();
      for (var it = 0; it < 10; it++) {
        camera.position.copy(target).addScaledVector(dir, dist);
        camera.lookAt(target);
        camera.updateMatrixWorld();
        var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        fitPoints.forEach(function (p) {
          v.copy(p).project(camera);
          minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x);
          minY = Math.min(minY, v.y); maxY = Math.max(maxY, v.y);
        });
        var halfH = dist * Math.tan(camera.fov * DEG / 2), halfW = halfH * camera.aspect;
        right.setFromMatrixColumn(camera.matrixWorld, 0);
        up.setFromMatrixColumn(camera.matrixWorld, 1);
        target.addScaledVector(right, (minX + maxX) / 2 * halfW);
        target.addScaledVector(up, (minY + maxY) / 2 * halfH);
        dist *= Math.max((maxX - minX) / 2 / 0.9, (maxY - minY) / 2 / 0.86);
      }
      view.dist = dist;
      view.target.copy(target);
    }

    // Wide screens: progress follows the scroll, from the yard sitting 55% down the screen until
    // the foot of the lists reaches the bottom of the screen, so all eight land while the list is read
    var metrics = { gridTop: 0, gridH: 1 };
    function measure() {
      var gr = grid.getBoundingClientRect();
      metrics.gridTop = gr.top + window.scrollY;
      metrics.gridH = gr.height;
    }
    function scrollTarget(vh) {
      var s0 = metrics.gridTop - vh * 0.55;
      var s1 = metrics.gridTop + metrics.gridH - vh * 1.02;
      if (s1 - s0 < 320) s1 = s0 + 320;
      return clamp((window.scrollY - s0) / (s1 - s0), 0, 1);
    }
    var target = 0, shown = 0, playing = false, landed = -1, clock = 0;
    function markTools(placed) {
      if (placed === landed) return;
      landed = placed;
      chips.forEach(function (chip, i) { chip.classList.toggle('is-stacked', i < placed); });
    }
    function landedAt(p) { return clamp(Math.floor(p * containers.length - 0.86) + 1, 0, containers.length); }
    onScroll(function (vh) {
      if (!wide.matches) return null;
      var t = scrollTarget(vh);
      // Measured in this frame: the visibility observer can lag a fast scroll by a frame
      var r = host.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        if (t === target) return null;
        return function () { target = t; stage.requestRender(); };
      }
      // Off screen there is nothing to watch: settle on the scroll's state and keep the list in step,
      // even if the eased stack was still catching up when the yard left the screen
      if (t === target && shown === t) return null;
      return function () { target = t; shown = t; markTools(landedAt(t)); };
    });
    // Narrow screens: play once when a third of the yard is in view
    if ('IntersectionObserver' in window) {
      var seen = new IntersectionObserver(function (entries) {
        if (entries[0].intersectionRatio >= 0.35) { playing = true; seen.disconnect(); stage.requestRender(); }
      }, { threshold: [0, 0.35, 0.7] });
      seen.observe(host);
    } else {
      playing = true;
    }
    if (toolList) toolList.classList.add('is-linked');

    // Drag to turn the yard; it eases back to its framed view after a pause
    var turn = dragToTurn(host, stage, { az: 0.4, down: -0.05, up: 0.12 });

    stage.onResize = function (w, h) {
      frameView(w / h);
      dotUniforms.uHalfHeight.value = h * stage.pixelRatio / 2;
      measure();
    };
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

    stage.animating = function () { return !reducedMotion() || turn.moving(); };
    var dir = new THREE.Vector3();
    stage.update = function (dt) {
      var still = reducedMotion();
      clock += dt;
      if (still) shown = 1;
      else if (wide.matches) shown += (target - shown) * (1 - Math.exp(-dt * 5));
      else if (playing) shown = Math.min(1, shown + dt / 9);
      markTools(pose(shown));
      // The view turns a little as the stack grows, with a slow sway, the pointer lean and any
      // drag offset. While turned it pulls back a little so the gantry stays in frame.
      turn.step(dt, still);
      var sway = still ? 0 : 1;
      var az = view.az + shown * 0.12 + turn.az + turn.leanX * 0.03 + sway * 0.025 * Math.sin(clock * 0.21);
      var el = view.el + turn.el + turn.leanY * 0.015 + sway * 0.01 * Math.sin(clock * 0.15);
      var pull = 1 + 0.3 * Math.abs(turn.az) + Math.max(0, turn.el);
      dir.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
      camera.position.copy(view.target).addScaledVector(dir, view.dist * pull);
      camera.lookAt(view.target);
    };

    measure();
    stage.resize();
    host.classList.add('is-ready');
    stage.requestRender();
  }

  /* ---------- Boot ---------- */
  safely('header', initHeader);
  safely('menu', initMenu);
  safely('scroll spy', initScrollSpy);
  safely('split text', initSplitText);
  safely('reveal', initReveal);
  safely('counters', initCounters);
  safely('word light', initWordLight);
  safely('spine', initSpine);
  safely('float windows', initFloatWindows);
  safely('showcase', initShowcase);
  safely('gallery', initGallery);
  safely('lean', initLean);
  safely('magnetic', initMagnetic);
  safely('motion toggle', initMotionToggle);
  safely('motion note', initMotionNote);
  safely('idle animations', initIdleAnimations);
  safely('copy', initCopy);
  safely('year', initYear);
  safely('globe', initGlobe);
  safely('roadmap', initRoadmap);
  safely('yard', initYard);
})();
