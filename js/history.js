// Страница истории — горизонтальный скролл + таймлайн + эффект заголовка
document.addEventListener('DOMContentLoaded', () => {
    const historyScroll = document.querySelector('.history-scroll');
    const blocks = document.querySelectorAll('.history-block');
    const dots = document.querySelectorAll('.timeline-dot');
    const progress = document.querySelector('.timeline-progress');
    const indicator = document.querySelector('.timeline-indicator');
    const timeline = document.querySelector('.history-timeline');
    const subtitleFixed = document.querySelector('.history-subtitle-fixed');

    // Мобильный таймлайн — переменные объявлены до первого вызова updateTimeline()
    const blockLabels = ['1648', '1769', '1898–1916', '1941–1943', '1965–1970', 'с 1976'];
    const mobTimelineEl = document.querySelector('.history-timeline-mob');
    const mobDotEls = [
        document.getElementById('mob-dot-a'),
        document.getElementById('mob-dot-b'),
        document.getElementById('mob-dot-c'),
    ];
    let mobRoles = [0, 1, 2];
    let mobActiveIndex = 0;

    if (!historyScroll || blocks.length === 0) return;

    const totalBlocks = blocks.length;
    const dotPositions = [0, 37, 76, 89, 95, 100];

    let currentIndex = 0;
    let isScrolling = false;

    function scrollToBlock(index) {
        if (isScrolling || index < 0 || index >= totalBlocks) return;
        isScrolling = true;
        currentIndex = index;

        const blockWidth = historyScroll.clientWidth;
        historyScroll.scrollTo({
            left: blockWidth * index,
            behavior: 'smooth'
        });

        setTimeout(() => {
            isScrolling = false;
        }, 600);
    }

    // Обновление таймлайна при скролле
    function updateTimeline() {
        const scrollLeft = historyScroll.scrollLeft;
        const maxScroll = historyScroll.scrollWidth - historyScroll.clientWidth;
        const scrollPercent = maxScroll > 0 ? scrollLeft / maxScroll : 0;

        // progress.style.width убран — линия всегда статичная тёмносиняя

        const activeIndex = Math.round(scrollPercent * (totalBlocks - 1));
        indicator.style.left = `${dotPositions[activeIndex]}%`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('timeline-dot--active', i === activeIndex);
        });

        // Мобильный таймлайн (≤768px)
        if (window.innerWidth <= 768) goToMobBlock(activeIndex);
    }

    // ===== МОЙ МОБИЛЬНЫЙ ТАЙМЛАЙН =====
    function setMobSlot(dotEl, slot, label) {
        ['current', 'next', 'off-left', 'off-right'].forEach(s =>
            dotEl.classList.remove(`timeline-mob-dot--${s}`)
        );
        dotEl.classList.add(`timeline-mob-dot--${slot}`);
        if (label !== undefined) {
            dotEl.querySelector('.timeline-mob-label').textContent = label;
        }
    }

    // Обновляем линию в зависимости от активного блока
    function updateMobLine(index) {
        const lineEl = mobTimelineEl && mobTimelineEl.querySelector('.timeline-mob-line');
        if (!lineEl) return;
        const dotRadius = '1.5625rem'; // половина текущей точки (3.125rem / 2)
        if (index === 0) {
            // Первый блок: линия от центра точки до правого края экрана
            lineEl.style.left  = dotRadius;
            lineEl.style.right = '-1.5rem';
        } else if (index >= blockLabels.length - 1) {
            // Последний блок: линия от левого края экрана до центра точки
            lineEl.style.left  = '-1.5rem';
            lineEl.style.right = `calc(100% - ${dotRadius})`;
        } else {
            // Средние блоки: линия уходит за оба края
            lineEl.style.left  = '-1.5rem';
            lineEl.style.right = '-1.5rem';
        }
    }

    function initMobTimeline() {
        if (!mobTimelineEl || !mobDotEls[0]) return;
        const lineEl = mobTimelineEl.querySelector('.timeline-mob-line');
        // Без анимации при инициализации
        mobDotEls.forEach(d => d.classList.add('no-transition'));
        if (lineEl) lineEl.style.transition = 'none';
        setMobSlot(mobDotEls[0], 'current', blockLabels[0]);
        setMobSlot(mobDotEls[1], blockLabels[1] ? 'next' : 'off-right', blockLabels[1] || '');
        setMobSlot(mobDotEls[2], 'off-right', '');
        updateMobLine(0);
        mobDotEls[0].getBoundingClientRect();
        mobDotEls.forEach(d => d.classList.remove('no-transition'));
        if (lineEl) lineEl.style.transition = '';
        mobRoles = [0, 1, 2];
        mobActiveIndex = 0;
    }

    function goToMobBlock(newIndex) {
        if (!mobTimelineEl || !mobDotEls[0]) return;
        if (newIndex === mobActiveIndex) return;

        if (Math.abs(newIndex - mobActiveIndex) > 1) {
            mobDotEls.forEach(d => {
                d.classList.add('no-transition');
                setMobSlot(d, 'off-right', '');
            });
            mobDotEls[0].getBoundingClientRect();
            mobDotEls.forEach(d => d.classList.remove('no-transition'));
            setMobSlot(mobDotEls[0], 'current', blockLabels[newIndex]);
            const hasNext = newIndex + 1 < blockLabels.length;
            setMobSlot(mobDotEls[1], hasNext ? 'next' : 'off-right', blockLabels[newIndex + 1] || '');
            setMobSlot(mobDotEls[2], 'off-right', '');
            mobRoles = [0, 1, 2];
            mobActiveIndex = newIndex;
            return;
        }

        const forward = newIndex > mobActiveIndex;
        const [currIdx, nextIdx, spareIdx] = mobRoles;
        const currDot = mobDotEls[currIdx];
        const nextDot = mobDotEls[nextIdx];
        const spareDot = mobDotEls[spareIdx];

        if (forward) {
            spareDot.classList.add('no-transition');
            setMobSlot(spareDot, 'off-right', blockLabels[newIndex + 1] || '');
            spareDot.getBoundingClientRect();
            spareDot.classList.remove('no-transition');
            setMobSlot(currDot, 'off-left');
            setMobSlot(nextDot, 'current');
            if (newIndex + 1 < blockLabels.length) setMobSlot(spareDot, 'next');
            mobRoles = [nextIdx, spareIdx, currIdx];
        } else {
            spareDot.classList.add('no-transition');
            setMobSlot(spareDot, 'off-left', blockLabels[newIndex]);
            spareDot.getBoundingClientRect();
            spareDot.classList.remove('no-transition');
            setMobSlot(nextDot, 'off-right');
            setMobSlot(currDot, 'next');
            setMobSlot(spareDot, 'current');
            mobRoles = [spareIdx, currIdx, nextIdx];
        }
        mobActiveIndex = newIndex;
        updateMobLine(newIndex);
    }

    // Колёсико мыши: вертикальный скролл → горизонтальный
    const historyMain = document.querySelector('.history-main');
    let stickyReleased = false;

    historyScroll.addEventListener('wheel', (e) => {
        e.preventDefault();

        // После отпускания sticky — форвардим дельту в window, не трогаем горизонталь
        if (stickyReleased) {
            window.scrollBy({ top: e.deltaY, behavior: 'auto' });
            return;
        }

        if (isScrolling) return;

        // Проверяем, на последнем ли блоке
        const scrollLeft = historyScroll.scrollLeft;
        const maxScroll = historyScroll.scrollWidth - historyScroll.clientWidth;
        const isLastBlock = scrollLeft >= maxScroll - 10;

        // На последнем блоке + скролл вниз → отпускаем sticky
        if (isLastBlock && e.deltaY > 30) {
            stickyReleased = true;
            historyMain.style.position = 'relative';
            historyMain.style.height = 'auto';
            historyMain.style.overflow = 'visible';
            historyMain.style.zIndex = 'auto';

            // Ждём пересчёта layout, затем скроллим к футеру
            requestAnimationFrame(() => {
                const footer = document.querySelector('.footer');
                if (footer) footer.scrollIntoView({ behavior: 'smooth' });
            });
            return;
        }

        // Определяем направление
        if (e.deltaY > 30 || e.deltaX > 30) {
            scrollToBlock(currentIndex + 1);
        } else if (e.deltaY < -30 || e.deltaX < -30) {
            scrollToBlock(currentIndex - 1);
        }
    }, { passive: false });

    // Глобальный скролл — скрываем подпись «История» при небольшом скролле,
    // таймлайн — когда дошли до футера
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 60;
        subtitleFixed.classList.toggle('hidden', scrolled);

        const footer = document.querySelector('.footer');
        if (footer) {
            const footerVisible = footer.getBoundingClientRect().top < window.innerHeight;
            timeline.classList.toggle('hidden', footerVisible);
            mobTimelineEl && mobTimelineEl.classList.toggle('hidden', footerVisible);
        }
    });

    // Клик по точке — скролл к блоку
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            scrollToBlock(i);
        });
    });

    // Клавиши влево/вправо
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollToBlock(currentIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollToBlock(currentIndex - 1);
        }
    });

    // Слушаем скролл
    historyScroll.addEventListener('scroll', updateTimeline);

    // Инициализация
    updateTimeline();
    initMobTimeline();

    // ===== ЭФФЕКТ ЗАГОЛОВКА: часть белая на фоне фото =====
    const titles = document.querySelectorAll('.history-title[data-gradient]');

    function updateTitleGradient() {
        titles.forEach(title => {
            // Ищем картинки только в том же блоке, что и заголовок
            const block = title.closest('.history-block');
            if (!block) return;
            const blockImages = block.querySelectorAll('.history-img-wrapper img');

            const titleRect = title.getBoundingClientRect();
            const titleLeft  = titleRect.left;
            const titleRight = titleRect.right;
            const titleWidth = titleRight - titleLeft;

            let photoLeft = Infinity;

            blockImages.forEach(img => {
                const imgRect = img.getBoundingClientRect();

                // Вертикальное пересечение
                const vOverlap = titleRect.bottom > imgRect.top && titleRect.top < imgRect.bottom;
                if (!vOverlap) return;

                // Левый край перекрытия заголовка и картинки
                const overlapStart = Math.max(titleLeft, imgRect.left);

                // Перекрытие должно быть внутри заголовка и правее его левого края
                if (overlapStart > titleLeft && overlapStart < titleRight && overlapStart < photoLeft) {
                    photoLeft = overlapStart;
                }
            });

            if (photoLeft < Infinity) {
                const splitPercent = ((photoLeft - titleLeft) / titleWidth) * 100;
                title.style.setProperty('--split-point', `${splitPercent}%`);
                title.classList.add('history-title--gradient');
            } else {
                title.classList.remove('history-title--gradient');
                title.style.removeProperty('--split-point');
            }
        });
    }

    historyScroll.addEventListener('scroll', updateTitleGradient);
    window.addEventListener('resize', updateTitleGradient);
    window.addEventListener('load', updateTitleGradient);
    updateTitleGradient();

    // ===== ЭФФЕКТ ГРАДИЕНТА НА ПОДПИСЯХ ТАЙМЛАЙНА =====
    // Градиент только когда конкретный <img> реально перекрывает подпись
    // и по вертикали, и по горизонтали. Без реального фото — без градиента.
    const timelineLabels = document.querySelectorAll('.timeline-label');

    // data-text нужен для ::before псевдоэлемента (обводка только на белой части)
    timelineLabels.forEach(lbl => { lbl.dataset.text = lbl.textContent.trim(); });
    titles.forEach(t => { t.dataset.text = t.textContent.trim(); });

    function updateLabelGradients() {
        // Только десктоп — мобильный таймлайн отдельный
        if (window.innerWidth <= 1000) return;

        // Берём картинки только текущего (видимого) блока
        const blockWidth  = historyScroll.clientWidth || window.innerWidth;
        const activeIdx   = Math.round(historyScroll.scrollLeft / blockWidth);
        const activeBlock = blocks[activeIdx] || blocks[0];
        const blockImages = activeBlock
            ? Array.from(activeBlock.querySelectorAll('.history-img-wrapper img'))
            : [];

        timelineLabels.forEach(label => {
            const lr = label.getBoundingClientRect();
            if ((lr.bottom - lr.top) <= 0) return;

            // Объединённый прямоугольник пересечения подписи со всеми перекрывающими картинками
            let ix1 = Infinity, iy1 = Infinity, ix2 = -Infinity, iy2 = -Infinity;
            let hasOverlap = false;

            blockImages.forEach(img => {
                const ir = img.getBoundingClientRect();

                // Нет вертикального перекрытия — пропускаем
                if (lr.bottom <= ir.top || lr.top >= ir.bottom) return;

                // Нет горизонтального перекрытия — пропускаем
                if (ir.right <= lr.left || ir.left >= lr.right) return;

                // Прямоугольник пересечения
                const ox1 = Math.max(ir.left, lr.left);
                const oy1 = Math.max(ir.top,  lr.top);
                const ox2 = Math.min(ir.right,  lr.right);
                const oy2 = Math.min(ir.bottom, lr.bottom);

                ix1 = Math.min(ix1, ox1);
                iy1 = Math.min(iy1, oy1);
                ix2 = Math.max(ix2, ox2);
                iy2 = Math.max(iy2, oy2);
                hasOverlap = true;
            });

            if (hasOverlap) {
                label.style.setProperty('--lbl-px', `${(ix1 - lr.left).toFixed(1)}px`);
                label.style.setProperty('--lbl-py', `${(iy1 - lr.top).toFixed(1)}px`);
                label.style.setProperty('--lbl-wx', `${(ix2 - ix1).toFixed(1)}px`);
                label.style.setProperty('--lbl-wy', `${(iy2 - iy1).toFixed(1)}px`);
                label.classList.add('timeline-label--gradient');
            } else {
                label.classList.remove('timeline-label--gradient');
                ['--lbl-px', '--lbl-py', '--lbl-wx', '--lbl-wy'].forEach(p => label.style.removeProperty(p));
            }
        });
    }

    historyScroll.addEventListener('scroll', updateLabelGradients);
    window.addEventListener('resize', updateLabelGradients);
    window.addEventListener('load', updateLabelGradients);
    updateLabelGradients();
});
