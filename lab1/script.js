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
            while (cartItems.firstChild) {
                cartItems.removeChild(cartItems.firstChild);
            }
            return;
        }

        cartEmpty.style.display = 'none';
        cartTotal.style.display = 'block';

        while (cartItems.firstChild) {
            cartItems.removeChild(cartItems.firstChild);
        }

        const fragment = document.createDocumentFragment();

        cart.forEach(item => {
            const cartItem = createCartItemElement(item);
            fragment.appendChild(cartItem);
        });

        cartItems.appendChild(fragment);

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPrice.textContent = `Итого: ${total} ₽`;
    }

    function createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        const imageDiv = document.createElement('div');
        imageDiv.className = 'cart-item-image';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        imageDiv.appendChild(img);

        const infoDiv = document.createElement('div');
        infoDiv.className = 'cart-item-info';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'cart-item-title';
        titleDiv.textContent = item.name;

        const priceDiv = document.createElement('div');
        priceDiv.className = 'cart-item-price';
        priceDiv.textContent = `${item.price} ₽`;

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'cart-item-controls';

        const minusBtn = document.createElement('button');
        minusBtn.className = 'quantity-btn';
        minusBtn.textContent = '-';
        minusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateQuantity(item.id, item.quantity - 1);
        });

        const quantitySpan = document.createElement('span');
        quantitySpan.className = 'quantity-display';
        quantitySpan.textContent = item.quantity;

        const plusBtn = document.createElement('button');
        plusBtn.className = 'quantity-btn';
        plusBtn.textContent = '+';
        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateQuantity(item.id, item.quantity + 1);
        });

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'Удалить';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromCart(item.id);
        });

        controlsDiv.appendChild(minusBtn);
        controlsDiv.appendChild(quantitySpan);
        controlsDiv.appendChild(plusBtn);
        controlsDiv.appendChild(removeBtn);

        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(priceDiv);
        infoDiv.appendChild(controlsDiv);

        cartItem.appendChild(imageDiv);
        cartItem.appendChild(infoDiv);

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

        while (orderItems.firstChild) {
            orderItems.removeChild(orderItems.firstChild);
        }

        const fragment = document.createDocumentFragment();

        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';

            const infoDiv = document.createElement('div');
            infoDiv.className = 'order-item-info';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'order-item-name';
            nameDiv.textContent = item.name;

            const quantityDiv = document.createElement('div');
            quantityDiv.className = 'order-item-quantity';
            quantityDiv.textContent = `${item.quantity} шт.`;

            infoDiv.appendChild(nameDiv);
            infoDiv.appendChild(quantityDiv);

            const priceDiv = document.createElement('div');
            priceDiv.className = 'order-item-price';
            priceDiv.textContent = `${item.price * item.quantity} ₽`;

            orderItem.appendChild(infoDiv);
            orderItem.appendChild(priceDiv);

            fragment.appendChild(orderItem);
        });

        orderItems.appendChild(fragment);

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

        while (orderModal.firstChild) {
            orderModal.removeChild(orderModal.firstChild);
        }

        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';

        const modalTitle = document.createElement('h3');
        modalTitle.className = 'modal-title';
        modalTitle.textContent = 'Заказ оформлен!';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.id = 'modalCloseSuccess';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', closeModal);

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeBtn);

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';

        const title = document.createElement('h3');
        title.textContent = 'Спасибо за покупку!';

        const message = document.createElement('p');
        message.textContent = 'Мы свяжемся с вами в ближайшее время для подтверждения заказа.';

        const button = document.createElement('button');
        button.className = 'success-btn';
        button.id = 'continueShoppingBtn';
        button.textContent = 'Продолжить покупки';
        button.addEventListener('click', closeModal);

        successDiv.appendChild(title);
        successDiv.appendChild(message);
        successDiv.appendChild(button);

        modalContent.appendChild(successDiv);

        orderModal.appendChild(modalHeader);
        orderModal.appendChild(modalContent);
    }

    window.removeFromCart = removeFromCart;
    window.updateQuantity = updateQuantity;
    window.closeModal = closeModal;

    updateCartDisplay();
});
