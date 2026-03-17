// ===============================
// Firebase Admin Login Logic
// File: /assets/js/admin-login.js
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* 🔐 FIREBASE CONFIG (PUBLIC – SAFE TO EXPOSE) */
const firebaseConfig = {
  apiKey: "AIzaSyDFHzY10VOjjmyxBJR5tvHKqepocBQgLD4",
  authDomain: "neet-futeducation.firebaseapp.com",
  projectId: "neet-futeducation",
  storageBucket: "neet-futeducation.firebasestorage.app",
  messagingSenderId: "916965418364",
  appId: "1:916965418364:web:e1c3ae15aa394b3ba670f9"
};

/* 🔥 INIT FIREBASE */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* 🎯 DOM ELEMENTS */
const loginForm = document.getElementById("loginForm");
const googleBtn = document.getElementById("googleSignInBtn");
const loader = document.getElementById("loader");

/* ✅ FINALIZE LOGIN (PREVENTS LOOP) */
function completeLogin(user) {
  const name =
    user.displayName ||
    user.email ||
    "Admin";

  // Required for admin guards
  localStorage.setItem("adminLoggedIn", "true");
  localStorage.setItem("adminUsername", name);

  // Redirect to dashboard
  window.location.replace(
    "../admin/admin-tools/admin-dashboard.html"
  );
}

/* 1️⃣ EMAIL / PASSWORD LOGIN */
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    loader.style.display = "inline-block";

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        completeLogin(userCredential.user);
      })
      .catch((error) => {
        loader.style.display = "none";
        alert("Login failed: " + error.message);
      });
  });
}

/* 2️⃣ GOOGLE LOGIN */
if (googleBtn) {
  googleBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        completeLogin(result.user);
      })
      .catch((err) => {
        alert("Google sign-in failed: " + err.message);
      });
  });
}
