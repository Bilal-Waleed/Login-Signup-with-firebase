import { auth, db, signOut, doc, getDoc } from "./firebase.js";

const logoutButton = document.getElementById("logoutButton");
const welcomeMessage = document.getElementById("welcomeMessage");

document.addEventListener("DOMContentLoaded", async () => {
  // Get UID from Local Storage
  const loggedInUserUID = localStorage.getItem("loggedInUserUID");

  if (loggedInUserUID) {
    // Fetch user data from Firestore using UID
    const userDoc = await getDoc(doc(db, "users", loggedInUserUID));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Display the user's name
      welcomeMessage.textContent = `Welcome, ${userData.username}!`;
    } else {
      alert("No user data found. Redirecting to Login page...");
      localStorage.removeItem("loggedInUserUID");
      window.location.href = "login.html"; // Redirect to login
    }
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
    localStorage.removeItem("loggedInUserUID");
    alert("Logged out successfully!");
    window.location.href = "login.html"; // Redirect to login
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
