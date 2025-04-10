 // Sample product data
 const products = [
    {
        id: 1,
        name: "Jearsy harrison jr",
        origin: "USA",
        roast: "home",
        price: 176.99,
        rating: 7.8,
        stock: 25,
        image: "gambar.avif",
        date: "2025-12-15",
        description: "jersey color white and red."
    },
    {
        id: 2,
        name: "Jersey Patterson ",
        origin: "Brazil",
        roast: "Dark",
        price: 149.99,
        rating: 7.5,
        stock: 32,
        image: "gambar 6.jpg",
        date: "2025-11-10",
        description: "Jersey color black and red ATL."
    },
    {
        id: 3,
        name: "Jersey Allen ",
        origin: "Indonesia",
        roast: "Light",
        price: 159.99,
        rating: 8.7,
        stock: 18,
        image: "gambar 2.avif",
        date: "2025-10-05",
        description: "Jersey white and blue ."
    },
    {
        id: 4,
        name: "Jersey NIX NFL",
        origin: "USA",
        price: 179.99,
        roast: "medium",
        rating: 8.6,
        stock: 15,
        image: "gambar 3.avif",
        date: "2025-09-20",
        description: "Jersey NFL orange black and white."
    },
    {
        id: 5,
        name: "Jersey GIBBS",
        origin: "Costa Rica",
        roast: "away",
        price: 159.49,
        rating: 7.4,
        stock: 22,
        image: "gambar 4.avif",
        date: "2025-08-25",
        description: "Jersey Blue and Black."
    },
    {
        id: 6,
        name: "Jersey costume",
        origin: "Brazil",
        roast: "Dark",
        price: 139.99,
        rating: 8.3,
        stock: 0,
        image: "gambar 5.avif",
        date: "2025-03-12",
        description: "Jersey costume any color ."
    },
    {
        id: 7,
        name: "Jersey ALLEN ",
        origin: "USA",
        roast: "medium-light",
        price: 189.99,
        rating: 8.9,
        stock: 12,
        image: "gambar 20.jpg",
        date: "2025-12-28",
        description: "Jersey color red ."
    },
    {
        id: 8,
        name: "Jersey BECKAM JR",
        origin: "Portugal",
        roast: "medium-dark",
        price: 199.99,
        rating: 7.8,
        stock: 8,
        image: "gambar 8.avif",
        date: "2025-11-22",
        description: "Jersey purple color ."
    },
    {
        id: 9,
        name: "Jersey Jackson",
        origin: "Poland",
        roast: "dark",
        price: 249.99,
        rating: 8.0,
        stock: 5,
        image: "gambar 9.avif",
        date: "2025-03-30",
        description: "Jersey color black."
    },
    {
        id: 10,
        name: "Jersey costume",
        origin: "Argentina",
        roast: "Light",
        price: 169.49,
        rating: 7.6,
        stock: 28,
        image: "gambar 13.avif",
        date: "2025-04-18",
        description: "Jersey costume black and white."
    },
    {
        id: 11,
        name: "Jersey ALLEN Blue",
        origin: "Vietnam",
        roast: "medium-dark",
        price: 149.99,
        rating: 9.4,
        stock: 20,
        image: "gambar 11.avif",
        date: "2025-03-16",
        description: "Jersey blue costume color ."
    },
    {
        id: 12,
        name: "Jersey kamara",
        origin: "germany",
        roast: "dark",
        price: 199.99,
        rating: 8.9,
        stock: 10,
        image: "gambar 12.avif",
        date: "2025-02-31",
        description: "Jersey black and gold color"
    },
    
];

// Cart functionality
let cart = [];

// Check if cart exists in cookies
function loadCartFromCookies() {
    const cartCookie = getCookie('brewHavenCart');
    if (cartCookie) {
        try {
            cart = JSON.parse(cartCookie);
            updateCartCount();
            calculateCartTotals();
        } catch (e) {
            console.error('Error parsing cart cookie:', e);
            cart = [];
        }
    }
}

// Save cart to cookies
function saveCartToCookies() {
    setCookie('brewHavenCart', JSON.stringify(cart), 7); // Save for 7 days
}

// Cookie helper functions
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check if product is out of stock
    if (product.stock === 0) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Check if we can add more of this product
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
            updateAddButton(productId, true);
        }
    } else {
        // Add new item to cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
        updateAddButton(productId, true);
    }
    
    // Update cart UI
    updateCartCount();
    saveCartToCookies();
    renderCartItems();
    calculateCartTotals();
}

// Update the "Add to Cart" button state
function updateAddButton(productId, inCart) {
    const button = document.querySelector(`.add-to-cart-${productId}`);
    if (button) {
        if (inCart) {
            button.classList.add("in-cart");
            button.textContent = "In Cart";
        } else {
            button.classList.remove("in-cart");
            button.textContent = "Add to Cart";
        }
    }
}

// Update cart count in UI
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('headerCartCount').textContent = count;
    document.getElementById('stickyCartCount').textContent = count;
}

// Calculate cart totals
function calculateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5 : 0;
    const total = subtotal + shipping;
    
    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartShipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

// Render products
function renderProducts(productsList, containerId = 'productsContainer') {
    const productsContainer = document.getElementById(containerId);
    productsContainer.innerHTML = '';
    
    productsList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const isInCart = cart.some(item => item.id === product.id);
        const stockStatus = product.stock === 0 ? 'out' : product.stock < 5 ? 'low' : '';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badge">${product.roast} roast</div>
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-origin">${product.origin}</div>
                <div class="product-meta">
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <span>${product.rating}</span>
                    </div>
                    <div class="product-stock ${stockStatus}">
                        ${product.stock === 0 ? 'Out of Stock' : product.stock < 5 ? 'Low Stock' : 'In Stock'}
                    </div>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button 
                    class="btn add-to-cart-${product.id} ${isInCart ? 'in-cart' : ''} ${product.stock === 0 ? 'disabled' : ''}"
                    onclick="addToCart(${product.id})"
                    ${product.stock === 0 ? 'disabled' : ''}
                >
                    ${product.stock === 0 ? 'Out of Stock' : isInCart ? 'In Cart' : 'Add to Cart'}
                </button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
}

