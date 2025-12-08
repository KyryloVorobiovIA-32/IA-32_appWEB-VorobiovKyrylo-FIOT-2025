// Створення меню
function createMenu() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    const menuItems = [
        { text: 'Новини', behavior: 'redirect', content: 'index.html' },
        { text: 'Типи чашок', behavior: 'redirect', content: 'Types.html' },
        { text: 'Колекція чашок', behavior: 'redirect', content: 'Cups%20Collection.html' },
        { text: 'Історія чашок', behavior: 'redirect', content: 'History.html' },
    ];

    menuItems.forEach(item => {
        const button = document.createElement('button');
        button.className = 'menu-button';
        button.textContent = item.text;
        button.setAttribute('data-behavior', item.behavior);
        if (item.content) button.setAttribute('data-content', item.content);
        menuContainer.appendChild(button);
    });

    menuContainer.onclick = handleMenuClick;
}

// Обробник для меню
function handleMenuClick(event) {
    if (event.target.tagName === 'BUTTON') {
        const behavior = event.target.getAttribute('data-behavior');
        const content = event.target.getAttribute('data-content');
        if (behavior === 'redirect' && content) {
            window.location.href = content;
        }
    }
}

// Логіка Бургер-меню
function setupBurgerMenu() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('nav.main-nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
}

// Делегування подій та Модальне вікно
function setupModalDelegation() {
    // Отримуємо контейнер (батьківський елемент)
    const galleryContainer = document.getElementById('types-gallery');
    const modal = document.getElementById('cupModal');
    const spanClose = document.getElementsByClassName('close-modal')[0];

    // Елементи всередині модалки, куди будемо писати текст
    const modalTitle = document.getElementById('modalTitle');
    const modalYear = document.getElementById('modalYear');
    const modalInfo = document.getElementById('modalInfo');

    if (!galleryContainer || !modal) return; // Якщо ми не на сторінці Types.html

    // Додаємо слухач подій на КОНТЕЙНЕР (Делегування)
    galleryContainer.addEventListener('click', function(event) {
        // Перевіряємо, чи клік був по блоку з картинкою (або всередині нього)
        const targetCard = event.target.closest('.type-image');

        // Якщо клікнули не по картці, виходимо
        if (!targetCard) return;

        // Отримуємо дані з data-атрибутів
        const title = targetCard.getAttribute('data-title');
        const year = targetCard.getAttribute('data-year');
        const info = targetCard.getAttribute('data-info');

        // Заповнюємо модальне вікно
        modalTitle.textContent = title;
        modalYear.textContent = year;
        modalInfo.textContent = info;

        // Відкриваємо модалку
        modal.style.display = 'block';
    });

    // Логіка закриття модалки
    if (spanClose) {
        spanClose.onclick = function() {
            modal.style.display = 'none';
        }
    }

    // Закриття при кліку за межами вікна
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}

// Виклик функцій після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    createMenu();
    setupBurgerMenu();
    setupModalDelegation(); // Ініціалізація модалки
});