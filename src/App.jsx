import React, { useEffect, useState, useRef } from 'react';
import { initPetMate3D } from '../assets/js/3d.js';

/* =============================================================
   DATA
   ============================================================= */
const navItems = [
  ['Cómo funciona', '#como-funciona'],
  ['Qué puedes organizar', '#funcionalidades'],
  ['Para veterinarias', '#negocios'],
  ['Dudas', '#faq'],
];

const features = [
  ['＋', 'Vacunas y desparasitación', 'Fechas y registros listos para consultar antes de una visita.'],
  ['↗', 'Consultas y recetas', 'Un historial que ayuda a dar continuidad a cada atención.'],
  ['♡', 'Alergias y cuidados', 'La información importante, visible cuando hace falta.'],
  ['⌂', 'Perfil de cada mascota', 'Datos básicos y documentos reunidos en su propia ficha.'],
  ['◷', 'Recordatorios', 'Avisos de cuidado planeados para una siguiente etapa.'],
  ['⌗', 'Compartir con QR', 'El tutor decide qué información mostrar y a quién.'],
];

const appScreens = [
  { id: 'mascotas', label: 'Mascotas', src: 'mascotas.png', alt: 'Pantalla de PetMate con la lista de mascotas y la ficha de Firus', caption: 'Todas tus mascotas, en un solo lugar.' },
  { id: 'carnet', label: 'Carnet', src: 'carnet.png', alt: 'Carnet de Firus con vacunas, desparasitación, peso y alergias', caption: 'Su historial de salud, listo para consultar.' },
  { id: 'qr', label: 'Compartir QR', src: 'qr.png', alt: 'Código QR de Firus con los datos compartidos y el tiempo de acceso', caption: 'Comparte el historial con autorización.' },
  { id: 'agregar', label: 'Agregar mascota', src: 'agregar-mascota.png', alt: 'Pantalla para agregar la primera mascota en PetMate', caption: 'Empieza creando su perfil.' },
  { id: 'bienvenida', label: 'Bienvenida', src: 'bienvenida.png', alt: 'Pantalla de bienvenida de la aplicación PetMate', caption: 'PetMate, siempre a la mano.' },
];

const faqs = [
  ['¿PetMate sustituye una consulta veterinaria?', 'No. PetMate ayuda a organizar información; el diagnóstico y tratamiento corresponden a un profesional veterinario.'],
  ['¿Quién puede ver los datos?', 'El tutor administra la información y decide cuándo compartirla. El QR no debe usarse como acceso público al expediente.'],
  ['¿Puedo agregar más de una mascota?', 'La plataforma está pensada para organizar perfiles de mascotas. La disponibilidad y límites dependen de la versión del servicio.'],
  ['¿La app ya está disponible?', 'La publicación de la aplicación y sus planes se anunciarán cuando estén confirmados. Por ahora, esta página presenta el servicio.'],
];

/* =============================================================
   SUBCOMPONENTES
   ============================================================= */
function Brand({ footer = false }) {
  if (footer) {
    return (
      <img
        className="brand-lockup"
        src="/assets/img/petmate-wordmark.jpg"
        alt="PetMate, carnet digital de salud para tu mascota"
        loading="lazy"
        decoding="async"
      />
    );
  }
  return (
    <a href="#inicio" className="brand" aria-label="PetMate, ir al inicio">
      <img src="/assets/img/petmate-mark.jpg" alt="" className="brand__mark" width="44" height="44" />
      <span>PetMate</span>
    </a>
  );
}

function Kicker({ index, label }) {
  return (
    <div className="section-kicker">
      <span>{String(index).padStart(2, '0')}</span>
      <span>{label}</span>
    </div>
  );
}

function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  return <Tag className={`reveal ${className}`.trim()} {...rest}>{children}</Tag>;
}

function Ornament({ variant = 'dot' }) {
  const variants = {
    dot: '•',
    cross: '✕',
    star: '✦',
    paw: '🐾',
    arrow: '→',
  };
  return <span className={`ornament ornament--${variant}`} aria-hidden="true">{variants[variant] || '•'}</span>;
}

/* =============================================================
   APP
   ============================================================= */
