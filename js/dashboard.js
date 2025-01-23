import { auth, db, signOut, onAuthStateChanged, doc, getDoc } from "./firebase.js";

const logoutButton = document.getElementById("logoutButton");
const welcomeMessage = document.getElementById("welcomeMessage");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      welcomeMessage.textContent = `Welcome, ${userData.username}!`;
    } else {
      console.log("No such document!");
    }
  } else {
    window.location.href = "login.html"; // Redirect if not logged in
  }
});

logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Logged out successfully!");
    window.location.href = "login.html";
  } catch (error) {
    alert(error.message);
  }
});
