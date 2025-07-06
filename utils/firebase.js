import { cert, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import fs from 'fs';
import { config } from './env.js';



//initialize firebase admin for verifiying tokens and initialize firebase-auth to do logins and stuff
const serviceAccount = JSON.parse(Buffer.from(config.FIREBASE_ADMIN, 'base64').toString('utf8'));
// const serviceAccount = JSON.parse(fs.readFileSync("lana-auth-test-firebase-admin.json"));

const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: "lana-auth-test.firebaseapp.com",
    projectId: "lana-auth-test",
    storageBucket: "lana-auth-test.firebasestorage.app",
    messagingSenderId: "39085959289",
    appId: "1:39085959289:web:1845cb5b1f6255cacd4ca8"
  };

export const firebaseApp = initializeApp(firebaseConfig);  
export const auth = getAuth(firebaseApp);
export const firebaseAdminApp = initializeAdminApp({credential: cert(serviceAccount)});