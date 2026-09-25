'use strict';

// Четыре дополнительные метрики из практики темы 6.
document.querySelectorAll('nav a').forEach((link) => {
  link.addEventListener('click', () => {
    if (typeof gtag === 'function') {
      gtag('event', 'nav_click', {
        link_text: link.textContent.trim(),
        from_page: document.title
      });
    }
  });
});

const params = new URLSearchParams(window.location.search);
const utmSource = params.get('utm_source');
if (utmSource && typeof gtag === 'function') {
  gtag('event', 'utm_visit', {
    utm_source: utmSource,
    utm_medium: params.get('utm_medium') || 'not_set',
    utm_campaign: params.get('utm_campaign') || 'not_set',
    landing_page: window.location.pathname
  });
}

let readCounted = false;
setTimeout(() => {
  if (readCounted || document.hidden || typeof gtag !== 'function') return;
  readCounted = true;
  gtag('event', 'read_30s', {
    page_path: window.location.pathname
  });
}, 30000);

const leadForm = document.querySelector('#lead-form');
if (leadForm) {
  leadForm.addEventListener('invalid', (event) => {
    if (typeof gtag === 'function') {
      gtag('event', 'form_error', {
        field_name: event.target.name || 'unknown',
        form_id: 'lead-form'
      });
    }
  }, true);
}
