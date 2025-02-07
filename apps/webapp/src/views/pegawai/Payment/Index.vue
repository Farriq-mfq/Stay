<script setup>
import { ref } from "vue";

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
  <div>
    <AppHeader />
    <div class="flex flex-column mt-7">
      <div class="p-3 flex align-items-center gap-3 sticky bg-white shadow-1" style="top: 4rem;">
        <InputText class="w-full flex-1" placeholder="Cari transaksi" />
        <Button icon="pi pi-filter" />
      </div>
      <div class="p-card shadow-none p-3 w-full">
        <DataView :value="mockPresensi">
          <template #list="slotProps">
            <div class="flex flex-column gap-2">
              <div v-for="(item, index) in slotProps.items" :key="index">
                <ListTransaction />
              </div>
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
