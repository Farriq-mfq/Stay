<script setup></script>

<template>
  <div class="p-card shadow-1 border-round-xl p-3 mx-3 w-full">
    <div
      class="flex align-items-center justify-content-between border-bottom-1 border-200 pb-3"
    >
      <h4 class="m-0 text-xl">Transaksi Terakhir</h4>
      <router-link
        :to="{ name: 'transactions' }"
        class="text-xs no-underline text-primary"
        >Lihat semua</router-link
      >
    </div>
    <DataView :value="mockPresensi" class="mt-2">
      <template #list="slotProps">
        <div class="flex flex-column gap-2">
          <ListTransaction :items="slotProps.items" />
        </div>
      </template>
      <template #empty>
        <p>Presensi Kosong</p>
      </template>
    </DataView>
  </div>
</template>
