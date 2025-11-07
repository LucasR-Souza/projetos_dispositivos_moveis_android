// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCk26Zbx9KQGxpBCZApRaukANU1d8rNOps",
  authDomain: "extensao-3b703.firebaseapp.com",
  projectId: "extensao-3b703",
  storageBucket: "extensao-3b703.firebasestorage.app",
  messagingSenderId: "332112798079",
  appId: "1:332112798079:web:915abc5b78ac076bb1ba4a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const autenticacao = getAuth(app);
const db = getFirestore(app);

export { autenticacao, db };