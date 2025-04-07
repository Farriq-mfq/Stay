<script setup>
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { inject } from "vue";
const auth = inject("auth");
const confirm = useConfirm();
const toast = useToast();

const logout = () => {
  confirm.require({
    message: "Apakah anda yakin ingin keluar dari aplikasi ?",
    header: "Konfirmasi",
    icon: "pi pi-exclamation-triangle",
    rejectClass: "p-button-secondary p-button-outlined",
    acceptClass: "p-button-danger",
    rejectLabel: "Batalkan",
    acceptLabel: "Keluar",
    accept: () => {
      auth
        .logout({
          makeRequest: true,
          redirect: { name: "login" },
        })
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Berhasil keluar dari aplikasi",
            life: 2000,
          });
        });
    },
  });
};

</script>
<template>
  <div>
    <AppHeader />
    <div class="mt-8 pt-3">
      <div class="flex flex-column gap-4 max-w-3xl mx-auto" id="setting-container">
        <div class="flex flex-column gap-2">
          <h3 class="text-2xl font-bold m-0 text-color px-3">Pengaturan</h3>
          <div class="px-2 surface-ground shadow-1 py-2 mt-3 mx-2  border-round-xl">
            <div class="flex flex-column">
              <router-link :to="{ name: 'setting-account' }"
                class="p-4 no-underline text-color font-semibold flex gap-2 align-items-center hover:surface-ground transition-colors transition-duration-150 border-bottom-1 surface-border">
                <i class="pi pi-user text-primary text-xl"></i>
                <span class="ml-2">Akun</span>
              </router-link>
              <router-link :to="{ name: 'setting-pin' }"
                class="p-4 no-underline text-color font-semibold flex gap-2 align-items-center hover:surface-ground transition-colors transition-duration-150 border-bottom-1 surface-border">
                <i class="pi pi-link text-primary text-xl"></i>
                <span class="ml-2">Pin</span>
              </router-link>
              <router-link :to="{ name: 'setting-security' }"
                class="p-4 no-underline text-color font-semibold flex gap-2 align-items-center hover:surface-ground transition-colors transition-duration-150 border-bottom-1 surface-border">
                <i class="pi pi-key text-primary text-xl"></i>
                <span class="ml-2">Ubah Password</span>
              </router-link>
              <router-link :to="{ name: 'theme' }"
                class="p-4 no-underline text-color font-semibold flex gap-2 align-items-center hover:surface-ground transition-colors transition-duration-150 border-bottom-1 surface-border">
                <i class="pi pi-moon text-primary text-xl"></i>
                <span class="ml-2">Tema</span>
              </router-link>
              <router-link :to="{ name: 'contact' }"
                class="p-4 no-underline text-color font-semibold flex gap-2 align-items-center hover:surface-ground transition-colors transition-duration-150 border-bottom-1 surface-border">
                <i class="pi pi-phone text-primary text-xl"></i>
                <span class="ml-2">Kontak Kami</span>
              </router-link>
              <router-link :to="{ name: 'about' }"
                class="p-4 no-underline text-color font-semibold flex gap-2 align-items-center hover:surface-ground transition-colors transition-duration-150">
                <i class="pi pi-exclamation-circle text-primary text-xl"></i>
                <span class="ml-2">Tentang Aplikasi</span>
              </router-link>
            </div>
          </div>
        </div>
        <div class="px-3">
          <Button class="text-center flex align-items-center justify-content-center w-full" outlined severity="danger"
            @click.prevent="logout">
            <i class="pi pi-sign-out mr-2"></i>
            Keluar
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
