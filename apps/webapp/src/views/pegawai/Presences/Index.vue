<script setup>
import { ref } from "vue";

const mockPresensi = ref([
  {
    date: "2022-01-01",
    transactions: [
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
    ],
  },
  {
    date: "2022-01-01",
    transactions: [
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
    ],
  },
]);
</script>

<template>
  <div>
    <AppHeader />
    <div class="flex flex-column mt-8">
      <div
        class="p-3 flex align-items-center gap-3 sticky bg-white shadow-1"
        style="top: 5rem"
      >
        <InputText class="w-full flex-1" placeholder="Cari Presensi" />
        <Button icon="pi pi-filter" />
      </div>
      <div class="p-card shadow-none p-3 w-full">
        <DataView :value="mockPresensi">
          <template #list="slotProps">
            <div class="flex flex-column gap-2">
              <div v-for="(item, index) in slotProps.items" :key="index">
                <div class="flex flex-column">
                  <div
                    class="flex justify-content-between align-items-center px-1"
                  >
                    <h3 class="text-lg">Januari 2022</h3>
                  </div>
                  <div class="px-3 p-card shadow-1 border-round-xl py-2">
                    <ListPresence
                      :items="slotProps.items[index].transactions"
                    />
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
    </div>
  </div>
</template>
