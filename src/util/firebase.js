import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB-OhSdGZYSHQZI2cJYnceZ6S3DEnY0JSs',
  authDomain: 'cheddit-c6f6d.firebaseapp.com',
  projectId: 'cheddit-c6f6d',
  storageBucket: 'cheddit-c6f6d.appspot.com',
  messagingSenderId: '433187184526',
  appId: '1:433187184526:web:f92304c120ceb839258edf',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
