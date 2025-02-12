<script setup></script>

<template>
  <div>
    <AppHeaderBack title="Detail Presensi" />
    <div
      class="bg-primary h-13rem w-full flex justify-content-center align-items-center flex-column"
    >
      <h3 class="m-0 text-3xl mt-3">Presensi Rapat</h3>
      <span class="text-xs mt-2">20 Januari 2025 - 10:00</span>
    </div>
    <div
      class="p-card h-auto shadow-1 card-detail-presences border-round-lg p-3"
    >
      <div class="flex flex-column gap-3">
        <div
          class="flex justify-content-between align-items-center px-2 info-presences border-bottom-1 surface-border pb-2"
        >
          <span class="m-0 font-semibold text-sm">Waktu Datang</span>
          <span class="text-xs">10:00</span>
        </div>
        <div
          class="flex justify-content-between align-items-center px-2 info-presences border-bottom-1 surface-border pb-2"
        >
          <span class="m-0 font-semibold text-sm">Waktu Pulang</span>
          <span class="text-xs">10:00</span>
        </div>
        <div
          class="flex justify-content-between align-items-center px-2 info-presences border-bottom-1 surface-border pb-2"
        >
          <span class="m-0 font-semibold text-sm">Lokasi</span>
          <span class="text-xs">Ballroom</span>
        </div>
        <div
          class="flex justify-content-between align-items-center px-2 info-presences border-bottom-1 surface-border pb-2"
        >
          <span class="m-0 font-semibold text-sm">Metode Presensi</span>
          <span class="text-xs">Card</span>
        </div>
        <div
          class="flex justify-content-between align-items-center px-2 info-presences border-bottom-1 surface-border pb-2"
        >
          <span class="m-0 font-semibold text-sm">Kelompok</span>
          <span class="text-xs">Guru</span>
        </div>
      </div>
      <div class="flex flex-column gap-3">
        <Divider class="m-0" />
        <h3 class="m-0 text-sm mb-1">Sesi Rapat</h3>
        <div
          class="flex justify-content-between align-items-center px-2 info-presences border-bottom-1 surface-border pb-2"
        >
          <span class="m-0 font-semibold text-sm">Nama</span>
          <span class="text-xs">Rapat Tahunan</span>
        </div>
        <div
          class="flex justify-content-between align-items-center px-2 info-presences border-bottom-1 surface-border pb-2"
        >
          <span class="m-0 font-semibold text-sm">Tanggal</span>
          <span class="text-xs">20 Januari 2025</span>
        </div>
        <Button
          block
          class="text-center flex align-items-center justify-content-center"
          outlined
        >
          <i class="pi pi-print mr-2"></i>
          Cetak
        </Button>
        <i class="text-xs text-center">SMK Negeri 1 Pekalongan</i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-detail-presences {
  margin: -3rem 1rem 0;
  z-index: 99 !important;
}
.info-presences:last-child {
  border-bottom: none !important;
}
</style>
