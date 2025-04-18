<script setup>
import { useDrawer } from "@/store/drawer";
import { onMounted, ref } from "vue";
import OpenCameraSiswa from "./drawer/OpenCameraSiswa.vue";
const scans = [
  {
    name: "camera",
  },
  {
    name: "qrcode",
  },
];
const drawer = useDrawer();
const updatePage = (page) => {
  if (page === 0) {
    drawer.setTitle("Pindai");
  } else if (page === 1) {
    drawer.setTitle("QRCode");
  }
};

onMounted(() => {
  drawer.setTitle("Pindai");
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
      <OpenCameraSiswa
        v-if="slotProps.data.name === 'camera' && slotProps.index === 0"
      />
      <OpenQrcodeSiswa
        v-if="slotProps.data.name === 'qrcode' && slotProps.index === 1"
      />
    </template>
  </Carousel>
</template>
