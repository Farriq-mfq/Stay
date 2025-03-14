<script setup>
import { useInfiniteQuery } from "@tanstack/vue-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getCurrentInstance, inject, ref, watch } from "vue";
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const auth = inject("auth");
const filter = ref(null);
const getPresences = async ({ pageParam }) => {
  const queries = {
    ...(pageParam && { after: parseInt(pageParam) }),
    ...(filter.value && { search: filter.value }),
  };

  const params = new URLSearchParams(queries);

  const response = await axios.get(`/siswa/modules/presence?${params}`);
  return response.data;
};

const {
  data: presences,
  isLoading: loading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
} = useInfiniteQuery({
  queryKey: [`${auth.user().id}-presences`, filter.value],
  queryFn: getPresences,

  getNextPageParam: (lastPage) => {
    return lastPage.data[1].endCursor;
  },
});
const items = ref([]);

watch(
  () => presences.value,
  (val) => {
    if (val) {
      const itemMap = new Map();
      val.pages.forEach((page) => {
        page.data[0].forEach((item) => {
          if (
            itemMap.has(item.date) &&
            itemMap.get(item.date) &&
            item.date == itemMap.get(item.date).date
          ) {
            itemMap.set(item.date, {
              date: item.date,
              presences: [
                ...itemMap.get(item.date).presences,
                item.presences[0],
              ],
            });
          } else {
            itemMap.set(item.date, item);
          }
        });
      });
      items.value = Array.from(itemMap.values());
    }
  },
  { immediate: true }
);

const handleSearch = () => {
  refetch();
};

watch(filter, (val) => {
  if (val == null || val == "") {
    refetch();
  }
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
        <InputText
          class="w-full flex-1"
          v-model="filter"
          placeholder="Cari Presensi"
        />
        <Button
          :disabled="filter == null || filter == '' || loading"
          :loading="loading"
          @click.prevent="handleSearch"
          icon="pi pi-search"
        />
      </div>
      <div class="p-card shadow-none p-3 w-full">
        <DataView :value="items" v-if="!loading">
          <template #list="slotProps">
            <div class="flex flex-column gap-2">
              <div v-for="(item, index) in slotProps.items" :key="index">
                <div class="flex flex-column">
                  <div
                    class="flex justify-content-between align-items-center px-1"
                  >
                    <h3 class="text-lg">
                      {{ format(item.date, "dd MMMM yyyy", { locale: id }) }}
                    </h3>
                  </div>
                  <div class="px-3 p-card shadow-none border-1 surface-border border-round-lg py-2">
                    <ListPresence :items="item.presences" />
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #empty>
            <div class="flex gap-2 align-items-center text-center justify-content-center py-5">
              <i class="pi pi-folder-open text-2xl"></i>
              <span class="m-0">Presensi Kosong</span>
            </div>
          </template>
        </DataView>
        <div class="flex flex-column gap-4" v-else>
          <Skeleton height="10rem"></Skeleton>
          <Skeleton height="10rem"></Skeleton>
          <Skeleton height="10rem"></Skeleton>
        </div>
        <Button
          @click="fetchNextPage"
          text
          size="small"
          :loading="isFetchingNextPage"
          :disabled="isFetchingNextPage"
          v-if="hasNextPage"
          class="w-full mt-4"
          :label="isFetchingNextPage ? 'Memuat...' : 'Tampilkan lebih banyak'"
        />
      </div>
    </div>
  </div>
</template>
