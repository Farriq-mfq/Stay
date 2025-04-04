<script setup>
import { useQuery } from "@tanstack/vue-query";
import { useToast } from "primevue/usetoast";
import { getCurrentInstance, inject } from "vue";
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const auth = inject("auth");
const toast = useToast();

const getLatestService = async () => {
  const response = await axios.get("/pegawai/modules/home/latest/presence");
  return response.data;
};

const { data: latest, isPending: loading } = useQuery({
  queryKey: ["latest-presence"],
  queryFn: getLatestService,
});
</script>

<template>
  <div class="p-card shadow-1 border-round-xl p-3 mx-3 w-full">
    <div class="flex align-items-center justify-content-between border-bottom-1 border-200 pb-2">
      <h4 class="m-0 text-xl">Presensi Terakhir</h4>
      <router-link :to="{ name: 'presences' }" class="text-xs no-underline text-primary">Lihat semua</router-link>
    </div>
    <DataView :value="latest.data" class="mt-2" v-if="!loading">
      <template #list="slotProps">
        <div class="flex flex-column gap-5">
          <ListPresence :items="slotProps.items" />
        </div>
      </template>
      <template #empty>
        <p>Presensi Kosong</p>
      </template>
    </DataView>

    <div class="flex flex-column gap-2" v-if="loading">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" />
    </div>
  </div>
</template>
