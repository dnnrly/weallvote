// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from '@firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3Kn6m7OToz8SuMmJzvZEhEzjYyzwTGu0",
  authDomain: "weallvote-3a8a3.firebaseapp.com",
  projectId: "weallvote-3a8a3",
  storageBucket: "weallvote-3a8a3.firebasestorage.app",
  messagingSenderId: "524528414252",
  appId: "1:524528414252:web:cd4037a266b0ce9539ab89",
  measurementId: "G-5J9LWD14C5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  console.log("Using Firebase Auth Emulator");
}
