<script setup>
import { getCurrentInstance } from "vue";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useQuery } from "@tanstack/vue-query";
const { proxy } = getCurrentInstance();
const axios = proxy.axios;

const getPresnces = async () => {
  return await axios.get("/pegawai/modules/presence");
};

const { data: presences, isPending: loading } = useQuery({
  queryKey: ["presences"],
  queryFn: getPresnces,
});
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
        <DataView :value="presences.data.data" v-if="!loading">
          <template #list="slotProps">
            <div class="flex flex-column gap-2">
              <div v-for="(item, index) in slotProps.items[0]" :key="index">
                <div class="flex flex-column">
                  <div
                    class="flex justify-content-between align-items-center px-1"
                  >
                    <h3 class="text-lg">
                      {{
                        format(item.date, "dd MMMM yyyy", { locale: id })
                      }}
                    </h3>
                  </div>
                  <div class="px-3 p-card shadow-1 border-round-xl py-2">
                    <ListPresence :items="item.presences" />
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #empty>
            <p>Presensi Kosong</p>
          </template>
        </DataView>
        <div class="flex flex-column gap-4" v-else>
          <Skeleton height="10rem"></Skeleton>
          <Skeleton height="10rem"></Skeleton>
          <Skeleton height="10rem"></Skeleton>
        </div>
      </div>
    </div>
  </div>
</template>
