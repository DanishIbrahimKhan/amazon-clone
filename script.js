document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = [];

    // Fetch products from FakeStoreAPI
    fetchProducts();

    // Load cart from localStorage and update cart count
    updateCartCount();

    // Function to fetch products from FakeStoreAPI
    function fetchProducts() {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                products = data;
                displayProducts(products);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
            });
    }

    // Function to display fetched products
    function displayProducts(products) {
        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = ''; // Clear the grid before inserting products

        products.forEach(product => {
            const productCard = `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>$${product.price}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            productGrid.innerHTML += productCard;
        });

        // Attach event listeners to the "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                addToCart(productId);
            });
        });
    }

    // Add product to cart
    function addToCart(productId) {
        const product = products.find(item => item.id == productId);
        const cartItem = cart.find(item => item.id == productId);

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`${product.title} added to cart!`);
    }

    // Update cart count in navbar
    function updateCartCount() {
        const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        document.getElementById('cart-count').textContent = cartCount;
    }

    // Show cart modal
    document.getElementById('cart-link').addEventListener('click', () => {
        displayCart();
        document.getElementById('cart-modal').style.display = 'block';
    });

    // Close cart modal
    document.getElementById('close-cart').addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'none';
    });

    // Display cart items in modal
    function displayCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const totalPriceElement = document.getElementById('total-price');
        const taxAmountElement = document.getElementById('tax-amount');
        const grandTotalElement = document.getElementById('grand-total');

        cartItemsContainer.innerHTML = ''; // Clear cart display
        let totalPrice = 0;

        cart.forEach(item => {
            const cartItem = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <h3>${item.title}</h3>
                    <p>$${item.price} x ${item.quantity}</p>
                    <div class="cart-actions">
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                        <span>${item.quantity}</span>
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">Remove</button>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItem;
            totalPrice += item.price * item.quantity;
        });

        // Calculate taxes (e.g., 10% tax)
        const taxAmount = totalPrice * 0.10;
        const grandTotal = totalPrice + taxAmount;

        totalPriceElement.textContent = totalPrice.toFixed(2);
        taxAmountElement.textContent = taxAmount.toFixed(2);
        grandTotalElement.textContent = grandTotal.toFixed(2);

        // Attach event listeners to remove buttons and quantity buttons
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                removeFromCart(productId);
            });
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                updateQuantity(productId, 1);
            });
        });

        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                updateQuantity(productId, -1);
            });
        });
    }

    // Update product quantity in cart
    function updateQuantity(productId, change) {
        const cartItem = cart.find(item => item.id == productId);

        if (cartItem) {
            cartItem.quantity += change;

            if (cartItem.quantity <= 0) {
                cart = cart.filter(item => item.id != productId);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartCount();
        }
    }

    // Remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id != productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    }

    // Search functionality
    document.getElementById('search-button').addEventListener('click', () => {
        const query = document.getElementById('search-bar').value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(query)
        );
        displayProducts(filteredProducts);
    });

    // Checkout functionality
    document.getElementById('checkout-btn').addEventListener('click', () => {
        alert('Proceeding to checkout...');
        // You can enhance this part with real payment processing, etc.
    });
});
