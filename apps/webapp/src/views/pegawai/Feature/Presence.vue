<script setup>
import Clock from "@/components/Clock.vue";
import { getDetailLocation, isWithinRange } from "@/utils/location.js";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { format, isAfter } from "date-fns";
import { id } from "date-fns/locale";
import Button from "primevue/button";
import Message from "primevue/message";
import { useToast } from "primevue/usetoast";
import { computed, ref, watch, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const currentDate = new Date();
const accurate = ref(false);
const locationLoading = ref(false);
const locationMessage = ref("");
const refreshLocation = ref(false);
const currentLocation = ref(null);
const axios = proxy.axios;
const toast = useToast();
const errorMessage = ref("");
const showLocation = ref(true);

const formattedCurrentDate = computed(() =>
  format(currentDate, "EEEE, dd MMMM yyyy", { locale: id })
);

const getLocationService = async () => {
  const response = await axios.get("/pegawai/modules/presence/location");
  return response.data;
};

const {
  data: sessionLocation,
  isLoading,
  refetch,
  status,
} = useQuery({
  queryKey: ["getLocationService"],
  queryFn: getLocationService,
});

const getCurrentLocation = () => {
  if (
    sessionLocation.value &&
    sessionLocation.value.data &&
    sessionLocation.value.data.session
  ) {
    if (sessionLocation.value.data.session.allow_twice) {
      if (
        !(
          sessionLocation.value.data.presence &&
          sessionLocation.value.data.presence.enter_time &&
          sessionLocation.value.data.presence.exit_time
        )
      ) {
        showLocation.value = true;
      } else {
        showLocation.value = false;
      }
    } else {
      if (!sessionLocation.value.data.presence) {
        showLocation.value = true;
      } else {
        showLocation.value = false;
      }
    }
  }
};

const loadLocation = () => {
  locationLoading.value = true;
  accurate.value = false;
  if (!navigator.geolocation) {
    locationMessage.value = "Fitur Lokasi tidak didukung";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      refreshLocation.value = false;

      try {
        const detailLocation = await getDetailLocation(latitude, longitude);
        currentLocation.value = {
          latitude: detailLocation.lat,
          longitude: detailLocation.lon,
          ...detailLocation,
        };
      } catch (e) {
        currentLocation.value = {
          latitude,
          longitude,
        };
      }
      locationLoading.value = false;
      locationMessage.value = null;
    },
    async (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          locationMessage.value = "Akses lokasi ditolak";
          refreshLocation.value = true;
          break;
        case error.POSITION_UNAVAILABLE:
          locationMessage.value = "Informasi lokasi tidak tersedia";
          refreshLocation.value = true;
          break;
        case error.TIMEOUT:
          locationMessage.value = "Permintaan lokasi timeout";
          refreshLocation.value = true;
          break;
        default:
          locationMessage.value = "Terjadi kesalahan saat mengambil lokasi";
          refreshLocation.value = true;
          break;
      }

      locationLoading.value = false;
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
    }
  );
};

watch(
  [() => currentLocation.value, () => sessionLocation.value],
  ([location, session]) => {
    // load location
    if (session && session.data) {
      getCurrentLocation();
    }
    // compare location
    if (location && session && session.data) {
      const compareSession = session.data.session.presence_sessions_by_location;
      if (
        isWithinRange(
          compareSession,
          currentLocation.value,
          compareSession.distance
        )
      ) {
        accurate.value = true;
      }
    }
  },
  { immediate: true }
);

const handlerRefreshLocation = () => {
  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    if (result.state === "granted") {
      loadLocation();
    } else if (result.state === "denied") {
      locationMessage.value = "Mohon Aktifkan Lokasi";
    }
  });
};
const now = format(Date.now(), "yyyy-MM-dd");

const createPresenceService = async (data) => {
  const response = await axios.post("/pegawai/modules/presence/location", {
    latitude: +data.latitude,
    longitude: +data.longitude,
  });
  return response.data;
};
const { mutate: createPresence, isPending } = useMutation({
  mutationKey: ["createPresenceService"],
  mutationFn: createPresenceService,
});
const handleSubmit = async () => {
  errorMessage.value = "";
  await createPresence(currentLocation.value, {
    onSuccess: () => {
      toast.add({
        summary: "Berhasil",
        detail: "Presensi Tercatat",
        severity: "success",
        life: 2000,
      });
      getCurrentLocation();
      refetch();
      accurate.value = false;
      currentLocation.value = null;
    },
    onError: (err) => {
      const errResponse = err.response;
      if (errResponse.status === 400) {
        if (errResponse.data.message) {
          errorMessage.value = errResponse.data.message;
        } else {
          toast.add({
            summary: "Terjadi Kendala",
            detail: "Sepertinya ada yang perlu dicek lagi",
            severity: "error",
            life: 2000,
          });
        }
      } else {
        toast.add({
          summary: "Terjadi Kendala",
          detail: "Sepertinya ada yang perlu dicek lagi",
          severity: "error",
          life: 2000,
        });
      }
    },
  });
};
</script>

