<script setup></script>

<template>
  <div
    class="app-nav p-card shadow-2 flex justify-content-evenly align-items-center"
  >
    <a
      href=""
      class="flex flex-column align-items-center no-underline text-center"
    >
      <i class="pi pi-home text-xl text-primary"></i>
      <span class="text-xs text-primary mt-2 font-semibold">Home</span>
    </a>
    <a
      href=""
      class="flex flex-column align-items-center no-underline text-center"
    >
      <i class="pi pi-wallet text-xl text-color-secondary"></i>
      <span class="text-xs text-color-secondary mt-2 font-semibold"
        >Payment</span
      >
    </a>
    <div
      class="flex flex-column align-items-center no-underline text-center mb-6"
    >
      <Button icon="pi pi-qrcode" size="large" class="h-4rem w-4rem" rounded />
      <span class="text-xs text-primary mt-2 font-semibold">Scan</span>
    </div>
    <a
      href=""
      class="flex flex-column align-items-center no-underline text-center"
    >
      <i class="pi pi-pencil text-xl text-color-secondary"></i>
      <span class="text-xs text-color-secondary mt-2 font-semibold"
        >Presensi</span
      >
    </a>
    <a
      href=""
      class="flex flex-column align-items-center no-underline text-center"
    >
      <i class="pi pi-user text-xl text-color-secondary"></i>
      <span class="text-xs text-color-secondary mt-2 font-semibold">Akun</span>
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
}
</style>
