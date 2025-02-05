// Quick View and Add to Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Quick View Modal
    const modal = document.getElementById('quickViewModal');
    const modalContent = document.getElementById('quickViewContent');
    const closeBtn = document.getElementsByClassName('close')[0];

    // Product data (you can replace this with your actual product data)
    const products = {
        1: {
            name: 'Half Running Set',
            price: '$99 - $129',
            description: 'Comfortable half running set perfect for your workout sessions.',
            image: 'image/product1.jpg'
        }
        // Add more products as needed
    };

    // Quick View functionality
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const product = products[productId];
            
            if (product) {
                modalContent.innerHTML = `
                    <div class="quick-view-details">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p class="price">${product.price}</p>
                        <p class="description">${product.description}</p>
                        <button onclick="addToCart(${productId})">Add to Cart</button>
                    </div>
                `;
                modal.style.display = 'block';
            }
        });
    });

    // Close modal when clicking (X)
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Add to Cart functionality
    const cart = [];
    window.addToCart = function(productId) {
        const product = products[productId];
        if (product) {
            cart.push(product);
            updateCartCount();
            showNotification('Product added to cart successfully!');
        }
    }

    // Add to cart button click handler
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });

    function updateCartCount() {
        // Update cart count in the UI
        const cartCount = document.querySelector('.cart-count') || createCartCount();
        cartCount.textContent = cart.length;
    }

    function createCartCount() {
        const cartCount = document.createElement('span');
        cartCount.className = 'cart-count';
        document.querySelector('.nav-icons').appendChild(cartCount);
        return cartCount;
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}); 