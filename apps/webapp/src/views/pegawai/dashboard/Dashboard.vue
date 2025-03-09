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
  {
    id: 1,
    name: "Farriq",
    date: "2022-01-01",
    time: "10:00",
    status: "Hadir",
    method: "card",
  },
  {
    id: 1,
    name: "Farriq",
    date: "2022-01-01",
    time: "10:00",
    status: "Hadir",
    method: "card",
  },
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
    <AppHeader :bg="false" />
    <Header />
    <div
      class="mx-3 p-card shadow-1 h-6rem border-round-xl"
      style="margin: -10px; z-index: 99"
    >
      <div class="p-3 overflow-hidden">
        <h3 class="m-0">Quote of <span class="text-primary">The day</span></h3>
        <p class="text-xs mt-2 font-semibold">
          Settle up via your bank app. No app required on their end!
        </p>
      </div>
    </div>
    <div class="grid grid-nogutter gap-4">
      <div class="p-card shadow-1 border-round-xl p-3 mx-3 w-full">
        <div
          class="flex align-items-center justify-content-between border-bottom-1 border-200 pb-2"
        >
          <h4 class="m-0 text-xl">Presensi Hari Ini</h4>
          <a href="" class="text-xs no-underline text-primary">Lihat semua</a>
        </div>
        <DataView :value="mockPresensi" class="mt-2">
          <template #list="slotProps">
            <div class="flex flex-column gap-2 px-1">
              <div v-for="(item, index) in slotProps.items" :key="index">
                <div
                  class="flex flex-column py-2 border-bottom-1 surface-border"
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
                </div>
              </div>
            </div>
          </template>
          <template #empty>
            <p>Presensi Kosong</p>
          </template>
        </DataView>
      </div>

      <div class="p-card shadow-1 border-round-xl p-3 mx-3 w-full">
        <div
          class="flex align-items-center justify-content-between border-bottom-1 border-200 pb-3"
        >
          <h4 class="m-0 text-xl">Transaksi Hari Ini</h4>
          <a href="" class="text-xs no-underline text-primary">Lihat semua</a>
        </div>
        <DataView :value="mockPresensi" class="mt-2">
          <template #list="slotProps">
            <div class="flex flex-column gap-2">
              <ListTransaction :items="slotProps.items" />
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
