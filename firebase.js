 import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNIQAxdkjv8qGRV8awne0NC_FW_CtEYT0",
  authDomain: "skyvolt-app-b9ef1.firebaseapp.com",
  projectId: "skyvolt-app-b9ef1",
  storageBucket: "skyvolt-app-b9ef1.firebasestorage.app",
  messagingSenderId: "478621096088",
  appId: "1:478621096088:web:b3685147bb8dee7e25d8ed",
  measurementId: "G-2470PMZQF3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);   
