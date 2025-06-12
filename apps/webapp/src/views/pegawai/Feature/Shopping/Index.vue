<script setup>
import AppHeaderBack from "@/components/AppHeaderBack.vue";
import { getCurrentInstance, inject, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useMutation, useInfiniteQuery } from "@tanstack/vue-query";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { rupiahFormat } from "@/utils/money";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const { proxy } = getCurrentInstance();

const axios = proxy.axios;

const toast = useToast();
const amount = ref(0);

const errorCreatePayment = ref(null);
const paymentQrValue = ref("");

const qrcode = useQRCode(paymentQrValue);
const filter = ref(null);

const statusPembayaran = ref(null);

const createPaymentService = async (data) => {
  const response = await axios.post("/pegawai/modules/transaction/payment", {
    amount: data,
  });
  return response.data;
};

const paymentData = ref(null);

const { isPending: isCreatingPayment, mutate: createPayment } = useMutation({
  mutationFn: createPaymentService,
  mutationKey: ["createPaymentService"],
  onSuccess: (data) => {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Transaksi berhasil dibuat",
      life: 3000,
    });
    amount.value = 0;
    errorCreatePayment.value = null;
    paymentData.value = data;
    paymentQrValue.value = data.data.qrcode;
    refetch();
  },
  onError: (error) => {
    const response = error.response;
    if (response.status === 400) {
      errorCreatePayment.value = response.data;
      if (response.data.message) {
        errorCreatePayment.value = response.data.message;
      }
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Gagal membuat pembayaran",
        life: 3000,
      });
    }
  },
});

const handlePay = async () => {
  errorCreatePayment.value = null;
  statusPembayaran.value = null;
  await createPayment(amount.value);
};

const getListPaymentService = async ({ pageParam }) => {
  const queries = {
    ...(pageParam && { after: parseInt(pageParam) }),
    ...(filter.value && { search: filter.value }),
  };
  const params = new URLSearchParams(queries);
  const response = await axios.get(
    `/pegawai/modules/transaction/payment?${params}`
  );
  return response.data;
};

const {
  data: listPayment,
  isLoading: loading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
} = useInfiniteQuery({
  queryKey: [`payment-history`, filter.value],
  queryFn: getListPaymentService,

  getNextPageParam: (lastPage) => {
    return lastPage.data[1].endCursor;
  },
});

const items = ref([]);
watch(
  () => listPayment.value,
  (val) => {
    if (val) {
      const itemMap = new Map();
      val.pages.forEach((page) => {
        page.data[0].forEach((item) => {
          if (!itemMap.has(item.id)) {
            itemMap.set(item.id, item);
          }
        });
      });
      items.value = Array.from(itemMap.values());
    }
  },
  { immediate: true }
);

