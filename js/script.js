'use strict';

const endpoint = 'https://script.google.com/macros/s/AKfycbyBvmHTpcOJF1e-l24aTBJGwqelAKpd4Nw11w8qwpcZpGymYuEKiQqDt6Km712ODmnT/exec';
const form = document.querySelector('#lead-form');
if (form) {
  const params = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign'].forEach((name) => {
    form.elements[name].value = params.get(name) || 'not_set';
  });
  form.elements.request_id.value = crypto.randomUUID();
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.querySelector('#form-status');
    if (!form.reportValidity()) return;
    if (endpoint.startsWith('PASTE_')) {
      status.textContent = 'Обработчик заявок публикуется. Повторите отправку через минуту.';
      return;
    }
    try {
      await fetch(endpoint, { method: 'POST', body: new FormData(form), mode: 'no-cors' });
      if (typeof gtag === 'function') gtag('event', 'generate_lead', { lead_source: 'google_sheets_form' });
      status.textContent = 'Готово! Заявка отправлена в учебную таблицу.';
      form.reset();
      form.elements.request_id.value = crypto.randomUUID();
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
