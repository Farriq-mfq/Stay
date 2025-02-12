<template>
  <div>
    <AppHeader />
    <div class="mt-8 px-3 pt-3">
      <div class="flex flex-column gap-4">
        <div class="flex flex-column gap-2">
          <h3 class="text-lg m-0">Pengaturan Akun</h3>
          <div class="p-card shadow-1 flex flex-column gap-3">
            <router-link :to="{ name: 'dashboard' }" class="border-bottom-1 surface-border pb-3 p-2">
              <i class="pi pi-user"></i>
              <span class="ml-2">Akun</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
