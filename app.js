const STORAGE_KEY = "travelops-crm-prototype-v1";
const AIRPORT_API_URL = apiUrl("/api/aerovlad/schedule");
const TRANSPORT_API_URL = apiUrl("/api/transport/search");
const MAX_REQUESTS_API_URL = apiUrl("/api/max/requests");
const MAX_STATUS_API_URL = apiUrl("/api/max/status");
const MAX_SEND_API_URL = apiUrl("/api/max/send");
const TRANSPORT_VISIBLE_LIMIT = 10;
const MAX_IMPORT_INTERVAL_MS = 8000;
const DEBUG_MAX_SYNC = new URLSearchParams(window.location.search).has("debugMax");

function apiUrl(pathname) {
  return `${window.location.protocol}//${window.location.host}${pathname}`;
}

const STATUS = [
  { id: "new", label: "Новая", tone: "navy" },
  { id: "work", label: "В работе", tone: "teal" },
  { id: "offer", label: "Предложение", tone: "violet" },
  { id: "wait", label: "Ждем клиента", tone: "amber" },
  { id: "booked", label: "Бронь", tone: "teal" },
  { id: "closed", label: "Закрыта", tone: "rose" },
];

const MANAGERS = ["Алина", "Михаил", "Екатерина", "Без ответственного"];
const ACCESS_SECTIONS = [
  { id: "dashboard", label: "Дашборд" },
  { id: "requests", label: "Заявки" },
  { id: "clients", label: "Клиенты" },
  { id: "program", label: "Программы" },
  { id: "finance", label: "Финансы" },
  { id: "transport", label: "Логистика" },
  { id: "messages", label: "Сообщения" },
  { id: "automation", label: "Автоматизации" },
  { id: "settings", label: "Настройки" },
  { id: "journal", label: "Журнал" },
];
const ALL_APP_VIEWS = ["dashboard", "requests", "clients", "program", "finance", "arrivals", "departures", "transport", "cars", "messages", "automation", "settings", "journal"];
const VIEW_ACCESS_ALIASES = {
  arrivals: "transport",
  departures: "transport",
  cars: "transport",
};

const DEFAULT_ACCESS = {
  owner: {
    label: "Владелец",
    members: "Никита",
    locked: true,
    views: ACCESS_SECTIONS.map((section) => section.id),
  },
  manager: {
    label: "Менеджер",
    members: "Алина, Екатерина",
    views: ["dashboard", "requests", "clients", "program", "finance", "messages", "journal"],
  },
  logistics: {
    label: "Логист",
    members: "Михаил",
    views: ["dashboard", "requests", "clients", "transport", "messages", "journal"],
  },
};
const THEME_PRESETS = [
  {
    id: "apple",
    label: "Apple",
    hint: "спокойный синий, мало шума",
    colors: {
      accent: "#0071e3",
      primary: "#0066cc",
      success: "#007a6f",
      warning: "#a86600",
      danger: "#bf3b4b",
      info: "#5e5ce6",
    },
  },
  {
    id: "north",
    label: "Север",
    hint: "холоднее и строже",
    colors: {
      accent: "#2563eb",
      primary: "#1e3a8a",
      success: "#0f766e",
      warning: "#b7791f",
      danger: "#be123c",
      info: "#4f46e5",
    },
  },
  {
    id: "soft",
    label: "Мягкая",
    hint: "приглушенные статусы",
    colors: {
      accent: "#3b82f6",
      primary: "#334155",
      success: "#2f855a",
      warning: "#9a6a12",
      danger: "#b91c1c",
      info: "#6d5dfc",
    },
  },
];
const DEFAULT_THEME = {
  preset: "apple",
  colors: structuredClone(THEME_PRESETS[0].colors),
};
const THEME_COLOR_FIELDS = [
  { key: "accent", label: "Акцент", hint: "ссылки, фокус, активные элементы", css: "--blue" },
  { key: "primary", label: "Кнопки", hint: "главные кнопки и меню", css: "--navy" },
  { key: "success", label: "Готово", hint: "успех, live, подтверждено", css: "--teal" },
  { key: "warning", label: "Внимание", hint: "ожидание, задержки, предоплата", css: "--amber" },
  { key: "danger", label: "Риск", hint: "ошибка, отмена, критично", css: "--rose" },
  { key: "info", label: "Инфо", hint: "предложение, подсказки, вторичный акцент", css: "--violet" },
];
const PAYMENT_STATUS = ["Не обсуждали", "Предоплата ожидается", "Предоплата внесена", "Оплачено", "Возврат / отмена"];
const DOCUMENT_STATUS = ["Не запрошены", "Запрошены", "Получены", "Проверены"];
const DOCUMENT_ITEMS = [
  { id: "passport", title: "Паспортные данные", hint: "ФИО, дата рождения, номер документа" },
  { id: "tourists", title: "Список туристов", hint: "Все участники поездки" },
  { id: "consent", title: "Согласие / договор", hint: "Форма согласия или договор" },
  { id: "tickets", title: "Билеты / стыковки", hint: "Если клиент покупает самостоятельно" },
];
const NEXT_STEPS = [
  "Связаться с клиентом",
  "Подобрать программу",
  "Согласовать даты",
  "Согласовать проживание",
  "Подготовить предложение",
  "Запросить паспортные данные",
  "Создать задачи трансфера",
  "Выставить счет",
  "Напомнить об оплате",
  "Ждать ответ клиента",
];

const COST_ITEM_FIELDS = [
  { key: "accommodation", label: "Проживание", placeholder: "Например: 160 000 ₽" },
  { key: "transport", label: "Транспорт", placeholder: "Например: 95 000 ₽" },
  { key: "guides", label: "Гиды и экскурсии", placeholder: "Например: 70 000 ₽" },
  { key: "tickets", label: "Билеты и входные", placeholder: "Например: 45 000 ₽" },
  { key: "reserve", label: "Резерв / подрядчики", placeholder: "Например: 20 000 ₽" },
];

const TRANSPORT_TABS = [
  { id: "air", label: "Самолеты", short: "Авиа", source: "Аэропорт Владивосток" },
  { id: "rail", label: "Ж/д", short: "Ж/д", source: "РЖД / Экспресс Приморья" },
  { id: "suburban", label: "Электрички", short: "Электрички", source: "Экспресс Приморья" },
  { id: "bus", label: "Автобусы", short: "Автобусы", source: "Примвокзал / e-traffic" },
  { id: "sea", label: "Морские рейсы", short: "Море", source: "pereprava.su" },
  { id: "city", label: "Городской маршрут", short: "Город", source: "OpenStreetMap / OSRM" },
];

const TRANSPORT_DEFAULTS = {
  air: { from: "", to: "" },
  rail: { from: "Владивосток", to: "Уссурийск" },
  suburban: { from: "Владивосток", to: "Аэропорт" },
  bus: { from: "Владивосток", to: "Находка" },
  sea: { from: "Морвокзал", to: "Попова" },
  city: { from: "Ж/д вокзал", to: "Морвокзал" },
};

const AUTOMATION_RULES = [
  {
    id: "max-new-request",
    title: "Принять заявку из MAX",
    trigger: "Клиент заполнил анкету в боте",
    action: "Создать заявку, клиента, контроль документов, рейс и трансфер",
    status: "бот + CRM",
    tone: "teal",
    outcome: "В CRM появляется новая карточка. Менеджер сразу видит программу, даты, туристов, рейс, документы и ближайшее действие.",
  },
  {
    id: "documents-reminder",
    title: "Запросить документы",
    trigger: "В заявке документы еще не получены",
    action: "Отправить клиенту список документов в MAX и поставить контроль",
    status: "работает",
    tone: "navy",
    outcome: "Клиент получает аккуратный запрос, а в заявке меняется статус документов. Событие попадает в журнал.",
  },
  {
    id: "payment-reminder",
    title: "Напомнить о предоплате",
    trigger: "Тур согласован, но предоплаты нет",
    action: "Отправить мягкое напоминание и обновить следующий шаг",
    status: "работает",
    tone: "amber",
    outcome: "Клиент получает короткое сообщение об оплате. Менеджеру не нужно писать текст вручную.",
  },
  {
    id: "transfer-created",
    title: "Создать трансфер",
    trigger: "В заявке появился рейс или нужна встреча",
    action: "Создать задачу в автомобилях и показать свободные машины",
    status: "логистика",
    tone: "violet",
    outcome: "Задача появляется в разделе автомобилей. Логист назначает машину, водитель и клиент получают понятные данные.",
  },
  {
    id: "flight-change",
    title: "Контроль рейса",
    trigger: "Табло показало задержку или изменение времени",
    action: "Предупредить менеджера и обновить задачу водителя",
    status: "live",
    tone: "rose",
    outcome: "Менеджер видит изменение в журнале, а трансфер не уезжает по старому времени.",
  },
];

const TRANSPORT_ROUTES = [
  {
    id: "transport-air-vvo-uus",
    mode: "air",
    title: "Владивосток - Южно-Сахалинск",
    from: "VVO",
    to: "UUS",
    date: "Сегодня",
    departure: "10:40",
    arrival: "13:15",
    duration: "1 ч 35 мин",
    operator: "Аврора",
    source: "онлайн-табло аэропорта",
    status: "отслеживается",
    tags: ["рейс", "гости", "трансфер"],
    stops: ["VVO Владивосток", "UUS Южно-Сахалинск"],
    note: "Использовать для гостей, которым нужен трансфер из аэропорта или стыковка с программой.",
    linked: "Программа: Сахалин на 5 дней",
    verified: true,
  },
  {
    id: "transport-rail-vvo-uss",
    mode: "rail",
    title: "Владивосток - Уссурийск",
    from: "Владивосток",
    to: "Уссурийск",
    date: "Сегодня",
    departure: "08:12",
    arrival: "10:06",
    duration: "1 ч 54 мин",
    operator: "РЖД",
    source: "РЖД / официальный источник",
    status: "по расписанию",
    tags: ["ж/д", "группа"],
    stops: ["Владивосток", "Угольная", "Артем", "Уссурийск"],
    note: "Подходит для небольшой группы без отдельного автобуса.",
    linked: "Можно добавить в индивидуальную программу",
    verified: false,
  },
  {
    id: "transport-suburban-airport",
    mode: "suburban",
    title: "Владивосток - аэропорт Кневичи",
    from: "Владивосток",
    to: "Аэропорт Кневичи",
    date: "Сегодня",
    departure: "09:02",
    arrival: "09:56",
    duration: "54 мин",
    operator: "Экспресс Приморья",
    source: "Экспресс Приморья",
    status: "ближайший",
    tags: ["аэропорт", "эконом"],
    stops: ["Владивосток", "Вторая Речка", "Угольная", "Аэропорт"],
    note: "Хороший вариант, если турист едет без индивидуального трансфера.",
    linked: "Связать с вылетом или прилетом",
    verified: false,
  },
  {
    id: "transport-bus-nakhodka",
    mode: "bus",
    title: "Владивосток - Находка",
    from: "Автовокзал Владивосток",
    to: "Находка",
    date: "Сегодня",
    departure: "11:30",
    arrival: "15:20",
    duration: "3 ч 50 мин",
    operator: "междугородний автобус",
    source: "Примвокзал / e-traffic",
    status: "требует проверки",
    tags: ["автобус", "дальний маршрут"],
    stops: ["Владивосток", "Артем", "Шкотово", "Фокино", "Находка"],
    note: "Перед отправкой клиенту менеджер должен проверить актуальность у перевозчика.",
    linked: "Можно создать задачу контроля",
    verified: false,
  },
  {
    id: "transport-sea-popov",
    mode: "sea",
    title: "Морвокзал - остров Попова",
    from: "Морвокзал Владивосток",
    to: "о. Попова",
    date: "Сезон",
    departure: "10:00",
    arrival: "10:55",
    duration: "55 мин",
    operator: "морской рейс",
    source: "ручная проверка админом",
    status: "проверено",
    tags: ["острова", "сезон", "ценная фишка"],
    stops: ["Владивосток", "о. Попова"],
    note: "Островные рейсы лучше хранить с отметкой, когда админ проверил расписание.",
    linked: "Программа: острова Владивостока",
    verified: true,
  },
  {
    id: "transport-sea-reineke",
    mode: "sea",
    title: "Морвокзал - остров Рейнеке",
    from: "Морвокзал Владивосток",
    to: "о. Рейнеке",
    date: "Сезон",
    departure: "12:20",
    arrival: "13:45",
    duration: "1 ч 25 мин",
    operator: "морской рейс",
    source: "ручная проверка админом",
    status: "сезонное",
    tags: ["острова", "проверить погоду"],
    stops: ["Владивосток", "о. Попова", "о. Рейнеке"],
    note: "Для таких маршрутов важно видеть сезон, погоду и дату последней проверки.",
    linked: "Добавить в программу после подтверждения",
    verified: true,
  },
  {
    id: "transport-city-hotel",
    mode: "city",
    title: "Ж/д вокзал - центр / отель",
    from: "Ж/д вокзал",
    to: "центр Владивостока",
    date: "Сегодня",
    departure: "сейчас",
    arrival: "18-25 мин",
    duration: "18-25 мин",
    operator: "городской транспорт / такси",
    source: "OpenStreetMap / OSRM",
    status: "маршрут",
    tags: ["город", "OpenStreetMap", "маршрут"],
    stops: ["Ж/д вокзал", "Центр", "отель"],
    note: "В CRM лучше хранить маршрут между известными точками, а городской live-транспорт подключать только через официальный фид.",
    linked: "Подходит для памятки туристу",
    verified: false,
  },
];

const DEFAULT_CARS = [
  {
    id: "car-1",
    driver: "Олеся Андреева",
    brand: "Tank",
    model: "300",
    plate: "H969CK65",
    capacity: 4,
    hasAc: true,
    phone: "89241841905",
    status: "Свободна",
    photo: "",
  },
  {
    id: "car-2",
    driver: "МКК",
    brand: "Mercedes-Benz",
    model: "Sprinter",
    plate: "A214AA65",
    capacity: 18,
    hasAc: true,
    phone: "+7 924 000-41-20",
    status: "На линии",
    photo: "",
  },
  {
    id: "car-3",
    driver: "Андрей Шубин",
    brand: "Hyundai",
    model: "Staria",
    plate: "K501TB65",
    capacity: 6,
    hasAc: false,
    phone: "+7 914 822-10-14",
    status: "Резерв",
    photo: "",
  },
];

const initialData = {
  cars: structuredClone(DEFAULT_CARS),
  requests: [
    {
      id: "TR-1042",
      name: "Анна Смирнова",
      phone: "+7 924 552-19-20",
      route: "Сахалин на 5 дней",
      programIds: ["sakhalin-5"],
      dates: "12-16 июля",
      hotel: "Отель Мира",
      pax: 2,
      budget: "180 000 ₽",
      paidAmount: "0 ₽",
      costAmount: "108 000 ₽",
      costItems: { accommodation: "45 000 ₽", transport: "22 000 ₽", guides: "24 000 ₽", tickets: "12 000 ₽", reserve: "5 000 ₽" },
      calculationNote: "Пример расчета: отель, групповой транспорт, гид и входные билеты по программе.",
      status: "new",
      source: "MAX бот",
      manager: "Алина",
      priority: "Высокий",
      paymentStatus: "Предоплата ожидается",
      documentStatus: "Запрошены",
      createdAt: "Сегодня, 10:15",
      nextStep: "Подобрать 2 варианта программы",
      comment: "Интересует природа, маяк Анива, морепродукты, комфортный отель.",
      tags: ["Пара", "Экскурсии", "Отель 4*"],
      notes: ["Клиент просит не звонить до 15:00."],
      messages: ["Спасибо, заявка получена. Менеджер скоро вернется с вариантами."],
    },
    {
      id: "TR-1041",
      name: "Игорь Петров",
      phone: "+7 914 880-34-11",
      route: "Курилы + Сахалин",
      programIds: ["kurils-sakhalin"],
      dates: "3-11 августа",
      hotel: "Azimut Владивосток",
      pax: 4,
      budget: "620 000 ₽",
      paidAmount: "0 ₽",
      costAmount: "390 000 ₽",
      costItems: { accommodation: "160 000 ₽", transport: "95 000 ₽", guides: "70 000 ₽", tickets: "45 000 ₽", reserve: "20 000 ₽" },
      calculationNote: "Пример заполненного расчета: семья 4 человека, проживание, перелеты/переезды внутри маршрута и гиды.",
      status: "work",
      source: "Сайт",
      manager: "Михаил",
      priority: "Средний",
      paymentStatus: "Не обсуждали",
      documentStatus: "Не запрошены",
      createdAt: "Вчера, 18:40",
      nextStep: "Уточнить паспорта после согласования маршрута",
      comment: "Семья, двое взрослых и двое детей. Важна безопасность и понятная логистика.",
      tags: ["Семья", "Авиаперелеты", "Маршрут"],
      notes: ["Нужна спокойная программа без длинных пеших переходов."],
      messages: ["Отправили первичный план тура и ориентировочный бюджет."],
    },
    {
      id: "TR-1040",
      name: "Марина Волкова",
      phone: "+7 962 711-08-44",
      route: "Южно-Сахалинск + Буссе",
      programIds: ["busse-yuzhno"],
      dates: "30 июня - 2 июля",
      hotel: "Lotte Hotel",
      pax: 1,
      budget: "75 000 ₽",
      paidAmount: "30 000 ₽",
      costAmount: "42 000 ₽",
      costItems: { accommodation: "17 000 ₽", transport: "10 000 ₽", guides: "8 000 ₽", tickets: "5 000 ₽", reserve: "2 000 ₽" },
      calculationNote: "Короткая программа: проживание, трансфер, обзорная экскурсия и Буссе.",
      status: "offer",
      source: "MAX бот",
      manager: "Екатерина",
      priority: "Средний",
      paymentStatus: "Предоплата внесена",
      documentStatus: "Получены",
      createdAt: "Вчера, 12:05",
      nextStep: "Дождаться ответа по экскурсии на Буссе",
      comment: "Гость едет на мероприятие, хочет добавить вечернюю экскурсию.",
      tags: ["Соло", "Мероприятие", "Доп. экскурсия"],
      notes: ["Отправлен вариант с обзорной экскурсией."],
      messages: ["Подготовили программу на 30 июня, отметьте интересующие активности."],
    },
    {
      id: "TR-1039",
      name: "Денис Ковалев",
      phone: "+7 999 350-42-18",
      route: "VIP выходные на Сахалине",
      programIds: ["vip-weekend"],
      dates: "19-21 июля",
      hotel: "Индивидуальный адрес",
      pax: 2,
      budget: "350 000 ₽",
      paidAmount: "0 ₽",
      costAmount: "215 000 ₽",
      costItems: { accommodation: "80 000 ₽", transport: "60 000 ₽", guides: "45 000 ₽", tickets: "20 000 ₽", reserve: "10 000 ₽" },
      calculationNote: "Индивидуальная поездка: водитель, ресторанные брони, гид и резерв под подрядчиков.",
      status: "wait",
      source: "Рекомендация",
      manager: "Алина",
      priority: "Высокий",
      paymentStatus: "Предоплата ожидается",
      documentStatus: "Запрошены",
      createdAt: "26 июня, 09:28",
      nextStep: "Напомнить о предоплате",
      comment: "Нужен водитель, ресторан, индивидуальная программа без группы.",
      tags: ["VIP", "Водитель", "Рестораны"],
      notes: ["Клиенту важен быстрый ответ в мессенджере."],
      messages: ["Забронировали водителя на выбранные даты, ожидаем подтверждение."],
    },
    {
      id: "TR-1038",
      name: "Ольга Белова",
      phone: "+7 914 226-77-90",
      route: "Корпоративная группа",
      programIds: ["corporate"],
      dates: "5-7 сентября",
      hotel: "Группа · список участников",
      pax: 16,
      budget: "1 200 000 ₽",
      paidAmount: "300 000 ₽",
      costAmount: "760 000 ₽",
      costItems: { accommodation: "315 000 ₽", transport: "190 000 ₽", guides: "130 000 ₽", tickets: "80 000 ₽", reserve: "45 000 ₽" },
      calculationNote: "Корпоративная группа: размещение, автобус и два легковых авто, гиды, билеты и резерв.",
      status: "booked",
      source: "Звонок",
      manager: "Михаил",
      priority: "Высокий",
      paymentStatus: "Предоплата внесена",
      documentStatus: "Получены",
      createdAt: "24 июня, 15:12",
      nextStep: "Собрать список участников",
      comment: "Компания привозит партнеров, нужны трансферы, программа, отчетные документы.",
      tags: ["B2B", "Группа", "Трансферы"],
      notes: ["Отдельно согласовать автобус и два легковых авто."],
      messages: ["Бронь подтверждена. Следующий шаг - список участников."],
    },
  ],
  programs: [
    {
      id: "sakhalin-5",
      title: "Сахалин на 5 дней",
      dates: "12-16 июля",
      duration: "5 дней",
      hotel: "Подбор проживания",
      status: "Готова",
      price: "от 180 000 ₽",
      manager: "Алина",
      cover: "https://cultsakhalin.ru/uploads/bd38de48d85149620a7d3f37e509b40c_w600_h400_cx0_cy0_cw1280_ch853.jpg",
      summary: "Классика для первого визита: Южно-Сахалинск, побережье, бухта Тихая, маяк Анива и локальная кухня.",
      description: "Спокойный пятидневный маршрут для первого знакомства с островом. Подходит паре, семье или небольшой компании, когда хочется увидеть главное без перегруза.",
      includes: ["Трансферы по программе", "Экскурсии с гидом", "Помощь с проживанием", "Памятка туриста"],
      itinerary: ["День 1: встреча, заселение и знакомство с городом", "День 2: бухта Тихая и побережье", "День 3: маяк Анива или запасной морской маршрут", "День 4: локальная кухня, рынки и свободное время", "День 5: выезд и трансфер"],
      photos: ["https://cultsakhalin.ru/uploads/bd38de48d85149620a7d3f37e509b40c_w600_h400_cx0_cy0_cw1280_ch853.jpg", "https://1zoom.club/uploads/posts/2023-05/1684282522_1zoom-club-p-mayak-aniva-deistvuyushchii-1.jpg"],
      videos: ["Ссылка на видео маршрута"],
      files: ["PDF-программа для клиента"],
    },
    {
      id: "aniva-tikhaya",
      title: "Анива + бухта Тихая",
      dates: "20-23 июля",
      duration: "4 дня",
      hotel: "Подбор проживания",
      status: "Готова",
      price: "от 145 000 ₽",
      manager: "Алина",
      cover: "https://1zoom.club/uploads/posts/2023-05/1684282522_1zoom-club-p-mayak-aniva-deistvuyushchii-1.jpg",
      summary: "Маршрут для тех, кто хочет самые узнаваемые виды Сахалина без длинной экспедиции.",
      description: "Фото-маршрут по сильным природным точкам: маяк Анива, бухта Тихая, побережье и видовые остановки. План зависит от погоды и моря.",
      includes: ["Гид", "Трансфер к локациям", "План по погоде", "Фототочки маршрута"],
      itinerary: ["День 1: прилет и вечерняя прогулка", "День 2: бухта Тихая", "День 3: маяк Анива по погоде", "День 4: мыс Великан, сувениры и выезд"],
      photos: ["https://1zoom.club/uploads/posts/2023-05/1684282522_1zoom-club-p-mayak-aniva-deistvuyushchii-1.jpg", "https://cultsakhalin.ru/uploads/bd38de48d85149620a7d3f37e509b40c_w600_h400_cx0_cy0_cw1280_ch853.jpg"],
      videos: ["Видео с побережья"],
      files: ["PDF-маршрут Анива + Тихая"],
    },
    {
      id: "busse-yuzhno",
      title: "Южно-Сахалинск + Буссе",
      dates: "30 июня - 2 июля",
      duration: "3 дня",
      hotel: "Lotte Hotel",
      status: "Готова",
      price: "от 75 000 ₽",
      manager: "Екатерина",
      cover: "https://cultsakhalin.ru/uploads/1fc1be2d5b438058148d3bd795431181_w600_h400_cx0_cy39_cw1024_ch683.jpg",
      summary: "Компактный маршрут: город, лагуна Буссе, морская гастрономия и вечерняя экскурсия.",
      description: "Короткая программа для гостей мероприятия или туристов на 2-3 дня. Хорошо подходит как легкое дополнение к деловой поездке.",
      includes: ["Обзорная экскурсия", "Подбор активностей", "Трансфер по запросу", "Сопровождение менеджера"],
      itinerary: ["День 1: заселение и город", "День 2: лагуна Буссе и гастрономия", "День 3: свободное время и выезд"],
      photos: ["https://cultsakhalin.ru/uploads/1fc1be2d5b438058148d3bd795431181_w600_h400_cx0_cy39_cw1024_ch683.jpg"],
      videos: ["Видео обзорной экскурсии"],
      files: ["PDF-программа 3 дня"],
    },
    {
      id: "iturup",
      title: "Итуруп: Белые скалы",
      dates: "3-8 августа",
      duration: "6 дней",
      hotel: "Подбор размещения",
      status: "Сбор дат",
      price: "от 390 000 ₽",
      manager: "Михаил",
      cover: "https://cultsakhalin.ru/uploads/e6db6de65a9fbcaaa19f5ae5620471fd.jpg",
      summary: "Курильский маршрут с Белыми скалами, черным песком, лавовыми плато и горячими источниками.",
      description: "Экспедиционный маршрут по Итурупу с запасом по погоде. Подходит тем, кто хочет Курилы, природу и сильные впечатления.",
      includes: ["План перелетов", "Местные трансферы", "Гид на маршруте", "Резервный план по погоде"],
      itinerary: ["День 1: перелет на Итуруп", "День 2: Белые скалы", "День 3: горячие источники", "День 4: вулканические плато", "День 5: запасной день", "День 6: возврат на Сахалин"],
      photos: ["https://cultsakhalin.ru/uploads/e6db6de65a9fbcaaa19f5ae5620471fd.jpg"],
      videos: ["Видео Итурупа"],
      files: ["Памятка по Курилам"],
    },
    {
      id: "kunashir",
      title: "Кунашир: мыс Столбчатый",
      dates: "10-16 августа",
      duration: "7 дней",
      hotel: "Подбор размещения",
      status: "Сбор дат",
      price: "от 430 000 ₽",
      manager: "Михаил",
      cover: "https://cultsakhalin.ru/uploads/eba45a4acb7afeaf68dcc0a23324808a.jpg",
      summary: "Базальтовые колонны, вулканы, термальные источники и океанские панорамы.",
      description: "Маршрут для тех, кто хочет редкие природные места и готов к островной логистике. В программу заложен запас под погоду.",
      includes: ["Маршрутный план", "Трансферы на острове", "Гид", "Контроль погодных окон"],
      itinerary: ["День 1: перелет и заселение", "День 2: мыс Столбчатый", "День 3: термальные источники", "День 4: вулканический маршрут", "День 5: запасной день", "День 6: свободное время", "День 7: возвращение"],
      photos: ["https://cultsakhalin.ru/uploads/eba45a4acb7afeaf68dcc0a23324808a.jpg"],
      videos: ["Видео Кунашира"],
      files: ["Памятка туриста"],
    },
    {
      id: "vip-weekend",
      title: "VIP выходные на Сахалине",
      dates: "19-21 июля",
      duration: "3 дня",
      hotel: "Индивидуальный адрес",
      status: "Готова",
      price: "от 350 000 ₽",
      manager: "Алина",
      cover: "https://1zoom.club/uploads/posts/2023-05/1684282477_1zoom-club-p-mayak-aniva-deistvuyushchii-4.jpg",
      summary: "Индивидуальная поездка без группы: водитель, красивые локации, рестораны и маршрут под настроение.",
      description: "VIP-формат для клиентов, которым важны приватность, скорость реакции менеджера и готовность менять программу по ходу поездки.",
      includes: ["Персональный водитель", "Индивидуальный маршрут", "Рестораны по запросу", "Связь с менеджером"],
      itinerary: ["День 1: встреча и ужин", "День 2: индивидуальный маршрут", "День 3: свободное утро и выезд"],
      photos: ["https://1zoom.club/uploads/posts/2023-05/1684282477_1zoom-club-p-mayak-aniva-deistvuyushchii-4.jpg"],
      videos: ["Видео VIP-маршрута"],
      files: ["Персональное предложение"],
    },
    {
      id: "corporate",
      title: "Корпоративная группа",
      dates: "5-7 сентября",
      duration: "3-5 дней",
      hotel: "Группа · список участников",
      status: "Сбор данных",
      price: "от 1 200 000 ₽",
      manager: "Михаил",
      cover: "https://cultsakhalin.ru/uploads/1fc1be2d5b438058148d3bd795431181_w600_h400_cx0_cy39_cw1024_ch683.jpg",
      summary: "Формат для бизнеса: списки участников, рассадки, трансферы, программа, документы и контроль задач.",
      description: "Программа для компаний и делегаций: участники, логистика, рассадки, трансферы и контроль задач в одной CRM.",
      includes: ["Список участников", "Групповые трансферы", "Программа мероприятий", "Отчетные документы"],
      itinerary: ["День 1: прибытие группы", "День 2: деловая или экскурсионная программа", "День 3: трансферы и индивидуальные задачи", "День 4: отчетные документы и выезд"],
      photos: ["https://cultsakhalin.ru/uploads/1fc1be2d5b438058148d3bd795431181_w600_h400_cx0_cy39_cw1024_ch683.jpg"],
      videos: ["Видео площадки"],
      files: ["Смета", "Список участников", "Программа для рассылки"],
    },
  ],
  activities: [
    "Анна Смирнова отправила заявку из MAX бота",
    "Марине Волковой отправлен шаблон с программой",
    "Денису Ковалеву назначено напоминание о предоплате",
    "Ольге Беловой подтверждена бронь корпоративной программы",
  ],
  templates: [
    {
      id: "hello",
      title: "Приветствие после заявки",
      text: [
        "Здравствуйте! Спасибо за заявку 🌿",
        "",
        "Мы уже взяли ее в работу и аккуратно проверяем:",
        "🗓 даты поездки",
        "🌊 программу и маршрут",
        "🏨 проживание",
        "🚘 трансфер и рейс, если он указан",
        "",
        "Скоро менеджер пришлет варианты и предварительный расчет. Если хотите что-то добавить — напишите прямо сюда.",
      ].join("\n"),
    },
    {
      id: "program",
      title: "Выбор программы",
      text: [
        "Подготовили для вас варианты поездки 🌊",
        "",
        "В программе можно посмотреть:",
        "📍 маршрут по дням",
        "🖼 фото локаций",
        "✅ что входит в стоимость",
        "➕ что оплачивается отдельно",
        "",
        "Если какой-то вариант понравится — напишите его название, и менеджер соберет расчет под ваши даты.",
      ].join("\n"),
    },
    {
      id: "payment",
      title: "Напоминание о предоплате",
      text: [
        "Напоминаем о предоплате 💳",
        "",
        "Она нужна, чтобы закрепить:",
        "🌿 выбранную программу",
        "🏨 проживание",
        "🚘 трансфер и брони по маршруту",
        "",
        "Если удобнее другой способ оплаты или нужен счет — напишите сюда, менеджер подскажет.",
      ].join("\n"),
    },
  ],
};

let state = loadState();
ensureStateShape();
let ui = {
  view: "dashboard",
  boardMode: "board",
  airportMode: "departures",
  airportDate: formatDateInput(new Date()),
  airportTimeStart: "",
  airportTimeEnd: "",
  airportAutoRefresh: "300",
  airportFiltersOpen: false,
  airportStatusOpen: false,
  transportMode: "air",
  transportFrom: "",
  transportTo: "",
  transportDate: formatDateInput(new Date()),
  transportExpanded: false,
  financeFocus: "sold",
  journalFilter: "all",
  journalSort: "newest",
  selectedId: null,
  startEditRequestId: "",
  search: "",
};
let airportBoard = {
  source: "fallback",
  updatedAt: "Резервный слой",
  flights: getFallbackAirportFlights("departures"),
  loading: false,
  error: "",
  upstreamUrl: "",
  proxyUrl: "",
  backendSource: "",
  lastLiveAt: "",
  lastAttemptAt: "",
};
let transportBoard = {
  loading: false,
  kind: "",
  source: "",
  updatedAt: "",
  routes: [],
  fallbackDate: "",
  error: "",
  setupRequired: false,
};
let maxBotStatus = {
  loading: false,
  configured: false,
  inboxCount: 0,
  mode: "",
  botLink: "https://max.ru/id2540295426_bot",
  apiBase: "https://platform-api2.max.ru",
  runtime: {},
  scenarioFields: [],
  automations: [],
};
let airportRefreshTimer = null;

const appContent = document.getElementById("appContent");
const pageHeading = document.getElementById("pageHeading");
const detailPanel = document.getElementById("detailPanel");
const modalRoot = document.getElementById("modalRoot");
const toastRegion = document.getElementById("toastRegion");
const searchInput = document.getElementById("globalSearch");
const searchResultsRoot = document.getElementById("globalSearchResults");

applyTheme();
applyStartupParams();
render();
if (ui.startEditRequestId) openRequestEditModal(ui.startEditRequestId);
syncNav();
if (usesAirportData(ui.view)) {
  syncAirportAutoRefresh();
  loadAirportBoard();
}
if (usesTransportData(ui.view)) loadTransportBoard();
syncMaxInbox({ silent: true });
loadMaxBotStatus({ silent: true });
window.setInterval(() => syncMaxInbox({ silent: true }), MAX_IMPORT_INTERVAL_MS);

document.addEventListener("click", (event) => {
  const navButton = event.target.closest("[data-view]");
  if (navButton) {
    if (!isViewAllowedForActiveRole(navButton.dataset.view)) {
      toast("Доступ к этому разделу закрыт для выбранной роли.");
      return;
    }
    ui.view = navButton.dataset.view;
    ui.airportStatusOpen = false;
    closeDetail();
    if (modalRoot.contains(navButton)) closeModal();
    if (navButton.dataset.view === "arrivals") ui.airportMode = "arrivals";
    if (navButton.dataset.view === "departures") ui.airportMode = "departures";
    render();
    resetPageScroll();
    syncAirportAutoRefresh();
    if (usesAirportData(ui.view)) loadAirportBoard();
    if (usesTransportData(ui.view)) loadTransportBoard();
    if (ui.view === "settings") loadMaxBotStatus({ silent: true });
    return;
  }

  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;

  const action = actionEl.dataset.action;
  const id = actionEl.dataset.id;

  if (action === "openNewRequest") openNewRequestModal();
  if (action === "clearGlobalSearch") clearGlobalSearch();
  if (action === "openGlobalSearchResult") openGlobalSearchResult(actionEl.dataset.resultType, actionEl.dataset.resultId);
  if (action === "openRequestEdit") openRequestEditModal(id);
  if (action === "openNewProgram") openProgramEditModal();
  if (action === "openProgramEdit") openProgramEditModal(actionEl.dataset.programId);
  if (action === "openProgramPreview") openProgramPreviewModal(actionEl.dataset.programId);
  if (action === "sendProgramToClient") markProgramSent(actionEl.dataset.programId);
  if (action === "openActivity") openActivityTarget(actionEl.dataset.activityId);
  if (action === "openMobileMore") openMobileMore();
  if (action === "setJournalFilter") setJournalFilter(actionEl.dataset.filter);
  if (action === "setJournalSort") setJournalSort(actionEl.dataset.sort);
  if (action === "openAutomationRule") openAutomationRuleModal(actionEl.dataset.ruleId);
  if (action === "runAutomationRule") runAutomationRule(actionEl.dataset.ruleId);
  if (action === "showAutomationMetric") showAutomationMetric(actionEl.dataset.metric);
  if (action === "openTemplateRecipients") openTemplateRecipients(actionEl.dataset.template);
  if (action === "refreshMaxBotStatus") loadMaxBotStatus({ silent: false });
  if (action === "setFinanceFocus") setFinanceFocus(actionEl.dataset.metric);
  if (action === "setTransportMode") setTransportMode(actionEl.dataset.mode);
  if (action === "searchTransport") loadTransportBoard();
  if (action === "toggleTransportRoutes") toggleTransportRoutes();
  if (action === "openTransportInfo") openTransportInfoModal();
  if (action === "openTransportRoute") openTransportRouteModal(actionEl.dataset.transportId);
  if (action === "addTransportToProgram") addTransportToProgram(actionEl.dataset.transportId);
  if (action === "createTransportTransfer") createTransportTransfer(actionEl.dataset.transportId);
  if (action === "closeModal") closeModal();
  if (action === "closeDetail") closeDetail();
  if (action === "openRequest") openRequest(id);
  if (action === "setBoardMode") setBoardMode(actionEl.dataset.mode);
  if (action === "setAirportMode") setAirportMode(actionEl.dataset.mode);
  if (action === "toggleAirportFilters") toggleAirportFilters();
  if (action === "toggleAirportStatus") toggleAirportStatusPanel();
  if (action === "selectAirportDate") selectAirportDate(actionEl.dataset.date);
  if (action === "refreshAirportBoard") loadAirportBoard();
  if (action === "showAirportStatus") showAirportStatus();
  if (action === "showAirportMetric") showAirportMetric(actionEl.dataset.metric);
  if (action === "showCarsMetric") showCarsMetric(actionEl.dataset.metric);
  if (action === "openLogisticsItem") openLogisticsItemModal(actionEl.dataset.logisticsId);
  if (action === "createTransferTask") createTransferTaskFromLogistics(actionEl.dataset.logisticsId);
  if (action === "openTransferTask") openTransferTaskModal(actionEl.dataset.taskId);
  if (action === "assignTransferCar") void assignTransferCar(actionEl.dataset.taskId, actionEl.dataset.carId);
  if (action === "openFlight") openFlightModal(actionEl.dataset.flightKey);
  if (action === "watchFlight") watchFlight(actionEl.dataset.flightKey);
  if (action === "removeWatchedFlight") removeWatchedFlight(actionEl.dataset.watchId);
  if (action === "createFlightTransfer") createFlightTransfer(actionEl.dataset.flightKey || actionEl.dataset.flight);
  if (action === "openCar") openCarModal(actionEl.dataset.carId);
  if (action === "openCarEdit") openCarEditModal(actionEl.dataset.carId);
  if (action === "openNewCar") openCarEditModal();
  if (action === "saveCarForm") {
    const form = actionEl.closest("form");
    if (form && form.reportValidity()) void saveCarFromForm(new FormData(form));
  }
  if (action === "setStatus") updateStatus(id, actionEl.dataset.status);
  if (action === "setNextStep") updateNextStep(id);
  if (action === "createClientScenario") createClientScenarioRequest();
  if (action === "sendTemplate") sendTemplate(id, actionEl.dataset.template);
  if (action === "requestDocuments") requestDocuments(id);
  if (action === "advanceDocument") advanceDocumentStatus(id, actionEl.dataset.docId);
  if (action === "assignManager") assignManager(id);
  if (action === "selectManager") selectManager(id, actionEl.dataset.manager);
  if (action === "addNote") addNote(id);
  if (action === "setThemePreset") setThemePreset(actionEl.dataset.preset);
  if (action === "resetTheme") resetTheme();
  if (action === "resetWorkspaceData") resetWorkspaceData();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".program-card[data-action='openProgramPreview']");
  if (!card || event.target.closest("button, a, input, select, textarea")) return;
  event.preventDefault();
  openProgramPreviewModal(card.dataset.programId);
});

