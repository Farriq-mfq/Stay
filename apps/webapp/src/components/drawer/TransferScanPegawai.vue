<script setup>
import { useDrawer } from "@/store/drawer";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
const drawer = useDrawer();
const nominal = ref(0);
const note = ref(null);
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
      () => {},
      {
        accountData: drawer.data,
        sendingData: {
          nominal: nominal.value,
          note: note.value,
        },
      }
    );
  }
};
</script>

<template>
  <div v-if="drawer.data">
    <div class="flex align-items-center gap-2">
      <Avatar
        :label="drawer.data.name.slice(0, 1)"
        class="mr-2"
        size="large"
        shape="circle"
      />
      <div>
        <h3 class="m-0 text-lg">
          {{ drawer.data.name }}
        </h3>
        <span class="m-0 font-semibold text-sm">
          {{ drawer.data.accountNumber }}
        </span>
      </div>
    </div>
    <Divider />
    <div>
      <h3 class="m-0 text-sm uppercase text-color-secondary">Jumlah Kirim</h3>
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
      @click.prevent="drawer.data = null"
      class="mt-4 w-full"
      severity="danger"
      outlined
    />
  </div>
</template>
