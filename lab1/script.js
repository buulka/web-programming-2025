// Элементы корзины
const cartToggle = document.getElementById('cartToggle');
const cart = document.getElementById('cart');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');

// Открытие корзины
cartToggle.addEventListener('click', () => {
    cart.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
});

// Закрытие корзины
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function closeCart() {
    cart.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Возвращаем скролл
}

// Закрытие корзины по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCart();
    }
});