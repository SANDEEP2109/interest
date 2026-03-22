import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVNjaoEP33Yh4ATJ0Po64dvqyFwWK1TSE",
  authDomain: "wishlist-d31b3.firebaseapp.com",
  projectId: "wishlist-d31b3",
  storageBucket: "wishlist-d31b3.firebasestorage.app",
  messagingSenderId: "184475492788",
  appId: "1:184475492788:web:7155750701e40d1668d2e1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
