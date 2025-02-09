<script setup>
import "primevue/resources/themes/lara-light-blue/theme.css";

import { useDrawer } from "@/store/drawer";
import { useApp } from "@/store/app";
import { ref, watch } from "vue";
import { onMounted } from "vue";
import { onUnmounted } from "vue";
import DrawerContent from "../components/DrawerContent.vue";
import TransferConfirmation from "../components/drawer/TransferConfirmation.vue";
import Loading from "../components/drawer/Loading.vue";
import { useToast } from "primevue/usetoast";
const drawer = useDrawer();
const app = useApp();
const isVisible = ref(false);
const toast = useToast();
watch(
  () => drawer.isDrawer,
  (val) => {
    isVisible.value = val;
  }
);

const draweComponents = {
  default: DrawerContent,
  TransferConfirmation,
  Loading,
};

onMounted(() => {
  toast.removeAllGroups();
  isVisible.value = drawer.isDrawer;
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
