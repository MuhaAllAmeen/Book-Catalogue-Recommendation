import { cert, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import fs from 'fs';

//initialize firebase admin for verifiying tokens and initialize firebase-auth to do logins and stuff
const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_ADMIN, 'base64').toString('utf8'));

const firebaseConfig = {
    apiKey: "AIzaSyC0XD-amyvrcOLz-HE4z6ilTIARAgGj0AY",
    authDomain: "lana-auth-test.firebaseapp.com",
    projectId: "lana-auth-test",
    storageBucket: "lana-auth-test.firebasestorage.app",
    messagingSenderId: "39085959289",
    appId: "1:39085959289:web:1845cb5b1f6255cacd4ca8"
  };

export const firebaseApp = initializeApp(firebaseConfig);  
export const auth = getAuth(firebaseApp);
export const firebaseAdminApp = initializeAdminApp({credential: cert(serviceAccount)});