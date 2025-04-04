<script setup>

import { useRouter } from 'vue-router';
const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="flex flex-column align-items-center justify-content-center min-h-screen surface-ground">
    <div class="text-center">
      <i class="pi pi-exclamation-circle text-8xl text-primary mb-4"></i>
      <h1 class="text-6xl font-bold text-primary mb-2">404</h1>
      <h2 class="text-2xl font-semibold mb-4">Halaman Tidak Ditemukan</h2>
      <p class="text-color-secondary mb-4">Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
      <Button label="Kembali ke Beranda" icon="pi pi-home" @click="goHome" class="p-button-rounded" />
    </div>
  </div>
</template>