<script setup>
import { useInfiniteQuery, useQuery } from "@tanstack/vue-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getCurrentInstance, inject, ref, watch } from "vue";
import { useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const auth = inject("auth");

const route = useRoute();
const getDetailPresence = async () => {
  const response = await axios.get(
    `/pegawai/modules/presence/${route.params.id}`
  );
  return response.data;
};

const { data: presence, isLoading: presenceLoading } = useQuery({
  queryKey: [`${auth.user().id}-detail-presence`, route.params.id],
  queryFn: getDetailPresence,
});

watch(presence, () => {
  console.log(presence);
});
</script>

<template>
  <div>
    <AppHeaderBack title="Detail Presensi" />
    <div
      class="bg-primary h-13rem w-full flex justify-content-center align-items-center flex-column"
      v-if="!presenceLoading"
    >
      <h3 class="m-0 text-3xl mt-3">
        {{ presence.data.session.name }}
      </h3>
      <span class="text-sm mt-2">
        {{ format(new Date(presence.data.createdAt), "dd MMMM yyyy", { locale: id }) }}
      </span>
    </div>
    <div
      class="bg-primary h-13rem w-full flex justify-content-center align-items-center flex-column"
      v-if="presenceLoading"
    >
     <Skeleton height="3rem" width="90%"></Skeleton>
     <Skeleton height="2rem" width="90%" class="mt-3"></Skeleton>
    </div>
    <div
      class="p-card h-auto shadow-1 card-detail-presences border-round-lg p-3"
      v-if="!presenceLoading"
    >
      <div class="flex flex-column gap-3">
        <div
          class="flex justify-content-between align-items-center px-2 info-presences border-bottom-1 surface-border pb-2"
        >
          <span class="m-0 font-semibold text-sm">Waktu Datang</span>
          <span class="text-xs">
            {{
              format(new Date(presence.data.enter_time), "HH:mm", {
                locale: id,
              })
            }}
          </span>
        </div>
        <div
          class="flex justify-content-between align-items-center px-2 info-presences border-bottom-1 surface-border pb-2"
        >
          <span class="m-0 font-semibold text-sm">Waktu Pulang</span>
          <span class="text-xs">
            {{
              presence.data.exit_time
                ? format(new Date(presence.data.exit_time), "HH:mm", {
                    locale: id,
                  })
                : "-"
            }}
          </span>
        </div>
        <div
          class="flex justify-content-between align-items-center px-2 info-presences border-bottom-1 surface-border pb-2"
        >
          <span class="m-0 font-semibold text-sm">Lokasi</span>
          <span class="text-xs">
            {{ presence.data.gateway ? presence.data.gateway.location : "-" }}
          </span>
        </div>
        <div
          class="flex justify-content-between align-items-center px-2 info-presences border-bottom-1 surface-border pb-2"
        >
          <span class="m-0 font-semibold text-sm">Metode Presensi</span>
          <span class="text-xs">
            {{ presence.data.method }}
          </span>
        </div>
      </div>
      <div class="flex flex-column gap-3" v-if="presence.data.meeting_session">
        <Divider class="m-0" />
        <h3 class="m-0 text-sm mb-1">Sesi Rapat</h3>
        <div
          class="flex justify-content-between align-items-center px-2 info-presences border-bottom-1 surface-border pb-2"
        >
          <span class="m-0 font-semibold text-sm">Nama</span>
          <span class="text-xs">
            {{ presence.data.meeting_session.name }}
          </span>
        </div>
        <div
          class="flex justify-content-between align-items-center px-2 info-presences border-bottom-1 surface-border pb-2"
        >
          <span class="m-0 font-semibold text-sm">Tanggal</span>
          <span class="text-xs">
            {{
              format(
                new Date(presence.data.meeting_session.date),
                "dd MMMM yyyy",
                { locale: id }
              )
            }}
          </span>
        </div>
      </div>
      <div class="flex flex-column gap-3 mt-3">
        <i class="text-xs text-center">SMK Negeri 1 Pekalongan</i>
      </div>
    </div>
    <div class="flex flex-column gap-3 mt-4" v-if="presenceLoading">
      <ProgressSpinner strokeWidth="3" />
    </div>
  </div>
</template>

<style scoped>
.card-detail-presences {
  margin: -3rem 1rem 0;
  z-index: 99 !important;
}
.info-presences:last-child {
  border-bottom: none !important;
}
</style>
