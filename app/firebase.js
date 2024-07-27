// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  connectAuthEmulator,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(firebase);

// Initialize Firebase Authentication
const auth = getAuth(firebase);

if (process.env.NODE_ENV === "development") {
  // Connect Firestore to its emulator
  connectFirestoreEmulator(firestore, "localhost", 8080);

  // Connect Authentication to its emulator
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { firebase, firestore, auth };
