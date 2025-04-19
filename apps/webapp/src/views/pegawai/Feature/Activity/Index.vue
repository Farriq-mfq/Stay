<script setup>
import { ref, getCurrentInstance } from "vue";
import AppHeaderBack from "@/components/AppHeaderBack.vue";
import { useMutation } from "@tanstack/vue-query";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

const toast = useToast();
const { proxy } = getCurrentInstance();

const axios = proxy.axios;
const showActivityDialog = ref(false);
const activityData = ref({
  description: null,
});
const errorActivityData = ref();
const router = useRouter();
const showChildren = ref(true);

const createActivityRequestService = async (data) => {
  const response = await axios.post("/pegawai/modules/activity", {
    description: data.description,
  });
  return response.data;
};

const { mutate: createActivityRequest, isPending: isCreatingActivityRequest } =
  useMutation({
    mutationFn: createActivityRequestService,
    mutationKey: ["createActivityRequestService"],
  });

const submitActivityRequest = async () => {
  errorActivityData.value = null;
  showChildren.value = false;
  await createActivityRequest(activityData.value, {
    onSuccess: () => {
      toast.add({
        severity: "success",
        summary: "Berhasil",
        detail: "Uraian Kegiatan berhasil disimpan",
        life: 3000,
      });
      showActivityDialog.value = false;
      activityData.value = {
       description: null,
      };
      router.push({ name: "feature-journal-activity" });
    },
    onError: (error) => {
      const response = error.response;

      if (response.status == 400) {
        if (response.data.message) {
          toast.add({
            severity: "error",
            summary: "Gagal",
            detail: response.data.message,
            life: 3000,
          });
        } else {
          errorActivityData.value = response.data;
        }
      } else {
        toast.add({
          severity: "error",
          summary: "Gagal",
          detail: "Terjadi Kesalahan",
          life: 3000,
        });
      }
    },
    onSettled: () => {
      showChildren.value = true;
    },
  });
};

const handleShowDialog = () => {
  errorActivityData.value = null;
  showActivityDialog.value = true;
};
</script>

<template>
  <div>
    <AppHeaderBack title="Jurnal Kegiatan" />
    <div class="p-3 md:p-4 mt-8">
      <Button
        label="Buat Jurnal Kegiatan"
        class="w-full font-bold"
        @click="handleShowDialog"
      />
      <Divider />
      <router-view v-if="showChildren"></router-view>
    </div>

    <Dialog
      v-model:visible="showActivityDialog"
      modal
      :style="{ width: '90vw', maxWidth: '600px' }"
      :closable="!isCreatingActivityRequest"
      :draggable="false"
      class="p-fluid"
    >
      <template #header>
        <div class="flex align-items-center gap-3">
          <div
            class="w-2rem h-2rem flex align-items-center justify-content-center"
          >
            <i class="pi pi-plus-circle text-primary text-xl"></i>
          </div>
          <span class="text-xl font-bold text-900"> Jurnal Kegiatan </span>
        </div>
      </template>

      <div class="flex flex-column gap-2">
        <div class="field">
          <label for="description" class="block text-base font-medium text-700">
            Uraian Kegiatan
          </label>
          <Textarea
            id="description"
            v-model="activityData.description"
            rows="5"
            placeholder="Masukkan uraian kegiatan"
            autoResize
            :invalid="errorActivityData && errorActivityData.description"
          />
          <p
            v-if="errorActivityData && errorActivityData.description"
            class="text-red-500"
          >
            {{ errorActivityData.description[0] }}
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2">
          <Button
            label="Batal"
            icon="pi pi-times"
            class="p-button-text"
            @click="showActivityDialog = false"
            :loading="isCreatingActivityRequest"
          />
          <Button
            label="Kirim"
            icon="pi pi-send"
            @click="submitActivityRequest"
            :loading="isCreatingActivityRequest"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>
