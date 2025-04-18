<script setup>
import { useQuery } from "@tanstack/vue-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getCurrentInstance, ref } from "vue";
import { useRoute } from "vue-router";
const { proxy } = getCurrentInstance();

const axios = proxy.axios;
const route = useRoute();

const getLeaveDetailService = async () => {
  const response = await axios.get(`/pegawai/modules/leave/${route.params.id}`);
  return response.data;
};

const {
  data: leaveDetail,
  isLoading: isLoadingLeaveDetail,
  status: leaveDetailStatus,
  error: leaveDetailError,
} = useQuery({
  queryKey: ["detail-leave", route.params.id],
  queryFn: getLeaveDetailService,
});

const getStatusSeverity = (status) => {
  switch (status) {
    case "Approved":
      return "success";
    case "Rejected":
      return "danger";
    default:
      return "warning";
  }
};

</script>

<template>
  <div>
    <div
      class="flex flex-column align-items-center justify-content-between gap-3 mb-4"
      v-if="leaveDetailStatus === 'success'"
    >
      <div class="flex align-items-center gap-2">
        <i class="pi pi-calendar text-primary text-xl"></i>
        <h2 class="text-xl md:text-2xl font-semibold m-0">
          Detail Izin
        </h2>
      </div>
      <Tag
        :severity="getStatusSeverity(leaveDetail.data.status)"
        :value="leaveDetail.data.status"
        class="w-full p-2 text-sm"
      />
    </div>

    <div class="grid" v-if="leaveDetailStatus === 'success'">
      <div class="col-12">
        <Card class="h-full" unstyled>
          <template #title>
            <div
              class="flex align-items-center gap-2 p-3 border-bottom-1 surface-border mb-3"
            >
              <i class="pi pi-calendar text-primary"></i>
              <span>Informasi Izin</span>
            </div>
          </template>
          <template #content>
            <div
              class="flex flex-column gap-3 p-4 surface-card border-1 surface-border border-round"
            >
              <div
                class="flex flex-column md:flex-row md:justify-content-between gap-2 pb-3 border-bottom-1 surface-border"
              >
                <span class="text-600">Tanggal Mulai</span>
                <span class="font-medium">{{
                  format(
                    new Date(leaveDetail.data.start_date),
                    "dd MMMM yyyy",
                    {
                      locale: id,
                    }
                  )
                }}</span>
              </div>
              <div
                class="flex flex-column md:flex-row md:justify-content-between gap-2 pb-3 border-bottom-1 surface-border"
              >
                <span class="text-600">Tanggal Selesai</span>
                <span class="font-medium">{{
                  format(new Date(leaveDetail.data.end_date), "dd MMMM yyyy", {
                    locale: id,
                  })
                }}</span>
              </div>
              <div
                class="flex flex-column md:flex-row md:justify-content-between gap-2 pb-3 border-bottom-1 surface-border"
              >
                <span class="text-600">Durasi</span>
                <span class="font-medium"
                  >{{ leaveDetail.data.duration }} hari</span
                >
              </div>
              <div
                class="flex flex-column md:flex-row md:justify-content-between gap-2"
                :class="{
                  'pb-3 border-bottom-1 surface-border':
                    leaveDetail.data.approved_at,
                }"
              >
                <span class="text-600">Diajukan Tanggal</span>
                <span class="font-medium">
                  {{
                    format(
                      new Date(leaveDetail.data.applied_at),
                      "dd MMMM yyyy",
                      {
                        locale: id,
                      }
                    )
                  }}
                </span>
              </div>
              <div
                class="flex flex-column md:flex-row md:justify-content-between gap-2 pb-3 border-bottom-1 surface-border"
                v-if="leaveDetail.data.approved_at"
              >
                <span class="text-600">Disetujui Tanggal</span>
                <span class="font-medium">
                  {{
                    format(
                      new Date(leaveDetail.data.approved_at),
                      "dd MMMM yyyy",
                      {
                        locale: id,
                      }
                    )
                  }}
                </span>
              </div>
              <div
                class="flex flex-column md:flex-row md:justify-content-between gap-2"
                v-if="leaveDetail.data.approver_name"
              >
                <span class="text-600">Disetujui Oleh</span>
                <span class="font-medium">
                  {{leaveDetail.data.approver_name}}
                </span>
              </div>
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
              <span>Alasan Izin</span>
            </div>
          </template>
          <template #content>
            <div class="surface-card border-1 surface-border border-round p-4">
              <p class="m-0 line-height-3">{{ leaveDetail.data.reason }}</p>
            </div>
          </template>
        </Card>
      </div>

      <!-- Notes -->
      <!-- <div class="col-12" v-if="leaveDetail.data.notes">
        <Card unstyled>
          <template #title>
            <div
              class="flex align-items-center gap-2 p-3 border-bottom-1 surface-border mb-3"
            >
              <i class="pi pi-comments text-primary"></i>
              <span>Catatan</span>
            </div>
          </template>
          <template #content>
            <div class="surface-card border-1 surface-border border-round p-4">
              <p class="m-0 line-height-3">{{ leaveDetail.data.notes }}</p>
            </div>
          </template>
        </Card>
      </div> -->
    </div>

    <div
      class="flex justify-content-center align-items-center"
      v-if="leaveDetailStatus === 'error'"
    >
      <div class="flex flex-column align-items-center gap-2">
        <i class="pi pi-exclamation-triangle text-2xl text-red-500"></i>
        <span class="text-lg font-semibold">Terjadi Kesalahan</span>
        <p class="text-sm text-500" v-if="leaveDetailError.status === 404">
          Data izin tidak ditemukan.
        </p>
        <p class="text-sm text-500" v-else>
          Terjadi kesalahan saat memuat data izin. Silakan coba lagi.
        </p>
      </div>
    </div>

    <div
      v-if="leaveDetailStatus === 'pending'"
      class="flex justify-content-center align-items-center"
    >
      <ProgressSpinner strokeWidth="3" />
    </div>
  </div>
</template>
