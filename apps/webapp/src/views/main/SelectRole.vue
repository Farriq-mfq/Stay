<script setup>
import "primevue/resources/themes/lara-light-purple/theme.css";
import { useRole } from "@/store/role.js";
import { useRouter } from "vue-router";
const router = useRouter();
const roleState = useRole();

const changeRole = (role) => {
  roleState.setRole(role);
  window.location.href = "/";
};
</script>

<template>
  <div class="h-full text-center">
    <img src="@/assets/logo.png" alt="logo" class="h-4rem object-cover" />
    <h2>Selamat Datang</h2>
    <p class="text-color-secondary text-sm">Silahkan Pilih Untuk Melanjutkan</p>
    <Divider align="center" />

    <div class="flex align-items-center gap-3 flex-column">
      <Button
        label="PEGAWAI"
        @click="changeRole('PEGAWAI')"
        class="w-full"
        outlined
      />
      <Button
        label="SISWA"
        @click="changeRole('SISWA')"
        class="w-full"
        outlined
      />
    </div>
  </div>
</template>
