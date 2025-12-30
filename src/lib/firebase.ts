import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAw5hW_2S1S3VRLHgPYQ_XzjxAjKYXOOg0",
  authDomain: "jurididesk.firebaseapp.com",
  projectId: "jurididesk",
  storageBucket: "jurididesk.firebasestorage.app",
  messagingSenderId: "1028467201248",
  appId: "1:1028467201248:web:aca3c6893de44a3d27ac85",
  measurementId: "G-HYEJJBTHXG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
