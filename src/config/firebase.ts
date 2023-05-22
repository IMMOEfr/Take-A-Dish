// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import {collection, getFirestore} from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-noCVqxrNs-IudmMQGEjTzo2xmn57zCo",
  authDomain: "take-a-dish-b702e.firebaseapp.com",
  projectId: "take-a-dish-b702e",
  storageBucket: "take-a-dish-b702e.appspot.com",
  messagingSenderId: "705043966950",
  appId: "1:705043966950:web:6a647c21015a94cd9a0427",
  measurementId: "G-25BVFSDFEB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
// COLLECTIONS
export const menuRef = collection(db, 'menu');
export const pinRef = collection(db, 'masterkey');
export const tableRef = collection(db, 'tables');
export const placedOrderRef = collection(db, 'placedOrders');

//storage
export const storage = getStorage(app);
