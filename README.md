# Quotes Scrapper

Скрапер открывает [Quotes to Scrape / scroll](https://quotes.toscrape.com/scroll) в Chromium через Playwright, прокручивает страницу и сохраняет цитаты в `out/result.json`. JSON содержит текст, автора и теги каждой цитаты.

## Локальная разработка

Нужны Docker Engine и GNU Make. На Windows установите Git for Windows и GNU Make, добавьте каталог с make.exe в PATH и откройте новый терминал. Makefile запускает Bash из стандартного каталога Git for Windows, а команды make можно вызывать из PowerShell. Docker Desktop должен быть запущен в режиме Linux containers.

Запуск и проверка:

```sh
make run
make ci
```

Редактируйте `src/scrape.js`; браузер и npm-зависимости находятся в отдельных слоях Docker и не пересобираются при изменении исходного кода. `out/` подключается к контейнеру как каталог и не попадает в Git.

## Продакшн образ

```sh
make build
```

Образ `quotes-scrapper:latest` собирается из `node:22-bookworm`. Dockerfile самостоятельно устанавливает Chromium и системные библиотеки через Playwright. Для удаления образа и результата выполните `make clean`. Слои сборки остаются в кэше Docker, поэтому следующая сборка использует уже загруженный браузер.
