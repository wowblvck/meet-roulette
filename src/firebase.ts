import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLD91yzr4MBKKkH2XIMWcn9TISxaIdzFs",
  authDomain: "meet-roulette-840e3.firebaseapp.com",
  projectId: "meet-roulette-840e3",
  storageBucket: "meet-roulette-840e3.firebasestorage.app",
  messagingSenderId: "758892592904",
  appId: "1:758892592904:web:c5e43b87e02420498376bd",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
