<script setup>
import { useQuery } from "@tanstack/vue-query";
import { useToast } from "primevue/usetoast";
import { getCurrentInstance, inject } from "vue";
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const auth = inject("auth");
const toast = useToast();

const getLatestService = async () => {
  const response = await axios.get("/siswa/modules/home/latest/presence");
  return response.data;
};

const { data: latest, isPending: loading } = useQuery({
  queryKey: ["latest-presence"],
  queryFn: getLatestService,
});
</script>

<template>
  <div class="p-card shadow-1 border-round-xl p-3 mx-2 md:mx-3">
    <div
      class="flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between border-bottom-1 border-200 pb-2">
      <div class="flex align-items-center gap-2">
        <i class="pi pi-calendar text-primary text-xl"></i>
        <h4 class="m-0 text-lg md:text-xl font-semibold">Presensi Terakhir</h4>
      </div>
      <router-link :to="{ name: 'presences' }"
        class="text-xs no-underline text-primary mt-2 md:mt-0 hover:text-primary-600 flex align-items-center gap-1">
        Lihat semua
        <i class="pi pi-arrow-right text-xs"></i>
      </router-link>
    </div>
    <DataView :value="latest.data" class="mt-3" v-if="!loading" unstyled>
      <template #list="slotProps">
        <ListPresence :items="slotProps.items" />
      </template>
      <template #empty>
        <div class="flex flex-column align-items-center justify-content-center py-5">
          <i class="pi pi-calendar-times text-4xl text-400 mb-2"></i>
          <p class="text-500 text-center">Belum ada data presensi</p>
        </div>
      </template>
    </DataView>

    <div class="flex flex-column align-items-center justify-content-center py-5" v-if="loading">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" fill="transparent" class="text-primary" />
      <span class="text-500 mt-2">Memuat data...</span>
    </div>
  </div>
</template>