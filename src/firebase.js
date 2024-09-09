import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase configuration object goes here
  // You can find this in your Firebase project settings
  apiKey: "AIzaSyCqIJ5cV_pTyo0LJycyrvNdjW62LNFARcw",
  authDomain: "budgit-track.firebaseapp.com",
  projectId: "budgit-track",
  storageBucket: "budgit-track.appspot.com",
  messagingSenderId: "529388335270",
  appId: "1:529388335270:web:ae93983710bcd519610467"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
