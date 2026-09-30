/**
 * IEEE CS MBITS — WebNova 2026
 * js/script.js  ·  v2 — Multi-page + Enhanced Scroll Animations
 *
 * Modules:
 *  1.  Page Transition (link intercept + overlay)
 *  2.  Canvas Particle Background
 *  3.  Custom Cursor Glow
 *  4.  Scroll Progress Bar
 *  5.  Sticky Nav + Active Link
 *  6.  Mobile Hamburger Menu
 *  7.  Dark/Light Theme Toggle (localStorage)
 *  8.  Terminal Typing Animation
 *  9.  Enhanced Scroll Reveal (IntersectionObserver)
 *       · reveal-up · reveal-left · reveal-right · reveal-zoom · reveal-fade
 *       · stagger-item (auto-delayed children)
 *       · heading-reveal (char-by-char)
 *       · line-reveal (draw-in)
 * 10.  3D Tilt Effect
 * 11.  Event Filter Tabs
 * 12.  Count-up Stats
 * 13.  Gallery Lightbox
 * 14.  Contact Form Validation + Success
 * 15.  Konami Code Easter Egg
 * 16.  Footer Year
 * 17.  Smooth Scroll (intra-page anchors)
 */

'use strict';

/* ══════════════════════════════════════════════════════
   1. PAGE TRANSITIONS
══════════════════════════════════════════════════════ */
(function initPageTransitions() {
  // Inject the overlay element
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  /**
   * Animate the overlay sliding in, navigate, then slide out on new page.
   */
  function navigateTo(url) {
    overlay.classList.remove('slide-out');
    overlay.classList.add('slide-in');

    // After slide-in begins (~280ms), navigate
    setTimeout(() => {
      window.location.href = url;
    }, 280);

    // Safety fallback in case browser delays navigation
    setTimeout(() => {
      overlay.classList.remove('slide-in');
    }, 1200);
  }

  // Intercept all internal anchor links that point to .html pages
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    // Only intercept same-origin .html links (not anchors, not external)
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.startsWith('mailto') &&
      !href.startsWith('tel') &&
      (href.endsWith('.html') || href === '/' || href === './' || href === '')
    ) {
      e.preventDefault();
      navigateTo(href);
    }
  });

  // On page load: slide out the overlay (reverse direction)
  window.addEventListener('pageshow', () => {
    overlay.classList.remove('slide-in');
    void overlay.offsetWidth; // force reflow
    overlay.classList.add('slide-out');
    setTimeout(() => overlay.classList.remove('slide-out'), 500);
  });
}());

