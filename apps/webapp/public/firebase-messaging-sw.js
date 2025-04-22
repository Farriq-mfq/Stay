importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBGGfqzCVcLEpz87EeX8hiNvirwh9qqw_4",
    authDomain: "stay-d3d24.firebaseapp.com",
    projectId: "stay-d3d24",
    storageBucket: "stay-d3d24.firebasestorage.app",
    messagingSenderId: "226508036144",
    appId: "1:226508036144:web:4ec782dc00fdac470df5f5",
    measurementId: "G-V59YRC41YR"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    // console.log('[firebase-messaging-sw.js] Received background message ', payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/logo.png",
    });
});
