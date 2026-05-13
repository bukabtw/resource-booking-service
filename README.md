# Сервис бронирования ресурсов

![Vue.js](https://img.shields.io/badge/vue-3.5-%234FC08D.svg?style=for-the-badge&logo=vuedotjs&logoColor=white) ![Vuetify](https://img.shields.io/badge/vuetify-3.5-%231867C0.svg?style=for-the-badge&logo=vuetify&logoColor=white) ![Vuex](https://img.shields.io/badge/vuex-4.1-%2335495e.svg?style=for-the-badge&logo=vue.js&logoColor=white) ![Vue Router](https://img.shields.io/badge/vue_router-4.6-%2342b883.svg?style=for-the-badge&logo=vue.js&logoColor=white) ![vue-i18n](https://img.shields.io/badge/i18n-9.0-%234FC08D.svg?style=for-the-badge&logo=vue.js&logoColor=white)

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
- Сохранение данных в localStorage
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
| MDI Font | - | Material Design иконки |

## Установка и запуск

### Предварительные требования
- Node.js 16+
- npm или yarn

### 1. Клонирование
```bash
git clone https://github.com/bukabtw/resource-booking-service.git
cd resource-booking-service
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Запуск в режиме разработки
```bash
npm run dev
```
Приложение будет доступно: http://localhost:5173

### 4. Сборка для продакшена
```bash
npm run build
npm run preview
```

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
├── README.md
└── src/
    ├── main.js                 # Точка входа (Vuetify + Router + Vuex + i18n)
    ├── App.vue                 # Корневой компонент с навигацией
    ├── i18n.js                 # Конфигурация i18n (RU/EN)
    ├── router/
    │   └── index.js            # Маршруты (7 страниц + 404)
    ├── store/
    │   └── index.js            # Vuex store (resources, bookings, уведомления)
    ├── locales/
    │   ├── ru.json             # Русские переводы
    │   └── en.json             # Английские переводы
    ├── components/
    │   ├── BasePage.vue        # Обёртка страницы (слоты)
    │   ├── BaseCard.vue        # Карточка с заголовком и действиями (именованные слоты)
    │   ├── BaseList.vue        # Список со scoped слотами
    │   ├── BaseStatCard.vue    # Карточка статистики (scoped слоты)
    │   └── ConfirmDialog.vue   # Диалог подтверждения (именованные слоты)
    └── views/
        ├── CalendarView.vue    # Календарь (главная)
        ├── BookingsView.vue    # Список бронирований
        ├── BookingFormView.vue # Форма бронирования
        ├── ResourcesView.vue   # Управление ресурсами
        ├── StatsView.vue       # Статистика
        ├── AboutView.vue       # О проекте
        └── NotFoundView.vue    # 404
```

## Маршрутизация

| Путь | Страница | Описание |
|------|----------|----------|
| `/` | Календарь | Недельная сетка бронирований |
| `/bookings` | Бронирования | Список с фильтрами |
| `/bookings/new` | Новое бронирование | Форма создания |
| `/resources` | Ресурсы | Управление (CRUD) |
| `/stats` | Статистика | Аналитика использования |
| `/about` | О проекте | Информация и контакты |
| `*` | 404 | Страница не найдена |

## Управление состоянием (Vuex)

**State**
- `resources` - массив ресурсов
- `bookings` - массив бронирований
- `notification` - уведомления

**Getters**
- `allResources`, `activeResources`, `resourcesByType`
- `allBookings`, `bookingsByDate`, `bookingsByResource`
- `pendingBookings`, `confirmedBookings`
- `bookingsByStatus`, `popularResources`

**Mutations/Actions**
- `ADD_RESOURCE`, `UPDATE_RESOURCE`, `DELETE_RESOURCE`
- `ADD_BOOKING` (с проверкой конфликтов), `UPDATE_BOOKING_STATUS`, `DELETE_BOOKING`
- `LOAD_FROM_STORAGE`, `SAVE_TO_STORAGE`

## Мультиязычность

Поддерживаемые языки: русский, английский.

Переключатель в шапке приложения (RU/EN). Язык сохраняется в localStorage. При первом входе определяется по языку браузера.

Файлы переводов: `src/locales/ru.json`, `src/locales/en.json`

## Контакты

- GitHub: [bukabtw](https://github.com/bukabtw)
- Email: bukarev.k11@gmail.com
- Telegram: @bukabtw

*Выполнено в 2026 году в рамках производственной практики.*