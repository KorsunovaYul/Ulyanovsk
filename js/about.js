// ===== СТРАНИЦА «ОБ УЛЬЯНОВСКЕ» =====
// Погода: Open-Meteo API (бесплатно, без ключа)
// Время:  UTC+4 (Ульяновск), обновляется каждую секунду

document.addEventListener('DOMContentLoaded', () => {

    // ──────────────────────────────────────────
    // ЧАСОВОЙ ПОЯС — реальное время UTC+4
    // ──────────────────────────────────────────
    const tzTimeEl = document.getElementById('tz-time');
    const tzDateEl = document.getElementById('tz-date');

    const MONTHS_RU = [
        'января','февраля','марта','апреля','мая','июня',
        'июля','августа','сентября','октября','ноября','декабря'
    ];
    const MONTHS_RU_SHORT = [
        'янв.','фев.','мар.','апр.','мая','июн.',
        'июл.','авг.','сен.','окт.','ноя.','дек.'
    ];

    function getUlyanovskDate() {
        // Ульяновск — UTC+4 (Самарское время)
        const now = new Date();
        const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
        return new Date(utcMs + 4 * 3600000);
    }

    function updateClock() {
        const d = getUlyanovskDate();
        const h = String(d.getHours()).padStart(2, '0');
        const m = String(d.getMinutes()).padStart(2, '0');
        if (tzTimeEl) tzTimeEl.textContent = `${h}:${m}`;
        if (tzDateEl) tzDateEl.innerHTML =
            `${d.getDate()} <span class="month-full">${MONTHS_RU[d.getMonth()]}</span><span class="month-short">${MONTHS_RU_SHORT[d.getMonth()]}</span>`;
    }

    updateClock();
    setInterval(updateClock, 1000);

    // ──────────────────────────────────────────
    // ИКОНКИ ПОГОДЫ (белые SVG)
    // ──────────────────────────────────────────

    // Солнце
    const SVG_SUN = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="11" fill="white"/>
        <line x1="32" y1="5"  x2="32" y2="14" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="32" y1="50" x2="32" y2="59" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="5"  y1="32" x2="14" y2="32" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="50" y1="32" x2="59" y2="32" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="12.5" y1="12.5" x2="18.9" y2="18.9" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="45.1" y1="45.1" x2="51.5" y2="51.5" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="51.5" y1="12.5" x2="45.1" y2="18.9" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="18.9" y1="45.1" x2="12.5" y2="51.5" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`;

    // Переменная облачность
    const SVG_PARTLY = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="43" cy="18" r="8" fill="white"/>
        <line x1="43" y1="5"  x2="43" y2="10" stroke="white" stroke-width="3" stroke-linecap="round"/>
        <line x1="56" y1="18" x2="51" y2="18" stroke="white" stroke-width="3" stroke-linecap="round"/>
        <line x1="52" y1="9"  x2="48" y2="13" stroke="white" stroke-width="3" stroke-linecap="round"/>
        <line x1="34" y1="9"  x2="38" y2="13" stroke="white" stroke-width="3" stroke-linecap="round"/>
        <path d="M8 50 Q2 50 2 42 Q2 33 13 33 Q14 24 25 24 Q38 24 40 34 Q48 34 48 42 Q48 50 40 50 Z" fill="white"/>
    </svg>`;

    // Пасмурно
    const SVG_CLOUD = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 50 Q3 50 3 41 Q3 31 15 31 Q17 21 29 21 Q44 21 46 32 Q55 32 55 41 Q55 50 46 50 Z" fill="white"/>
    </svg>`;

    // Туман
    const SVG_FOG = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect x="8"  y="12" width="48" height="5" rx="2.5" fill="white"/>
        <rect x="4"  y="24" width="56" height="5" rx="2.5" fill="white"/>
        <rect x="8"  y="36" width="48" height="5" rx="2.5" fill="white"/>
        <rect x="14" y="48" width="36" height="5" rx="2.5" fill="white"/>
    </svg>`;

    // Дождь
    const SVG_RAIN = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 36 Q3 36 3 28 Q3 19 14 19 Q15 11 26 11 Q39 11 41 20 Q50 20 50 28 Q50 36 41 36 Z" fill="white"/>
        <line x1="17" y1="43" x2="13" y2="56" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="30" y1="43" x2="26" y2="56" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="43" y1="43" x2="39" y2="56" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`;

    // Снег
    const SVG_SNOW = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 34 Q3 34 3 26 Q3 17 14 17 Q15 9 26 9 Q39 9 41 18 Q50 18 50 26 Q50 34 41 34 Z" fill="white"/>
        <circle cx="16" cy="46" r="4" fill="white"/>
        <circle cx="32" cy="51" r="4" fill="white"/>
        <circle cx="48" cy="46" r="4" fill="white"/>
    </svg>`;

    // Гроза
    const SVG_THUNDER = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 32 Q3 32 3 24 Q3 15 14 15 Q15 7 26 7 Q39 7 41 16 Q50 16 50 24 Q50 32 41 32 Z" fill="white"/>
        <polygon points="35,33 22,48 31,48 26,62 44,45 34,45" fill="white"/>
    </svg>`;

    function getWeatherSVG(code) {
        if (code === 0)                              return SVG_SUN;
        if (code <= 2)                               return SVG_PARTLY;
        if (code === 3)                              return SVG_CLOUD;
        if (code <= 48)                              return SVG_FOG;
        if ((code >= 51 && code <= 82))              return SVG_RAIN;
        if ((code >= 71 && code <= 77) ||
            (code >= 85 && code <= 86))              return SVG_SNOW;
        if (code >= 95)                              return SVG_THUNDER;
        return SVG_CLOUD;
    }

    // ──────────────────────────────────────────
    // ПОГОДА — Open-Meteo (без ключа)
    // Ульяновск: 54.3282°N, 48.3878°E
    // ──────────────────────────────────────────
    const WEATHER_API =
        'https://api.open-meteo.com/v1/forecast' +
        '?latitude=54.3282&longitude=48.3878' +
        '&current_weather=true' +
        '&wind_speed_unit=ms';

    const WIND_DIRS = ['С','СВ','В','ЮВ','Ю','ЮЗ','З','СЗ'];

    function degToDir(deg) {
        return WIND_DIRS[Math.round(deg / 45) % 8];
    }

    const weatherIconEl = document.getElementById('weather-icon');
    const weatherTempEl = document.getElementById('weather-temp');
    const weatherWindEl = document.getElementById('weather-wind');

    async function fetchWeather() {
        try {
            const resp = await fetch(WEATHER_API);
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const data = await resp.json();
            const cw = data.current_weather;

            const temp = Math.round(cw.temperature);
            const wind = Math.round(cw.windspeed);
            const dir  = degToDir(cw.winddirection);
            const code = cw.weathercode;

            if (weatherTempEl) weatherTempEl.textContent = `${temp > 0 ? '+' : ''}${temp}°C`;
            if (weatherWindEl) weatherWindEl.textContent = `${dir} ${wind} м/с`;
            if (weatherIconEl) weatherIconEl.innerHTML = getWeatherSVG(code);

        } catch (err) {
            console.warn('Погода недоступна:', err);
            if (weatherTempEl) weatherTempEl.textContent = '—°C';
            if (weatherWindEl) weatherWindEl.textContent = '— м/с';
            if (weatherIconEl) weatherIconEl.innerHTML = SVG_CLOUD;
        }
    }

    fetchWeather();
    // Обновлять погоду каждые 10 минут
    setInterval(fetchWeather, 10 * 60 * 1000);

    // Высоты колонок выравниваются через CSS aspect-ratio на .geo-map — JS не нужен

    // ──────────────────────────────────────────
    // ИЗВЕСТНЫЕ ЛЮДИ — интерактивные портреты
    // ──────────────────────────────────────────

    const PEOPLE = [
        {
            name: 'Ленин В.И.',
            bio:  'Владимир Ильич Ульянов (Ленин) (1870–1924) — революционер, основатель и первый руководитель Советского государства. Родился и провел юность в Симбирске. Его деятельность коренным образом изменила ход мировой истории XX века. В 1924 году город был переименован в Ульяновск в его честь.'
        },
        {
            name: 'Сергей Жуков',
            bio:  'Сергей Жуков (род. 1971) — российский певец, продюсер и шоумен, солист группы «Иванушки International». Уроженец Ульяновска. Стал одной из самых ярких звёзд российской поп-сцены 1990–2000-х годов, выпустив десятки хитов, известных по всей стране.'
        },
        {
            name: 'И.А. Гончаров',
            bio:  'Иван Александрович Гончаров (1812–1891) — великий русский писатель, автор романов «Обыкновенная история», «Обломов» и «Обрыв». Родился в Симбирске (ныне Ульяновск). Его роман «Обломов» вошёл в золотой фонд мировой классической литературы.'
        },
        {
            name: 'Н.М. Карамзин',
            bio:  'Николай Михайлович Карамзин (1766–1826) — выдающийся русский историк, писатель и реформатор языка. Родился в Симбирской губернии. Создал фундаментальный труд «История государства Российского» и заложил основы современного русского литературного языка.'
        },
        {
            name: 'Н. С. Сафронов',
            bio:  'Никас Степанович Сафронов (род. 1956) — российский художник, заслуженный художник России. Уроженец Ульяновска. Широко известен благодаря портретам знаменитостей в авторской технике Dream Vision и монументальным работам, экспонируемым по всему миру.'
        },
        {
            name: 'А. А. Пластов',
            bio:  'Аркадий Александрович Пластов (1893–1972) — выдающийся советский живописец, народный художник СССР, лауреат Ленинской и Государственной премий. Родился в Симбирской губернии. Прославился жанровыми картинами крестьянской жизни и проникновенными портретами.'
        }
    ];

    const peopleGrid = document.getElementById('people-grid');
    const bioPanel   = document.getElementById('people-bio');
    const bioText    = document.getElementById('people-bio-text');

    if (peopleGrid && bioPanel && bioText) {
        const cards = Array.from(peopleGrid.querySelectorAll('.person-card'));

        function updateArrow(card) {
            const gridRect = peopleGrid.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const centerX  = cardRect.left - gridRect.left + cardRect.width / 2;
            const pct      = (centerX / gridRect.width * 100).toFixed(2) + '%';
            bioPanel.style.setProperty('--bio-arrow', pct);
        }

        function activatePerson(index) {
            cards.forEach((c, i) => c.classList.toggle('active', i === index));
            bioText.textContent = PEOPLE[index].bio;
            updateArrow(cards[index]);
        }

        cards.forEach((card, i) => {
            card.addEventListener('click', () => activatePerson(i));
        });

        // Инициализируем позицию стрелки после загрузки
        window.addEventListener('load', () => updateArrow(cards[0]));
        window.addEventListener('resize', () => {
            const active = cards.findIndex(c => c.classList.contains('active'));
            if (active >= 0) updateArrow(cards[active]);
        });
    }

    // ──────────────────────────────────────────
    // СИМВОЛЫ ГОРОДА — 2-страничный слайдер
    // Страница 0: УАЗ + Симбирцит + Родина динозавров  (3+3+6 = 12 кол.)
    // Страница 1: Обломов + Родина «Ё» + Родина самолётов (3+3+6 = 12 кол.)
    // translateX(-50%) от ширины трека (200%) = сдвиг на 100% обёртки
    // ──────────────────────────────────────────
    const symTrack = document.getElementById('symbols-track');
    const symPrev  = document.getElementById('sym-prev');
    const symNext  = document.getElementById('sym-next');

    if (symTrack && symPrev && symNext) {
        let symPage = 0;
        const SYM_PAGES = 2;

        function updateSymSlider() {
            symTrack.style.transform = symPage === 0
                ? 'translateX(0)'
                : 'translateX(-50%)';
            symPrev.disabled = symPage === 0;
            symNext.disabled = symPage === SYM_PAGES - 1;
        }

        symPrev.addEventListener('click', () => {
            if (symPage > 0) { symPage--; updateSymSlider(); }
        });
        symNext.addEventListener('click', () => {
            if (symPage < SYM_PAGES - 1) { symPage++; updateSymSlider(); }
        });

        updateSymSlider(); // начальное состояние кнопок
    }

});
