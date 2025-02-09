<script setup>
import { onMounted, onUnmounted } from "vue";
import { computed, useTemplateRef } from "vue";
import { useApp } from "@/store/app";
import { useWindowScroll } from "@vueuse/core";
import { watch } from "vue";

const app = useApp();

const hasHistory = computed(() => {
  return window.history.length > 2 && window.history.state.back != null;
});

onMounted(() => {
  app.hideAppNav();
});

onUnmounted(() => {
  app.setShowAppNav();
});

const { x, y } = useWindowScroll();
const { bg, title } = defineProps({
  title: {
    type: String,
    default: "",
  },
  bg: {
    type: Boolean,
    default: true,
  },
});

const appHeader = useTemplateRef("app-header");
watch([x, y], () => {
  if (!bg) {
    if (y.value > 50) {
      appHeader.value.classList.add("bg-primary");
      appHeader.value.classList.remove("bg-transparent");
    } else {
      appHeader.value.classList.remove("bg-primary");
      appHeader.value.classList.add("bg-transparent");
    }
  }
});

onMounted(() => {
  if (bg) appHeader.value.classList.add("bg-primary");
  window.scrollTo(0, 0);
});
</script>

<template>
  <div
    ref="app-header"
    class="flex align-items-center fixed left-0 right-0 top-0 py-2 mx-auto app-header gap-2 px-1 text-white"
    style="z-index: 999"
  >
    <Button
      icon="pi pi-chevron-left"
      text
      class="text-white"
      size="large"
      style="box-shadow: none"
      @click="hasHistory ? $router.go(-1) : $router.push('/')"
    />
    <h3 class="text-lg">
      {{ title }}
    </h3>
  </div>
</template>

<style setup>
.app-header {
  max-width: 414px;
  margin: auto 0;
}
</style>
