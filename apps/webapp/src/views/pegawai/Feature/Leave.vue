<template>
  <div>
    <AppHeaderBack title="Izin" />    
    <!-- Leave Request Form -->
    <div class="p-3 md:p-4 mt-8">
      <Card class="mb-4 transform transition-all hover:shadow-lg">
        <template #title>
          <div class="flex align-items-center gap-3 pb-2 border-bottom-1 border-primary-100">
            <div class="w-2rem h-2rem flex align-items-center justify-content-center bg-primary-50 border-circle">
              <i class="pi pi-plus-circle text-primary text-xl"></i>
            </div>
            <span class="text-xl font-bold text-900">Ajukan Izin</span>
          </div>
        </template>
        <template #content>
          <div class="flex flex-column gap-4">
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="startDate" class="block mb-2 text-base font-medium text-700">Tanggal Mulai</label>
                  <Calendar
                    id="startDate"
                    v-model="startDate"
                    dateFormat="dd/mm/yy"
                    class="w-full transition-all"
                    :minDate="new Date()"
                    :showIcon="true"
                    placeholder="Pilih tanggal mulai"
                  />
                </div>
              </div>
              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="endDate" class="block mb-2 text-base font-medium text-700">Tanggal Selesai</label>
                  <Calendar
                    id="endDate"
                    v-model="endDate"
                    dateFormat="dd/mm/yy"
                    class="w-full transition-all"
                    :minDate="startDate || new Date()"
                    :showIcon="true"
                    placeholder="Pilih tanggal selesai"
                  />
                </div>
              </div>
            </div>
            <div class="field">
              <label for="duration" class="block mb-2 text-base font-medium text-700">Durasi</label>
              <div class="p-inputgroup">
                <InputNumber
                  id="duration"
                  v-model="duration"
                  :min="1"
                  :max="12"
                  class="w-full"
                  placeholder="Jumlah hari"
                  :showButtons="false"
                />
                <span class="p-inputgroup-addon">Hari</span>
              </div>
            </div>
            <div class="field">
              <label for="reason" class="block mb-2 text-base font-medium text-700">Alasan</label>
              <Textarea
                id="reason"
                v-model="reason"
                rows="3"
                class="w-full transition-all"
                placeholder="Masukkan alasan izin"
                autoResize
              />
            </div>
            <Button
              label="Ajukan Izin"
              icon="pi pi-send"
              class="w-full p-button-lg p-button-raised transition-all hover:shadow-md"
              @click="submitLeaveRequest"
            />
          </div>
        </template>
      </Card>

      <!-- Leave History -->
      <Card class="transform transition-all hover:shadow-lg">
        <template #title>
          <div class="flex align-items-center gap-3 pb-2 border-bottom-1 border-primary-100">
            <div class="w-2rem h-2rem flex align-items-center justify-content-center bg-primary-50 border-circle">
              <i class="pi pi-history text-primary text-xl"></i>
            </div>
            <span class="text-xl font-bold text-900">Riwayat Izin</span>
          </div>
        </template>
        <template #content>
          <div class="flex flex-column gap-3">
            <div v-for="(item, index) in leaveHistory" 
                 :key="index" 
                 class="surface-card p-3 border-round-xl shadow-1 transform transition-all hover:shadow-md cursor-pointer">
              <div class="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3">
                <div class="flex align-items-center gap-3">
                  <div class="w-2rem h-2rem flex align-items-center justify-content-center bg-primary-50 border-circle">
                    <i class="pi pi-calendar text-primary"></i>
                  </div>
                  <div class="flex flex-column gap-1">
                    <span class="font-semibold text-base text-900">{{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}</span>
                    <span class="text-600">{{ item.duration }} hari</span>
                  </div>
                </div>
                <Tag
                  :value="item.status"
                  :severity="getStatusSeverity(item.status)"
                  class="text-sm font-medium px-3 py-2"
                />
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppHeaderBack from '@/components/AppHeaderBack.vue';

const duration = ref(1);
const startDate = ref(null);
const endDate = ref(null);
const reason = ref('');

const leaveHistory = ref([
  {
    startDate: '2024-03-01',
    endDate: '2024-03-03',
    duration: 3,
    status: 'Disetujui'
  },
  {
    startDate: '2024-02-15',
    endDate: '2024-02-16',
    duration: 2,
    status: 'Disetujui'
  },
  {
    startDate: '2024-03-10',
    endDate: '2024-03-12',
    duration: 3,
    status: 'Menunggu'
  }
]);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'Disetujui':
      return 'success';
    case 'Menunggu':
      return 'warning';
    case 'Ditolak':
      return 'danger';
    default:
      return 'info';
  }
};

const submitLeaveRequest = () => {
  // Implement leave request submission logic here
  console.log('Submitting leave request:', {
    duration: duration.value,
    startDate: startDate.value,
    endDate: endDate.value,
    reason: reason.value
  });
};
</script>

<style scoped>
.p-card {
  background: var(--surface-card);
  border-radius: 1rem;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease-in-out;
}

.p-card .p-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

:deep(.p-calendar),
:deep(.p-inputnumber),
:deep(.p-inputtext),
:deep(.p-textarea) {
  transition: all 0.3s ease;
}

:deep(.p-calendar:hover),
:deep(.p-inputnumber:hover),
:deep(.p-inputtext:hover),
:deep(.p-textarea:hover) {
  border-color: var(--primary-color);
}

:deep(.p-calendar:focus),
:deep(.p-inputnumber:focus),
:deep(.p-inputtext:focus),
:deep(.p-textarea:focus) {
  box-shadow: 0 0 0 2px var(--surface-ground), 0 0 0 4px var(--primary-color);
}

:deep(.p-inputnumber-input),
:deep(.p-calendar-w-btn .p-inputtext),
:deep(.p-textarea) {
  font-size: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
}

:deep(.p-button) {
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.p-button:hover) {
  transform: translateY(-1px);
}

:deep(.p-tag) {
  border-radius: 2rem;
  font-weight: 600;
}

:deep(.p-inputgroup-addon) {
  background: var(--surface-100);
  border-color: var(--surface-300);
  color: var(--text-color-secondary);
  font-weight: 500;
}

@media screen and (max-width: 768px) {
  :deep(.p-card) {
    margin-bottom: 1rem;
  }
  
  :deep(.p-inputtext),
  :deep(.p-inputnumber-input),
  :deep(.p-textarea) {
    font-size: 16px;
  }
}

.transform {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>