document.addEventListener("dragstart", (event) => {
  const card = event.target.closest("[data-drag-logistics-id]");
  if (!card) return;
  event.dataTransfer?.setData("text/plain", card.dataset.dragLogisticsId || "");
  event.dataTransfer?.setData("application/x-logistics-id", card.dataset.dragLogisticsId || "");
  event.dataTransfer.effectAllowed = "move";
});

document.addEventListener("dragover", (event) => {
  const zone = event.target.closest("[data-drop-car-id]");
  if (!zone) return;
  event.preventDefault();
  zone.classList.add("is-drag-over");
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
});

document.addEventListener("dragleave", (event) => {
  const zone = event.target.closest("[data-drop-car-id]");
  if (!zone || zone.contains(event.relatedTarget)) return;
  zone.classList.remove("is-drag-over");
});

document.addEventListener("drop", (event) => {
  const zone = event.target.closest("[data-drop-car-id]");
  if (!zone) return;
  event.preventDefault();
  zone.classList.remove("is-drag-over");
  const logisticsId = event.dataTransfer?.getData("application/x-logistics-id") || event.dataTransfer?.getData("text/plain");
  void assignLogisticsItemToCar(logisticsId, zone.dataset.dropCarId);
});

document.addEventListener("submit", async (event) => {
  if (event.target.id === "carForm") {
    event.preventDefault();
    await saveCarFromForm(new FormData(event.target));
    return;
  }

  if (event.target.id === "editRequestForm") {
    event.preventDefault();
    saveRequestFromForm(new FormData(event.target));
    return;
  }

  if (event.target.id === "programForm") {
    event.preventDefault();
    await saveProgramFromForm(new FormData(event.target));
    return;
  }

  if (event.target.id !== "newRequestForm") return;
  event.preventDefault();
  const formData = new FormData(event.target);
  const request = buildRequestFromForm(formData);
  state.requests.unshift(request);
  addActivity(`${request.name} создана вручную в админке`, { targetType: "request", targetId: request.id, targetView: "requests" });
  persist();
  closeModal();
  ui.view = "requests";
  syncNav();
  openRequest(request.id);
  render();
  toast("Заявка создана и добавлена в доску.");
});

searchInput.addEventListener("input", (event) => {
  ui.search = event.target.value.trim().toLowerCase();
  render();
  renderGlobalSearchResults();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeGlobalSearchResults();
    return;
  }
  if (event.key !== "Enter") return;
  event.preventDefault();
  const firstResult = getGlobalSearchResults(ui.search)[0];
  if (firstResult) {
    openGlobalSearchResult(firstResult.type, firstResult.id);
    return;
  }
  openFirstSearchResult();
});

searchInput.addEventListener("focus", () => {
  renderGlobalSearchResults();
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".search-box")) return;
  closeGlobalSearchResults();
});

function openFirstSearchResult() {
  const query = normalizeSearch(ui.search);
  if (!query) return;
  if (ui.view === "journal") {
    const count = filterJournalEvents(filterJournalEventsBySearch(sortJournalEvents(getActivities()))).length;
    render();
    toast(count ? `В журнале найдено событий: ${count}.` : "В журнале ничего не найдено.");
    return;
  }
  if (ui.view === "program") {
    const program = filteredPrograms()[0];
    if (program) openProgramPreviewModal(program.id);
    return;
  }
  if (["requests", "clients", "finance"].includes(ui.view)) {
    const request = filteredRequests()[0];
    if (request) openRequest(request.id);
    return;
  }
  toast("Поиск применен к текущему разделу.");
}

function renderGlobalSearchResults() {
  if (!searchResultsRoot || !searchInput) return;
  const query = normalizeSearch(ui.search);
  if (!query) {
    closeGlobalSearchResults();
    return;
  }
  const results = getGlobalSearchResults(query);
  searchInput.setAttribute("aria-expanded", "true");
  searchResultsRoot.hidden = false;
  searchResultsRoot.innerHTML = `
    <div class="global-search-header">
      <strong>${results.length ? `Найдено: ${results.length}` : "Ничего не найдено"}</strong>
      <span>${escapeHtml(query)}</span>
    </div>
    ${results.length ? results.slice(0, 8).map(renderGlobalSearchResult).join("") : `<div class="global-search-empty">Попробуйте имя, телефон, тур, рейс или номер авто.</div>`}
  `;
}

function renderGlobalSearchResult(result) {
  return `
    <button class="global-search-result" type="button" data-action="openGlobalSearchResult" data-result-type="${escapeHtml(result.type)}" data-result-id="${escapeHtml(result.id)}">
      <span>${escapeHtml(result.label)}</span>
      <strong>${escapeHtml(result.title)}</strong>
      <em>${escapeHtml(result.subtitle || "")}</em>
    </button>
  `;
}

function closeGlobalSearchResults() {
  if (!searchResultsRoot || !searchInput) return;
  searchResultsRoot.hidden = true;
  searchInput.setAttribute("aria-expanded", "false");
}

function clearGlobalSearch() {
  ui.search = "";
  searchInput.value = "";
  closeGlobalSearchResults();
  render();
}

function getGlobalSearchResults(queryValue) {
  const query = normalizeSearch(queryValue);
  if (!query) return [];
  const results = [];

  state.requests.forEach((request) => {
    const score = getRequestSearchScore(request, query);
    if (score > 0) {
      results.push({
        type: "request",
        id: request.id,
        label: "Заявка",
        title: request.name,
        subtitle: `${getRequestProgramTitle(request)} · ${request.phone || "телефон не указан"}`,
        score: score + 20,
      });
      results.push({
        type: "client",
        id: request.id,
        label: "Клиент",
        title: request.name,
        subtitle: `${request.phone || "телефон не указан"} · ${request.manager || "без ответственного"}`,
        score,
      });
    }
  });

  getPrograms().forEach((program) => {
    const haystack = [
      program.title,
      program.summary,
      program.description,
      program.dates,
      program.duration,
      program.price,
      program.status,
      program.manager,
      ...(Array.isArray(program.includes) ? program.includes : []),
      ...(Array.isArray(program.itinerary) ? program.itinerary : []),
    ].join(" ");
    const score = scoreGlobalText(haystack, query);
    if (score > 0) {
      results.push({
        type: "program",
        id: program.id,
        label: "Тур",
        title: program.title,
        subtitle: `${program.duration || "срок уточнить"} · ${program.price || "по запросу"}`,
        score: score + 12,
      });
    }
  });

  getCars().forEach((car) => {
    const title = getCarTitle(car);
    const haystack = [title, car.driver, car.plate, car.phone, car.status, formatCarAc(car)].join(" ");
    const score = scoreGlobalText(haystack, query);
    if (score > 0) {
      results.push({
        type: "car",
        id: car.id,
        label: "Авто",
        title,
        subtitle: `${car.plate || "номер не указан"} · ${car.driver || "водитель не указан"}`,
        score: score + 8,
      });
    }
  });

  getTransferTaskRows().forEach((task) => {
    const haystack = [task.title, task.client, task.flightNo, task.route, task.status, task.meta].join(" ");
    const score = scoreGlobalText(haystack, query);
    if (score > 0) {
      results.push({
        type: "transferTask",
        id: task.id,
        label: "Трансфер",
        title: task.title,
        subtitle: task.meta || task.flightNo || "задача трансфера",
        score: score + 10,
      });
    }
  });

  getActivities().forEach((activity) => {
    const haystack = [activity.text, activity.message, getActivityTargetLabel(activity)].join(" ");
    const score = scoreGlobalText(haystack, query);
    if (score > 0) {
      results.push({
        type: "activity",
        id: activity.id,
        label: "Журнал",
        title: activity.text || activity.message || "Событие CRM",
        subtitle: getActivityTargetLabel(activity),
        score,
      });
    }
  });

  airportBoard.flights.forEach((flight) => {
    const haystack = [flight.no, flight.city, flight.airline, flight.airport, flight.status, flight.direction].join(" ");
    const score = scoreGlobalText(haystack, query);
    if (score > 0) {
      results.push({
        type: "flight",
        id: flight.key,
        label: flight.direction || "Рейс",
        title: `${flight.no} · ${flight.city}`,
        subtitle: `${flight.displayDate || ""} ${flight.displayTime || ""} · ${flight.status || ""}`.trim(),
        score,
      });
    }
  });

  return results
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "ru"))
    .filter((result, index, list) => list.findIndex((item) => item.type === result.type && item.id === result.id) === index);
}

function scoreGlobalText(value, query) {
  return scoreSearchField(value, query, 120, 90, 45);
}

function openGlobalSearchResult(type, id) {
  if (!type || !id) return;
  closeGlobalSearchResults();
  closeModal();
  closeDetail();
  if (type === "request" || type === "client") {
    ui.view = type === "client" ? "clients" : "requests";
    render();
    openRequest(id);
    resetPageScroll();
    return;
  }
  if (type === "program") {
    ui.view = "program";
    render();
    openProgramPreviewModal(id);
    resetPageScroll();
    return;
  }
  if (type === "car") {
    ui.view = "cars";
    render();
    openCarModal(id);
    resetPageScroll();
    return;
  }
  if (type === "transferTask") {
    ui.view = "cars";
    render();
    openTransferTaskModal(id);
    resetPageScroll();
    return;
  }
  if (type === "activity") {
    ui.view = "journal";
    render();
    openActivityTarget(id);
    resetPageScroll();
    return;
  }
  if (type === "flight") {
    ui.view = ui.airportMode === "arrivals" ? "arrivals" : "departures";
    render();
    openFlightModal(id);
    resetPageScroll();
    return;
  }
}

document.addEventListener("input", (event) => {
  const themeColor = event.target.closest("[data-theme-color]");
  if (themeColor) {
    updateThemeColor(themeColor.dataset.themeColor, themeColor.value, { render: false, silent: true });
    return;
  }

  const transportField = event.target.closest("[data-transport-field]");
  if (transportField) updateTransportSetting(transportField.dataset.transportField, transportField.value, { silent: true });

  const form = event.target.closest("form");
  if (form?.querySelector("[data-cost-calculator]")) updateCostCalculatorPreview(form);
});

document.addEventListener("change", (event) => {
  const themeColor = event.target.closest("[data-theme-color]");
  if (themeColor) {
    updateThemeColor(themeColor.dataset.themeColor, themeColor.value);
    return;
  }

  const field = event.target.closest("[data-airport-field]");
  if (field) {
    updateAirportSetting(field.dataset.airportField, field.value);
    return;
  }

  const transportField = event.target.closest("[data-transport-field]");
  if (transportField) {
    updateTransportSetting(transportField.dataset.transportField, transportField.value);
    return;
  }

  const documentStatus = event.target.closest("[data-document-status]");
  if (documentStatus) {
    setDocumentStatus(documentStatus.dataset.id, documentStatus.dataset.docId, documentStatus.value);
    return;
  }

  const accessToggle = event.target.closest("[data-access-toggle]");
  if (accessToggle) {
    updateAccessSetting(accessToggle.dataset.role, accessToggle.dataset.view, accessToggle.checked);
    return;
  }

  const systemField = event.target.closest("[data-system-field]");
  if (systemField) {
    if (systemField.dataset.systemField === "activeRole") setActiveAccessRole(systemField.value);
    else updateSystemSetting(systemField.dataset.systemField, systemField.value);
  }
});

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(initialData);
  } catch {
    return structuredClone(initialData);
  }
}

function ensureStateShape() {
  if (!Array.isArray(state.requests)) state.requests = structuredClone(initialData.requests);
  if (!Array.isArray(state.cars)) state.cars = structuredClone(DEFAULT_CARS);
  state.cars = state.cars.map((car) => ({ photo: "", ...car }));
  if (!Array.isArray(state.programs)) state.programs = structuredClone(initialData.programs);
  state.programs = state.programs.map((program, index) => {
    const defaults = initialData.programs.find((item) => item.id === program.id || item.title === program.title) || {};
    return normalizeProgram(mergeProgramDefaults(program, defaults), index);
  });
  const existingProgramIds = new Set(state.programs.map((program) => program.id));
  initialData.programs.forEach((program, index) => {
    if (!existingProgramIds.has(program.id)) state.programs.push(normalizeProgram(program, state.programs.length + index));
  });
  if (!Array.isArray(state.transferTasks)) state.transferTasks = [];
  if (!Array.isArray(state.watchedFlights)) state.watchedFlights = [];
  if (!state.settings || typeof state.settings !== "object") state.settings = {};
  if (!state.settings.timezone) state.settings.timezone = "Asia/Vladivostok";
  state.settings.theme = normalizeThemeSettings(state.settings.theme);
  if (!state.settings.activeRole || !DEFAULT_ACCESS[state.settings.activeRole]) state.settings.activeRole = "owner";
  if (!state.settings.access || typeof state.settings.access !== "object") {
    state.settings.access = structuredClone(DEFAULT_ACCESS);
  }
  Object.entries(DEFAULT_ACCESS).forEach(([role, defaults]) => {
    if (!state.settings.access[role]) state.settings.access[role] = structuredClone(defaults);
    if (!Array.isArray(state.settings.access[role].views)) state.settings.access[role].views = structuredClone(defaults.views);
    state.settings.access[role].label = defaults.label;
    state.settings.access[role].members = state.settings.access[role].members || defaults.members;
    state.settings.access[role].locked = Boolean(defaults.locked);
  });
  if (!state.airportLiveSnapshots || typeof state.airportLiveSnapshots !== "object") state.airportLiveSnapshots = {};
  if (!Array.isArray(state.maxImportedExternalIds)) state.maxImportedExternalIds = [];
  if (!Array.isArray(state.activities)) state.activities = [];
  state.activities = state.activities.map((activity, index) => normalizeActivity(activity, index)).slice(0, 60);
  if (!Array.isArray(state.templates)) state.templates = structuredClone(initialData.templates);
  state.templates = initialData.templates.map((template) => ({
    ...(state.templates.find((saved) => saved.id === template.id) || {}),
    ...template,
  }));
  state.requests.forEach((request, index) => {
    if (!Array.isArray(request.programIds)) {
      const program = state.programs.find((item) => item.title === request.route);
      request.programIds = program ? [program.id] : [];
    }
    if (!request.hotel) request.hotel = getHotelLabel(request, index);
    if (!request.paymentStatus) request.paymentStatus = getDefaultPaymentStatus(request.status);
    if (!request.documentStatus) request.documentStatus = getDefaultDocumentStatus(request.status);
    if (request.flightNo) request.flightNo = normalizeFlightNo(request.flightNo) || request.flightNo;
    if (request.chatId) request.chatId = String(request.chatId);
    if (request.userId) request.userId = String(request.userId);
    request.documents = normalizeDocumentChecklist(request);
    request.documentStatus = getOverallDocumentStatus(request.documents);
    if (!request.paidAmount) request.paidAmount = getDefaultPaidAmount(request);
    if (!request.costItems) request.costItems = {};
    request.costItems = normalizeCostItems(request.costItems);
    request.costAmount = hasCostItems(request.costItems) ? formatMoneyInput(getCostItemsTotal(request.costItems)) : "";
  });
  state.transferTasks = state.transferTasks.map((task) => ({
    ...task,
    flightNo: normalizeFlightNo(task.flightNo) || task.flightNo,
  }));
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetWorkspaceData() {
  state = structuredClone(initialData);
  ensureStateShape();
  applyTheme();
  ui.selectedId = null;
  persist();
  closeDetail();
  render();
  toast("Данные восстановлены.");
}

function normalizeThemeSettings(theme) {
  const presetId = theme?.preset && THEME_PRESETS.some((preset) => preset.id === theme.preset)
    ? theme.preset
    : DEFAULT_THEME.preset;
  const fallbackColors = THEME_PRESETS.find((preset) => preset.id === presetId)?.colors || DEFAULT_THEME.colors;
  const savedColors = theme?.colors && typeof theme.colors === "object" ? theme.colors : {};
  const colors = {};
  THEME_COLOR_FIELDS.forEach((field) => {
    colors[field.key] = normalizeThemeColor(savedColors[field.key], fallbackColors[field.key]);
  });
  return { preset: theme?.preset === "custom" ? "custom" : presetId, colors };
}

function normalizeThemeColor(value, fallback = "#0071e3") {
  const color = String(value || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(color)) return color.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`.toLowerCase();
  }
  return /^#[0-9a-f]{6}$/i.test(fallback) ? fallback.toLowerCase() : "#0071e3";
}

function getThemeSettings() {
  ensureStateShape();
  return state.settings.theme;
}

function applyTheme() {
  if (!document?.documentElement) return;
  const theme = state?.settings?.theme ? normalizeThemeSettings(state.settings.theme) : structuredClone(DEFAULT_THEME);
  const { colors } = theme;
  const root = document.documentElement;
  const pairs = [
    ["--blue", colors.accent],
    ["--link", colors.accent],
    ["--navy", colors.primary],
    ["--navy-focus", mixThemeColor(colors.primary, colors.accent, 0.42)],
    ["--teal", colors.success],
    ["--amber", colors.warning],
    ["--rose", colors.danger],
    ["--violet", colors.info],
    ["--blue-soft", themeSoftColor(colors.accent, 0.12)],
    ["--navy-soft", themeSoftColor(colors.primary, 0.12)],
    ["--teal-soft", themeSoftColor(colors.success, 0.12)],
    ["--amber-soft", themeSoftColor(colors.warning, 0.14)],
    ["--rose-soft", themeSoftColor(colors.danger, 0.12)],
    ["--violet-soft", themeSoftColor(colors.info, 0.12)],
    ["--focus-ring", themeSoftColor(colors.accent, 0.24)],
  ];
  pairs.forEach(([name, value]) => root.style.setProperty(name, value));
}

function themeSoftColor(hex, alpha = 0.12) {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function hexToRgb(hex) {
  const normalized = normalizeThemeColor(hex).slice(1);
  const number = Number.parseInt(normalized, 16);
  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255,
  };
}

function mixThemeColor(baseHex, accentHex, ratio = 0.35) {
  const base = hexToRgb(baseHex);
  const accent = hexToRgb(accentHex);
  const mix = (a, b) => Math.round(a * (1 - ratio) + b * ratio);
  return `#${[mix(base.r, accent.r), mix(base.g, accent.g), mix(base.b, accent.b)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function setThemePreset(presetId) {
  const preset = THEME_PRESETS.find((item) => item.id === presetId);
  if (!preset) return;
  state.settings.theme = {
    preset: preset.id,
    colors: structuredClone(preset.colors),
  };
  addActivity(`Оформление CRM: выбран пресет "${preset.label}"`, { targetType: "settings", targetId: preset.id, targetView: "settings" });
  applyTheme();
  persist();
  render();
}

function updateThemeColor(key, value, options = {}) {
  const field = THEME_COLOR_FIELDS.find((item) => item.key === key);
  if (!field) return;
  state.settings.theme = normalizeThemeSettings(state.settings.theme);
  state.settings.theme.preset = "custom";
  state.settings.theme.colors[key] = normalizeThemeColor(value, state.settings.theme.colors[key]);
  applyTheme();
  persist();
  if (options.render !== false) render();
}

function resetTheme() {
  state.settings.theme = structuredClone(DEFAULT_THEME);
  applyTheme();
  persist();
  render();
  toast("Вернул спокойную тему Apple.");
}

function isAirportView(view = ui.view) {
  return view === "arrivals" || view === "departures";
}

function usesAirportData(view = ui.view) {
  return isAirportView(view) || view === "cars";
}

function usesTransportData(view = ui.view) {
  return view === "transport";
}

function applyStartupParams() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  const allowedViews = ALL_APP_VIEWS;
  if (view === "airport") {
    ui.view = params.get("mode") === "arrivals" ? "arrivals" : "departures";
  } else if (view === "transfers") {
    ui.view = "cars";
  } else if (allowedViews.includes(view)) {
    ui.view = view;
  }
  if (params.get("date")) ui.airportDate = params.get("date");
  if (params.get("mode") === "arrivals" || params.get("mode") === "departures") ui.airportMode = params.get("mode");
  if (["sold", "received", "due", "margin"].includes(params.get("finance"))) ui.financeFocus = params.get("finance");
  if (params.get("live") === "1") ui.airportStatusOpen = true;
  if (ui.view === "arrivals") ui.airportMode = "arrivals";
  if (ui.view === "departures") ui.airportMode = "departures";
  if (TRANSPORT_TABS.some((tab) => tab.id === params.get("transport"))) ui.transportMode = params.get("transport");
  if (params.get("from")) ui.transportFrom = params.get("from");
  if (params.get("to")) ui.transportTo = params.get("to");
  if (ui.view === "transport" && !params.get("from") && !params.get("to")) applyTransportDefaults(ui.transportMode);
  if (params.get("transportDate")) ui.transportDate = params.get("transportDate");
  if (params.get("filters") === "1") ui.airportFiltersOpen = true;
  if (params.get("request")) ui.selectedId = params.get("request");
  if (params.get("editRequest")) {
    ui.view = "requests";
    ui.selectedId = params.get("editRequest");
    ui.startEditRequestId = params.get("editRequest");
  }
}

function render() {
  if (!isViewAllowedForActiveRole(ui.view)) {
    ui.view = "dashboard";
    closeDetail();
  }
  if (ui.view === "arrivals") ui.airportMode = "arrivals";
  if (ui.view === "departures") ui.airportMode = "departures";
  const headings = {
    dashboard: "Дашборд",
    requests: "Заявки",
    clients: "Клиенты",
    program: "Программа",
    finance: "Финансы",
    arrivals: "Прилёты",
    departures: "Вылеты",
    transport: "Транспорт",
    cars: "Автомобили",
    messages: "Сообщения",
    automation: "Автоматизации",
    settings: "Настройки",
    journal: "Журнал",
  };
  pageHeading.textContent = headings[ui.view];

  const views = {
    dashboard: renderDashboard,
    requests: renderRequests,
    clients: renderClients,
    program: renderProgram,
    finance: renderFinance,
    arrivals: renderLogisticsFlights,
    departures: renderLogisticsFlights,
    transport: renderTransportBoard,
    cars: renderCarsBoard,
    messages: renderMessages,
    automation: renderAutomation,
    settings: renderSettings,
    journal: renderJournal,
  };

  appContent.innerHTML = views[ui.view]();
  syncNav();
  if (ui.selectedId) renderDetail();
  syncAirportAutoRefresh();
}

function renderDashboard() {
  ensureStateShape();
  const newCount = state.requests.filter((item) => item.status === "new").length;
  const activeCount = state.requests.filter((item) => ["work", "offer", "wait"].includes(item.status)).length;
  const taskRows = getTransferTaskRows();
  const tasksWithoutCar = taskRows.filter((task) => !task.carId);
  const readyCars = getReadyCars();
  const incompleteCars = getCars().filter((car) => !isCarComplete(car));
  const readyPrograms = getPrograms().filter((program) => program.status === "Готова").length;
  const attentionRequests = state.requests.filter((item) => item.status === "new" || item.priority === "Высокий");
  const activeRequests = state.requests.filter((item) => item.status !== "closed");
  const revenuePotential = activeRequests.reduce((sum, item) => sum + parseMoneyValue(item.budget), 0);
  const finance = getFinanceSummary(activeRequests);
  const paymentDueCount = activeRequests.filter((item) => !["Предоплата внесена", "Оплачено"].includes(item.paymentStatus)).length;
  const docsDueCount = activeRequests.filter((item) => !["Получены", "Проверены"].includes(item.documentStatus)).length;
  const avgReadiness = activeRequests.length
    ? Math.round(activeRequests.reduce((sum, item) => sum + getRequestReadiness(item).percent, 0) / activeRequests.length)
    : 0;
  const attentionRows = [
    ...attentionRequests.slice(0, 3).map((item) => `
      <button class="transfer-row active-row" type="button" data-action="openRequest" data-id="${escapeHtml(item.id)}">
        <strong>${escapeHtml(item.name)}</strong>
        <p>${escapeHtml(getRequestProgramTitle(item))} · ${escapeHtml(item.nextStep)}</p>
        <div class="row-meta">${renderStatusBadge(item.status)}<span class="badge ${item.priority === "Высокий" ? "rose" : "amber"}">${escapeHtml(item.priority)}</span><span class="badge ${getPaymentTone(item.paymentStatus)}">${escapeHtml(item.paymentStatus)}</span></div>
        ${renderReadinessBar(item)}
      </button>
    `),
    ...tasksWithoutCar.slice(0, 3).map((task) => `
      <button class="transfer-row active-row" type="button" data-action="openTransferTask" data-task-id="${escapeHtml(task.id)}">
        <strong>${escapeHtml(task.title)}</strong>
        <p>${escapeHtml(task.meta)}</p>
        <div class="row-meta"><span class="badge amber">машина не назначена</span></div>
      </button>
    `),
    ...incompleteCars.slice(0, 2).map((car) => `
      <button class="transfer-row active-row" type="button" data-action="openCarEdit" data-car-id="${escapeHtml(car.id)}">
        <strong>${escapeHtml(getCarTitle(car))}</strong>
        <p>${escapeHtml(car.driver || "водитель не указан")} · карточку нужно заполнить</p>
        <div class="row-meta"><span class="badge rose">не готова</span></div>
      </button>
    `),
  ].slice(0, 3);
  const hiddenAttentionCount = Math.max(0, attentionRequests.length + tasksWithoutCar.length + incompleteCars.length - attentionRows.length);

  return `
    <div class="dashboard-showcase">
      <section class="panel dashboard-automation-panel">
        <div class="panel-header">
          <div>
            <h3>Работа по заявкам</h3>
            <p>Что требует внимания сейчас.</p>
          </div>
          <button class="button primary" type="button" data-action="createClientScenario">${iconSvg("automation", "button-icon")}<span>Проверить сценарий</span></button>
        </div>
        <div class="dashboard-flow">
          <button type="button" data-view="requests"><span>${newCount}</span><strong>Новые</strong><small>разобрать заявки</small></button>
          <button type="button" data-view="requests"><span>${docsDueCount}</span><strong>Документы</strong><small>запросить/проверить</small></button>
          <button type="button" data-view="arrivals"><span>${state.watchedFlights.length}</span><strong>Рейсы</strong><small>на контроле</small></button>
          <button type="button" data-view="cars"><span>${tasksWithoutCar.length}</span><strong>Трансфер</strong><small>без машины</small></button>
          <button type="button" data-view="journal"><span>${getActivities().length}</span><strong>Журнал</strong><small>последние события</small></button>
        </div>
      </section>
    </div>

    <div class="metric-strip dashboard-metrics">
      <button class="metric metric-button" type="button" data-view="finance" data-tone="teal"><span>Финансы</span><strong>${formatMoneyShort(revenuePotential)}</strong><small>Оплачено ${formatMoneyShort(finance.paid)} · остаток ${formatMoneyShort(finance.balance)}</small></button>
      <button class="metric metric-button" type="button" data-view="requests" data-tone="amber"><span>Оплата / документы</span><strong>${paymentDueCount}/${docsDueCount}</strong><small>Проверить туристов</small></button>
      <button class="metric metric-button" type="button" data-view="cars" data-tone="rose"><span>Без машины</span><strong>${tasksWithoutCar.length}</strong><small>Назначить авто</small></button>
      <button class="metric metric-button" type="button" data-view="program" data-tone="violet"><span>Готовность</span><strong>${avgReadiness}%</strong><small>${readyPrograms} туров готово</small></button>
    </div>

    <div class="work-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Требует внимания</h3>
            <p>Новые и приоритетные заявки, незакрытые трансферы и незаполненные машины.</p>
          </div>
        </div>
        <div class="simple-list">
          ${attentionRows.join("")}
          ${hiddenAttentionCount ? `<button class="chip-button wide-chip" type="button" data-view="journal">Еще ${hiddenAttentionCount} · открыть журнал</button>` : ""}
          ${!attentionRows.length ? `<div class="empty-state compact-empty">Критичных задач нет</div>` : ""}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Последние действия</h3>
            <p>Последние действия в системе</p>
          </div>
        </div>
        ${renderActivityList()}
      </section>
    </div>

    <div class="work-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Логистика сегодня</h3>
            <p>Назначение машин и ближайшие задачи трансфера.</p>
          </div>
          <button class="chip-button" type="button" data-view="cars">Автомобили</button>
        </div>
        <div class="compact-summary journal-summary">
          <button type="button" data-view="cars"><span>Авто</span><strong>${getCars().length}</strong></button>
          <button type="button" data-view="cars"><span>Готовы</span><strong>${readyCars.length}</strong></button>
          <button type="button" data-view="cars"><span>Задачи</span><strong>${taskRows.length}</strong></button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Быстрые действия</h3>
            <p>То, что чаще всего нужно менеджеру в начале работы.</p>
          </div>
        </div>
        <div class="quick-actions">
          <button class="button primary" type="button" data-action="openNewRequest">${iconSvg("plus", "button-icon")}<span>Новая заявка</span></button>
          <button class="button secondary" type="button" data-action="openNewProgram">${iconSvg("calendar", "button-icon")}<span>Новая программа</span></button>
          <button class="button secondary" type="button" data-action="openNewCar">${iconSvg("car", "button-icon")}<span>Добавить авто</span></button>
        </div>
      </section>
    </div>
  `;
}

function renderPhonePreview() {
  return `
    <section class="phone-preview" aria-label="Пример формы в MAX">
      <div class="phone-top">
        <span>MAX mini app</span>
        <span>travelops.ru</span>
      </div>
      <div class="phone-screen">
        <h4>Форма путешественника</h4>
        <p>Клиент выбирает тур, даты, рейс и трансфер. Система сразу раскладывает это по задачам.</p>
        <div class="mini-field"><span>Имя</span><div>Артем Сергеевич</div></div>
        <div class="mini-field"><span>Программа</span><div>Южно-Сахалинск + Буссе</div></div>
        <div class="mini-field"><span>Даты</span><div>30 июня - 3 июля</div></div>
        <div class="mini-field"><span>Рейс</span><div>SU-1744 · прилет 09:15</div></div>
        <div class="mini-field"><span>Автоматизация</span><div>Трансфер, документы, предоплата</div></div>
        <button class="button primary" type="button" data-action="createClientScenario">Отправить заявку</button>
      </div>
    </section>
  `;
}

function renderTransportBoard() {
  const tab = getTransportTab(ui.transportMode);
  const routes = transportBoard.routes || [];
  const hasHiddenRoutes = routes.length > TRANSPORT_VISIBLE_LIMIT;
  const visibleRoutes = ui.transportExpanded ? routes : routes.slice(0, TRANSPORT_VISIBLE_LIMIT);
  const isConnector = transportBoard.kind === "connector";
  const isLiveSchedule = routes.length > 0 && !transportBoard.error && !isConnector;
  const sourceLabel = transportBoard.source || tab.source;
  const statusLabel = transportBoard.loading
    ? "обновляю"
    : transportBoard.error
      ? "нужен источник"
      : isConnector
        ? "источник"
        : isLiveSchedule
        ? transportBoard.updatedAt
        : "нет данных";
  const isCityMode = ui.transportMode === "city";

  return `
    <div class="section-heading transport-heading">
      <div>
        <span class="eyebrow">Логистика</span>
        <h3>Транспорт</h3>
      </div>
      <div class="board-toolbar">
        <button class="transport-status-pill ${transportBoard.error ? "has-error" : isLiveSchedule ? "is-live" : ""}" type="button" data-action="openTransportInfo" title="${escapeHtml(sourceLabel)} · ${escapeHtml(statusLabel)}">
          <span class="status-dot ${transportBoard.error ? "is-error" : isLiveSchedule ? "is-live" : ""}"></span>
          <span>${escapeHtml(statusLabel)}</span>
        </button>
        <button class="button secondary" type="button" data-view="arrivals">${iconSvg("plane-arrive", "button-icon")}<span>Прилёты</span></button>
        <button class="button secondary" type="button" data-view="cars">${iconSvg("car", "button-icon")}<span>Автомобили</span></button>
      </div>
    </div>

    <section class="panel transport-panel compact-transport-panel">
      <div class="transport-tabs" role="group" aria-label="Тип транспорта">
        ${TRANSPORT_TABS.map((item) => `
          <button class="${item.id === ui.transportMode ? "active" : ""}" type="button" data-action="setTransportMode" data-mode="${escapeHtml(item.id)}">
            <span>${escapeHtml(item.short)}</span>
          </button>
        `).join("")}
      </div>
      <div class="transport-search-grid ${ui.transportMode === "air" ? "is-air" : ""}">
        ${ui.transportMode === "air" ? "" : `
          <label class="field">
            <span>Откуда</span>
            <input value="${escapeHtml(ui.transportFrom)}" placeholder="${escapeHtml(getTransportPlaceholder("from"))}" data-transport-field="from" />
          </label>
          <label class="field">
            <span>Куда</span>
            <input value="${escapeHtml(ui.transportTo)}" placeholder="${escapeHtml(getTransportPlaceholder("to"))}" data-transport-field="to" />
          </label>
        `}
        <label class="field">
          <span>Дата</span>
          <input type="date" value="${escapeHtml(ui.transportDate)}" data-transport-field="date" />
        </label>
        <button class="button primary" type="button" data-action="searchTransport" ${transportBoard.loading ? "disabled" : ""}>${transportBoard.loading ? "Ищу..." : ui.transportMode === "air" ? "Обновить" : "Найти"}</button>
      </div>
      ${transportBoard.error ? `<button class="transport-inline-alert" type="button" data-action="openTransportInfo">${escapeHtml(getTransportErrorMessage())}</button>` : ""}
    </section>

    <div class="transport-grid">
      <section class="panel transport-results-panel">
        <div class="panel-header">
          <div>
            <h3>${isConnector ? "Источник" : isCityMode ? "Маршрут" : "Расписание"}</h3>
            <p>${routes.length ? `${visibleRoutes.length} из ${routes.length} ${isConnector ? "источник" : isCityMode ? "маршрут" : "рейсов"} · ${escapeHtml(tab.short)} · ${isConnector ? "подключение" : "live"}${transportBoard.fallbackDate ? ` · ближайшие с ${escapeHtml(formatTransportDateLabel(transportBoard.fallbackDate))}` : ""}` : getTransportEmptyHint()}</p>
          </div>
        </div>
        <div class="transport-route-list">
          ${routes.length ? visibleRoutes.map(renderTransportRouteCard).join("") : renderTransportEmptyState()}
        </div>
        ${hasHiddenRoutes ? `
          <div class="transport-list-footer">
            <button class="button secondary" type="button" data-action="toggleTransportRoutes">
              ${ui.transportExpanded ? "Свернуть" : `Показать еще ${routes.length - TRANSPORT_VISIBLE_LIMIT}`}
            </button>
          </div>
        ` : ""}
      </section>
    </div>
  `;
}

function renderTransportIntegrationNote() {
  if (ui.transportMode === "city") {
    return `
      <div class="transport-setup">
        <strong>Городской транспорт</strong>
        <span>Бесплатный слой: OpenStreetMap/OSRM. Для точности используем известные точки CRM или координаты.</span>
      </div>
    `;
  }
  if (ui.transportMode === "sea") {
    return `
      <div class="transport-setup">
        <strong>Море по Приморью</strong>
        <span>Источник - официальная страница pereprava.su. Менеджер видит расписание и отдельно подтверждает актуальность.</span>
      </div>
    `;
  }
  return `
    <div class="transport-setup">
      <strong>Подключение</strong>
      <span>Для этого транспорта нужен официальный фид перевозчика или проверенный импорт расписания администратором.</span>
    </div>
  `;
}

function renderTransportRouteCard(route) {
  return `
    <button class="transport-route-card" type="button" data-action="openTransportRoute" data-transport-id="${escapeHtml(route.id)}">
      <span class="transport-time">
        <strong>${escapeHtml(route.departure)}</strong>
        <small>${escapeHtml(route.arrival)}</small>
      </span>
      <span class="transport-main">
        <strong>${escapeHtml(route.title)}</strong>
        <small>${escapeHtml(route.from)} → ${escapeHtml(route.to)} · ${escapeHtml(route.duration)}</small>
      </span>
      <span class="badge ${route.tone}">${escapeHtml(route.status)}</span>
    </button>
  `;
}

function renderTransportEmptyState() {
  if (transportBoard.loading) return `<div class="empty-state compact-empty">Ищу рейсы...</div>`;
  return `<div class="empty-state compact-empty">${escapeHtml(getTransportEmptyMessage())}</div>`;
}

function getTransportErrorMessage() {
  if (!transportBoard.error) return "";
  if (transportBoard.setupRequired) return transportBoard.error || "Нужен официальный источник";
  return transportBoard.error;
}

function getTransportEmptyHint() {
  if (transportBoard.error) return getTransportErrorMessage();
  if (ui.transportMode === "air") return "Обновите онлайн-рейсы аэропорта.";
  if (ui.transportMode === "city") return "Укажите известные точки: аэропорт, вокзал, морвокзал, центр.";
  if (ui.transportMode === "sea") return "Морское расписание берется с официальной страницы переправы.";
  return "Нужен официальный фид или проверенный импорт расписания.";
}

function getTransportEmptyMessage() {
  if (transportBoard.error) return getTransportErrorMessage();
  if (ui.transportMode === "air") return "Рейсы аэропорта пока не загружены.";
  if (ui.transportMode === "city") return "Городской маршрут строится через OpenStreetMap/OSRM. Live-движение транспорта нужен отдельный официальный фид.";
  if (ui.transportMode === "sea") return "Морское расписание появится после ответа официальной страницы.";
  return "Для этого раздела нужен официальный источник или ручной импорт.";
}

function getTransportPlaceholder(field) {
  const placeholders = {
    city: { from: "Ж/д вокзал Владивосток", to: "Морвокзал / аэропорт" },
    sea: { from: "Морвокзал", to: "Попова / Рейнеке" },
    bus: { from: "Владивосток", to: "Находка / Уссурийск" },
    rail: { from: "Владивосток", to: "Уссурийск / Находка" },
    suburban: { from: "Владивосток", to: "Аэропорт / Артем" },
  };
  return placeholders[ui.transportMode]?.[field] || "город / станция";
}