export default function App() {
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('js-ready');
    const stop3D = initPetMate3D();
    const onScroll = () => {
      document.getElementById('nav')?.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const cleanups = [];
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
      cleanups.push(() => revealObserver.disconnect());

      const sections = document.querySelectorAll('main section[id]');
      const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
        });
      }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
      sections.forEach((s) => activeObserver.observe(s));
      cleanups.push(() => activeObserver.disconnect());
    } else {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      cleanups.forEach((fn) => fn());
      stop3D();
      document.body.classList.remove('js-ready');
    };
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      const card = e.target.closest?.('.feature-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell" ref={cursorRef}>
      <a className="skip-link" href="#main">Saltar al contenido</a>

      <header className="nav" id="nav">
        <div className="container nav__inner">
          <Brand />
          <nav className="nav__links" aria-label="Navegación principal">
            {navItems.map(([label, href]) => (
              <a href={href} key={href} aria-current={activeSection === href ? 'true' : undefined}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav__actions">
            <a className="btn btn--nav magnetic" href="#vista">Ver una ficha</a>
            <details
              className="mobile-nav"
              open={menuOpen}
              onToggle={(e) => setMenuOpen(e.currentTarget.open)}
            >
              <summary
                className={`nav__burger ${menuOpen ? 'is-open' : ''}`}
                aria-label="Abrir o cerrar el menú"
              >
                <span /><span /><span />
              </summary>
              <nav className="mobile-menu" aria-label="Navegación móvil">
                {navItems.map(([label, href]) => (
                  <a href={href} key={href} onClick={closeMenu}>{label}</a>
                ))}
                <a href="#vista" className="mobile-menu__cta" onClick={closeMenu}>
                  Ver una ficha <span aria-hidden="true">↗</span>
                </a>
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main id="main">

        {/* ================= HERO ================= */}
        <section className="hero" id="inicio" data-parallax-scene>
          <div className="hero__editorial" aria-hidden="true">
            <span className="hero__numeral" data-parallax-layer="0.15">01</span>
            <span className="hero__ornament hero__ornament--top">✦</span>
            <span className="hero__ornament hero__ornament--bottom">✦</span>
          </div>

          <div className="container hero__grid">
            <Reveal className="hero__copy">
              <span className="eyebrow">
                <span className="eyebrow__dot" aria-hidden="true" />
                Carnet digital de salud para mascotas
              </span>
              <h1>Su salud, <em>bien cuidada.</em></h1>
              <p className="hero__lead">
                Vacunas, consultas y cuidados en una ficha fácil de consultar.
                PetMate te ayuda a tener su información importante a la mano.
              </p>
              <div className="hero__actions">
                <a className="btn btn--primary magnetic" href="#vista">
                  Conocer el carnet <span aria-hidden="true">↓</span>
                </a>
                <a className="text-link" href="#como-funciona">
                  Así funciona <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="hero__trust">
                <span className="trust-mark" aria-hidden="true">✓</span>
                <span>Tu información. Tus permisos. A tu ritmo.</span>
              </div>
            </Reveal>

            <Reveal
              className="hero__visual"
              data-hero-scene
              role="img"
              aria-label="Vista ilustrativa del carnet digital de PetMate"
            >
              <div className="visual-orbit visual-orbit--one" aria-hidden="true" />
              <div className="visual-orbit visual-orbit--two" aria-hidden="true" />
              <div className="visual-orbit visual-orbit--three" aria-hidden="true" />
              <img
                className="hero__logo"
                data-tilt
                data-tilt-strength="10"
                src="/assets/img/petmate-mark.jpg"
                alt=""
                width="350"
                height="350"
                loading="eager"
                fetchPriority="high"
              />
              <div className="hero__visual-caption">
                <span className="caption-line" aria-hidden="true" />
                Una forma más clara de cuidar
              </div>
              <span className="hero__sticker hero__sticker--1 tilt" data-tilt data-tilt-strength="16" aria-hidden="true">+5 datos</span>
              <span className="hero__sticker hero__sticker--2 tilt" data-tilt data-tilt-strength="16" aria-hidden="true">QR ✓</span>
            </Reveal>
          </div>

          <div className="hero__bottom">
            <div className="hero__marquee">
              <div className="hero__marquee-track">
                {Array(4).fill(0).map((_, i) => (
                  <span key={i}>
                    Organiza <Ornament variant="star" /> Consulta <Ornament variant="dot" />
                    Comparte con autorización <Ornament variant="star" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= INTRO + BENEFICIOS ================= */}
        <section className="section intro" id="conoce">
          <div className="container intro__grid">
            <Reveal className="intro__aside">
              <Kicker index={1} label="Menos papeles, más claridad" />
              <div className="intro__numeral" aria-hidden="true">01</div>
              <Ornament variant="paw" />
            </Reveal>
            <Reveal className="intro__copy">
              <h2>Cuando necesitas un dato, que esté donde esperas.</h2>
              <p>
                PetMate reúne la información de salud de tu mascota para que no tengas
                que buscar entre mensajes, notas y documentos sueltos.
              </p>
            </Reveal>
          </div>

          <div className="container benefit-grid">
            <Reveal as="article" className="benefit-card tilt" data-tilt data-tilt-strength="6">
              <div className="benefit-card__head">
                <span className="benefit-card__number">01</span>
                <Ornament variant="cross" />
              </div>
              <h3>Todo en una ficha</h3>
              <p>Vacunas, consultas y cuidados organizados por mascota.</p>
            </Reveal>
            <Reveal as="article" className="benefit-card tilt" data-tilt data-tilt-strength="6">
              <div className="benefit-card__head">
                <span className="benefit-card__number">02</span>
                <Ornament variant="cross" />
              </div>
              <h3>Fácil de revisar</h3>
              <p>Encuentra la información antes o durante una visita veterinaria.</p>
            </Reveal>
            <Reveal as="article" className="benefit-card tilt" data-tilt data-tilt-strength="6">
              <div className="benefit-card__head">
                <span className="benefit-card__number">03</span>
                <Ornament variant="cross" />
              </div>
              <h3>Compartir con control</h3>
              <p>Usa el QR para compartir solo la información que autorizas.</p>
            </Reveal>
          </div>
        </section>

        {/* ================= SHOWCASE ================= */}
        <section className="section section--soft showcase-section" id="vista">
          <div className="container showcase">
            <Reveal className="showcase__copy">
              <Kicker index={2} label="PetMate por dentro" />
              <h2>Conócela desde tu celular.</h2>
              <p>
                Explora las pantallas reales de PetMate: encuentra a tus mascotas,
                revisa su carnet y comparte información con autorización.
              </p>
              <div className="showcase__callout">
                <Ornament variant="arrow" />
                <span>Elige una pantalla para verla.</span>
              </div>
              <div className="showcase__specs">
                <div><strong>5</strong><span>pantallas reales</span></div>
                <div><strong>iOS</strong><span>y Android</span></div>
                <div><strong>QR</strong><span>con permiso</span></div>
              </div>
            </Reveal>

            <Reveal className="showcase__demo tilt" data-tilt data-tilt-strength="5">
              <div className="demo-topline">
                <span className="demo-label">● PETMATE APP</span>
                <span className="demo-dots" aria-hidden="true"><i /><i /><i /></span>
              </div>
              <div className="app-gallery" role="group" aria-label="Pantallas de la aplicación PetMate">
                <div className="app-gallery__options">
                  {appScreens.map((screen, index) => (
                    <React.Fragment key={screen.id}>
                      <input
                        className="view-radio"
                        type="radio"
                        name="petmate-screen"
                        id={`screen-${screen.id}`}
                        defaultChecked={index === 0}
                      />
                      <label htmlFor={`screen-${screen.id}`}>{screen.label}</label>
                    </React.Fragment>
                  ))}
                </div>
                <div className="app-gallery__stage" aria-live="polite">
                  {appScreens.map((screen) => (
                    <figure className={`app-shot app-shot--${screen.id}`} key={screen.id}>
                      <img
                        src={`/assets/img/app/${screen.src}`}
                        alt={screen.alt}
                        loading="lazy"
                        decoding="async"
                      />
                      <figcaption>{screen.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="section features" id="funcionalidades">
          <div className="container">
            <Reveal className="section-heading section-heading--split">
              <Kicker index={3} label="Lo que puedes organizar" />
              <div>
                <h2>Lo esencial para acompañar su cuidado.</h2>
                <p>
                  Una ficha pensada para el día a día y para esos momentos en que
                  conviene tener todo claro.
                </p>
              </div>
            </Reveal>

            <div className="feature-bento">
              {features.map(([icon, title, text], index) => (
                <Reveal
                  as="article"
                  className={`feature-card feature-card--${index + 1}`}
                  data-tilt
                  data-tilt-strength="7"
                  data-spotlight
                  key={title}
                >
                  <span className="feature-card__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className={`feature-card__icon feature-card__icon--${index + 1}`} aria-hidden="true">{icon}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className="feature-card__arrow" aria-hidden="true">→</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="section how" id="como-funciona">
          <div className="container">
            <Reveal className="how__heading how__heading--center">
              <Kicker index={4} label="Cómo funciona" />
              <h2>Empieza con lo que ya sabes.</h2>
              <p>
                No necesitas completar todo de una vez. Agrega la información
                conforme la tengas disponible.
              </p>
            </Reveal>

            <ol className="timeline">
              <Reveal as="li" className="timeline__step">
                <div className="timeline__marker">
                  <span>1</span>
                  <Ornament variant="dot" />
                </div>
                <div className="timeline__content">
                  <h3>Crea su perfil</h3>
                  <p>Agrega su nombre y datos básicos.</p>
                </div>
              </Reveal>
              <Reveal as="li" className="timeline__step">
                <div className="timeline__marker">
                  <span>2</span>
                  <Ornament variant="dot" />
                </div>
                <div className="timeline__content">
                  <h3>Guarda sus registros</h3>
                  <p>Organiza vacunas, consultas y cuidados.</p>
                </div>
              </Reveal>
              <Reveal as="li" className="timeline__step">
                <div className="timeline__marker">
                  <span>3</span>
                  <Ornament variant="dot" />
                </div>
                <div className="timeline__content">
                  <h3>Consulta o comparte</h3>
                  <p>Ten el carnet listo cuando lo necesites.</p>
                </div>
              </Reveal>
            </ol>
          </div>
        </section>

        {/* ================= BUSINESS ================= */}
        <section className="section business" id="negocios">
          <Reveal className="container business__inner tilt" data-tilt data-tilt-strength="4">
            <div className="business__mark">
              <img src="/assets/img/petmate-mark.jpg" alt="" loading="lazy" />
            </div>
            <div className="business__copy">
              <span className="eyebrow eyebrow--light">Para profesionales veterinarios</span>
              <h2>Una visita más clara para todos.</h2>
              <p>
                Con el permiso del tutor, la información relevante de la mascota
                puede acompañar su atención.
              </p>
              <a href="#vista" className="business__link">
                Ver cómo se comparte <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="business__number" aria-hidden="true">
              <span className="business__number-top">PETMATE</span>
              <span className="business__number-big">para clínicas</span>
            </div>
          </Reveal>
        </section>

        {/* ================= FAQ ================= */}
        <section className="section faq" id="faq">
          <div className="container faq__grid">
            <Reveal className="faq__heading">
              <Kicker index={5} label="Preguntas frecuentes" />
              <h2>Respuestas claras.</h2>
              <p>Lo que conviene saber antes de empezar.</p>
              <div className="faq__aside" aria-hidden="true">
                <Ornament variant="star" />
                <span>05</span>
                <Ornament variant="star" />
              </div>
            </Reveal>

            <Reveal className="accordion">
              {faqs.map(([q, a], i) => (
                <details key={q} name="petmate-faq" open={i === 0}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ================= CTA FINAL ================= */}
        <section className="closing" id="descargar">
          <Reveal className="container closing__inner">
            <div className="closing__art">
              <img
                src="/assets/img/petmate-wordmark.jpg"
                alt="PetMate, carnet digital de salud para tu mascota"
                loading="lazy"
              />
              <div className="closing__seal" aria-hidden="true">
                <span>✦</span>
                <span>CUIDADO</span>
                <span>✦</span>
              </div>
            </div>
            <div className="closing__copy">
              <span className="eyebrow eyebrow--light">Cuidado con más claridad</span>
              <h2>Su historia de salud también merece un lugar.</h2>
              <div className="closing__actions">
                  <a className="btn btn--light magnetic" href="#funcionalidades">
                  Explorar funciones <span aria-hidden="true">↑</span>
                </a>
                <a className="text-link text-link--light" href="#vista">
                  Ver una ficha <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </Reveal>
        </section>

      </main>

      <footer className="footer">
        <div className="footer__watermark" aria-hidden="true">PETMATE</div>
        <div className="container footer__main">
          <div>
            <Brand footer />
            <p className="footer__desc">
              Un lugar para organizar el cuidado de quienes siempre están contigo.
            </p>
            <div className="footer__badges" aria-hidden="true">
              <span>Salud</span><span>·</span><span>Claridad</span><span>·</span><span>Permiso</span>
            </div>
          </div>
          <div className="footer__links">
            <div>
              <h3>Explorar</h3>
              <a href="#funcionalidades">Funciones</a>
              <a href="#como-funciona">Cómo funciona</a>
              <a href="ayuda.html">Centro de ayuda</a>
            </div>
            <div>
              <h3>Legal</h3>
              <a href="legal/aviso-privacidad-simplificado.html">Privacidad</a>
              <a href="legal/terminos-condiciones.html">Términos y condiciones</a>
              <a href="legal/politica-cookies.html">Cookies</a>
              <a href="legal/seguridad.html">Seguridad de la información</a>
            </div>
          </div>
        </div>
        <div className="container footer__bottom">
          <span>© {new Date().getFullYear()} PetMate</span>
          <span>Carnet digital de salud para tu mascota</span>
        </div>
      </footer>
    </div>
  );
}