/* ══════════════════════════════════════════════════════
   2. CANVAS PARTICLE & CONSTELLATION BACKGROUND
══════════════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COUNT  = window.innerWidth < 768 ? 48 : 85;
  const DIST   = 135;
  const SPEED  = 0.35;
  let particles = [];
  let animId;
  let W, H;
  let mouse = { x: -1000, y: -1000, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    const isAmber = Math.random() < 0.22; // 22% warm copper/amber highlights
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: isAmber ? (Math.random() * 2 + 1.2) : (Math.random() * 1.5 + 0.6),
      isAmber,
      pulse: Math.random() * Math.PI,
      pulseSpeed: 0.02 + Math.random() * 0.02
    };
  }

  function init() {
    particles = Array.from({ length: COUNT }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const light = document.documentElement.getAttribute('data-theme') === 'light';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Mouse gentle interaction
      const mdx = mouse.x - p.x;
      const mdy = mouse.y - p.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < mouse.radius) {
        const force = (1 - mdist / mouse.radius) * 0.4;
        p.x -= (mdx / mdist) * force;
        p.y -= (mdy / mdist) * force;
      }

      const pulseFactor = 0.8 + 0.3 * Math.sin(p.pulse);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * pulseFactor, 0, Math.PI * 2);

      if (p.isAmber) {
        ctx.fillStyle = light ? 'rgba(200, 132, 58, 0.7)' : 'rgba(229, 169, 60, 0.85)';
        ctx.shadowColor = 'rgba(229, 169, 60, 0.5)';
        ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = light ? 'rgba(0, 98, 155, 0.5)' : 'rgba(0, 130, 204, 0.65)';
        ctx.shadowColor = 'rgba(0, 130, 204, 0.4)';
        ctx.shadowBlur = 4;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);

        if (d < DIST) {
          const alpha = (1 - d / DIST) * (light ? 0.08 : 0.14);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);

          if (particles[i].isAmber || particles[j].isAmber) {
            ctx.strokeStyle = `rgba(200, 132, 58, ${(alpha * 0.85).toFixed(3)})`;
          } else {
            ctx.strokeStyle = `rgba(0, 130, 204, ${alpha.toFixed(3)})`;
          }
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // Connect to mouse if close
      const mdx = particles[i].x - mouse.x;
      const mdy = particles[i].y - mouse.y;
      const md = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 110) {
        const ma = (1 - md / 110) * 0.22;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0, 180, 255, ${ma.toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    animId = requestAnimationFrame(draw);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });
  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
  resize();
  init();
  draw();
}());

/* ══════════════════════════════════════════════════════
   3. CUSTOM CURSOR
══════════════════════════════════════════════════════ */
(function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-outline');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = `${mx}px`; dot.style.top = `${my}px`;
  });

  (function lerp() {
    rx += (mx-rx)*0.14; ry += (my-ry)*0.14;
    ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
    requestAnimationFrame(lerp);
  }());

  const sel = 'a,button,input,textarea,select,label,[role="tab"],[role="button"]';
  document.addEventListener('mouseover',  (e) => { if (e.target.closest(sel)) document.body.classList.add('cursor-hover'); });
  document.addEventListener('mouseout',   (e) => { if (e.target.closest(sel)) document.body.classList.remove('cursor-hover'); });
  document.addEventListener('mouseleave', ()  => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', ()  => { dot.style.opacity = ''; ring.style.opacity = ''; });
}());

/* ══════════════════════════════════════════════════════
   4. SCROLL PROGRESS BAR
══════════════════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  function update() {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = `${Math.min(pct, 100)}%`;
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}());

/* ══════════════════════════════════════════════════════
   5. STICKY NAV + ACTIVE LINK
══════════════════════════════════════════════════════ */
(function initNav() {
  const header = document.querySelector('.nav-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mark active link by current page filename
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop();
    if (
      linkPage === page ||
      (page === 'index.html' && (linkPage === '' || linkPage === 'index.html'))
    ) {
      link.classList.add('active');
    }
  });
}());

/* ══════════════════════════════════════════════════════
   6. MOBILE HAMBURGER MENU
══════════════════════════════════════════════════════ */
(function initMobileMenu() {
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!ham || !menu) return;

  function toggle(open) {
    const next = open ?? (ham.getAttribute('aria-expanded') !== 'true');
    ham.setAttribute('aria-expanded', String(next));
    menu.setAttribute('aria-hidden', String(!next));
    menu.classList.toggle('open', next);
    document.body.style.overflow = next ? 'hidden' : '';
  }

  ham.addEventListener('click', () => toggle());
  document.querySelectorAll('.mobile-nav-link').forEach((l) => l.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('open')) toggle(false); });
}());

/* ══════════════════════════════════════════════════════
   7. THEME TOGGLE
══════════════════════════════════════════════════════ */
(function initTheme() {
  const KEY = 'ieee-mbits-theme';
  const toggle = document.getElementById('theme-toggle');
  const root   = document.documentElement;
  const saved  = localStorage.getItem(KEY);
  const sys    = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', saved || sys);
  toggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(KEY, next);
  });
}());

