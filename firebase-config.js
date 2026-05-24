// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// PASTE YOUR ACTUAL CONFIG FROM STEP 3 HERE:
const firebaseConfig = {
  apiKey: "AIzaSyDdHeU5NQvq5qsIAJWOwkJjGZVvFmhHvng",
  authDomain: "mission-clean-city.firebaseapp.com",
  projectId: "mission-clean-city",
  storageBucket: "mission-clean-city.firebasestorage.app",
  messagingSenderId: "379103623727",
  appId: "1:379103623727:web:c4360818afbed91a9424da"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// This 'db' variable is what we will use to save/load complaints
export const db = getFirestore(app);