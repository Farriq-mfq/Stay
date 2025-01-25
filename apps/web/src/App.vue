<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import LatestVersion from '@/components/LatestVersion.vue';
import { useToast } from 'primevue/usetoast';
const isOffline = ref(!navigator.onLine);
const toast = useToast()

const updateOnlineStatus = () => {
    isOffline.value = !navigator.onLine;
    if (isOffline.value) {
        toast.add({
            severity: 'error',
            summary: 'Offline',
            detail: 'Kamu sedang offline. beberapa fitur mungkin tidak tersedia',
            life: 5000,
        });
    }

    if (!isOffline.value) {
        toast.add({
            severity: 'success',
            summary: 'Online',
            detail: 'Kamu kembali online',
            life: 5000,
        });
    }
};

onMounted(() => {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
});

</script>

<template>
    <div>
        <router-view />
        <ConfirmDialog></ConfirmDialog>
        <Toast />
        <LatestVersion />
    </div>
</template>

<style scoped></style>
