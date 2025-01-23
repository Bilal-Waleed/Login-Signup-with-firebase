import { auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, doc, getDoc, db } from "./firebase.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Save user data to Local Storage
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      alert("Logged in successfully!");
      window.location.href = "dashboard.html"; // Redirect to dashboard
    } else {
      alert("User data not found. Please sign up again.");
      window.location.href = "signup.html"; // Redirect to Sign-Up page
    }
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
    const user = result.user;

    // Fetch or Save user data in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Save user data to Local Storage
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
    } else {
      const username = user.displayName || "Google User";
      const newUser = { username, email: user.email, createdAt: new Date() };
      await setDoc(doc(db, "users", user.uid), newUser);
      localStorage.setItem("loggedInUser", JSON.stringify(newUser));
    }

    alert("Logged in with Google!");
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
