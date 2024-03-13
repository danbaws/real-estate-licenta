import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Add Firebase storage
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAfML9oaPAYHRtgPdp9nzYwsMyVjIiwt0I",
    authDomain: "realestate-4d0f0.firebaseapp.com",
    projectId: "realestate-4d0f0",
    storageBucket: "realestate-4d0f0.appspot.com",
    messagingSenderId: "1072461412159",
    appId: "1:1072461412159:web:ae52c59a93615a0af8058a",
    measurementId: "G-D0Y1Z6TJPQ"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export default storage;