let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    const cartToggle = document.getElementById('cartToggle');
    const cartElement = document.getElementById('cart');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartTotal = document.getElementById('cartTotal');
    const totalPrice = document.getElementById('totalPrice');
    const cartCount = document.getElementById('cartCount');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    const modalOverlay = document.getElementById('modalOverlay');
    const orderModal = document.getElementById('orderModal');
    const modalClose = document.getElementById('modalClose');
    const orderForm = document.getElementById('orderForm');
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    
    if (!cartToggle || !cartElement || !cartOverlay || !cartClose) {
        console.error('Не найдены элементы корзины!');
        return;
    }
    
    loadCartFromStorage();
    
    cartToggle.addEventListener('click', function() {
        cartElement.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    function closeCart() {
        cartElement.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCart();
            closeModal();
        }
    });
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseInt(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');
            
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            });
            
            showAddedFeedback(this);
        });
    });
    
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        updateCartDisplay();
        saveCartToStorage();
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
        saveCartToStorage();
    }
    
    function updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            updateCartDisplay();
            saveCartToStorage();
        }
    }
    
    function updateCartDisplay() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartTotal.style.display = 'none';
            cartItems.innerHTML = '';
            return;
        }
        
        cartEmpty.style.display = 'none';
        cartTotal.style.display = 'block';
        
        cartItems.innerHTML = '';
        
        cart.forEach(item => {
            const cartItem = createCartItemElement(item);
            cartItems.appendChild(cartItem);
        });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPrice.textContent = `Итого: ${total} ₽`;
    }
    
    function createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price} ₽</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">Удалить</button>
                </div>
            </div>
        `;
        return cartItem;
    }
    
    function saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        }
    }
    
    function showAddedFeedback(button) {
        const originalText = button.textContent;
        button.textContent = '✓ Добавлено!';
        button.style.background = '#2ed573';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 1500);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            
            openModal();
            updateOrderSummary();
        });
    }
    
    function openModal() {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    function updateOrderSummary() {
        if (!orderItems || !orderTotal) return;
        
        orderItems.innerHTML = '';
        
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-quantity">${item.quantity} шт.</div>
                </div>
                <div class="order-item-price">${item.price * item.quantity} ₽</div>
            `;
            orderItems.appendChild(orderItem);
        });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        orderTotal.textContent = `Итого: ${total} ₽`;
    }
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(orderForm);
            const orderData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                address: formData.get('address'),
                phone: formData.get('phone'),
                items: cart,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
            
            console.log('Данные заказа:', orderData);
            
            showSuccessMessage();
            
            cart = [];
            saveCartToStorage();
            updateCartDisplay();
            
            closeCart();
        });
    }
    
    function showSuccessMessage() {
        if (!orderModal) return;
        
        orderModal.innerHTML = `
            <div class="success-message">
                <h3>🎉 Заказ создан!</h3>
                <p>Спасибо за покупку! Мы свяжемся с вами в ближайшее время для подтверждения заказа.</p>
                <button class="success-btn" onclick="closeModal()">Продолжить покупки</button>
            </div>
        `;
    }
    
    window.removeFromCart = removeFromCart;
    window.updateQuantity = updateQuantity;
    window.closeModal = closeModal;
    
    updateCartDisplay();
});
