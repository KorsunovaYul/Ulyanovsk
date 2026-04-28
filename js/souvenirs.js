/* ===== СТРАНИЦА СУВЕНИРЫ ===== */

document.addEventListener('DOMContentLoaded', () => {

    const sortBtn        = document.getElementById('sortBtn');
    const sortDropdown   = document.getElementById('sortDropdown');
    const searchInput    = document.querySelector('.souv-search');
    const sections       = document.querySelectorAll('.souv-section');
    const filterBtnLabel = sortBtn ? sortBtn.querySelector('span') : null;

    const resultsWrap    = document.getElementById('souvResults');
    const resultsGrid    = document.getElementById('souvResultsGrid');
    const resultTitle    = document.getElementById('souvResultsTitle');
    const noResults      = document.getElementById('souvNoResults');

    let activeFilter = 'all';
    let searchQuery  = '';

    /* ══ ОСНОВНАЯ ФУНКЦИЯ ══ */
    function applyFilters() {
        const hasQuery = searchQuery.length > 0;

        if (hasQuery) {
            showSearchResults();
        } else {
            hideSearchResults();
            applyCategoryFilter();
        }
    }

    /* ── Режим поиска: показываем плоскую сетку с клонами карточек ── */
    function showSearchResults() {
        /* Скрываем все обычные секции */
        sections.forEach(s => s.classList.add('souv-section--hidden'));

        /* Включаем блок результатов */
        resultsWrap.classList.add('souv-results--active');

        /* Собираем все карточки, фильтруем по запросу (+ категории если выбрана) */
        resultsGrid.innerHTML = '';
        let count = 0;

        document.querySelectorAll('.souv-card').forEach(card => {
            const name = (card.dataset.name || '').toLowerCase();
            const cat  = card.closest('.souv-section')?.dataset.category || '';

            const catOk   = activeFilter === 'all' || activeFilter === cat;
            const nameOk  = name.includes(searchQuery);

            if (catOk && nameOk) {
                const clone = card.cloneNode(true);
                resultsGrid.appendChild(clone);
                count++;
            }
        });

        resultTitle.textContent = count > 0
            ? `Найдено: ${count} ${plural(count, 'сувенир', 'сувенира', 'сувениров')}`
            : '';
        noResults.hidden  = count > 0;
        resultsGrid.style.display = count > 0 ? '' : 'none';
    }

    /* ── Нормальный режим: показываем секции по категории ── */
    function hideSearchResults() {
        resultsWrap.classList.remove('souv-results--active');
        sections.forEach(s => s.classList.remove('souv-section--hidden'));
    }

    function applyCategoryFilter() {
        sections.forEach(section => {
            const cat = section.dataset.category;
            const show = activeFilter === 'all' || activeFilter === cat;
            section.classList.toggle('souv-section--hidden', !show);
        });
    }

    /* ── Склонение числительных (без числа — число добавляется снаружи) ── */
    function plural(n, one, few, many) {
        const mod10  = n % 10;
        const mod100 = n % 100;
        if (mod10 === 1 && mod100 !== 11) return one;
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
        return many;
    }

    /* ══ ВЫПАДАЮЩИЙ ФИЛЬТР ══ */
    if (sortBtn && sortDropdown) {

        sortBtn.addEventListener('click', () => {
            const isOpen = sortBtn.getAttribute('aria-expanded') === 'true';
            sortBtn.setAttribute('aria-expanded', String(!isOpen));
            sortDropdown.hidden = isOpen;
        });

        sortDropdown.querySelectorAll('.souv-sort-option').forEach(opt => {
            opt.addEventListener('click', () => {
                sortDropdown.querySelectorAll('.souv-sort-option').forEach(o =>
                    o.classList.remove('souv-sort-option--active')
                );
                opt.classList.add('souv-sort-option--active');

                activeFilter = opt.dataset.filter;
                filterBtnLabel.textContent = opt.textContent;

                sortBtn.setAttribute('aria-expanded', 'false');
                sortDropdown.hidden = true;

                applyFilters();
            });
        });

        document.addEventListener('click', (e) => {
            if (!sortBtn.closest('.souv-sort-wrap').contains(e.target)) {
                sortBtn.setAttribute('aria-expanded', 'false');
                sortDropdown.hidden = true;
            }
        });
    }

    /* ══ ПОИСК ══ */
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchQuery = searchInput.value.trim().toLowerCase();
            applyFilters();
        });
    }

    /* ══ ПОПАП СУВЕНИРА ══ */
    const modal        = document.getElementById('souvModal');
    const modalOverlay = document.getElementById('souvModalOverlay');
    const modalClose   = document.getElementById('souvModalClose');
    const modalImgWrap = document.getElementById('modalImgWrap');
    const modalName    = document.getElementById('modalName');
    const modalBody    = document.getElementById('modalBody');
    const modalPrice   = document.getElementById('modalPrice');

    /* ── Общий заполнитель попапа ── */
    function fillModal(imgSrc, imgAlt, name, price, color, specs, weight) {
        modalImgWrap.innerHTML = '';
        if (imgSrc) {
            const el = document.createElement('img');
            el.src = imgSrc;
            el.alt = imgAlt || '';
            modalImgWrap.appendChild(el);
            modalImgWrap.classList.remove('souv-modal__img-wrap--placeholder');
        } else {
            modalImgWrap.classList.add('souv-modal__img-wrap--placeholder');
        }

        modalName.textContent  = name  || '';
        modalPrice.textContent = price || '';

        let html = '';
        if (color)  html += `<p class="souv-modal__color">Цвет — ${color}</p>`;
        if (specs) {
            html += `<p class="souv-modal__specs-title">Материал и размеры:</p>`;
            specs.split('|').forEach(line => { html += `<p>${line.trim()}</p>`; });
        }
        if (weight) html += `<p class="souv-modal__weight">Вес: ${weight}</p>`;
        modalBody.innerHTML = html;

        modal.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    /* ── Открыть попап из карточки .souv-card (страница сувениров) ── */
    function openModal(card) {
        const img    = card.querySelector('.souv-card__img img');
        const name   = card.querySelector('.souv-card__name')?.textContent || '';
        const price  = card.querySelector('.souv-card__price')?.textContent || '';
        fillModal(
            img ? img.src : null,
            img ? img.alt : '',
            name, price,
            card.dataset.color  || '',
            card.dataset.specs  || '',
            card.dataset.weight || ''
        );
    }

    /* ── Открыть попап из .souvenir-item (главная страница) ── */
    function openModalFromItem(item) {
        const img    = item.querySelector('.souvenir-img');
        const name   = item.querySelector('.souvenir-name')?.textContent || '';
        const price  = item.querySelector('.souvenir-price')?.textContent || '';
        fillModal(
            img ? img.src : null,
            img ? img.alt : '',
            name, price,
            item.dataset.color  || '',
            item.dataset.specs  || '',
            item.dataset.weight || ''
        );
    }

    function closeModal() {
        modal.hidden = true;
        document.body.style.overflow = '';
    }

    /* ══ ПОЛНОЭКРАННЫЙ ПРОСМОТР ФОТО ══ */
    const fullscreen        = document.getElementById('souvFullscreen');
    const fullscreenImg     = document.getElementById('souvFullscreenImg');
    const fullscreenClose   = document.getElementById('souvFullscreenClose');
    const fullscreenOverlay = document.getElementById('souvFullscreenOverlay');

    function openFullscreen(src, alt) {
        fullscreenImg.src = src;
        fullscreenImg.alt = alt || '';
        fullscreen.hidden = false;
    }

    function closeFullscreen() {
        fullscreen.hidden = true;
        fullscreenImg.src = '';
    }

    if (fullscreen) {
        fullscreenClose.addEventListener('click', closeFullscreen);
        fullscreenOverlay.addEventListener('click', closeFullscreen);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && !fullscreen.hidden) closeFullscreen();
        });
    }

    if (modal) {
        /* Клик по фото в попапе — открыть полноэкранный просмотр */
        modalImgWrap.addEventListener('click', () => {
            const img = modalImgWrap.querySelector('img');
            if (img) openFullscreen(img.src, img.alt);
        });

        modalOverlay.addEventListener('click', closeModal);
        modalClose.addEventListener('click', closeModal);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && !modal.hidden && fullscreen.hidden) closeModal();
        });

        /* Клик по карточке — делегирование для .souv-card и .souvenir-item */
        document.addEventListener('click', e => {
            /* Клик внутри попапа — игнорируем (кроме overlay/close) */
            if (!modal.hidden && e.target.closest('#souvModal')) return;

            const card = e.target.closest('.souv-card');
            if (card) { openModal(card); return; }

            const item = e.target.closest('.souvenir-item');
            if (item) { openModalFromItem(item); return; }
        });
    }

});