/* ══════════════════════════════════════════════════════
   8. TERMINAL TYPING ANIMATION
══════════════════════════════════════════════════════ */
(function initTyping() {
  const el = document.getElementById('terminal-text');
  if (!el) return;
  const PHRASES = [
    'ieee cs mbits --init',
    'git push innovation',
    'sudo think-differently',
    'npm install curiosity',
    'python -m lead.world',
    'echo "Code. Connect. Create."',
  ];
  let pi=0, ci=0, del=false;

  function tick() {
    const p = PHRASES[pi];
    if (!del) { el.textContent = p.slice(0, ++ci); if (ci===p.length) { del=true; return setTimeout(tick,2000); } }
    else       { el.textContent = p.slice(0, --ci); if (ci===0)        { del=false; pi=(pi+1)%PHRASES.length; return setTimeout(tick,500); } }
    setTimeout(tick, del ? 36 : 70);
  }
  tick();
}());

/* ══════════════════════════════════════════════════════
   9. ENHANCED SCROLL ANIMATIONS
      Handles: reveal-up · reveal-left · reveal-right
               reveal-zoom · reveal-fade
               stagger-item (auto-delay children)
               heading-reveal (char-by-char)
               line-reveal (draw-in rule)
══════════════════════════════════════════════════════ */
(function initScrollAnimations() {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Char-split headings ── */
  document.querySelectorAll('.heading-reveal').forEach((el) => {
    if (REDUCED) { el.classList.add('revealed'); return; }
    const text = el.textContent;
    el.innerHTML = [...text].map((c) =>
      `<span class="char" aria-hidden="true">${c === ' ' ? '&nbsp;' : c}</span>`
    ).join('');
    // Keep accessible text via aria-label on parent
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', text);
  });

  /* ── Stagger groups: auto-assign --delay to children ── */
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    const base  = parseFloat(group.dataset.staggerBase  || '0');
    const step  = parseFloat(group.dataset.staggerStep  || '0.1');
    group.querySelectorAll('.stagger-item').forEach((item, i) => {
      item.style.setProperty('--delay', `${(base + i * step).toFixed(2)}s`);
    });
  });

  /* ── Char reveal stagger inside .heading-reveal ── */
  function staggerChars(el) {
    el.querySelectorAll('.char').forEach((c, i) => {
      c.style.transitionDelay = `${i * 0.035}s`;
    });
    el.classList.add('revealed');
  }

  /* ── IntersectionObserver ── */
  const SELECTORS = [
    '.reveal-up', '.reveal-down', '.reveal-left', '.reveal-right',
    '.reveal-zoom', '.reveal-fade', '.reveal-flip', '.glow-pulse',
    '.stagger-item', '.heading-reveal', '.line-reveal'
  ].join(', ');

  if (REDUCED) {
    document.querySelectorAll(SELECTORS).forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.classList.contains('heading-reveal')) {
        staggerChars(el);
      } else {
        el.classList.add('revealed');
      }
      observer.unobserve(el);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll(SELECTORS).forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 20) {
      if (el.classList.contains('heading-reveal')) {
        staggerChars(el);
      } else {
        el.classList.add('revealed');
      }
    } else {
      observer.observe(el);
    }
  });
}());

