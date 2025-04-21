<script setup>
import { useQuery } from "@tanstack/vue-query";
import ProgressSpinner from "primevue/progressspinner";
import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const axios = proxy.axios;

const getFeaturesService = async () => {
  const response = await axios.get("/pegawai/modules/features");
  return response.data;
};

const { data: features, status: featureStatus } = useQuery({
  queryKey: ["getFeaturesService"],
  queryFn: getFeaturesService,
});
</script>
<template>
  <div>
    <div class="grid relative" v-if="featureStatus === 'success'">
      <!-- <Unavailable /> -->
      <router-link
        :to="{ name: feature.route }"
        v-for="feature in features.data"
        :key="feature.data"
        class="col-3 p-0 cursor-pointer transition-all transition-duration-300 no-underline"
      >
        <div class="p-2 flex flex-column align-items-center">
          <div
            class="border-1 border-primary-100 bg-primary-50/50 p-2 border-circle w-3rem h-3rem flex align-items-center justify-content-center"
          >
            <i
              :class="`${feature.icon} text-base ${feature.iconColor ?? 'text-primary-600'}`"
            ></i>
          </div>
          <span class="text-900 font-medium text-xs text-center mt-2">
            {{ feature.title }}
          </span>
        </div>
      </router-link>
    </div>
    <div
      class="text-center text-sm mt-5 mb-2"
      v-if="featureStatus === 'success' && features.data.length === 0"
    >
      <i class="pi pi-folder-open" />
      <span class="ml-2">Tidak Tersedia Fitur Untuk Anda</span>
    </div>
    <div v-if="featureStatus === 'pending'">
      <Skeleton class="h-5rem w-full" />
    </div>
  </div>
</template>
