import { computed, inject, watch } from 'vue'
import {
    requestNotificationPermissionAndGetToken,
} from "@/utils/firebase";
export function useFcmTokenSync(vapidKey, useFcmTokenSync) {
    const auth = inject("auth");
    const user = computed(() => auth.user());
    watch(
        () => vapidKey.value,
        async (val) => {
            if (val && val.data) {
                const token = await requestNotificationPermissionAndGetToken(val.data);
                if (token && (!user.value.fcm_token || user.value.fcm_token !== token)) {
                    await useFcmTokenSync(token);
                }
            }
        }
    );
}