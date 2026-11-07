/* =============================================================
   PETMATE — Efecto magnético del botón
   ============================================================= */

(function () {
  'use strict';

  /* EFECTO MAGNÉTICO en el botón de Google Play */
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
})();