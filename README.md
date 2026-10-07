# GA4 Analytics Lab

Шаблон для ОП.03 «Информационные технологии», темы 5 и последующих занятий по веб-аналитике.

## Начало работы

1. Создайте собственную копию шаблона через **Use this template → Create a new repository**.
2. В VS Code выберите **Clone Repository**, затем откройте папку проекта.
3. Для локального просмотра используйте Live Server в VS Code.
4. Публикация выполняется через GitHub Pages: после Push в ветку `main` workflow автоматически размещает статический сайт.
5. Откройте постоянный URL: `https://lastuser55556.github.io/ga4-analytics-lab/`.

## Структура

```text
index.html
about.html
contacts.html
guide.html
css/style.css
js/script.js
guide.js
```

Это статический HTML/CSS/JavaScript-проект: npm и сборка не нужны. Навигация и контактная форма работают на всех страницах.

## Установка аналитики

В исходном шаблоне Google Tag отсутствует — это часть практической работы.
Получите код своего учебного веб-потока в GA4 и вставьте один экземпляр сразу после открывающего `<head>` в каждый HTML-файл.
После Commit и Push дождитесь завершения GitHub Actions, затем посетите Home, About и Contacts и проверьте реальные события в Realtime.

Не меняйте рабочий поток ByteCamp. Не публикуйте секреты, пароли или личные данные. Measurement ID не является секретом; используйте только ID своего учебного потока.

## UTM-проверка

```text
https://lastuser55556.github.io/ga4-analytics-lab/?utm_source=telegram&utm_medium=social&utm_campaign=ga4_lab
```

Откройте ссылку в новой приватной сессии. Не принимайте новую вкладку за новую сессию GA4.
