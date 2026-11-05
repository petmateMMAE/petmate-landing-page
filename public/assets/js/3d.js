/* PetMate: subtle desktop 3D interactions. Touch and reduced-motion users
   keep the full page without cursor-driven movement. */
export function initPetMate3D(root = document) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (reduceMotion.matches || !finePointer.matches) return () => {};

  const cleanups = [];
  const listen = (el, event, callback) => {
    el.addEventListener(event, callback, { passive: true });
    cleanups.push(() => el.removeEventListener(event, callback));
  };

  root.querySelectorAll('[data-tilt]').forEach((el) => {
    const strength = Math.min(Number.parseFloat(el.dataset.tiltStrength) || 8, 18);
    let frame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    const tick = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      el.style.setProperty('--tilt-x', currentX.toFixed(2));
      el.style.setProperty('--tilt-y', currentY.toFixed(2));
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        frame = requestAnimationFrame(tick);
      } else frame = 0;
    };
    listen(el, 'pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * strength * 2;
      targetY = (0.5 - (event.clientY - rect.top) / rect.height) * strength * 2;
      if (!frame) frame = requestAnimationFrame(tick);
    });
    listen(el, 'pointerleave', () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = requestAnimationFrame(tick);
    });
    cleanups.push(() => cancelAnimationFrame(frame));
  });

  root.querySelectorAll('[data-spotlight]').forEach((el) => {
    listen(el, 'pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      el.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    });
  });

  root.querySelectorAll('.magnetic').forEach((el) => {
    listen(el, 'pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mag-x', `${((event.clientX - rect.left) - rect.width / 2) * 0.12}px`);
      el.style.setProperty('--mag-y', `${((event.clientY - rect.top) - rect.height / 2) * 0.12}px`);
    });
    listen(el, 'pointerleave', () => {
      el.style.setProperty('--mag-x', '0px');
      el.style.setProperty('--mag-y', '0px');
    });
  });

  const hero = root.querySelector('.hero[data-parallax-scene]');
  if (hero) {
    const layers = hero.querySelectorAll('[data-parallax-layer]');
    let frame = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    const animate = () => {
      x += (targetX - x) * 0.09;
      y += (targetY - y) * 0.09;
      layers.forEach((layer) => {
        const depth = Number.parseFloat(layer.dataset.parallaxLayer) || 0.1;
        layer.style.setProperty('--parallax-x', `${x * depth * 40}px`);
        layer.style.setProperty('--parallax-y', `${y * depth * 40}px`);
      });
      if (Math.abs(targetX - x) > 0.001 || Math.abs(targetY - y) > 0.001) frame = requestAnimationFrame(animate);
      else frame = 0;
    };
    listen(hero, 'pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / rect.width - 0.5;
      targetY = (event.clientY - rect.top) / rect.height - 0.5;
      if (!frame) frame = requestAnimationFrame(animate);
    });
    listen(hero, 'pointerleave', () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = requestAnimationFrame(animate);
    });
    cleanups.push(() => cancelAnimationFrame(frame));

    const numeral = hero.querySelector('.hero__numeral');
    if (numeral) {
      let scrollFrame = 0;
      const updateScroll = () => {
        const progress = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);
        numeral.style.setProperty('--scroll-y', `${progress * 60}px`);
        numeral.style.setProperty('--scroll-z', `${progress * 120}px`);
        numeral.style.setProperty('--scroll-rotate', `${progress * 8}deg`);
        numeral.style.opacity = String(1 - progress * 0.8);
        scrollFrame = 0;
      };
      const onScroll = () => {
        if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
      };
      listen(window, 'scroll', onScroll);
      updateScroll();
      cleanups.push(() => cancelAnimationFrame(scrollFrame));
    }
  }

  const scene = root.querySelector('[data-hero-scene]');
  if (scene) {
    let frame = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    const animate = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      scene.style.setProperty('--scene-x', `${x * 7}deg`);
      scene.style.setProperty('--scene-y', `${y * -6}deg`);
      if (Math.abs(targetX - x) > 0.001 || Math.abs(targetY - y) > 0.001) frame = requestAnimationFrame(animate);
      else frame = 0;
    };
    listen(scene, 'pointermove', (event) => {
      const rect = scene.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / rect.width - 0.5;
      targetY = (event.clientY - rect.top) / rect.height - 0.5;
      if (!frame) frame = requestAnimationFrame(animate);
    });
    listen(scene, 'pointerleave', () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = requestAnimationFrame(animate);
    });
    cleanups.push(() => cancelAnimationFrame(frame));
  }

  const onPreferenceChange = () => {
    if (reduceMotion.matches) cleanup();
  };
  const cleanup = () => cleanups.splice(0).forEach((fn) => fn());
  reduceMotion.addEventListener?.('change', onPreferenceChange);
  cleanups.push(() => reduceMotion.removeEventListener?.('change', onPreferenceChange));
  return cleanup;
}
