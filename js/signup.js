import { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  doc, 
  setDoc, 
  getDoc 
} from "./firebase.js";

// Handle Email/Password Sign-Up
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const username = document.getElementById("username").value.trim();

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user data already exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      // Save user info to Firestore
      const userData = {
        username: username,
        email: email,
        createdAt: new Date(),
      };
      await setDoc(doc(db, "users", user.uid), userData);
    }

    // Save only the UID to Local Storage
    localStorage.setItem("loggedInUserUID", user.uid);
    alert("Account created successfully!");
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } catch (error) {
    // Handle Firebase-specific errors
    if (error.code === "auth/email-already-in-use") {
      alert("This email is already in use. Please log in.");
      window.location.href = "login.html";
    } else if (error.code === "auth/weak-password") {
      alert("Password is too weak. Please use a stronger password.");
    } else {
      alert(`Error: ${error.message}`);
    }
  }
});

// Handle Google Sign-Up
document.getElementById("googleSignup").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      // Save user info to Firestore if not already saved
      const username = user.displayName || "Google User";
      const userData = {
        username: username,
        email: user.email,
        createdAt: new Date(),
      };
      await setDoc(doc(db, "users", user.uid), userData);
    }

    // Save only the UID to Local Storage
    localStorage.setItem("loggedInUserUID", user.uid);
    alert("Signed up successfully with Google!");
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      alert("Google Sign-Up was canceled. Please try again.");
    } else if (error.code === "auth/credential-already-in-use") {
      alert("This Google account is already linked to another account. Please log in.");
      window.location.href = "login.html";
    } else {
      alert(`Error: ${error.message}`);
    }
  }
});
