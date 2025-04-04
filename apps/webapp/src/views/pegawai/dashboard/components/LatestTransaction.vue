<script setup>
import { useQuery } from "@tanstack/vue-query";
import { useToast } from "primevue/usetoast";
import { getCurrentInstance, inject } from "vue";
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const auth = inject("auth");
const toast = useToast();

const getLatestService = async () => {
  const response = await axios.get("/pegawai/modules/home/latest/transaction");
  return response.data;
};

const { data: latest, isPending: loading } = useQuery({
  queryKey: ["latest-transaction"],
  queryFn: getLatestService,
});


</script>

<template>
  <div class="p-card shadow-1 border-round-xl p-3 mx-3 w-full">
    <div
      class="flex align-items-center justify-content-between border-bottom-1 border-200 pb-3"
    >
      <h4 class="m-0 text-xl">Transaksi Terakhir</h4>
      <router-link
        :to="{ name: 'transactions' }"
        class="text-xs no-underline text-primary"
        >Lihat semua</router-link
      >
    </div>
    <DataView :value="latest.data" class="mt-2" v-if="!loading">
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
</template>
