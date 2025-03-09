<script setup>
import { getCurrentInstance, inject, ref, watch } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { useToast } from "primevue/usetoast";
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const auth = inject("auth");
const toast = useToast();
const createAccount = async () => {
  const response = await axios.post(`/pegawai/modules/account/create`);
  return response.data;
};

const { mutateAsync: createAccountMutate } = useMutation({
  mutationKey: ["createAccount"],
  mutationFn: createAccount,
});

const handleCreateAccount = async () => {
  await createAccountMutate(
    {},
    {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Account berhasil dibuat",
          life: 2000,
        });
        window.location.reload();
      },
      onError: (error) => {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Account gagal dibuat",
          life: 2000,
        });
      },
    }
  );
};
</script>

<template>
  <div class="flex flex-column">
    <p class="text-sm m-0 mb-3">Kamu tidak memiliki account</p>
    <Button @click.prevent="handleCreateAccount" label="Buat Account Baru" icon="pi pi-plus" size="small" />
  </div>
</template>
