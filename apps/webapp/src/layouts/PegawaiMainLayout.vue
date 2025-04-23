<script setup>
import { useDrawer } from "@/store/drawer";
import { useApp } from "@/store/app";
import { inject, ref, watch, computed, getCurrentInstance } from "vue";
import { onMounted } from "vue";
import { onUnmounted } from "vue";
import DrawerContent from "../components/DrawerContent.vue";
import TransferConfirmationPegawai from "../components/drawer/TransferConfirmationPegawai.vue";
import TransferScanPegawai from "../components/drawer/TransferScanPegawai.vue";
import { useToast } from "primevue/usetoast";
import { listenToMessages } from "@/utils/firebase";
import { useFcmTokenSync } from "@/hooks/useFcmTokenSync";
import { useMutation, useQuery } from "@tanstack/vue-query";
import OpenNotification from "../components/drawer/OpenNotification.vue";
const drawer = useDrawer();
const app = useApp();
const isVisible = ref(false);
const toast = useToast();
const auth = inject("auth");
const user = computed(() => auth.user());

const { proxy } = getCurrentInstance();
const axios = proxy.axios;

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

const getVapidKey = async () => {
  const response = await axios.get("/pegawai/modules/notification/vapid-key");
  return response.data;
};

const { data: vapidKey } = useQuery({
  queryFn: getVapidKey,
  queryKey: ["getVapidKey"],
});

useFcmTokenSync(vapidKey, updateFcmToken);

watch(
  () => drawer.isDrawer,
  (val) => {
    isVisible.value = val;
  }
);

const draweComponents = {
  default: DrawerContent,
  TransferConfirmationPegawai,
  TransferScanPegawai,
  OpenNotification,
};

onMounted(async () => {
  toast.removeAllGroups();
  isVisible.value = drawer.isDrawer;

  if (Notification.permission === "default") {
    drawer.openDrawer("OpenNotification");
  } else if (Notification.permission === "denied") {
    drawer.openDrawer("OpenNotification");
  }
  
  listenToMessages(toast);
});

onUnmounted(() => {
  isVisible.value = false;
});
</script>
<template>
  <div>
    <div :class="{ 'main-app': app.getShowAppNav, 'pb-3': !app.getShowAppNav }">
      <Transition>
        <slot></slot>
      </Transition>
    </div>
    <AppNav v-if="app.getShowAppNav" />
    <Sidebar
      v-model:visible="isVisible"
      :baseZIndex="99999"
      blockScroll
      position="bottom"
      style="
        max-width: 414px;
        margin: 0 auto;
        border-radius: 1rem 1rem 0 0;
        height: auto;
      "
      :header="drawer.getTitle"
      @hide="drawer.closeDrawer()"
    >
      <component
        :is="draweComponents[drawer.getComponentName]"
        v-if="drawer.getComponentName"
      ></component>
    </Sidebar>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.app-drawer {
  max-width: 414px !important;
  margin: 0 auto;
  min-height: 12rem;
  background: #000;
}
.main-app {
  padding-bottom: 7rem;
}
</style>
