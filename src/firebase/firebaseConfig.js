import firebase from "firebase/app";
import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyClKYVyNHyedEjDJW11c8rkM8cYQWolVgM",
  authDomain: "quizz-416eb.firebaseapp.com",
  projectId: "quizz-416eb",
  storageBucket: "quizz-416eb.appspot.com",
  messagingSenderId: "344219168671",
  appId: "1:344219168671:web:9cb1144d16ccaa2bff97aa",
  measurementId: "G-HPXRV9P5B5"
};

firebase.initializeApp(firebaseConfig);
// const analytics = analytics.isSupported() ? firebase.analytics() : null


export default firebase;