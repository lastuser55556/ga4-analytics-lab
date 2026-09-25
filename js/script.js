'use strict';
// На следующих занятиях здесь можно добавить обработчики учебных событий.
// Google Tag устанавливается отдельно в head каждой HTML-страницы.
const form = document.querySelector('#contact-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (typeof gtag === 'function') {
      gtag('event', 'generate_lead', {
        lead_source: 'contact_form'
      });
    }
    document.querySelector('#form-status').textContent =
      'Готово! Учебная форма проверена. Данные никуда не отправлены.';
    form.reset();
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
