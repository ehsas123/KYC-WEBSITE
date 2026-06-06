import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDdHeU5NQvq5qsIAJWOwkJjGZVvFmhHvng",
  authDomain: "mission-clean-city.firebaseapp.com",
  projectId: "mission-clean-city",
  storageBucket: "mission-clean-city.firebasestorage.app",
  messagingSenderId: "379103623727",
  appId: "1:379103623727:web:c4360818afbed91a9424da"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };