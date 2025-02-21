<script setup>
import "primevue/resources/themes/lara-light-purple/theme.css";
import { useRole } from "@/store/role.js";
const roleState = useRole();

const changeRole = (role) => {
  roleState.setRole(role);
};
</script>

<template>
  <div>
    <h1>Pilih Role Anda</h1>
    <Button label="Pegawai" @click="changeRole('PEGAWAI')" />
    <Button label="Siswa" @click="changeRole('SISWA')" />
  </div>
</template>
