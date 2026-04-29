/* ===================================================
   ЗАГРУЗКА СУВЕНИРОВ ИЗ SUPABASE
   Вставь сюда свои данные из Project Settings → API
=================================================== */
const SUPABASE_URL = 'https://vrdhbxicxbhybmgnsmma.supabase.co';       // https://xxxxxx.supabase.co
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZGhieGljeGJoeWJtZ25zbW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0ODMwMTUsImV4cCI6MjA5MzA1OTAxNX0.y3CZkGY-beOJ-DLrlEgCuVfDt3lVFvJVXwrlpsr70v0';   // eyJ...

async function loadSouvenirs() {
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/souvenirs?select=*&order=sort_order.asc`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!res.ok) {
            console.warn('Supabase недоступен, оставляем статичные карточки.');
            return;
        }

        const souvenirs = await res.json();
        if (!Array.isArray(souvenirs) || souvenirs.length === 0) return;

        /* Группируем по категории */
        const byCategory = {};
        souvenirs.forEach(s => {
            (byCategory[s.category] = byCategory[s.category] || []).push(s);
        });

        /* Заполняем каждую секцию */
        document.querySelectorAll('.souv-section').forEach(section => {
            const cat  = section.dataset.category;
            const grid = section.querySelector('.souv-grid');
            if (!grid || !byCategory[cat]) return;

            grid.innerHTML = '';
            byCategory[cat].forEach(item => {
                grid.insertAdjacentHTML('beforeend', buildCard(item));
            });
        });

    } catch (err) {
        console.warn('Ошибка загрузки сувениров из Supabase:', err);
    }
}

function buildCard(item) {
    const imgHtml  = item.image_filename
        ? `<img src="img/souvenirs/${esc(item.image_filename)}" alt="${esc(item.name)}">`
        : '';
    const imgClass = item.image_filename ? '' : ' souv-card__img--placeholder';

    const price = item.price.toLocaleString('ru-RU') + ' ₽';

    const attrs = [
        `data-name="${esc(item.name)}"`,
        item.color       ? `data-color="${esc(item.color)}"` : '',
        item.specs       ? `data-specs="${esc(item.specs)}"` : '',
        item.weight      ? `data-weight="${esc(item.weight)}"` : '',
        item.description ? `data-description="${esc(item.description)}"` : '',
    ].filter(Boolean).join(' ');

    return `<div class="souv-card" ${attrs}>
    <div class="souv-card__img${imgClass}">${imgHtml}</div>
    <div class="souv-card__footer">
        <span class="souv-card__name">${esc(item.name)}</span>
        <span class="souv-card__price">${price}</span>
    </div>
</div>`;
}

function esc(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/* Запускаем сразу — карточки отрисуются до первого клика пользователя */
loadSouvenirs();
