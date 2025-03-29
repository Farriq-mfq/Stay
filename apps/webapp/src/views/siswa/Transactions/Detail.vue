<script setup>
import { useInfiniteQuery, useQuery } from "@tanstack/vue-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getCurrentInstance, inject, ref, watch } from "vue";
import { rupiahFormat } from "@/utils/money";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const route = useRoute();
const router = useRouter();

const getTransactionService = async () => {
  const response = await axios.get(
    `/siswa/modules/transaction/${route.params.transaction_id}`
  );
  return response.data;
};

const { data: transaction, isLoading: transactionLoading } = useQuery({
  queryKey: ["detail-transaction", route.params.transaction_id],
  queryFn: getTransactionService,
});
</script>

<template>
  <div class="min-h-screen bg-surface-ground">
    <AppHeaderBack title="Detail Transaksi" :bg="false" />
    
    <!-- Header Section -->
    <div
      class="bg-primary w-full flex justify-content-center align-items-center flex-column position-relative"
      :class="{ 'h-20rem': !transactionLoading, 'h-15rem': transactionLoading }"
    >
      <div
        class="text-white w-6rem h-6rem flex justify-content-center align-items-center border-circle border-2 bg-primary-700 shadow-4"
        :class="{ 'scalein animation-duration-500': !transactionLoading }"
      >
        <i class="pi pi-arrow-up-right text-3xl" v-if="transaction.data.type === 'DEPOSIT'"></i>
        <i class="pi pi-money-bill text-3xl" v-if="transaction.data.type === 'WITHDRAW'"></i>
        <i class="pi pi-arrow-down-right text-3xl" v-if="transaction.data.type === 'TRANSFER'"></i>
        <i class="pi pi-credit-card text-3xl" v-if="transaction.data.type === 'PAYMENT'"></i>
      </div>
      <h3 class="m-0 text-2xl mt-3 text-white font-medium">
        {{ transaction.data.title }}
      </h3>
      <span class="text-sm mt-2 text-white-alpha-90">
        {{
          format(new Date(transaction.data.createdAt), "dd MMMM yyyy", {
            locale: id,
          })
        }}
      </span>
    </div>

    <!-- Loading State -->
    <div
      v-if="transactionLoading"
      class="flex justify-content-center align-items-center p-5"
    >
      <ProgressSpinner strokeWidth="3" />
    </div>

    <!-- Content Section -->
    <div
      class="p-card h-auto shadow-2 card-detail-transaction border-round-lg mx-3"
      v-if="!transactionLoading"
    >
      <div class="flex flex-column gap-4 p-4">
        <!-- Note Section -->
        <div class="text-center p-3 bg-surface-100 border-round">
          <h4 class="m-0 text-sm font-medium line-height-4">
            {{ transaction.data.note ?? "tidak ada catatan" }}
          </h4>
        </div>

        <!-- Amount Section -->
        <div
          class="flex justify-content-between align-items-center bg-primary p-4 border-round-lg"
        >
          <h4 class="m-0 font-semibold text-white">Total Bayar</h4>
          <span class="text-lg font-bold text-white">{{
            rupiahFormat(transaction.data.amount)
          }}</span>
        </div>

        <Divider class="m-0" />

        <!-- Account Details -->
        <div class="flex flex-column gap-3">
          <h3 class="m-0 text-sm font-medium">
            Akun {{ transaction.data.flow === "UP" ? "Pengirim" : "Penerima" }}
          </h3>
          <div class="surface-card p-3 border-round-lg">
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-sm font-medium">Nama</span>
              <span class="text-sm">{{ transaction.data.to.name }}</span>
            </div>
            <div class="flex justify-content-between align-items-center">
              <span class="text-sm font-medium">Nomer Rekening</span>
              <span class="text-sm">{{ transaction.data.to.accountNumber }}</span>
            </div>
          </div>
        </div>

        <!-- Transaction Details -->
        <div class="flex flex-column gap-3">
          <h3 class="m-0 text-sm font-medium">Detail Transaksi</h3>
          <div class="surface-card p-3 border-round-lg">
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-sm font-medium">Status</span>
              <span class="text-sm">{{ transaction.data.status }}</span>
            </div>
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-sm font-medium">Kode Transaksi</span>
              <span class="text-sm">{{ transaction.data.code }}</span>
            </div>
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-sm font-medium">Tipe Transaksi</span>
              <span class="text-sm">{{ transaction.data.type }}</span>
            </div>
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-sm font-medium">Tanggal Transaksi</span>
              <span class="text-sm">
                {{
                  format(new Date(transaction.data.createdAt), "dd MMMM yyyy", {
                    locale: id,
                  })
                }}
              </span>
            </div>
            <div class="flex justify-content-between align-items-center">
              <span class="text-sm font-medium">Waktu Transaksi</span>
              <span class="text-sm">
                {{
                  format(new Date(transaction.data.createdAt), "HH:mm", {
                    locale: id,
                  })
                }}
              </span>
            </div>
          </div>
        </div>

        <div class="text-center mt-3">
          <span class="text-xs text-500">SMK Negeri 1 Pekalongan</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-detail-transaction {
  margin-top: -4rem;
  position: relative;
  z-index: 99;
}

@media screen and (max-width: 576px) {
  .card-detail-transaction {
    margin: -3rem 1rem 0;
  }
}
</style>
