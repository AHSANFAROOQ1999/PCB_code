import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import axios from "axios";

// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyCKGnKs-H-rwDa9I7o-gRR4pLFPDcE6pUA",
    authDomain: "comverse-295a4.firebaseapp.com",
    projectId: "comverse-295a4",
    storageBucket: "comverse-295a4.appspot.com",
    messagingSenderId: "514863362831",
    appId: "1:514863362831:web:ab1c70955b3ff7f4c7447a",
};

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

export function notify() {
    // console.log("firebase.js", firebase.apps);
    const fapp = initializeApp(firebaseConfig);
    const messaging = getMessaging(fapp);

    getToken(messaging, {
        vapidKey:
            "BLlgDdHQlLer4f9KS1rbUoaGUlKXgRICMBpGM5CvA4Zj-uL2OhZT7DvjVb9frpWiTcWSChrtB_sAlOJ3yGSi-sg",
    })
        .then((currentToken) => {
            if (currentToken) {
                let body = {
                    "token": currentToken
                }
                // console.log("Token", currentToken);
                axios.post(process.env.REACT_APP_BACKEND_HOST + '/storefront/device_token_for_notification', body)
                    .then((response) => { console.log("Firebase Tokken Response", response.data); })

                // Send the token to your server and update the UI if necessary
                // ...
            } else {
                // Show permission request UI
                console.log(
                    "No registration token available. Request permission to generate one."
                );
                // ...
            }
        })
        .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
            // ...
        });
    onMessage(messaging, (payload) => {
        // console.log("Message received. ", payload);
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body
        };
        if (payload.notification.image) {
            notificationOptions['icon'] = payload.notification.image
        }

        const notification = new Notification(notificationTitle, notificationOptions);
    });
}
export default firebase;