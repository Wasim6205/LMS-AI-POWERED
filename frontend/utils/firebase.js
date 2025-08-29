// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "loginlms-a4b53.firebaseapp.com",
  projectId: "loginlms-a4b53",
  storageBucket: "loginlms-a4b53.firebasestorage.app",
  messagingSenderId: "765105991919",
  appId: "1:765105991919:web:06e19d4c7c2abe12b6ab1a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}