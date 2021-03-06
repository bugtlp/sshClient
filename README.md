## Описание
SSH клиент на TypeScript (node.js). Минимальная версия node.js, необходимая для работы - 8.10. Приложение реализовано в рамках тестового задания для компании RVision.

В проекте настроено тестовое окружение (jest).

## Установка и запуск
Перед запуском необходимо выполнить установку всех зависимостей:

`npm i`

После установки необходимо выполнить сборку:

`npm run build`

В результате будет создана директория dist с скомпилированными в JavaScript исходниками приложения.

Для запуска необходимо выполнить команду:

`npm start [login]:[password]@[host]:[port]`

где:
- login: логин пользователя для подключения к SSH серверу
- password: пароль
- host: домен или IP адрес сервера
- port: порт. По умолчанию 22

SSH клиент предоставляет встроенную команду `get [путь к файлу на удаленном сервер]`, которая скачивает файл с удаленнного сервера в локальную директорию
