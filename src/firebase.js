// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBK2eQHgutbhe3wDgpqZTUHQR_8A8benaw",
  authDomain: "proiect-licenta-59247.firebaseapp.com",
  projectId: "proiect-licenta-59247",
  storageBucket: "proiect-licenta-59247.appspot.com",
  messagingSenderId: "1009095433578",
  appId: "1:1009095433578:web:93ad68b4b5d47cac175913",
  measurementId: "G-NNTKX22ZZ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);