const handleTransactionDetail = (item) => {
  paymentData.value = {
    data: {
      transaction: item,
    },
  };
  paymentQrValue.value = item.qrcode;
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
// listen socket io
const socket = proxy.socket;

watch(paymentData, (val) => {
  if (val) {
    socket.on(
      `send_notification_payment_${val.data.transaction.code}`,
      (data) => {
        statusPembayaran.value = data.status;
        refetch();
      }
    );
  }
});
</script>

<template>
  <div>
    <AppHeaderBack title="Belanja" />
    <div
      class="bg-primary h-10rem w-full flex justify-content-center align-items-center flex-column"
    ></div>
    <div
      class="px-3 pb-4 p-card mx-3 shadow-1 pt-3"
      style="margin-top: -3rem"
      v-if="!paymentData"
    >
      <div class="flex flex-column gap-2">
        <h3 class="m-0 text-sm uppercase text-color-secondary">
          Buat Transaksi Belanja
        </h3>
        <InputNumber
          inputClass="w-full shadow-none text-3xl text-primary
        white-space-wrap"
          inputStyle="padding: 0.8rem 0;box-shadow: none
        !important;width: 100%;margin-top: 0.5rem;border: 0 !important;outline:
        none !important;"
          placeholder="Masukan Total Belanja"
          mode="currency"
          currency="IDR"
          locale="id-ID"
          v-model="amount"
          unstyled
          :disabled="isCreatingPayment"
          :invalid="errorCreatePayment"
        />
        <small v-if="errorCreatePayment" class="p-error">{{
          errorCreatePayment
        }}</small>
        <Divider />
        <Button
          label="Buat Transaksi Belanja"
          class="w-full p-3"
          @click="handlePay"
          :loading="isCreatingPayment"
        />
      </div>
    </div>
    <div
      class="px-3 pb-4 p-card mx-3 shadow-1 pt-3"
      style="margin-top: -3rem"
      v-if="paymentData"
    >
      <div class="flex flex-column gap-2">
        <h3 class="m-0 text-sm uppercase text-color-secondary">
          {{
            statusPembayaran === "success"
              ? "Pembayaran Berhasil"
              : "Silahkan scan kode QR di bawah ini"
          }}
        </h3>
        <Divider />
        <div class="flex flex-column gap-2">
          <div class="flex justify-content-between">
            <span class="text-sm">Total Pembayaran</span>
            <span class="text-sm font-semibold">{{
              rupiahFormat(paymentData.data.transaction.amount)
            }}</span>
          </div>
          <div class="flex justify-content-between">
            <span class="text-sm">Kode Pembayaran</span>
            <span class="text-sm font-semibold">{{
              paymentData.data.transaction.code
            }}</span>
          </div>
        </div>
        <Divider />
        <div class="flex justify-content-center">
          <img
            :src="qrcode"
            alt="QRCODE PEMBAYARAN"
            v-if="statusPembayaran === null"
          />
          <i
            class="pi pi-check-circle text-green-400 mb-5"
            style="font-size: 10rem"
            v-if="statusPembayaran === 'success'"
          ></i>
          <i
            class="pi pi-times-circle text-red-400 mb-5"
            style="font-size: 10rem"
            v-if="statusPembayaran === 'failed'"
          ></i>
        </div>
        <Button label="Kembali" class="w-full" @click="paymentData = null" />
      </div>
    </div>
    <div class="p-4">
      <DataView :value="items" unstyled>
        <template #empty>
          <div class="flex flex-column gap-3 mt-3">
            <div
              class="p-card shadow-1 p-3 w-full flex gap-3 align-items-center justify-content-center no-underline border-round-xl"
            >
              <i class="pi pi-wallet text-2xl text-color-secondary mr-2"></i>
              <span class="text-color-secondary"
                >Belum ada riwayat pembayaran</span
              >
            </div>
          </div>
        </template>
        <template #list="slotProps">
          <div class="flex flex-column gap-3 mt-3">
            <div v-for="item in slotProps.items" :key="item.id">
              <div
                @click="handleTransactionDetail(item)"
                class="p-card shadow-1 p-3 w-full flex gap-3 no-underline border-round hover:surface-hover transition-colors transition-duration-150"
              >
                <div class="flex gap-3 align-items-center flex-1">
                  <div class="flex-1">
                    <p class="text-color-secondary m-0 text-xs mt-1">
                      Kode: {{ item.code }}
                    </p>
                  </div>
                </div>
                <div
                  class="text-xl font-semibold flex align-items-center gap-1"
                >
                  <span>
                    {{ format(item.createdAt, "dd MMMM yyyy", { locale: id }) }}
                  </span>
                </div>
                <div
                  class="text-xl font-semibold flex align-items-center gap-1"
                >
                  <span>{{ rupiahFormat(item.amount) }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
      <div class="flex justify-content-center align-items-center mt-3">
        <Button
          @click="fetchNextPage"
          text
          size="small"
          :loading="isFetchingNextPage"
          :disabled="isFetchingNextPage"
          v-if="hasNextPage"
          class="w-full mt-4"
          :label="isFetchingNextPage ? 'Memuat...' : 'Tampilkan lebih banyak'"
        />
      </div>
    </div>
  </div>
</template>
