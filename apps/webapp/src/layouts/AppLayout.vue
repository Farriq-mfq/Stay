<script setup>
import { useScreenOrientation } from "@vueuse/core";
import { useTheme } from "@/store/theme";
import { useToast } from "primevue/usetoast";
import { inject, onMounted, onUnmounted, ref, watch } from "vue";
import Splash from '@/components/Splash.vue'

const isOnline = ref(navigator.onLine);
const theme = useTheme();
const isJavaScriptEnabled = ref(true);
const showSplash = ref(true);
const auth = inject('auth')

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
};

onMounted(() => {
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  isJavaScriptEnabled.value = true;
  if (auth) {
    auth.load().then(() => {
      showSplash.value = false;
    })
  } else {
    setTimeout(() => {
      showSplash.value = false;
    }, 1000);
  }
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
  <noscript>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen">
      <div class="text-center p-4">
        <h1 class="text-2xl font-bold mb-2">JavaScript Required</h1>
        <p>Please enable JavaScript to use this application.</p>
      </div>
    </div>
  </noscript>
  <link id="theme-link" rel="stylesheet" :href="`/themes/${theme.getCurrentTheme}/theme.css`" />

  <Transition name="fade" mode="out-in">
    <div v-if="showSplash" class="fixed top-0 left-0 w-full h-full z-5">
      <Splash />
    </div>
  </Transition>

  <Transition name="fade" mode="out-in">
    <div v-if="!showSplash" v-show="isJavaScriptEnabled" class="surface-ground relative min-h-screen">
      <component :is="$route.meta.layoutComponent">
        <slot></slot>
      </component>
      <Toast position="top-center" class="px-3" style="z-index: 9999 !important" />
      <ConfirmDialog class="px-3"></ConfirmDialog>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
