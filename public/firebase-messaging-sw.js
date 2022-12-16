importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCKGnKs-H-rwDa9I7o-gRR4pLFPDcE6pUA",
    authDomain: "comverse-295a4.firebaseapp.com",
    projectId: "comverse-295a4",
    storageBucket: "comverse-295a4.appspot.com",
    messagingSenderId: "514863362831",
    appId: "1:514863362831:web:ab1c70955b3ff7f4c7447a",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();