// Filter and search functionality
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sortBy = document.getElementById('sortBy').value;
    const filterOrigin = document.getElementById('filterOrigin').value.toLowerCase();
    const filterRoast = document.getElementById('filterRoast').value.toLowerCase();
    
    let filteredProducts = [...products];
    
    // Apply search filter
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.origin.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply origin filter with specific handling for Costa Rica
    if (filterOrigin) {
        filteredProducts = filteredProducts.filter(product => 
            product.origin.toLowerCase() === filterOrigin.toLowerCase()
        );
    }
    
    // Apply jersey type filter (previously roast)
    if (filterRoast) {
        filteredProducts = filteredProducts.filter(product => 
            product.roast.toLowerCase() === filterRoast.toLowerCase()
        );
    }
    
    // Apply sorting
    switch (sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating-desc':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'date-desc':
            filteredProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
    }
    
    renderProducts(filteredProducts);
}

// Add new functions for navigation and cart
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    // Show selected section
    document.getElementById(sectionId).style.display = 'block';
    
    // Update active menu item
    document.querySelectorAll('.menu a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.menu a[href="#${sectionId}"]`).classList.add('active');

    // Render products in shop section if needed
    if (sectionId === 'shop') {
        renderProducts(products, 'shopProducts');
    }
}

function showCartModal() {
    document.getElementById('cartModal').style.display = 'block';
    renderCartItems();
    calculateCartTotals();
}

function hideCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    // Generate receipt data
    const receiptDate = new Date().toLocaleDateString();
    const receiptId = Math.random().toString(36).substr(2, 9);
    const receiptSubtotal = document.getElementById('cartSubtotal').textContent;
    const receiptShipping = document.getElementById('cartShipping').textContent;
    const receiptTotal = document.getElementById('cartTotal').textContent;

    document.getElementById('receiptDate').textContent = receiptDate;
    document.getElementById('receiptId').textContent = receiptId;
    document.getElementById('receiptSubtotal').textContent = receiptSubtotal;
    document.getElementById('receiptShipping').textContent = receiptShipping;
    document.getElementById('receiptTotal').textContent = receiptTotal;

    const receiptItems = document.getElementById('receiptItems');
    receiptItems.innerHTML = cart.map(item => `
        <div class="receipt-item">
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    // Show receipt modal
    showReceiptModal();

    // Clear cart after successful checkout
    cart = [];
    updateCartCount();
    saveCartToCookies();
    hideCartModal();
}

function showReceiptModal() {
    document.getElementById('receiptModal').style.display = 'block';
}

function hideReceiptModal() {
    document.getElementById('receiptModal').style.display = 'none';
}

function printReceipt() {
    const receiptContent = document.getElementById('receiptModal').innerHTML;
    const newWindow = window.open('', '_blank');
    newWindow.document.write(receiptContent);
    newWindow.document.close();
    newWindow.print();
}

function submitContact(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send this to a server
    alert(`Thank you for your message, ${name}! We'll get back to you at ${email} soon.`);
    event.target.reset();
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Check demo admin account first
    if (username === 'demo' && password === 'demo123') {
        loginSuccess('Admin');
        return;
    }

    // Check registered users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        loginSuccess(user.name);
    } else {
        alert('Invalid credentials!');
    }
}

function loginSuccess(name) {
    alert(`Welcome ${name}!`);
    hideLoginModal();
    document.querySelector('.menu li:nth-last-child(2)').innerHTML = 
        `<a href="#" onclick="logout()">${name} (Logout)</a>`;
}

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function hideLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function logout() {
    // Reset login state
    document.querySelector('.menu li:nth-last-child(2)').innerHTML = 
        `<a href="#" onclick="showLoginModal()">Login</a>`;
    alert('Logged out successfully!');
}

function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (newQuantity > product.stock) {
        alert('Cannot exceed available stock!');
        return;
    }
    
    item.quantity = newQuantity;
    saveCartToCookies();
    renderCartItems();
    updateCartCount();
    calculateCartTotals();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToCookies();
    renderCartItems();
    updateCartCount();
    calculateCartTotals();
    updateAddButton(productId, false);
}

function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

function hideRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
}

function showRegisterFromLogin() {
    hideLoginModal();
    showRegisterModal();
}

function showLoginFromRegister() {
    hideRegisterModal();
    showLoginModal();
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
        alert('Password must contain at least:\n- One uppercase letter\n- One number\n- One special character (!@#$%^&*)\n- Minimum 8 characters');
        return;
    }

    // Phone number validation
    if (!/^[0-9]{10,}$/.test(phone)) {
        alert('Please enter a valid phone number (minimum 10 digits)');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Check if username already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.username === username)) {
        alert('Username already exists!');
        return;
    }

    // Store new user with phone number
    users.push({
        name,
        email,
        phone,
        username,
        password
    });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful! Please login.');
    showLoginFromRegister();
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromCookies();
    renderProducts(products);
    
    // Add event listeners for filters
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    document.getElementById('sortBy').addEventListener('change', filterProducts);
    document.getElementById('filterOrigin').addEventListener('change', filterProducts);
    document.getElementById('filterRoast').addEventListener('change', filterProducts);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            hideCartModal();
            hideLoginModal();
            hideRegisterModal();
            hideReceiptModal();
        }
    });
});