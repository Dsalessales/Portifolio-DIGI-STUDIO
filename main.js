/* STUDIO DIGI — portfolio interactions */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // header gets a background once the page scrolls
  const header = document.querySelector('[data-header]');
  const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // mobile menu
  const menuBtn = document.querySelector('[data-menu]');
  const nav = document.getElementById('menu');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('.sr').textContent = open ? 'Fechar menu' : 'Abrir menu';
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // reveal on scroll
  const items = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  }

  // hero collage follows the pointer a little
  const collage = document.querySelector('[data-collage]');
  if (collage && !reduced && window.matchMedia('(hover: hover)').matches) {
    const tiles = [...collage.querySelectorAll('.tile')];
    window.addEventListener('pointermove', (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      tiles.forEach((tile, i) => {
        const depth = 8 + (i % 3) * 8;
        tile.style.setProperty('--px', `${(x * depth).toFixed(1)}px`);
        tile.style.setProperty('--py', `${(y * depth).toFixed(1)}px`);
      });
    }, { passive: true });
  }

  // project filters
  const filters = document.querySelector('[data-filters]');
  const cards = [...document.querySelectorAll('[data-grid] .card')];
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    filters.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    const kind = btn.dataset.filter;
    cards.forEach((card) => {
      card.hidden = kind !== 'all' && card.dataset.kind !== kind;
      if (!card.hidden) card.classList.add('is-in');
    });
  });

  // drag to scroll the Kissa screens
  const strip = document.querySelector('[data-strip]');
  if (strip) {
    let down = false; let startX = 0; let startLeft = 0;
    strip.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      down = true; startX = e.clientX; startLeft = strip.scrollLeft;
      strip.classList.add('is-dragging'); strip.setPointerCapture(e.pointerId);
    });
    strip.addEventListener('pointermove', (e) => { if (down) strip.scrollLeft = startLeft - (e.clientX - startX); });
    const stop = () => { down = false; strip.classList.remove('is-dragging'); };
    strip.addEventListener('pointerup', stop);
    strip.addEventListener('pointercancel', stop);
  }

  // the video only plays while it is on screen
  const video = document.querySelector('.phone__video');
  if (video) {
    if (reduced) { video.removeAttribute('autoplay'); video.pause(); video.controls = true; }
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { if (entry.isIntersecting) video.play().catch(() => {}); else video.pause(); }, { threshold: 0.25 }).observe(video);
    }
  }
})();
