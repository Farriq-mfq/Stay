<script setup>
import { ref } from "vue";

const handleLogin = () => {};
const state = ref({
  username: "",
  password: "",
});
</script>

<template>
  <form class="text-center px-3 w-full">
    <img src="/logo.png" alt="logo" class="h-2 w-2 object-cover" />
    <h2>Selamat Datang</h2>
    <p class="text-color-secondary text-sm">Silakan masuk untuk melanjutkan</p>
    <Divider align="center" />
    <div class="mb-4 mt-5">
      <FloatLabel>
        <InputText
          type="text"
          class="w-full py-3"
          placeholder="Masukan username"
          id="username"
          v-model="state.username"
        />
        <label for="username">Username</label>
      </FloatLabel>
    </div>
    <div class="mb-4">
      <FloatLabel>
        <Password
          :feedback="false"
          id="password"
          placeholder="Masukan password"
          :toggleMask="true"
          class="w-full"
          v-model="state.password"
          inputClass="w-full py-3"
        />
        <label for="password">Password</label>
      </FloatLabel>
    </div>
    <div class="mb-4">
      <Button size="large" label="Log in" class="w-full" rounded />
    </div>
    <div class="mb-4">
      <span class="text-color-secondary text-sm"
        >Jika anda lupa password silahkan hubungi admin</span
      >
      <router-link href="/" class="text-primary ml-1 text-sm"
        >Hubungi</router-link
      >
    </div>
  </form>
</template>
