<script setup>
import { ref, getCurrentInstance } from "vue";
import AppHeaderBack from "@/components/AppHeaderBack.vue";
import { useMutation } from "@tanstack/vue-query";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

const toast = useToast();
const { proxy } = getCurrentInstance();

const axios = proxy.axios;
const showLeaveDialog = ref(false);
const leaveData = ref({
  startDate: null,
  endDate: null,
  reason: null,
});
const errorLeaveData = ref();
const router = useRouter();
const showChildren = ref(true);

const createLeaveRequestService = async (data) => {
  const response = await axios.post("/pegawai/modules/leave", {
    start_date: data.startDate,
    end_date: data.endDate,
    reason: data.reason,
  });
  return response.data;
};

const { mutate: createLeaveRequest, isPending: isCreatingLeaveRequest } =
  useMutation({
    mutationFn: createLeaveRequestService,
    mutationKey: ["createLeaveRequestService"],
  });

const submitLeaveRequest = async () => {
  errorLeaveData.value = null;
  showChildren.value = false;
  await createLeaveRequest(leaveData.value, {
    onSuccess: () => {
      toast.add({
        severity: "success",
        summary: "Berhasil",
        detail: "Izin berhasil diajukan",
        life: 3000,
      });
      showLeaveDialog.value = false;
      leaveData.value = {
        startDate: null,
        endDate: null,
        reason: null,
      };
      router.push({ name: "feature-leave" });
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
          errorLeaveData.value = response.data;
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
</script>

<template>
  <div>
    <AppHeaderBack title="Izin" />
    <div class="p-3 md:p-4 mt-8">
      <Button
        label="Ajukan Izin"
        class="w-full font-bold"
        size="large"
        icon="pi pi-plus-circle"
        @click="showLeaveDialog = true"
      />
      <Divider />
      <router-view v-if="showChildren"></router-view>
    </div>

    <Dialog
      v-model:visible="showLeaveDialog"
      modal
      :style="{ width: '90vw', maxWidth: '600px' }"
      :closable="!isCreatingLeaveRequest"
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
          <span class="text-xl font-bold text-900">Ajukan Izin</span>
        </div>
      </template>

      <div class="flex flex-column gap-2">
        <div class="field">
          <label
            for="startDate"
            class="block mb-2 text-base font-medium text-700"
            >Tanggal Mulai</label
          >
          <Calendar
            id="startDate"
            v-model="leaveData.startDate"
            dateFormat="dd/mm/yy"
            :minDate="new Date()"
            :showIcon="true"
            placeholder="Pilih tanggal mulai"
            :invalid="errorLeaveData && errorLeaveData.start_date"
          />
          <p
            v-if="errorLeaveData && errorLeaveData.start_date"
            class="text-red-500"
          >
            {{ errorLeaveData.start_date[0] }}
          </p>
        </div>
        <div class="field">
          <label for="endDate" class="block mb-2 text-base font-medium text-700"
            >Tanggal Selesai</label
          >
          <Calendar
            id="endDate"
            v-model="leaveData.endDate"
            dateFormat="dd/mm/yy"
            :minDate="leaveData.startDate || new Date()"
            :showIcon="true"
            placeholder="Pilih tanggal selesai"
            :invalid="errorLeaveData && errorLeaveData.end_date"
          />
          <p
            v-if="errorLeaveData && errorLeaveData.end_date"
            class="text-red-500"
          >
            {{ errorLeaveData.end_date[0] }}
          </p>
        </div>
        <div class="field">
          <label for="reason" class="block text-base font-medium text-700"
            >Alasan</label
          >
          <Textarea
            id="reason"
            v-model="leaveData.reason"
            rows="3"
            placeholder="Masukkan alasan izin"
            autoResize
            :invalid="errorLeaveData && errorLeaveData.reason"
          />
          <p
            v-if="errorLeaveData && errorLeaveData.reason"
            class="text-red-500"
          >
            {{ errorLeaveData.reason[0] }}
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2">
          <Button
            label="Batal"
            icon="pi pi-times"
            class="p-button-text"
            @click="showLeaveDialog = false"
            :loading="isCreatingLeaveRequest"
          />
          <Button
            label="Ajukan"
            icon="pi pi-send"
            @click="submitLeaveRequest"
            :loading="isCreatingLeaveRequest"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>
