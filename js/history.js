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

        // Мобильный / планшетный таймлайн (≤1000px)
        if (window.innerWidth <= 1000) goToMobBlock(activeIndex);
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
        // На мобилке (≤768px) — обычный вертикальный скролл, не перехватываем
        if (window.innerWidth <= 768) return;

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

    // ===== ВЕРТИКАЛЬНЫЙ ТАЙМЛАЙН (мобилка ≤768px) — 3 слота с анимацией =====
    const vertTimeline = document.getElementById('histTimelineVert');
    const vertSlotEls = [
        document.getElementById('vert-slot-a'),
        document.getElementById('vert-slot-b'),
        document.getElementById('vert-slot-c')
    ];
    const vertBlockLabels = ['1648', '1769', '1898–1916', '1941–1943', '1965–1970', 'с 1976'];
    let vertRoles = [0, 1, 2]; // индексы слотов: [текущий, следующий, запасной]
    let vertActiveIdx = 0;

    function setVertSlot(slotEl, role, label) {
        ['current', 'next', 'off-top', 'off-bottom'].forEach(r =>
            slotEl.classList.remove(`timeline-vert-slot--${r}`)
        );
        slotEl.classList.add(`timeline-vert-slot--${role}`);
        if (label !== undefined) {
            slotEl.querySelector('.timeline-vert-label').textContent = label;
        }
    }

    function setVertLast(idx) {
        vertTimeline.classList.toggle('history-timeline-vert--last', idx === vertBlockLabels.length - 1);
    }

    function initVertTimeline() {
        if (!vertTimeline || !vertSlotEls[0]) return;
        // Без анимации ставим все в off-bottom, затем применяем начальное состояние
        vertSlotEls.forEach(s => s.classList.add('no-transition'));
        setVertSlot(vertSlotEls[0], 'off-bottom', vertBlockLabels[0]);
        setVertSlot(vertSlotEls[1], 'off-bottom', vertBlockLabels[1] || '');
        setVertSlot(vertSlotEls[2], 'off-bottom', '');
        vertSlotEls[0].getBoundingClientRect(); // force reflow
        vertSlotEls.forEach(s => s.classList.remove('no-transition'));
        setVertSlot(vertSlotEls[0], 'current', vertBlockLabels[0]);
        setVertSlot(vertSlotEls[1], vertBlockLabels[1] ? 'next' : 'off-bottom', vertBlockLabels[1] || '');
        vertRoles = [0, 1, 2];
        vertActiveIdx = 0;
        setVertLast(0);
    }

    function updateVertTimeline(newIdx) {
        if (!vertTimeline || !vertSlotEls[0]) return;
        if (newIdx === vertActiveIdx) return;

        // Прыжок через несколько блоков — без анимации
        if (Math.abs(newIdx - vertActiveIdx) > 1) {
            vertSlotEls.forEach(s => {
                s.classList.add('no-transition');
                setVertSlot(s, 'off-bottom', '');
            });
            vertSlotEls[0].getBoundingClientRect();
            vertSlotEls.forEach(s => s.classList.remove('no-transition'));
            setVertSlot(vertSlotEls[0], 'current', vertBlockLabels[newIdx]);
            const hasNext = newIdx + 1 < vertBlockLabels.length;
            setVertSlot(vertSlotEls[1], hasNext ? 'next' : 'off-bottom', vertBlockLabels[newIdx + 1] || '');
            setVertSlot(vertSlotEls[2], 'off-bottom', '');
            vertRoles = [0, 1, 2];
            vertActiveIdx = newIdx;
            setVertLast(newIdx);
            return;
        }

        const isForward = newIdx > vertActiveIdx;
        const [currIdx, nextIdx, spareIdx] = vertRoles;
        const currSlot = vertSlotEls[currIdx];
        const nextSlot = vertSlotEls[nextIdx];
        const spareSlot = vertSlotEls[spareIdx];

        if (isForward) {
            // Запасной: мгновенно ставим за нижний край с новой подписью
            spareSlot.classList.add('no-transition');
            setVertSlot(spareSlot, 'off-bottom', vertBlockLabels[newIdx + 1] || '');
            spareSlot.getBoundingClientRect();
            spareSlot.classList.remove('no-transition');
            // Текущий уходит вверх, следующий становится текущим, запасной — следующим
            setVertSlot(currSlot, 'off-top');
            setVertSlot(nextSlot, 'current');
            if (newIdx + 1 < vertBlockLabels.length) setVertSlot(spareSlot, 'next');
            vertRoles = [nextIdx, spareIdx, currIdx];
        } else {
            // Запасной: мгновенно ставим за верхний край с подписью нового блока
            spareSlot.classList.add('no-transition');
            setVertSlot(spareSlot, 'off-top', vertBlockLabels[newIdx]);
            spareSlot.getBoundingClientRect();
            spareSlot.classList.remove('no-transition');
            // Следующий уходит вниз, текущий становится следующим, запасной — текущим
            setVertSlot(nextSlot, 'off-bottom');
            setVertSlot(currSlot, 'next');
            setVertSlot(spareSlot, 'current');
            vertRoles = [spareIdx, currIdx, nextIdx];
        }
        vertActiveIdx = newIdx;
        setVertLast(newIdx);
    }

    // IntersectionObserver для вертикального скролла (мобилка)
    // Триггер — когда заголовок блока пересекает середину экрана
    if (vertTimeline) {
        const ioOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // узкая полоса в центре экрана
            threshold: 0
        };
        const ioCallback = (entries) => {
            if (window.innerWidth > 768) return;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const block = entry.target.closest('.history-block');
                    if (block) {
                        const idx = parseInt(block.dataset.index, 10);
                        if (!isNaN(idx)) updateVertTimeline(idx);
                    }
                }
            });
        };
        const observer = new IntersectionObserver(ioCallback, ioOptions);
        // Наблюдаем за заголовками, а не за целыми блоками
        blocks.forEach(block => {
            const title = block.querySelector('.history-title');
            if (title) observer.observe(title);
        });
        initVertTimeline();
    }

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
            vertTimeline && vertTimeline.classList.toggle('hidden', footerVisible);
        }
    });

    // Клик по точке — скролл к блоку
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            scrollToBlock(i);
        });
    });

    // Клавиши влево/вправо (только десктоп)
    document.addEventListener('keydown', (e) => {
        if (window.innerWidth <= 768) return;
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

});
