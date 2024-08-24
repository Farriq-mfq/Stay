<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="flex justify-content-center">
    <div class="w-full md:max-w-30rem min-h-screen surface-ground">
      <router-view />
    </div>
    <ConfirmDialog></ConfirmDialog>
    <Toast position="top-center" />
  </div>
</template>
