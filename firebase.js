import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBxmLJu0jMyVUxJMB8Fh2LnkhKStwYBNoo",
    authDomain: "cpg-erp.firebaseapp.com",
    projectId: "cpg-erp",
    storageBucket: "cpg-erp.firebasestorage.app",
    messagingSenderId: "446695520731",
    appId: "1:446695520731:android:54e247f331aa946208cffe"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
