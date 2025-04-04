<script setup>
import { ref } from "vue";
import Header from "./components/Header.vue";
import LatestPresence from "./components/LatestPresence.vue";
import LatestTransaction from "./components/LatestTransaction.vue";
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
    <div class="mx-3 p-card shadow-1  border-round-xl" style="margin: -10px; z-index: 99">
      <div class="p-3 overflow-hidden">
        <div class="flex align-items-center justify-content-between mb-3">
          <div>
            <h3 class="m-0 text-900">Shortcut <span class="text-primary font-medium">Menu</span></h3>
            <p class="text-600 text-sm mt-1 mb-0">Akses cepat ke fitur utama</p>
          </div>
        </div>
        <div class="grid">
          <div class="col-3 p-1">
            <div class="cursor-pointer transition-all transition-duration-300">
              <div class="p-2 flex flex-column align-items-center">
                <div class="border-1 border-primary-100 bg-primary-50/50 p-2 border-circle w-3rem h-3rem flex align-items-center justify-content-center">
                  <i class="pi pi-calendar text-base text-primary-600"></i>
                </div>
                <span class="text-900 font-medium text-xs text-center mt-2">Jadwal</span>
              </div>
            </div>
          </div>
          <div class="col-3 p-1">
            <div class="cursor-pointer transition-all transition-duration-300">
              <div class="p-2 flex flex-column align-items-center">
                <div class="border-1 border-blue-100 bg-blue-50/50 p-2 border-circle w-3rem h-3rem flex align-items-center justify-content-center">
                  <i class="pi pi-clock text-base text-blue-600"></i>
                </div>
                <span class="text-900 font-medium text-xs text-center mt-2">Presensi</span>
              </div>
            </div>
          </div>
          <div class="col-3 p-1">
            <div class="cursor-pointer transition-all transition-duration-300">
              <div class="p-2 flex flex-column align-items-center">
                <div class="border-1 border-orange-100 bg-orange-50/50 p-2 border-circle w-3rem h-3rem flex align-items-center justify-content-center">
                  <i class="pi pi-wallet text-base text-orange-600"></i>
                </div>
                <span class="text-900 font-medium text-xs text-center mt-2">Bayar</span>
              </div>
            </div>
          </div>
          <div class="col-3 p-1">
            <div class="cursor-pointer transition-all transition-duration-300">
              <div class="p-2 flex flex-column align-items-center">
                <div class="border-1 border-green-100 bg-green-50/50 p-2 border-circle w-3rem h-3rem flex align-items-center justify-content-center">
                  <i class="pi pi-book text-base text-green-600"></i>
                </div>
                <span class="text-900 font-medium text-xs text-center mt-2">Nilai</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-nogutter gap-4">
      <LatestTransaction />
      <LatestPresence />
    </div>
  </div>
</template>
