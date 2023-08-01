import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyClKYVyNHyedEjDJW11c8rkM8cYQWolVgM",
  authDomain: "quizz-416eb.firebaseapp.com",
  projectId: "quizz-416eb",
  storageBucket: "quizz-416eb.appspot.com",
  messagingSenderId: "344219168671",
  appId: "1:344219168671:web:9cb1144d16ccaa2bff97aa",
  measurementId: "G-HPXRV9P5B5"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);