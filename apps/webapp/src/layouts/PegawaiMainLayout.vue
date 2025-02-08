<script setup>
import "primevue/resources/themes/lara-light-blue/theme.css";
import { useScan } from "@/store/scan";
import { ref, watch } from "vue";
import { onMounted } from "vue";
import { onUnmounted } from "vue";
import DrawerContent from "../components/DrawerContent.vue";
const scan = useScan();
const isVisible = ref(false);

watch(
  () => scan.isScan,
  (val) => {
    isVisible.value = val;
  }
);

const draweComponents = {
  default: DrawerContent,
};

onMounted(() => {
  isVisible.value = scan.isScan;
});

onUnmounted(() => {
  isVisible.value = false;
});
</script>
<template>
  <div>
    <div style="padding-bottom: 7rem">
      <Transition>
        <slot></slot>
      </Transition>
    </div>
    <AppNav />
    <Sidebar
      v-model:visible="isVisible"
      :baseZIndex="99999"
      blockScroll
      position="bottom"
      style="max-width: 414px; margin: 0 auto; border-radius: 1rem 1rem 0 0;height: auto;"
      :header="scan.title"
      @hide="scan.closeScan()"
    >
      <component
        :is="draweComponents[scan.getComponentName]"
        v-if="scan.getComponentName"
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
</style>
