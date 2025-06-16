import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAoJrPVd7fLV_PFEyH30FPG5ohTvSB84-Q",
  authDomain: "design-luka.firebaseapp.com",
  projectId: "design-luka",
  storageBucket: "design-luka.firebasestorage.app",
  messagingSenderId: "877749621216",
  appId: "1:877749621216:web:4e373d65bf1d46bad11b85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 