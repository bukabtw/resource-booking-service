# Сервис бронирования ресурсов

![Vue.js](https://img.shields.io/badge/vue-3.5-%234FC08D.svg?style=for-the-badge&logo=vuedotjs&logoColor=white) ![Vuetify](https://img.shields.io/badge/vuetify-3.5-%231867C0.svg?style=for-the-badge&logo=vuetify&logoColor=white) ![FastAPI](https://img.shields.io/badge/fastapi-0.115-%23009688.svg?style=for-the-badge&logo=fastapi&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Веб-приложение для организации и управления бронированием общих ресурсов организации. Позволяет бронировать конференц-залы, сотрудников (фотографы, видеографы) и оборудование с автоматической проверкой конфликтов времени.

## Возможности

### Календарь бронирования
- Недельная сетка: ресурсы по строкам, дни по столбцам
- Цветовые метки статусов: зелёный (подтверждено), оранжевый (ожидает)
- Детали бронирования в один клик
- Навигация по неделям (вперёд/назад/сегодня)
- Быстрый переход к созданию бронирования

### Управление бронированиями
- Создание заявок с выбором ресурса, даты и времени
- Автоматическая проверка конфликтов (пересечение времени)
- Подтверждение / отклонение / удаление бронирований
- Фильтрация по статусу, ресурсу и дате
- Отображение существующих броней на выбранную дату

### Управление ресурсами
- CRUD операции: добавление, редактирование, удаление
- Типы ресурсов: помещения, сотрудники, оборудование
- Назначение ответственных лиц
- Фильтрация по типу ресурса
- Защита от удаления ресурсов с активными бронированиями

### Статистика
- Карточки с общей статистикой (всего ресурсов, активно, броней, ожидают)
- Процент подтверждённых бронирований (прогресс-бар)
- Топ популярных ресурсов
- Распределение по типам ресурсов
- Бронирования по дням недели

### Дополнительно
- **Мультиязычность (i18n)** - русский и английский языки
- Демо-данные при первом запуске
- Адаптивный дизайн (mobile-friendly)
- Анимации переходов между страницами
- Уведомления о всех действиях (v-snackbar)

## Стек технологий

| Технология | Версия | Назначение |
|-----------|--------|------------|
| Vue 3 | 3.5 | Прогрессивный JavaScript-фреймворк |
| Vite | 8.0 | Сборка и dev-сервер |
| Vuetify 3 | 3.5 | Material Design компоненты |
| Vue Router 4 | 4.6 | Маршрутизация SPA |
| Vuex 4 | 4.1 | Управление состоянием |
| vue-i18n 9 | 9.0 | Интернационализация |
| FastAPI | 0.115 | Backend REST API |
| SQLAlchemy | 2.0 | ORM |
| Pydantic | 2.10 | Валидация данных |
| SQLite | - | База данных (по умолчанию) |
| Docker | - | Контейнеризация |

## Запуск через Docker

### Предварительные требования
- Docker + Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:8000
- API документация (Swagger): http://localhost:8000/docs

## Локальный запуск (разработка)

### Предварительные требования
- Node.js 16+
- Python 3.11+

### 1. Клонирование
```bash
git clone https://github.com/bukabtw/resource-booking-service.git
cd resource-booking-service
```

### 2. Запуск backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Linux/macOS
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Запуск frontend
```bash
npm install
npm run dev
```

Приложение будет доступно: http://localhost:5173

Vite dev-сервер проксирует запросы `/api` на `http://localhost:8000`.

### 4. Сборка для продакшена
```bash
npm run build
npm run preview
```

## API эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/health` | Проверка работоспособности |
| GET | `/api/resources` | Список ресурсов |
| POST | `/api/resources` | Создание ресурса |
| GET | `/api/resources/{id}` | Получение ресурса |
| PUT | `/api/resources/{id}` | Обновление ресурса |
| DELETE | `/api/resources/{id}` | Удаление ресурса |
| GET | `/api/bookings` | Список бронирований (фильтры: `resource_id`, `date`, `status`) |
| POST | `/api/bookings` | Создание бронирования (с проверкой конфликтов) |
| GET | `/api/bookings/{id}` | Получение бронирования |
| PUT | `/api/bookings/{id}` | Обновление бронирования |
| PATCH | `/api/bookings/{id}/status` | Смена статуса |
| DELETE | `/api/bookings/{id}` | Удаление бронирования |
| GET | `/api/stats` | Агрегированная статистика |

## Демо-данные

При первом запуске приложение автоматически загружает демо-набор:

**8 ресурсов:**
- 3 конференц-зала (А, B, Переговорная С)
- 2 сотрудника (фотограф, видеограф)
- 3 единицы оборудования (проектор, ноутбук, флипчарт)

**4 бронирования:**
- 2 подтверждённых (конференц-зал А)
- 2 ожидающих (фотограф, проектор)

## Структура проекта

```
resource-booking-service/
├── index.html
├── package.json
├── vite.config.js
├── docker-compose.yml
├── README.md
├── src/                        # Frontend (Vue 3)
│   ├── main.js                 # Точка входа (Vuetify + Router + Vuex + i18n)
│   ├── App.vue                 # Корневой компонент с навигацией
│   ├── i18n.js                 # Конфигурация i18n (RU/EN)
│   ├── router/
│   │   └── index.js            # Маршруты (7 страниц + 404)
│   ├── store/
│   │   └── index.js            # Vuex store (API-вызовы, resources, bookings)
│   ├── locales/
│   │   ├── ru.json             # Русские переводы
│   │   └── en.json             # Английские переводы
│   ├── components/
│   │   ├── BasePage.vue        # Обёртка страницы (слоты)
│   │   ├── BaseCard.vue        # Карточка с заголовком и действиями
│   │   ├── BaseList.vue        # Список со scoped слотами
│   │   ├── BaseStatCard.vue    # Карточка статистики
│   │   └── ConfirmDialog.vue   # Диалог подтверждения
│   └── views/
│       ├── CalendarView.vue    # Календарь (главная)
│       ├── BookingsView.vue    # Список бронирований
│       ├── BookingFormView.vue # Форма бронирования
│       ├── ResourcesView.vue   # Управление ресурсами
│       ├── StatsView.vue       # Статистика
│       ├── AboutView.vue       # О проекте
│       └── NotFoundView.vue    # 404
├── backend/                    # Backend (FastAPI)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py             # Точка входа FastAPI, CORS, роутеры
│       ├── config.py           # Настройки (env)
│       ├── database.py         # SQLAlchemy engine/session
│       ├── models.py           # ORM-модели Resource, Booking
│       ├── schemas.py          # Pydantic-схемы (camelCase API)
│       ├── seed.py             # Демо-данные
│       └── routers/
│           ├── resources.py    # CRUD ресурсов
│           ├── bookings.py     # CRUD бронирований + конфликты
│           └── stats.py        # Агрегированная статистика
└── frontend/                   # Docker config для frontend
    ├── Dockerfile              # Многоэтапная сборка (Node → nginx)
    └── nginx.conf              # Прокси /api → backend
```

## Маршрутизация (Frontend)

| Путь | Страница | Описание |
|------|----------|----------|
| `/` | Календарь | Недельная сетка бронирований |
| `/bookings` | Бронирования | Список с фильтрами |
| `/bookings/new` | Новое бронирование | Форма создания |
| `/resources` | Ресурсы | Управление (CRUD) |
| `/stats` | Статистика | Аналитика использования |
| `/about` | О проекте | Информация и контакты |
| `*` | 404 | Страница не найдена |

## Мультиязычность

Поддерживаемые языки: русский, английский.

Переключатель в шапке приложения (RU/EN). Язык сохраняется в localStorage. При первом входе определяется по языку браузера.

Файлы переводов: `src/locales/ru.json`, `src/locales/en.json`

## Контакты

- GitHub: [bukabtw](https://github.com/bukabtw)
- Email: bukarev.k11@gmail.com
- Telegram: @bukabtw

*Выполнено в 2026 году в рамках производственной практики.*