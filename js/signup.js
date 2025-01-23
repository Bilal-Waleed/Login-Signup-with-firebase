import { auth, db, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, doc, setDoc } from "./firebase.js";

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

    // Store user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      createdAt: new Date()
    });

    alert("Account created successfully!");
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } catch (error) {
    alert(error.message);
  }
});

// Handle Google Sign-Up
document.getElementById("googleSignup").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();

  try {
    // Google Sign-In with Firebase
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Store user info in Firestore
    const username = user.displayName || "Google User";
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: user.email,
      createdAt: new Date()
    });

    alert("Signed up successfully with Google!");
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } catch (error) {
    alert(error.message);
  }
});