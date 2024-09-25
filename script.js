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
