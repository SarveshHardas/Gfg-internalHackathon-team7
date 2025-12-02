// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkWmqeLCTldHYnDAg86gnmS5GWN9B94e4",
  authDomain: "gauth-trial-7e275.firebaseapp.com",
  projectId: "gauth-trial-7e275",
  storageBucket: "gauth-trial-7e275.firebasestorage.app",
  messagingSenderId: "864970644566",
  appId: "1:864970644566:web:1c34b441e29656d9c3eff7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();