/* ══════════════════════════════════════════════════════
   10. 3D TILT EFFECT & INTERACTIVE ZOOM
══════════════════════════════════════════════════════ */
(function initTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const MAX = 7;
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left;
      const y  = e.clientY - r.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const dx = (x - r.width/2)  / (r.width/2);
      const dy = (y - r.height/2) / (r.height/2);
      card.style.transform = `perspective(850px) rotateX(${(-dy*MAX).toFixed(1)}deg) rotateY(${(dx*MAX).toFixed(1)}deg) translateY(-8px) scale3d(1.045, 1.045, 1.045)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    });
  });
}());

/* ══════════════════════════════════════════════════════
   11. EVENT FILTER TABS
══════════════════════════════════════════════════════ */
(function initEventFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.event-card');
  if (!btns.length || !cards.length) return;

  // Show all initially
  cards.forEach((c) => c.classList.add('revealed'));

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      const f = btn.dataset.filter;
      cards.forEach((card) => {
        const show = f === 'all' || card.dataset.category === f;
        card.classList.toggle('hidden', !show);
        if (show) { card.classList.remove('revealed'); requestAnimationFrame(() => card.classList.add('revealed')); }
      });
    });
  });
}());

/* ══════════════════════════════════════════════════════
   12. COUNT-UP STATS
══════════════════════════════════════════════════════ */
(function initCountUp() {
  const els = document.querySelectorAll('.stat-number[data-target]');
  if (!els.length) return;

  function easeOut(t) { return 1 - Math.pow(1-t, 3); }

  function animate(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    const target = parseInt(el.dataset.target, 10);
    const start  = performance.now();
    const DURATION = 1600;
    el.classList.add('counting');

    function step(now) {
      const p = Math.min((now-start)/DURATION, 1);
      el.textContent = Math.round(easeOut(p)*target);
      if (p < 1) requestAnimationFrame(step);
      else { el.textContent = target; el.classList.remove('counting'); }
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animate(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 20) {
      animate(el);
    } else {
      obs.observe(el);
    }
  });
}());

/* ══════════════════════════════════════════════════════
   12B. BACK TO TOP BUTTON WITH CIRCULAR PROGRESS
══════════════════════════════════════════════════════ */
(function initBackToTop() {
  let btn = document.querySelector('.back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = `
      <svg class="progress-ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle class="progress-circle" cx="24" cy="24" r="22" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    `;
    document.body.appendChild(btn);
  }

  const circle = btn.querySelector('.progress-circle');
  const circumference = 2 * Math.PI * 22; // ~138.2
  if (circle) circle.style.strokeDasharray = `${circumference}`;

  function onScroll() {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;

    if (scrolled > 260) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }

    if (circle && scrollTotal > 0) {
      const progress = Math.min(Math.max(scrolled / scrollTotal, 0), 1);
      const offset = circumference - (progress * circumference);
      circle.style.strokeDashoffset = `${offset}`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  onScroll();
}());

/* ══════════════════════════════════════════════════════
   12C. FAQ ACCORDION HANDLER
══════════════════════════════════════════════════ */
(function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          const q = other.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}());

/* ══════════════════════════════════════════════════════
   13. GALLERY LIGHTBOX
══════════════════════════════════════════════════════ */
(function initLightbox() {
  const lb       = document.getElementById('lightbox');
  const bd       = document.getElementById('lightbox-backdrop');
  const content  = document.getElementById('lightbox-content');
  const caption  = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn  = document.getElementById('lightbox-prev');
  const nextBtn  = document.getElementById('lightbox-next');
  const btns     = document.querySelectorAll('.gallery-btn');
  if (!lb || !bd) return;

  const items = Array.from(btns).map((b) => ({
    label: b.getAttribute('aria-label')?.replace(/^(Open|View) gallery image: /,'') ||
           b.querySelector('.gallery-overlay span')?.textContent || '',
    html:  b.querySelector('.gallery-placeholder')?.outerHTML || '',
  }));

  let cur = 0;

  function show(i) {
    cur = (i + items.length) % items.length;
    content.innerHTML = items[cur].html;
    caption.textContent = items[cur].label;
    lb.setAttribute('aria-hidden','false'); lb.classList.add('active');
    bd.classList.add('active');
    closeBtn?.focus();
    document.body.style.overflow = 'hidden';
  }
  function hide() {
    lb.setAttribute('aria-hidden','true'); lb.classList.remove('active');
    bd.classList.remove('active');
    document.body.style.overflow = '';
  }

  btns.forEach((b,i) => b.addEventListener('click', () => show(i)));
  closeBtn?.addEventListener('click', hide);
  bd?.addEventListener('click', hide);
  prevBtn?.addEventListener('click', () => show(cur-1));
  nextBtn?.addEventListener('click', () => show(cur+1));
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;
    if (e.key==='Escape')      hide();
    if (e.key==='ArrowLeft')   show(cur-1);
    if (e.key==='ArrowRight')  show(cur+1);
  });
}());

