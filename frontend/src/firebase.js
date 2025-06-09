// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgV7VnlomO3WBNDB6gnWiQynBFBNslktc",
  authDomain: "chatter-24302.firebaseapp.com",
  projectId: "chatter-24302",
  storageBucket: "chatter-24302.firebasestorage.app",
  messagingSenderId: "1010718966726",
  appId: "1:1010718966726:web:0c9373cc0f71a36ef868c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);