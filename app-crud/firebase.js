// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRs_J_9y7sIBs4meKPQ4qHTPrLsd2shvQ",
  authDomain: "dispositivos-moveis-bc324.firebaseapp.com",
  projectId: "dispositivos-moveis-bc324",
  storageBucket: "dispositivos-moveis-bc324.firebasestorage.app",
  messagingSenderId: "906413274789",
  appId: "1:906413274789:web:c0f4fd1736ae62f1beff4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const autenticacao = getAuth(app);
const db = getFirestore(app);

export { autenticacao, db };