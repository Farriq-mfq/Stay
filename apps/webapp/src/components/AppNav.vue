<script setup>
import { useScan } from "@/store/scan";
const scan = useScan();
</script>

<template>
  <div
    class="app-nav p-card shadow-2 flex justify-content-evenly align-items-center"
  >
    <router-link
      :to="{ name: 'dashboard' }"
      class="flex flex-column align-items-center no-underline text-center text-color-secondary"
    >
      <i class="pi pi-home text-xl"></i>
      <span class="text-xs mt-2 font-semibold">Home</span>
    </router-link>
    <router-link
      :to="{ name: 'payment' }"
      class="flex flex-column align-items-center no-underline text-center text-color-secondary"
    >
      <i class="pi pi-wallet text-xl"></i>
      <span class="text-xs mt-2 font-semibold">Payment</span>
    </router-link>
    <div
      class="flex flex-column align-items-center no-underline text-center mb-6"
    >
      <Button
        @click="scan.openScan('default')"
        icon="pi pi-qrcode"
        size="large"
        class="h-4rem w-4rem"
        rounded
      />
      <span class="text-xs text-primary mt-2 font-semibold">Scan</span>
    </div>
    <a
      href=""
      class="flex flex-column align-items-center no-underline text-center text-color-secondary"
    >
      <i class="pi pi-pencil text-xl"></i>
      <span class="text-xs mt-2 font-semibold">Presensi</span>
    </a>
    <a
      href=""
      class="flex flex-column align-items-center no-underline text-center text-color-secondary"
    >
      <i class="pi pi-user text-xl"></i>
      <span class="text-xs mt-2 font-semibold">Akun</span>
    </a>
  </div>
</template>

<style scoped>
.app-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 414px;
  margin: auto;
  height: 4rem;
  border-radius: 0 !important;
  z-index: 99999;
}
.router-link-active {
  color: var(--primary-color) !important;
}

.router-link-exact-active {
  color: var(--primary-color) !important;
}
</style>
