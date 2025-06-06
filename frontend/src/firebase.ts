// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from '@firebase/auth';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const isLocalhost = window.location.hostname === "localhost";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: isLocalhost ? "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg1234567890" : "AIzaSyB3Kn6m7OToz8SuMmJzvZEhEzjYyzwTGu0",
  authDomain: isLocalhost ? "demo-weallvote.firebaseapp.com" : "weallvote-3a8a3.firebaseapp.com",
  projectId: isLocalhost ? "demo-weallvote" : "weallvote-3a8a3",
  storageBucket: isLocalhost ? "demo-weallvote.appspot.com" : "weallvote-3a8a3.firebasestorage.app",
  messagingSenderId: isLocalhost ? "123456789012" : "524528414252",
  appId: isLocalhost ? "1:123456789012:web:abcdef1234567890abcdef" : "1:524528414252:web:cd4037a266b0ce9539ab89",
  measurementId: isLocalhost ? "G-FAKE123456" : "G-5J9LWD14C5"
};

console.log("NODE_ENV: ", import.meta.env.MODE)
console.log("Firebase config: ", firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = isLocalhost ? null : getAnalytics(app);

export const auth = getAuth(app);
if (isLocalhost) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  console.log("Using Firebase Auth Emulator");
}
