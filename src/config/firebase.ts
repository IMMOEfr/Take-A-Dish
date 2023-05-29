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
  /*SECRET C:*/
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
export const queueRef = collection(db, 'queue');
export const billsRef = collection(db, 'bills');

//storage
export const storage = getStorage(app);
