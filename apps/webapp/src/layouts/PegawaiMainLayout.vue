<script setup>
import { useApp } from "@/store/app";
import { useDrawer } from "@/store/drawer";
import { usePush } from "@/utils/notification";
import { useToast } from "primevue/usetoast";
import { onMounted, onUnmounted, ref, watch } from "vue";
import OpenNotification from "../components/drawer/OpenNotification.vue";
import TransferConfirmationPegawai from "../components/drawer/TransferConfirmationPegawai.vue";
import TransferScanPegawai from "../components/drawer/TransferScanPegawai.vue";
import DrawerContent from "../components/DrawerContent.vue";

const drawer = useDrawer();
const app = useApp();
const isVisible = ref(false);
const toast = useToast();
const { initPush } = usePush();

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
  // notification
  await initPush();
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
