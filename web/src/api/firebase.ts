import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDrGLFIaRw17m2nTUMmGXj5rU1vTa92QXo',
  authDomain: 'fondet.firebaseapp.com',
  projectId: 'fondet',
  storageBucket: 'fondet.appspot.com',
  messagingSenderId: '154071605290',
  appId: '1:154071605290:web:e814d92d222205f7102353',
};

export const firebaseApp = initializeApp(firebaseConfig);