/* ══════════════════════════════════════════════════════
   14. CONTACT FORM VALIDATION + SUCCESS
══════════════════════════════════════════════════════ */
(function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const reset   = document.getElementById('form-reset');
  if (!form) return;

  function showErr(id, msg) {
    const inp = document.getElementById(id);
    const err = document.getElementById(`${id}-error`);
    if (!inp||!err) return;
    inp.classList.add('error'); err.textContent = msg;
    inp.setAttribute('aria-invalid','true');
  }
  function clearErr(id) {
    const inp = document.getElementById(id);
    const err = document.getElementById(`${id}-error`);
    if (!inp||!err) return;
    inp.classList.remove('error'); err.textContent='';
    inp.removeAttribute('aria-invalid');
  }

  function validate() {
    let ok = true;
    const name = document.getElementById('name');
    clearErr('name');
    if (!name?.value.trim())            { showErr('name','Please enter your full name.'); ok=false; }
    else if (name.value.trim().length<2){ showErr('name','Name must be at least 2 characters.'); ok=false; }

    const email = document.getElementById('email');
    clearErr('email');
    if (!email?.value.trim())           { showErr('email','Please enter your email address.'); ok=false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showErr('email','Please enter a valid email.'); ok=false; }

    const interest = document.getElementById('interest');
    clearErr('interest');
    if (!interest?.value) { showErr('interest','Please select an area of interest.'); ok=false; }

    return ok;
  }

  ['name','email','interest'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input',  () => clearErr(id));
    document.getElementById(id)?.addEventListener('change', () => clearErr(id));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
    const sub = document.getElementById('form-submit');
    if (sub) { sub.disabled=true; sub.innerHTML='<svg class="spin-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending…'; }
    setTimeout(() => {
      form.style.display = 'none';
      if (success) { success.removeAttribute('aria-hidden'); success.classList.add('visible','glass-card'); }
      if (sub) sub.disabled = false;
    }, 1400);
  });

  reset?.addEventListener('click', () => {
    form.reset(); form.style.display='';
    if (success) { success.setAttribute('aria-hidden','true'); success.classList.remove('visible'); }
    document.getElementById('name')?.focus();
  });
}());

/* ══════════════════════════════════════════════════════
   15. KONAMI CODE EASTER EGG
══════════════════════════════════════════════════════ */
(function initKonami() {
  const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let p = 0;
  const egg   = document.getElementById('easter-egg');
  const close = document.getElementById('ee-close');
  if (!egg) return;

  document.addEventListener('keydown', (e) => {
    p = e.key === SEQ[p] ? p+1 : (e.key===SEQ[0] ? 1 : 0);
    if (p === SEQ.length) { p=0; activate(); }
  });

  function activate() {
    egg.removeAttribute('aria-hidden'); egg.classList.add('active');
    close?.focus();
    launch();
    setTimeout(deactivate, 8000);
  }
  function deactivate() { egg.setAttribute('aria-hidden','true'); egg.classList.remove('active'); }
  close?.addEventListener('click', deactivate);
  document.addEventListener('keydown', (e) => { if (e.key==='Escape' && egg.classList.contains('active')) deactivate(); });

  function launch() {
    const old = egg.querySelector('.ee-confetti');
    if (old) old.remove();
    const wrap = document.createElement('div');
    wrap.className = 'ee-confetti';
    wrap.setAttribute('aria-hidden','true');
    wrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
    const COLS = ['#00629B','#0082CC','#C8843A','#E8A056','#FFD700','#7B68EE','#FF6B9D'];
    for (let i=0; i<70; i++) {
      const s = document.createElement('span');
      const size = 5 + Math.random()*9;
      s.style.cssText = `position:absolute;left:${Math.random()*100}%;top:-10px;width:${size}px;height:${size}px;background:${COLS[Math.floor(Math.random()*COLS.length)]};border-radius:${Math.random()>.5?'50%':'3px'};animation:cfall ${1.4+Math.random()*2}s ease-in ${Math.random()*1.2}s forwards;transform:rotate(${Math.random()*360}deg);`;
      wrap.appendChild(s);
    }
    if (!document.getElementById('confetti-kf')) {
      const st = document.createElement('style'); st.id='confetti-kf';
      st.textContent='@keyframes cfall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';
      document.head.appendChild(st);
    }
    egg.appendChild(wrap);
  }
}());

