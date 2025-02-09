<script setup>
import { ref } from "vue";
import { useDrawer } from "@/store/drawer";
const data = ref({
  nomer_rek: "",
});

const drawer = useDrawer();
const checkNameExist = ref(false);

const confirmation = () => {
  drawer.openDrawer(
    "TransferConfirmation",
    "Konfirmasi Transfer",
    transferCallback
  );
};
const checkNameService = () => {
  checkNameExist.value = true;
};

const success = ref(false);

const transferCallback = () => {
  drawer.openDrawer("Loading", "Sedang Proses...", () => {}, {
    success,
  });

  setTimeout(() => {
    success.value = true;
  }, 1000);
};
</script>

<template>
  <div>
    <AppHeaderBack title="Transfer" />
    <div
      class="bg-primary h-10rem w-full flex justify-content-center align-items-center flex-column"
    ></div>
    <div class="px-3 pb-4 p-card mx-3 shadow-1 pt-3" style="margin-top: -4rem">
      <div v-if="!checkNameExist">
        <h3 class="m-0 mb-4">Masukan Nomor Rekening yang ingin dikirim</h3>
        <Iconfield>
          <InputIcon class="pi pi-search" />
          <InputText
            type="text"
            id="nomer_rek"
            placeholder="Masukan Nomor Rekening"
            class="w-full"
            v-model="data.nomer_rek"
            icon="pi pi-search"
          />
        </Iconfield>
        <Button label="Cari" class="mt-4 w-full" @click="checkNameService" />
      </div>
      <div v-if="checkNameExist">
        <div class="flex align-items-center gap-2">
          <Avatar label="P" class="mr-2" size="large" shape="circle" />
          <div>
            <h3 class="m-0 text-lg">FARRIQ MUWAFFAQ</h3>
            <span class="m-0 font-semibold text-sm">1234567890</span>
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
            v-model="data.nomer_rek"
            mode="currency"
            currency="IDR"
            locale="id-ID"
            unstyled
          />
        </div>
        <Divider />
        <InputText placeholder="Masukan catatan" class="w-full" />
        <Button label="Kirim" class="mt-4 w-full" @click="confirmation" />
      </div>
    </div>
  </div>
</template>
