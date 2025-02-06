<script setup>
import { ref } from "vue";
import Header from "./components/Header.vue";
const mockPresensi = ref([
  {
    id: 1,
    name: "Farriq",
    date: "2022-01-01",
    time: "10:00",
    status: "Hadir",
    method: "card",
  },
]);
</script>

<template>
  <div class="flex flex-column gap-4" ref="el">
    <Header />
    <div
      class="mx-3 p-card shadow-2 h-6rem border-round-xl"
      style="margin: -10px; z-index: 99"
    >
      <div class="p-3 overflow-hidden">
        <h3 class="m-0">
          Quote of <span class="text-primary">The day</span>
        </h3>
        <p class="text-xs mt-2 font-semibold">
          Settle up via your bank app. No app required on their end!
        </p>
      </div>
    </div>
    <div class="grid grid-nogutter gap-4">
      <div class="p-card shadow-2 border-round-xl p-3 mx-3 w-full">
        <h4 class="m-0 border-bottom-1 border-200 pb-2">Presensi Hari Ini</h4>
        <DataView :items="mockPresensi">
          <template #list="slotProps">
            <div v-for="(item, index) in slotProps.items" :key="index">
              sfddfsdf
            </div>
          </template>
          <template #empty>
            <p>Presensi Kosong</p>
          </template>
        </DataView>
      </div>
      <div class="p-card shadow-2 border-round-xl p-3 mx-3 w-full">
        <h4 class="m-0 border-bottom-1 border-200 pb-2">Transaksi Hari Ini</h4>
        <DataView :items="mockPresensi">
          <template #list="slotProps">
            <div v-for="(item, index) in slotProps.items" :key="index">
              sfddfsdf
            </div>
          </template>
          <template #empty>
            <p>Presensi Kosong</p>
          </template>
        </DataView>
      </div>
    </div>
  </div>
</template>
