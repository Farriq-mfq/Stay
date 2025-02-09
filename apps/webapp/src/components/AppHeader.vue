<script setup>
import { useWindowScroll } from "@vueuse/core";
import { onMounted, useTemplateRef, watch } from "vue";

const { x, y } = useWindowScroll();
const { bg } = defineProps({
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
  window.scrollTo(0, 0);
});
</script>

<template>
  <div
    ref="app-header"
    class="flex justify-content-between align-items-center fixed left-0 right-0 top-0 px-3 py-3 mx-auto app-header"
    :class="{ 'bg-primary': bg, 'bg-transparent': !bg }"
    style="z-index: 999"
  >
    <Button
      icon="pi pi-user"
      rounded
      variant="outlined"
      class="border-none text-white shadow-none"
      text
    />
    <img src="@/assets/logo.png" alt="" class="w-7rem" />
    <Button
      rounded
      variant="outlined"
      class="border-none text-white shadow-none"
      text
    >
      <template #icon>
        <i v-badge.danger="'5'" class="pi pi-bell"></i>
      </template>
    </Button>
  </div>
</template>

<style setup>
.bg-opacity {
  background: rgba(255, 255, 255, 0.2) !important;
}
.app-header {
  max-width: 414px;
  margin: auto 0;
}
</style>
