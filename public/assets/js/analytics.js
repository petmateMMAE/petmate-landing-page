// Analytics is inactive until the visitor has explicitly opted in.
const id = window.PETMATE_GA_ID;
const consentKey = 'petmate_analytics_consent';
let enabled = false;
let initialized = false;

function activate() {
  if (!id || initialized) return;
  initialized = true;
  enabled = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
  window.gtag('config', id, { send_page_view: false });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.append(script);
  window.gtag('event', 'page_view', { page_location: location.origin + location.pathname, page_title: document.title });
}

window.petmateAnalytics = {
  setConsent(granted) {
    try { localStorage.setItem(consentKey, granted ? 'granted' : 'denied'); } catch { /* Storage may be unavailable. */ }
    if (granted) activate();
    else {
      enabled = false;
      if (initialized) window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
  },
};

try { if (localStorage.getItem(consentKey) === 'granted') activate(); } catch { /* No consent. */ }

document.addEventListener('click', (event) => {
  if (!enabled) return;
  const link = event.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href') || '';
  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    window.gtag('event', 'contact', { contact_method: href.startsWith('mailto:') ? 'email' : 'phone' });
  } else if (href.startsWith('https://play.google.com/store/apps/details?id=mx.petmate.app')) {
    window.gtag('event', 'app_store_click', { store: 'google_play' });
  }
});
