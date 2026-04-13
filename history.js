// Страница истории — горизонтальный скролл + таймлайн + эффект заголовка
document.addEventListener('DOMContentLoaded', () => {
    const historyScroll = document.querySelector('.history-scroll');
    const blocks = document.querySelectorAll('.history-block');
    const dots = document.querySelectorAll('.timeline-dot');
    const progress = document.querySelector('.timeline-progress');
    const indicator = document.querySelector('.timeline-indicator');
    const timeline = document.querySelector('.history-timeline');
    const subtitleFixed = document.querySelector('.history-subtitle-fixed');

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

        progress.style.width = `${scrollPercent * 100}%`;

        const activeIndex = Math.round(scrollPercent * (totalBlocks - 1));
        indicator.style.left = `${dotPositions[activeIndex]}%`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('timeline-dot--active', i === activeIndex);
        });

        // Таймлайн и подпись видны на всех 6 блоках
        // Скрываются только когда body скроллится вниз (после горизонтального)
    }

    // Колёсико мыши: вертикальный скролл → горизонтальный
    const historyMain = document.querySelector('.history-main');
    let stickyReleased = false;

    historyScroll.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (isScrolling) return;
        
        // Проверяем, на последнем ли блоке
        const scrollLeft = historyScroll.scrollLeft;
        const maxScroll = historyScroll.scrollWidth - historyScroll.clientWidth;
        const isLastBlock = scrollLeft >= maxScroll - 10;
        
        // На последнем блоке + скролл вниз → отпускаем sticky
        if (isLastBlock && e.deltaY > 30 && !stickyReleased) {
            stickyReleased = true;
            historyMain.style.position = 'relative';
            historyMain.style.height = 'auto';
            historyMain.style.overflow = 'visible';
            historyMain.style.zIndex = 'auto';
            
            // Скроллим body вниз к футеру
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
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

    // После последнего блока — следующий скролл вниз отпускает sticky
    historyScroll.addEventListener('scroll', () => {
        // Просто обновляем таймлайн
    });

    // Глобальный скролл — когда дошли до футера, скрываем таймлайн
    window.addEventListener('scroll', () => {
        const footer = document.querySelector('.footer');
        if (footer) {
            const footerRect = footer.getBoundingClientRect();
            if (footerRect.top < window.innerHeight) {
                timeline.classList.add('hidden');
                subtitleFixed.classList.add('hidden');
            } else {
                timeline.classList.remove('hidden');
                subtitleFixed.classList.remove('hidden');
            }
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

    // ===== ЭФФЕКТ ЗАГОЛОВКА: часть белая на фоне фото =====
    const titles = document.querySelectorAll('.history-title');
    const allImages = document.querySelectorAll('.history-img-wrapper img');

    function updateTitleGradient() {
        titles.forEach(title => {
            const titleRect = title.getBoundingClientRect();
            const titleLeft = titleRect.left;
            const titleRight = titleRect.right;
            const titleWidth = titleRight - titleLeft;

            let photoLeft = Infinity;

            allImages.forEach(img => {
                const imgRect = img.getBoundingClientRect();
                const verticalOverlap = !(titleRect.bottom < imgRect.top || titleRect.top > imgRect.bottom);

                if (verticalOverlap && imgRect.left < photoLeft) {
                    const overlapStart = Math.max(titleLeft, imgRect.left);
                    if (overlapStart < photoLeft) {
                        photoLeft = overlapStart;
                    }
                }
            });

            if (photoLeft < Infinity && photoLeft > titleLeft && photoLeft < titleRight) {
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
    updateTitleGradient();
});
