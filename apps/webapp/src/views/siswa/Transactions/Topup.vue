<script setup>
import { useToast } from "primevue/usetoast";

const toast = useToast();

const showToast = () => {
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Message Content",
    life: 10000000,
  });
};
</script>

<template>
  <div>
    <AppHeaderBack title="Topup" />
    <div class="mt-7 p-3">
      <p>Hubungi tim IT SMKN 1 Pekalongan</p>
      <Button
        @click="showToast"
        label="Whatsapp"
        icon="pi pi-whatsapp"
        class="w-full"
      />
    </div>
  </div>
</template>
