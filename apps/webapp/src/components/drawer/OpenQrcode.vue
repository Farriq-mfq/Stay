<script setup>
import { useDrawer } from "@/store/drawer";
import { rupiahFormat } from "@/utils/money";
import { useQuery } from "@tanstack/vue-query";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { getCurrentInstance, ref, shallowRef, watch } from "vue";

const { proxy } = getCurrentInstance();
const axios = proxy.axios;

const qrValue = shallowRef("");
const qrcode = useQRCode(qrValue);
const showSaldo = ref(true);
const drawer = useDrawer();
const toggleShowSaldo = () => {
  showSaldo.value = !showSaldo.value;
};

const getQrCodeService = async () => {
  const response = await axios.get(`/pegawai/modules/qrcode`);
  return response.data;
};

const { data: qrCodeData, isPending: qrCodePending } = useQuery({
  queryKey: ["qrcode"],
  queryFn: getQrCodeService,
});

watch(qrCodeData, () => {
  if (qrCodeData.value) {
    qrValue.value = qrCodeData.value.data;
  }
});

const getAccount = async () => {
  const response = await axios.get("/pegawai/modules/account");
  return response.data;
};

const { data: account, isLoading: accountLoading } = useQuery({
  queryKey: ["account"],
  queryFn: getAccount,
});

</script>

<template>
  <div class="p-3">
    <div
      class="w-full h-30rem border-round-2xl overflow-hidden relative shadow-1"
      v-if="!accountLoading && account"
    >
      <div class="relative px-3 pt-3">
        <div class="flex justify-content-center mb-3">
          <img src="@/assets/logo.png" alt="" class="w-5rem" />
        </div>
        <div
          class="bg-opacity h-full w-full border-round-2xl relative shadow-1 mt-2"
        >
          <div class="text-white px-4 py-4 flex-1">
            <h2 class="text-2xl mx-0 mb-0 mt-1">
              {{ showSaldo ? rupiahFormat(account.data.balance) : "***" }}
            </h2>
            <div
              class="text-xs mx-0 font-semibold flex align-items-center mt-2 gap-2"
              v-if="account.data"
            >
              <span class="text-md">{{ account.data.accountNumber }}</span>
              <i class="pi pi-copy cursor-pointer"></i>
            </div>
            <Button
              @click="toggleShowSaldo"
              icon="pi pi-eye"
              rounded
              class="shadow-none bg-transparent border-none absolute top-0 right-0 bottom-0 mr-2 mt-6"
              variant="text"
            />
          </div>
        </div>
      </div>
      <div
        class="bg-primary h-full absolute top-0 left-0 right-0 w-full overflow-hidden"
        style="z-index: -1"
      >
        <div
          class="bg-primary-reverse opacity-10 h-25rem w-25rem absolute border-circle"
          style="right: -15rem; top: 15rem"
        ></div>
        <div
          class="bg-primary-reverse opacity-10 h-30rem w-30rem absolute border-circle"
          style="left: -20rem; top: -15rem"
        ></div>
      </div>
      <p
        class="mt-4 mx-0 text-center text-xs text-white font-semibold"
        style="font-style: italic"
      >
        SMK Negeri 1 Pekalongan
      </p>
      <div
        class="flex justify-content-center items-center mx-auto h-14rem w-14rem p-card border-round-2xl relative overflow-hidden mt-3"
      >
        <div class="flex align-items-center" v-if="qrCodePending">
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
</style>
