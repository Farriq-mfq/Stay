<script setup>
import { useToast } from "primevue/usetoast";
import { reactive, inject } from "vue";

const state = reactive({
  form: {
    body: {
      username: "",
      password: "",
    },
    remember: false,
    fetchUser: true,
    staySignedIn: true,
    errors: {},
    loading: false,
    unauthorized: false,
  },
});

const auth = inject("auth");
const toast = useToast();

function errors(res) {
  if (res && res.status === 401) {
    state.form.errors = {
      username: ["Login gagal mohon perikasa username atau password"],
    };
  } else if (res && res.status === 400) {
    state.form.errors = res.data;
  } else {
    if (auth.token() != null) {
      auth.logout({
        makeRequest: false,
        redirect: { name: "login" },
      });
      toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "Terjadi kendala, Silahkan login ulang",
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Sistem sedang sibuk",
        life: 3000,
      });
    }
  }
}

const handleLogin = () => {
  state.form.errors = null;
  state.form.loading = true;
  auth
    .login({
      data: state.form.body,
      fetchUser: state.form.fetchUser,
      staySignedIn: state.form.staySignedIn,
      redirect: "/",
      remember: true,
      errors: {}
    })
    .then(null, (res) => {
      errors(res.response);
      state.form.loading = false;
      state.form.body.password = "";
    });
};
</script>

<template>
  <form class="text-center px-3 w-full" @submit.prevent="handleLogin">
    <img src="@/assets/logo.png" alt="logo" class="h-4rem object-cover" />
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
          v-model="state.form.body.username"
          :invalid="state.form.errors && state.form.errors.username"
          :disabled="state.form.loading"
        />
        <label for="username">Username</label>
      </FloatLabel>
      <p
        class="text-left text-xs text-red-500"
        v-if="state.form.errors && state.form.errors.username"
      >
        {{ state.form.errors.username[0] }}
      </p>
    </div>
    <div class="mb-4">
      <FloatLabel>
        <Password
          :feedback="false"
          id="password"
          placeholder="Masukan password"
          :toggleMask="true"
          class="w-full"
          :invalid="state.form.errors && state.form.errors.password"
          v-model="state.form.body.password"
          inputClass="w-full py-3"
          :disabled="state.form.loading"
        />
        <label for="password">Password </label>
      </FloatLabel>
      <p
        class="text-left text-xs text-red-500"
        v-if="state.form.errors && state.form.errors.password"
      >
        {{ state.form.errors.password[0] }}
      </p>
    </div>
    <div class="mb-4">
      <Button :loading="state.form.loading" type="submit" size="large" :label="state.form.loading ? 'Loading...' : 'Masuk'" class="w-full" rounded />
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