function openTransportInfoModal() {
  const tab = getTransportTab();
  const displayRoutes = transportBoard.routes || [];
  const sourceLabel = transportBoard.source || tab.source;
  const status = transportBoard.error || (displayRoutes.length ? `Обновлено ${transportBoard.updatedAt}` : "Live-данные еще не загружены");
  const modeDescription = getTransportModeDescription(ui.transportMode);
  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="transportInfoTitle">
      <div class="modal-card metric-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Источник транспорта</span>
            <h3 id="transportInfoTitle">${escapeHtml(tab.label)}</h3>
            <p class="muted">${escapeHtml(status)}</p>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>
        <section class="detail-section">
          <div class="detail-grid">
            <div class="info-tile"><span>Источник</span><strong>${escapeHtml(sourceLabel)}</strong></div>
            <div class="info-tile"><span>Дата</span><strong>${escapeHtml(formatTransportDateLabel(ui.transportDate))}</strong></div>
            <div class="info-tile"><span>Рейсов</span><strong>${displayRoutes.length}</strong></div>
            <div class="info-tile"><span>Тип</span><strong>${escapeHtml(tab.short)}</strong></div>
          </div>
        </section>
        <section class="detail-section">
          <strong>Как работает</strong>
          <p class="muted">${escapeHtml(modeDescription)}</p>
          <p class="muted">CRM не подставляет фиктивные рейсы: если источник недоступен или не настроен, менеджер видит честный статус подключения.</p>
        </section>
      </div>
    </div>
  `;
}

function getTransportModeDescription(mode) {
  if (mode === "air") {
    return "Авиа получает рейсы через онлайн-табло Международного аэропорта Владивосток.";
  }
  if (mode === "city") {
    return "Город работает как расчет маршрута через OpenStreetMap/OSRM по известным точкам CRM или координатам. Это не live-движение общественного транспорта.";
  }
  if (mode === "sea") {
    return "Морские рейсы берутся с официальной страницы pereprava.su. Так как расписание сезонное и зависит от погоды, перед отправкой туристу нужна отметка администратора.";
  }
  if (mode === "bus") {
    return "Автобусы подключаем через партнерский доступ Примвокзал/e-traffic или отдельный парсер официального расписания.";
  }
  if (mode === "rail" || mode === "suburban") {
    return "Ж/д и электрички подключаем через официальный фид РЖД/Экспресс Приморья или проверенный импорт расписания администратором.";
  }
  return "Для этого транспорта используется официальный источник или админский импорт.";
}

function getTransportTab(mode = ui.transportMode) {
  return TRANSPORT_TABS.find((tab) => tab.id === mode) || TRANSPORT_TABS[0];
}

function applyTransportDefaults(mode = ui.transportMode) {
  const defaults = TRANSPORT_DEFAULTS[mode] || TRANSPORT_DEFAULTS.air;
  ui.transportFrom = defaults.from;
  ui.transportTo = defaults.to;
}

function setTransportMode(mode) {
  ui.transportMode = TRANSPORT_TABS.some((tab) => tab.id === mode) ? mode : "air";
  applyTransportDefaults(ui.transportMode);
  ui.transportExpanded = false;
  transportBoard = {
    loading: false,
    kind: "",
    source: "",
    updatedAt: "",
    routes: [],
    fallbackDate: "",
    error: "",
    setupRequired: false,
  };
  render();
  loadTransportBoard();
}

function toggleTransportRoutes() {
  ui.transportExpanded = !ui.transportExpanded;
  render();
}

function updateTransportSetting(field, value, options = {}) {
  const nextValue = String(value || "").trim();
  if (field === "from") ui.transportFrom = nextValue;
  if (field === "to") ui.transportTo = nextValue;
  if (field === "date") ui.transportDate = nextValue;
  if (!options.silent) {
    render();
    if (ui.view === "transport" && (ui.transportMode === "air" || (ui.transportFrom && ui.transportTo))) {
      loadTransportBoard();
    }
  }
}

async function loadTransportBoard() {
  ui.transportExpanded = false;
  transportBoard = { ...transportBoard, loading: true, error: "", setupRequired: false };
  render();

  const params = new URLSearchParams({
    mode: ui.transportMode,
    from: ui.transportFrom,
    to: ui.transportTo,
    date: ui.transportDate,
  });

  try {
    const response = await fetch(`${TRANSPORT_API_URL}?${params.toString()}`, {
      cache: "no-store",
      credentials: "same-origin",
      headers: getSameOriginAuthHeaders(),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      transportBoard = {
        loading: false,
        kind: payload.kind || "",
        source: payload.source || "",
        updatedAt: "",
        routes: [],
        error: payload.error || "Не удалось получить расписание транспорта",
        setupRequired: Boolean(payload.setupRequired),
      };
      render();
      return;
    }

    transportBoard = {
      loading: false,
      kind: payload.kind || "",
      source: payload.source || getTransportTab().source || "API",
      updatedAt: formatTransportTime(new Date(payload.requestedAt || Date.now())),
      routes: normalizeTransportSegments(payload.data || [], payload.kind),
      fallbackDate: payload.fallbackDate || "",
      error: "",
      setupRequired: false,
    };
  } catch (error) {
    transportBoard = {
      loading: false,
      kind: "",
      source: "",
      updatedAt: "",
      routes: [],
      error: error.message || "Ошибка подключения к транспортному API",
      setupRequired: false,
    };
  }

  render();
}

function normalizeTransportSegments(segments, kind = "schedule") {
  return segments.map((segment, index) => {
    if (kind === "airport" || kind === "route" || (segment.source && segment.title && !segment.thread)) {
      return {
        id: segment.id || `transport-${ui.transportMode}-${index}`,
        title: segment.title || "Маршрут",
        from: segment.from || ui.transportFrom || "Откуда",
        to: segment.to || ui.transportTo || "Куда",
        departure: segment.departure || "время уточнить",
        arrival: segment.arrival || "",
        date: segment.date || formatTransportDateLabel(ui.transportDate),
        duration: segment.duration || "",
        operator: segment.operator || "перевозчик не указан",
        source: segment.source || getTransportTab().source,
        status: segment.status || "live",
        tone: segment.tone || "teal",
        note: segment.note || "",
        raw: segment.raw || segment,
      };
    }

    const departureDate = parseTransportDate(segment.departure);
    const arrivalDate = parseTransportDate(segment.arrival);
    const thread = segment.thread || {};
    const carrier = thread.carrier || segment.carrier || {};
    const from = segment.from || {};
    const to = segment.to || {};
    const number = thread.number || segment.number || "";
    const title = thread.title || thread.short_title || segment.title || `${from.title || "Откуда"} - ${to.title || "Куда"}`;
    const hasTransfers = Boolean(segment.has_transfers || segment.transfers?.length);

    return {
      id: `transport-${ui.transportMode}-${index}-${slugify(`${number}-${title}`).slice(0, 32)}`,
      title,
      from: from.title || ui.transportFrom || "Откуда",
      to: to.title || ui.transportTo || "Куда",
      departure: departureDate ? formatTransportTime(departureDate) : "время уточнить",
      arrival: arrivalDate ? formatTransportTime(arrivalDate) : "время уточнить",
      date: departureDate ? formatTransportDateLabel(departureDate) : formatTransportDateLabel(ui.transportDate),
      duration: formatDuration(segment.duration),
      operator: carrier.title || thread.carrier?.title || "перевозчик не указан",
      source: getTransportTab().source,
      status: hasTransfers ? "с пересадкой" : "по расписанию",
      tone: hasTransfers ? "amber" : "teal",
      note: segment.days || segment.except_days || "",
      stops: Array.isArray(segment.stops) ? segment.stops : [],
      raw: segment,
    };
  });
}

function parseTransportDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatTransportTime(date) {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return "время уточнить";
  return value.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: state.settings?.timezone || "Asia/Vladivostok",
  });
}

function formatDuration(seconds) {
  const value = Number(seconds || 0);
  if (!value) return "длительность уточнить";
  const minutes = Math.round(value / 60);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} мин`;
  return `${hours} ч ${rest ? `${rest} мин` : ""}`.trim();
}

function formatTransportDateLabel(value) {
  const date = value instanceof Date ? value : parseTransportDate(value);
  if (!date) return "дата не выбрана";
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: state.settings?.timezone || "Asia/Vladivostok",
  });
}

function findTransportRoute(routeId) {
  return (transportBoard.routes || []).find((route) => route.id === routeId);
}

