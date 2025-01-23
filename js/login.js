import { auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "./firebase.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in successfully!");
    window.location.href = "dashboard.html"; 
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("googleLogin").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    alert("Logged in with Google!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
});
