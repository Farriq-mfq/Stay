import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { useDrawer } from '@/store/drawer';
import { useMutation } from '@tanstack/vue-query'
import { inject, computed, getCurrentInstance } from 'vue'
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';
export const usePush = () => {
    const drawer = useDrawer()
    const auth = inject("auth");
    const user = computed(() => auth.user());
    const { proxy } = getCurrentInstance();
    const axios = proxy.axios;
    const toast = useToast()
    const router = useRouter()
    const updateFcmTokenService = async (token) => {
        const response = await axios.patch(
            "/pegawai/modules/notification/fcm-token",
            {
                token,
            }
        );

        return response.data;
    };

    const { mutate: updateFcmToken } = useMutation({
        mutationFn: updateFcmTokenService,
        mutationKey: ["updateFcmToken"],
    });

    const initPush = async () => {
        if (!Capacitor.isNativePlatform()) {
            console.log('Not a native platform, using web push.');
            return;
        }

        const permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive !== 'granted') {
            drawer.openDrawer("OpenNotification", "Notifikasi", () => { }, {});
        }


        await PushNotifications.register();

        PushNotifications.addListener('registration', token => {
            if (token.value || user.value.fcm_token !== token.value) updateFcmToken(token.value);
        });

        // PushNotifications.addListener('registrationError', err => {
        //     console.error('Registration error:', err);
        // });

        PushNotifications.addListener('pushNotificationReceived', notification => {
            toast.add({
                severity: "info",
                summary: notification.title ?? "Notifikasi",
                detail: notification.body ?? "-",
                life: 3000
            })
        });

        PushNotifications.addListener('pushNotificationActionPerformed', action => {
            router.push({ name: 'notification' })
        });
    };

    return { initPush };
};
