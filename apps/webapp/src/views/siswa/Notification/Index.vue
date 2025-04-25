<script setup>
import { useInfiniteQuery } from "@tanstack/vue-query";
import { getCurrentInstance, ref, watch } from "vue";

const { proxy } = getCurrentInstance();
const items = ref([]);

const axios = proxy.axios;

const getAllActivityNotificationService = async ({ pageParam }) => {
  const queries = {
    ...(pageParam && { after: parseInt(pageParam) }),
    // ...(filters.value && { search: filters.value }),
  };
  const params = new URLSearchParams(queries);

  const response = await axios.get(`/siswa/modules/notification?${params}`);
  return response.data;
};

const {
  data: notificationData,
  isLoading: isLoadingActivityNotification,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch: refetchActivityNotification,
} = useInfiniteQuery({
  queryKey: ["getAllActivityNotificationService"],
  queryFn: getAllActivityNotificationService,
  getNextPageParam: (lastPage) => {
    return lastPage.data[1].endCursor;
  },
});

watch(
  () => notificationData.value,
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
    <div style="margin-top: 5rem">
      <Card unstyled class="p-3">
        <template #content>
          <div class="flex flex-column gap-3" v-if="items.length > 0">
            <router-link
              :to="{
                name: 'dashboard',
              }"
              v-for="item in items"
              :key="item.id"
              class="border-1 surface-border p-3 border-round-xl cursor-pointer no-underline"
              :class="{
                'surface-card': item.is_read,
                'surface-hover': !item.is_read,
              }"
            >
              <div
                class="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3"
              >
                <div class="flex align-items-center gap-3">
                  <div
                    class="w-2rem h-2rem flex align-items-center justify-content-center border-circle"
                  >
                    <i class="pi pi-bell text-primary"></i>
                  </div>
                  <div class="flex flex-column gap-1">
                    <span class="font-semibold text-base text-900">
                      {{ item.title }}
                    </span>
                    <span
                      class="text-600 text-sm text-overflow-ellipsis overflow-hidden white-space-nowrap"
                      style="max-width: 200px; display: inline-block"
                    >
                      {{ item.body || "-" }}
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
  </div>
</template>
