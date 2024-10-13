let cart = [];

// Function to add a food item to the cart
function addToCart(foodItemName, price) {
    // Ensure price is correctly passed as a number
    const cartItem = {
        name: foodItemName,
        price: Number(price)  // Convert to number if not already
    };
    cart.push(cartItem); // Add the food item with price to the cart
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
            listItem.textContent = `${item.name} - ₹${item.price}`;
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
        totalItem.textContent = `Total: ₹${total}`;
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


// Function to open the sign-in modal
function openSignInModal() {
    document.getElementById("signInModal").style.display = "flex";
}

// Function to close the sign-in modal
function closeSignInModal() {
    document.getElementById("signInModal").style.display = "none";
}

// Event listener for form submission
document.getElementById('signInForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    alert("Signed in successfully!");
    closeSignInModal(); // Close the modal after sign-in
});
