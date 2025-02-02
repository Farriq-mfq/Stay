<script setup></script>

<template>
  <div class="absolute px-3 mt-3 left-0 right-0" style="z-index: 10">
    <div class="flex justify-content-between align-items-center">
      <Button
        icon="pi pi-user"
        rounded
        variant="outlined"
        class="border-none bg-opacity shadow-1"
      />
      <Button
        icon="pi pi-bell"
        rounded
        variant="outlined"
        class="border-none bg-opacity shadow-1"
      />
    </div>

    <div class="h-8rem mt-5">
      <div class="bg-opacity h-full w-full border-round-2xl relative shadow-1">
        <div class="text-white p-2 ml-2 flex-1">
          <h2 class="text-2xl">Rp. 1.000.000</h2>
          <p class="text-xs">Saldo saat ini</p>
        </div>
        <Button
          icon="pi pi-eye"
          class="absolute border-none shadow-none"
          style="right: 0.5rem; bottom: 0.5rem; background: none"
          rounded
          variant="outlined"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-opacity {
  background: rgba(255, 255, 255, 0.2) !important;
}
</style>
