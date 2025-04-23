<script setup>
import { useDrawer } from "@/store/drawer";
const drawer = useDrawer();
const handleRequestNotification = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    drawer.closeDrawer();
  }
};
</script>

<template>
  <div class="flex flex-column align-items-center justify-content-center gap-3">
    <h2 class="text-xl md:text-2xl font-semibold m-0">Aktifkan Notifikasi</h2>
    <p class="text-500 text-center">
      Untuk mengaktifkan notifikasi, silahkan klik tombol dibawah ini
    </p>
    <Button
      label="Aktifkan Notifikasi"
      @click="handleRequestNotification"
      icon="pi pi-bell"
      size="large"
    />
  </div>
</template>