function openTransportRouteModal(routeId) {
  const route = findTransportRoute(routeId);
  if (!route) {
    toast("Маршрут не найден в текущем поиске.");
    return;
  }
  const tab = getTransportTab();
  const seaHint = ui.transportMode === "sea"
    ? `<p class="muted">Для морских рейсов Приморья источник нужно подтверждать отдельно: расписание сезонное и зависит от погоды.</p>`
    : "";

  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="transportRouteTitle">
      <div class="modal-card metric-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">${escapeHtml(tab.label)} · ${escapeHtml(route.source)}</span>
            <h3 id="transportRouteTitle">${escapeHtml(route.title)}</h3>
            <p class="muted">${escapeHtml(route.from)} → ${escapeHtml(route.to)}</p>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>

        <section class="detail-section">
          <div class="detail-grid">
            <div class="info-tile"><span>Дата</span><strong>${escapeHtml(route.date)}</strong></div>
            <div class="info-tile"><span>Отправление</span><strong>${escapeHtml(route.departure)}</strong></div>
            <div class="info-tile"><span>Прибытие</span><strong>${escapeHtml(route.arrival)}</strong></div>
            <div class="info-tile"><span>В пути</span><strong>${escapeHtml(route.duration)}</strong></div>
            <div class="info-tile"><span>Перевозчик</span><strong>${escapeHtml(route.operator)}</strong></div>
            <div class="info-tile"><span>Статус</span><strong>${escapeHtml(route.status)}</strong></div>
          </div>
        </section>

        ${route.note ? `<section class="detail-section"><strong>Комментарий источника</strong><p class="muted">${escapeHtml(route.note)}</p></section>` : ""}
        ${seaHint}

        <section class="detail-section">
          <strong>Действия</strong>
          <div class="template-actions">
            <button class="button secondary" type="button" data-action="addTransportToProgram" data-transport-id="${escapeHtml(route.id)}">${iconSvg("calendar", "button-icon")}<span>В программу</span></button>
            <button class="button primary" type="button" data-action="createTransportTransfer" data-transport-id="${escapeHtml(route.id)}">${iconSvg("car", "button-icon")}<span>Задача трансфера</span></button>
          </div>
        </section>
      </div>
    </div>
  `;
}

function addTransportToProgram(routeId) {
  const route = findTransportRoute(routeId);
  if (!route) {
    toast("Маршрут не найден.");
    return;
  }
  addActivity(`Маршрут добавлен в подбор программы: ${route.title}`, { targetType: "transport", targetId: route.id, targetView: "transport" });
  persist();
  toast("Маршрут помечен для добавления в программу.");
}

function createTransportTransfer(routeId) {
  const route = findTransportRoute(routeId);
  if (!route) {
    toast("Маршрут не найден.");
    return;
  }
  const task = {
    id: `TT-${Date.now()}`,
    logisticsId: route.id,
    requestId: "",
    client: "Клиент не выбран",
    pax: 1,
    hotel: route.to,
    flightKey: route.id,
    flightNo: route.title,
    city: route.to,
    date: route.date,
    time: route.arrival || route.departure,
    direction: getTransportTab().label,
    status: "Новая задача",
    carId: "",
    createdAt: formatAirportUpdatedAt(new Date()),
  };
  state.transferTasks.unshift(task);
  addActivity(`Создана задача трансфера из транспорта: ${route.title}`, { targetType: "transferTask", targetId: task.id, targetView: "cars" });
  persist();
  render();
  openTransferTaskModal(task.id);
  toast("Задача трансфера создана.");
}

function renderCompactPipeline(requests) {
  const groups = ["new", "work", "offer"].map((statusId) => {
    const status = getStatus(statusId);
    const items = requests.filter((item) => item.status === statusId).slice(0, 4);
    return `
      <div class="pipeline-column">
        <h4>${status.label}<span>${items.length}</span></h4>
        <div class="card-stack">
          ${items.length ? items.map(renderRequestCard).join("") : `<div class="empty-state">Пока пусто</div>`}
        </div>
      </div>
    `;
  });
  return `<div class="pipeline">${groups.join("")}</div>`;
}

function renderRequests() {
  const requests = filteredRequests();
  return `
    <div class="section-heading">
      <div>
        <span class="eyebrow">CRM доска</span>
        <h3>Заявки и статусы</h3>
        <p>Можно переключать вид, открывать карточки и менять этап работы.</p>
      </div>
      <div class="board-toolbar">
        <div class="segmented" role="group" aria-label="Вид заявок">
          <button class="${ui.boardMode === "board" ? "active" : ""}" type="button" data-action="setBoardMode" data-mode="board">Доска</button>
          <button class="${ui.boardMode === "list" ? "active" : ""}" type="button" data-action="setBoardMode" data-mode="list">Список</button>
        </div>
        <button class="button primary" type="button" data-action="openNewRequest">Новая заявка</button>
      </div>
    </div>
    ${ui.boardMode === "board" ? renderBoard(requests) : renderRequestTable(requests)}
  `;
}

function renderBoard(requests) {
  return `
    <div class="board">
      ${STATUS.map((status) => {
        const items = requests.filter((request) => request.status === status.id);
        return `
          <div class="board-column">
            <h4>${status.label}<span>${items.length}</span></h4>
            <div class="card-stack">
              ${items.length ? items.map(renderRequestCard).join("") : `<div class="empty-state">Нет заявок</div>`}
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderRequestTable(requests) {
  if (!requests.length) return `<div class="empty-state">Поиск ничего не нашел</div>`;
  return `
    <table class="request-table">
      <thead>
        <tr>
          <th>Клиент</th>
          <th>Программа</th>
          <th>Проживание</th>
          <th>Статус</th>
          <th>Операции</th>
          <th>Ответственный</th>
          <th>Следующий шаг</th>
        </tr>
      </thead>
      <tbody>
        ${requests.map((item) => `
          <tr>
            <td><button type="button" data-action="openRequest" data-id="${item.id}">${escapeHtml(item.name)}</button><br><span class="muted">${escapeHtml(item.phone)}</span></td>
            <td>${escapeHtml(getRequestProgramTitle(item))}<br><span class="muted">${escapeHtml(item.dates)} · ${item.pax} чел.</span></td>
            <td>${escapeHtml(item.hotel || "Уточнить")}</td>
            <td>${renderStatusBadge(item.status)}</td>
            <td><span class="badge ${getPaymentTone(item.paymentStatus)}">${escapeHtml(item.paymentStatus)}</span><br><span class="badge ${getDocumentTone(item.documentStatus)}">${escapeHtml(item.documentStatus)}</span></td>
            <td>${escapeHtml(item.manager)}</td>
            <td>${escapeHtml(item.nextStep)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderRequestCard(item) {
  return `
    <button class="request-card" type="button" data-action="openRequest" data-id="${item.id}">
      <strong>${escapeHtml(item.name)}</strong>
      <p>${escapeHtml(getRequestProgramTitle(item))} · ${escapeHtml(item.dates)}</p>
      <p>${escapeHtml(item.hotel || "Проживание уточнить")}</p>
      <div class="card-meta">
        ${renderStatusBadge(item.status)}
        <span class="badge ${item.priority === "Высокий" ? "rose" : "amber"}">${escapeHtml(item.priority)}</span>
        <span class="badge ${getPaymentTone(item.paymentStatus)}">${escapeHtml(item.paymentStatus)}</span>
        <span class="badge ${getDocumentTone(item.documentStatus)}">${escapeHtml(item.documentStatus)}</span>
        <span class="badge">${item.pax} чел.</span>
      </div>
      ${renderReadinessBar(item)}
      <p>${escapeHtml(item.nextStep)}</p>
    </button>
  `;
}

function renderClients() {
  const requests = filteredRequests();
  return `
    <div class="section-heading">
      <div>
        <span class="eyebrow">Клиентская база</span>
        <h3>Клиенты из заявок</h3>
        <p>Клиент создается автоматически из заявки в MAX или вручную менеджером.</p>
      </div>
    </div>
    <div class="simple-list">
      ${requests.map((item) => `
        <button class="client-row" type="button" data-action="openRequest" data-id="${item.id}">
          <strong>${escapeHtml(item.name)}</strong>
          <p>${escapeHtml(item.phone)} · ${escapeHtml(getRequestProgramTitle(item))}</p>
          <p>${escapeHtml(item.hotel || "Проживание уточнить")}</p>
          <div class="row-meta">
            ${renderStatusBadge(item.status)}
            <span class="badge navy">${escapeHtml(item.source)}</span>
            <span class="badge">${escapeHtml(item.manager)}</span>
            <span class="badge ${getPaymentTone(item.paymentStatus)}">${escapeHtml(item.paymentStatus)}</span>
            <span class="badge ${getDocumentTone(item.documentStatus)}">${escapeHtml(item.documentStatus)}</span>
          </div>
        </button>
      `).join("") || `<div class="empty-state">Клиенты не найдены</div>`}
    </div>
  `;
}

function renderProgram() {
  const programs = filteredPrograms();
  return `
    <div class="section-heading">
      <div>
        <span class="eyebrow">Справочник</span>
        <h3>Программы и туры</h3>
        <p>Готовые туры, которые менеджер выбирает в заявке и отправляет клиенту как предложение.</p>
      </div>
      <button class="button primary" type="button" data-action="openNewProgram">${iconSvg("plus", "button-icon")}<span>Новая программа</span></button>
    </div>
    <div class="program-grid">
      ${programs.map((program) => {
        const cover = getProgramCover(program);
        return `
        <article class="program-row program-card" role="button" tabindex="0" data-action="openProgramPreview" data-program-id="${escapeHtml(program.id)}">
          <div class="program-thumb ${cover ? "" : "is-empty"}" ${cover ? `style="background-image:url('${escapeHtml(cover)}')"` : ""}>
            ${cover ? "" : iconSvg("calendar", "program-thumb-icon")}
          </div>
          <div class="program-card-main">
            <div class="program-card-top">
              <strong>${escapeHtml(program.title)}</strong>
              <div class="row-meta">
                <span class="badge teal">${escapeHtml(program.status)}</span>
                <span class="badge">${escapeHtml(program.price)}</span>
                <span class="badge navy">${programMaterialCount(program)} материалов</span>
              </div>
            </div>
            <p>${escapeHtml(program.summary)}</p>
            <p>${escapeHtml(program.dates)} · ${escapeHtml(program.duration)} · ${escapeHtml(program.hotel)}</p>
            <div class="program-actions">
              <span class="program-open-hint">Открыть карточку</span>
              <button class="icon-button" type="button" aria-label="Редактировать программу" title="Редактировать" data-action="openProgramEdit" data-program-id="${escapeHtml(program.id)}">${iconSvg("edit", "button-icon")}</button>
            </div>
          </div>
        </article>
      `;
      }).join("") || `<div class="empty-state">Поиск ничего не нашел</div>`}
    </div>
  `;
}

function renderTransfers() {
  ensureStateShape();
  const transfers = [
    ["Анна Смирнова", "Аэропорт - отель", "12 июля, 09:20", "Нужна машина"],
    ["Ольга Белова", "Группа 16 чел.", "5 сентября, 14:00", "Автобус подтвержден"],
    ["Денис Ковалев", "Водитель на выходные", "19 июля, 11:30", "Ждет предоплату"],
  ];
  return `
    <div class="section-heading">
      <div>
        <span class="eyebrow">Логистика</span>
        <h3>Трансферы</h3>
        <p>Простой список задач, который позже можно расширить до доски автомобилей и водителей.</p>
      </div>
    </div>
    <div class="simple-list">
      ${state.transferTasks.map((task) => `
        <div class="transfer-row">
          <strong>${escapeHtml(task.flightNo)} · ${escapeHtml(task.city)}</strong>
          <p>${escapeHtml(task.direction)} · ${escapeHtml(task.date)} · ${escapeHtml(task.time)}</p>
          <div class="row-meta">
            <span class="badge navy">${escapeHtml(task.status)}</span>
            <span class="badge">${escapeHtml(task.createdAt)}</span>
          </div>
        </div>
      `).join("")}
      ${transfers.map(([client, route, time, status]) => `
        <div class="transfer-row">
          <strong>${client}</strong>
          <p>${route} · ${time}</p>
          <div class="row-meta">
            <span class="badge amber">${status}</span>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderCarsBoard() {
  ensureStateShape();
  const cars = getCars();
  const readyCars = getReadyCars();
  const taskRows = getTransferTaskRows();
  const assignedTasks = taskRows.filter((task) => task.carId);
  const busyCars = readyCars.filter((car) => assignedTasks.some((task) => task.carId === car.id)).length;
  const seatsUsed = assignedTasks.reduce((sum, task) => sum + Number(task.pax || 0), 0);
  const seatsTotal = readyCars.reduce((sum, car) => sum + Number(car.capacity || 0), 0);
  const incompleteCount = cars.length - readyCars.length;

  return `
    <div class="section-heading">
      <div>
        <span class="eyebrow">Логистика</span>
        <h3>Автомобили</h3>
        <p>Автопарк, загрузка мест и задачи трансфера без лишних деталей на первом экране.</p>
      </div>
      <div class="board-toolbar">
        <button class="button secondary" type="button" data-view="arrivals">${iconSvg("plane-arrive", "button-icon")}<span>Прилёты</span></button>
        <button class="button secondary" type="button" data-view="departures">${iconSvg("plane-depart", "button-icon")}<span>Вылеты</span></button>
        <button class="button primary" type="button" data-action="openNewCar">${iconSvg("plus", "button-icon")}<span>Добавить авто</span></button>
      </div>
    </div>

    <div class="compact-summary" aria-label="Сводка автомобилей">
      <button type="button" data-action="showCarsMetric" data-metric="all"><span>Авто</span><strong>${cars.length}</strong></button>
      <button type="button" data-action="showCarsMetric" data-metric="ready"><span>Готовы</span><strong>${readyCars.length}</strong>${incompleteCount ? `<em>${incompleteCount} заполнить</em>` : ""}</button>
      <button type="button" data-action="showCarsMetric" data-metric="line"><span>На линии</span><strong>${busyCars}</strong></button>
      <button type="button" data-action="showCarsMetric" data-metric="seats"><span>Места</span><strong>${seatsUsed}/${seatsTotal || 0}</strong></button>
      <button type="button" data-action="showCarsMetric" data-metric="tasks"><span>Задачи</span><strong>${taskRows.length}</strong></button>
    </div>

    <div class="work-grid cars-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Автопарк</h3>
            <p>Карточка машины открывает загрузку, водителя и ближайшие рейсы.</p>
          </div>
        </div>
        <div class="car-grid">
          ${cars.map((car) => {
            const carItems = taskRows.filter((task) => task.carId === car.id);
            const used = carItems.reduce((sum, item) => sum + item.pax, 0);
            const complete = isCarComplete(car);
            return `
              <button class="vehicle-card" type="button" data-action="openCar" data-car-id="${escapeHtml(car.id)}">
                ${extractMaterialUrl(car.photo) ? `<span class="vehicle-thumb"><img src="${escapeHtml(extractMaterialUrl(car.photo))}" alt="" loading="lazy"></span>` : ""}
                <span class="vehicle-card-top">
                  <strong class="icon-line">${iconSvg("car")}${escapeHtml(car.driver || "Водитель не указан")}</strong>
                  <em class="badge ${complete ? (used ? "teal" : "navy") : "rose"}">${complete ? escapeHtml(car.status || "Готова") : "Заполнить"}</em>
                </span>
                <span>${escapeHtml(getCarTitle(car))} · ${escapeHtml(car.plate)}</span>
                <small>${complete ? `занято ${used} из ${car.capacity}` : "не используется в логистике"} · ${formatCarAc(car)}</small>
                <small>${escapeHtml(car.phone || "телефон не указан")} · ${carItems.length || "нет"} задач</small>
              </button>
            `;
          }).join("")}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Ближайшие задачи</h3>
            <p>Короткий список, подробности открываются из рейса или машины.</p>
          </div>
        </div>
        <div class="simple-list">
          ${taskRows.slice(0, 6).map((task) => `
            <button class="transfer-row active-row" type="button" data-action="openTransferTask" data-task-id="${escapeHtml(task.id)}">
              <strong>${escapeHtml(task.title)}</strong>
              <p>${escapeHtml(task.meta)}</p>
              <div class="row-meta">
                <span class="badge ${task.tone}">${escapeHtml(task.status)}</span>
                <span class="badge">${escapeHtml(task.carLabel || "машина не назначена")}</span>
              </div>
            </button>
          `).join("") || `<div class="empty-state compact-empty">Задачи трансфера появятся здесь после создания из прилётов или вылетов</div>`}
        </div>
      </section>
    </div>
  `;
}

function showCarsMetric(metric = "all") {
  ensureStateShape();
  const cars = getCars();
  const readyCars = getReadyCars();
  const tasks = getTransferTaskRows();
  const assignedTasks = tasks.filter((task) => task.carId);
  const busyCarIds = new Set(assignedTasks.map((task) => task.carId));
  const titleMap = {
    all: ["Автопарк", "Все машины, которые заведены в автопарке."],
    ready: ["Готовые к работе", "Заполненные карточки доступны для назначения на трансфер."],
    line: ["На линии", "Машины, у которых сейчас есть назначенные задачи."],
    seats: ["Загрузка мест", "Сколько мест занято по текущим задачам трансфера."],
    tasks: ["Задачи трансфера", "Все ближайшие задачи, которые нужно назначить или проверить."],
  };
  const [title, subtitle] = titleMap[metric] || titleMap.all;

  let content = "";
  if (metric === "tasks") {
    content = tasks.map((task) => `
      <button class="metric-detail-row" type="button" data-action="openTransferTask" data-task-id="${escapeHtml(task.id)}">
        <span><strong>${escapeHtml(task.title)}</strong></span>
        <small>${escapeHtml(task.meta)} · ${escapeHtml(task.carLabel || "машина не назначена")}</small>
        <em class="badge ${task.tone}">${escapeHtml(task.status)}</em>
      </button>
    `).join("");
  } else {
    const sourceCars = metric === "ready"
      ? readyCars
      : metric === "line"
        ? readyCars.filter((car) => busyCarIds.has(car.id))
        : metric === "seats"
          ? readyCars
          : cars;
    content = sourceCars.map((car) => {
      const complete = isCarComplete(car);
      const carTasks = tasks.filter((task) => task.carId === car.id);
      const used = carTasks.reduce((sum, task) => sum + Number(task.pax || 0), 0);
      const action = complete ? "openCar" : "openCarEdit";
      const badgeTone = complete ? (used ? "teal" : "navy") : "rose";
      const badgeText = complete
        ? metric === "seats"
          ? `${Math.max(Number(car.capacity || 0) - used, 0)} свободно`
          : car.status || "Готова"
        : "Заполнить";
      return `
        <button class="metric-detail-row" type="button" data-action="${action}" data-car-id="${escapeHtml(car.id)}">
          <span><strong>${escapeHtml(car.driver || "Водитель не указан")}</strong> · ${escapeHtml(getCarTitle(car))}</span>
          <small>${escapeHtml(car.plate || "номер не указан")} · занято ${used} из ${Number(car.capacity || 0)} · ${escapeHtml(formatCarAc(car))} · ${carTasks.length || "нет"} задач</small>
          <em class="badge ${badgeTone}">${escapeHtml(badgeText)}</em>
        </button>
      `;
    }).join("");
  }

  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="carsMetricTitle">
      <div class="modal-card metric-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Автомобили</span>
            <h3 id="carsMetricTitle">${escapeHtml(title)}</h3>
            <p class="muted">${escapeHtml(subtitle)}</p>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>
        <div class="metric-detail-list">
          ${content || `<div class="empty-state compact-empty">Нет данных для этого среза</div>`}
        </div>
        <div class="template-actions">
          <button class="button primary" type="button" data-action="openNewCar">${iconSvg("plus", "button-icon")}<span>Добавить авто</span></button>
        </div>
      </div>
    </div>
  `;
}

function getTransferTaskRows() {
  return state.transferTasks.map(normalizeTransferTask);
}

function renderAirportBoard() {
  const isDepartures = ui.airportMode === "departures";
  const flights = filteredAirportFlights();
  const delayedCount = flights.filter((flight) => flight.statusTone === "amber" || flight.statusTone === "rose").length;
  const activeCount = flights.filter((flight) => ["registration", "boarding", "expected"].includes(flight.statusKind)).length;
  const directionLabel = isDepartures ? "Вылеты" : "Прилёты";

  return `
    <div class="section-heading">
      <div>
        <span class="eyebrow">Международный аэропорт Владивосток</span>
        <h3>${directionLabel} VVO</h3>
        <p>Источник: ${airportBoard.source === "live" ? "aerovlad.ru API" : "резервный слой"} · обновлено: ${escapeHtml(airportBoard.updatedAt)}</p>
      </div>
      <div class="board-toolbar">
        <div class="segmented" role="group" aria-label="Направление рейсов">
          <button class="${isDepartures ? "active" : ""}" type="button" data-action="setAirportMode" data-mode="departures">Вылеты</button>
          <button class="${!isDepartures ? "active" : ""}" type="button" data-action="setAirportMode" data-mode="arrivals">Прилёты</button>
        </div>
        <button class="button primary" type="button" data-action="refreshAirportBoard">Обновить с aerovlad.ru</button>
      </div>
    </div>

    <div class="metric-strip">
      <div class="metric" data-tone="teal"><span>Рейсов в списке</span><strong>${flights.length}</strong></div>
      <div class="metric" data-tone="amber"><span>С изменением времени</span><strong>${delayedCount}</strong></div>
      <div class="metric" data-tone="violet"><span>Активные сейчас</span><strong>${activeCount}</strong></div>
      <div class="metric" data-tone="rose"><span>Трансферов к проверке</span><strong>${Math.min(3, flights.length)}</strong></div>
    </div>

    <div class="work-grid airport-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Онлайн-табло</h3>
            <p>${isDepartures ? "Контроль отправлений для выезда туристов из Владивостока." : "Контроль прилётов для встреч и трансферов."}</p>
          </div>
          <a class="button secondary link-button" href="https://aerovlad.ru/ru/timetable" target="_blank" rel="noreferrer">Открыть сайт аэропорта</a>
        </div>
        ${renderAirportTable(flights, isDepartures)}
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Операции</h3>
            <p>Быстрые задачи для менеджера и логиста.</p>
          </div>
        </div>
        <div class="simple-list">
          ${flights.slice(0, 4).map((flight) => `
            <div class="transfer-row">
              <strong>${escapeHtml(flight.no)} · ${escapeHtml(flight.city)}</strong>
              <p>${isDepartures ? "Выезд в аэропорт" : "Встреча в аэропорту"} · ${escapeHtml(flight.displayTime)}</p>
              <div class="row-meta">
                <span class="badge ${flight.statusTone}">${escapeHtml(flight.status)}</span>
                <button class="chip-button" type="button" data-action="createFlightTransfer" data-flight="${escapeHtml(flight.no)}">Создать задачу</button>
              </div>
            </div>
          `).join("") || `<div class="empty-state">Рейсы не найдены</div>`}
        </div>
      </section>
    </div>
  `;
}

function renderAirportTable(flights, isDepartures) {
  if (!flights.length) return `<div class="empty-state">Рейсы не найдены</div>`;
  return `
    <table class="request-table airport-table">
      <thead>
        <tr>
          <th>Время</th>
          <th>Рейс</th>
          <th>${isDepartures ? "Направление" : "Откуда"}</th>
          <th>Авиакомпания</th>
          <th>Статус</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        ${flights.map((flight) => `
          <tr>
            <td><strong>${escapeHtml(flight.displayTime)}</strong><br><span class="muted">${escapeHtml(flight.timeLabel)}</span></td>
            <td><strong>${escapeHtml(flight.no)}</strong><br><span class="muted">${escapeHtml(flight.codeshare)}</span></td>
            <td>${escapeHtml(flight.city)}<br><span class="muted">${escapeHtml(flight.airport)}</span></td>
            <td>${escapeHtml(flight.airline)}</td>
            <td><span class="badge ${flight.statusTone}">${escapeHtml(flight.status)}</span></td>
            <td><button class="table-action" type="button" data-action="createFlightTransfer" data-flight="${escapeHtml(flight.no)}">Задача трансфера</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderLogisticsFlights() {
  const isDepartures = ui.airportMode === "departures";
  const flights = filteredAirportFlights();
  const items = buildLogisticsItems(flights, isDepartures);
  const unassigned = items.filter((item) => !item.carId && !item.noTransfer);
  const assigned = items.filter((item) => item.carId);
  const noTransfer = items.filter((item) => item.noTransfer);
  const directionLabel = isDepartures ? "Вылеты" : "Прилёты";
  const connection = getAirportConnectionInfo();

  return `
    <div class="section-heading airport-heading">
      <div>
        <span class="eyebrow">Логистика · Международный аэропорт Владивосток</span>
        <div class="heading-inline">
          <h3>${directionLabel} VVO</h3>
          ${renderAirportLiveIndicator(connection, flights.length)}
        </div>
      </div>
      <div class="board-toolbar">
        <button class="icon-button live-refresh-button" type="button" data-action="refreshAirportBoard" aria-label="Обновить табло" title="Обновить табло">${iconSvg("refresh", "button-icon")}</button>
        <button class="button secondary" type="button" data-action="toggleAirportFilters">${iconSvg("filter", "button-icon")}<span>${ui.airportFiltersOpen ? "Скрыть фильтры" : "Фильтры"}</span></button>
      </div>
    </div>

    <section class="panel airport-watchbar logistics-date-panel">
      <div class="airport-date-row">
        ${renderAirportDateChips(items, "guest")}
      </div>
      ${ui.airportFiltersOpen ? renderAirportAdvancedFilters() : ""}
    </section>

    <div class="compact-summary" aria-label="Сводка логистики">
      <button type="button" data-action="showAirportMetric" data-metric="all">
        <span>Гости</span><strong>${items.length}</strong>
      </button>
      <button type="button" data-action="showAirportMetric" data-metric="unassigned">
        <span>Без машины</span><strong>${unassigned.length}</strong>
      </button>
      <button type="button" data-action="showAirportMetric" data-metric="assigned">
        <span>В машинах</span><strong>${assigned.length}</strong>
      </button>
      <button type="button" data-action="showAirportMetric" data-metric="noTransfer">
        <span>${isDepartures ? "Без проводов" : "Без встречи"}</span><strong>${noTransfer.length}</strong>
      </button>
    </div>

    <section class="logistics-board">
      <div class="logistics-lane">
        <div class="lane-title">
          <span>Не распределены</span>
          <strong>${unassigned.length}</strong>
        </div>
        <div class="logistics-stack">
          ${renderGroupedLogisticsItems(unassigned) || `<div class="empty-state compact-empty">Все гости распределены</div>`}
        </div>
      </div>

      <div class="logistics-lane logistics-lane-cars">
        <div class="lane-title">
          <span>Машины</span>
          <strong>${assigned.length}</strong>
        </div>
        <div class="logistics-stack">
          ${getReadyCars().map((car) => {
            const carItems = assigned.filter((item) => item.carId === car.id);
            const used = carItems.reduce((sum, item) => sum + item.pax, 0);
            return `
              <div class="car-bucket drop-zone" data-drop-car-id="${escapeHtml(car.id)}">
                <button class="car-bucket-header" type="button" data-action="openCar" data-car-id="${escapeHtml(car.id)}">
                  <span class="icon-line">${iconSvg("car")}<strong>${escapeHtml(car.driver)}</strong> · ${escapeHtml(getCarTitle(car))}</span>
                  <small>${escapeHtml(car.plate)} · занято ${used} из ${car.capacity} · ${car.hasAc ? "кондиционер" : "без кондиционера"}</small>
                </button>
                <div class="car-bucket-list">
                  ${carItems.map(renderLogisticsFlightCard).join("") || `<div class="mini-empty">Перетащите гостя сюда</div>`}
                </div>
              </div>
            `;
          }).join("") || `<div class="empty-state compact-empty">Заполните автомобили в настройках</div>`}
        </div>
      </div>

      <div class="logistics-lane no-transfer-lane">
        <div class="lane-title">
          <span>${isDepartures ? "Провожать не надо" : "Встречать не надо"}</span>
          <strong>${noTransfer.length}</strong>
        </div>
        <div class="logistics-stack">
          ${noTransfer.map(renderLogisticsFlightCard).join("") || `<div class="empty-state compact-empty">Нет</div>`}
        </div>
      </div>
    </section>
  `;
}

function buildLogisticsItems(flights, isDepartures) {
  ensureStateShape();
  const selectedDate = formatDisplayDate(ui.airportDate);
  return state.requests.map((request) => {
    const requestFlightNo = normalizeFlightNo(request.flightNo);
    const task = findTransferTaskForRequest(request, requestFlightNo);
    const taskFlightNo = normalizeFlightNo(task?.flightNo);
    const flightNo = requestFlightNo || taskFlightNo;
    if (!flightNo) return null;

    const direction = getLogisticsDirection(request, task);
    if (isDepartures && direction !== "departure") return null;
    if (!isDepartures && direction === "departure") return null;

    const displayDate = normalizeLogisticsDisplayDate(request.flightDate || task?.date || request.dates);
    if (displayDate && displayDate !== selectedDate) return null;

    const liveFlight = findMatchingAirportFlight(flights, flightNo, displayDate);
    const watchedFlight = findWatchedFlightForRequest(flightNo, displayDate, direction);
    const id = task?.logisticsId || `request:${request.id}:${flightNo}:${displayDate || selectedDate}`;
    const car = task?.carId ? getReadyCars().find((item) => item.id === task.carId) : null;
    const noTransfer = !task && request.transferNeeded === false;
    const tag = request.priority === "Высокий" ? "VIP" : request.pax > 3 ? "Группа" : "Турист";

    return {
      id,
      requestId: request.id,
      flightKey: liveFlight?.key || task?.flightKey || flightNo,
      flightNo,
      client: request.name,
      tag,
      pax: request.pax,
      city: liveFlight?.city || task?.city || watchedFlight?.city || "Город уточнить",
      hotel: task?.hotel || request.hotel || "Проживание уточнить",
      time: liveFlight?.displayTime || task?.time || request.flightTime || "Время уточнить",
      date: liveFlight?.displayDate || displayDate || selectedDate,
      status: liveFlight?.status || watchedFlight?.status || "Ожидаем",
      statusTone: liveFlight?.statusTone || watchedFlight?.statusTone || "navy",
      taskId: task ? task.id : "",
      taskStatus: task ? task.status : "",
      carId: car ? car.id : "",
      carLabel: car ? `${car.driver} · ${getCarTitle(car)}` : "",
      noTransfer,
      direction: direction === "departure" ? "Выезд в аэропорт" : "Встреча в аэропорту",
    };
  }).filter(Boolean);
}

function findTransferTaskForRequest(request, flightNo = "") {
  const normalizedFlight = normalizeFlightNo(flightNo || request.flightNo);
  return state.transferTasks.find((task) => {
    if (task.requestId !== request.id) return false;
    const taskFlight = normalizeFlightNo(task.flightNo);
    return !normalizedFlight || !taskFlight || taskFlight === normalizedFlight;
  }) || null;
}

function findMatchingAirportFlight(flights = [], flightNo = "", displayDate = "") {
  const normalizedFlight = normalizeFlightNo(flightNo);
  if (!normalizedFlight) return null;
  return flights.find((flight) => {
    if (normalizeFlightNo(flight.no) !== normalizedFlight) return false;
    return !displayDate || !flight.displayDate || flight.displayDate === displayDate;
  }) || null;
}

function findWatchedFlightForRequest(flightNo = "", displayDate = "", direction = "arrival") {
  const normalizedFlight = normalizeFlightNo(flightNo);
  if (!normalizedFlight) return null;
  const directionLabel = direction === "departure" ? "Вылет" : "Прилёт";
  return state.watchedFlights.find((flight) => (
    normalizeFlightNo(flight.no) === normalizedFlight &&
    (!displayDate || !flight.date || flight.date === displayDate) &&
    (!flight.direction || flight.direction === directionLabel)
  )) || null;
}

function getLogisticsDirection(request = {}, task = null) {
  const value = [
    request.flightDirection,
    task?.direction,
  ].filter(Boolean).join(" ").toLowerCase();
  if (/вылет|выезд|departure/.test(value)) return "departure";
  return "arrival";
}

function normalizeFlightNo(value = "") {
  const text = String(value || "")
    .toUpperCase()
    .replace(/СУ/g, "SU")
    .replace(/\s+/g, "");
  const match = text.match(/[A-Z]{2}-?\d{2,4}[A-Z]?/);
  if (!match) return "";
  return match[0].replace(/([A-Z]{2})(\d)/, "$1-$2");
}

function normalizeLogisticsDisplayDate(value = "") {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "";
  const iso = text.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[3]}.${iso[2]}.${iso[1]}`;
  const dotted = text.match(/(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?/);
  if (dotted) {
    const year = normalizeDateYear(dotted[3]);
    return `${dotted[1].padStart(2, "0")}.${dotted[2].padStart(2, "0")}.${year}`;
  }
  const monthMap = {
    "янв": 1,
    "фев": 2,
    "мар": 3,
    "апр": 4,
    "мая": 5,
    "май": 5,
    "июн": 6,
    "июл": 7,
    "авг": 8,
    "сен": 9,
    "окт": 10,
    "ноя": 11,
    "дек": 12,
  };
  const named = text.match(/(\d{1,2})\s*(янв|фев|мар|апр|мая|май|июн|июл|авг|сен|окт|ноя|дек)[а-я]*\.?\s*(\d{2,4})?/);
  if (named) {
    const month = monthMap[named[2]];
    const year = normalizeDateYear(named[3]);
    return `${named[1].padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
  }
  return "";
}

function normalizeDateYear(value = "") {
  if (!value) return String(new Date().getFullYear());
  const year = Number(value);
  if (!year) return String(new Date().getFullYear());
  return String(year < 100 ? 2000 + year : year);
}

function getCarTitle(car) {
  const title = `${car.brand || ""} ${car.model || ""}`.trim();
  return title || "Марка не указана";
}

function getCars() {
  ensureStateShape();
  return state.cars;
}

function getReadyCars() {
  return getCars().filter(isCarComplete);
}

function isCarComplete(car) {
  return Boolean(
    car &&
    String(car.driver || "").trim() &&
    String(car.brand || "").trim() &&
    String(car.model || "").trim() &&
    String(car.plate || "").trim() &&
    Number(car.capacity) > 0 &&
    String(car.phone || "").trim() &&
    typeof car.hasAc === "boolean" &&
    String(car.status || "").trim(),
  );
}

function formatCarAc(car) {
  if (typeof car.hasAc !== "boolean") return "кондиционер не указан";
  return car.hasAc ? "кондиционер есть" : "без кондиционера";
}

function findTaskForLogisticsId(logisticsId) {
  ensureStateShape();
  return state.transferTasks.find((task) => task.logisticsId === logisticsId);
}

function findTransferTask(taskId) {
  ensureStateShape();
  return state.transferTasks.find((task) => task.id === taskId);
}

function findLogisticsItem(logisticsId) {
  if (!logisticsId) return null;
  return buildLogisticsItems(filteredAirportFlights(), ui.airportMode === "departures")
    .find((item) => item.id === logisticsId) || null;
}

function normalizeTransferTask(task) {
  const car = task.carId ? getCars().find((item) => item.id === task.carId) : null;
  const fallbackRequest = state.requests.find((request) => request.id === task.requestId) || state.requests[0] || {};
  const client = task.client || task.clientName || fallbackRequest.name || "";
  const pax = Number(task.pax || fallbackRequest.pax || 1);
  const hotel = task.hotel || task.route || (fallbackRequest.route ? getHotelLabel(fallbackRequest, 0) : "");
  return {
    id: task.id,
    requestId: task.requestId || "",
    logisticsId: task.logisticsId || "",
    title: `${task.flightNo || "Рейс"} · ${client || "Гость не указан"}`,
    meta: `${task.direction || "Трансфер"} · ${task.date || "Дата не указана"} · ${task.time || "Время не указано"} · ${hotel || task.city || ""}`,
    status: task.status || "Новая задача",
    tone: car ? "teal" : "amber",
    flightKey: task.flightKey || "",
    carId: task.carId || "",
    carLabel: car ? `${car.driver} · ${getCarTitle(car)}` : "",
    pax,
    client,
    city: task.city || "",
    date: task.date || "",
    time: task.time || "",
    direction: task.direction || "",
    hotel,
    flightNo: task.flightNo || "",
  };
}

function getCarSeatUsage(carId, exceptTaskId = "") {
  return getTransferTaskRows()
    .filter((task) => task.carId === carId && task.id !== exceptTaskId)
    .reduce((sum, task) => sum + Number(task.pax || 0), 0);
}

function getHotelLabel(request, index) {
  const hotels = ["Отель Мира", "Azimut Владивосток", "Lotte Hotel", "Novotel", "Исторический центр"];
  if (request.route.includes("VIP")) return "Индивидуальный адрес";
  if (request.route.includes("Корпоратив")) return "Группа · список участников";
  return hotels[index % hotels.length];
}

function renderGroupedLogisticsItems(items) {
  if (!items.length) return "";
  const groups = items.reduce((result, item) => {
    const key = `${item.date}|${item.time}|${item.flightNo}|${item.city}`;
    if (!result.has(key)) {
      result.set(key, {
        title: `${item.time} · ${item.flightNo} · ${item.city}`,
        subtitle: `${item.date} · ${item.direction}`,
        pax: 0,
        items: [],
      });
    }
    const group = result.get(key);
    group.pax += Number(item.pax || 0);
    group.items.push(item);
    return result;
  }, new Map());

  return Array.from(groups.values()).map((group) => `
    <div class="flight-group">
      <div class="flight-group-header">
        <span>
          <strong>${escapeHtml(group.title)}</strong>
          <small>${escapeHtml(group.subtitle)}</small>
        </span>
        <em>${group.items.length} / ${group.pax} чел.</em>
      </div>
      <div class="logistics-stack">
        ${group.items.map(renderLogisticsFlightCard).join("")}
      </div>
    </div>
  `).join("");
}

function renderLogisticsFlightCard(item) {
  const badge = item.noTransfer
    ? "Без встречи"
    : item.carId
      ? item.carLabel
      : item.taskId
        ? "Задача создана"
        : "Без машины";
  const badgeTone = item.noTransfer ? "navy" : item.carId ? "teal" : item.taskId ? "amber" : "rose";
  return `
    <button class="logistics-card" type="button" draggable="true" data-drag-logistics-id="${escapeHtml(item.id)}" data-action="openLogisticsItem" data-logistics-id="${escapeHtml(item.id)}">
      <span class="logistics-card-top">
        <strong>${escapeHtml(item.client)}</strong>
        <em class="badge ${item.tag === "VIP" ? "amber" : "navy"}">${escapeHtml(item.tag)}</em>
      </span>
      <span class="logistics-route">${escapeHtml(item.time)} · ${escapeHtml(item.flightNo)} · ${escapeHtml(item.city)}</span>
      <span class="logistics-meta">${escapeHtml(item.hotel)} · ${item.pax} чел.</span>
      <span class="logistics-card-bottom">
        <span class="badge ${item.statusTone}">${escapeHtml(item.status)}</span>
        <span class="badge ${badgeTone}">${escapeHtml(badge)}</span>
      </span>
    </button>
  `;
}

function renderAirportDateChips(records, countKind = "flight") {
  return getAirportDateChips(records, countKind).map((chip) => `
    <button class="airport-date-chip ${chip.value === ui.airportDate ? "active" : ""}" type="button" data-action="selectAirportDate" data-date="${escapeHtml(chip.value)}">
      <strong>${escapeHtml(chip.title)}</strong>
      <span>${escapeHtml(chip.subtitle)}${chip.countLabel ? ` · ${escapeHtml(chip.countLabel)}` : ""}</span>
    </button>
  `).join("");
}

function renderAirportAdvancedFilters() {
  return `
    <div class="airport-controls-grid">
      <label class="field">
        <span>Дата вручную</span>
        <input type="date" value="${escapeHtml(ui.airportDate)}" data-airport-field="date" />
      </label>
      <label class="field">
        <span>С начала</span>
        <input type="time" value="${escapeHtml(ui.airportTimeStart)}" data-airport-field="timeStart" />
      </label>
      <label class="field">
        <span>До времени</span>
        <input type="time" value="${escapeHtml(ui.airportTimeEnd)}" data-airport-field="timeEnd" />
      </label>
      <label class="field">
        <span>Автообновление</span>
        <select data-airport-field="autoRefresh">
          ${getAirportRefreshOptions().map(({ value, label }) => `<option value="${value}" ${ui.airportAutoRefresh === value ? "selected" : ""}>${label}</option>`).join("")}
        </select>
      </label>
    </div>
  `;
}

function getAirportConnectionInfo() {
  const isReserveProxy = airportBoard.backendSource === "aerovlad-reserve-proxy";
  const isDirect = airportBoard.backendSource === "aerovlad-direct";
  if (airportBoard.loading) {
    return {
      title: "Обновляю live-табло",
      text: "Проверяю источник аэропорта Владивосток",
      toneClass: "is-loading",
      sourceLabel: airportBoard.source === "live" ? "онлайн" : "проверка",
    };
  }
  if (airportBoard.source === "live") {
    return {
      title: "Live-табло активно",
      text: isReserveProxy
        ? `резервный канал, обновление ${airportBoard.lastLiveAt || airportBoard.updatedAt}`
        : `официальный канал, обновление ${airportBoard.lastLiveAt || airportBoard.updatedAt}`,
      toneClass: "is-live",
      sourceLabel: isDirect ? "онлайн" : "онлайн, резерв",
    };
  }
  if (airportBoard.source === "cached-live") {
    return {
      title: "Показан последний live-снимок",
      text: airportBoard.error || "связь временно недоступна, данные сохранены после прошлой успешной загрузки",
      toneClass: "is-cached",
      sourceLabel: "снимок live",
    };
  }
  return {
    title: "Live пока недоступен",
    text: airportBoard.error || "жду доступ к API аэропорта, сейчас показан резервный слой",
    toneClass: "is-fallback",
    sourceLabel: "резерв",
  };
}

function renderAirportLiveIndicator(connection, flightCount) {
  const tone = airportBoard.loading
    ? "loading"
    : airportBoard.source === "live"
      ? "live"
      : airportBoard.source === "cached-live"
        ? "cached"
        : "fallback";
  const label = airportBoard.loading ? "sync" : airportBoard.source === "live" ? "live" : airportBoard.source === "cached-live" ? "снимок" : "резерв";
  const time = airportBoard.updatedAt && !airportBoard.updatedAt.includes("недоступ")
    ? airportBoard.updatedAt
    : formatAirportUpdatedAt(new Date());
  const detail = `${connection.title}. ${connection.text}. Обновлено ${time} (${formatTimezoneLabel(getSystemTimezone())}). Рейсов в источнике: ${flightCount}.`;

  return `
    <div class="live-control">
      <button class="live-indicator ${tone} ${ui.airportStatusOpen ? "active" : ""}" type="button" data-action="toggleAirportStatus" aria-label="Статус онлайн-табло" aria-expanded="${ui.airportStatusOpen ? "true" : "false"}" title="${escapeHtml(detail)}">
        <span class="live-dot"></span>
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(time)}</strong>
        <em>${escapeHtml(detail)}</em>
      </button>
      ${ui.airportStatusOpen ? renderAirportStatusPopover(connection, flightCount, time) : ""}
    </div>
  `;
}

function renderAirportStatusPopover(connection, flightCount, time) {
  return `
    <div class="live-popover" role="dialog" aria-label="Настройки онлайн-табло">
      <div class="live-popover-head">
        <strong>${escapeHtml(connection.title)}</strong>
        <button class="icon-button mini-icon-button" type="button" data-action="toggleAirportStatus" aria-label="Скрыть настройки">×</button>
      </div>
      <p>${escapeHtml(connection.text)}</p>
      <div class="live-popover-grid">
        <span>Обновлено</span><strong>${escapeHtml(time)}</strong>
        <span>Рейсов</span><strong>${flightCount}</strong>
        <span>Пояс</span><strong>${escapeHtml(formatTimezoneLabel(getSystemTimezone()))}</strong>
      </div>
      <label class="field compact-field">
        <span>Автообновление</span>
        <select data-airport-field="autoRefresh">
          ${getAirportRefreshOptions().map(({ value, label }) => `<option value="${value}" ${ui.airportAutoRefresh === value ? "selected" : ""}>${label}</option>`).join("")}
        </select>
      </label>
      <div class="template-actions">
        <button class="button primary" type="button" data-action="refreshAirportBoard">${iconSvg("refresh", "button-icon")}<span>Обновить сейчас</span></button>
        <a class="button secondary link-button" href="https://aerovlad.ru/ru/timetable" target="_blank" rel="noreferrer">Сайт аэропорта</a>
      </div>
    </div>
  `;
}

function renderAirportTableV2(flights, isDepartures) {
  if (airportBoard.loading && !flights.length) return `<div class="empty-state">Загружаю рейсы...</div>`;
  if (!flights.length) return `<div class="empty-state">Рейсы не найдены для выбранных даты и времени</div>`;

  return `
    <table class="request-table airport-table">
      <thead>
        <tr>
          <th>Дата и время</th>
          <th>Рейс</th>
          <th>${isDepartures ? "Направление" : "Откуда"}</th>
          <th>Авиакомпания</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        ${flights.map((flight) => `
          <tr>
            <td><strong>${escapeHtml(flight.displayTime)}</strong><br><span class="muted">${escapeHtml(flight.displayDate)} · ${escapeHtml(flight.timeLabel)}</span></td>
            <td>
              <button type="button" data-action="openFlight" data-flight-key="${escapeHtml(flight.key)}">${escapeHtml(flight.no)}</button>
              <br><span class="muted">${escapeHtml(flight.codeshare)}</span>
            </td>
            <td>${escapeHtml(flight.city)}<br><span class="muted">${escapeHtml(flight.airport)}</span></td>
            <td>${escapeHtml(flight.airline)}</td>
            <td><span class="badge ${flight.statusTone}">${escapeHtml(flight.status)}</span></td>
            <td>
              <div class="table-actions">
                <button class="table-action" type="button" data-action="openFlight" data-flight-key="${escapeHtml(flight.key)}">Открыть</button>
                <button class="table-action" type="button" data-action="watchFlight" data-flight-key="${escapeHtml(flight.key)}">Следить</button>
                <button class="table-action" type="button" data-action="createFlightTransfer" data-flight-key="${escapeHtml(flight.key)}">Трансфер</button>
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function getMessageInboxItems() {
  const requests = Array.isArray(state.requests) ? state.requests : [];
  const requestItems = requests
    .flatMap((request) => {
      const messages = Array.isArray(request.messages) ? request.messages : [];
      const latestMessage = messages[0];
      const isMax = /max/i.test(`${request.source || ""} ${request.preferredContact || ""}`);
      const items = [];
      if (isMax) {
        items.push({
          id: `max-${request.id}`,
          requestId: request.id,
          title: request.name,
          text: `Заявка из MAX: ${request.route || request.customProgram || "программа уточняется"}${request.flightNo ? ` · рейс ${request.flightNo}` : ""}${request.transferNeeded ? " · нужен трансфер" : ""}`,
          time: request.createdAt || "Только что",
          badge: "MAX",
        });
      }
      if (latestMessage) {
        items.push({
          id: `msg-${request.id}`,
          requestId: request.id,
          title: request.name,
          text: latestMessage,
          time: request.createdAt || "Недавно",
          badge: request.preferredContact || "CRM",
        });
      }
      return items;
    })
    .slice(0, 8);

  return requestItems;
}

function renderMessages() {
  const inboxItems = getMessageInboxItems();
  return `
    <div class="section-heading">
      <div>
        <span class="eyebrow">Связь</span>
        <h3>Сообщения</h3>
        <p>Шаблоны, входящие из MAX и быстрый переход в заявку.</p>
      </div>
    </div>
    <div class="work-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Входящие</h3>
            <p>Нажмите строку, чтобы открыть связанную заявку.</p>
          </div>
        </div>
        <div class="simple-list">
          ${inboxItems.length ? inboxItems.map((item) => `
            <button class="activity-row message-row" type="button" data-action="openRequest" data-id="${escapeHtml(item.requestId)}">
              <span>
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.text)}</p>
                <time>${escapeHtml(item.time)}</time>
              </span>
              <em class="badge navy">${escapeHtml(item.badge)}</em>
            </button>
          `).join("") : `<div class="empty-state compact-empty">Пока нет входящих сообщений. Когда клиент напишет боту или менеджер отправит шаблон, события появятся здесь.</div>`}
        </div>
      </section>
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Шаблоны</h3>
            <p>Выберите шаблон, затем клиента с подключенным MAX-чатом.</p>
          </div>
        </div>
        <div class="simple-list">
          ${state.templates.map((template) => `
            <button class="template-row active-row" type="button" data-action="openTemplateRecipients" data-template="${escapeHtml(template.id)}">
              <strong>${escapeHtml(template.title)}</strong>
              <p>${escapeHtml(template.text)}</p>
              <span class="badge navy">Выбрать клиента</span>
            </button>
          `).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderAutomation() {
  const readyCount = AUTOMATION_RULES.filter((rule) => ["работает", "логистика", "бот + CRM"].includes(rule.status)).length;
  const botCount = AUTOMATION_RULES.filter((rule) => /MAX|live|подключ/i.test(`${rule.title} ${rule.status}`)).length;
  return `
    <div class="section-heading">
      <div>
        <span class="eyebrow">Система</span>
        <h3>Автоматизации</h3>
        <p>Автоматизация заявки без ручного переноса.</p>
      </div>
    </div>

    <div class="metric-strip automation-strip">
      <button class="metric metric-button" type="button" data-action="showAutomationMetric" data-metric="all"><span>Сценарии</span><strong>${AUTOMATION_RULES.length}</strong><small>заявки, документы, оплата, логистика</small></button>
      <button class="metric metric-button" type="button" data-action="showAutomationMetric" data-metric="ready"><span>Готово</span><strong>${readyCount}</strong><small>можно запускать сейчас</small></button>
      <button class="metric metric-button" type="button" data-action="showAutomationMetric" data-metric="bot"><span>MAX / live</span><strong>${botCount}</strong><small>бот и внешние источники</small></button>
      <button class="metric metric-button" type="button" data-action="showAutomationMetric" data-metric="journal"><span>Журнал</span><strong>${getActivities().length}</strong><small>последние срабатывания</small></button>
    </div>

    <section class="panel automation-scenario-panel">
      <div class="panel-header">
        <div>
          <h3>MAX-бот → заявка → задачи</h3>
          <p>Клиент выбирает тур, а система сразу готовит работу менеджеру, документам, рейсу и трансферу.</p>
        </div>
        <button class="button primary" type="button" data-action="createClientScenario">${iconSvg("automation", "button-icon")}<span>Запустить сценарий</span></button>
      </div>
      <div class="automation-flow">
        <div><span>1</span><strong>Заявка</strong><small>клиент, тур, даты, бюджет</small></div>
        <div><span>2</span><strong>Документы</strong><small>запрос и статус в карточке</small></div>
        <div><span>3</span><strong>Рейс</strong><small>номер рейса уходит в контроль табло</small></div>
        <div><span>4</span><strong>Трансфер</strong><small>задача появляется в автомобилях</small></div>
        <div><span>5</span><strong>Журнал</strong><small>каждое действие видно в системе</small></div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Рабочие процессы</h3>
          <p>Нажмите сценарий, чтобы увидеть запуск, действие и что нужно подключить.</p>
        </div>
      </div>
      <div class="automation-grid">
        ${AUTOMATION_RULES.map((rule) => `
          <button class="automation-card" type="button" data-action="openAutomationRule" data-rule-id="${escapeHtml(rule.id)}">
            <span class="badge ${escapeHtml(rule.tone)}">${escapeHtml(rule.status)}</span>
            <strong>${escapeHtml(rule.title)}</strong>
            <small>Когда: ${escapeHtml(rule.trigger)}</small>
            <p>Делает: ${escapeHtml(rule.action)}</p>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function showAutomationMetric(metric = "all") {
  const activities = getActivities();
  const config = {
    all: {
      title: "Все сценарии",
      subtitle: "Нажмите сценарий, чтобы открыть детали и запустить его.",
      rows: AUTOMATION_RULES.map((rule) => ({
        action: "openAutomationRule",
        attrs: `data-rule-id="${escapeHtml(rule.id)}"`,
        title: rule.title,
        text: `${rule.trigger} · ${rule.action}`,
        badge: rule.status,
        tone: rule.tone,
      })),
    },
    ready: {
      title: "Готовые сценарии",
      subtitle: "Сценарии, которые можно показать и запускать уже в прототипе.",
      rows: AUTOMATION_RULES
        .filter((rule) => ["работает", "логистика", "бот + CRM"].includes(rule.status))
        .map((rule) => ({
          action: "openAutomationRule",
          attrs: `data-rule-id="${escapeHtml(rule.id)}"`,
          title: rule.title,
          text: `${rule.trigger} · ${rule.action}`,
          badge: rule.status,
          tone: rule.tone,
        })),
    },
    bot: {
      title: "MAX и live-источники",
      subtitle: "Сценарии, которые завязаны на бота, табло или внешний источник.",
      rows: AUTOMATION_RULES
        .filter((rule) => /MAX|live|подключ/i.test(`${rule.title} ${rule.status}`))
        .map((rule) => ({
          action: "openAutomationRule",
          attrs: `data-rule-id="${escapeHtml(rule.id)}"`,
          title: rule.title,
          text: `${rule.trigger} · ${rule.action}`,
          badge: rule.status,
          tone: rule.tone,
        })),
    },
    journal: {
      title: "Срабатывания",
      subtitle: "Последние действия, которые попали в журнал.",
      rows: activities.slice(0, 12).map((activity, index) => ({
        action: "openActivity",
        attrs: `data-activity-id="${escapeHtml(activity.id || String(index))}"`,
        title: activity.text || activity.message || "Событие",
        text: activity.time || activity.createdAt || "Недавно",
        badge: getActivityTargetLabel(activity),
        tone: "navy",
      })),
    },
  }[metric] || null;
  if (!config) return;

  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="automationMetricTitle">
      <div class="modal-card metric-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Автоматизации</span>
            <h3 id="automationMetricTitle">${escapeHtml(config.title)}</h3>
            <p class="muted">${escapeHtml(config.subtitle)}</p>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>
        <div class="metric-detail-list">
          ${config.rows.map((row) => `
            <button class="metric-detail-row" type="button" data-action="${escapeHtml(row.action)}" ${row.attrs}>
              <span><strong>${escapeHtml(row.title)}</strong></span>
              <small>${escapeHtml(row.text)}</small>
              <em class="badge ${escapeHtml(row.tone)}">${escapeHtml(row.badge)}</em>
            </button>
          `).join("") || `<div class="empty-state compact-empty">Пока нет данных</div>`}
        </div>
      </div>
    </div>
  `;
}

function openAutomationRuleModal(ruleId) {
  const rule = AUTOMATION_RULES.find((item) => item.id === ruleId);
  if (!rule) return;
  const targetRequest = getAutomationTargetRequest(ruleId);
  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="automationRuleTitle">
      <div class="modal-card metric-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Автоматизация</span>
            <h3 id="automationRuleTitle">${escapeHtml(rule.title)}</h3>
            <p class="muted">${escapeHtml(rule.status)}</p>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>
        <section class="detail-section">
          <div class="detail-grid">
            <div class="info-tile"><span>Событие</span><strong>${escapeHtml(rule.trigger)}</strong></div>
            <div class="info-tile"><span>Действие</span><strong>${escapeHtml(rule.action)}</strong></div>
            <div class="info-tile"><span>Канал</span><strong>${rule.id.includes("max") ? "MAX-бот" : "CRM"}</strong></div>
            <div class="info-tile"><span>Заявка</span><strong>${targetRequest ? escapeHtml(targetRequest.name) : "будет создана"}</strong></div>
          </div>
        </section>
        <section class="detail-section">
          <strong>Как внедрять</strong>
          <p class="muted">Сценарий берет событие из CRM, выполняет действие и записывает результат в журнал. Если у заявки есть чат MAX, сообщение уходит клиенту из карточки.</p>
        </section>
        <section class="detail-section">
          <strong>Что произойдет при запуске</strong>
          <p class="muted">${escapeHtml(rule.outcome || rule.action)}</p>
        </section>
        <div class="form-actions">
          <button class="button primary" type="button" data-action="runAutomationRule" data-rule-id="${escapeHtml(rule.id)}">${iconSvg("automation", "button-icon")}<span>Запустить сценарий</span></button>
        </div>
      </div>
    </div>
  `;
}

function getAutomationTargetRequest(ruleId) {
  const requests = Array.isArray(state.requests) ? state.requests : [];
  const selected = requests.find((request) => request.id === ui.selectedId);
  if (selected) return selected;
  if (ruleId === "documents-reminder") {
    return requests.find((request) => !["Получены", "Проверены"].includes(request.documentStatus) && (request.chatId || request.userId))
      || requests.find((request) => !["Получены", "Проверены"].includes(request.documentStatus))
      || requests[0];
  }
  if (ruleId === "payment-reminder") {
    return requests.find((request) => request.paymentStatus !== "Оплачено" && (request.chatId || request.userId))
      || requests.find((request) => request.paymentStatus !== "Оплачено")
      || requests[0];
  }
  if (ruleId === "transfer-created" || ruleId === "flight-change") {
    return requests.find((request) => request.transferNeeded || request.flightNo)
      || requests[0];
  }
  return requests.find((request) => request.chatId || request.userId) || requests[0];
}

function renderMaxBotSettingsPanel() {
  const runtime = maxBotStatus.runtime || {};
  const isRunning = Boolean(runtime.running);
  const hasError = Boolean(runtime.lastError);
  const fields = maxBotStatus.scenarioFields?.length ? maxBotStatus.scenarioFields : [
    "Имя",
    "Телефон",
    "Программа",
    "Даты",
    "Туристы",
    "Бюджет",
    "Проживание",
    "Рейс",
    "Трансфер",
    "Документы",
  ];
  const automations = maxBotStatus.automations?.length ? maxBotStatus.automations : [
    "Создать заявку",
    "Поставить документы в контроль",
    "Создать задачу трансфера",
  ];
  const statusText = !maxBotStatus.configured
    ? "Нужен токен"
    : isRunning
      ? "Работает"
      : runtime.status === "self-test-ok"
        ? "Проверен"
        : "Не запущен";
  const statusTone = !maxBotStatus.configured || hasError ? "rose" : isRunning || runtime.status === "self-test-ok" ? "teal" : "amber";

  return `
    <section class="panel max-bot-panel">
      <div class="panel-header">
        <div>
          <h3>MAX-бот</h3>
          <p>Каталог туров, заявки, документы, рейсы и автоматические задачи</p>
        </div>
        <button class="button secondary" type="button" data-action="refreshMaxBotStatus" ${maxBotStatus.loading ? "disabled" : ""}>
          ${iconSvg("refresh", "button-icon")}<span>${maxBotStatus.loading ? "Проверяю" : "Проверить"}</span>
        </button>
      </div>
      <div class="bot-status-grid">
        <div class="info-tile">
          <span>Статус</span>
          <strong><span class="status-dot ${statusTone === "teal" ? "is-live" : statusTone === "rose" ? "is-error" : ""}"></span>${escapeHtml(statusText)}</strong>
        </div>
        <div class="info-tile">
          <span>Заявки из MAX</span>
          <strong>${Number(maxBotStatus.inboxCount || 0)}</strong>
        </div>
        <div class="info-tile">
          <span>Последний опрос</span>
          <strong>${escapeHtml(formatBotTime(runtime.lastPollAt || runtime.checkedAt || ""))}</strong>
        </div>
        <div class="info-tile">
          <span>Канал</span>
          <strong>${escapeHtml(runtime.botUsername ? `@${runtime.botUsername}` : "id2540295426_bot")}</strong>
        </div>
      </div>
      <div class="simple-list compact-list">
        <a class="template-row active-row" href="${escapeHtml(maxBotStatus.botLink || "https://max.ru/id2540295426_bot")}" target="_blank" rel="noreferrer">
          <strong>Открыть бота</strong>
          <p>${escapeHtml(maxBotStatus.botLink || "https://max.ru/id2540295426_bot")}</p>
        </a>
        <div class="template-row">
          <strong>Сценарий заявки</strong>
          <p>${fields.map((field) => escapeHtml(field)).join(" · ")}</p>
        </div>
        <div class="template-row">
          <strong>Автоматизация после заявки</strong>
          <p>${automations.map((item) => escapeHtml(item)).join(" · ")}</p>
        </div>
        ${runtime.tlsMode === "insecure-fallback" ? `
          <div class="template-row warning-row">
            <strong>Сертификат MAX</strong>
            <p>Тестовый запуск использует обход проверки сертификата. Для сервера нужно добавить доверенный сертификат платформы MAX.</p>
          </div>
        ` : ""}
        ${hasError ? `
          <div class="template-row warning-row">
            <strong>Последняя ошибка</strong>
            <p>${escapeHtml(runtime.lastError)}</p>
          </div>
        ` : ""}
      </div>
    </section>
  `;
}

async function runAutomationRule(ruleId) {
  const rule = AUTOMATION_RULES.find((item) => item.id === ruleId);
  if (!rule) return;
  const request = getAutomationTargetRequest(ruleId);
  if (!request && ruleId !== "max-new-request") {
    toast("Нет заявок для запуска сценария.");
    return;
  }

  if (ruleId === "max-new-request") {
    createClientScenarioRequest();
    closeModal();
    toast("Сценарий запущен: заявка, документы, рейс и трансфер.");
    return;
  }

  if (ruleId === "documents-reminder") {
    await requestDocuments(request.id);
    closeModal();
    return;
  }

  if (ruleId === "payment-reminder") {
    request.paymentStatus = "Предоплата ожидается";
    request.nextStep = "Напомнить об оплате";
    const template = state.templates.find((item) => item.id === "payment");
    if (template) await sendTemplate(request.id, template.id);
    addActivity(`${request.name}: автоматизация напомнила о предоплате`, { targetType: "request", targetId: request.id, targetView: "requests" });
    persist();
    closeModal();
    render();
    toast("Сценарий оплаты выполнен.");
    return;
  }

  if (ruleId === "transfer-created") {
    const task = createTransferTaskFromMaxRequest(request, {});
    addActivity(`${request.name}: автоматизация подготовила трансфер`, { targetType: "transfer", targetId: task?.id || request.id, targetView: "cars" });
    persist();
    closeModal();
    ui.view = "cars";
    render();
    toast("Задача трансфера готова к назначению машины.");
    return;
  }

  if (ruleId === "flight-change") {
    ui.view = request.flightDirection === "Вылет" ? "departures" : "arrivals";
    ui.airportDate = normalizeDateYear(request.flightDate || request.dates) || ui.airportDate;
    closeModal();
    render();
    loadAirportBoard({ silent: true });
    addActivity(`${request.name}: автоматизация открыла контроль рейса`, { targetType: "request", targetId: request.id, targetView: ui.view });
    persist();
    toast("Открыто табло для контроля рейса.");
    return;
  }

  addActivity(`Сценарий "${rule.title}" запущен`, { targetType: "automation", targetId: rule.id, targetView: "automation" });
  persist();
  closeModal();
  render();
  toast("Сценарий запущен.");
}

function renderSettings() {
  const cars = getCars();
  const access = getAccessSettings();
  return `
    <div class="section-heading">
      <div>
        <span class="eyebrow">Система</span>
        <h3>Команда и доступ</h3>
        <p>Для презентации достаточно двух ролей: владелец и менеджер.</p>
      </div>
    </div>
    <div class="work-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Администраторы</h3>
            <p>Команда пилотной турфирмы</p>
          </div>
        </div>
        <div class="simple-list settings-admin-list">
          <div class="admin-row"><strong>Никита</strong><p>Владелец · полный доступ</p></div>
          <div class="admin-row"><strong>Алина</strong><p>Менеджер · заявки и сообщения</p></div>
          <div class="admin-row"><strong>Михаил</strong><p>Менеджер · группы и трансферы</p></div>
        </div>
        <div class="access-roles">
          ${Object.entries(access).map(([role, item]) => `
            <div class="access-role-card">
              <div>
                <strong>${escapeHtml(item.label)}</strong>
                <p>${escapeHtml(item.members)}</p>
              </div>
              <div class="access-toggle-grid">
                ${ACCESS_SECTIONS.map((section) => `
                  <label class="access-toggle ${item.locked ? "is-locked" : ""}">
                    <input type="checkbox" data-access-toggle data-role="${escapeHtml(role)}" data-view="${escapeHtml(section.id)}" ${item.views?.includes(section.id) ? "checked" : ""} ${item.locked ? "disabled" : ""} />
                    <span>${escapeHtml(section.label)}</span>
                  </label>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Автопарк</h3>
            <p>Администратор заполняет машины до использования в трансферах</p>
          </div>
          <button class="button primary" type="button" data-action="openNewCar">${iconSvg("plus", "button-icon")}<span>Добавить</span></button>
        </div>
        <div class="simple-list">
          ${cars.map((car) => `
            <button class="settings-row active-row" type="button" data-action="openCarEdit" data-car-id="${escapeHtml(car.id)}">
              <strong>${escapeHtml(getCarTitle(car))} · ${escapeHtml(car.plate || "номер не указан")}</strong>
              <p>${escapeHtml(car.driver || "водитель не указан")} · ${escapeHtml(car.phone || "телефон не указан")} · ${Number(car.capacity || 0)} мест · ${escapeHtml(formatCarAc(car))}</p>
              <span class="badge ${isCarComplete(car) ? "teal" : "rose"}">${isCarComplete(car) ? "Готова" : "Заполнить"}</span>
            </button>
          `).join("")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Системные настройки</h3>
            <p>Общие параметры времени и отображения</p>
          </div>
        </div>
        <label class="field">
          <span>Часовой пояс табло</span>
          <select data-system-field="timezone">
            ${getTimezoneOptions().map((option) => `<option value="${option.value}" ${getSystemTimezone() === option.value ? "selected" : ""}>${option.label}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>Проверить доступ как</span>
          <select data-system-field="activeRole">
            ${Object.entries(access).map(([role, item]) => `<option value="${escapeHtml(role)}" ${getActiveAccessRole() === role ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
          </select>
        </label>
        <p class="small-note">Время обновления live-индикатора показывается по выбранному поясу.</p>
        <div class="form-actions">
          <button class="button secondary" type="button" data-action="resetWorkspaceData">${iconSvg("refresh", "button-icon")}<span>Восстановить данные</span></button>
        </div>
      </section>
      ${renderThemeSettingsPanel()}
      ${renderMaxBotSettingsPanel()}
    </div>
  `;
}

function renderThemeSettingsPanel() {
  const theme = getThemeSettings();
  const activePreset = THEME_PRESETS.find((preset) => preset.id === theme.preset);
  return `
    <section class="panel settings-theme-panel">
      <div class="panel-header compact-panel-header">
        <div>
          <h3>Оформление</h3>
          <p>${activePreset ? `Сейчас: ${escapeHtml(activePreset.label)}` : "Сейчас: своя палитра"}</p>
        </div>
        <button class="button secondary compact-button" type="button" data-action="resetTheme">Сброс</button>
      </div>
      <div class="theme-preset-row" role="group" aria-label="Пресеты оформления">
        ${THEME_PRESETS.map((preset) => `
          <button class="theme-preset ${theme.preset === preset.id ? "active" : ""}" type="button" data-action="setThemePreset" data-preset="${escapeHtml(preset.id)}">
            <span class="theme-preset-dots" aria-hidden="true">
              <i style="background:${escapeHtml(preset.colors.primary)}"></i>
              <i style="background:${escapeHtml(preset.colors.success)}"></i>
              <i style="background:${escapeHtml(preset.colors.warning)}"></i>
            </span>
            <strong>${escapeHtml(preset.label)}</strong>
            <small>${escapeHtml(preset.hint)}</small>
          </button>
        `).join("")}
      </div>
      <div class="theme-color-grid">
        ${THEME_COLOR_FIELDS.map((field) => {
          const value = normalizeThemeColor(theme.colors[field.key], DEFAULT_THEME.colors[field.key]);
          return `
            <label class="theme-color-control">
              <span class="theme-color-copy">
                <i style="background:${escapeHtml(value)}" aria-hidden="true"></i>
                <span>
                  <strong>${escapeHtml(field.label)}</strong>
                  <small>${escapeHtml(field.hint)}</small>
                </span>
              </span>
              <input type="color" value="${escapeHtml(value)}" data-theme-color="${escapeHtml(field.key)}" aria-label="${escapeHtml(field.label)}" />
            </label>
          `;
        }).join("")}
      </div>
      <p class="small-note">Меняется внешний вид кнопок, статусов, бейджей и подсветки без перезагрузки CRM.</p>
    </section>
  `;
}

function renderActivityList() {
  const activities = getActivities().slice(0, 6);
  return `
    <div class="activity-list">
      ${activities.map((activity, index) => renderActivityButton(activity, index, "activity-row")).join("") || `<div class="empty-state compact-empty">Действий пока нет</div>`}
    </div>
  `;
}

function renderJournal() {
  const events = filterJournalEventsBySearch(sortJournalEvents(getActivities())).slice(0, 60);
  const counts = getJournalCounts(events);
  const filteredEvents = filterJournalEvents(events).slice(0, 30);
  const activeCount = ui.journalFilter === "all" ? events.length : counts[ui.journalFilter] || 0;
  const latestEvent = filteredEvents[0];
  const filterTabs = [
    { id: "all", label: "Все", value: events.length },
    { id: "requests", label: "Заявки", value: counts.requests },
    { id: "messages", label: "Сообщения", value: counts.messages },
    { id: "logistics", label: "Логистика", value: counts.logistics },
    { id: "finance", label: "Финансы", value: counts.finance },
    { id: "system", label: "Система", value: counts.system },
  ];

  return `
    <div class="section-heading">
      <div>
        <span class="eyebrow">Система</span>
        <h3>Журнал действий</h3>
        <p>Лента событий CRM.</p>
      </div>
    </div>
    <div class="journal-grid">
      <section class="panel journal-panel">
        <div class="panel-header">
          <div>
            <h3>Последние события</h3>
            <p>${escapeHtml(getJournalFilterTitle())}</p>
          </div>
          <div class="segmented journal-sort" role="group" aria-label="Сортировка журнала">
            <button class="${ui.journalSort === "newest" ? "active" : ""}" type="button" data-action="setJournalSort" data-sort="newest">Новые</button>
            <button class="${ui.journalSort === "oldest" ? "active" : ""}" type="button" data-action="setJournalSort" data-sort="oldest">Старые</button>
          </div>
        </div>
        <div class="journal-filter-row" role="group" aria-label="Фильтр журнала">
          ${filterTabs.map((item) => `
            <button class="chip-button ${ui.journalFilter === item.id ? "active" : ""}" type="button" data-action="setJournalFilter" data-filter="${escapeHtml(item.id)}">
              ${escapeHtml(item.label)} <strong>${item.value}</strong>
            </button>
          `).join("")}
        </div>
        <div class="simple-list">
          ${filteredEvents.map((event, index) => `
            ${renderActivityButton(event, index, "journal-row")}
          `).join("") || `<div class="empty-state compact-empty">В этом фильтре пока нет событий</div>`}
        </div>
      </section>
      <section class="panel journal-side-panel">
        <div class="panel-header">
          <div>
            <h3>Сводка</h3>
            <p>Текущий фильтр и ближайшее действие.</p>
          </div>
        </div>
        <div class="journal-inspector">
          <div class="journal-inspector-card">
            <span>Показано</span>
            <strong>${activeCount}</strong>
            <small>${escapeHtml(getJournalFilterName(ui.journalFilter))}</small>
          </div>
          <div class="journal-inspector-card">
            <span>Последнее</span>
            <strong>${latestEvent ? escapeHtml(getActivityTargetLabel(latestEvent)) : "Нет"}</strong>
            <small>${latestEvent ? escapeHtml(formatActivityTime(latestEvent, 0)) : "событий пока нет"}</small>
          </div>
          <div class="journal-type-list" aria-label="Состав журнала">
            <span><em></em>Заявки <strong>${counts.requests}</strong></span>
            <span><em></em>Сообщения <strong>${counts.messages}</strong></span>
            <span><em></em>Логистика <strong>${counts.logistics}</strong></span>
            <span><em></em>Финансы <strong>${counts.finance}</strong></span>
            <span><em></em>Система <strong>${counts.system}</strong></span>
          </div>
          <p class="muted">Фильтр выбирается только сверху. Каждая строка журнала открывает связанный объект.</p>
        </div>
      </section>
    </div>
  `;
}

function setJournalFilter(filter) {
  const allowed = ["all", "requests", "messages", "logistics", "finance", "system"];
  ui.journalFilter = allowed.includes(filter) ? filter : "all";
  render();
}

function setJournalSort(sort) {
  ui.journalSort = sort === "oldest" ? "oldest" : "newest";
  render();
}

function sortJournalEvents(events) {
  const fallbackBase = Date.now();
  return [...events].sort((a, b) => {
    const aTime = getActivitySortTime(a, fallbackBase);
    const bTime = getActivitySortTime(b, fallbackBase);
    return ui.journalSort === "oldest" ? aTime - bTime : bTime - aTime;
  });
}

function filterJournalEvents(events) {
  if (ui.journalFilter === "all") return events;
  return events.filter((event) => getJournalEventType(event) === ui.journalFilter);
}

function filterJournalEventsBySearch(events) {
  const query = normalizeSearch(ui.search);
  if (!query) return events;
  return events.filter((event) => {
    const activity = normalizeActivity(event, 0);
    const haystack = [
      activity.text,
      activity.time,
      activity.createdAt,
      activity.targetId,
      activity.targetType,
      activity.targetView,
      getActivityTargetLabel(activity),
      getJournalEventType(activity),
    ].join(" ");
    return normalizeSearch(haystack).includes(query);
  });
}

function getJournalCounts(events) {
  return events.reduce((summary, event) => {
    const type = getJournalEventType(event);
    summary[type] = (summary[type] || 0) + 1;
    return summary;
  }, { requests: 0, messages: 0, logistics: 0, finance: 0, system: 0 });
}

function getJournalEventType(activity) {
  const text = String(activity.text || "").toLowerCase();
  if (/сообщ|шаблон|отправ|telegram|max|рассыл/.test(text)) return "messages";
  if (/оплат|предоплат|счет|счёт|бюджет|финанс|марж|стоим/.test(text)) return "finance";
  if (["transferTask", "car", "airport", "transport"].includes(activity.targetType) || /трансфер|машин|авто|рейс|табло|маршрут/.test(text)) return "logistics";
  if (activity.targetType === "request" || /заяв|статус|шаг|ответствен|бронь|клиент/.test(text)) return "requests";
  return "system";
}

function getJournalFilterTitle() {
  const titles = {
    all: "Все события. Нажмите строку, чтобы открыть связанный объект.",
    requests: "Заявки и клиенты: статусы, шаги, ответственные и бронь.",
    messages: "Сообщения: шаблоны, отправки клиентам и входящие.",
    logistics: "Логистика: трансферы, автомобили, рейсы и табло.",
    finance: "Финансы: оплаты, бюджеты, счета и маржа.",
    system: "Системные действия: настройки, доступы и служебные события.",
  };
  return titles[ui.journalFilter] || titles.all;
}

function getJournalFilterName(filter) {
  const titles = {
    all: "все события",
    requests: "заявки",
    messages: "сообщения",
    logistics: "логистика",
    finance: "финансы",
    system: "система",
  };
  return titles[filter] || titles.all;
}

function getActivitySortTime(activity, fallbackBase = Date.now()) {
  if (activity.createdAt) {
    const date = new Date(activity.createdAt);
    if (!Number.isNaN(date.getTime())) return date.getTime();
  }
  const activities = getActivities();
  const index = activities.findIndex((item) => item.id === activity.id);
  return fallbackBase - Math.max(index, 0) * 60_000;
}

function renderFinance() {
  ensureStateShape();
  const activeRequests = state.requests.filter((item) => item.status !== "closed");
  const finance = getFinanceSummary(activeRequests);
  const unpaidCount = activeRequests.filter((request) => getRequestFinance(request).balance > 0).length;
  const paidPercent = finance.total ? Math.round((finance.paid / finance.total) * 100) : 0;
  const marginPercent = finance.costedTotal ? Math.round((finance.margin / finance.costedTotal) * 100) : 0;
  const focus = ["sold", "received", "due", "margin"].includes(ui.financeFocus) ? ui.financeFocus : "sold";
  const financeCards = [
    { id: "sold", label: "Продано", value: finance.total, hint: `${activeRequests.length} активных заявок` },
    { id: "received", label: "Получено", value: finance.paid, hint: `${paidPercent}% оплат` },
    { id: "due", label: "К получению", value: finance.balance, hint: `${unpaidCount} заявок с остатком` },
    { id: "margin", label: "Маржа", value: finance.margin, hint: finance.estimatedCount ? `${marginPercent}% · ${finance.estimatedCount} расчетов` : "расчетов нет" },
  ];
  const focusRows = {
    sold: [...activeRequests].sort((a, b) => getRequestFinance(b).total - getRequestFinance(a).total),
    received: activeRequests.filter((request) => getRequestFinance(request).paid > 0).sort((a, b) => getRequestFinance(b).paid - getRequestFinance(a).paid),
    due: activeRequests.filter((request) => getRequestFinance(request).balance > 0).sort((a, b) => getRequestFinance(b).balance - getRequestFinance(a).balance),
    margin: activeRequests.filter((request) => getRequestFinance(request).hasCosts).sort((a, b) => getRequestFinance(b).margin - getRequestFinance(a).margin),
  }[focus];
  const focusCopy = {
    sold: ["Продано", "Все активные заявки и сумма тура. Строка открывает карточку клиента."],
    received: ["Получено", "Заявки, где уже есть оплата или предоплата."],
    due: ["К получению", "Клиенты, у которых остался платеж к доведению."],
    margin: ["Маржа", "Плановая прибыль только по заявкам, где заполнен расчет тура."],
  }[focus];

  return `
    <div class="metric-strip">
      ${financeCards.map((card) => `
        <button class="metric metric-button ${focus === card.id ? "active" : ""}" type="button" data-action="setFinanceFocus" data-metric="${card.id}">
          <span>${escapeHtml(card.label)}</span>
          <strong>${formatMoneyShort(card.value)}</strong>
          <small>${escapeHtml(card.hint)}</small>
        </button>
      `).join("")}
    </div>

    <div class="work-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>${escapeHtml(focusCopy[0])}</h3>
            <p>${escapeHtml(focusCopy[1])}</p>
          </div>
        </div>
        <div class="metric-detail-list">
          ${focusRows.map((request) => {
            const item = getRequestFinance(request);
            const percent = getFinanceRowPercent(item, focus);
            return `
              <button class="metric-detail-row finance-row" type="button" data-action="openRequest" data-id="${escapeHtml(request.id)}">
                <span><strong>${escapeHtml(request.name)}</strong> · ${escapeHtml(getRequestProgramTitle(request))}</span>
                <small>${escapeHtml(getFinanceRowMeta(item, focus))}</small>
                <em class="badge ${getFinanceRowTone(item, focus)}">${percent}%</em>
              </button>
            `;
          }).join("") || `<div class="empty-state compact-empty">По этому фильтру пока пусто</div>`}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Сводка</h3>
            <p>Из чего складываются деньги по активным заявкам.</p>
          </div>
        </div>
        <div class="analytics-bars">
          ${renderAnalyticsBar("Продано", finance.total, finance.total, "navy")}
          ${renderAnalyticsBar("Получено", finance.paid, finance.total, "teal")}
          ${renderAnalyticsBar("К получению", finance.balance, finance.total, "amber")}
          ${renderAnalyticsBar("Расходы", finance.costs, finance.costedTotal || finance.total, "rose")}
          ${renderAnalyticsBar("Маржа", finance.margin, finance.costedTotal || finance.total, "violet")}
        </div>
        ${finance.estimatedCount ? renderCostBreakdown(finance.costItems, "Расходы по расчетам", `${finance.estimatedCount} заполненных заявок`) : `<div class="empty-state compact-empty">Расчеты туров еще не заполнены</div>`}
      </section>
    </div>

    <div class="work-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Платежи</h3>
            <p>Короткая лента поступлений и ожидаемых оплат.</p>
          </div>
        </div>
        <div class="metric-detail-list">
          ${getFinancePaymentRows(activeRequests).map((row) => `
            <button class="metric-detail-row" type="button" data-action="openRequest" data-id="${escapeHtml(row.requestId)}">
              <span><strong>${escapeHtml(row.title)}</strong> · ${formatMoneyInput(row.amount)}</span>
              <small>${escapeHtml(row.meta)}</small>
              <em class="badge ${row.tone}">${escapeHtml(row.type)}</em>
            </button>
          `).join("") || `<div class="empty-state compact-empty">Платежей пока нет</div>`}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Документы</h3>
            <p>Счета, договоры и чеки, привязанные к заявкам.</p>
          </div>
        </div>
        <div class="simple-list">
          <button class="transfer-row active-row" type="button" data-action="openRequest" data-id="TR-1042"><strong>Счет на предоплату</strong><p>Анна Смирнова · ожидает отправки</p><div class="row-meta"><span class="badge amber">счет</span></div></button>
          <button class="transfer-row active-row" type="button" data-action="openRequest" data-id="TR-1040"><strong>Чек предоплаты</strong><p>Марина Волкова · приложен к заявке</p><div class="row-meta"><span class="badge teal">чек</span></div></button>
          <button class="transfer-row active-row" type="button" data-action="openRequest" data-id="TR-1038"><strong>Договор с компанией</strong><p>Ольга Белова · корпоративная группа</p><div class="row-meta"><span class="badge navy">договор</span></div></button>
        </div>
      </section>
    </div>

    <section class="panel finance-price-panel">
      <div class="panel-header">
        <div>
          <h3>Прайсы туров</h3>
          <p>Состав услуги и материалы для отправки клиенту без отдельной бухгалтерии.</p>
        </div>
      </div>
      <div class="finance-price-grid">
        ${getPrograms().slice(0, 4).map((program) => `
          <button class="metric-detail-row" type="button" data-action="openProgramPreview" data-program-id="${escapeHtml(program.id)}">
            <span><strong>${escapeHtml(program.title)}</strong> · ${escapeHtml(program.price)}</span>
            <small>${normalizeLines(program.priceIncludes, []).length} входит · ${normalizeLines(program.priceExcludes, []).length} отдельно · ${programMaterialCount(program)} материалов</small>
            <em class="badge navy">прайс</em>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderAnalytics() {
  ensureStateShape();
  const activeRequests = state.requests.filter((item) => item.status !== "closed");
  const finance = getFinanceSummary(activeRequests);
  const cars = getCars();
  const readyCars = getReadyCars();
  const taskRows = getTransferTaskRows();
  const tasksWithoutCar = taskRows.filter((task) => !task.carId);
  const paidPercent = finance.total ? Math.round((finance.paid / finance.total) * 100) : 0;
  const marginPercent = finance.costedTotal ? Math.round((finance.margin / finance.costedTotal) * 100) : 0;
  const avgCheck = activeRequests.length ? Math.round(finance.total / activeRequests.length) : 0;
  const statusRows = STATUS.map((status) => {
    const items = activeRequests.filter((request) => request.status === status.id);
    const amount = items.reduce((sum, request) => sum + parseMoneyValue(request.budget), 0);
    return { ...status, count: items.length, amount };
  }).filter((row) => row.count);
  const topPrograms = getPrograms().map((program) => {
    const related = activeRequests.filter((request) => Array.isArray(request.programIds) && request.programIds.includes(program.id));
    return {
      title: program.title,
      count: related.length,
      amount: related.reduce((sum, request) => sum + parseMoneyValue(request.budget), 0),
    };
  }).filter((program) => program.count).sort((a, b) => b.amount - a.amount).slice(0, 4);

  return `
    <div class="metric-strip">
      <button class="metric metric-button" type="button" data-view="requests" data-tone="teal"><span>Потенциал</span><strong>${formatMoneyShort(finance.total)}</strong><small>${activeRequests.length} активных заявок</small></button>
      <button class="metric metric-button" type="button" data-view="requests" data-tone="navy"><span>Оплачено</span><strong>${formatMoneyShort(finance.paid)}</strong><small>${paidPercent}% от суммы туров</small></button>
      <button class="metric metric-button" type="button" data-view="requests" data-tone="amber"><span>Остаток</span><strong>${formatMoneyShort(finance.balance)}</strong><small>Ожидаем оплату</small></button>
      <button class="metric metric-button" type="button" data-view="requests" data-tone="violet"><span>Маржа</span><strong>${formatMoneyShort(finance.margin)}</strong><small>${finance.estimatedCount} расчетов · ${marginPercent}%</small></button>
    </div>

    <div class="work-grid analytics-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Деньги по заявкам</h3>
            <p>Управленческий учет: сумма тура, оплаты, расходы и плановая прибыль.</p>
          </div>
        </div>
        <div class="analytics-bars">
          ${renderAnalyticsBar("Потенциал", finance.total, finance.total, "navy")}
          ${renderAnalyticsBar("Оплачено", finance.paid, finance.total, "teal")}
          ${renderAnalyticsBar("К доплате", finance.balance, finance.total, "amber")}
          ${renderAnalyticsBar("Расходы по расчетам", finance.costs, finance.costedTotal || finance.total, "rose")}
          ${renderAnalyticsBar("Плановая маржа", finance.margin, finance.costedTotal || finance.total, "violet")}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Контроль</h3>
            <p>Короткие цифры, которые помогают не пропустить деньги и задачи.</p>
          </div>
        </div>
        <div class="compact-summary journal-summary">
          <button type="button" data-view="requests"><span>Средний чек</span><strong>${formatMoneyShort(avgCheck)}</strong></button>
          <button type="button" data-view="requests"><span>Заявки</span><strong>${activeRequests.length}</strong></button>
          <button type="button" data-view="cars"><span>Без авто</span><strong>${tasksWithoutCar.length}</strong></button>
          <button type="button" data-view="cars"><span>Готово авто</span><strong>${readyCars.length}/${cars.length}</strong></button>
        </div>
      </section>
    </div>

    <div class="work-grid analytics-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Воронка</h3>
            <p>Сколько денег находится на каждом этапе работы.</p>
          </div>
        </div>
        <div class="metric-detail-list">
          ${statusRows.map((row) => `
            <button class="metric-detail-row" type="button" data-view="requests">
              <span><strong>${escapeHtml(row.label)}</strong> · ${row.count} заявок</span>
              <small>${formatMoneyShort(row.amount)} в работе</small>
              <em class="badge ${escapeHtml(row.tone)}">${Math.round((row.amount / Math.max(finance.total, 1)) * 100)}%</em>
            </button>
          `).join("") || `<div class="empty-state compact-empty">Активных заявок пока нет</div>`}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Туры</h3>
            <p>Какие программы дают основной объем заявок.</p>
          </div>
        </div>
        <div class="metric-detail-list">
          ${topPrograms.map((program) => `
            <button class="metric-detail-row" type="button" data-view="program">
              <span><strong>${escapeHtml(program.title)}</strong></span>
              <small>${program.count} заявок · ${formatMoneyShort(program.amount)}</small>
              <em class="badge navy">тур</em>
            </button>
          `).join("") || `<div class="empty-state compact-empty">Данных по турам пока нет</div>`}
        </div>
      </section>
    </div>
  `;
}

function renderRequestDocuments(request) {
  const docs = getRequestDocuments(request);
  const doneCount = docs.filter((doc) => ["received", "verified"].includes(doc.status)).length;
  return `
    <details class="detail-section detail-accordion document-section">
      <summary>
        <span><strong>Документы</strong><small>${doneCount}/${docs.length} получено или проверено</small></span>
        <span class="badge ${getDocumentTone(request.documentStatus)}">${escapeHtml(request.documentStatus)}</span>
      </summary>
      <div class="accordion-body">
        <button class="chip-button compact-action" type="button" data-action="requestDocuments" data-id="${escapeHtml(request.id)}">Запросить все</button>
        <div class="document-list">
          ${docs.map((doc) => `
            <div class="document-row">
              <span class="document-mark ${doc.status}"></span>
              <div>
                <strong>${escapeHtml(doc.title)}</strong>
                <small>${escapeHtml(getDocumentStatusText(doc.status))}</small>
              </div>
              <select class="document-status-select" data-document-status data-id="${escapeHtml(request.id)}" data-doc-id="${escapeHtml(doc.id)}" aria-label="Статус документа ${escapeHtml(doc.title)}">
                ${getDocumentStatusOptions().map((option) => `<option value="${option.id}" ${doc.status === option.id ? "selected" : ""}>${option.label}</option>`).join("")}
              </select>
            </div>
          `).join("")}
        </div>
      </div>
    </details>
  `;
}

function getRequestDocuments(request) {
  request.documents = normalizeDocumentChecklist(request);
  request.documentStatus = getOverallDocumentStatus(request.documents);
  return request.documents;
}

function normalizeDocumentChecklist(request = {}) {
  const existing = Array.isArray(request.documents) ? request.documents : [];
  const fallbackStatus = getDocumentItemStatusFromOverall(request.documentStatus);
  return DOCUMENT_ITEMS.map((item) => {
    const saved = existing.find((doc) => doc.id === item.id) || {};
    return {
      ...item,
      status: isValidDocumentItemStatus(saved.status) ? saved.status : fallbackStatus,
      updatedAt: saved.updatedAt || "",
    };
  });
}

function isValidDocumentItemStatus(status) {
  return ["needed", "requested", "received", "verified"].includes(status);
}

function getDocumentItemStatusFromOverall(status) {
  if (status === "Проверены") return "verified";
  if (status === "Получены") return "received";
  if (status === "Запрошены") return "requested";
  return "needed";
}

function getOverallDocumentStatus(docs = []) {
  if (!docs.length || docs.every((doc) => doc.status === "needed")) return "Не запрошены";
  if (docs.every((doc) => doc.status === "verified")) return "Проверены";
  if (docs.every((doc) => ["received", "verified"].includes(doc.status))) return "Получены";
  return "Запрошены";
}

function getDocumentActionLabel(status) {
  if (status === "needed") return "Запросить";
  if (status === "requested") return "Получено";
  if (status === "received") return "Проверить";
  return "Готово";
}

function getDocumentStatusOptions() {
  return [
    { id: "needed", label: "Не запрошен" },
    { id: "requested", label: "Запрошен" },
    { id: "received", label: "Получен" },
    { id: "verified", label: "Проверен" },
  ];
}

function getDocumentStatusText(status) {
  if (status === "needed") return "не запрошен";
  if (status === "requested") return "запрошен";
  if (status === "received") return "получен";
  return "проверен";
}

function getNextDocumentStatus(status) {
  if (status === "needed") return "requested";
  if (status === "requested") return "received";
  if (status === "received") return "verified";
  return "verified";
}

async function requestDocuments(id) {
  const item = state.requests.find((request) => request.id === id);
  if (!item) return;
  const docs = getRequestDocuments(item);
  item.documents = docs.map((doc) => ({
    ...doc,
    status: doc.status === "needed" ? "requested" : doc.status,
    updatedAt: new Date().toISOString(),
  }));
  item.documentStatus = getOverallDocumentStatus(item.documents);
  const requested = item.documents.filter((doc) => doc.status === "requested").map((doc) => doc.title);
  const message = [
    "📄 Для оформления поездки пришлите, пожалуйста:",
    requested.map((doc) => `• ${doc}`).join("\n") || "• паспортные данные туристов\n• список участников поездки",
    "",
    "Можно отправить фото или файл прямо сюда в чат.",
    "Если какого-то документа пока нет — просто напишите, менеджер подскажет, как лучше поступить.",
  ].join("\n");
  if (!Array.isArray(item.messages)) item.messages = [];
  item.messages.unshift(message);
  addActivity(`${item.name}: запрошены документы`, { targetType: "request", targetId: item.id, targetView: "requests" });
  persist();
  renderDetail();
  render();
  const sent = await sendMaxMessageForRequest(item, message, "Запрос документов");
  if (sent) {
    addActivity(`${item.name}: запрос документов отправлен в MAX`, { targetType: "message", targetId: item.id, targetView: "requests" });
    persist();
    render();
    toast("Запрос документов отправлен клиенту в MAX.");
  }
}

function advanceDocumentStatus(id, docId) {
  const item = state.requests.find((request) => request.id === id);
  if (!item) return;
  const current = getRequestDocuments(item).find((doc) => doc.id === docId);
  setDocumentStatus(id, docId, getNextDocumentStatus(current?.status));
}

function setDocumentStatus(id, docId, status) {
  const item = state.requests.find((request) => request.id === id);
  if (!item || !isValidDocumentItemStatus(status)) return;
  const current = getRequestDocuments(item).find((doc) => doc.id === docId);
  if (current?.status === status) return;
  item.documents = getRequestDocuments(item).map((doc) => doc.id === docId
    ? { ...doc, status, updatedAt: new Date().toISOString() }
    : doc);
  item.documentStatus = getOverallDocumentStatus(item.documents);
  const changed = item.documents.find((doc) => doc.id === docId);
  addActivity(`${item.name}: документ "${changed?.title || "документ"}" ${getDocumentStatusText(changed?.status)}`, { targetType: "request", targetId: item.id, targetView: "requests" });
  persist();
  renderDetail();
  render();
  toast("Статус документа сохранен.");
}

function renderDetail() {
  const item = state.requests.find((request) => request.id === ui.selectedId);
  if (!item) return closeDetail();
  const programTitle = getRequestProgramTitle(item);
  const finance = getRequestFinance(item);

  detailPanel.innerHTML = `
    <div class="detail-header">
      <div>
        <span class="eyebrow">${escapeHtml(item.id)} · ${escapeHtml(item.source)}</span>
        <h3>${escapeHtml(item.name)}</h3>
        <p class="muted">${escapeHtml(item.route)}</p>
      </div>
      <div class="detail-header-actions">
        <button class="icon-button" type="button" aria-label="Редактировать карточку" title="Редактировать" data-action="openRequestEdit" data-id="${escapeHtml(item.id)}">${iconSvg("edit", "button-icon")}</button>
        <button class="icon-button" type="button" aria-label="Закрыть карточку" data-action="closeDetail">×</button>
      </div>
    </div>

    <section class="detail-section">
      <div class="card-meta">
        ${renderStatusBadge(item.status)}
        <span class="badge ${item.priority === "Высокий" ? "rose" : "amber"}">${escapeHtml(item.priority)}</span>
        <span class="badge navy">${escapeHtml(item.manager)}</span>
      </div>
      <div class="detail-grid">
        <div class="info-tile"><span>Программа</span><strong>${escapeHtml(programTitle)}</strong></div>
        <div class="info-tile"><span>Телефон</span><strong>${escapeHtml(item.phone)}</strong></div>
        <div class="info-tile"><span>Даты</span><strong>${escapeHtml(item.dates)}</strong></div>
        <div class="info-tile"><span>Проживание</span><strong>${escapeHtml(item.hotel || "Уточнить")}</strong></div>
        <div class="info-tile"><span>Туристы</span><strong>${item.pax} чел.</strong></div>
        <div class="info-tile"><span>Бюджет</span><strong>${escapeHtml(item.budget)}</strong></div>
        ${item.flightNo ? `<div class="info-tile"><span>Рейс</span><strong>${escapeHtml(item.flightNo)} · ${escapeHtml(item.flightTime || "время уточнить")}</strong></div>` : ""}
        ${item.transferNeeded ? `<div class="info-tile"><span>Трансфер</span><strong>Нужен · создать задачу</strong></div>` : ""}
      </div>
      ${renderRequestBotContext(item)}
    </section>

    ${renderRequestDocuments(item)}

    ${renderRequestFinanceSummary(item)}

    ${renderTourOpsChecklist(item)}

    <section class="detail-section">
      <strong>Сменить статус</strong>
      <div class="status-tabs">
        ${STATUS.map((status) => `
          <button class="chip-button ${item.status === status.id ? "active" : ""}" type="button" data-action="setStatus" data-id="${item.id}" data-status="${status.id}">${status.label}</button>
        `).join("")}
      </div>
    </section>

    <section class="detail-section">
      <strong>Следующий шаг</strong>
      <label class="field">
        <span>Действие менеджера</span>
        <select id="next-step-${escapeHtml(item.id)}">
          ${NEXT_STEPS.map((step) => `<option value="${step}" ${item.nextStep === step ? "selected" : ""}>${step}</option>`).join("")}
          ${NEXT_STEPS.includes(item.nextStep) ? "" : `<option value="${escapeHtml(item.nextStep)}" selected>${escapeHtml(item.nextStep)}</option>`}
        </select>
      </label>
      <button class="button secondary" type="button" data-action="setNextStep" data-id="${item.id}">Сохранить шаг</button>
      <button class="button secondary" type="button" data-action="assignManager" data-id="${item.id}">Передать другому менеджеру</button>
    </section>

    <section class="detail-section">
      <strong>Отправить клиенту</strong>
      <div class="template-actions">
        ${state.templates.map((template) => `
          <button class="chip-button" type="button" data-action="sendTemplate" data-id="${item.id}" data-template="${template.id}">${escapeHtml(template.title)}</button>
        `).join("")}
      </div>
    </section>

    <section class="detail-section">
      <strong>Заметки</strong>
      <div class="simple-list">
        ${item.notes.map((note) => `<div class="activity-row"><p>${escapeHtml(note)}</p></div>`).join("")}
      </div>
      <div class="note-form">
        <label class="field">
          <span>Новая заметка</span>
          <textarea id="note-${item.id}" placeholder="Например: клиент хочет вечернюю экскурсию"></textarea>
        </label>
        <button class="button secondary" type="button" data-action="addNote" data-id="${item.id}">Добавить заметку</button>
      </div>
    </section>

    <section class="detail-section">
      <strong>История сообщений</strong>
      <div class="simple-list">
        ${item.messages.map((message) => `<div class="activity-row"><p>${escapeHtml(message)}</p></div>`).join("")}
      </div>
    </section>
  `;

  detailPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("panel-open");
}

function renderRequestBotContext(item = {}) {
  const comment = cleanMaxValue(item.comment);
  if (!comment) return "";
  const sentences = comment.split(/(?<=\.)\s+/).map((line) => cleanMaxValue(line.replace(/\.$/, ""))).filter(Boolean);
  const botLike = item.source === "MAX бот" || /Сигналы|бот|MAX|Клиент выбрал|Клиент смотрит|Показан ориентир/i.test(comment);
  if (!botLike) return `<p class="muted">${escapeHtml(comment)}</p>`;

  const signalLines = sentences.flatMap((sentence) => {
    if (/^Сигналы/i.test(sentence)) {
      return sentence.replace(/^Сигналы(?: из диалога)?:\s*/i, "").split(";").map(cleanMaxValue).filter(Boolean);
    }
    if (/^Комментарий клиента/i.test(sentence)) {
      return [sentence.replace(/^Комментарий клиента:\s*/i, "")];
    }
    if (/^Клиент выбрал|^Клиент смотрит|^Показан ориентир|^Клиент не знает/i.test(sentence)) return [sentence];
    return [];
  }).filter(Boolean);
  const lines = signalLines.length ? signalLines : [comment];
  const summary = lines.slice(0, 2).join(" · ");

  return `
    <details class="detail-accordion bot-context">
      <summary>
        <span><strong>Что понял бот</strong><small>${escapeHtml(summary)}</small></span>
        <span class="badge navy">${lines.length}</span>
      </summary>
      <div class="accordion-body compact-signals">
        ${lines.slice(0, 8).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
      </div>
    </details>
  `;
}

function openFlightModal(flightKey) {
  const flight = airportBoard.flights.find((item) => item.key === flightKey);
  if (!flight) {
    toast("Рейс не найден в текущем табло.");
    return;
  }

  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="flightDetailTitle">
      <div class="modal-card flight-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">${escapeHtml(flight.direction)} · ${escapeHtml(flight.displayDate)}</span>
            <h3 id="flightDetailTitle">${escapeHtml(flight.no)} · ${escapeHtml(flight.city)}</h3>
            <p class="muted">${escapeHtml(flight.airline)} · ${escapeHtml(flight.airport)}</p>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>

        <div class="flight-status-line">
          <span class="badge ${flight.statusTone}">${escapeHtml(flight.status)}</span>
          <span class="badge navy">${escapeHtml(airportBoard.source === "live" ? "Live" : "Резерв")}</span>
          <span class="badge">${escapeHtml(flight.codeshare)}</span>
        </div>

        <section class="detail-section">
          <strong>Дата и время</strong>
          <div class="detail-grid">
            <div class="info-tile"><span>Дата табло</span><strong>${escapeHtml(flight.displayDate)}</strong></div>
            <div class="info-tile"><span>Показанное время</span><strong>${escapeHtml(flight.displayTime)}</strong></div>
            <div class="info-tile"><span>Вылет по расписанию</span><strong>${escapeHtml(flight.scheduledDeparture || "—")}</strong></div>
            <div class="info-tile"><span>Вылет расчётный/факт</span><strong>${escapeHtml(flight.actualDeparture || flight.estimatedDeparture || "—")}</strong></div>
            <div class="info-tile"><span>Прилёт по расписанию</span><strong>${escapeHtml(flight.scheduledArrival || "—")}</strong></div>
            <div class="info-tile"><span>Прилёт расчётный/факт</span><strong>${escapeHtml(flight.actualArrival || flight.estimatedArrival || "—")}</strong></div>
          </div>
        </section>

        <section class="detail-section">
          <strong>Аэропортовые детали</strong>
          <div class="detail-grid">
            <div class="info-tile"><span>Регистрация</span><strong>${escapeHtml(formatCheckin(flight))}</strong></div>
            <div class="info-tile"><span>Стойки</span><strong>${escapeHtml(flight.checkinDesk || "—")}</strong></div>
            <div class="info-tile"><span>Терминал</span><strong>${escapeHtml(flight.terminal || "—")}</strong></div>
            <div class="info-tile"><span>Гейт</span><strong>${escapeHtml(flight.gate || "—")}</strong></div>
          </div>
        </section>

        <p class="muted">Рейс используется как источник статуса и времени. Задачи трансфера создаются из карточек гостей в разделе логистики.</p>
      </div>
    </div>
  `;
}

function openLogisticsItemModal(logisticsId) {
  const item = findLogisticsItem(logisticsId);
  if (!item) {
    toast("Карточка логистики не найдена.");
    return;
  }
  const task = findTaskForLogisticsId(item.id);
  const action = item.noTransfer
    ? `<span class="badge navy">Трансфер не нужен</span>`
    : task
      ? `<button class="button primary" type="button" data-action="openTransferTask" data-task-id="${escapeHtml(task.id)}">${iconSvg("car", "button-icon")}<span>Открыть задачу</span></button>`
      : `<button class="button primary" type="button" data-action="createTransferTask" data-logistics-id="${escapeHtml(item.id)}">${iconSvg("plus", "button-icon")}<span>Создать задачу</span></button>`;

  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="logisticsItemTitle">
      <div class="modal-card metric-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">${escapeHtml(item.direction)}</span>
            <h3 id="logisticsItemTitle">${escapeHtml(item.client)}</h3>
            <p class="muted">${escapeHtml(item.flightNo)} · ${escapeHtml(item.city)} · ${escapeHtml(item.date)} ${escapeHtml(item.time)}</p>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>

        <section class="detail-section">
          <div class="detail-grid">
            <div class="info-tile"><span>Гость</span><strong>${escapeHtml(item.client)}</strong></div>
            <div class="info-tile"><span>Туристы</span><strong>${item.pax} чел.</strong></div>
            <div class="info-tile"><span>Рейс</span><strong>${escapeHtml(item.flightNo)} · ${escapeHtml(item.city)}</strong></div>
            <div class="info-tile"><span>Статус рейса</span><strong>${escapeHtml(item.status)}</strong></div>
            <div class="info-tile"><span>Время</span><strong>${escapeHtml(item.date)} · ${escapeHtml(item.time)}</strong></div>
            <div class="info-tile"><span>Адрес/отель</span><strong>${escapeHtml(item.hotel)}</strong></div>
          </div>
        </section>

        <section class="detail-section">
          <strong>Состояние трансфера</strong>
          <p class="muted">${escapeHtml(item.noTransfer ? "Для этого гостя встреча или проводы не требуются." : item.carLabel || item.taskStatus || "Машина еще не назначена.")}</p>
          <div class="template-actions">${action}</div>
        </section>
      </div>
    </div>
  `;
}

function createTransferTaskFromLogistics(logisticsId) {
  const item = findLogisticsItem(logisticsId);
  if (!item) {
    toast("Не удалось создать задачу: карточка не найдена.");
    return;
  }
  if (item.noTransfer) {
    toast("Для этой карточки трансфер не требуется.");
    return;
  }
  const existing = findTaskForLogisticsId(item.id);
  if (existing) {
    openTransferTaskModal(existing.id);
    return;
  }
  const task = {
    id: `TT-${Date.now()}`,
    logisticsId: item.id,
    requestId: item.requestId,
    client: item.client,
    pax: item.pax,
    hotel: item.hotel,
    flightKey: item.flightKey,
    flightNo: item.flightNo,
    city: item.city,
    date: item.date,
    time: item.time,
    direction: item.direction,
    status: "Новая задача",
    carId: "",
    createdAt: formatAirportUpdatedAt(new Date()),
  };
  state.transferTasks.unshift(task);
  addActivity(`Создана задача трансфера: ${task.client}, ${task.flightNo}`, { targetType: "transferTask", targetId: task.id, targetView: "cars" });
  persist();
  render();
  openTransferTaskModal(task.id);
  toast("Задача трансфера создана.");
}

function openTransferTaskModal(taskId) {
  const sourceTask = findTransferTask(taskId);
  if (!sourceTask) {
    toast("Задача трансфера не найдена.");
    return;
  }
  const task = normalizeTransferTask(sourceTask);
  const cars = getReadyCars();
  const currentCar = task.carId ? cars.find((car) => car.id === task.carId) : null;

  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="transferTaskTitle">
      <div class="modal-card metric-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Задача трансфера</span>
            <h3 id="transferTaskTitle">${escapeHtml(task.client || "Гость не указан")}</h3>
            <p class="muted">${escapeHtml(task.flightNo)} · ${escapeHtml(task.city)} · ${escapeHtml(task.date)} ${escapeHtml(task.time)}</p>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>

        <section class="detail-section">
          <div class="detail-grid">
            <div class="info-tile"><span>Направление</span><strong>${escapeHtml(task.direction)}</strong></div>
            <div class="info-tile"><span>Пассажиры</span><strong>${task.pax} чел.</strong></div>
            <div class="info-tile"><span>Рейс</span><strong>${escapeHtml(task.flightNo)} · ${escapeHtml(task.city)}</strong></div>
            <div class="info-tile"><span>Адрес/отель</span><strong>${escapeHtml(task.hotel)}</strong></div>
          </div>
        </section>

        <section class="detail-section">
          <strong>Назначенная машина</strong>
          <p class="muted">${currentCar ? `${escapeHtml(currentCar.driver)} · ${escapeHtml(getCarTitle(currentCar))} · ${escapeHtml(currentCar.plate)}` : "Машина пока не назначена."}</p>
          ${currentCar ? `<button class="button secondary" type="button" data-action="assignTransferCar" data-task-id="${escapeHtml(task.id)}" data-car-id="">Снять машину</button>` : ""}
        </section>

        <section class="detail-section">
          <strong>Выбрать автомобиль</strong>
          <div class="metric-detail-list">
            ${cars.map((car) => {
              const used = getCarSeatUsage(car.id, task.id);
              const free = Number(car.capacity || 0) - used;
              const enoughSeats = free >= task.pax || car.id === task.carId;
              return `
                <button class="metric-detail-row" type="button" data-action="assignTransferCar" data-task-id="${escapeHtml(task.id)}" data-car-id="${escapeHtml(car.id)}" ${enoughSeats ? "" : "disabled"}>
                  <span><strong>${escapeHtml(car.driver)}</strong> · ${escapeHtml(getCarTitle(car))}</span>
                  <small>${escapeHtml(car.plate)} · занято ${used} из ${car.capacity} · ${escapeHtml(formatCarAc(car))}</small>
                  <em class="badge ${car.id === task.carId ? "teal" : enoughSeats ? "navy" : "rose"}">${car.id === task.carId ? "Выбрана" : enoughSeats ? `${free} мест` : "Нет мест"}</em>
                </button>
              `;
            }).join("") || `<div class="empty-state compact-empty">Сначала заполните автомобили в настройках</div>`}
          </div>
        </section>
      </div>
    </div>
  `;
}

async function assignTransferCar(taskId, carId) {
  ensureStateShape();
  let taskIndex = state.transferTasks.findIndex((item) => item.id === taskId);
  if (taskIndex === -1) {
    toast("Задача трансфера не найдена.");
    return;
  }
  let task = state.transferTasks[taskIndex];
  if (!carId) {
    state.transferTasks[taskIndex] = { ...task, carId: "", status: "Новая задача" };
    task = state.transferTasks[taskIndex];
    addActivity(`С задачи ${task.flightNo} снята машина`, { targetType: "transferTask", targetId: task.id, targetView: "cars" });
    persist();
    render();
    openTransferTaskModal(task.id);
    toast("Машина снята с задачи.");
    return;
  }
  const car = getReadyCars().find((item) => item.id === carId);
  if (!car) {
    toast("Автомобиль не готов к назначению. Заполните карточку в настройках.");
    return;
  }
  const used = getCarSeatUsage(car.id, task.id);
  if (used + Number(task.pax || 1) > Number(car.capacity || 0)) {
    toast("В машине не хватает свободных мест.");
    return;
  }
  taskIndex = state.transferTasks.findIndex((item) => item.id === taskId);
  if (taskIndex === -1) {
    toast("Задача трансфера не найдена.");
    return;
  }
  task = state.transferTasks[taskIndex];
  state.transferTasks[taskIndex] = { ...task, carId: car.id, status: "Машина назначена" };
  task = state.transferTasks[taskIndex];
  addActivity(`${car.driver} назначен на трансфер ${task.flightNo}`, { targetType: "transferTask", targetId: task.id, targetView: "cars" });
  const request = state.requests.find((candidate) => candidate.id === task.requestId);
  await recordAndSendTransferNotification(request, task, car);
  persist();
  render();
  openTransferTaskModal(task.id);
  toast("Автомобиль назначен.");
}

async function assignLogisticsItemToCar(logisticsId, carId) {
  const item = findLogisticsItem(logisticsId);
  if (!item) {
    toast("Гость не найден на доске логистики.");
    return;
  }

  let task = item.taskId ? findTransferTask(item.taskId) : findTaskForLogisticsId(item.id);
  if (!task) {
    task = {
      id: `transfer-${Date.now()}`,
      requestId: item.requestId,
      logisticsId: item.id,
      client: item.client,
      pax: item.pax,
      hotel: item.hotel,
      flightKey: item.flightKey,
      flightNo: item.flightNo,
      city: item.city,
      date: item.date,
      time: item.time,
      direction: item.direction,
      status: "Новая задача",
      carId: "",
      createdAt: formatAirportUpdatedAt(new Date()),
    };
    state.transferTasks.unshift(task);
  }

  const car = getReadyCars().find((candidate) => candidate.id === carId);
  if (!car) {
    toast("Автомобиль не готов к назначению.");
    return;
  }

  const used = getCarSeatUsage(car.id, task.id);
  if (used + Number(task.pax || 1) > Number(car.capacity || 0)) {
    toast("В машине не хватает свободных мест.");
    return;
  }

  task.carId = car.id;
  task.status = "Машина назначена";

  const request = state.requests.find((candidate) => candidate.id === task.requestId);
  await recordAndSendTransferNotification(request, task, car);

  addActivity(`${item.client}: назначен автомобиль ${car.plate} на ${item.flightNo}`, { targetType: "transferTask", targetId: task.id, targetView: "cars" });
  persist();
  render();
  toast("Гость назначен в автомобиль. Уведомление подготовлено.");
}

function buildTransferNotification(request, task, car) {
  return [
    `🚘 ${request.name}, встреча в аэропорту подтверждена.`,
    "",
    `✈️ Рейс: ${task.flightNo}, ${task.date} ${task.time}`,
    `🚗 Автомобиль: ${getCarTitle(car)}`,
    `🔢 Номер: ${car.plate}`,
    `👤 Водитель: ${car.driver}`,
    `📞 Телефон: ${car.phone}`,
    "",
    "После прибытия держите телефон рядом. Если рейс задержится, мы увидим изменение в табло и сориентируем водителя.",
  ].join("\n");
}

async function recordAndSendTransferNotification(request, task, car) {
  if (!request) return false;
  const message = buildTransferNotification(request, task, car);
  if (!Array.isArray(request.messages)) request.messages = [];
  request.messages.unshift(message);
  addActivity(`${request.name}: подготовлены данные автомобиля ${car.plate}`, { targetType: "message", targetId: request.id, targetView: "requests" });
  persist();
  if (!request.chatId && !request.userId) return false;
  const sent = await sendMaxMessageForRequest(request, message, "Трансфер назначен");
  if (sent) {
    addActivity(`${request.name}: данные автомобиля отправлены в MAX`, { targetType: "message", targetId: request.id, targetView: "requests" });
    persist();
  }
  return sent;
}

function openCarModal(carId) {
  const car = getCars().find((item) => item.id === carId) || getCars()[0];
  if (!car) {
    openCarEditModal();
    return;
  }
  const assignments = getTransferTaskRows().filter((item) => item.carId === car.id);
  const used = assignments.reduce((sum, item) => sum + item.pax, 0);
  const complete = isCarComplete(car);
  const photoUrl = extractMaterialUrl(car.photo);

  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="carDetailTitle">
      <div class="modal-card metric-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Автомобиль</span>
            <h3 id="carDetailTitle">${escapeHtml(getCarTitle(car))}</h3>
            <p class="muted">${escapeHtml(car.plate || "номер не указан")} · водитель ${escapeHtml(car.driver || "не указан")}</p>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>

        ${complete ? "" : `<div class="form-alert">Карточка автомобиля не заполнена полностью. Машина не используется в распределении рейсов.</div>`}
        ${photoUrl ? `
          <details class="car-photo-toggle">
            <summary>Фото автомобиля</summary>
            <div class="car-photo"><img src="${escapeHtml(photoUrl)}" alt="Фото автомобиля ${escapeHtml(getCarTitle(car))}" loading="lazy"></div>
          </details>
        ` : `<div class="compact-empty car-photo-empty">Фото автомобиля не добавлено</div>`}

        <section class="detail-section">
          <div class="detail-grid">
            <div class="info-tile"><span>Марка</span><strong>${escapeHtml(car.brand)}</strong></div>
            <div class="info-tile"><span>Модель</span><strong>${escapeHtml(car.model)}</strong></div>
            <div class="info-tile"><span>Госномер</span><strong>${escapeHtml(car.plate)}</strong></div>
            <div class="info-tile"><span>Места</span><strong>занято ${used} из ${car.capacity}</strong></div>
            <div class="info-tile"><span>Кондиционер</span><strong>${escapeHtml(formatCarAc(car).replace("кондиционер ", ""))}</strong></div>
            <div class="info-tile"><span>Водитель</span><strong>${escapeHtml(car.driver)}</strong></div>
            <div class="info-tile"><span>Телефон</span><strong>${escapeHtml(car.phone)}</strong></div>
            <div class="info-tile"><span>Статус</span><strong>${escapeHtml(car.status)}</strong></div>
          </div>
        </section>

        <section class="detail-section">
          <div class="template-actions">
            <button class="button primary" type="button" data-action="openCarEdit" data-car-id="${escapeHtml(car.id)}">${iconSvg("settings", "button-icon")}<span>Редактировать</span></button>
          </div>
        </section>

        <section class="detail-section">
          <strong>Ближайшие назначения</strong>
          <div class="metric-detail-list">
            ${assignments.map((item) => `
              <button class="metric-detail-row" type="button" data-action="openTransferTask" data-task-id="${escapeHtml(item.id)}">
                <span><strong>${escapeHtml(item.flightNo)}</strong> ${escapeHtml(item.client)}</span>
                <small>${escapeHtml(item.direction)} · ${escapeHtml(item.date)} · ${escapeHtml(item.time)} · ${escapeHtml(item.hotel)}</small>
                <em class="badge ${item.tone}">${escapeHtml(item.status)}</em>
              </button>
            `).join("") || `<div class="empty-state compact-empty">На выбранный день назначений нет</div>`}
          </div>
        </section>
      </div>
    </div>
  `;
}

function openCarEditModal(carId = "") {
  const car = getCars().find((item) => item.id === carId) || {
    id: "",
    driver: "",
    brand: "",
    model: "",
    plate: "",
    capacity: 4,
    hasAc: true,
    phone: "",
    status: "Свободна",
    photo: "",
  };
  const title = car.id ? "Редактировать автомобиль" : "Новый автомобиль";

  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="carEditTitle">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Автопарк</span>
            <h3 id="carEditTitle">${title}</h3>
            <p class="muted">Заполненная карточка доступна для назначения на трансфер.</p>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>

        <form id="carForm" class="modal-form" action="javascript:void(0)" method="post">
          <input type="hidden" name="id" value="${escapeHtml(car.id)}" />
          <label>
            <span>Водитель</span>
            <input name="driver" required value="${escapeHtml(car.driver)}" placeholder="ФИО водителя" />
          </label>
          <label>
            <span>Телефон</span>
            <input name="phone" required value="${escapeHtml(car.phone)}" placeholder="+7 ..." />
          </label>
          <label>
            <span>Марка</span>
            <input name="brand" required value="${escapeHtml(car.brand)}" placeholder="Toyota" />
          </label>
          <label>
            <span>Модель</span>
            <input name="model" required value="${escapeHtml(car.model)}" placeholder="Alphard" />
          </label>
          <label>
            <span>Госномер</span>
            <input name="plate" required value="${escapeHtml(car.plate)}" placeholder="A000AA125" />
          </label>
          <label>
            <span>Количество мест</span>
            <input name="capacity" required type="number" min="1" max="60" value="${Number(car.capacity || 4)}" />
          </label>
          <label>
            <span>Кондиционер</span>
            <select name="hasAc" required>
              <option value="true" ${car.hasAc === true ? "selected" : ""}>Есть</option>
              <option value="false" ${car.hasAc === false ? "selected" : ""}>Нет</option>
            </select>
          </label>
          <label>
            <span>Статус</span>
            <select name="status" required>
              ${["Свободна", "На линии", "Резерв", "Недоступна"].map((status) => `<option value="${status}" ${car.status === status ? "selected" : ""}>${status}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>Фото - ссылка</span>
            <input name="photo" value="${escapeHtml(car.photo || "")}" placeholder="https:// или /uploads/..." />
          </label>
          <label>
            <span>Фото - файл</span>
            <input name="carPhotoUpload" type="file" accept="image/*" />
          </label>
          <div class="form-actions full">
            <button class="button secondary" type="button" data-action="closeModal">Отмена</button>
            <button class="button primary" type="button" data-action="saveCarForm">Сохранить автомобиль</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

async function saveCarFromForm(formData) {
  ensureStateShape();
  const returnView = ui.view;
  const id = String(formData.get("id") || "").trim();
  const existing = state.cars.find((item) => item.id === id) || {};
  let uploads = [];
  try {
    uploads = await uploadSelectedFiles(formData, ["carPhotoUpload"]);
  } catch {
    toast("Фото автомобиля не загрузилось. Проверьте локальный сервер и попробуйте еще раз.");
    return;
  }
  const photoUpload = uploads.find((file) => file.fieldName === "carPhotoUpload");
  const car = {
    id: id || `car-${Date.now()}`,
    driver: String(formData.get("driver") || "").trim(),
    brand: String(formData.get("brand") || "").trim(),
    model: String(formData.get("model") || "").trim(),
    plate: String(formData.get("plate") || "").trim(),
    capacity: Number(formData.get("capacity") || 0),
    hasAc: String(formData.get("hasAc")) === "true",
    phone: String(formData.get("phone") || "").trim(),
    status: String(formData.get("status") || "").trim(),
    photo: photoUpload ? materialLabel(photoUpload) : String(formData.get("photo") || existing.photo || "").trim(),
  };

  if (!isCarComplete(car)) {
    toast("Заполните все данные автомобиля.");
    return;
  }

  const index = state.cars.findIndex((item) => item.id === car.id);
  if (index >= 0) {
    state.cars[index] = car;
  } else {
    state.cars.unshift(car);
  }
  addActivity(`${car.driver}: обновлена карточка автомобиля`, { targetType: "car", targetId: car.id, targetView: "cars" });
  persist();
  closeModal();
  ui.view = isViewAllowedForActiveRole("cars") && returnView !== "settings" ? "cars" : returnView;
  syncNav();
  render();
  openCarModal(car.id);
  toast("Автомобиль сохранен.");
}

function formatCheckin(flight) {
  if (!flight.checkinStart && !flight.checkinEnd) return "—";
  return [flight.checkinStart, flight.checkinEnd].filter(Boolean).join(" — ");
}

function renderCostCalculatorFields(request = {}) {
  const items = normalizeCostItems(request.costItems || {});
  const costs = getCostItemsTotal(items);
  const budget = parseMoneyValue(request.budget);
  const margin = costs && budget ? Math.max(budget - costs, 0) : 0;
  return `
    <section class="calculator-block full" data-cost-calculator>
      <div class="calculator-head">
        <div>
          <strong>Расчет тура</strong>
          <span>Заполняет менеджер. Из этих строк считаются расходы и плановая маржа.</span>
        </div>
        <div class="calc-preview">
          <span>Расходы</span>
          <strong data-cost-total>${costs ? formatMoneyInput(costs) : "Не заполнено"}</strong>
          <small data-cost-margin>${costs && budget ? `Маржа ${formatMoneyInput(margin)}` : "Маржа появится после бюджета и расходов"}</small>
        </div>
      </div>
      <div class="cost-input-grid">
        ${COST_ITEM_FIELDS.map((field) => `
          <label>
            <span>${escapeHtml(field.label)}</span>
            <input name="cost_${escapeHtml(field.key)}" data-cost-input value="${escapeHtml(items[field.key])}" placeholder="${escapeHtml(field.placeholder)}" />
          </label>
        `).join("")}
      </div>
      <label>
        <span>Комментарий к расчету</span>
        <textarea name="calculationNote" placeholder="Например: расчет на 4 туристов, отель 4*, автобус и гид на 3 дня">${escapeHtml(request.calculationNote || "")}</textarea>
      </label>
    </section>
  `;
}

function updateCostCalculatorPreview(form) {
  if (!form) return;
  const costItems = collectCostItemsFromForm(new FormData(form));
  const costs = getCostItemsTotal(costItems);
  const budget = parseMoneyValue(form.querySelector("[name='budget']")?.value || "");
  const totalEl = form.querySelector("[data-cost-total]");
  const marginEl = form.querySelector("[data-cost-margin]");
  if (totalEl) totalEl.textContent = costs ? formatMoneyInput(costs) : "Не заполнено";
  if (marginEl) {
    marginEl.textContent = costs && budget
      ? `Маржа ${formatMoneyInput(Math.max(budget - costs, 0))}`
      : "Маржа появится после бюджета и расходов";
  }
}

function openNewRequestModal() {
  const programs = getPrograms();
  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="newRequestTitle">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Ручное создание</span>
            <h3 id="newRequestTitle">Новая заявка</h3>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>
        <form id="newRequestForm" class="modal-form">
          <label><span>Имя клиента</span><input name="name" required placeholder="Например: Артем Сергеевич" /></label>
          <label><span>Телефон</span><input name="phone" required placeholder="+7 900 000-00-00" /></label>
          <label class="full"><span>Программы</span>
            <select name="programIds" multiple size="${Math.min(5, programs.length + 1)}">
              ${programs.map((program) => `<option value="${program.id}">${escapeHtml(program.title)} · ${escapeHtml(program.dates)}</option>`).join("")}
              <option value="custom">Другое / индивидуальная программа</option>
            </select>
          </label>
          <label><span>Даты поездки</span><input name="dates" placeholder="Подтянутся из программы или укажите вручную" /></label>
          <label><span>Проживание</span><input name="hotel" placeholder="Подтянется из программы или укажите вручную" /></label>
          <label><span>Количество туристов</span><input name="pax" type="number" min="1" value="2" required /></label>
          <label><span>Бюджет</span><input name="budget" placeholder="150 000 ₽" /></label>
          <label><span>Оплачено</span><input name="paidAmount" placeholder="0 ₽" /></label>
          ${renderCostCalculatorFields()}
          <label><span>Оплата</span>
            <select name="paymentStatus">
              ${PAYMENT_STATUS.map((status) => `<option value="${escapeHtml(status)}">${escapeHtml(status)}</option>`).join("")}
            </select>
          </label>
          <label><span>Документы</span>
            <select name="documentStatus">
              ${DOCUMENT_STATUS.map((status) => `<option value="${escapeHtml(status)}">${escapeHtml(status)}</option>`).join("")}
            </select>
          </label>
          <label><span>Ответственный</span>
            <select name="manager">
              ${MANAGERS.map((manager) => `<option value="${manager}">${manager}</option>`).join("")}
            </select>
          </label>
          <label><span>Приоритет</span>
            <select name="priority">
              <option>Средний</option>
              <option>Высокий</option>
              <option>Низкий</option>
            </select>
          </label>
          <label><span>Следующий шаг</span>
            <select name="nextStep">
              ${NEXT_STEPS.map((step) => `<option value="${step}">${step}</option>`).join("")}
            </select>
          </label>
          <label><span>Индивидуальная программа</span><input name="customProgram" placeholder="Если выбрано Другое" /></label>
          <label class="full"><span>Комментарий</span><textarea name="comment" placeholder="Пожелания клиента, состав группы, важные детали"></textarea></label>
          <div class="form-actions">
            <button class="button secondary" type="button" data-action="closeModal">Отмена</button>
            <button class="button primary" type="submit">Создать заявку</button>
          </div>
        </form>
      </div>
    </div>
  `;
  const firstInput = modalRoot.querySelector("input");
  if (firstInput) firstInput.focus();
}

function openRequestEditModal(id) {
  const item = state.requests.find((request) => request.id === id);
  if (!item) return;
  const programs = getPrograms();
  const selectedIds = Array.isArray(item.programIds) ? item.programIds : [];
  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="editRequestTitle">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <span class="eyebrow">${escapeHtml(item.id)} · карточка клиента</span>
            <h3 id="editRequestTitle">Редактировать заявку</h3>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>
        <form id="editRequestForm" class="modal-form">
          <input type="hidden" name="requestId" value="${escapeHtml(item.id)}" />
          <label><span>Имя клиента</span><input name="name" required value="${escapeHtml(item.name)}" /></label>
          <label><span>Телефон</span><input name="phone" required value="${escapeHtml(item.phone)}" /></label>
          <label class="full"><span>Программы</span>
            <select name="programIds" multiple size="${Math.min(5, programs.length + 1)}">
              ${programs.map((program) => `<option value="${escapeHtml(program.id)}" ${selectedIds.includes(program.id) ? "selected" : ""}>${escapeHtml(program.title)} · ${escapeHtml(program.dates)}</option>`).join("")}
              <option value="custom" ${item.customProgram ? "selected" : ""}>Другое / индивидуальная программа</option>
            </select>
          </label>
          <label><span>Даты поездки</span><input name="dates" value="${escapeHtml(item.dates)}" /></label>
          <label><span>Проживание</span><input name="hotel" value="${escapeHtml(item.hotel || "")}" /></label>
          <label><span>Количество туристов</span><input name="pax" type="number" min="1" value="${escapeHtml(item.pax || 1)}" required /></label>
          <label><span>Бюджет</span><input name="budget" value="${escapeHtml(item.budget)}" /></label>
          <label><span>Оплачено</span><input name="paidAmount" value="${escapeHtml(item.paidAmount || "0 ₽")}" /></label>
          ${renderCostCalculatorFields(item)}
          <label><span>Оплата</span>
            <select name="paymentStatus">
              ${PAYMENT_STATUS.map((status) => `<option value="${escapeHtml(status)}" ${item.paymentStatus === status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
            </select>
          </label>
          <label><span>Документы</span>
            <select name="documentStatus">
              ${DOCUMENT_STATUS.map((status) => `<option value="${escapeHtml(status)}" ${item.documentStatus === status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
            </select>
          </label>
          <label><span>Ответственный</span>
            <select name="manager">
              ${MANAGERS.map((manager) => `<option value="${escapeHtml(manager)}" ${item.manager === manager ? "selected" : ""}>${escapeHtml(manager)}</option>`).join("")}
            </select>
          </label>
          <label><span>Приоритет</span>
            <select name="priority">
              ${["Средний", "Высокий", "Низкий"].map((priority) => `<option value="${priority}" ${item.priority === priority ? "selected" : ""}>${priority}</option>`).join("")}
            </select>
          </label>
          <label><span>Следующий шаг</span>
            <select name="nextStep">
              ${NEXT_STEPS.map((step) => `<option value="${escapeHtml(step)}" ${item.nextStep === step ? "selected" : ""}>${escapeHtml(step)}</option>`).join("")}
              ${NEXT_STEPS.includes(item.nextStep) ? "" : `<option value="${escapeHtml(item.nextStep)}" selected>${escapeHtml(item.nextStep)}</option>`}
            </select>
          </label>
          <label><span>Индивидуальная программа</span><input name="customProgram" value="${escapeHtml(item.customProgram || "")}" placeholder="Если выбрано Другое" /></label>
          <label class="full"><span>Комментарий</span><textarea name="comment">${escapeHtml(item.comment)}</textarea></label>
          <div class="form-actions">
            <button class="button secondary" type="button" data-action="closeModal">Отмена</button>
            <button class="button primary" type="submit">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  `;
  const firstInput = modalRoot.querySelector("input[name='name']");
  if (firstInput) firstInput.focus();
}

function closeModal() {
  modalRoot.innerHTML = "";
}

function closeDetail() {
  ui.selectedId = null;
  detailPanel.innerHTML = "";
  detailPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("panel-open");
}

function openRequest(id) {
  ui.selectedId = id;
  renderDetail();
}

function setBoardMode(mode) {
  ui.boardMode = mode;
  render();
}

function updateStatus(id, status) {
  const item = state.requests.find((request) => request.id === id);
  if (!item) return;
  item.status = status;
  addActivity(`${item.name}: статус изменен на "${getStatus(status).label}"`, { targetType: "request", targetId: item.id, targetView: "requests" });
  persist();
  render();
  toast("Статус обновлен.");
}

async function sendTemplate(id, templateId) {
  const item = state.requests.find((request) => request.id === id);
  const template = state.templates.find((entry) => entry.id === templateId);
  if (!item || !template) return;
  item.messages.unshift(template.text);
  addActivity(`${item.name}: отправлен шаблон "${template.title}"`, { targetType: "request", targetId: item.id, targetView: "requests" });
  persist();
  closeModal();
  renderDetail();
  render();
  const sent = await sendMaxMessageForRequest(item, template.text, template.title);
  if (sent) {
    addActivity(`${item.name}: шаблон "${template.title}" доставлен в MAX`, { targetType: "message", targetId: item.id, targetView: "requests" });
    persist();
    render();
    toast("Сообщение отправлено клиенту в MAX.");
  }
}

async function sendMaxMessageForRequest(item, text, title = "Сообщение", attachments = []) {
  if (!item?.chatId && !item?.userId) {
    toast("У заявки нет MAX-чата. Сообщение сохранено только в CRM.");
    return false;
  }
  try {
    const response = await fetch(MAX_SEND_API_URL, {
      method: "POST",
      cache: "no-store",
      credentials: "same-origin",
      headers: getSameOriginAuthHeaders({ "Content-Type": "application/json; charset=utf-8" }),
      body: JSON.stringify({
        chatId: item.chatId || "",
        userId: item.userId || "",
        text,
        title,
        requestId: item.id,
        sourceExternalId: item.sourceExternalId || "",
        attachments,
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok) throw new Error(payload.error || `HTTP ${response.status}`);
    return true;
  } catch (error) {
    addActivity(`${item.name}: не удалось отправить "${title}" в MAX`, { targetType: "message", targetId: item.id, targetView: "requests" });
    persist();
    render();
    toast(`MAX не принял сообщение: ${error.message}`);
    return false;
  }
}

function openTemplateRecipients(templateId) {
  const template = state.templates.find((entry) => entry.id === templateId);
  if (!template) return;
  const recipients = state.requests.filter((request) => request.chatId || request.userId);
  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="templateRecipientsTitle">
      <div class="modal-card metric-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">MAX</span>
            <h3 id="templateRecipientsTitle">${escapeHtml(template.title)}</h3>
            <p class="muted">${escapeHtml(template.text)}</p>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>
        <div class="metric-detail-list">
          ${recipients.map((request) => `
            <button class="metric-detail-row" type="button" data-action="sendTemplate" data-id="${escapeHtml(request.id)}" data-template="${escapeHtml(template.id)}">
              <span><strong>${escapeHtml(request.name)}</strong> ${escapeHtml(getRequestProgramTitle(request))}</span>
              <small>${escapeHtml(request.phone || "телефон не указан")} · ${escapeHtml(request.dates || "даты уточнить")}</small>
              <em class="badge teal">MAX</em>
            </button>
          `).join("") || `<div class="empty-state compact-empty">Нет заявок с MAX-чатом. Сначала клиент должен написать боту.</div>`}
        </div>
      </div>
    </div>
  `;
}

function assignManager(id) {
  const item = state.requests.find((request) => request.id === id);
  if (!item) return;
  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="managerTransferTitle">
      <div class="modal-card metric-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">${escapeHtml(item.id)} · передача заявки</span>
            <h3 id="managerTransferTitle">Выберите менеджера</h3>
            <p class="muted">${escapeHtml(item.name)} · сейчас ${escapeHtml(item.manager)}</p>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>
        <div class="metric-detail-list">
          ${MANAGERS.map((manager) => `
            <button class="metric-detail-row manager-choice ${item.manager === manager ? "active" : ""}" type="button" data-action="selectManager" data-id="${escapeHtml(item.id)}" data-manager="${escapeHtml(manager)}">
              <span><strong>${escapeHtml(manager)}</strong></span>
              <small>${item.manager === manager ? "текущий ответственный" : "передать заявку"}</small>
              <em class="badge ${item.manager === manager ? "teal" : "navy"}">${item.manager === manager ? "Сейчас" : "Выбрать"}</em>
            </button>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function selectManager(id, manager) {
  const item = state.requests.find((request) => request.id === id);
  if (!item || !manager) return;
  if (item.manager === manager) {
    closeModal();
    toast("Этот менеджер уже ответственный.");
    return;
  }
  const previous = item.manager;
  item.manager = manager;
  addActivity(`${item.name}: ответственный изменен с ${previous} на ${item.manager}`, { targetType: "request", targetId: item.id, targetView: "requests" });
  persist();
  closeModal();
  renderDetail();
  render();
  toast(`Заявка передана: ${item.manager}.`);
}

function addNote(id) {
  const item = state.requests.find((request) => request.id === id);
  const textarea = document.getElementById(`note-${id}`);
  const value = textarea ? textarea.value.trim() : "";
  if (!item || !value) {
    toast("Введите текст заметки.");
    return;
  }
  item.notes.unshift(value);
  addActivity(`${item.name}: добавлена заметка`, { targetType: "request", targetId: item.id, targetView: "requests" });
  persist();
  renderDetail();
  render();
  toast("Заметка сохранена.");
}

function createClientScenarioRequest() {
  const request = {
    id: nextId(),
    name: "Артем Сергеевич",
    phone: "+7 914 650-12-23",
    route: "Южно-Сахалинск + Буссе",
    programIds: ["busse-yuzhno"],
    dates: "30 июня - 3 июля",
    hotel: "Lotte Hotel",
    pax: 2,
    budget: "160 000 ₽",
    paidAmount: "0 ₽",
    costItems: { accommodation: "62 000 ₽", transport: "28 000 ₽", guides: "18 000 ₽", tickets: "9 000 ₽", reserve: "5 000 ₽" },
    calculationNote: "Расчет из MAX: проживание, трансфер из аэропорта, обзорная экскурсия и Буссе.",
    costAmount: "122 000 ₽",
    status: "new",
      source: "MAX бот",
      manager: "Алина",
      priority: "Высокий",
    paymentStatus: "Предоплата ожидается",
    documentStatus: "Запрошены",
    createdAt: "Только что",
    flightNo: "SU-1744",
    flightDate: "30.06.2026",
    flightTime: "09:15",
    flightDirection: "Прилёт",
    transferNeeded: true,
    preferredContact: "MAX",
    nextStep: "Подготовить предложение",
    comment: "Клиент отметил Буссе, обзорную экскурсию и трансфер из аэропорта.",
    tags: ["MAX", "Заявка", "Трансфер"],
    notes: [
      "Заявка создана из MAX.",
      "Автоматически включено отслеживание рейса SU-1744.",
      "Создана потребность в трансфере аэропорт - Lotte Hotel.",
    ],
    messages: ["Здравствуйте! Заявка получена, скоро отправим программу.", "Пожалуйста, пришлите паспортные данные туристов для оформления."],
  };
  state.requests.unshift(request);
  const transferTask = {
    id: `TT-${Date.now()}`,
    logisticsId: `max:${request.id}:${request.flightNo}`,
    requestId: request.id,
    client: request.name,
    pax: request.pax,
    hotel: request.hotel,
    flightKey: request.flightNo,
    flightNo: request.flightNo,
    city: "Москва",
    date: request.flightDate,
    time: request.flightTime,
    direction: "Встреча в аэропорту",
    status: "Новая задача",
    carId: "",
    createdAt: formatAirportUpdatedAt(new Date()),
  };
  state.transferTasks.unshift(transferTask);
  addActivity(`${request.name} оставил заявку через MAX`, { targetType: "request", targetId: request.id, targetView: "requests" });
  addActivity(`${request.name}: рейс ${request.flightNo} поставлен на отслеживание`, { targetType: "airport", targetId: request.flightNo, targetView: "arrivals" });
  addActivity(`${request.name}: создан трансфер из MAX`, { targetType: "transferTask", targetId: transferTask.id, targetView: "cars" });
  addActivity(`${request.name}: запрошены документы после заявки`, { targetType: "request", targetId: request.id, targetView: "requests" });
  persist();
  ui.view = "requests";
  syncNav();
  render();
  openRequest(request.id);
  toast("Заявка из MAX появилась в CRM.");
}

async function syncMaxInbox(options = {}) {
  const silent = options.silent !== false;
  try {
    const response = await fetch(MAX_REQUESTS_API_URL, {
      cache: "no-store",
      credentials: "same-origin",
      headers: getSameOriginAuthHeaders(),
    });
    if (DEBUG_MAX_SYNC) console.info("MAX sync response", response.status);
    if (!response.ok) {
      if (!silent && response.status !== 404) toast("MAX-входящие пока недоступны.");
      return [];
    }
    const payload = await response.json();
    if (DEBUG_MAX_SYNC) console.info("MAX sync payload", payload);
    const imported = importMaxInboxRequests(Array.isArray(payload.requests) ? payload.requests : []);
    if (DEBUG_MAX_SYNC) console.info("MAX sync imported", imported);
    if (imported.length) {
      persist();
      render();
      if (!silent) toast(`Из MAX добавлено заявок: ${imported.length}.`);
    }
    return imported;
  } catch (error) {
    if (DEBUG_MAX_SYNC) console.error("MAX sync failed", error);
    if (!silent) toast("MAX-входящие пока не отвечают.");
    return [];
  }
}

async function loadMaxBotStatus(options = {}) {
  const silent = options.silent !== false;
  maxBotStatus = { ...maxBotStatus, loading: true };
  if (ui.view === "settings") render();
  try {
    const response = await fetch(MAX_STATUS_API_URL, {
      cache: "no-store",
      credentials: "same-origin",
      headers: getSameOriginAuthHeaders(),
    });
    if (!response.ok) {
      if (!silent) toast("Статус MAX-бота пока недоступен.");
      maxBotStatus = { ...maxBotStatus, loading: false };
      if (ui.view === "settings") render();
      return;
    }
    const payload = await response.json();
    maxBotStatus = {
      ...maxBotStatus,
      ...payload,
      loading: false,
      runtime: payload.runtime || {},
      scenarioFields: Array.isArray(payload.scenarioFields) ? payload.scenarioFields : [],
      automations: Array.isArray(payload.automations) ? payload.automations : [],
    };
    if (!silent) toast("Статус MAX-бота обновлен.");
    if (ui.view === "settings") render();
  } catch (error) {
    maxBotStatus = { ...maxBotStatus, loading: false, runtime: { ...(maxBotStatus.runtime || {}), lastError: error.message } };
    if (!silent) toast("Не удалось получить статус MAX-бота.");
    if (ui.view === "settings") render();
  }
}

function importMaxInboxRequests(requests = []) {
  ensureStateShape();
  const imported = [];
  requests.slice().reverse().forEach((item) => {
    if (isImportedMaxRequest(item)) return;
    const request = buildRequestFromMaxInbox(item);
    state.requests.unshift(request);
    state.maxImportedExternalIds.unshift(request.sourceExternalId);
    state.maxImportedExternalIds = state.maxImportedExternalIds.slice(0, 200);
    const watched = ensureWatchedFlightFromMaxRequest(request, item);
    const transferTask = createTransferTaskFromMaxRequest(request, item);
    addActivity(`${request.name} оставил заявку через MAX`, { targetType: "request", targetId: request.id, targetView: "requests" });
    if (request.documentStatus === "Запрошены") {
      addActivity(`${request.name}: документы запрошены автоматически`, { targetType: "request", targetId: request.id, targetView: "requests" });
    }
    if (watched) {
      addActivity(`${request.name}: рейс ${request.flightNo} поставлен на контроль`, { targetType: "airport", targetId: request.flightNo, targetView: "arrivals" });
    }
    if (transferTask) {
      addActivity(`${request.name}: создана задача трансфера из MAX`, { targetType: "transferTask", targetId: transferTask.id, targetView: "cars" });
    }
    imported.push(request);
  });
  return imported;
}

function isImportedMaxRequest(item = {}) {
  const externalId = String(item.externalId || item.id || "").trim();
  if (!externalId) return false;
  return state.requests.some((request) => request.sourceExternalId === externalId);
}

function buildRequestFromMaxInbox(item = {}) {
  const programIds = findProgramIdsForMax(item.program, item.programId);
  const primaryProgram = programIds.length ? getPrograms().find((program) => program.id === programIds[0]) : null;
  const documentStatus = getMaxDocumentStatus(item);
  const route = cleanMaxValue(item.program) || primaryProgram?.title || "Программа уточняется";
  const dates = cleanMaxValue(item.dates) || primaryProgram?.dates || "Даты уточнить";
  const hotel = cleanMaxValue(item.hotel) || primaryProgram?.hotel || "Проживание уточнить";
  const budget = getMaxBudget(item);
  const flightNo = normalizeFlightNo(cleanMaxValue(item.flightNo));
  const transferNeeded = parseMaxBoolean(item.transferNeeded) || Boolean(flightNo);
  const request = {
    id: nextId(),
    sourceExternalId: String(item.externalId || item.id || `max-${Date.now()}`),
    chatId: String(item.chatId || ""),
    userId: String(item.userId || ""),
    name: cleanMaxValue(item.name) || "Клиент из MAX",
    phone: cleanMaxValue(item.phone),
    route,
    programIds,
    customProgram: programIds.length ? "" : route,
    dates,
    hotel,
    pax: Math.max(1, Number(item.pax || 1) || 1),
    budget,
    paidAmount: "0 ₽",
    costItems: normalizeCostItems({}),
    calculationNote: "",
    costAmount: "",
    status: "new",
    source: cleanMaxValue(item.source) || "MAX бот",
    manager: "Алина",
    priority: getMaxPriority(item, budget),
    paymentStatus: "Не обсуждали",
    documentStatus,
    createdAt: "Только что",
    flightNo,
    flightDate: cleanMaxValue(item.flightDate),
    flightTime: cleanMaxValue(item.flightTime),
    flightDirection: "Прилёт",
    transferNeeded,
    preferredContact: cleanMaxValue(item.preferredContact) || "MAX",
    nextStep: getMaxNextStep(item, documentStatus, Boolean(programIds.length || item.program), transferNeeded),
    comment: cleanMaxValue(item.comment || item.rawText) || "Клиент оставил заявку в MAX.",
    tags: ["MAX", "Заявка", item.priceReference ? "Цена" : "", flightNo ? "Рейс" : "", transferNeeded ? "Трансфер" : ""].filter(Boolean),
    notes: getMaxAutomationNotes(item, { flightNo, transferNeeded, documentStatus }),
    messages: [
      "Здравствуйте! Заявка получена, менеджер проверяет детали тура.",
      documentStatus === "Запрошены" ? "Пожалуйста, пришлите паспортные данные туристов для оформления." : "Документы отмечены как полученные, менеджер проверит их.",
    ],
  };
  request.documents = normalizeDocumentChecklist(request);
  request.documentStatus = getOverallDocumentStatus(request.documents);
  return request;
}

function findProgramIdsForMax(programText = "", explicitProgramId = "") {
  const explicit = cleanMaxValue(explicitProgramId);
  if (explicit && getPrograms().some((program) => program.id === explicit)) return [explicit];
  const value = cleanMaxValue(programText).toLowerCase();
  if (!value) return [];
  return getPrograms()
    .filter((program) => {
      const title = String(program.title || "").toLowerCase();
      const summary = String(program.summary || program.description || "").toLowerCase();
      return value.includes(title) || title.includes(value) || value.split(/\s+/).filter((word) => word.length > 3).some((word) => title.includes(word) || summary.includes(word));
    })
    .map((program) => program.id);
}

function getMaxPriority(item = {}, budget = "") {
  const amount = parseMoneyValue(budget);
  if (parseMaxBoolean(item.transferNeeded) || item.flightNo || Number(item.pax || 0) >= 4 || amount >= 300000) return "Высокий";
  return "Средний";
}

function getMaxDocumentStatus(item = {}) {
  const text = cleanMaxValue(item.documents || item.documentStatus).toLowerCase();
  if (/провер|verified/.test(text)) return "Проверены";
  if (/получ|готов|отправ|sent|yes|да/.test(text) && !/не|нет|no/.test(text)) return "Получены";
  return "Запрошены";
}

function getMaxNextStep(item = {}, documentStatus = "", hasProgram = false, transferNeeded = false) {
  if (!item.phone) return "Связаться с клиентом";
  if (!hasProgram) return "Подобрать программу";
  if (documentStatus === "Запрошены") return "Запросить паспортные данные";
  if (transferNeeded) return "Создать задачи трансфера";
  return "Подготовить предложение";
}

function getMaxBudget(item = {}) {
  const value = cleanMaxValue(item.budget);
  if (!value) return "Не указан";
  if (/^\d+$/.test(value.replace(/\s+/g, ""))) return formatMoneyInput(Number(value.replace(/\s+/g, "")));
  return value;
}

function getMaxAutomationNotes(item = {}, flags = {}) {
  const notes = ["Заявка создана из MAX."];
  if (item.priceReference) notes.push(`Бот показал клиенту ориентир цены: ${cleanMaxValue(item.priceReference)}.`);
  if (Array.isArray(item.signals) && item.signals.length) notes.push(`Сигналы из диалога: ${item.signals.map(cleanMaxValue).filter(Boolean).join("; ")}.`);
  if (flags.documentStatus === "Запрошены") notes.push("Поставлена задача запросить документы.");
  if (flags.flightNo) notes.push(`Рейс ${flags.flightNo} поставлен на контроль для логистики.`);
  if (flags.transferNeeded) notes.push("Создана потребность в трансфере, автомобиль можно назначить в разделе Автомобили.");
  const comment = cleanMaxValue(item.comment || item.rawText);
  if (comment) notes.push(`Комментарий клиента: ${comment}`);
  return notes;
}

function ensureWatchedFlightFromMaxRequest(request, item = {}) {
  if (!request.flightNo) return null;
  const date = request.flightDate || request.dates || formatDisplayDate(formatDateInput(new Date()));
  const alreadyWatched = state.watchedFlights.some((flight) => flight.no === request.flightNo && flight.date === date);
  if (alreadyWatched) return null;
  const watched = {
    id: `WF-MAX-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    no: request.flightNo,
    city: cleanMaxValue(item.flightCity || item.city) || "город уточнить",
    date,
    time: request.flightTime || "время уточнить",
    direction: request.flightDirection || "Прилёт",
    status: "Ожидаем",
    statusTone: "navy",
    source: "MAX бот",
    lastSeenAt: formatAirportUpdatedAt(new Date()),
  };
  state.watchedFlights.unshift(watched);
  return watched;
}

function createTransferTaskFromMaxRequest(request, item = {}) {
  if (!request.transferNeeded && !request.flightNo) return null;
  const logisticsId = `max:${request.id}:${request.flightNo || request.sourceExternalId}`;
  const exists = state.transferTasks.some((task) => task.logisticsId === logisticsId || task.requestId === request.id);
  if (exists) return null;
  const task = {
    id: `TT-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    logisticsId,
    requestId: request.id,
    client: request.name,
    pax: request.pax,
    hotel: request.hotel,
    flightKey: request.flightNo || "",
    flightNo: request.flightNo || "рейс уточнить",
    city: cleanMaxValue(item.flightCity || item.city) || "",
    date: request.flightDate || request.dates,
    time: request.flightTime || "",
    direction: request.flightNo ? "Встреча в аэропорту" : "Трансфер по заявке",
    status: "Новая задача",
    carId: "",
    createdAt: formatAirportUpdatedAt(new Date()),
  };
  state.transferTasks.unshift(task);
  return task;
}

function parseMaxBoolean(value) {
  if (typeof value === "boolean") return value;
  const text = cleanMaxValue(value).toLowerCase();
  return /^(1|true|yes|да|нужен|нужна|трансфер)$/i.test(text) || /нужен|нужна|да|yes|true/.test(text);
}

function cleanMaxValue(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function buildRequestFromForm(formData) {
  const selectedProgramIds = formData.getAll("programIds").map(String);
  const customProgram = String(formData.get("customProgram") || "").trim();
  const selectedPrograms = selectedProgramIds
    .filter((id) => id !== "custom")
    .map((id) => getPrograms().find((program) => program.id === id))
    .filter(Boolean);
  const usesCustomProgram = selectedProgramIds.includes("custom") || customProgram;
  const route = [
    ...selectedPrograms.map((program) => program.title),
    usesCustomProgram ? customProgram || "Индивидуальная программа" : "",
  ].filter(Boolean).join(" + ") || "Программа не выбрана";
  const fallbackProgram = selectedPrograms[0];
  const dates = String(formData.get("dates") || "").trim() || fallbackProgram?.dates || "Даты уточнить";
  const hotel = String(formData.get("hotel") || "").trim() || fallbackProgram?.hotel || "Проживание уточнить";
  const comment = String(formData.get("comment") || "").trim();
  const costItems = normalizeCostItems(collectCostItemsFromForm(formData));
  const costTotal = getCostItemsTotal(costItems);

  return {
    id: nextId(),
    name: String(formData.get("name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    route,
    programIds: selectedPrograms.map((program) => program.id),
    customProgram: usesCustomProgram ? customProgram || "Индивидуальная программа" : "",
    dates,
    hotel,
    pax: Number(formData.get("pax") || 1),
    budget: String(formData.get("budget") || "Не указан").trim(),
    paidAmount: String(formData.get("paidAmount") || "0 ₽").trim(),
    costItems,
    calculationNote: String(formData.get("calculationNote") || "").trim(),
    costAmount: hasCostItems(costItems) ? formatMoneyInput(costTotal) : "",
    paymentStatus: String(formData.get("paymentStatus") || "Не обсуждали").trim(),
    documentStatus: String(formData.get("documentStatus") || "Не запрошены").trim(),
    status: "new",
    source: "Админка",
    manager: String(formData.get("manager") || "Без ответственного"),
    priority: String(formData.get("priority") || "Средний"),
    createdAt: "Только что",
    nextStep: String(formData.get("nextStep") || "Связаться с клиентом").trim(),
    comment: comment || "Комментарий не добавлен",
    tags: ["Ручная заявка"],
    notes: [],
    messages: [],
  };
}

function saveRequestFromForm(formData) {
  const id = String(formData.get("requestId") || "");
  const item = state.requests.find((request) => request.id === id);
  if (!item) return;
  const fields = buildRequestFromForm(formData);
  Object.assign(item, {
    name: fields.name,
    phone: fields.phone,
    route: fields.route,
    programIds: fields.programIds,
    customProgram: fields.customProgram,
    dates: fields.dates,
    hotel: fields.hotel,
    pax: fields.pax,
    budget: fields.budget,
    paidAmount: fields.paidAmount,
    costItems: fields.costItems,
    calculationNote: fields.calculationNote,
    costAmount: fields.costAmount,
    manager: fields.manager,
    priority: fields.priority,
    paymentStatus: fields.paymentStatus,
    documentStatus: fields.documentStatus,
    nextStep: fields.nextStep,
    comment: fields.comment,
  });
  addActivity(`${item.name}: карточка заявки отредактирована`, { targetType: "request", targetId: item.id, targetView: "requests" });
  persist();
  closeModal();
  renderDetail();
  render();
  toast("Карточка заявки сохранена.");
}

function getPrograms() {
  return Array.isArray(state.programs) ? state.programs : initialData.programs;
}

function mergeProgramDefaults(program = {}, defaults = {}) {
  return {
    ...defaults,
    ...program,
    cover: program.cover || defaults.cover || "",
    summary: preferProgramText(program.summary || program.description, defaults.summary || defaults.description),
    description: preferProgramText(program.description || program.summary, defaults.description || defaults.summary),
    includes: normalizeLines(program.includes, normalizeLines(defaults.includes, [])),
    priceIncludes: normalizeLines(program.priceIncludes, normalizeLines(defaults.priceIncludes, normalizeLines(defaults.includes, []))),
    priceExcludes: normalizeLines(program.priceExcludes, normalizeLines(defaults.priceExcludes, [])),
    priceExtras: normalizeLines(program.priceExtras, normalizeLines(defaults.priceExtras, [])),
    itinerary: normalizeLines(program.itinerary, normalizeLines(defaults.itinerary, [])),
    photos: normalizeLines(program.photos, normalizeLines(defaults.photos, [])),
    videos: normalizeLines(program.videos, normalizeLines(defaults.videos, [])),
    files: normalizeLines(program.files, normalizeLines(defaults.files, [])),
  };
}

function preferProgramText(value, fallback = "") {
  const text = String(value || "").trim();
  const normalized = normalizeSearch(text);
  if (!text || normalized === "краткое описание программы" || normalized === "описание программы для клиента") {
    return String(fallback || "").trim();
  }
  return text;
}

function filteredPrograms() {
  const programs = getPrograms();
  const query = normalizeSearch(ui.search);
  if (!query) return programs;
  return programs.filter((program) => {
    const haystack = [
      program.title,
      program.summary,
      program.dates,
      program.duration,
      program.hotel,
      program.price,
      program.status,
      ...(Array.isArray(program.highlights) ? program.highlights : []),
      ...(Array.isArray(program.includes) ? program.includes : []),
      ...(Array.isArray(program.priceIncludes) ? program.priceIncludes : []),
      ...(Array.isArray(program.priceExcludes) ? program.priceExcludes : []),
      ...(Array.isArray(program.priceExtras) ? program.priceExtras : []),
    ].join(" ");
    return normalizeSearch(haystack).includes(query);
  });
}

function getProgramCover(program = {}) {
  const photos = normalizeLines(program.photos, []);
  return String(program.cover || photos[0] || "").trim();
}

function normalizeProgram(program = {}, index = 0) {
  const title = program.title || `Новая программа ${index + 1}`;
  return {
    id: program.id || nextProgramId(),
    title,
    dates: program.dates || "Даты уточнить",
    duration: program.duration || "1 день",
    hotel: program.hotel || "Проживание уточнить",
    status: program.status || "Черновик",
    price: program.price || "По запросу",
    manager: program.manager || "Алина",
    cover: program.cover || "",
    summary: program.summary || program.description || "Краткое описание программы.",
    description: program.description || program.summary || "Описание программы для клиента.",
    includes: normalizeLines(program.includes, ["Маршрут и сопровождение", "Подбор проживания", "Связь с менеджером"]),
    priceIncludes: normalizeLines(program.priceIncludes, normalizeLines(program.includes, ["Программа по дням", "Сопровождение менеджера", "Базовая логистика"])),
    priceExcludes: normalizeLines(program.priceExcludes, ["Авиабилеты", "Личные расходы", "Питание вне программы"]),
    priceExtras: normalizeLines(program.priceExtras, ["Индивидуальный трансфер", "Дополнительная экскурсия", "Повышение категории отеля"]),
    itinerary: normalizeLines(program.itinerary, ["День 1: встреча и старт программы"]),
    photos: normalizeLines(program.photos, []),
    videos: normalizeLines(program.videos, []),
    files: normalizeLines(program.files, []),
  };
}

function normalizeLines(value, fallback = []) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) return parseLines(value);
  return fallback;
}

function parseLines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(value) {
  return normalizeLines(value, []).join("\n");
}

function nextProgramId() {
  return `program-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function programMaterialCount(program) {
  return (program.cover ? 1 : 0) + normalizeLines(program.photos, []).length + normalizeLines(program.videos, []).length + normalizeLines(program.files, []).length;
}

function isFilledFile(file) {
  return file && typeof file === "object" && file.name && Number(file.size || 0) > 0;
}

async function uploadSelectedFiles(formData, fieldNames) {
  const payload = new FormData();
  let count = 0;
  fieldNames.forEach((fieldName) => {
    formData.getAll(fieldName).forEach((file) => {
      if (!isFilledFile(file)) return;
      payload.append(fieldName, file, file.name);
      count += 1;
    });
  });
  if (!count) return [];

  const response = await fetch(apiUrl("/api/uploads"), {
    method: "POST",
    body: payload,
    credentials: "same-origin",
    headers: getSameOriginAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`upload failed: ${response.status}`);
  }
  const result = await response.json();
  return Array.isArray(result.files) ? result.files : [];
}

function materialLabel(file) {
  return `${file.name} — ${file.url}`;
}

function extractMaterialUrl(value) {
  const text = String(value || "");
  const match = text.match(/(https?:\/\/[^\s]+|\/uploads\/[^\s]+)/i);
  return match ? match[1].replace(/[),.]+$/, "") : "";
}

function materialTitle(value) {
  const text = String(value || "").trim();
  const url = extractMaterialUrl(text);
  if (!url) return text;
  const label = text.replace(url, "").replace(/[—-]+/g, "").trim();
  if (label) return label;
  const fileName = url.split("/").pop() || url;
  try {
    return decodeURIComponent(fileName);
  } catch {
    return fileName;
  }
}

function openProgramEditModal(programId = "") {
  const existing = getPrograms().find((program) => program.id === programId);
  const program = normalizeProgram(existing || {
    title: "",
    dates: "",
    duration: "",
    hotel: "",
    price: "",
    status: "Черновик",
    summary: "",
    description: "",
    includes: [],
    priceIncludes: [],
    priceExcludes: [],
    priceExtras: [],
    itinerary: [],
    photos: [],
    videos: [],
    files: [],
  });
  const isEdit = Boolean(existing);
  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="programFormTitle">
      <div class="modal-card program-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Справочник программ</span>
            <h3 id="programFormTitle">${isEdit ? "Редактировать программу" : "Новая программа"}</h3>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>
        <form id="programForm" class="modal-form">
          <input type="hidden" name="programId" value="${isEdit ? escapeHtml(program.id) : ""}" />
          <label><span>Название</span><input name="title" required value="${escapeHtml(program.title)}" placeholder="Например: Сахалин на 5 дней" /></label>
          <label><span>Статус</span>
            <select name="status">
              ${["Черновик", "В работе", "Готова", "Сбор данных"].map((status) => `<option value="${status}" ${program.status === status ? "selected" : ""}>${status}</option>`).join("")}
            </select>
          </label>
          <label><span>Даты</span><input name="dates" value="${escapeHtml(program.dates)}" placeholder="12-16 июля" /></label>
          <label><span>Длительность</span><input name="duration" value="${escapeHtml(program.duration)}" placeholder="5 дней" /></label>
          <label><span>Проживание</span><input name="hotel" value="${escapeHtml(program.hotel)}" placeholder="Отель / район / формат" /></label>
          <label><span>Стоимость</span><input name="price" value="${escapeHtml(program.price)}" placeholder="от 180 000 ₽" /></label>
          <label><span>Ответственный</span>
            <select name="manager">
              ${MANAGERS.map((manager) => `<option value="${escapeHtml(manager)}" ${program.manager === manager ? "selected" : ""}>${escapeHtml(manager)}</option>`).join("")}
            </select>
          </label>
          <label><span>Обложка - ссылка</span><input name="cover" value="${escapeHtml(program.cover)}" placeholder="https:// или /uploads/..." /></label>
          <label><span>Обложка - файл</span><input name="coverUpload" type="file" accept="image/*" /></label>
          <label class="full"><span>Короткое описание</span><textarea name="summary" placeholder="Одна-две строки для карточки">${escapeHtml(program.summary)}</textarea></label>
          <label class="full"><span>Полное описание</span><textarea name="description" placeholder="Описание, которое можно отправить клиенту">${escapeHtml(program.description)}</textarea></label>
          <label class="full"><span>Входит в стоимость</span><textarea name="priceIncludes" placeholder="Проживание, экскурсии, гид, трансферы...">${escapeHtml(joinLines(program.priceIncludes))}</textarea></label>
          <label class="full"><span>Оплачивается отдельно</span><textarea name="priceExcludes" placeholder="Авиабилеты, питание вне программы, личные расходы...">${escapeHtml(joinLines(program.priceExcludes))}</textarea></label>
          <label class="full"><span>Доплаты и опции</span><textarea name="priceExtras" placeholder="Дополнительная экскурсия - 8 000 ₽, повышение отеля - по запросу">${escapeHtml(joinLines(program.priceExtras))}</textarea></label>
          <label class="full"><span>План по дням</span><textarea name="itinerary" placeholder="День 1: ...">${escapeHtml(joinLines(program.itinerary))}</textarea></label>
          <label class="full"><span>Фото - ссылки</span><textarea name="photos" placeholder="Ссылки или названия фото, каждое с новой строки">${escapeHtml(joinLines(program.photos))}</textarea></label>
          <label class="full"><span>Загрузить фото</span><input name="photoUploads" type="file" multiple accept="image/*" /></label>
          <label class="full"><span>Видео - ссылки</span><textarea name="videos" placeholder="Ссылки на видео, каждое с новой строки">${escapeHtml(joinLines(program.videos))}</textarea></label>
          <label class="full"><span>Загрузить видео</span><input name="videoUploads" type="file" multiple accept="video/*" /></label>
          <label class="full"><span>Файлы и PDF - ссылки</span><textarea name="files" placeholder="PDF, презентации, документы">${escapeHtml(joinLines(program.files))}</textarea></label>
          <label class="full"><span>Загрузить PDF / документы</span><input name="fileUploads" type="file" multiple accept=".pdf,.doc,.docx,application/pdf" /></label>
          <div class="form-actions">
            <button class="button secondary" type="button" data-action="closeModal">Отмена</button>
            <button class="button primary" type="submit">Сохранить программу</button>
          </div>
        </form>
      </div>
    </div>
  `;
  const firstInput = modalRoot.querySelector("input[name='title']");
  if (firstInput) firstInput.focus();
}

function buildProgramFromForm(formData, existing = {}, uploads = []) {
  const coverUpload = uploads.find((file) => file.fieldName === "coverUpload");
  const uploadedPhotos = uploads.filter((file) => file.fieldName === "photoUploads").map(materialLabel);
  const uploadedVideos = uploads.filter((file) => file.fieldName === "videoUploads").map(materialLabel);
  const uploadedFiles = uploads.filter((file) => file.fieldName === "fileUploads").map(materialLabel);
  const includedInPrice = parseLines(formData.get("priceIncludes"));
  return normalizeProgram({
    ...existing,
    id: existing.id || String(formData.get("programId") || "") || nextProgramId(),
    title: String(formData.get("title") || "").trim(),
    status: String(formData.get("status") || "Черновик").trim(),
    dates: String(formData.get("dates") || "").trim(),
    duration: String(formData.get("duration") || "").trim(),
    hotel: String(formData.get("hotel") || "").trim(),
    price: String(formData.get("price") || "").trim(),
    manager: String(formData.get("manager") || "Алина").trim(),
    cover: coverUpload ? materialLabel(coverUpload) : String(formData.get("cover") || "").trim(),
    summary: String(formData.get("summary") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    includes: includedInPrice,
    priceIncludes: includedInPrice,
    priceExcludes: parseLines(formData.get("priceExcludes")),
    priceExtras: parseLines(formData.get("priceExtras")),
    itinerary: parseLines(formData.get("itinerary")),
    photos: [...parseLines(formData.get("photos")), ...uploadedPhotos],
    videos: [...parseLines(formData.get("videos")), ...uploadedVideos],
    files: [...parseLines(formData.get("files")), ...uploadedFiles],
  });
}

async function saveProgramFromForm(formData) {
  const id = String(formData.get("programId") || "");
  const index = state.programs.findIndex((program) => program.id === id);
  const existing = index >= 0 ? state.programs[index] : {};
  if (!String(formData.get("title") || "").trim()) {
    toast("Введите название программы.");
    return;
  }
  let uploads = [];
  try {
    uploads = await uploadSelectedFiles(formData, ["coverUpload", "photoUploads", "videoUploads", "fileUploads"]);
  } catch {
    toast("Файлы не загрузились. Проверьте локальный сервер и попробуйте еще раз.");
    return;
  }
  const program = buildProgramFromForm(formData, existing, uploads);
  if (index >= 0) {
    state.programs[index] = program;
    addActivity(`Программа "${program.title}" обновлена`, { targetType: "program", targetId: program.id, targetView: "program" });
  } else {
    state.programs.unshift(program);
    addActivity(`Создана новая программа "${program.title}"`, { targetType: "program", targetId: program.id, targetView: "program" });
  }
  persist();
  closeModal();
  render();
  toast("Программа сохранена.");
}

function openProgramPreviewModal(programId) {
  const program = getPrograms().find((item) => item.id === programId);
  if (!program) return;
  const message = buildProgramClientMessage(program);
  const clientOptions = state.requests.map((request) => `<option value="${escapeHtml(request.id)}">${escapeHtml(request.name)} · ${escapeHtml(request.phone)} · ${escapeHtml(getRequestProgramTitle(request))}</option>`).join("");
  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="programPreviewTitle">
      <div class="modal-card program-preview-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Предпросмотр отправки</span>
            <h3 id="programPreviewTitle">${escapeHtml(program.title)}</h3>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>
        <div class="program-preview">
          <section class="program-send-panel">
            <label>
              <span>Клиент</span>
              <select id="program-send-client-${escapeHtml(program.id)}">
                <option value="">Без привязки к клиенту</option>
                ${clientOptions}
              </select>
            </label>
            <label>
              <span>Канал</span>
              <select id="program-send-channel-${escapeHtml(program.id)}">
                <option value="MAX">MAX</option>
                <option value="Telegram">Telegram</option>
                <option value="Ссылка">Ссылка клиенту</option>
              </select>
            </label>
          </section>
          <section class="program-message">
            <strong>Сообщение клиенту</strong>
            <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
          </section>
          <section class="program-materials">
            <strong>Материалы</strong>
            ${renderProgramMaterials(program)}
          </section>
        </div>
        <div class="form-actions">
          <button class="button secondary" type="button" data-action="openProgramEdit" data-program-id="${escapeHtml(program.id)}">${iconSvg("edit", "button-icon")}<span>Редактировать</span></button>
          <button class="button primary" type="button" data-action="sendProgramToClient" data-program-id="${escapeHtml(program.id)}">Отправить</button>
        </div>
      </div>
    </div>
  `;
}

function buildProgramMessage(program) {
  const priceIncludes = normalizeLines(program.priceIncludes, []).map((item) => `• ${item}`).join("\n");
  const priceExcludes = normalizeLines(program.priceExcludes, []).map((item) => `• ${item}`).join("\n");
  const priceExtras = normalizeLines(program.priceExtras, []).map((item) => `• ${item}`).join("\n");
  const itinerary = normalizeLines(program.itinerary, []).map((item) => `• ${item}`).join("\n");
  return [
    program.title,
    `${program.dates} · ${program.duration}`,
    `Стоимость: ${program.price}`,
    `Проживание: ${program.hotel}`,
    "",
    program.description,
    priceIncludes ? `\nВ стоимость включено:\n${priceIncludes}` : "",
    priceExcludes ? `\nОплачивается отдельно:\n${priceExcludes}` : "",
    priceExtras ? `\nДоплаты и опции:\n${priceExtras}` : "",
    itinerary ? `\nПлан:\n${itinerary}` : "",
  ].filter(Boolean).join("\n");
}

function buildProgramClientMessage(program) {
  const includes = normalizeLines(program.priceIncludes || program.includes, []).slice(0, 4).map((item) => `• ${item}`).join("\n");
  const itinerary = normalizeLines(program.itinerary, []).slice(0, 3).map((item) => `• ${item}`).join("\n");
  const extras = normalizeLines(program.priceExcludes || program.priceExtras, []).slice(0, 3).map((item) => `• ${item}`).join("\n");
  return [
    `🌊 ${program.title}`,
    `${program.duration} · ${program.price}`,
    "",
    program.summary || program.description,
    includes ? `\nВ стоимость включено:\n${includes}` : "",
    itinerary ? `\nМаршрут:\n${itinerary}` : "",
    extras ? `\nОбычно отдельно:\n${extras}` : "",
    "",
    "Ниже можно открыть программу с фото, маршрутом по дням и деталями.",
  ].filter(Boolean).join("\n");
}

function buildProgramPublicUrl(program) {
  return new URL(`/program.html?tour=${encodeURIComponent(program.id)}`, window.location.origin).href;
}

function toAbsolutePublicUrl(value) {
  const raw = extractMaterialUrl(value) || value || "";
  if (!raw) return "";
  try {
    return new URL(raw, window.location.origin).href;
  } catch {
    return "";
  }
}

function buildProgramMaxAttachments(program) {
  const attachments = [];
  const coverUrl = toAbsolutePublicUrl(getProgramCover(program));
  if (coverUrl) {
    attachments.push({
      type: "image",
      payload: {
        url: coverUrl,
      },
    });
  }
  attachments.push({
    type: "inline_keyboard",
    payload: {
      buttons: [
        [{
          type: "link",
          text: "Открыть программу",
          url: buildProgramPublicUrl(program),
        }],
        [{
          type: "callback",
          text: "Хочу расчет",
          payload: `расчет:${program.id}`,
        }],
      ],
    },
  });
  return attachments;
}

function renderProgramMaterials(program) {
  const groups = [
    ["Фото", normalizeLines(program.photos, [])],
    ["Видео", normalizeLines(program.videos, [])],
    ["Файлы", normalizeLines(program.files, [])],
  ];
  const coverUrl = extractMaterialUrl(program.cover);
  const cover = program.cover
    ? coverUrl
      ? `<a class="badge" href="${escapeHtml(coverUrl)}" target="_blank" rel="noreferrer">Обложка · ${escapeHtml(materialTitle(program.cover))}</a>`
      : `<span class="badge">Обложка · ${escapeHtml(materialTitle(program.cover))}</span>`
    : "";
  const content = groups.map(([label, items]) => items.map((item) => {
    const url = extractMaterialUrl(item);
    const text = `${label} · ${materialTitle(item)}`;
    return url
      ? `<a class="badge" href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(text)}</a>`
      : `<span class="badge">${escapeHtml(text)}</span>`;
  }).join("")).join("");
  return cover || content ? `<div class="program-material-list">${cover}${content}</div>` : `<p class="muted">Материалы пока не добавлены.</p>`;
}

async function markProgramSent(programId) {
  const program = getPrograms().find((item) => item.id === programId);
  if (!program) return;
  const channel = document.getElementById(`program-send-channel-${programId}`)?.value || "MAX";
  const requestId = document.getElementById(`program-send-client-${programId}`)?.value || "";
  const request = state.requests.find((item) => item.id === requestId);
  const message = buildProgramClientMessage(program);
  if (request) {
    request.messages.unshift(message);
  }
  addActivity(`Программа "${program.title}" подготовлена к отправке: ${channel}${request ? ` · ${request.name}` : ""}`, request ? { targetType: "request", targetId: request.id, targetView: "requests" } : { targetType: "program", targetId: program.id, targetView: "program" });
  persist();
  closeModal();
  renderDetail();
  render();
  if (request && channel === "MAX") {
    const sent = await sendMaxMessageForRequest(request, message, `Программа: ${program.title}`, buildProgramMaxAttachments(program));
    if (sent) {
      addActivity(`${request.name}: программа "${program.title}" доставлена в MAX`, { targetType: "message", targetId: request.id, targetView: "requests" });
      persist();
      render();
      toast(`Программа отправлена в MAX: ${request.name}.`);
      return;
    }
  }
  toast(request ? `Программа готова к отправке: ${channel}, ${request.name}.` : `Программа готова к отправке: ${channel}.`);
}

function getRequestPrograms(request) {
  const ids = Array.isArray(request.programIds) ? request.programIds : [];
  return ids.map((id) => getPrograms().find((program) => program.id === id)).filter(Boolean);
}

function getRequestProgramTitle(request) {
  const titles = getRequestPrograms(request).map((program) => program.title);
  if (request.customProgram) titles.push(request.customProgram);
  return titles.join(" + ") || request.route || "Программа не выбрана";
}

function updateNextStep(id) {
  const item = state.requests.find((request) => request.id === id);
  const select = document.getElementById(`next-step-${id}`);
  const value = select ? select.value : "";
  if (!item || !value) {
    toast("Выберите следующий шаг.");
    return;
  }
  item.nextStep = value;
  addActivity(`${item.name}: следующий шаг - ${value}`, { targetType: "request", targetId: item.id, targetView: "requests" });
  persist();
  renderDetail();
  render();
  toast("Следующий шаг сохранен.");
}

function addActivity(text, target = {}) {
  const activity = normalizeActivity({
    id: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    text,
    createdAt: new Date().toISOString(),
    ...target,
  });
  state.activities.unshift(activity);
  state.activities = state.activities.slice(0, 60);
}

function getActivities() {
  state.activities = (Array.isArray(state.activities) ? state.activities : []).map((activity, index) => normalizeActivity(activity, index));
  return state.activities;
}

function normalizeActivity(activity, index = 0) {
  if (typeof activity === "string") {
    const inferred = inferActivityTarget(activity);
    return {
      id: `legacy-${index}-${slugify(activity).slice(0, 28)}`,
      text: activity,
      createdAt: "",
      ...inferred,
    };
  }
  const text = String(activity?.text || activity?.message || "Событие CRM").trim();
  const inferred = inferActivityTarget(text);
  return {
    id: String(activity?.id || `activity-${index}-${slugify(text).slice(0, 28)}`),
    text,
    createdAt: activity?.createdAt || "",
    targetType: activity?.targetType || inferred.targetType,
    targetId: activity?.targetId || inferred.targetId,
    targetView: activity?.targetView || inferred.targetView,
  };
}

function inferActivityTarget(text) {
  const value = String(text || "").toLowerCase();
  const request = state.requests?.find((item) => {
    const parts = String(item.name || "").toLowerCase().split(/\s+/).filter((part) => part.length > 2);
    const roots = parts.map((part) => part.slice(0, Math.min(part.length, 5))).filter((part) => part.length >= 4);
    return value.includes(String(item.name || "").toLowerCase()) || parts.some((part) => value.includes(part)) || roots.some((part) => value.includes(part));
  });
  if (request) return { targetType: "request", targetId: request.id, targetView: "requests" };

  const task = state.transferTasks?.find((item) => value.includes(String(item.flightNo || "").toLowerCase()) || value.includes(String(item.client || "").toLowerCase()));
  if (task) return { targetType: "transferTask", targetId: task.id, targetView: "cars" };

  const car = state.cars?.find((item) => {
    const labels = [item.driver, item.plate, item.brand, item.model].map((part) => String(part || "").toLowerCase()).filter(Boolean);
    return labels.some((label) => value.includes(label));
  });
  if (car) return { targetType: "car", targetId: car.id, targetView: "cars" };

  const program = state.programs?.find((item) => value.includes(String(item.title || "").toLowerCase()));
  if (program) return { targetType: "program", targetId: program.id, targetView: "program" };

  if (/трансфер|машин|автомоб|рейс|вылет|прилет|прилёт/i.test(text)) return { targetType: "airport", targetId: "", targetView: "arrivals" };
  return { targetType: "journal", targetId: "", targetView: "journal" };
}

function renderActivityButton(activity, index, className) {
  const item = normalizeActivity(activity, index);
  return `
    <button class="${className} activity-action" type="button" data-action="openActivity" data-activity-id="${escapeHtml(item.id)}">
      <span>
        <strong>${escapeHtml(item.text)}</strong>
        <time>${formatActivityTime(item, index)}</time>
      </span>
      <em>${escapeHtml(getActivityTargetLabel(item))}</em>
    </button>
  `;
}

function formatActivityTime(activity, index) {
  if (activity.createdAt) {
    const date = new Date(activity.createdAt);
    if (!Number.isNaN(date.getTime())) return formatAirportUpdatedAt(date);
  }
  return index === 0 ? "Только что" : `${index + 1} ч назад`;
}

function getActivityTargetLabel(activity) {
  if (activity.targetType === "request") return "Заявка";
  if (activity.targetType === "transferTask") return "Трансфер";
  if (activity.targetType === "car") return "Авто";
  if (activity.targetType === "program") return "Тур";
  if (activity.targetType === "airport") return "Табло";
  if (activity.targetType === "transport") return "Транспорт";
  if (activity.targetType === "message") return "Сообщение";
  if (activity.targetType === "finance") return "Финансы";
  return "Журнал";
}

function openActivityTarget(activityId) {
  const activity = getActivities().find((item) => item.id === activityId);
  if (!activity) return;
  closeModal();
  closeDetail();
  if (activity.targetType === "request" && activity.targetId) {
    ui.view = "requests";
    render();
    openRequest(activity.targetId);
    resetPageScroll();
    return;
  }
  if (["message", "finance"].includes(activity.targetType) && activity.targetId) {
    ui.view = activity.targetView || "requests";
    render();
    if (ui.view === "requests") openRequest(activity.targetId);
    resetPageScroll();
    return;
  }
  if (activity.targetType === "transferTask" && activity.targetId) {
    ui.view = "cars";
    render();
    openTransferTaskModal(activity.targetId);
    resetPageScroll();
    return;
  }
  if (activity.targetType === "car" && activity.targetId) {
    ui.view = "cars";
    render();
    openCarModal(activity.targetId);
    resetPageScroll();
    return;
  }
  if (activity.targetType === "program") {
    ui.view = "program";
    render();
    resetPageScroll();
    return;
  }
  if (activity.targetType === "airport") {
    ui.view = activity.targetView === "departures" ? "departures" : "arrivals";
    ui.airportMode = ui.view;
    render();
    loadAirportBoard();
    resetPageScroll();
    return;
  }
  ui.view = activity.targetView || "journal";
  render();
  resetPageScroll();
}

function slugify(value) {
  return String(value || "").toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-").replace(/^-|-$/g, "");
}

function getDefaultPaymentStatus(statusId) {
  if (statusId === "booked" || statusId === "closed") return "Предоплата внесена";
  if (statusId === "offer" || statusId === "wait") return "Предоплата ожидается";
  return "Не обсуждали";
}

function getDefaultDocumentStatus(statusId) {
  if (statusId === "booked" || statusId === "closed") return "Получены";
  if (statusId === "offer" || statusId === "wait") return "Запрошены";
  return "Не запрошены";
}

function getPaymentTone(status) {
  if (status === "Оплачено" || status === "Предоплата внесена") return "teal";
  if (status === "Предоплата ожидается") return "amber";
  if (status === "Возврат / отмена") return "rose";
  return "navy";
}

function getDocumentTone(status) {
  if (status === "Проверены" || status === "Получены") return "teal";
  if (status === "Запрошены") return "amber";
  return "navy";
}

function setFinanceFocus(metric) {
  ui.financeFocus = ["sold", "received", "due", "margin"].includes(metric) ? metric : "sold";
  render();
}

function getDefaultPaidAmount(request) {
  const budget = parseMoneyValue(request.budget);
  if (request.paymentStatus === "Оплачено") return formatMoneyInput(budget);
  if (request.paymentStatus === "Предоплата внесена") return formatMoneyInput(Math.round(budget * 0.25));
  return "0 ₽";
}

function normalizeCostItems(items = {}) {
  return COST_ITEM_FIELDS.reduce((result, field) => {
    result[field.key] = String(items[field.key] || "").trim();
    return result;
  }, {});
}

function collectCostItemsFromForm(formData) {
  return COST_ITEM_FIELDS.reduce((items, field) => {
    items[field.key] = String(formData.get(`cost_${field.key}`) || "").trim();
    return items;
  }, {});
}

function hasCostItems(items = {}) {
  return COST_ITEM_FIELDS.some((field) => parseMoneyValue(items[field.key]) > 0);
}

function getCostItemsTotal(items = {}) {
  return COST_ITEM_FIELDS.reduce((sum, field) => sum + parseMoneyValue(items[field.key]), 0);
}

function getRequestFinance(request) {
  const total = parseMoneyValue(request.budget);
  const paid = parseMoneyValue(request.paidAmount);
  const costItems = normalizeCostItems(request.costItems || {});
  const hasCosts = hasCostItems(costItems);
  const costs = hasCosts ? getCostItemsTotal(costItems) : 0;
  const balance = Math.max(total - paid, 0);
  const margin = hasCosts ? Math.max(total - costs, 0) : null;
  return { total, paid, costs, balance, margin, hasCosts, costItems };
}

function getFinancePaymentRows(requests) {
  const rows = [];
  requests.forEach((request) => {
    const finance = getRequestFinance(request);
    const program = getRequestProgramTitle(request);
    if (finance.paid > 0) {
      rows.push({
        requestId: request.id,
        type: "поступление",
        tone: "teal",
        title: request.name,
        amount: finance.paid,
        meta: `${program} · ${request.paymentStatus || "оплата"}`,
        sort: 2,
      });
    }
    if (finance.balance > 0) {
      rows.push({
        requestId: request.id,
        type: "ожидаем",
        tone: "amber",
        title: request.name,
        amount: finance.balance,
        meta: `${program} · остаток к оплате`,
        sort: 1,
      });
    }
  });
  return rows.sort((a, b) => a.sort - b.sort || b.amount - a.amount).slice(0, 8);
}

function getFinanceRowMeta(item, focus) {
  if (focus === "received") return `Получено ${formatMoneyInput(item.paid)} из ${formatMoneyInput(item.total)} · остаток ${formatMoneyInput(item.balance)}`;
  if (focus === "due") return `Осталось ${formatMoneyInput(item.balance)} · оплачено ${formatMoneyInput(item.paid)} из ${formatMoneyInput(item.total)}`;
  if (focus === "margin") return item.hasCosts
    ? `Расходы ${formatMoneyInput(item.costs)} · маржа ${formatMoneyInput(item.margin)} из ${formatMoneyInput(item.total)}`
    : "Расчет тура не заполнен";
  return `Сумма тура ${formatMoneyInput(item.total)} · оплачено ${formatMoneyInput(item.paid)} · остаток ${formatMoneyInput(item.balance)}`;
}

function getFinanceRowPercent(item, focus) {
  if (!item.total) return 0;
  if (focus === "due") return Math.min(100, Math.round((item.balance / item.total) * 100));
  if (focus === "margin") return item.hasCosts ? Math.max(0, Math.round((item.margin / item.total) * 100)) : 0;
  return Math.min(100, Math.round((item.paid / item.total) * 100));
}

function getFinanceRowTone(item, focus) {
  const percent = getFinanceRowPercent(item, focus);
  if (focus === "due") return percent >= 70 ? "rose" : "amber";
  if (focus === "margin") return percent >= 35 ? "teal" : percent >= 20 ? "amber" : "rose";
  return item.balance ? "amber" : "teal";
}

function getFinanceSummary(requests = state.requests) {
  return requests.reduce((summary, request) => {
    const finance = getRequestFinance(request);
    summary.total += finance.total;
    summary.paid += finance.paid;
    summary.balance += finance.balance;
    if (finance.hasCosts) {
      summary.costs += finance.costs;
      summary.margin += finance.margin;
      summary.costedTotal += finance.total;
      summary.estimatedCount += 1;
      COST_ITEM_FIELDS.forEach((field) => {
        summary.costItems[field.key] += parseMoneyValue(finance.costItems[field.key]);
      });
    }
    return summary;
  }, {
    total: 0,
    paid: 0,
    costs: 0,
    balance: 0,
    margin: 0,
    costedTotal: 0,
    estimatedCount: 0,
    costItems: COST_ITEM_FIELDS.reduce((items, field) => ({ ...items, [field.key]: 0 }), {}),
  });
}

function formatMoneyInput(value) {
  return `${Number(value || 0).toLocaleString("ru-RU")} ₽`;
}

function renderRequestFinanceSummary(request) {
  const finance = getRequestFinance(request);
  const paidPercent = finance.total ? Math.min(100, Math.round((finance.paid / finance.total) * 100)) : 0;
  const marginPercent = finance.hasCosts && finance.total ? Math.round((finance.margin / finance.total) * 100) : 0;
  return `
    <details class="detail-section detail-accordion finance-detail">
      <summary>
        <span><strong>Финансы</strong><small>${formatMoneyInput(finance.paid)} оплачено · ${formatMoneyInput(finance.balance)} остаток</small></span>
        <span class="badge navy">${finance.hasCosts ? `${marginPercent}% маржа` : "расчет нужен"}</span>
      </summary>
      <div class="accordion-body">
        <button class="chip-button compact-action" type="button" data-action="openRequestEdit" data-id="${escapeHtml(request.id)}">Редактировать расчет</button>
        <div class="finance-line">
          <span style="width:${paidPercent}%"></span>
        </div>
        <div class="detail-grid">
          <div class="info-tile"><span>Сумма тура</span><strong>${formatMoneyInput(finance.total)}</strong></div>
          <div class="info-tile"><span>Оплачено</span><strong>${formatMoneyInput(finance.paid)}</strong></div>
          <div class="info-tile"><span>Остаток</span><strong>${formatMoneyInput(finance.balance)}</strong></div>
          <div class="info-tile"><span>Расходы тура</span><strong>${finance.hasCosts ? formatMoneyInput(finance.costs) : "Расчет не заполнен"}</strong></div>
          <div class="info-tile"><span>Плановая маржа</span><strong>${finance.hasCosts ? `${formatMoneyInput(finance.margin)} · ${marginPercent}%` : "Появится после расчета"}</strong></div>
        </div>
        ${finance.hasCosts ? renderCostBreakdown(finance.costItems, "Расходы тура", "заполнено менеджером") : renderCalculationEmptyState(request.id)}
        ${finance.hasCosts && request.calculationNote ? `<p class="calculation-note">${escapeHtml(request.calculationNote)}</p>` : ""}
      </div>
    </details>
  `;
}

function renderAnalyticsBar(label, value, max, tone = "navy") {
  const percent = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return `
    <div class="analytics-bar ${escapeHtml(tone)}">
      <div>
        <strong>${escapeHtml(label)}</strong>
        <span>${formatMoneyInput(value)}</span>
      </div>
      <div class="analytics-track"><span style="width:${percent}%"></span></div>
    </div>
  `;
}

function renderCalculationEmptyState(requestId) {
  return `
    <div class="calculation-empty">
      <span>Расчет тура еще не заполнен. Откройте редактирование и внесите расходы по строкам.</span>
      <button class="button secondary" type="button" data-action="openRequestEdit" data-id="${escapeHtml(requestId)}">Заполнить расчет</button>
    </div>
  `;
}

function renderCostBreakdown(costItems, title = "Расходы", caption = "из расчета тура") {
  const rows = getCostBreakdown(costItems);
  if (!rows.length) return "";
  return `
    <div class="cost-breakdown">
      <div class="cost-breakdown-head">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(caption)}</span>
      </div>
      ${rows.map((row) => `
        <div class="cost-row">
          <span>${escapeHtml(row.label)}</span>
          <strong>${formatMoneyInput(row.value)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function getCostBreakdown(costItems = {}) {
  return COST_ITEM_FIELDS
    .map((field) => ({ label: field.label, value: parseMoneyValue(costItems[field.key]) }))
    .filter((row) => row.value > 0);
}

function getTransferTasksForRequest(request) {
  return getTransferTaskRows().filter((task) => task.id && task.requestId === request.id);
}

function getRequestChecklist(request) {
  const transferTasks = getTransferTasksForRequest(request);
  const hasProgram = (Array.isArray(request.programIds) && request.programIds.length > 0) || Boolean(request.customProgram);
  const hasHotel = Boolean(request.hotel && !/уточнить/i.test(request.hotel));
  const hasBudget = Boolean(request.budget && request.budget !== "Не указан");
  return [
    { label: "Контакт", done: Boolean(request.phone), hint: request.phone || "нет телефона" },
    { label: "Программа", done: hasProgram, hint: getRequestProgramTitle(request) },
    { label: "Проживание", done: hasHotel, hint: request.hotel || "уточнить" },
    { label: "Бюджет", done: hasBudget, hint: request.budget || "не указан" },
    { label: "Оплата", done: ["Предоплата внесена", "Оплачено"].includes(request.paymentStatus), hint: request.paymentStatus || "не обсуждали" },
    { label: "Документы", done: ["Получены", "Проверены"].includes(request.documentStatus), hint: request.documentStatus || "не запрошены" },
    { label: "Трансфер", done: transferTasks.length > 0, hint: transferTasks.length ? `${transferTasks.length} задач` : "не создан" },
  ];
}

function getRequestReadiness(request) {
  const checklist = getRequestChecklist(request);
  const done = checklist.filter((item) => item.done).length;
  return {
    done,
    total: checklist.length,
    percent: Math.round((done / checklist.length) * 100),
  };
}

function renderReadinessBar(request) {
  const readiness = getRequestReadiness(request);
  return `
    <div class="readiness-bar" aria-label="Готовность поездки ${readiness.percent}%">
      <span style="width: ${readiness.percent}%"></span>
    </div>
    <small class="readiness-label">Готовность ${readiness.done}/${readiness.total}</small>
  `;
}

function renderTourOpsChecklist(request) {
  const checklist = getRequestChecklist(request);
  const readiness = getRequestReadiness(request);
  return `
    <details class="detail-section detail-accordion">
      <summary>
        <span><strong>Готовность</strong><small>${readiness.done}/${readiness.total} пунктов</small></span>
        <span class="badge teal">${readiness.percent}%</span>
      </summary>
      <div class="accordion-body">
        ${renderReadinessBar(request)}
        <div class="ops-checklist">
          ${checklist.map((item) => `
            <div class="ops-check ${item.done ? "done" : ""}">
              <span>${item.done ? "✓" : ""}</span>
              <div>
                <strong>${escapeHtml(item.label)}</strong>
                <small>${escapeHtml(item.hint)}</small>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </details>
  `;
}

function parseMoneyValue(value) {
  const number = String(value || "").replace(/[^\d]/g, "");
  return number ? Number(number) : 0;
}

function formatMoneyShort(value) {
  if (!value) return "0 ₽";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 ? 1 : 0)} млн ₽`;
  if (value >= 1_000) return `${Math.round(value / 1_000)} тыс. ₽`;
  return `${value} ₽`;
}

function filteredRequests() {
  if (!ui.search) return state.requests;
  return state.requests
    .map((item, index) => ({
      item,
      index,
      score: getRequestSearchScore(item, ui.search),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.item);
}

function getRequestSearchScore(item, query) {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return 1;
  const queryDigits = normalizedQuery.replace(/\D/g, "");
  const tags = Array.isArray(item.tags) ? item.tags.join(" ") : "";
  const programTitle = getRequestProgramTitle(item);
  let score = 0;

  score = Math.max(score, scoreSearchField(item.name, normalizedQuery, 140, 120, 112));
  if (queryDigits.length >= 2) {
    const phoneDigits = String(item.phone || "").replace(/\D/g, "");
    if (phoneDigits.includes(queryDigits)) score = Math.max(score, 118);
  }
  score = Math.max(score, scoreSearchField(programTitle, normalizedQuery, 75, 58, 52));
  score = Math.max(score, scoreSearchField(item.route, normalizedQuery, 70, 54, 48));
  score = Math.max(score, scoreSearchField(item.hotel, normalizedQuery, 52, 42, 36));
  score = Math.max(score, scoreSearchField(item.dates, normalizedQuery, 45, 36, 0));
  score = Math.max(score, scoreSearchField(item.manager, normalizedQuery, 34, 28, 22));
  score = Math.max(score, scoreSearchField(item.source, normalizedQuery, 30, 24, 0));
  score = Math.max(score, scoreSearchField(item.priority, normalizedQuery, 28, 22, 0));
  score = Math.max(score, scoreSearchField(getStatus(item.status).label, normalizedQuery, 28, 22, 0));
  score = Math.max(score, scoreSearchField(tags, normalizedQuery, 16, 10, 8));
  score = Math.max(score, scoreSearchField(item.comment, normalizedQuery, 12, 7, 0));

  return score;
}

function normalizeSearch(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function scoreSearchField(value, query, startsScore, containsScore, softPrefixScore = 0) {
  const text = normalizeSearch(value);
  if (!text || !query) return 0;
  if (text.startsWith(query)) return startsScore;
  if (text.includes(query)) return containsScore;
  const softPrefix = query.length >= 3 ? query.slice(0, 3) : "";
  if (softPrefix && text.startsWith(softPrefix)) return softPrefixScore;
  return 0;
}

function getStatus(id) {
  return STATUS.find((status) => status.id === id) || STATUS[0];
}

function renderStatusBadge(statusId) {
  const status = getStatus(statusId);
  return `<span class="badge ${status.tone}">${status.label}</span>`;
}

function iconSvg(name, className = "inline-icon") {
  return `<svg class="${className}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function getSameOriginAuthHeaders(extraHeaders = {}) {
  const headers = { ...extraHeaders };
  if (window.location.username || window.location.password) {
    headers.Authorization = `Basic ${btoa(`${decodeURIComponent(window.location.username)}:${decodeURIComponent(window.location.password)}`)}`;
  }
  return headers;
}

function nextId() {
  const number = state.requests.length + 1042 + Math.floor(Math.random() * 30);
  return `TR-${number}`;
}

function toast(message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  toastRegion.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 3200);
}

function syncNav() {
  document.querySelectorAll(".nav-item, .mobile-tabbar button").forEach((item) => {
    const targetView = item.dataset.view;
    const isMobileTab = Boolean(item.closest(".mobile-tabbar"));
    const isLogistics = isMobileTab && targetView === "transport" && ["transport", "arrivals", "departures", "cars"].includes(ui.view);
    const isMobileMore = item.dataset.action === "openMobileMore" && ["program", "finance", "messages", "automation", "settings", "journal"].includes(ui.view);
    const blocked = targetView && !isViewAllowedForActiveRole(targetView);
    item.classList.toggle("active", targetView === ui.view || isLogistics || isMobileMore);
    item.classList.toggle("is-disabled", Boolean(blocked));
    if (blocked) item.setAttribute("aria-disabled", "true");
    else item.removeAttribute("aria-disabled");
  });
}

function openMobileMore() {
  const sections = [
    { view: "program", label: "Программа", icon: "calendar" },
    { view: "finance", label: "Финансы", icon: "wallet" },
    { view: "arrivals", label: "Прилеты", icon: "plane-arrive" },
    { view: "departures", label: "Вылеты", icon: "plane-depart" },
    { view: "cars", label: "Автомобили", icon: "car" },
    { view: "messages", label: "Сообщения", icon: "message" },
    { view: "automation", label: "Автоматизации", icon: "automation" },
    { view: "settings", label: "Настройки", icon: "settings" },
    { view: "journal", label: "Журнал", icon: "journal" },
  ];

  modalRoot.innerHTML = `
    <div class="modal-backdrop mobile-more-backdrop" role="dialog" aria-modal="true" aria-labelledby="mobileMoreTitle">
      <div class="modal-card mobile-more-card">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Разделы</span>
            <h3 id="mobileMoreTitle">Еще</h3>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>
        <div class="mobile-more-grid">
          ${sections.map((section) => `
            <button class="${section.view === ui.view ? "active" : ""}" type="button" data-view="${escapeHtml(section.view)}">
              ${iconSvg(section.icon, "mobile-more-icon")}
              <span>${escapeHtml(section.label)}</span>
            </button>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function resetPageScroll() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function setAirportMode(mode) {
  ui.airportMode = mode;
  ui.view = mode === "arrivals" ? "arrivals" : "departures";
  ui.airportStatusOpen = false;
  render();
  resetPageScroll();
  loadAirportBoard();
}

function selectAirportDate(date) {
  if (!date || date === ui.airportDate) return;
  ui.airportDate = date;
  render();
  loadAirportBoard();
}

function toggleAirportFilters() {
  ui.airportFiltersOpen = !ui.airportFiltersOpen;
  render();
}

function toggleAirportStatusPanel() {
  ui.airportStatusOpen = !ui.airportStatusOpen;
  render();
}

function watchFlight(flightKey) {
  const flight = airportBoard.flights.find((item) => item.key === flightKey);
  if (!flight) {
    toast("Рейс не найден в текущем табло.");
    return;
  }

  const alreadyWatched = state.watchedFlights.some((item) => (
    item.no === flight.no &&
    item.date === flight.displayDate &&
    item.direction === flight.direction
  ));
  if (alreadyWatched) {
    toast(`${flight.no} уже стоит на отслеживании.`);
    return;
  }

  state.watchedFlights.unshift(buildWatchedFlight(flight));
  addActivity(`Рейс ${flight.no} поставлен на отслеживание`, { targetType: "airport", targetId: flight.key, targetView: ui.airportMode === "departures" ? "departures" : "arrivals" });
  persist();
  render();
  toast(`Рейс ${flight.no} добавлен в отслеживание.`);
}

function removeWatchedFlight(watchId) {
  const before = state.watchedFlights.length;
  state.watchedFlights = state.watchedFlights.filter((item) => item.id !== watchId);
  if (state.watchedFlights.length === before) return;
  persist();
  render();
  toast("Рейс убран из отслеживания.");
}

function buildWatchedFlight(flight) {
  return {
    id: `WF-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    no: flight.no,
    city: flight.city,
    date: flight.displayDate,
    time: flight.displayTime,
    direction: flight.direction,
    status: flight.status,
    statusTone: flight.statusTone,
    source: airportBoard.source,
    lastSeenAt: formatAirportUpdatedAt(new Date()),
  };
}

function syncWatchedFlights(flights) {
  if (!state.watchedFlights.length) return;
  const now = formatAirportUpdatedAt(new Date());
  let changed = false;
  state.watchedFlights = state.watchedFlights.map((watched) => {
    const current = flights.find((flight) => (
      flight.no === watched.no &&
      flight.displayDate === watched.date &&
      flight.direction === watched.direction
    ));
    if (!current) return watched;
    changed = true;
    return {
      ...watched,
      city: current.city,
      time: current.displayTime,
      status: current.status,
      statusTone: current.statusTone,
      source: airportBoard.source,
      lastSeenAt: now,
    };
  });
  if (changed) persist();
}

async function loadAirportBoard(options = {}) {
  const { silent = false } = options;
  const isDepartures = ui.airportMode === "departures";
  const attemptAt = formatAirportUpdatedAt(new Date());
  const params = new URLSearchParams({
    date: formatAirportDateFromInput(ui.airportDate),
    is_departs: isDepartures ? "1" : "0",
  });
  if (ui.airportTimeStart) params.set("time_start", ui.airportTimeStart);
  if (ui.airportTimeEnd) params.set("time_end", ui.airportTimeEnd);

  airportBoard = {
    ...airportBoard,
    loading: true,
    error: "",
    lastAttemptAt: attemptAt,
  };
  if (!silent) render();

  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);
    const response = await fetch(`${AIRPORT_API_URL}?${params.toString()}`, {
      credentials: "same-origin",
      headers: getSameOriginAuthHeaders({ "Accept-Language": "ru" }),
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const list = Array.isArray(payload.data) ? payload.data : [];
    const loadedAt = formatAirportUpdatedAt(new Date());
    const flights = list.map((item) => normalizeAirportFlight(item, isDepartures));
    if (!payload.stale) saveAirportSnapshot(
      ui.airportMode,
      ui.airportDate,
      flights,
      loadedAt,
      payload.upstreamUrl || "",
      payload.source || "",
      payload.proxyUrl || "",
    );
    airportBoard = {
      source: payload.stale ? "cached-live" : "live",
      updatedAt: loadedAt,
      flights,
      loading: false,
      error: payload.warning || "",
      upstreamUrl: payload.upstreamUrl || "",
      proxyUrl: payload.proxyUrl || "",
      backendSource: payload.source || "",
      lastLiveAt: payload.stale ? airportBoard.lastLiveAt : loadedAt,
      lastAttemptAt: attemptAt,
    };
    syncWatchedFlights(airportBoard.flights);
    render();
  } catch (error) {
    const snapshot = getAirportSnapshot(ui.airportMode, ui.airportDate);
    airportBoard = {
      source: snapshot ? "cached-live" : "fallback",
      updatedAt: snapshot ? snapshot.updatedAt : "Live-данные недоступны",
      flights: snapshot ? snapshot.flights : getFallbackAirportFlights(ui.airportMode),
      loading: false,
      error: snapshot
        ? "Связь с API аэропорта сейчас недоступна, показан последний сохранённый live-снимок."
        : "Не удалось получить онлайн-табло через основной и резервный канал. Проверьте интернет и повторите обновление.",
      upstreamUrl: snapshot ? snapshot.upstreamUrl : "",
      proxyUrl: snapshot ? snapshot.proxyUrl || "" : "",
      backendSource: snapshot ? snapshot.backendSource || "" : "",
      lastLiveAt: snapshot ? snapshot.updatedAt : "",
      lastAttemptAt: attemptAt,
    };
    syncWatchedFlights(airportBoard.flights);
    render();
  }
}

function filteredAirportFlights() {
  const flights = airportBoard.flights;
  if (!ui.search) return flights;
  return flights.filter((flight) => {
    const haystack = [
      flight.no,
      flight.city,
      flight.airport,
      flight.airline,
      flight.status,
      flight.codeshare,
    ].join(" ").toLowerCase();
    return haystack.includes(ui.search);
  });
}

function showAirportMetric(metric) {
  const flights = filteredAirportFlights();
  const logisticsItems = buildLogisticsItems(flights, ui.airportMode === "departures");
  const metricMap = {
    all: {
      eyebrow: "Логистика",
      title: "Гости на дату",
      items: logisticsItems,
      empty: "На выбранную дату гостей с рейсами нет.",
      type: "logistics",
    },
    unassigned: {
      eyebrow: "Логистика",
      title: "Без машины",
      items: logisticsItems.filter((item) => !item.carId && !item.noTransfer),
      empty: "Все гости распределены по машинам.",
      type: "logistics",
    },
    assigned: {
      eyebrow: "Логистика",
      title: "В машинах",
      items: logisticsItems.filter((item) => item.carId),
      empty: "На выбранный день машин пока нет.",
      type: "logistics",
    },
    noTransfer: {
      eyebrow: "Логистика",
      title: ui.airportMode === "departures" ? "Провожать не надо" : "Встречать не надо",
      items: logisticsItems.filter((item) => item.noTransfer),
      empty: "Таких гостей на выбранный день нет.",
      type: "logistics",
    },
  };
  const config = metricMap[metric] || metricMap.all;
  const rows = config.items.slice(0, 12).map((item) => {
    const key = item.id;
    const title = `${item.flightNo} · ${item.client}`;
    const meta = `${escapeHtml(item.direction)} · ${escapeHtml(item.date)} · ${escapeHtml(item.time)} · ${escapeHtml(item.carLabel || item.hotel)}`;
    const status = item.status;
    const tone = item.statusTone || "teal";

    if (key) {
      return `
        <button class="metric-detail-row" type="button" data-action="openLogisticsItem" data-logistics-id="${escapeHtml(key)}">
          <span><strong>${escapeHtml(title)}</strong></span>
          <small>${meta}</small>
          <em class="badge ${tone}">${escapeHtml(status)}</em>
        </button>
      `;
    }
    return `
      <div class="metric-detail-row is-static">
        <span><strong>${escapeHtml(title)}</strong></span>
        <small>${meta}</small>
        <em class="badge ${tone}">${escapeHtml(status)}</em>
      </div>
    `;
  }).join("");

  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="airportMetricTitle">
      <div class="modal-card metric-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">${escapeHtml(config.eyebrow)}</span>
            <h3 id="airportMetricTitle">${escapeHtml(config.title)}</h3>
            <p class="muted">${escapeHtml(formatDisplayDate(ui.airportDate))} · ${escapeHtml(ui.airportMode === "departures" ? "Вылеты" : "Прилёты")}</p>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>
        <div class="metric-detail-list">
          ${rows || `<div class="empty-state compact-empty">${escapeHtml(config.empty)}</div>`}
        </div>
      </div>
    </div>
  `;
}

function showAirportStatus() {
  const flights = filteredAirportFlights();
  const connection = getAirportConnectionInfo();
  const timezone = getSystemTimezone();
  const rows = flights.slice(0, 6).map((flight) => `
    <button class="metric-detail-row" type="button" data-action="openFlight" data-flight-key="${escapeHtml(flight.key)}">
      <span><strong>${escapeHtml(flight.no)}</strong> · ${escapeHtml(flight.city)}</span>
      <small>${escapeHtml(flight.displayDate)} · ${escapeHtml(flight.displayTime)} · ${escapeHtml(flight.airline)}</small>
      <em class="badge ${flight.statusTone}">${escapeHtml(flight.status)}</em>
    </button>
  `).join("");

  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="airportStatusTitle">
      <div class="modal-card metric-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Онлайн-табло</span>
            <h3 id="airportStatusTitle">${escapeHtml(connection.title)}</h3>
            <p class="muted">${escapeHtml(connection.text)}</p>
          </div>
          <button class="icon-button" type="button" aria-label="Закрыть окно" data-action="closeModal">×</button>
        </div>

        <section class="detail-section">
          <div class="detail-grid">
            <div class="info-tile"><span>Обновлено</span><strong>${escapeHtml(airportBoard.updatedAt)}</strong></div>
            <div class="info-tile"><span>Пояс времени</span><strong>${escapeHtml(formatTimezoneLabel(timezone))}</strong></div>
            <div class="info-tile"><span>Источник</span><strong>${escapeHtml(airportBoard.backendSource || connection.sourceLabel)}</strong></div>
            <div class="info-tile"><span>Рейсов в источнике</span><strong>${flights.length}</strong></div>
          </div>
        </section>

        <section class="detail-section">
          <strong>Табло</strong>
          <div class="metric-detail-list">
            ${rows || `<div class="empty-state compact-empty">В текущем источнике рейсов нет</div>`}
          </div>
        </section>

        <section class="detail-section">
          <div class="template-actions">
            <button class="button primary" type="button" data-action="refreshAirportBoard">${iconSvg("refresh", "button-icon")}<span>Обновить</span></button>
            <a class="button secondary link-button" href="https://aerovlad.ru/ru/timetable" target="_blank" rel="noreferrer">Сайт аэропорта</a>
          </div>
        </section>
      </div>
    </div>
  `;
}

function findCurrentFlightForWatch(watched) {
  return airportBoard.flights.find((flight) => (
    flight.no === watched.no &&
    flight.displayDate === watched.date &&
    flight.direction === watched.direction
  ));
}

function createFlightTransfer(flightKey) {
  const logisticsItem = buildLogisticsItems(filteredAirportFlights(), ui.airportMode === "departures")
    .find((item) => item.flightKey === flightKey || item.flightNo === flightKey);
  if (!logisticsItem) {
    toast("Сначала выберите гостя в прилётах или вылетах. Задача создается не от рейса, а от клиента.");
    return;
  }
  createTransferTaskFromLogistics(logisticsItem.id);
}

function normalizeAirportFlight(item, isDepartures) {
  const scheduled = isDepartures ? item.scheduled_departure : item.scheduled_arrival;
  const estimated = isDepartures ? item.estimated_departure : item.estimated_arrival;
  const actual = isDepartures ? item.actual_departure : item.actual_arrival;
  const city = item.segments && item.segments.length
    ? item.segments.map((segment) => segment.city).join(" · ")
    : item.city || "Направление не указано";
  const code = item.segments && item.segments.length
    ? item.segments.map((segment) => segment.code).join(" · ")
    : item.airport || item.code || "VVO";
  const statusInfo = getAirportStatusTone(item.status_id, item.status);
  const key = String(item.id || `${item.no || "flight"}-${city}-${scheduled || estimated || actual || ui.airportDate}`);

  return {
    key,
    id: item.id || "",
    no: item.no || "—",
    codeshare: Array.isArray(item.codeshare) && item.codeshare.length ? item.codeshare.join(", ") : "без кодшера",
    city,
    airport: code,
    airline: item.airline && item.airline.name ? item.airline.name : "Авиакомпания не указана",
    displayDate: formatDisplayDate(ui.airportDate),
    scheduled: scheduled || "—",
    estimated: estimated || "",
    actual: actual || "",
    scheduledDeparture: item.scheduled_departure || "",
    estimatedDeparture: item.estimated_departure || "",
    actualDeparture: item.actual_departure || "",
    scheduledArrival: item.scheduled_arrival || "",
    estimatedArrival: item.estimated_arrival || "",
    actualArrival: item.actual_arrival || "",
    checkinStart: item.checkin_start || "",
    checkinEnd: item.checkin_end || "",
    checkinDesk: item.checkin_desk || "",
    terminal: item.terminal || "",
    gate: item.gate || "",
    displayTime: actual || estimated || scheduled || "—",
    timeLabel: actual ? "факт" : estimated ? `план ${scheduled || "—"}` : "по расписанию",
    status: item.status || "По расписанию",
    statusTone: statusInfo.tone,
    statusKind: statusInfo.kind,
    direction: isDepartures ? "Вылет" : "Прилёт",
    raw: item,
  };
}

function getAirportStatusTone(statusId, statusText = "") {
  const normalized = statusText.toLowerCase();
  if (statusId === 6 || normalized.includes("задерж")) return { tone: "amber", kind: "delayed" };
  if (statusId === 5 || normalized.includes("отмен")) return { tone: "rose", kind: "cancelled" };
  if (normalized.includes("регистра")) return { tone: "violet", kind: "registration" };
  if (normalized.includes("посад")) return { tone: "navy", kind: "boarding" };
  if (normalized.includes("приб") || normalized.includes("вылет")) return { tone: "teal", kind: "done" };
  if (normalized.includes("ожид")) return { tone: "amber", kind: "expected" };
  return { tone: "teal", kind: "scheduled" };
}

function getFallbackAirportFlights(mode) {
  const departures = [
    {
      no: "SU 1701",
      codeshare: "FV 6201",
      city: "Москва",
      airport: "SVO",
      airline: "Аэрофлот",
      scheduled: "09:25",
      estimated: "09:55",
      actual: "",
      displayTime: "09:55",
      timeLabel: "план 09:25",
      status: "Задержан",
      statusTone: "amber",
      statusKind: "delayed",
    },
    {
      no: "S7 5204",
      codeshare: "без кодшера",
      city: "Новосибирск",
      airport: "OVB",
      airline: "S7 Airlines",
      scheduled: "11:10",
      estimated: "",
      actual: "",
      displayTime: "11:10",
      timeLabel: "по расписанию",
      status: "Регистрация",
      statusTone: "violet",
      statusKind: "registration",
    },
    {
      no: "HZ 5614",
      codeshare: "без кодшера",
      city: "Южно-Сахалинск",
      airport: "UUS",
      airline: "Аврора",
      scheduled: "12:35",
      estimated: "",
      actual: "",
      displayTime: "12:35",
      timeLabel: "по расписанию",
      status: "По расписанию",
      statusTone: "teal",
      statusKind: "scheduled",
    },
    {
      no: "FV 6320",
      codeshare: "SU 6320",
      city: "Санкт-Петербург",
      airport: "LED",
      airline: "Россия",
      scheduled: "13:45",
      estimated: "",
      actual: "",
      displayTime: "13:45",
      timeLabel: "по расписанию",
      status: "Посадка",
      statusTone: "navy",
      statusKind: "boarding",
    },
  ];

  const arrivals = [
    {
      no: "SU 1702",
      codeshare: "FV 6202",
      city: "Москва",
      airport: "SVO",
      airline: "Аэрофлот",
      scheduled: "08:50",
      estimated: "",
      actual: "09:05",
      displayTime: "09:05",
      timeLabel: "факт",
      status: "Прибыл",
      statusTone: "teal",
      statusKind: "done",
    },
    {
      no: "S7 5203",
      codeshare: "без кодшера",
      city: "Новосибирск",
      airport: "OVB",
      airline: "S7 Airlines",
      scheduled: "10:40",
      estimated: "10:55",
      actual: "",
      displayTime: "10:55",
      timeLabel: "план 10:40",
      status: "Ожидается",
      statusTone: "amber",
      statusKind: "expected",
    },
    {
      no: "HZ 5613",
      codeshare: "без кодшера",
      city: "Южно-Сахалинск",
      airport: "UUS",
      airline: "Аврора",
      scheduled: "12:10",
      estimated: "",
      actual: "",
      displayTime: "12:10",
      timeLabel: "по расписанию",
      status: "По расписанию",
      statusTone: "teal",
      statusKind: "scheduled",
    },
    {
      no: "IO 913",
      codeshare: "без кодшера",
      city: "Харбин",
      airport: "HRB",
      airline: "ИрАэро",
      scheduled: "14:20",
      estimated: "15:05",
      actual: "",
      displayTime: "15:05",
      timeLabel: "план 14:20",
      status: "Задержан",
      statusTone: "amber",
      statusKind: "delayed",
    },
  ];

  return (mode === "arrivals" ? arrivals : departures).map((flight, index) => ({
    ...flight,
    key: `fallback-${mode}-${index}-${flight.no}`,
    id: `fallback-${index + 1}`,
    displayDate: formatDisplayDate(ui.airportDate),
    scheduledDeparture: mode === "departures" ? flight.scheduled : "",
    estimatedDeparture: mode === "departures" ? flight.estimated : "",
    actualDeparture: mode === "departures" ? flight.actual : "",
    scheduledArrival: mode === "arrivals" ? flight.scheduled : "",
    estimatedArrival: mode === "arrivals" ? flight.estimated : "",
    actualArrival: mode === "arrivals" ? flight.actual : "",
    checkinStart: mode === "departures" ? `${formatDisplayDate(ui.airportDate)} 07:20` : "",
    checkinEnd: mode === "departures" ? `${formatDisplayDate(ui.airportDate)} 08:45` : "",
    checkinDesk: mode === "departures" ? "12-16" : "",
    terminal: "A",
    gate: mode === "departures" ? "4" : "",
    direction: mode === "departures" ? "Вылет" : "Прилёт",
    raw: flight,
  }));
}

function formatAirportDate(date) {
  return [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    date.getFullYear(),
  ].join(".");
}

function formatAirportUpdatedAt(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: getSystemTimezone(),
  }).format(date);
}

function formatDateInput(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatAirportDateFromInput(value) {
  if (!value) return formatAirportDate(new Date());
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}

function formatDisplayDate(value) {
  if (!value) return "Сегодня";
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}

function getAirportDateChips(records, countKind = "flight") {
  const baseDate = parseInputDate(ui.airportDate) || new Date();
  const todayValue = formatDateInput(new Date());
  return [-2, -1, 0, 1, 2, 3].map((offset) => {
    const date = addDays(baseDate, offset);
    const value = formatDateInput(date);
    const snapshot = getAirportSnapshot(ui.airportMode, value);
    const count = value === ui.airportDate
      ? records.length
      : countKind === "flight" && snapshot
        ? snapshot.flights.length
        : null;
    return {
      value,
      title: value === todayValue ? "сегодня" : `${getWeekdayShort(date)}, ${date.getDate()} ${getMonthName(date)}`,
      subtitle: formatDisplayDate(value),
      countLabel: count === null ? "" : formatAirportChipCount(count, countKind),
    };
  });
}

function formatAirportChipCount(count, countKind) {
  if (countKind === "guest") return `${count} ${getRussianPluralWord(count, "гость", "гостя", "гостей")}`;
  return `${count} рейс${getRussianPlural(count, "", "а", "ов")}`;
}

function parseInputDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function getWeekdayShort(date) {
  return ["вс", "пн", "вт", "ср", "чт", "пт", "сб"][date.getDay()];
}

function getMonthName(date) {
  return ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"][date.getMonth()];
}

function getRussianPlural(count, one, few, many) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

function getRussianPluralWord(count, one, few, many) {
  return getRussianPlural(count, one, few, many);
}

function formatRefreshLabel(seconds) {
  if (seconds === "30") return "каждые 30 сек.";
  if (seconds === "60") return "каждую минуту";
  if (seconds === "120") return "каждые 2 мин.";
  return `${seconds} сек.`;
}

function getAirportSnapshotKey(mode, date) {
  return `${mode}:${date}`;
}

function getAirportSnapshot(mode, date) {
  const snapshot = state.airportLiveSnapshots[getAirportSnapshotKey(mode, date)];
  if (!snapshot || !Array.isArray(snapshot.flights)) return null;
  return snapshot;
}

function saveAirportSnapshot(mode, date, flights, updatedAt, upstreamUrl, backendSource = "", proxyUrl = "") {
  state.airportLiveSnapshots[getAirportSnapshotKey(mode, date)] = {
    updatedAt,
    upstreamUrl,
    backendSource,
    proxyUrl,
    flights,
  };
  persist();
}

function updateAirportSetting(field, value) {
  if (field === "date") ui.airportDate = value || formatDateInput(new Date());
  if (field === "timeStart") ui.airportTimeStart = value;
  if (field === "timeEnd") ui.airportTimeEnd = value;
  if (field === "autoRefresh") ui.airportAutoRefresh = value;
  render();
  if (field === "autoRefresh") {
    syncAirportAutoRefresh();
    return;
  }
  loadAirportBoard();
}

function getAirportRefreshOptions() {
  return [
    { value: "0", label: "Вручную" },
    { value: "60", label: "Каждую минуту" },
    { value: "300", label: "Каждые 5 минут" },
    { value: "1200", label: "Каждые 20 минут" },
    { value: "3600", label: "Раз в час" },
    { value: "21600", label: "Раз в 6 часов" },
    { value: "43200", label: "Раз в полдня" },
  ];
}

function updateSystemSetting(field, value) {
  if (field === "timezone") {
    state.settings.timezone = value || "Asia/Vladivostok";
    persist();
    render();
    toast("Часовой пояс обновлен.");
  }
}

function setActiveAccessRole(value) {
  if (!DEFAULT_ACCESS[value]) return;
  state.settings.activeRole = value;
  addActivity(`${state.settings.access[value]?.label || value}: включена проверка доступа`, { targetType: "settings", targetId: value, targetView: "settings" });
  persist();
  if (!isViewAllowedForActiveRole(ui.view)) ui.view = "dashboard";
  render();
  toast("Режим доступа обновлен.");
}

function getAccessSettings() {
  ensureStateShape();
  return state.settings.access || structuredClone(DEFAULT_ACCESS);
}

function getActiveAccessRole() {
  ensureStateShape();
  return state.settings.activeRole || "owner";
}

function isViewAllowedForActiveRole(view) {
  return isViewAllowedForRole(view, getActiveAccessRole());
}

function isViewAllowedForRole(view, role) {
  if (!view || view === "dashboard" || view === "settings") return true;
  if (role === "owner") return true;
  const access = getAccessSettings();
  const sectionId = VIEW_ACCESS_ALIASES[view] || view;
  return Boolean(access[role]?.views?.includes(sectionId));
}

function updateAccessSetting(role, view, enabled) {
  ensureStateShape();
  if (!DEFAULT_ACCESS[role] || DEFAULT_ACCESS[role].locked) return;
  const section = ACCESS_SECTIONS.find((item) => item.id === view);
  if (!section) return;
  const views = new Set(state.settings.access[role].views || []);
  if (enabled) views.add(view);
  else views.delete(view);
  state.settings.access[role].views = [...views];
  addActivity(`${state.settings.access[role].label}: доступ к разделу "${section.label}" ${enabled ? "открыт" : "закрыт"}`, { targetType: "settings", targetId: role, targetView: "settings" });
  persist();
  if (role === getActiveAccessRole() && !isViewAllowedForActiveRole(ui.view)) ui.view = "dashboard";
  render();
  toast("Доступ обновлен.");
}

function isRoleViewEnabled(role, view) {
  return isViewAllowedForRole(view, role);
}

function getSystemTimezone() {
  return state.settings?.timezone || "Asia/Vladivostok";
}

function getTimezoneOptions() {
  return [
    { value: "Asia/Vladivostok", label: "Владивосток · UTC+10" },
    { value: "Asia/Sakhalin", label: "Сахалин · UTC+11" },
    { value: "Asia/Yakutsk", label: "Якутск · UTC+9" },
    { value: "Asia/Irkutsk", label: "Иркутск · UTC+8" },
    { value: "Asia/Krasnoyarsk", label: "Красноярск · UTC+7" },
    { value: "Europe/Moscow", label: "Москва · UTC+3" },
  ];
}

function formatTimezoneLabel(timezone) {
  return getTimezoneOptions().find((option) => option.value === timezone)?.label || timezone;
}

function formatBotTime(value) {
  if (!value) return "нет данных";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "нет данных";
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: getSystemTimezone(),
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function syncAirportAutoRefresh() {
  if (airportRefreshTimer) {
    window.clearInterval(airportRefreshTimer);
    airportRefreshTimer = null;
  }
  const seconds = Number(ui.airportAutoRefresh);
  if (!usesAirportData(ui.view) || !seconds) return;
  airportRefreshTimer = window.setInterval(() => {
    if (usesAirportData(ui.view) && !airportBoard.loading) loadAirportBoard({ silent: true });
  }, seconds * 1000);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
