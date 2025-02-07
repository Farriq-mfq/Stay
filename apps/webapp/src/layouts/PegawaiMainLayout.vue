<script setup>
import "primevue/resources/themes/lara-light-blue/theme.css";
</script>
<template>
  <div>
    <div style="padding-bottom: 7rem">
      <Transition>
        <slot></slot>
      </Transition>
    </div>
    <AppNav />
    <AppDrawer />
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
  max-width: 414px;
  margin: 0 auto;
  z-index: 99999;
  min-height: 12rem;
}
</style>
