// Año dinámico en el footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Navbar: sombra al hacer scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('is-scrolled', window.scrollY > 8);
}, { passive: true });

// Menú móvil
const burger = document.querySelector('.nav__burger');
const mobileMenu = document.getElementById('mobileMenu');
burger?.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!open));
  mobileMenu.hidden = open;
});
mobileMenu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
  });
});

// Reveal on scroll (IntersectionObserver)
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Placeholders de descarga / contacto: no simular funcionalidad
document.querySelectorAll('[data-placeholder]').forEach(el => {
  el.addEventListener('click', (e) => {
    const href = el.getAttribute('href');
    if (href === '#' || href?.startsWith('#contacto')) {
      e.preventDefault();
      console.info(`[PetMate] Enlace placeholder: ${el.dataset.placeholder}. Configurar URL real antes de publicar.`);
    }
  });
});