// --- Створення меню ---
function createMenu() {
    // Примітка: цей скрипт тепер має бути всередині nav.main-nav
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    // Оновлений список пунктів меню
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

// --- Обробник для меню ---
function handleMenuClick(event) {
    if (event.target.tagName === 'BUTTON') {
        const behavior = event.target.getAttribute('data-behavior');
        const content = event.target.getAttribute('data-content');
        if (behavior === 'redirect' && content) {
            window.location.href = content;
        }
    }
}

// --- Логіка Бургер-меню ---
function setupBurgerMenu() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('nav.main-nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active'); // Перемикає клас .active
        });
    }
}

// Виклик функцій після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    createMenu();
    setupBurgerMenu();
});