<template>
  <div>
    <AppHeaderBack title="Kehadiran" />
    <div
      class="container mx-auto px-4 py-6 mt-6 flex flex-column gap-4 align-items-center justify-content-center"
      style="min-height: 60vh"
      v-if="status === 'error'"
    >
      <div
        class="p-6 border-round flex flex-column align-items-center gap-4"
        style="max-width: 400px"
      >
        <div class="bg-red-100 border-circle p-4">
          <i class="pi pi-exclamation-triangle text-red-500 text-4xl"></i>
        </div>
        <div class="text-center">
          <h2 class="text-2xl font-semibold text-900 m-0">
            Service Unavailable
          </h2>
          <p class="text-600 mt-2">
            Maaf, layanan sedang tidak tersedia. Mohon hubungi administrator
            untuk informasi lebih lanjut.
          </p>
        </div>
        <Button
          severity="danger"
          outlined
          class="p-3"
          @click="$router.push('/')"
        >
          <i class="pi pi-arrow-left mr-2"></i>
          Kembali ke Dashboard
        </Button>
      </div>
    </div>
    <div class="container mx-auto px-4 py-6 mt-6" v-if="status != 'error'">
      <div class="surface-card border-1 surface-border border-round p-4 mb-4">
        <div class="text-center">
          <h2 class="text-2xl font-semibold text-900">
            {{ formattedCurrentDate }}
          </h2>
          <Clock />
          <div v-if="!isLoading">
            <p class="text-sm text-color-secondary">
              {{ sessionLocation.data.session.name }}
            </p>
            <div
              class="flex justify-content-center align-items-center flex-column gap-3 mt-3"
            >
              <div
                class="flex align-items-center gap-2 surface-card border-1 surface-border border-round p-2 px-3"
              >
                <i class="pi pi-sign-in text-green-500"></i>
                <span class="text-sm">
                  <span class="font-medium">Jam Datang : </span>
                  <span class="text-primary ml-1">{{
                    sessionLocation.data.session.start_time
                  }}</span>
                </span>
              </div>
              <div
                v-if="sessionLocation.data.session.allow_twice"
                class="flex align-items-center gap-2 surface-card border-1 surface-border border-round p-2 px-3"
              >
                <i class="pi pi-sign-out text-red-500"></i>
                <span class="text-sm">
                  <span class="font-medium">Jam Pulang : </span>
                  <span class="text-primary ml-1">{{
                    sessionLocation.data.session.end_time
                  }}</span>
                </span>
              </div>
            </div>
          </div>
          <div v-if="isLoading">
            <Skeleton class="h-2rem mt-2" />
            <Skeleton class="h-2rem mt-2" />
            <Skeleton class="h-2rem mt-2" />
          </div>
        </div>
      </div>
      <Message v-if="errorMessage" severity="error">
        {{ errorMessage }}
      </Message>
      <div
        class="surface-card border-round pb-4 pt-2 px-4 mb-4"
        :class="{
          'surface-border border-1': !accurate,
          'border-green-500 border-2': accurate,
        }"
        v-if="showLocation && !isLoading"
      >
        <div class="flex flex-column">
          <h3
            class="text-lg font-medium text-900 text-center"
            v-if="locationLoading || locationMessage"
          >
            {{
              locationLoading
                ? "Sedang Mencari Lokasi Anda..."
                : locationMessage
                  ? locationMessage
                  : ""
            }}
          </h3>
          <div
            v-if="currentLocation && !locationLoading"
            class="text-sm text-600 mt-3"
          >
            <div class="flex flex-column gap-2">
              <div class="flex align-items-center gap-2 mb-2">
                <i class="pi pi-map-marker text-primary"></i>
                <span class="font-medium">Koordinat: </span>
                <span
                  :class="{
                    'text-green-500': accurate,
                    'text-red-500': !accurate,
                  }"
                  >{{ accurate ? "Sesuai" : "Belum Sesuai" }}</span
                >
              </div>
              <div class="border-1 surface-border border-round p-3">
                <div class="flex flex-column gap-2">
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-globe text-primary"></i>
                    <span>Latitude: {{ currentLocation.latitude }}</span>
                  </div>
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-globe text-primary"></i>
                    <span>Longitude: {{ currentLocation.longitude }}</span>
                  </div>
                </div>
              </div>
              <div
                v-if="currentLocation && currentLocation.display_name"
                class="border-1 surface-border border-round p-3"
              >
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-info-circle text-primary"></i>
                  <span>{{ currentLocation.display_name }}</span>
                </div>
              </div>
            </div>
          </div>
          <i
            class="pi pi-map-marker text-primary text-center text-5xl bounce-animation mt-3"
            v-if="locationLoading"
          ></i>
          <Button
            outlined
            class="mt-4 p-3"
            v-if="refreshLocation && !locationLoading"
            @click="handlerRefreshLocation"
            label="Refresh"
          />
          <Button
            class="mt-4 p-3"
            @click="loadLocation"
            v-if="!refreshLocation"
            :loading="locationLoading"
            icon="pi pi-map-marker"
            :label="
              locationLoading
                ? 'Mencari...'
                : currentLocation
                  ? 'Verifikasi Ulang Lokasi Anda ?'
                  : 'Verifikasi Lokasi Anda'
            "
          />
        </div>
      </div>

      <div
        class="fixed bottom-0 left-0 right-0 p-3 surface-ground border-1 surface-border shadow-lg mx-auto w-full"
        style="max-width: 414px"
        v-if="
          showLocation &&
          accurate &&
          sessionLocation &&
          sessionLocation.data &&
          !sessionLocation.data.presence
        "
      >
        <Button
          :disabled="locationLoading || isPending"
          @click.prevent="handleSubmit"
          class="w-full p-3 flex justify-content-center align-items-center gap-2"
        >
          <i class="pi pi-sign-in"></i> <span> Datang </span>
        </Button>
      </div>
      <div
        class="fixed bottom-0 left-0 right-0 p-3 surface-ground border-1 surface-border shadow-lg mx-auto w-full"
        style="max-width: 414px"
        v-if="
          showLocation &&
          accurate &&
          sessionLocation &&
          sessionLocation.data &&
          sessionLocation.data.session.allow_twice &&
          sessionLocation.data.presence &&
          sessionLocation.data.presence.enter_time &&
          !sessionLocation.data.presence.exit_time
        "
      >
        <Button
          :disabled="locationLoading || isPending"
          @click.prevent="handleSubmit"
          class="w-full p-3 flex justify-content-center align-items-center gap-2"
        >
          <i class="pi pi-sign-out"></i>
          <span> Pulang </span>
        </Button>
      </div>

      <div
        class="mb-8"
        v-if="
          sessionLocation &&
          sessionLocation.data &&
          sessionLocation.data.presence
        "
      >
        <h3
          class="text-lg font-medium text-900 mb-4 flex align-items-center gap-2 border-bottom-1 surface-border pb-3"
        >
          <i class="pi pi-clock mr-1 text-primary" /> Detail Kehadiran Anda Hari
          Ini
        </h3>
        <div class="flex flex-column gap-3">
          <div
            class="flex flex-column gap-3 justify-content-between p-3 border-1 surface-border surface-card border-round"
          >
            <div class="flex align-items-center gap-3">
              <div class="bg-green-500 border-round p-2">
                <i class="pi pi-sign-in text-white"></i>
              </div>
              <div class="flex gap-2 flex-column">
                <p class="font-medium text-900 m-0">Datang</p>
                <p class="text-sm text-600 m-0">
                  {{
                    format(
                      new Date(sessionLocation.data.presence.enter_time),
                      "HH:mm:ss - dd MMM yyyy",
                      {
                        locale: id,
                      }
                    )
                  }}
                </p>
                <div class="flex align-items-center gap-1">
                  <i
                    :class="[
                      isAfter(
                        new Date(sessionLocation.data.presence.enter_time),
                        format(
                          `${now} ${sessionLocation.data.session.start_time}`,
                          'yyyy-MM-dd HH:mm:ss'
                        )
                      )
                        ? 'pi pi-times-circle text-red-500'
                        : 'pi pi-check-circle text-green-500',
                    ]"
                  ></i>
                  <span
                    class="text-sm font-medium"
                    :class="{
                      'text-red-500': isAfter(
                        new Date(sessionLocation.data.presence.enter_time),
                        format(
                          `${now} ${sessionLocation.data.session.start_time}`,
                          'yyyy-MM-dd HH:mm:ss'
                        )
                      ),
                      'text-green-500': !isAfter(
                        new Date(sessionLocation.data.presence.enter_time),
                        format(
                          `${now} ${sessionLocation.data.session.start_time}`,
                          'yyyy-MM-dd HH:mm:ss'
                        )
                      ),
                    }"
                  >
                    {{
                      isAfter(
                        new Date(sessionLocation.data.presence.enter_time),
                        format(
                          `${now} ${sessionLocation.data.session.start_time}`,
                          "yyyy-MM-dd HH: mm: ss"
                        )
                      )
                        ? "Terlambat"
                        : "Tepat Waktu"
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex align-items-center justify-content-between p-3 border-1 surface-border border-round"
            v-if="sessionLocation.data.presence.exit_time"
          >
            <div class="flex align-items-center gap-3">
              <div class="bg-red-500 border-round p-2">
                <i class="pi pi-sign-out text-white"></i>
              </div>
              <div class="flex flex-column gap-2">
                <p class="font-medium text-900 m-0">Pulang</p>
                <p class="text-sm text-600 m-0">
                  {{
                    format(
                      new Date(sessionLocation.data.presence.exit_time),
                      "HH:mm:ss - dd MMM yyyy",
                      {
                        locale: id,
                      }
                    )
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-8" v-else>
        <div class="text-center my-4">
          <i class="pi pi-folder-open text-primary mr-2"></i>
          <span class="text-sm">Tidak ada Riwayat Kehadiran Hari ini</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.bounce-animation {
  animation: bounce 1s infinite;
}
</style>
