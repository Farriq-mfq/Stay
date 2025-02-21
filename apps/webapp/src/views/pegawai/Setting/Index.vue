<template>
  <div>
    <AppHeader />
    <div class="mt-8 px-3 pt-3">
      <div class="flex flex-column gap-4">
        <div class="flex flex-column gap-2">
          <h3 class="text-lg m-0 text-color px-1">Pengaturan</h3>
          <div
            class="p-card shadow-1 flex flex-column justify-content-center p-2 border-round-xl"
          >
            <router-link
              :to="{ name: 'dashboard' }"
              class="p-3 no-underline text-color font-semibold flex gap-2 align-items-center hover:surface-ground"
            >
              <i class="pi pi-user text-primary"></i>
              <span class="ml-2">Akun</span>
            </router-link>
            <router-link
              :to="{ name: 'dashboard' }"
              class="p-3 no-underline text-color font-semibold flex gap-2 align-items-center hover:surface-ground"
            >
              <i class="pi pi-sun text-primary"></i>
              <span class="ml-2">Tampilan</span>
            </router-link>
            <router-link
              :to="{ name: 'dashboard' }"
              class="p-3 no-underline text-color font-semibold flex gap-2 align-items-center hover:surface-ground"
            >
              <i class="pi pi-key text-primary"></i>
              <span class="ml-2">Ubah Password</span>
            </router-link>
            <router-link
              :to="{ name: 'dashboard' }"
              class="p-3 no-underline text-color font-semibold flex gap-2 align-items-center hover:surface-ground"
            >
              <i class="pi pi-phone text-primary"></i>
              <span class="ml-2">Kontak Kami</span>
            </router-link>
            <router-link
              :to="{ name: 'dashboard' }"
              class="p-3 no-underline text-color font-semibold flex gap-2 align-items-center hover:surface-ground"
            >
              <i class="pi pi-exclamation-circle text-primary"></i>
              <span class="ml-2">Tentang Aplikasi</span>
            </router-link>
          </div>
        </div>
        <Button
          block
          class="text-center flex align-items-center justify-content-center w-full"
          outlined
          severity="danger"
        >
          <i class="pi pi-sign-out mr-2"></i>
          Keluar
        </Button>
      </div>
    </div>
  </div>
</template>
