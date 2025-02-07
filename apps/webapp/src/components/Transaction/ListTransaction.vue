<script setup></script>

<template>
  <div class="flex align-items-center py-3 border-bottom-1 surface-border hover:surface-hover">
    <div class="flex-1 flex align-items-center gap-3">
      <div
        class="h-3rem w-3rem border-1 border-primary border-round-2xl flex justify-content-center align-items-center"
      >
        <i class="pi pi-arrow-right text-primary"></i>
        <!-- <i class="pi pi-qrcode text-primary"></i> -->
        <!-- <i class="pi pi-shopping-cart text-primary"></i> -->
      </div>
      <div>
        <h4
          class="m-0 white-space-nowrap overflow-hidden text-overflow-ellipsis"
          style="width: 150px"
        >
          Kirim ke Farriq
        </h4>
        <p class="text-color-secondary m-0 text-xs mt-2">06 Feb 2025 - 10:00</p>
        <div class="text-xs flex align-items-center mt-2 gap-1">
          <!-- <Tag
            icon="pi pi-times"
            severity="danger"
            value="Gagal"
            class="tag-status"
          ></Tag> -->
          <Tag
            icon="pi pi-check"
            severity="success"
            value="Berhasil"
            class="tag-status"
          ></Tag>
          <!-- <Tag
            icon="pi pi-clock"
            severity="warning"
            value="Menunggu"
            class="tag-status"
          ></Tag> -->
        </div>
      </div>
    </div>
    <div class="text-xs flex align-items-center justify-content-center gap-1">
      <!-- <i class="pi pi-minus text-red-500 text-xs"></i> -->
      <i class="pi pi-plus text-primary text-xs"></i>
      <span> Rp.100.000 </span>
    </div>
  </div>
</template>

<style scoped>
.tag-status {
  font-size: 10px;
}
</style>
