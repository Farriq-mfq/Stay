<script setup>
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { useToast } from "primevue/usetoast";
import { rupiahFormat } from "@/utils/money";
import { getCurrentInstance, inject, ref, watch } from "vue";
const { proxy } = getCurrentInstance()

const axios = proxy.axios
const toast = useToast();
const withdrawAmount = ref('');
const withdrawCode = ref("");
const createWithdrawData = ref(null)

const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Kode berhasil disalin', life: 3000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal menyalin kode', life: 3000 });
  }
};

const handleWithdraw = async () => {
  await createWithdraw({ amount: withdrawAmount.value })
};

const qrcode = useQRCode(withdrawCode);


const createWithdrawService = async () => {
  const response = await axios.post('/siswa/modules/transaction/withdraw', {
    amount: withdrawAmount.value
  })
  return response.data
}


const errorCreateWithdraw = ref(null)
const errorCreateWithdrawMessage = ref(null)

const { mutate: createWithdraw, isPending: isCreatingWithdraw } = useMutation({
  mutationFn: createWithdrawService,
  onSuccess: (data) => {
    createWithdrawData.value = data.data
    withdrawCode.value = data.data.qrcode
  },
  onError: (error) => {
    const response = error.response
    if (response.status === 400) {
      errorCreateWithdraw.value = response.data
      if (response.data.message) {
        errorCreateWithdrawMessage.value = response.data.message
      }
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal membuat permintaan penarikan', life: 3000 })
    }
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'warning'
    case 'SUCCESS':
      return 'success'
    case 'FAILED':
      return 'danger'
    default:
      return 'info'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'PENDING':
      return 'Menunggu'
    case 'SUCCESS':
      return 'Berhasil'
    case 'FAILED':
      return 'Gagal'
    default:
      return status
  }
}

const filter = ref(null);
const auth = inject('auth')
const getWithdrawHistory = async ({ pageParam }) => {
  const queries = {
    ...(pageParam && { after: parseInt(pageParam) }),
    ...(filter.value && { search: filter.value }),
  };
  const params = new URLSearchParams(queries);

  const response = await axios.get(`/siswa/modules/transaction/withdraw?${params}`);
  return response.data;
};

const {
  data: withdrawHistory,
  isLoading: loading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
} = useInfiniteQuery({
  queryKey: [`${auth.user().id}-withdraw-history`, filter.value],
  queryFn: getWithdrawHistory,

  getNextPageParam: (lastPage) => {
    return lastPage.data[1].endCursor;
  },
});
const items = ref([]);

watch(
  () => withdrawHistory.value,
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

const handleSearch = () => {
  refetch();
};

watch(filter, (val) => {
  if (val == null || val == "") {
    refetch();
  }
});

const handleTransactionDetail = (item) => {
  createWithdrawData.value = {
    transaction: item
  }
  withdrawCode.value = item.qrcode
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<template>
  <div>
    <AppHeaderBack title="Tarik Saldo" />
    <div class="bg-primary h-10rem w-full flex justify-content-center align-items-center flex-column"></div>
    <div class="px-3 pb-4 p-card mx-3 shadow-1 pt-3" style="margin-top: -3rem">
      <h4 class="mb-3 mt-0 font-semibold" v-if="!createWithdrawData">Buat Permintaan Penarikan</h4>
      <h4 class="mb-3 mt-0 font-semibold" v-else>Detail Penarikan</h4>
      <div class="flex flex-column gap-3" v-if="!createWithdrawData">
        <div class="field">
          <label for="amount" class="block text-sm font-medium mb-2">Jumlah Penarikan</label>
          <InputNumber id="amount" v-model="withdrawAmount" mode="currency" currency="IDR" locale="id-ID" class="w-full"
            placeholder="Masukkan jumlah penarikan" :invalid="errorCreateWithdraw && errorCreateWithdraw.amount || errorCreateWithdrawMessage" />
          <p class="text-red-500 text-sm" v-if="errorCreateWithdraw && errorCreateWithdraw.amount">{{
            errorCreateWithdraw && errorCreateWithdraw.amount[0] }}</p>
          <p class="text-red-500 text-sm" v-if="errorCreateWithdrawMessage">
            {{ errorCreateWithdrawMessage }}
          </p>
          <small class="text-color-secondary">Minimal penarikan Rp 10.000</small>
        </div>
        <Button label="Buat Permintaan" class="w-full" @click="handleWithdraw" :loading="isCreatingWithdraw" />
      </div>

      <template v-if="createWithdrawData && createWithdrawData.transaction.status != 'SUCCESS'">
        <Divider align="center" type="dotted">
          <b>Kode Penarikan</b>
        </Divider>

        <div class="flex justify-content-between align-items-center border-1 surface-border p-3 border-round-lg">
          <span class="text-sm flex-1 white-space-nowrap overflow-hidden text-overflow-ellipsis">{{
            createWithdrawData.transaction.code
          }}</span>
          <Button icon="pi pi-copy" @click="copy(createWithdrawData.transaction.code)" />
        </div>

        <Divider align="center" type="dotted">
          <b>Atau</b>
        </Divider>

        <h4 class="mb-0 mt-3 font-semibold text-center text-sm">Scan QR Code</h4>
        <div
          class="flex justify-content-center items-center mx-auto h-14rem w-14rem border-round-2xl relative overflow-hidden mt-3 p-1 border-1 surface-border">
          <img :src="qrcode" alt="QR Code" class="h-full w-full" />
        </div>

        <div class="flex justify-content-center align-items-center mt-3">
          <Button label="Kembali" size="small" class="w-full" severity="secondary" @click="createWithdrawData = null" />
        </div>
      </template>
      <template v-if="createWithdrawData && createWithdrawData.transaction.status === 'SUCCESS'">
        <div class="flex flex-column gap-3">
          <div class="surface-ground p-3 border-round">
            <div class="flex flex-column gap-3">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-check-circle text-green-500 text-xl"></i>
                <span class="font-semibold">Penarikan Berhasil</span>
              </div>
              <Divider />
              <div class="flex flex-column gap-3">
                <div class="flex justify-content-between">
                  <span class="text-color-secondary">Jumlah Penarikan</span>
                  <span class="font-medium">{{ rupiahFormat(createWithdrawData.transaction.amount) }}</span>
                </div>
                <div class="flex justify-content-between">
                  <span class="text-color-secondary">Tanggal Transaksi</span>
                  <span class="font-medium">{{ formatDate(createWithdrawData.transaction.createdAt) }}</span>
                </div>
                <div class="flex justify-content-between">
                  <span class="text-color-secondary">Kode Transaksi</span>
                  <span class="font-medium">{{ createWithdrawData.transaction.code }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-content-center align-items-center mt-3">
          <Button label="Kembali" size="small" class="w-full" severity="secondary" @click="createWithdrawData = null" />
        </div>
      </template>
    </div>
    <div class="mt-5 px-3">
      <h3 class="text-sm m-0 text-color-secondary mb-3">Riwayat Penarikan</h3>
      <DataView :value="items" unstyled>
        <template #empty>
          <div class="flex flex-column gap-3 mt-3">
            <div
              class="p-card shadow-1 p-3 w-full flex gap-3 align-items-center justify-content-center no-underline border-round-xl">
              <i class="pi pi-wallet text-2xl text-color-secondary mr-2"></i>
              <span class="text-color-secondary">Belum ada riwayat penarikan</span>
            </div>
          </div>
        </template>
        <template #list="slotProps">
          <div class="flex flex-column gap-3 mt-3">
            <div v-for="item in slotProps.items" :key="item.id">
              <div @click="handleTransactionDetail(item)"
                class="p-card shadow-1 p-3 w-full flex gap-3 align-items-center justify-content-between no-underline border-round-xl hover:surface-hover transition-colors transition-duration-150">
                <div class="flex gap-3 align-items-center flex-1">
                  <div class="flex-1">
                    <div class="flex align-items-center gap-2">
                      <h4 class="m-0 text-sm font-semibold">
                        {{ item.type }}
                      </h4>
                      <Tag :value="getStatusText(item.status)" :severity="getStatusColor(item.status)"
                        class="text-xs" />
                    </div>
                    <p class="text-color-secondary m-0 text-xs mt-1">
                      {{ formatDate(item.createdAt) }}
                    </p>
                    <p class="text-color-secondary m-0 text-xs mt-1">
                      Kode: {{ item.code }}
                    </p>
                  </div>
                </div>
                <div class="text-sm font-semibold flex align-items-center gap-1">
                  <i class="pi pi-minus text-red-500"></i>
                  <span>Rp {{ rupiahFormat(item.amount) }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
      <div class="flex justify-content-center align-items-center mt-3">
        <Button @click="fetchNextPage" text size="small" :loading="isFetchingNextPage" :disabled="isFetchingNextPage"
          v-if="hasNextPage" class="w-full mt-4" :label="isFetchingNextPage ? 'Memuat...' : 'Tampilkan lebih banyak'" />
      </div>
    </div>
  </div>
</template>