/* ══════════════════════════════════════════════════════
   16. FOOTER YEAR
══════════════════════════════════════════════════════ */
(function() { const el=document.getElementById('year'); if(el) el.textContent=new Date().getFullYear(); }());

/* ══════════════════════════════════════════════════════
   17. SMOOTH SCROLL (intra-page only)
══════════════════════════════════════════════════════ */
(function() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const t = document.querySelector(link.getAttribute('href'));
      if (!t) return; e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')||'72',10);
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - navH, behavior:'smooth' });
    });
  });
}());

/* Spinning icon CSS */
(function() {
  const s=document.createElement('style');
  s.textContent='.spin-icon{animation:_spin .8s linear infinite}@keyframes _spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(s);
}());

/* ══════════════════════════════════════════════════════
   18. FLAGSHIP EVENT LIVE COUNTDOWN
══════════════════════════════════════════════════════ */
(function initCountdown() {
  const dEl = document.getElementById('cd-days');
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-mins');
  const sEl = document.getElementById('cd-secs');
  if (!dEl || !hEl || !mEl || !sEl) return;

  const target = new Date('2026-10-15T09:00:00+05:30').getTime();

  function update() {
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    dEl.textContent = String(days).padStart(2, '0');
    hEl.textContent = String(hours).padStart(2, '0');
    mEl.textContent = String(mins).padStart(2, '0');
    sEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}());

/* ══════════════════════════════════════════════════════
   19. INTERACTIVE TERMINAL SHELL
══════════════════════════════════════════════════ */
(function initInteractiveTerminal() {
  const terminal = document.querySelector('.interactive-terminal');
  if (!terminal) return;

  const windowEl = terminal.querySelector('.terminal-window');
  const inputEl  = terminal.querySelector('.terminal-cmd-input');
  const chips    = terminal.querySelectorAll('.terminal-chip');

  const COMMANDS = {
    help: 'Available commands: [about], [events], [execom], [awards], [join], [clear]',
    about: 'IEEE Computer Society MBITS — premier technical chapter fostering coding, research, and leadership in Kerala.',
    events: 'Upcoming: 1) WebNova Design Sprint (Oct 15), 2) NeuralNexus GenAI (Nov 02), 3) Quantum Horizons (Nov 20). Type [join] to register.',
    execom: 'Core Leadership: Dr. Binu K (Advisor), Alan Mathew (Chair), Sneha Paul (Vice-Chair), Rahul Nair (Secretary).',
    awards: 'Honours: Best IEEE CS Student Branch (Kerala Section 2023), IEEEXtreme Global Top 100, 3 Research Papers.',
    join: 'Membership is open to all MBITS engineering students! Visit contact.html or click the "Join Us" button above.',
    clear: '__CLEAR__'
  };

  function appendLine(text, type = 'out') {
    const p = document.createElement('div');
    p.className = `terminal-line ${type}`;
    p.textContent = text;
    windowEl.appendChild(p);
    windowEl.scrollTop = windowEl.scrollHeight;
  }

  function runCmd(cmd) {
    const raw = cmd.trim().toLowerCase();
    if (!raw) return;

    appendLine(`$ ${cmd}`, 'accent');

    if (raw === 'clear') {
      windowEl.innerHTML = '';
      appendLine('Terminal cleared. Type "help" for commands.', 'out');
      return;
    }

    if (COMMANDS[raw]) {
      appendLine(COMMANDS[raw], 'out');
    } else {
      appendLine(`bash: command not found: ${cmd}. Type "help" for valid options.`, 'out');
    }
  }

  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = inputEl.value;
      inputEl.value = '';
      runCmd(val);
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd || chip.textContent.replace(/[\[\]]/g, '').trim();
      runCmd(cmd);
      inputEl?.focus();
    });
  });
}());

