
/* CONFIGURATION & DATA */
const itemsPerPage = 6;
let currentPage = 1;

const cupsData = [];
for (let i = 1; i <= 21; i++) {
    cupsData.push({
        id: i,
        img: `../img/${i}.jpg`,
        title: `Чашка ексклюзивна №${i}`,
        // Ціна генерується, але не відображається за новим дизайном
        price: `${100 + i * 10} грн`
    });
}

/* INITIALIZATION */
document.addEventListener('DOMContentLoaded', () => {
    createMenu();
    setupBurgerMenu();
    setupModalDelegation(); // Логіка модального вікна для сторінки Типів

    // Визначаємо поточну сторінку та запускаємо відповідний рендер
    if (document.getElementById('cups-container')) {
        renderCollectionPage();
    } else if (document.getElementById('favorites-container')) {
        renderFavoritesPage();
    }

    updateFavoritesCounter();
});

/* MENU & NAVIGATION */
function createMenu() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    const menuItems = [
        { text: 'Новини', content: 'index.html' },
        { text: 'Типи чашок', content: 'Types.html' },
        { text: 'Колекція', content: 'Cups%20Collection.html' },
        { text: 'Історія', content: 'History.html' },
    ];

    menuContainer.innerHTML = '';

    menuItems.forEach(item => {
        const button = document.createElement('button');
        button.className = 'menu-button';
        button.textContent = item.text;
        button.onclick = () => window.location.href = item.content;
        menuContainer.appendChild(button);
    });

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

/* COLLECTION RENDER & PAGINATION */
function renderCollectionPage() {
    const container = document.getElementById('cups-container');
    const paginationContainer = document.getElementById('pagination-controls');

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToShow = cupsData.slice(start, end);

    container.innerHTML = '';
    itemsToShow.forEach(cup => {
        const isFav = isFavorite(cup.id);
        const card = document.createElement('div');
        card.className = 'cup-card';
        card.innerHTML = `
            <button class="like-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${cup.id}, this)">
                ❤
            </button>
            <img src="${cup.img}" alt="${cup.title}" onerror="this.src='../img/ancient1.jpg'"> 
            <h3>${cup.title}</h3>
        `;
        container.appendChild(card);
    });

    const totalPages = Math.ceil(cupsData.length / itemsPerPage);
    renderPagination(paginationContainer, totalPages);
}

function renderPagination(container, totalPages) {
    container.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.onclick = () => {
            currentPage = i;
            renderCollectionPage();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        container.appendChild(btn);
    }
}

/* FAVORITES LOGIC */
function getFavorites() {
    const stored = localStorage.getItem('myFavoriteCups');
    return stored ? JSON.parse(stored) : [];
}

function isFavorite(id) {
    const favs = getFavorites();
    return favs.includes(id);
}

function toggleFavorite(id, btnElement) {
    let favs = getFavorites();

    if (favs.includes(id)) {
        favs = favs.filter(favId => favId !== id);
        if (btnElement) btnElement.classList.remove('active');
    } else {
        favs.push(id);
        if (btnElement) btnElement.classList.add('active');
    }

    localStorage.setItem('myFavoriteCups', JSON.stringify(favs));
    updateFavoritesCounter();

    if (document.getElementById('favorites-container')) {
        renderFavoritesPage();
    }
}

function updateFavoritesCounter() {
    const count = getFavorites().length;
    const badge = document.getElementById('fav-count');
    if (badge) badge.textContent = count;
}

function renderFavoritesPage() {
    const container = document.getElementById('favorites-container');
    const favIds = getFavorites();

    // Якщо список порожній - очищаємо контейнер (текст прибрано)
    if (favIds.length === 0) {
        container.innerHTML = '';
        return;
    }

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
        `;
        container.appendChild(card);
    });
}

/* MODAL LOGIC (TYPES PAGE) */
function setupModalDelegation() {
    const galleryContainer = document.getElementById('types-gallery');
    const modal = document.getElementById('cupModal');
    const spanClose = document.getElementsByClassName('close-modal')[0];
    const modalTitle = document.getElementById('modalTitle');
    const modalYear = document.getElementById('modalYear');
    const modalInfo = document.getElementById('modalInfo');

    if (!galleryContainer || !modal) return;

    galleryContainer.addEventListener('click', function(event) {
        // Клік спрацьовує тільки на картинку
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