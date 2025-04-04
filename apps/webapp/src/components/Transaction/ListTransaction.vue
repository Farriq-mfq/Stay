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
  <router-link v-for="item in items" :key="item.id"
    :to="{ name: 'transactions-detail', params: { transaction_id: item.id } }"
    class="transaction-item flex flex-column sm:flex-row align-items-start sm:align-items-center py-3 px-3 sm:py-4 sm:px-4 border-round-xl surface-card hover:surface-hover no-underline text-color mb-2 sm:mb-3">
    <div class="flex-1 flex align-items-center gap-3 sm:gap-4 w-full sm:w-auto">
      <div
        class="transaction-icon h-3rem w-3rem border-1 border-round-2xl flex justify-content-center align-items-center"
        :class="{
          'bg-red-50': item.type === 'TRANSFER',
          'bg-primary-50': item.type === 'DEPOSIT' || item.type === 'WITHDRAW' || item.type === 'PAYMENT',
        }">
        <i class="pi pi-arrow-down-left text-red-500 text-lg sm:text-xl" v-if="item.type === 'TRANSFER'"></i>
        <i class="pi pi-arrow-up-right text-primary text-lg sm:text-xl" v-if="item.type === 'DEPOSIT'"></i>
        <i class="pi pi-money-bill text-primary text-lg sm:text-xl" v-if="item.type === 'WITHDRAW'"></i>
        <i class="pi pi-credit-card text-primary text-lg sm:text-xl" v-if="item.type === 'PAYMENT'"></i>
      </div>
      <div class="flex-1 min-w-0">
        <h4
          class="m-0 white-space-nowrap overflow-hidden text-overflow-ellipsis text-sm sm:text-base font-medium title-width">
          {{ item.title }}
        </h4>
        <p class="text-color-secondary m-0 text-xs sm:text-sm mt-1">
          {{ format(item.createdAt, "dd MMMM yyyy", { locale: id }) }} - {{ item.type }}
        </p>
        <div class="text-xs sm:text-sm flex align-items-center mt-1 sm:mt-2 gap-2">
          <div
            class="status-badge flex justify-content-center align-items-center gap-1 sm:gap-2 px-2 py-1 border-round-lg"
            :class="item.status === 'SUCCESS' ? 'bg-primary-50 text-primary' : 'bg-red-50 text-red-500'">
            <i class="pi pi-check-circle text-xs sm:text-sm"></i>
            <span class="font-medium"> Berhasil</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="text-sm sm:text-base font-medium flex align-items-center justify-content-end sm:justify-content-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
      <i class="pi pi-arrow-down-left text-red-500" v-if="item.flow === 'DOWN'"></i>
      <i class="pi pi-arrow-up-right text-primary" v-if="item.flow === 'UP'"></i>
      <span :class="item.flow === 'DOWN' ? 'text-red-500' : 'text-primary'">
        {{ rupiahFormat(item.amount) }}
      </span>
    </div>
  </router-link>
</template>

<style scoped>
.transaction-item {
  border: 1px solid var(--surface-border);

  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); */
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
  position: relative;
  overflow: hidden;
}

.transaction-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--primary-color);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.transaction-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.1);
}

.transaction-item:hover::before {
  opacity: 1;
}

.transaction-item:not(:last-child) {
  margin-bottom: 0.75rem;
}

.transaction-icon {
  transition: all 0.2s ease;
  flex-shrink: 0;
  border: 1px solid rgba(var(--primary-color-rgb), 0.1);
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.1), rgba(var(--primary-color-rgb), 0.05));
}

.transaction-item:hover .transaction-icon {
  transform: scale(1.05);
  border-color: rgba(var(--primary-color-rgb), 0.2);
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.15), rgba(var(--primary-color-rgb), 0.1));
}

.status-badge {
  transition: all 0.2s ease;
  border: 1px solid transparent;
  backdrop-filter: blur(4px);
}

.transaction-item:hover .status-badge {
  transform: translateY(-1px);
}

.title-width {
  width: 180px;
}

@media screen and (max-width: 640px) {
  .transaction-item {
    margin-bottom: 0.5rem;
    border-width: 1px;
  }

  .transaction-item:last-child {
    margin-bottom: 0;
  }

  .title-width {
    width: 120px;
  }
}
</style>
