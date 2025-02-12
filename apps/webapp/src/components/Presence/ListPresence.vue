<script setup>
const { items } = defineProps({
  items: {
    type: Array,
    default: [],
    required: true,
  },
});
</script>

<template>
  <router-link
    v-for="(item, index) in items"
    :key="index"
    :to="{ name: 'presences-detail', params: { id: item.id } }"
    class="flex flex-column py-2 border-bottom-1 surface-border no-underline text-color"
  >
    <h4 class="m-0 mb-2">Presensi Rapat Sekolah</h4>
    <div class="text-xs my-1 font-semibold">
      <span class="text-primary">Lokasi : </span>
      <span class="text-color-secondary">Pos Satpam</span>
    </div>
    <div class="text-xs my-1 font-semibold">
      <span class="text-primary">Tanggal dan Waktu : </span>
      <span class="text-color-secondary">18:00</span>
    </div>
    <div class="text-xs my-1 font-semibold">
      <span class="text-primary">Metode : </span>
      <span class="text-color-secondary">Card</span>
    </div>
  </router-link>
</template>
