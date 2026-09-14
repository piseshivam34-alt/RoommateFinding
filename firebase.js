// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiV64hj17ZkEvU1wrZPiWf51pLrbb3aWk",
  authDomain: "roommate-synce.firebaseapp.com",
  projectId: "roommate-synce",
  storageBucket: "roommate-synce.firebasestorage.app",
  messagingSenderId: "480516409457",
  appId: "1:480516409457:web:b086252b28f2b35a8573d0",
  measurementId: "G-3R7DSYPM2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