/* ══════════════════════════════════════════════════════
   20. NEWSLETTER SUBSCRIPTION
══════════════════════════════════════════════════ */
(function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const msg  = document.getElementById('newsletter-msg');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    if (!input || !input.value.trim() || !input.value.includes('@')) return;

    const email = input.value.trim();
    localStorage.setItem('ieee_newsletter_subscriber', email);
    input.value = '';

    if (msg) {
      msg.textContent = '✓ Subscribed successfully! Welcome to IEEE CS MBITS dispatch.';
      msg.classList.add('active');
      setTimeout(() => msg.classList.remove('active'), 5000);
    }
  });
}());

/* ══════════════════════════════════════════════════════
   21. MILESTONE ERA FILTER (ACHIEVEMENTS PAGE)
══════════════════════════════════════════════════════ */
(function initMilestoneFilter() {
  const filterBtns = document.querySelectorAll('.milestone-filter-btn');
  const cards = document.querySelectorAll('.milestone-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const era = btn.dataset.era;
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      cards.forEach((card) => {
        const cardEra = card.dataset.era;
        if (era === 'all' || cardEra === era) {
          card.classList.remove('milestone-hidden');
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.classList.add('milestone-hidden');
        }
      });
    });
  });
}());

/* ══════════════════════════════════════════════════════
   22. MILESTONE DETAIL SPOTLIGHT MODAL (ZOOM-IN)
══════════════════════════════════════════════════════ */
(function initMilestoneDetailModal() {
  const modal = document.getElementById('milestone-modal');
  if (!modal) return;

  const yearEl   = document.getElementById('modal-year-badge');
  const tagEl    = document.getElementById('modal-tag');
  const titleEl  = document.getElementById('modal-milestone-title');
  const descEl   = document.getElementById('modal-desc');
  const chipEl   = document.getElementById('modal-meta-chip');
  const metricsEl= document.getElementById('modal-metrics');
  const closeBtn = document.getElementById('milestone-modal-close');
  const closeBtn2= document.getElementById('modal-close-btn');
  const backdrop = document.getElementById('milestone-modal-backdrop');

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function openModal(card) {
    const year  = card.querySelector('.milestone-year-badge')?.textContent.trim() || '2026';
    const tag   = card.querySelector('.milestone-tag')?.textContent.trim() || 'Milestone';
    const title = card.querySelector('.milestone-title')?.textContent.trim() || 'Chapter Milestone';
    const desc  = card.querySelector('.milestone-desc')?.textContent.trim() || '';
    const chip  = card.querySelector('.milestone-meta-chip')?.textContent.trim() || 'IEEE MBITS';

    if (yearEl) yearEl.textContent = year;
    if (tagEl) tagEl.textContent = tag;
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
    if (chipEl) chipEl.textContent = chip;

    if (metricsEl) {
      metricsEl.innerHTML = `
        <div class="milestone-modal-metric-box">
          <span class="milestone-modal-metric-num">${year}</span>
          <span class="milestone-modal-metric-label">Chapter Year</span>
        </div>
        <div class="milestone-modal-metric-box">
          <span class="milestone-modal-metric-num">IEEE R10</span>
          <span class="milestone-modal-metric-label">Section Region</span>
        </div>
        <div class="milestone-modal-metric-box">
          <span class="milestone-modal-metric-num">${chip}</span>
          <span class="milestone-modal-metric-label">Impact Status</span>
        </div>
        <div class="milestone-modal-metric-box">
          <span class="milestone-modal-metric-num">Verified</span>
          <span class="milestone-modal-metric-label">Official Record</span>
        </div>
      `;
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  document.querySelectorAll('.milestone-card').forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-haspopup', 'dialog');
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  closeBtn2?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}());


