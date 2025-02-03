import { auth, db, signOut, doc, getDoc, query, collection, where, getDocs } from "./firebase.js";

const logoutButton = document.getElementById("logoutButton");
const welcomeMessage = document.getElementById("welcomeMessage");
const searchInput = document.getElementById("searchInput");
const searchResultContainer = document.getElementById("searchResultContainer");

document.addEventListener("DOMContentLoaded", async () => {
  const loggedInUserUID = localStorage.getItem("loggedInUserUID");

  if (loggedInUserUID) {
    const userDoc = await getDoc(doc(db, "users", loggedInUserUID));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Corrected string interpolation with backticks
      welcomeMessage.textContent = `Welcome, ${userData.username}!`;
    } else {
      console.log("No user data found. Redirecting to Login page...");
      localStorage.removeItem("loggedInUserUID");
      window.location.href = "login.html";
    }
  } else {
    console.log("No user logged in. Redirecting to Login page...");
    window.location.href = "login.html";
  }
});

logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("loggedInUserUID");
    alert("Logged out successfully!");
    window.location.href = "login.html";
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Search when Enter key is pressed
searchInput.addEventListener("keyup", async (event) => {
  if (event.key === "Enter") {
    const email = searchInput.value.trim();
    if (!email) {
      alert("Please enter an email to search.");
      return;
    }

    try {
      searchResultContainer.innerHTML = ""; // Clear previous results
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(docSnapshot => {
          const userData = docSnapshot.data();
          const userUID = docSnapshot.id;

          // Corrected innerHTML with proper quotes
          const userDiv = document.createElement("div");
          userDiv.classList.add("user-card");
          userDiv.innerHTML = `
            <p><strong>Name:</strong> ${userData.username}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>UID:</strong> ${userUID}</p>
          `;
          searchResultContainer.appendChild(userDiv);
        });
      } else {
        searchResultContainer.textContent = "No user found with this email.";
      }
    } catch (error) {
      console.error("Error searching user:", error);
      searchResultContainer.textContent = "An error occurred. Please try again.";
    }
  }
});
