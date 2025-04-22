import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useRouter } from 'vue-router';

const firebaseConfig = {
    apiKey: "AIzaSyBGGfqzCVcLEpz87EeX8hiNvirwh9qqw_4",
    authDomain: "stay-d3d24.firebaseapp.com",
    projectId: "stay-d3d24",
    storageBucket: "stay-d3d24.firebasestorage.app",
    messagingSenderId: "226508036144",
    appId: "1:226508036144:web:4ec782dc00fdac470df5f5",
    measurementId: "G-V59YRC41YR"
};


const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

const VAPID_KEY = "BLMNCdKlTPV_6LR7PdLiSO6d3FYnuPRw_CgcJdwfgq4DqtABgj8f9Ey4wn5IoNGB_8mZ0XM8F0rZUiZD-PiaqrU";


const requestNotificationPermissionAndGetToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getToken(messaging, { vapidKey: VAPID_KEY });
            if (token) {
                return token;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}

const listenToMessages = (toast) => {
    console.log("load")
    const router = useRouter();

    onMessage(messaging, (payload) => {
        // console.log('Message received in foreground: ', payload);
        toast.add({
            severity: 'info',
            summary: payload.notification?.title,
            detail: payload.notification?.body,
            life: 5000,
            sticky: true,
            closable: true,
            onClick: () => {
                if (targetUrl) {
                    router.push(targetUrl);
                }
            }
        })
    });
};


export {
    requestNotificationPermissionAndGetToken,
    listenToMessages,
    firebaseConfig,
    app,
    messaging,
    getToken,
    onMessage
}
