/* STUDIO DIGI — scroll motion (GSAP + ScrollTrigger)
   1. Showcase: the laptop turns and changes project as the page scrolls.
   2. Kinetic fronts: the four fronts pass across the screen with their projects.
   Without GSAP, or with reduced motion, the page stays static and readable. */
(() => {
  'use strict';
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const showcase = document.querySelector('[data-showcase]');
  const laptop = document.querySelector('[data-laptop]');
  const shots = gsap.utils.toArray('.laptop__screen img');
  const items = gsap.utils.toArray('.showcase__list li');
  const kinetic = document.querySelector('[data-kinetic]');
  const setActive = (i) => items.forEach((li, k) => li.classList.toggle('is-active', k === i));

  const mm = gsap.matchMedia();

  // desktop: both sections pin and follow the scroll
  mm.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
    if (showcase && laptop && shots.length) {
      showcase.classList.add('is-live');
      gsap.set(shots.slice(1), { autoAlpha: 1, clipPath: 'inset(100% 0% 0% 0%)' });

      const steps = shots.length + 1; // intro + one step per new screen + outro
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: showcase,
          start: 'top top',
          end: '+=260%',
          scrub: 1,
          pin: true,
          onUpdate: (self) => setActive(gsap.utils.clamp(0, shots.length - 1, Math.floor(self.progress * steps - 0.5)))
        }
      });
      tl.fromTo(laptop,
        { rotationY: -32, rotationX: 18, scale: 0.84, y: 70 },
        { rotationY: -8, rotationX: 6, scale: 1, y: 0, duration: 1, ease: 'power2.out' });
      shots.slice(1).forEach((img, i) => {
        tl.to(laptop, { rotationY: i % 2 ? -10 : 10, duration: 1, ease: 'sine.inOut' })
          .to(img, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, '<')
          .fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1, ease: 'power2.out' }, '<');
      });
      tl.to(laptop, { rotationY: 14, rotationX: 4, scale: 0.95, duration: 1, ease: 'power1.inOut' });
    }

    if (kinetic) {
      kinetic.classList.add('is-live');
      const groups = gsap.utils.toArray('.kgroup', kinetic);
      const yOffset = [-215, 25, 205];
      const tilt = [7, -5, 4];
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: kinetic, start: 'top top', end: '+=240%', scrub: 1, pin: true }
      });
      groups.forEach((group, i) => {
        const word = group.querySelector('.kgroup__word');
        tl.fromTo(word,
          { autoAlpha: 0, yPercent: 45, rotationX: -55, transformPerspective: 900 },
          { autoAlpha: 1, yPercent: 0, rotationX: 0, duration: 0.25, ease: 'power3.out' }, i);
        if (i < groups.length - 1) {
          tl.to(word, { autoAlpha: 0, yPercent: -45, rotationX: 55, duration: 0.25, ease: 'power3.in' }, i + 0.78);
        }
        gsap.utils.toArray('.kthumb', group).forEach((thumb, j) => {
          tl.fromTo(thumb,
            { x: () => window.innerWidth * 0.62, y: yOffset[j], xPercent: -50, yPercent: -50, rotation: tilt[j], rotationY: -28, transformPerspective: 900 },
            { x: () => -window.innerWidth * 0.62, rotation: -tilt[j], rotationY: 28, duration: 1.05 },
            i - 0.05 + j * 0.09);
        });
      });
    }

    return () => {
      showcase && showcase.classList.remove('is-live');
      kinetic && kinetic.classList.remove('is-live');
      setActive(0);
    };
  });

  // phone: no pinning; the laptop tilts in on scroll and changes project on its own while it is on screen
  mm.add('(max-width: 760px) and (prefers-reduced-motion: no-preference)', () => {
    if (!showcase || !laptop || !shots.length) return undefined;
    showcase.classList.add('is-live');
    gsap.fromTo(laptop,
      { rotationX: 22, scale: 0.88, y: 40 },
      { rotationX: 4, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: showcase, start: 'top 95%', end: 'top 25%', scrub: 1 } });

    let current = 0;
    let layer = shots.length;
    let timer = null;
    const step = () => {
      const next = (current + 1) % shots.length;
      const img = shots[next];
      img.style.zIndex = String(++layer);
      gsap.fromTo(img, { autoAlpha: 1, clipPath: 'inset(100% 0% 0% 0%)', scale: 1.1 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1, ease: 'power2.inOut' });
      gsap.to(laptop, { rotationY: next % 2 ? -9 : 9, duration: 1.4, ease: 'sine.inOut' });
      setActive(next);
      current = next;
    };
    const play = () => { if (!timer) timer = setInterval(step, 2600); };
    const stop = () => { clearInterval(timer); timer = null; };
    ScrollTrigger.create({ trigger: showcase, start: 'top 75%', end: 'bottom 25%', onToggle: (self) => (self.isActive ? play() : stop()) });

    return () => {
      stop();
      showcase.classList.remove('is-live');
      gsap.set([laptop, ...shots], { clearProps: 'all' });
      setActive(0);
    };
  });

  // images and fonts change the layout after load: recalculate the scroll positions once
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
