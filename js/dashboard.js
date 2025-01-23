import { auth, signOut } from "./firebase.js";

const logoutButton = document.getElementById("logoutButton");
const welcomeMessage = document.getElementById("welcomeMessage");

document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (loggedInUser) {
    welcomeMessage.textContent = `Welcome, ${loggedInUser.username}!`;
  } else {
    alert("No user logged in. Redirecting to Login page...");
    window.location.href = "login.html"; // Redirect to login
  }
});

// Handle Logout
logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    // Clear Local Storage
    localStorage.removeItem("loggedInUser");
    alert("Logged out successfully!");
    window.location.href = "login.html"; // Redirect to login
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
