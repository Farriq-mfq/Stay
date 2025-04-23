import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useRouter } from 'vue-router';

const firebaseConfig = {};


const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);


const requestNotificationPermissionAndGetToken = async (vapidKey) => {
    try {
        const permission = await Notification.permission;
        if (permission === 'granted') {
            const token = await getToken(messaging, { vapidKey });
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
    const router = useRouter();

    onMessage(messaging, (payload) => {
        console.log('Message received in foreground: ', payload);
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
