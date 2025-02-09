<script setup>
import { useDrawer } from "@/store/drawer";
const drawer = useDrawer();
</script>

<template>
  <div>
    <!-- <p class="text-sm text-color-secondary m-b-5 mt-0">
      Cek lagi nama penerima dan nominal kirim sudah benar ?
    </p> -->
    <div class="flex align-items-center gap-2">
      <Avatar label="P" class="mr-2" size="large" shape="circle" />
      <div>
        <h3 class="m-0 text-lg">Kirim uang ke</h3>
        <span class="m-0 font-semibold text-sm">FARRIQ MUWAFFAQ</span>
      </div>
    </div>
    <Divider />
    <div class="flex flex-column gap-3 my-5">
      <div class="flex justify-content-between align-items-center px-2">
        <span class="m-0 font-semibold text-sm">Nomer rekening</span>
        <span class="text-xs">123456789</span>
      </div>
      <div class="flex justify-content-between align-items-center px-2">
        <span class="m-0 font-semibold text-sm">Nominal</span>
        <span class="text-lg text-primary font-semibold">Rp. 17.000</span>
      </div>
      <div class="flex justify-content-between align-items-center px-2">
        <span class="m-0 font-semibold text-sm">Metode Pembayaran</span>
        <span class="text-xs">Saldo Sekolah</span>
      </div>
      <div class="flex justify-content-between align-items-center px-2">
        <span class="m-0 font-semibold text-sm">Tanggal</span>
        <span class="text-xs">
          20 Januari 2025
        </span>
      </div>
      <div class="flex justify-content-between align-items-center px-2">
        <span class="m-0 font-semibold text-sm">Waktu</span>
        <span class="text-xs">
          10:00
        </span>
      </div>
      <div class="flex justify-content-between align-items-center px-2">
        <span class="m-0 font-semibold text-sm">Catatan</span>
        <span class="text-xs white-space-nowrap overflow-hidden text-overflow-ellipsis" style="width: 200px;">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti libero quae, culpa reiciendis illum corporis. Commodi sapiente vero earum consectetur ea voluptates sit cupiditate reprehenderit nihil laborum ex, quasi placeat..</span>
      </div>
    </div>
    <Button
      @click="drawer.callback()"
      block
      class="w-full"
      :label="`Kirim Rp.100.000`"
    />
  </div>
</template>
