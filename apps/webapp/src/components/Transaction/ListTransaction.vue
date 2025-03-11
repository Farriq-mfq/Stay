<script setup>
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { rupiahFormat } from "@/utils/money";

const { items } = defineProps({
  items: {
    type: Array,
    default: [],
    required: true,
  },
});
</script>

<template>
  <router-link
    v-for="item in items"
    :key="item.id"
    :to="{ name: 'transactions-detail', params: { transaction_id: 1 } }"
    class="flex align-items-center py-3 border-bottom-1 surface-border hover:surface-hover no-underline text-color list-transaction"
  >
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
          class="m-0 white-space-nowrap overflow-hidden text-overflow-ellipsis text-sm"
          style="width: 150px"
        >
          {{ item.title }}
        </h4>
        <p class="text-color-secondary m-0 text-xs mt-2">
          {{ format(item.createdAt, "dd MMMM yyyy - HH:mm", { locale: id }) }}
        </p>
        <div class="text-xs flex align-items-center mt-2 gap-1">
          <div class="flex justify-content-center align-items-center gap-2" v-if="item.status === 'SUCCESS'">
            <i class="pi pi-check-circle text-primary"></i>
            <span> Berhasil</span>
          </div>
        </div>
      </div>
    </div>
    <div class="text-xs flex align-items-center justify-content-center gap-1">
      <i
        class="pi pi-minus text-red-500 text-xs"
        v-if="item.flow === 'DOWN'"
      ></i>
      <i class="pi pi-plus text-primary text-xs" v-if="item.flow === 'UP'"></i>
      <span>
        {{ rupiahFormat(item.amount) }}
      </span>
    </div>
  </router-link>
</template>

<style scoped>
.tag-status {
  font-size: 10px;
}

.list-transaction:last-child {
  border-bottom: none !important;
}
</style>
