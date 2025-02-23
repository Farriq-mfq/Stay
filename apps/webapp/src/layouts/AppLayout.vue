<script setup>
// import { useScreenOrientation } from "@vueuse/core";
import { useToast } from "primevue/usetoast";
import { ref, onMounted, onUnmounted, watch } from "vue";

// const { lockOrientation } = useScreenOrientation();

// lockOrientation("portrait-primary");

const isOnline = ref(navigator.onLine);

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
};

onMounted(() => {
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener("online", updateOnlineStatus);
  window.removeEventListener("offline", updateOnlineStatus);
});
const toast = useToast();
watch(isOnline, (val) => {
  if (val) {
    toast.add({
      severity: "success",
      summary: "Online",
      detail: "Kamu kembali online",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Offline",
      detail: "Kamu sedang offline. beberapa fitur mungkin tidak tersedia",
      life: 3000,
    });
  }
});
</script>
<template>
  <div class="surface-ground relative min-h-screen">
    <component :is="$route.meta.layoutComponent">
      <slot></slot>
    </component>
    <Toast
      position="top-center"
      class="px-3"
      style="z-index: 9999 !important"
    />
  </div>
</template>
