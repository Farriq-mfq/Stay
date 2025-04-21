<script setup>
import { useQuery } from "@tanstack/vue-query";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { getCurrentInstance, ref, shallowRef, watch } from "vue";
import { config } from "@/config";

const { proxy } = getCurrentInstance();
const axios = proxy.axios;

const qrValue = shallowRef("");
const qrcode = useQRCode(qrValue);

const getQrCodeService = async () => {
  const response = await axios.get(`/pegawai/modules/qrcode`);
  return response.data;
};

const {
  data: qrCodeData,
  isPending: qrCodePending,
  status,
} = useQuery({
  queryKey: ["qrcode"],
  queryFn: getQrCodeService,
});

watch(qrCodeData, () => {
  if (qrCodeData.value) {
    qrValue.value = qrCodeData.value.data;
  }
});
</script>

<template>
  <div class="p-3">
    <div
      class="w-full h-30rem border-round-2xl overflow-hidden relative shadow-1 flex flex-column justify-content-between py-5"
      v-if="status === 'success'"
    >
      <div
        class="flex justify-content-center mb-3 flex flex-column align-items-center"
      >
        <img src="@/assets/logo.png" alt="" class="w-5rem" />
        <p
          class="mt-3 italic mx-0 text-center text-xs text-100 font-semibold"
          style="font-style: italic"
        >
          {{ config.app_name }}
        </p>
      </div>
      <div
        class="bg-primary h-full absolute top-0 left-0 right-0 w-full overflow-hidden shadow-3"
        style="z-index: -1"
      >
        <div
          class="bubble bg-primary-reverse opacity-10 h-25rem w-25rem absolute border-circle"
          style="right: -15rem; top: 15rem"
        ></div>
        <div
          class="bubble-delay bg-primary-reverse opacity-10 h-30rem w-30rem absolute border-circle"
          style="left: -20rem; top: -15rem"
        ></div>
      </div>
      <div
        class="flex justify-content-center items-center mx-auto h-14rem w-14rem p-card border-round-2xl relative overflow-hidden mt-3"
      >
        <div class="flex align-items-center" v-if="status === 'pending'">
          <ProgressSpinner class="h-4rem w-4rem" />
        </div>
        <img :src="qrcode" class="h-full w-full" v-if="!qrCodePending" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-opacity {
  background: rgba(255, 255, 255, 0.2) !important;
}
.bubble {
  animation: float 8s ease-in-out infinite;
}

.bubble-delay {
  animation: float 8s ease-in-out infinite;
  animation-delay: 2s;
}

@keyframes float {
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-50px) scale(1.1);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}
</style>
