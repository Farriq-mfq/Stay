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
    <div
      class="mx-3 p-card shadow-1 h-6rem border-round-xl"
      style="margin: -10px; z-index: 99"
    >
      <div class="p-3 overflow-hidden">
        <h3 class="m-0">Fitur <span class="text-primary">Sistem</span></h3>
        <p class="text-xs mt-2 font-semibold">Comming soon</p>
      </div>
    </div>
    <div class="grid grid-nogutter gap-4">
      <keep-alive>
        <LatestTransaction />
      </keep-alive>
      <keep-alive>
        <LatestPresence />
      </keep-alive>
    </div>
  </div>
</template>
