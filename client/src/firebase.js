// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDK8u0YE6v29-MvQQxtLHL-ZH9OJK6yzz8",
  authDomain: "guest-house-dep.firebaseapp.com",
  projectId: "guest-house-dep",
  storageBucket: "guest-house-dep.appspot.com",
  messagingSenderId: "842540182957",
  appId: "1:842540182957:web:8e058f084044bef42e4524",
  measurementId: "G-1C6371BKGV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
