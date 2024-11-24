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

