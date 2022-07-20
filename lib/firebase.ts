import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDKctYMVHNAbKmUymsjq_tSxaB0gU07eJk",
    authDomain: "tangtee-d1030.firebaseapp.com",
    projectId: "tangtee-d1030",
    storageBucket: "tangtee-d1030.appspot.com",
    messagingSenderId: "230155681774",
    appId: "1:230155681774:web:ac72f7277d5677488298ff",
    measurementId: "G-1BN7BRTGHF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);