<script setup>
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { useClipboard } from "@vueuse/core";
import { ref } from "vue";

const withdrawhistory = [
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
  {
    id: 1,
    date: "2022-10-10",
    amount: 10000,
  },
];
const qrcode = useQRCode("text-to-encode");

const withdrawCode = ref("1230294823094237095723459612302948230942370957234596123029482309423709572345961230294823094237095723459612302948230942370957234596");
const { text, copy, copied, isSupported } = useClipboard({
  source: withdrawCode,
});
</script>

<template>
  <div>
    <AppHeaderBack title="Tarik Saldo" />
    <div
      class="bg-primary h-10rem w-full flex justify-content-center align-items-center flex-column"
    ></div>
    <div class="px-3 pb-4 p-card mx-3 shadow-1 pt-3" style="margin-top: -3rem">
      <h4 class="mb-3 mt-0 font-semibold">Kode Penarikan</h4>
      <div
        class="flex justify-content-between align-items-center border-1 surface-border p-3 border-round-lg"
      >
        <span class="text-sm flex-1 white-space-nowrap overflow-hidden text-overflow-ellipsis" > {{ withdrawCode }} </span>
        <Button icon="pi pi-copy" @click="copy(withdrawCode)" />
      </div>
      <Divider align="center" type="dotted">
        <b>Atau</b>
      </Divider>
      <h4 class="mb-0 mt-3 font-semibold text-center text-sm">Scan QR Code</h4>
      <div
        class="flex justify-content-center items-center mx-auto h-14rem w-14rem border-round-2xl relative overflow-hidden mt-3 p-1 border-1 surface-border"
      >
        <img :src="qrcode" alt="QR Code" class="h-full w-full" />
      </div>
    </div>
    <div class="mt-5 px-3">
      <h3 class="text-sm m-0 text-color-secondary">Riwayat Penarikan</h3>
      <DataView :value="withdrawhistory" unstyled>
        <template #list="slotProps">
          <div class="flex flex-column gap-3 mt-3">
            <div v-for="item in slotProps.items" :key="item">
              <router-link
                :to="{
                  name: 'payment-detail',
                  params: { transaction_id: item.id },
                }"
                class="p-card shadow-1 p-3 w-full flex gap-3 align-items-center justify-content-between no-underline border-round-xl"
              >
                <div class="flex gap-3 align-items-center">
                  <div
                    class="h-3rem w-3rem border-1 border-primary border-round-2xl flex justify-content-center align-items-center"
                  >
                    <i class="pi pi-arrow-down text-primary"></i>
                  </div>
                  <div>
                    <h4
                      class="m-0 white-space-nowrap overflow-hidden text-overflow-ellipsis"
                      style="width: 150px"
                    >
                      Tarik Saldo
                    </h4>
                    <p class="text-color-secondary m-0 text-xs mt-2">
                      06 Feb 2025 - 10:00
                    </p>
                    <p class="text-color-secondary m-0 text-xs mt-2">
                      Oleh admin
                    </p>
                  </div>
                </div>
                <div
                  class="text-xs flex align-items-center justify-content-center gap-1"
                >
                  <i class="pi pi-minus text-red-500 text-xs"></i>
                  <span> Rp.100.000 </span>
                </div>
              </router-link>
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </div>
</template>
