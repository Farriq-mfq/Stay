<script setup>
import { ref } from "vue";

const isOpen = ref(true);
const startX = ref(0);
const currentX = ref(0);
const isDragging = ref(false);

const drawerStyle = ref({ transform: "translateX(-100%)" });

const openDrawer = () => {
  drawerStyle.value = { transform: "translateX(0%)", transition: "0.3s ease" };
  isOpen.value = true;
};

const closeDrawer = () => {
  drawerStyle.value = {
    transform: "translateX(-100%)",
    transition: "0.3s ease",
  };
  isOpen.value = false;
};

const handleTouchStart = (event) => {
  startX.value = event.touches[0].clientX;
  currentX.value = startX.value;
  isDragging.value = true;
};

const handleTouchMove = (event) => {
  if (!isDragging.value) return;
  currentX.value = event.touches[0].clientX;
};

const handleTouchEnd = () => {
  const diff = currentX.value - startX.value;
  if (diff < -50) closeDrawer();
  isDragging.value = false;
};
</script>

<template>
  <div v-if="isOpen" class="app-drawer-overley" @click="closeDrawer"></div>
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed left-0 right-0 bottom-0 app-drawer p-card border-noround shadow border-round-top-2xl p-3"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <button class="btn-close" @click="closeDrawer">Close</button>
      <p>Geser ke kiri untuk menutup.</p>
    </div>
  </Transition>
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
  max-width: 414px;
  margin: 0 auto;
  z-index: 99999;
  min-height: 12rem;
}

.app-drawer-overley {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}
</style>
