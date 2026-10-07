'use strict';

const endpoint = 'https://script.google.com/macros/s/AKfycbxRPX6BJilO0Lg9sj2-cgk3pk06KFhArTpz8MaKzsxvKsbcd3ZPYbdBN-tDJvBpHoQQ/exec';
const form = document.querySelector('#lead-form');

if (form) {
  const status = document.querySelector('#form-status');
  const params = new URLSearchParams(window.location.search);
  const defaults = { utm_source: 'direct', utm_medium: 'none', utm_campaign: 'not_set' };

  for (const [name, fallback] of Object.entries(defaults)) {
    form.elements[name].value = params.get(name)?.trim() || fallback;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const requestId = form.elements.request_id;
    if (!requestId.value) requestId.value = 'REQ-' + crypto.randomUUID().toUpperCase();

    status.textContent = 'Отправляем заявку…';
    try {
      await fetch(endpoint, { method: 'POST', body: new FormData(form), mode: 'no-cors' });
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', { lead_source: 'contact_form' });
      }
      status.textContent = 'Заявка отправлена. Номер: ' + requestId.value;
      form.reset();
      requestId.value = '';
      for (const [name, fallback] of Object.entries(defaults)) {
        form.elements[name].value = params.get(name)?.trim() || fallback;
      }
    } catch (error) {
      status.textContent = 'Не удалось отправить заявку. Проверьте подключение к сети.';
    }
  });
}

const programButton = document.querySelector('#program-cta');
if (programButton) {
  programButton.addEventListener('click', () => {
    const preview = document.querySelector('#program-preview');
    preview.hidden = !preview.hidden;
    if (typeof gtag === 'function') gtag('event', 'program_open', { page_section: 'home' });
  });
}

document.querySelectorAll('a.button').forEach((button) => {
  button.addEventListener('click', () => {
    if (typeof gtag === 'function') {
      gtag('event', 'cta_click', {
        button_name: button.textContent.trim(),
        page_section: 'main'
      });
    }
  });
});
