// --- ГЛОБАЛЬНІ ЗМІННІ ---
const itemsPerPage = 6; // Кількість чашок на одній сторінці
let currentPage = 1;    // Поточна сторінка

// --- ГЕНЕРАЦІЯ ДАНИХ (Імітація бази даних) ---
const cupsData = [];
// Генеруємо 21 чашку.
// ВАЖЛИВО: У тебе в папці img мають бути файли з назвами 1.jpg, 2.jpg ... 21.jpg
for (let i = 1; i <= 21; i++) {
    cupsData.push({
        id: i,
        // Формуємо шлях: ../img/1.jpg, ../img/2.jpg і т.д.
        img: `../img/${i}.jpg`,
        title: `Чашка ексклюзивна №${i}`,
        price: `${100 + i * 10} грн` // Просто для прикладу різна ціна
    });
}

// --- ГОЛОВНА ФУНКЦІЯ ІНІЦІАЛІЗАЦІЇ ---
document.addEventListener('DOMContentLoaded', () => {
    createMenu();           // Створюємо меню
    setupBurgerMenu();      // Налаштовуємо бургер
    setupModalDelegation(); // Модалка для сторінки "Типи" (ЛР6)

    // Перевіряємо, на якій ми сторінці, щоб запустити потрібну логіку
    if (document.getElementById('cups-container')) {
        renderCollectionPage(); // Логіка для "Колекції" (ЛР7)
    } else if (document.getElementById('favorites-container')) {
        renderFavoritesPage();  // Логіка для "Улюблених" (ЛР7)
    }

    updateFavoritesCounter(); // Оновити лічильник сердечок в меню
});

// ---------------------------------------------------------
// ЛОГІКА ЛР №7: КОЛЕКЦІЯ, ПАГІНАЦІЯ, УЛЮБЛЕНІ
// ---------------------------------------------------------

// Рендер сторінки "Колекція" з пагінацією
function renderCollectionPage() {
    const container = document.getElementById('cups-container');
    const paginationContainer = document.getElementById('pagination-controls');

    // 1. Вираховуємо індекси для зрізу масиву (Pagination logic)
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToShow = cupsData.slice(start, end);

    // 2. Очищаємо контейнер і малюємо картки
    container.innerHTML = '';
    itemsToShow.forEach(cup => {
        const isFav = isFavorite(cup.id); // Перевіряємо, чи лайкнув користувач цей товар

        const card = document.createElement('div');
        card.className = 'cup-card';
        card.innerHTML = `
            <button class="like-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${cup.id}, this)">
                ❤
            </button>
            <img src="${cup.img}" alt="${cup.title}" onerror="this.src='../img/ancient1.jpg'"> 
            <h3>${cup.title}</h3>
            <p>${cup.price}</p>
        `;
        // Примітка: onerror додано, щоб якщо картинки 21.jpg немає, підставилась ancient1.jpg
        container.appendChild(card);
    });

    // 3. Малюємо кнопки пагінації
    const totalPages = Math.ceil(cupsData.length / itemsPerPage);
    renderPagination(paginationContainer, totalPages);
}

// Рендер кнопок пагінації (1, 2, 3...)
function renderPagination(container, totalPages) {
    container.innerHTML = '';

    // Якщо сторінка одна, кнопки не потрібні
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;

        btn.onclick = () => {
            currentPage = i;       // Змінюємо номер поточної сторінки
            renderCollectionPage(); // Перемальовуємо товари
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Плавно крутимо вгору
        };
        container.appendChild(btn);
    }
}

// --- LOCAL STORAGE (Робота з пам'яттю браузера) ---

// Отримати список ID улюблених товарів
function getFavorites() {
    const stored = localStorage.getItem('myFavoriteCups');
    return stored ? JSON.parse(stored) : [];
}

// Перевірка: чи є товар в улюблених
function isFavorite(id) {
    const favs = getFavorites();
    return favs.includes(id);
}

