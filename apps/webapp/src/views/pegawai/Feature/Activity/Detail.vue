<script setup>
import { useQuery } from "@tanstack/vue-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getCurrentInstance, ref } from "vue";
import { useRoute } from "vue-router";
const { proxy } = getCurrentInstance();

const axios = proxy.axios;
const route = useRoute();

const getActivityDetailService = async () => {
  const response = await axios.get(
    `/pegawai/modules/activity/${route.params.id}`
  );
  return response.data;
};

const {
  data: activityDetail,
  isLoading: isLoadingActivityDetail,
  status: activityDetailStatus,
  error: activityDetailError,
} = useQuery({
  queryKey: ["detail-activity", route.params.id],
  queryFn: getActivityDetailService,
});
</script>

<template>
  <div>
    <div
      class="flex flex-column align-items-center justify-content-between gap-3 mb-4"
      v-if="activityDetailStatus === 'success'"
    >
      <div class="flex align-items-center gap-2">
        <h2 class="text-xl md:text-2xl font-semibold m-0">
          Detail Jurnal Kegiatan
        </h2>
      </div>
    </div>

    <div class="grid" v-if="activityDetailStatus === 'success'">
      <div class="col-12">
        <Card unstyled>
          <template #title>
            <div
              class="flex align-items-center gap-2 p-3 border-bottom-1 surface-border mb-3"
            >
              <i class="pi pi-info-circle text-primary"></i>
              <span class="font-semibold
              ">Tanggal</span>
            </div>
          </template>
          <template #content>
            <div class="surface-card border-1 surface-border border-round p-4">
              <p class="m-0 line-height-3">
                {{
                  format(new Date(activityDetail.data.date), "dd MMMM yyyy", {
                    locale: id,
                  })
                }}
              </p>
            </div>
          </template>
        </Card>
      </div>
      <div class="col-12">
        <Card unstyled>
          <template #title>
            <div
              class="flex align-items-center gap-2 p-3 border-bottom-1 surface-border mb-3"
            >
              <i class="pi pi-info-circle text-primary"></i>
              <span class="font-semibold">Uraian Kegiatan</span>
            </div>
          </template>
          <template #content>
            <div class="surface-card border-1 surface-border border-round p-4">
              <p class="m-0 line-height-3">
                {{ activityDetail.data.description }}
              </p>
            </div>
          </template>
        </Card>
      </div>

    </div>

    <div
      class="flex justify-content-center align-items-center"
      v-if="activityDetailStatus === 'error'"
    >
      <div class="flex flex-column align-items-center gap-2">
        <i class="pi pi-exclamation-triangle text-2xl text-red-500"></i>
        <span class="text-lg font-semibold">Terjadi Kesalahan</span>
        <p class="text-sm text-500" v-if="activityDetailError.status === 404">
          Data izin tidak ditemukan.
        </p>
        <p class="text-sm text-500" v-else>
          Terjadi kesalahan saat memuat data izin. Silakan coba lagi.
        </p>
      </div>
    </div>

    <div
      v-if="activityDetailStatus === 'pending'"
      class="flex justify-content-center align-items-center"
    >
      <ProgressSpinner strokeWidth="3" />
    </div>
  </div>
</template>
