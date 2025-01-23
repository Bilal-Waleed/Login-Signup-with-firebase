import { auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "./firebase.js";

// Handle Email/Password Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    // Attempt to log in the user
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in successfully!");
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } catch (error) {
    // Handle specific Firebase errors
    if (error.code === "auth/user-not-found") {
      alert("No account found with this email. Redirecting to Sign-Up...");
      window.location.href = "signup.html"; // Redirect to Sign-Up page
    } else if (error.code === "auth/wrong-password") {
      alert("Incorrect password. Please try again.");
    } else {
      alert(`Error: ${error.message}`);
    }
  }
});

// Handle Google Login
document.getElementById("googleLogin").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    alert("Logged in with Google!");
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
