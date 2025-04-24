<script setup>
import { useInfiniteQuery } from "@tanstack/vue-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getCurrentInstance, ref, watch } from "vue";

const { proxy } = getCurrentInstance();
const items = ref([]);

const axios = proxy.axios;

const getAllActivityHistoryService = async ({ pageParam }) => {
  const queries = {
    ...(pageParam && { after: parseInt(pageParam) }),
    // ...(filters.value && { search: filters.value }),
  };
  const params = new URLSearchParams(queries);

  const response = await axios.get(`/pegawai/modules/activity?${params}`);
  return response.data;
};

const {
  data: activityHistoryData,
  isLoading: isLoadingActivityHistory,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch: refetchActivityHistory,
} = useInfiniteQuery({
  queryKey: ["getAllActivityHistoryService"],
  queryFn: getAllActivityHistoryService,
  getNextPageParam: (lastPage) => {
    return lastPage.data[1].endCursor;
  },
});

watch(
  () => activityHistoryData.value,
  (val) => {
    if (val) {
      const itemMap = new Map();
      val.pages.forEach((page) => {
        page.data[0].forEach((item) => {
          if (!itemMap.has(item.id)) {
            itemMap.set(item.id, item);
          }
        });
      });
      items.value = Array.from(itemMap.values());
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <AppHeaderBack title="Notifikasi" />
    <Card unstyled style="margin-top: 9rem">
      <template #content>
        <div class="flex flex-column gap-3" v-if="items.length > 0">
          <router-link
            :to="{
              name: 'feature-journal-activity-detail',
              params: { id: item.id },
            }"
            v-for="item in items"
            :key="item.id"
            class="border-1 surface-border p-3 border-round-xl cursor-pointer no-underline surface-card"
          >
            <div
              class="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3"
            >
              <div class="flex align-items-center gap-3">
                <div
                  class="w-2rem h-2rem flex align-items-center justify-content-center border-circle"
                >
                  <i class="pi pi-calendar text-primary"></i>
                </div>
                <div class="flex flex-column gap-1">
                  <span class="font-semibold text-base text-900">{{
                    format(new Date(item.date), "dd MMMM yyyy", {
                      locale: id,
                    })
                  }}</span>
                  <span
                    class="text-600 text-sm text-overflow-ellipsis overflow-hidden white-space-nowrap"
                    :title="item.description || 'No description available'"
                    style="max-width: 200px; display: inline-block"
                  >
                    {{ item.description || "No description available" }}
                  </span>
                </div>
              </div>
            </div>
          </router-link>
          <Button
            label="Muat Lebih Banyak"
            @click="fetchNextPage"
            v-if="hasNextPage"
            :loading="isFetchingNextPage"
            outlined
            size="small"
          />
        </div>
        <div
          v-else
          class="flex flex-column align-items-center justify-content-center gap-3"
        >
          <i class="pi pi-bell text-4xl text-primary"></i>
          <span class="text-600">Belum ada notifikasi</span>
        </div>
      </template>
    </Card>
  </div>
</template>
