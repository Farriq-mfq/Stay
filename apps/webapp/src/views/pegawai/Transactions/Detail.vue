<script setup>
import { useQuery } from "@tanstack/vue-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getCurrentInstance } from "vue";
import { rupiahFormat } from "@/utils/money";
import { useRoute, useRouter } from "vue-router"
import { config } from "@/config";
;
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const route = useRoute();
const router = useRouter();

const getTransactionService = async () => {
  const response = await axios.get(
    `/pegawai/modules/transaction/${route.params.transaction_id}`
  );
  return response.data;
};

const {
  data: transaction,
  isLoading: transactionLoading,
  status,
  error: detailTransactionError,
} = useQuery({
  queryKey: ["detail-transaction", route.params.transaction_id],
  queryFn: getTransactionService,
});

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  proxy.$toast.add({
    severity: "success",
    summary: "Berhasil",
    detail: "Kode transaksi berhasil disalin",
    life: 3000,
  });
};
</script>

<template>
  <div class="min-h-screen bg-surface-ground">
    <AppHeaderBack title="Detail Transaksi" />

    <!-- Header Section -->
    <div class="relative" v-if="status === 'success'">
      <div
        class="bg-primary h-24rem w-full flex justify-content-center align-items-center flex-column"
      >
        <div
          class="text-white w-6rem h-6rem flex justify-content-center align-items-center border-circle border-2 bg-primary-700 shadow-4"
        >
          <i
            class="pi pi-arrow-up-right text-3xl"
            v-if="transaction.data.type === 'DEPOSIT'"
          ></i>
          <i
            class="pi pi-money-bill text-3xl"
            v-if="transaction.data.type === 'WITHDRAW'"
          ></i>
          <i
            class="pi pi-arrow-down-right text-3xl"
            v-if="transaction.data.type === 'TRANSFER'"
          ></i>
          <i
            class="pi pi-credit-card text-3xl"
            v-if="transaction.data.type === 'PAYMENT'"
          ></i>
        </div>
        <h3 class="m-0 text-2xl mt-3 text-white font-medium title-text">
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
    </div>

    <div
      class="px-4 absolute left-0 right-0"
      style="margin-top: -4rem"
      v-if="status === 'success'"
    >
      <div
        class="flex flex-column gap-4 p-4 surface-card p-4 border-round-xl shadow-2 mb-4"
      >
        <!-- Transaction Type Badge -->
        <div class="flex justify-content-center">
          <div
            class="px-3 py-2 border-round-lg text-white font-medium"
            :class="{
              'bg-green-500': transaction.data.type === 'DEPOSIT',
              'bg-red-500': transaction.data.type === 'WITHDRAW',
              'bg-blue-500': transaction.data.type === 'TRANSFER',
              'bg-purple-500': transaction.data.type === 'PAYMENT',
            }"
          >
            {{ transaction.data.type }}
          </div>
        </div>

        <!-- Note Section -->
        <div class="text-center p-3 bg-surface-100 border-round">
          <i class="pi pi-info-circle text-primary mr-2"></i>
          <h4 class="m-0 text-sm font-medium line-height-4 note-text">
            {{ transaction.data.note ?? "tidak ada catatan" }}
          </h4>
        </div>

        <!-- Amount Section -->
        <div
          class="flex justify-content-between align-items-center bg-primary p-4 border-round-lg"
        >
          <div class="flex flex-column">
            <h4 class="m-0 font-semibold text-white">
              {{
                transaction.data.type === "WITHDRAW"
                  ? "Total Penarikan"
                  : "Total Transaksi"
              }}
            </h4>
            <span
              class="text-xs text-white-alpha-90"
              v-if="transaction.data.type != 'WITHDRAW'"
              >Jumlah yang
              {{
                transaction.data.flow === "UP" ? "dikirim" : "diterima"
              }}</span
            >
          </div>
          <span class="text-xl font-bold text-white">{{
            rupiahFormat(transaction.data.amount)
          }}</span>
        </div>

        <Divider class="m-0" />

        <!-- Account Details -->
        <div
          class="flex flex-column gap-3"
          v-if="transaction.data.type !== 'WITHDRAW'"
        >
          <div class="flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            <h3 class="m-0 text-sm font-medium">
              Akun
              {{ transaction.data.flow === "UP" ? "Pengirim" : "Penerima" }}
            </h3>
          </div>
          <div class="surface-card p-3 border-round-lg">
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-sm font-medium">Nama</span>
              <span class="text-sm font-semibold">{{
                transaction.data.to.name
              }}</span>
            </div>
            <div class="flex justify-content-between align-items-center">
              <span class="text-sm font-medium">Nomer Rekening</span>
              <span class="text-sm font-semibold">{{
                transaction.data.to.accountNumber
              }}</span>
            </div>
          </div>
        </div>
        <div
          class="flex flex-column gap-3"
          v-if="transaction.data.type === 'WITHDRAW' && transaction.data.to"
        >
          <div class="flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            <h3 class="m-0 text-sm font-medium">Admin yang menyetujui</h3>
          </div>
          <div class="surface-card p-3 border-round-lg">
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-sm font-medium">Nama</span>
              <span class="text-sm font-semibold">{{
                transaction.data.to.name
              }}</span>
            </div>
            <div class="flex justify-content-between align-items-center">
              <span class="text-sm font-medium">Nomer Rekening</span>
              <span class="text-sm font-semibold">{{
                transaction.data.to.accountNumber
              }}</span>
            </div>
          </div>
        </div>

        <!-- Transaction Details -->
        <div class="flex flex-column gap-3">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-info-circle text-primary"></i>
            <h3 class="m-0 text-sm font-medium">Detail Transaksi</h3>
          </div>
          <div class="surface-card p-3 border-round-lg">
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-sm font-medium">Status</span>
              <span
                class="text-sm px-2 py-1 border-round"
                :class="{
                  'bg-green-100 text-green-700':
                    transaction.data.status === 'SUCCESS',
                  'bg-yellow-100 text-yellow-700':
                    transaction.data.status === 'PENDING',
                  'bg-red-100 text-red-700':
                    transaction.data.status === 'FAILED',
                }"
              >
                {{ transaction.data.status }}
              </span>
            </div>
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-sm font-medium">Tanggal</span>
              <span class="text-sm font-semibold">
                {{
                  format(new Date(transaction.data.createdAt), "dd MMMM yyyy", {
                    locale: id,
                  })
                }}
              </span>
            </div>
            <div class="flex justify-content-between align-items-center">
              <span class="text-sm font-medium">Waktu</span>
              <span class="text-sm font-semibold">
                {{
                  format(new Date(transaction.data.createdAt), "HH:mm", {
                    locale: id,
                  })
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- Transaction Code Section -->
        <div class="flex flex-column gap-3">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-hashtag text-primary"></i>
            <h3 class="m-0 text-sm font-medium">Kode Transaksi</h3>
          </div>
          <div class="surface-card p-3 border-round-lg">
            <div class="flex justify-content-between align-items-center">
              <span class="text-sm font-semibold">{{
                transaction.data.code
              }}</span>
              <Button
                icon="pi pi-copy"
                class="p-button-text p-button-rounded p-button-sm"
                @click="copyToClipboard(transaction.data.code)"
                v-tooltip.top="'Salin kode transaksi'"
              />
            </div>
          </div>
        </div>

        <!-- Detail Transaction Items -->
        <div
          class="flex flex-column gap-3"
          v-if="transaction.data.detail_transactions.length > 0"
        >
          <div class="flex align-items-center gap-2">
            <i class="pi pi-shopping-cart text-primary"></i>
            <h3 class="m-0 text-sm font-medium">Detail Pembayaran</h3>
          </div>
          <div class="surface-card p-3 border-round-lg">
            <div
              v-if="
                transaction.data.detail_transactions &&
                transaction.data.detail_transactions.length > 0
              "
            >
              <div
                v-for="(item, index) in transaction.data.detail_transactions"
                :key="item.id"
                class="mb-3"
              >
                <div class="flex justify-content-between align-items-center">
                  <div class="flex flex-column">
                    <span class="text-sm font-medium">{{ item.name }}</span>
                    <span class="text-xs text-500"
                      >{{ item.quantity }} x
                      {{ rupiahFormat(item.price) }}</span
                    >
                  </div>
                  <span class="text-sm font-semibold">{{
                    rupiahFormat(item.quantity * item.price)
                  }}</span>
                </div>
                <Divider
                  v-if="
                    index !== transaction.data.detail_transactions.length - 1
                  "
                  class="my-2"
                />
              </div>
              <Divider class="my-2" />
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm font-medium">Total</span>
                <span class="text-sm font-semibold">{{
                  rupiahFormat(transaction.data.amount)
                }}</span>
              </div>
            </div>
            <div v-else class="text-center p-3">
              <span class="text-sm text-500">Tidak ada detail barang</span>
            </div>
          </div>
        </div>

        <div class="text-center mt-3">
          <span class="text-xs text-500">
            {{ config.app_name }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="flex justify-content-center align-items-center min-h-screen"
      v-if="status === 'error'"
    >
      <div class="flex flex-column align-items-center gap-2">
        <i class="pi pi-exclamation-triangle text-2xl text-red-500"></i>
        <span class="text-lg font-semibold">Terjadi Kesalahan</span>
        <p
          class="text-sm text-500"
          v-if="detailTransactionError.status === 404"
        >
          Data transaksi tidak ditemukan.
        </p>
        <p class="text-sm text-500" v-else>
          Terjadi kesalahan saat memuat data transaksi. Silakan coba lagi.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="status === 'pending'"
      class="flex justify-content-center align-items-center p-5 min-h-screen"
    >
      <ProgressSpinner strokeWidth="3" />
    </div>
  </div>
</template>

<style scoped>
.card-detail-transaction {
  margin-top: -4rem;
  position: relative;
  z-index: 99;
}

.title-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 90%;
}

.note-text {
  white-space: pre-wrap;
  word-break: break-word;
}

@media screen and (max-width: 576px) {
  .card-detail-transaction {
    margin: -3rem 1rem 0;
  }
}
</style>
