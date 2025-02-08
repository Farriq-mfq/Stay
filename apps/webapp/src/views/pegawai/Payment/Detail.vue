<script setup></script>

<template>
  <div>
    <AppHeaderBack title="Detail Transaksi" :bg="false" />
    <div
      class="bg-primary h-19rem w-full flex justify-content-center align-items-center flex-column"
    >
      <div
        class="text-white w-4rem h-4rem flex justify-content-center align-items-center border-circle border-1"
      >
        <i class="pi pi-arrow-right"></i>
      </div>
      <h3 class="m-0 text-lg mt-3">Kirim ke Farriq</h3>
      <span class="text-xs mt-2">20 Januari 2025 - 10:00</span>
    </div>
    <div
      class="p-card h-auto shadow-1 card-detail-transaction border-round-lg p-3"
    >
      <div class="flex flex-column gap-3">
        <h4
          class="flex align-items-center gap-3 text-sm m-0 font-medium line-height-4 text-center"
        >
          Jangan lupa sedekah hari ini ya besti :)
        </h4>

        <div
          class="flex justify-content-between align-items-center bg-primary p-3 border-round-lg"
        >
          <h4 class="m-0 font-semibold">Total Bayar</h4>
          <span class="text-sm">Rp. 17.000</span>
        </div>
        <div class="flex justify-content-between align-items-center px-2">
          <span class="m-0 font-semibold text-sm">Harga</span>
          <span class="text-xs">Rp. 17.000</span>
        </div>
        <div class="flex justify-content-between align-items-center px-2">
          <span class="m-0 font-semibold text-sm">Metode Pembayaran</span>
          <span class="text-xs">Saldo Sekolah</span>
        </div>
        <Divider class="m-0" />
        <!-- <div class="flex flex-column gap-3">
          <h3 class="m-0 text-sm mb-1">Detail Penerima</h3>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-3 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">Nama</span>
            <span class="text-xs">Farriq Muwaffaq</span>
          </div>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-3 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">ID Akun</span>
            <span class="text-xs">12912479</span>
          </div>
        </div> -->
        <div class="flex flex-column gap-3">
          <h3 class="m-0 text-sm mb-1">Detail Transaksi</h3>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-2 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">Status</span>
            <span class="text-xs">Berhasil</span>
          </div>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-2 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">ID Transaksi</span>
            <span class="text-xs">2139048209354720395</span>
          </div>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-2 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">ID Akun</span>
            <span class="text-xs">2139048209354720395</span>
          </div>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-2 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">Tipe Transaksi</span>
            <span class="text-xs">qrcode</span>
          </div>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-2 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">Tanggal Transaksi</span>
            <span class="text-xs">20 Januari 2025</span>
          </div>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-2 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">Waktu Transaksi</span>
            <span class="text-xs">10:00</span>
          </div>
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
.card-detail-transaction {
  margin: -4rem 1rem 0;
  z-index: 99 !important;
}

.info-transaction:last-child {
  border-bottom: none !important;
}
</style>
