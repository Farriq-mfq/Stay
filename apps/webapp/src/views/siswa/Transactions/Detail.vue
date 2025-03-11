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
  <div>
    <AppHeaderBack title="Detail Transaksi" :bg="false" />
    <div
      class="bg-primary h-19rem w-full flex justify-content-center align-items-center flex-column"
      v-if="!transactionLoading"
    >
      <div
        class="text-white w-4rem h-4rem flex justify-content-center align-items-center border-circle border-1"
      >
        <i class="pi pi-arrow-up-right" v-if="transaction.data.type === 'DEPOSIT'"></i>
        <i class="pi pi-money-bill" v-if="transaction.data.type === 'WITHDRAW'"></i>
        <i
          class="pi pi-arrow-down-right"
          v-if="transaction.data.type === 'TRANSFER'"
        ></i>
        <i
          class="pi pi-credit-card"
          v-if="transaction.data.type === 'PAYMENT'"
        ></i>
      </div>
      <h3 class="m-0 text-lg mt-3">
        {{ transaction.data.title }}
      </h3>
      <span class="text-xs mt-2">
        {{
          format(new Date(transaction.data.createdAt), "dd MMMM yyyy", {
            locale: id,
          })
        }}
      </span>
    </div>
    <div
      v-if="transactionLoading"
      class="bg-primary h-19rem w-full flex justify-content-center align-items-center flex-column px-5 gap-2 flex-column"
    >
      <Skeleton class="h-5rem" />
    </div>
    <div
      class="p-card h-auto shadow-1 card-detail-transaction border-round-lg p-3"
      v-if="!transactionLoading"
    >
      <div class="flex flex-column gap-3">
        <h4
          class="flex align-items-center gap-3 text-sm m-0 font-medium line-height-4 text-center"
        >
          {{ transaction.data.note ?? "tidak ada catatan" }}
        </h4>

        <div
          class="flex justify-content-between align-items-center bg-primary p-3 border-round-lg"
        >
          <h4 class="m-0 font-semibold">Total Bayar</h4>
          <span class="text-sm">{{
            rupiahFormat(transaction.data.amount)
          }}</span>
        </div>
        <!-- <div class="flex justify-content-between align-items-center px-2">
          <span class="m-0 font-semibold text-sm">Harga</span>
          <span class="text-xs">Rp. 17.000</span>
        </div> -->
        <!-- <div class="flex justify-content-between align-items-center px-2">
          <span class="m-0 font-semibold text-sm">Melalui</span>
          <span class="text-xs">
            {{ transaction.data.payment_method }}
          </span>
        </div> -->
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
          <h3 class="m-0 text-sm mb-1">
            Akun {{ transaction.data.flow === "UP" ? "Pengirim" : "Penerima" }}
          </h3>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-2 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">Nama</span>
            <span class="text-xs">
              {{ transaction.data.to.name }}
            </span>
          </div>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-2 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">Nomer Rekening</span>
            <span class="text-xs">
              {{ transaction.data.to.accountNumber }}
            </span>
          </div>
        </div>
        <div class="flex flex-column gap-3">
          <h3 class="m-0 text-sm mb-1">Detail Transaksi</h3>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-2 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">Status</span>
            <span class="text-xs">
              {{ transaction.data.status }}
            </span>
          </div>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-2 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">Kode Transaksi</span>
            <span class="text-xs">
              {{ transaction.data.code }}
            </span>
          </div>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-2 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">Tipe Transaksi</span>
            <span class="text-xs">
              {{ transaction.data.type }}
            </span>
          </div>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-2 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">Tanggal Transaksi</span>
            <span class="text-xs">
              {{
                format(new Date(transaction.data.createdAt), "dd MMMM yyyy", {
                  locale: id,
                })
              }}
            </span>
          </div>
          <div
            class="flex justify-content-between align-items-center px-2 border-bottom-1 surface-border pb-2 info-transaction"
          >
            <span class="m-0 font-semibold text-sm">Waktu Transaksi</span>
            <span class="text-xs">
              {{
                format(new Date(transaction.data.createdAt), "HH:mm", {
                  locale: id,
                })
              }}
            </span>
          </div>
        </div>
        <i class="text-xs text-center mt-3">SMK Negeri 1 Pekalongan</i>
      </div>
    </div>

    <div class="flex flex-column gap-3 mt-4" v-if="transactionLoading">
      <ProgressSpinner strokeWidth="3" />
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
