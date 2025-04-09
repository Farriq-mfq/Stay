<script setup>
import { useQuery } from "@tanstack/vue-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getCurrentInstance, inject } from "vue";
import { useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const auth = inject("auth");

const route = useRoute();
const getDetailPresence = async () => {
  const response = await axios.get(
    `/siswa/modules/presence/${route.params.id}`
  );
  return response.data;
};

const { data: presence, isLoading: presenceLoading } = useQuery({
  queryKey: [`${auth.user().id}-detail-presence`, route.params.id],
  queryFn: getDetailPresence,
  enabled: !!route.params.id
});
</script>

<template>
  <div class="min-h-screen bg-surface-ground">
    <AppHeaderBack title="Detail Presensi" />

    <!-- Header Section -->
    <div class="relative" v-if="!presenceLoading">
      <div class="bg-primary h-16rem w-full flex justify-content-center align-items-center flex-column">
        <div class="absolute top-0 left-0 w-full h-full bg-primary-800 opacity-20"></div>
        <div class="relative text-center">
          <h2 class="m-0 text-2xl font-bold text-white">
            {{ presence?.data?.session?.name }}
          </h2>
          <span class="text-white-alpha-90 mt-2 block">
            {{
              format(new Date(presence?.data?.createdAt), "dd MMMM yyyy", {
                locale: id,
              })
            }}
          </span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 absolute left-0 right-0" style="margin-top: -4rem;" v-if="!presenceLoading">
      <!-- Status Card -->
      <div class="surface-card p-4 border-round-xl shadow-2 mb-4">
        <div class="flex align-items-center gap-3 mb-3">
          <i class="pi pi-check-circle text-2xl text-green-500"></i>
          <div>
            <h3 class="m-0 text-lg font-semibold">Status Presensi</h3>
            <p class="m-0 text-sm text-500">Detail kehadiran Anda</p>
          </div>
        </div>

        <div class="grid">
          <div :class="{
            'col-6': presence?.data?.session?.allow_twice,
            'col-12': !presence?.data?.session?.allow_twice
          }">
            <div class="text-center p-3 border-round-lg bg-green-300">
              <i class="pi pi-sign-in text-xl text-green-700 mb-2"></i>
              <div class="text-sm font-medium">Masuk</div>
              <div class="text-sm font-bold">
                {{
                  format(new Date(presence?.data?.enter_time), "HH:mm", {
                    locale: id,
                  })
                }}
              </div>
            </div>
          </div>
          <div class="col-6" v-if="presence?.data?.session?.allow_twice">
            <div class="text-center p-3 border-round-lg bg-red-300">
              <i class="pi pi-sign-out text-xl"
                :class="presence?.data?.exit_time ? 'text-red-700' : 'text-yellow-700'"></i>
              <div class="text-sm font-medium">Keluar</div>
              <div class="text-sm font-bold">
                {{
                  presence?.data?.exit_time
                    ? format(new Date(presence?.data?.exit_time), "HH:mm", {
                      locale: id,
                    })
                    : "Belum Presensi"
                }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Card -->
      <div class="surface-card p-4 border-round-xl shadow-2">
        <div class="flex align-items-center gap-3 mb-3">
          <i class="pi pi-info-circle text-2xl text-primary"></i>
          <div>
            <h3 class="m-0 text-lg font-semibold">Informasi Detail</h3>
            <p class="m-0 text-sm text-500">Data lengkap presensi</p>
          </div>
        </div>

        <div class="flex flex-column gap-3">
          <div class="flex justify-content-between align-items-center p-3 border-round-lg surface-hover">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-clock text-primary"></i>
              <span class="font-medium">Presensi 2x</span>
            </div>
            <span class="text-sm" :class="presence?.data?.session?.allow_twice ? 'text-green-500' : 'text-red-500'">
              {{ presence?.data?.session?.allow_twice ? "Diizinkan" : "Tidak Diizinkan" }}
            </span>
          </div>

          <div class="flex justify-content-between align-items-center p-3 border-round-lg surface-hover">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-map-marker text-primary"></i>
              <span class="font-medium">Lokasi</span>
            </div>
            <span class="text-sm">
              {{ presence?.data?.gateway ? presence?.data?.gateway.location : "-" }}
            </span>
          </div>

          <div class="flex justify-content-between align-items-center p-3 border-round-lg surface-hover">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-mobile text-primary"></i>
              <span class="font-medium">Metode Presensi</span>
            </div>
            <span class="text-sm">
              {{ presence?.data?.method }}
            </span>
          </div>
        </div>

        <div class="mt-4 pt-3 border-top-1 surface-border">
          <div class="flex align-items-center justify-content-center gap-2 text-sm text-500">
            <i class="pi pi-building"></i>
            <span>SMK Negeri 1 Pekalongan</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="presenceLoading" class="flex justify-content-center align-items-center min-h-screen">
      <ProgressSpinner strokeWidth="3" />
    </div>
  </div>
</template>

<style scoped>
.surface-hover {
  transition: background-color 0.2s;
}

.surface-hover:hover {
  background-color: var(--surface-hover);
}
</style>
