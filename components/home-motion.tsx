'use client';

import { useEffect, useRef, type ReactNode } from 'react';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function enableMotion(home: HTMLDivElement) {
  const hero = home.querySelector<HTMLElement>('.hero-project .hero-showcase');
  const process = home.querySelector<HTMLElement>('#process');
  if (!hero || !process) return () => {};
  return bindMotion(home, hero, process);
}

function bindMotion(home: HTMLElement, hero: HTMLElement, process: HTMLElement) {

  const pointerZones = home.querySelectorAll<HTMLElement>('.hero-project, #work .project-view');
  const headings = home.querySelectorAll<HTMLElement>('[data-reveal]');
  const finePointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
  const events = new AbortController();
  const options = { passive: true, signal: events.signal };
  let heroVisible = true;
  let processVisible = true;
  let frame = 0;
  let light: HTMLElement | null = null;
  let pointerX = 0;
  let pointerY = 0;

  function clearLight() {
    if (!light) return;
    light.removeAttribute('data-lit');
    light.style.removeProperty('--light-x');
    light.style.removeProperty('--light-y');
    light = null;
  }

  function paint() {
    frame = 0;
    const height = Math.max(1, window.innerHeight);
    const heroBox = heroVisible ? hero.getBoundingClientRect() : null;
    const processBox = processVisible ? process.getBoundingClientRect() : null;
    const lightBox = light === hero && heroBox ? heroBox : light?.getBoundingClientRect();

    if (heroBox) {
      const offset = (height / 2 - heroBox.top - heroBox.height / 2) / height;
      hero.style.setProperty('--scene-depth', clamp(offset, -1, 1).toFixed(4));
    }
    if (processBox) {
      const progress = clamp((height - processBox.top) / (height + processBox.height), 0, 1);
      process.style.setProperty('--paper-angle', (-16 + progress * 82).toFixed(2) + 'deg');
    }
    if (light && lightBox) {
      const x = pointerX - lightBox.left;
      const y = pointerY - lightBox.top;
      if (x < 0 || x > lightBox.width || y < 0 || y > lightBox.height) {
        clearLight();
      } else {
        light.style.setProperty('--light-x', x.toFixed(1) + 'px');
        light.style.setProperty('--light-y', y.toFixed(1) + 'px');
        light.setAttribute('data-lit', '');
      }
    }
  }

  function schedule() {
    if (!frame && (heroVisible || processVisible || light)) {
      frame = window.requestAnimationFrame(paint);
    }
  }

  function follow(event: PointerEvent) {
    if (!finePointer.matches || event.pointerType === 'touch') return;
    const surface = event.target instanceof Element
      ? event.target.closest<HTMLElement>('figure.showcase')
      : null;
    if (light !== surface) clearLight();
    if (!surface) return;
    light = surface;
    pointerX = event.clientX;
    pointerY = event.clientY;
    schedule();
  }

  // Content is rendered visibly. Intersection only starts a one-shot animation.
  let sceneObserver: IntersectionObserver | undefined;
  let reveals: IntersectionObserver | undefined;
  if ('IntersectionObserver' in window) {
    sceneObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === process) processVisible = entry.isIntersecting;
      }
      schedule();
    }, { rootMargin: '64px 0px' });
    sceneObserver.observe(hero);
    sceneObserver.observe(process);
    reveals = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-entered', '');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    for (const heading of headings) reveals.observe(heading);
  }

  window.addEventListener('scroll', schedule, options);
  window.addEventListener('resize', schedule, options);
  window.addEventListener('blur', clearLight, options);
  finePointer.addEventListener('change', clearLight, options);
  for (const zone of pointerZones) {
    zone.addEventListener('pointermove', follow, options);
    zone.addEventListener('pointerleave', clearLight, options);
    zone.addEventListener('pointercancel', clearLight, options);
  }
  schedule();

  return () => {
    events.abort();
    sceneObserver?.disconnect();
    reveals?.disconnect();
    window.cancelAnimationFrame(frame);
    clearLight();
    hero.style.removeProperty('--scene-depth');
    process.style.removeProperty('--paper-angle');
    headings.forEach((heading) => heading.removeAttribute('data-entered'));
  };
}

// Children come from the Server Component. Only motion needs the browser.
export function HomeMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const home = ref.current;
    if (!home) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stop: (() => void) | undefined;

    const sync = () => {
      stop?.();
      stop = preference.matches ? undefined : enableMotion(home);
    };

    sync();
    preference.addEventListener('change', sync);
    return () => {
      preference.removeEventListener('change', sync);
      stop?.();
    };
  }, []);

  return <div className="motion-home" ref={ref}>{children}</div>;
}
