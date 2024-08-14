// app/firebase.d.ts
import { FirebaseApp } from "firebase/app";
import { Firestore } from "firebase/firestore";
import { Auth } from "firebase/auth";

export const firebase: FirebaseApp;
export const firestore: Firestore;
export const auth: Auth;
