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
  apiKey: "AIzaSyChDMehGRdpmT50FIH0n_7HCLmNsZfQxbk",
  authDomain: "scissor-c881a.firebaseapp.com",
  projectId: "scissor-c881a",
  storageBucket: "scissor-c881a.appspot.com",
  messagingSenderId: "267037880839",
  appId: "1:267037880839:web:11144231a2c6f957a2b0a2",
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
