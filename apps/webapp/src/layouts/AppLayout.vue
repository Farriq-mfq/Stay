<script setup>
// import "primevue/resources/themes/lara-light-green/theme.css";
// primevue/resources/themes/lara-light-green/theme.css

// import { useScreenOrientation } from "@vueuse/core";
import { useTheme } from "@/store/theme";
import { useToast } from "primevue/usetoast";
import { onMounted, onUnmounted, ref, watch } from "vue";
// const { lockOrientation } = useScreenOrientation();

// lockOrientation("portrait-primary");

const isOnline = ref(navigator.onLine);
const theme = useTheme();

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
};

onMounted(() => {
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  console.log(theme.getCurrentTheme);
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
  <link id="theme-link" rel="stylesheet" :href="`/themes/${theme.getCurrentTheme}/theme.css`" />
  <div class="surface-ground relative min-h-screen">
    <component :is="$route.meta.layoutComponent">
      <slot></slot>
    </component>
    <Toast position="top-center" class="px-3" style="z-index: 9999 !important" />
    <ConfirmDialog class="px-3"></ConfirmDialog>
    <!-- <ThemeSwitcher /> -->
  </div>
</template>
