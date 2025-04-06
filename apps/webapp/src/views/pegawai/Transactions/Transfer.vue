<script setup>
import { useDrawer } from "@/store/drawer";
import { useMutation } from "@tanstack/vue-query";
import { useToast } from "primevue/usetoast";
import { getCurrentInstance, inject, ref, watch } from "vue";
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const auth = inject("auth");

const accountData = ref(null);
const nominal = ref(0);
const note = ref(null);
const drawer = useDrawer();
const toast = useToast();
const confirmation = () => {
  if (nominal.value <= 0) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Nominal tidak boleh kosong",
      life: 3000,
    });
  } else {
    drawer.openDrawer(
      "TransferConfirmationPegawai",
      "Konfirmasi Transfer",
      ()=>{},
      {
        accountData,
        sendingData: {
          nominal: nominal.value,
          note: note.value,
        },
      }
    );
  }
};

const searchAccountNumber = ref("");

const searchAccountNumberService = async (data) => {
  const queries = new URLSearchParams(data).toString();
  return await axios.get(`/pegawai/modules/account/search?${queries}`);
};

const {
  data: searchAccountNumberData,
  mutateAsync: searchAccountNumberMutate,
  isPending,
} = useMutation({
  mutationKey: ["searchAccountNumber"],
  mutationFn: searchAccountNumberService,
});

const handleSearchAccount = async () => {
  await searchAccountNumberMutate(
    {
      account_number: searchAccountNumber.value,
    },
    {
      onError: (err) => {
        const status = err.response.status;
        if (status === 404) {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Nomor rekening tidak ditemukan",
            life: 3000,
          });
        } else if (status === 400) {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Nomor rekening tidak valid",
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
      },
    }
  );
};

watch(searchAccountNumberData, (response) => {
  if (response.data.data) {
    accountData.value = response.data.data;
  }
});
</script>

<template>
  <div>
    <AppHeaderBack title="Transfer" />
    <div
      class="bg-primary h-10rem w-full flex justify-content-center align-items-center flex-column"
    ></div>
    <div class="px-3 pb-4 p-card mx-3 shadow-1 pt-3" style="margin-top: -4rem">
      <div v-if="!accountData">
        <h3 class="m-0 mb-4">Masukan Nomor Rekening yang ingin dikirim</h3>
        <form method="post" @submit.prevent="handleSearchAccount">
          <Iconfield>
            <InputIcon class="pi pi-search" />
            <InputText
              type="text"
              id="nomer_rek"
              placeholder="Masukan Nomor Rekening"
              class="w-full"
              v-model="searchAccountNumber"
              icon="pi pi-search"
              :disabled="isPending"
              :invalid="errorsAccount && errorsAccount.account_number"
            />
          </Iconfield>
          <Button
            type="submit"
            :label="isPending ? 'Loading...' : 'Cari'"
            :loading="isPending"
            class="mt-4 w-full"
          />
        </form>
      </div>
      <div v-if="accountData">
        <div class="flex align-items-center gap-2">
          <Avatar
            :label="accountData.name.slice(0, 1)"
            class="mr-2"
            size="large"
            shape="circle"
          />
          <div>
            <h3 class="m-0 text-lg">
              {{ accountData.name }}
            </h3>
            <span class="m-0 font-semibold text-sm">
              {{ accountData.accountNumber }}
            </span>
          </div>
        </div>
        <Divider />
        <div>
          <h3 class="m-0 text-sm uppercase text-color-secondary">
            Jumlah Kirim
          </h3>
          <InputNumber
            inputClass="w-full shadow-none text-4xl text-primary white-space-wrap"
            inputStyle="padding: 0.8rem 0;box-shadow: none !important;width: 100%;margin-top: 0.5rem;border: 0 !important;outline: none !important;"
            placeholder="Masukan Nominal"
            mode="currency"
            currency="IDR"
            locale="id-ID"
            v-model="nominal"
            unstyled
          />
        </div>
        <Divider />
        <InputText placeholder="Masukan catatan" class="w-full" v-model="note" />
        <Button label="Kirim" class="mt-4 w-full" @click="confirmation" />
        <Button
          label="Batalkan"
          @click.prevent="accountData = null"
          class="mt-4 w-full"
          severity="danger"
          outlined
        />
      </div>
    </div>
  </div>
</template>
