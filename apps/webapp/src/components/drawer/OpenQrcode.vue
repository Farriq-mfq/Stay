<script setup>
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { ref } from "vue";
const qrcode = useQRCode("text-to-encode");
const showSaldo = ref(false);
const toggleShowSaldo = () => {
  showSaldo.value = !showSaldo.value;
};
</script>

<template>
  <div class="p-3">
    <div
      class="w-full h-30rem border-round-2xl overflow-hidden relative shadow-1"
    >
      <div class="relative px-3 pt-3">
        <div class="flex justify-content-center mb-3">
            <img src="@/assets/logo.png" alt="" class="w-5rem" />
        </div>
        <div
          class="bg-opacity h-full w-full border-round-2xl relative shadow-1 mt-2"
        >
          <div class="text-white pt-4 px-4 pb-2 flex-1">
            <h2 class="text-2xl mx-0 mb-0 mt-1">
              {{ showSaldo ? "Rp. 1.000.000" : "Rp.***.***" }}
            </h2>
            <p class="text-xs mt-3 mx-0 font-semibold">Saldo saat ini</p>
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
          style="left: -20rem; top: -15rem;"
        ></div>
      </div>
      <p class="mt-4 mx-0 text-center text-xs text-white font-semibold" style="font-style: italic;">
        SMK Negeri 1 Pekalongan
      </p>
      <div
        class="flex justify-content-center items-center mx-auto h-14rem w-14rem p-card border-round-2xl relative overflow-hidden mt-3"
      >
        <img :src="qrcode" alt="QR Code" class="h-full w-full" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-opacity {
  background: rgba(255, 255, 255, 0.2) !important;
}
</style>
