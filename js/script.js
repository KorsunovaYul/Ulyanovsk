// Интерактивная карта — клик по маркеру показывает/скрывает попап
document.addEventListener('DOMContentLoaded', () => {
    const markers = document.querySelectorAll('.map-marker');

    const mobilePopup = document.getElementById('mapMobilePopup');

    markers.forEach(marker => {
        const popup = marker.querySelector('.marker-popup');

        marker.addEventListener('click', (e) => {
            e.stopPropagation();

            // Закрываем все попапы кроме текущего
            markers.forEach(otherMarker => {
                if (otherMarker !== marker) {
                    otherMarker.querySelector('.marker-popup').classList.remove('active');
                    otherMarker.classList.remove('active');
                }
            });

            if (window.innerWidth <= 768 && mobilePopup) {
                // На мобилке — показываем отдельную плашку вне контейнера
                const label = marker.querySelector('.marker-label').textContent.trim();
                const text  = marker.querySelector('.marker-popup-text').textContent.trim();
                mobilePopup.querySelector('.map-mobile-popup__title').textContent = label;
                mobilePopup.querySelector('.map-mobile-popup__text').textContent  = text;
                mobilePopup.classList.toggle('active');
                marker.classList.toggle('active');
            } else {
                // На десктопе — обычный попап рядом с маркером
                popup.classList.toggle('active');
                marker.classList.toggle('active');
            }
        });
    });

    // Клик вне маркера закрывает все попапы
    document.addEventListener('click', () => {
        markers.forEach(marker => {
            marker.querySelector('.marker-popup').classList.remove('active');
            marker.classList.remove('active');
        });
        if (mobilePopup) mobilePopup.classList.remove('active');
    });

    // Скролл логотипа — при прокрутке вниз графический знак исчезает, хедер уменьшается
    const logo = document.querySelector('.logo');
    const header = document.querySelector('.header');
    const scrollThreshold = 80;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > scrollThreshold) {
            logo.classList.add('scrolled');
            header.classList.add('scrolled');
        } else {
            logo.classList.remove('scrolled');
            header.classList.remove('scrolled');
        }
    });

    // Бургер-меню для мобильной версии
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    const overlay = document.querySelector('.nav-overlay');

    if (burger && nav && overlay) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        overlay.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Закрытие меню при клике на ссылку
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});
