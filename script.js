$(document).ready(function() {
    // Cart Functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total span');
        const cartCount = document.querySelector('.cart-count');

        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-img" style="background-image: url(${item.image})"></div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>$${itemTotal.toFixed(2)}</span>
                    <div class="cart-item-controls">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <i class="fas fa-trash cart-item-delete" onclick="removeFromCart(${index})"></i>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartTotal.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    window.addToCart = function(name, price, image) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price: parseFloat(price), image, quantity: 1 });
        }
        saveCart();
        updateCartUI();
    };

    window.updateQuantity = function(index, change) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartUI();
    };

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        saveCart();
        updateCartUI();
    };

    // Add to Cart Event Listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.food-item');
            const name = item.dataset.name;
            const price = item.dataset.price;
            const image = item.dataset.image;
            addToCart(name, price, image);
        });
    });

    // Cart Popup Toggle
    const cartBtn = document.querySelector('.cart-btn');
    const cartPopup = document.querySelector('.cart-popup');
    const closeCart = document.querySelector('.close-cart');

    cartBtn.addEventListener('click', () => {
        cartPopup.classList.toggle('open');
    });

    closeCart.addEventListener('click', () => {
        cartPopup.classList.remove('open');
    });

    // Menu Filter
    const filterButtons = document.querySelectorAll('.food-category button');
    const foodItems = document.querySelector('.food-item-wrap');

    if (filterButtons.length && foodItems) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');
                foodItems.className = `food-item-wrap ${filter}`;
            });
        });
    }

    // Review Slider
    $('.review-slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        prevArrow: '<i class="fas fa-chevron-left slick-prev"></i>',
        nextArrow: '<i class="fas fa-chevron-right slick-next"></i>',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    arrows: false
                }
            }
        ]
    });
    

    // Scroll Animations
    const elements = document.querySelectorAll('.left-to-right, .right-to-left, .zoom, .bottom-up');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('start');
            }
        });
    });

    elements.forEach(element => {
        observer.observe(element);
    });

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Mobile Navigation Animation
    // const mbNavItems = document.querySelectorAll('.mb-nav-item');
    // const mbMoveItem = document.querySelector('.mb-move-item');

    // mbNavItems.forEach((item, index) => {
    //     item.addEventListener('click', () => {
    //         mbNavItems.forEach(i => i.classList.remove('active'));
    //         item.classList.add('active');
    //         mbMoveItem.style.left = `${index * 25}%`;
    //     });
    // });

    // Initialize cart UI
    updateCartUI();
});