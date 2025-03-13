<script setup>
import { useDrawer } from "@/store/drawer";
import { computed } from "vue";
import { rupiahFormat } from "@/utils/money";
import { getCurrentInstance, inject, ref, watch } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const axios = proxy.axios;

const drawer = useDrawer();

const account = computed(() => drawer.data.accountData);
const sending = computed(() => drawer.data.sendingData);

const router = useRouter();

const transferService = async (data) => {
  return await axios.post(`/pegawai/modules/account/transfer`, data);
};

const {
  data: transferData,
  mutateAsync: transferMutate,
  status,
} = useMutation({
  mutationKey: ["transfer"],
  mutationFn: transferService,
});

const toast = useToast();

const handleTransfer = async () => {
  await transferMutate(
    {
      account_number: account.value.accountNumber,
      nominal: sending.value.nominal,
      note: sending.value.note,
    },
    {
      onSuccess: (response) => {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Transfer berhasil",
          life: 3000,
        });

        router.push({
          name: "transactions-detail",
          params: { transaction_id: response.data.data.id },
        });
      },
      onError: (err) => {
        if (!err.response) return;
        const status = err.response.status;
        if (status === 400) {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: err.response.data.message,
            life: 3000,
          });
        } else if (status === 404) {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: err.response.data.message,
            life: 3000,
          });
        } else {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Terjadi kendala",
            life: 3000,
          });
        }
        drawer.closeDrawer();
      },
    }
  );
  // drawer.callback();
};

watch(status, () => {
  if (status.value === "success") {
    drawer.closeDrawer();
  }

  if (status.value === "pending") {
    drawer.setTitle("Tunggu...");
  }
});
</script>

<template>
  <div v-if="status != 'pending'">
    <div class="flex align-items-center gap-2">
      <Avatar :label="account.name.slice(0, 1)" class="mr-2" size="large" shape="circle" />
      <div>
        <h3 class="m-0 text-lg">Kirim saldo ke {{ account.name }}</h3>
      </div>
    </div>
    <Divider />
    <div class="flex flex-column gap-3 my-5">
      <div class="flex justify-content-between align-items-center px-2">
        <span class="m-0 font-semibold text-sm">Nomer rekening</span>
        <span class="text-xs">
          {{ account.accountNumber }}
        </span>
      </div>
      <div class="flex justify-content-between align-items-center px-2">
        <span class="m-0 font-semibold text-sm">Nominal</span>
        <span class="text-lg text-primary font-semibold">
          {{ rupiahFormat(sending.nominal) }}
        </span>
      </div>
      <div class="flex justify-content-between align-items-center px-2">
        <span class="m-0 font-semibold text-sm">Catatan</span>
        <span
          class="text-xs white-space-nowrap overflow-hidden text-overflow-ellipsis"
        >
          {{ sending.note ?? "-" }}
        </span>
      </div>
    </div>
    <Button
      @click="handleTransfer"
      block
      class="w-full"
      :label="`Kirim ${rupiahFormat(sending.nominal)}`"
    />
  </div>
  <div class="flex flex-column gap-3" v-if="status === 'pending'">
    <ProgressSpinner />
  </div>
</template>
