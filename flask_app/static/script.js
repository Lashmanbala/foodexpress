// Function to open the registration modal
function openRegisterModal() {
    document.getElementById("registerModal").style.display = "flex";
}

// Function to close the registration modal
function closeRegisterModal() {
    document.getElementById("registerModal").style.display = "none";
}

// Auto-close modal after 5 seconds
function autoCloseModal(modalId) {
    setTimeout(() => {
        const modal = document.getElementById(modalId);
        if (modal && modal.style.display === "flex") {
            modal.style.display = "none";
        }
    }, 5000); // Auto-close after 5 seconds (5000ms)
}

// Event listener for the sign-in form submission
document.getElementById('signInForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    // Check if the user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert(`Welcome back, ${user.username}!`);
        closeSignInModal(); // Close the modal
    } else {
        alert("Invalid email or password. Please try again.");
    }
});

// Event listener for the registration form submission
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validation
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    // Check if the email is already registered
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.email === email)) {
        alert("This email is already registered. Please use another email.");
        return;
    }

    // Save the new user
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert("Registration successful! You can now sign in.");
    closeRegisterModal(); // Close the modal
});

let cart = [];

// Function to add a food item to the cart
function addToCart(foodItemName, price) {
    const cartItem = { name: foodItemName, price: Number(price) };
    cart.push(cartItem);
    saveCartToStorage();
    updateCartCount();
}

// Function to update the cart count display
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = cart.length;
}

// Function to view the cart in a modal
function viewCart() {
    const cartModal = document.getElementById("cartModal");
    const cartItemsList = document.getElementById("cartItemsList");
    
    cartItemsList.innerHTML = ""; // Clear the current list

    if (cart.length === 0) {
        cartItemsList.innerHTML = "<li>Your cart is empty.</li>";
    } else {
        cart.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = ${item.name} - ₹${item.price};
            // Add remove button for each item
            const removeBtn = document.createElement('button');
            removeBtn.textContent = "Remove";
            removeBtn.onclick = function() {
                removeFromCart(index);
            };
            listItem.appendChild(removeBtn);
            cartItemsList.appendChild(listItem);
        });

        // Add total price at the bottom of the cart
        const total = cart.reduce((sum, item) => sum + item.price, 0);  // Ensure price is a number
        const totalItem = document.createElement('li');
        totalItem.textContent = Total: ₹${total};
        cartItemsList.appendChild(totalItem);
    }
    
    cartModal.style.display = "flex"; // Show the modal
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1); // Remove the item at the specified index
    updateCartCount();
    viewCart(); // Refresh the cart view
}

// Function to clear the cart
function clearCart() {
    cart = [];
    updateCartCount();
    viewCart();
}

// Function to close the cart modal
function closeCartModal() {
    document.getElementById("cartModal").style.display = "none";
}

function saveCart() {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Save cart whenever it changes
cart.push(cartItem);
saveCart();}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
    updateCartCount();
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// Load cart on page load
document.addEventListener('DOMContentLoaded', loadCart);

document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = cart.length;
});

window.addEventListener('storage', () => {
    loadCartFromStorage();
});

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));