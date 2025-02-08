<script setup>
import { useScan } from "@/store/scan";
import { onMounted } from "vue";
import OpenQrcode from "./drawer/OpenQrcode.vue";
const scans = [
  {
    name: "camera",
  },
  {
    name: "qrcode",
  },
];
const scan = useScan();
const updatePage = (page) => {
  if (page === 0) {
    scan.setTitle("Pindai");
  } else if (page === 1) {
    scan.setTitle("QRCode");
  }
};

onMounted(() => {
  scan.setTitle("Pindai");
});
</script>

<template>
  <Carousel
    :value="scans"
    :numVisible="1"
    :numScroll="2"
    :showNavigators="false"
    :showIndicators="false"
    :responsiveOptions="responsiveOptions"
    @update:page="updatePage"
  >
    <template #item="slotProps">
      <OpenCamera v-if="slotProps.data.name === 'camera'" />
      <OpenQrcode v-if="slotProps.data.name === 'qrcode'" />
    </template>
  </Carousel>
</template>
