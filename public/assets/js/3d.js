/* =============================================================
   PETMATE — Interacciones 3D, tilt, parallax y carrusel
   ============================================================= */

(function () {
  'use strict';

  /* 1. TILT 3D SUAVE en el teléfono */
  const tiltEls = document.querySelectorAll('[data-tilt]');
  tiltEls.forEach((el) => {
    const strength = parseFloat(el.dataset.tiltStrength || '3');
    let raf = null;

    function handleMove(e) {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        const rotX = -dy * strength;
        const rotY = dx * strength;

        el.style.transform = `perspective(1400px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        raf = null;
      });
    }

    function reset() {
      el.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg)';
    }

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', reset);
  });

  /* 2. EFECTO MAGNÉTICO en el botón de Google Play */
  const magneticEls = document.querySelectorAll('.magnetic');
  magneticEls.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;

      el.style.setProperty('--mx', `${dx}px`);
      el.style.setProperty('--my', `${dy}px`);
    });

    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    });
  });

  /* 3. FLOAT CARDS — velocidades personalizadas */
  document.querySelectorAll('[data-float]').forEach((card) => {
    const speed = card.dataset.float;
    const duration =
      speed === 'fast' ? '5s' : speed === 'slow' ? '7s' : '6s';
    card.style.animationDuration = duration;
  });

  /* 4. CARRUSEL AUTOMÁTICO del teléfono */
  const slides = document.querySelectorAll('.splash-slide');
  if (slides.length > 1 && !window.__carouselInit) {
    window.__carouselInit = true;
    let current = 0;

    setInterval(() => {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 4000);
  }

  /* 5. REVEAL al cargar */
  window.addEventListener('load', () => {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
})();