// Додавання/Видалення з улюблених (при кліку на серце)
function toggleFavorite(id, btnElement) {
    let favs = getFavorites();

    if (favs.includes(id)) {
        // Якщо вже є -> видаляємо
        favs = favs.filter(favId => favId !== id);
        btnElement.classList.remove('active');
    } else {
        // Якщо немає -> додаємо
        favs.push(id);
        btnElement.classList.add('active');

        // Маленька анімація збільшення
        btnElement.classList.add('heart-anim');
        setTimeout(() => btnElement.classList.remove('heart-anim'), 400);
    }

    // Зберігаємо оновлений масив в LocalStorage
    localStorage.setItem('myFavoriteCups', JSON.stringify(favs));

    // Оновлюємо лічильник в меню
    updateFavoritesCounter();

    // Якщо ми зараз на сторінці "Улюблені", одразу прибираємо картку
    if (document.getElementById('favorites-container')) {
        renderFavoritesPage();
    }
}

// Оновлення червоного кружечка з цифрою в меню
function updateFavoritesCounter() {
    const count = getFavorites().length;
    const badge = document.getElementById('fav-count');
    if (badge) badge.textContent = count;
}

// Рендер сторінки "Favorites.html"
function renderFavoritesPage() {
    const container = document.getElementById('favorites-container');
    const favIds = getFavorites();

    if (favIds.length === 0) {
        container.innerHTML = '<p style="text-align:center; width:100%; font-size: 1.2rem; margin-top: 20px;">Ваш список улюблених порожній :( <br> Перейдіть в колекцію та додайте щось!</p>';
        return;
    }

    // Фільтруємо наш головний масив cupsData, залишаючи тільки ті, що є в улюблених
    const favItems = cupsData.filter(cup => favIds.includes(cup.id));

    container.innerHTML = '';
    favItems.forEach(cup => {
        const card = document.createElement('div');
        card.className = 'cup-card';
        card.innerHTML = `
            <button class="like-btn active" onclick="toggleFavorite(${cup.id}, this)">
                ❤
            </button>
            <img src="${cup.img}" alt="${cup.title}" onerror="this.src='../img/ancient1.jpg'">
            <h3>${cup.title}</h3>
            <p>${cup.price}</p>
        `;
        container.appendChild(card);
    });
}

// ---------------------------------------------------------
// ЗАГАЛЬНИЙ ФУНКЦІОНАЛ (Меню, Бургер, Модалка з ЛР6)
// ---------------------------------------------------------

function createMenu() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    const menuItems = [
        { text: 'Новини', behavior: 'redirect', content: 'index.html' },
        { text: 'Типи чашок', behavior: 'redirect', content: 'Types.html' },
        { text: 'Колекція', behavior: 'redirect', content: 'Cups%20Collection.html' },
        { text: 'Історія', behavior: 'redirect', content: 'History.html' },
    ];

    menuContainer.innerHTML = '';

    menuItems.forEach(item => {
        const button = document.createElement('button');
        button.className = 'menu-button';
        button.textContent = item.text;
        button.onclick = () => window.location.href = item.content;
        menuContainer.appendChild(button);
    });

    // Кнопка "Улюблені"
    const favBtn = document.createElement('button');
    favBtn.className = 'menu-button nav-favorite';
    favBtn.innerHTML = `Улюблені <span id="fav-count" class="fav-counter">0</span>`;
    favBtn.onclick = () => window.location.href = 'Favorites.html';
    menuContainer.appendChild(favBtn);
}

function setupBurgerMenu() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('nav.main-nav');
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
}

function setupModalDelegation() {
    const galleryContainer = document.getElementById('types-gallery');
    const modal = document.getElementById('cupModal');
    const spanClose = document.getElementsByClassName('close-modal')[0];
    const modalTitle = document.getElementById('modalTitle');
    const modalYear = document.getElementById('modalYear');
    const modalInfo = document.getElementById('modalInfo');

    if (!galleryContainer || !modal) return;

    galleryContainer.addEventListener('click', function(event) {
        const targetCard = event.target.closest('.type-image');
        if (!targetCard) return;

        const title = targetCard.getAttribute('data-title');
        const year = targetCard.getAttribute('data-year');
        const info = targetCard.getAttribute('data-info');

        modalTitle.textContent = title;
        modalYear.textContent = year;
        modalInfo.textContent = info;
        modal.style.display = 'block';
    });

    if (spanClose) {
        spanClose.onclick = function() { modal.style.display = 'none'; }
    }
    window.onclick = function(event) {
        if (event.target === modal) { modal.style.display = 'none'; }
    }
}