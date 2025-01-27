<script setup>
import { useQuery, useMutation } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, ref, watch } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import Calendar from 'primevue/calendar';
import Chip from 'primevue/chip'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
const toast = useToast();
const { proxy } = getCurrentInstance()
const axios = proxy.axios
const confirm = useConfirm();

// datatable server side
const expandedRows = ref({});
const filters = ref(null);
const first = ref(0);
const queryParams = ref({
  first: 0,
  rows: 10,
})
const totalRecords = ref(0);
const dt = ref()

const selectedGroup = ref([]);


const getAllSessions = async () => {
  const queries = {
    page: (queryParams.value.first / queryParams.value.rows) + 1,
    limit: queryParams.value.rows,
    ...filters.value && { search: filters.value }
  }

  const params = new URLSearchParams(queries)

  return await axios.get(`/sessions?${params}`)
}
const { data: sessions, isLoading, refetch } = useQuery({
  queryKey: ['sessions', queryParams.value],
  queryFn: getAllSessions,
  keepPreviousData: true,
})


const onPage = (event) => {
  queryParams.value = event;
  refetch()
};

watch(sessions, () => {
  if (sessions.value) {
    totalRecords.value = sessions.value.data.data.meta.totalCount
  }
})
const handleDebounceFilter = (val) => {
  filters.value = val;
  refetch()
}

// add session
const addSessionDialog = ref(false)
const errorsAddSession = ref({})
const sessionData = ref({
  name: '',
  start_time: null,
  end_time: null,
  allow_twice: false,
  gateways: [],
})



const addSessionService = async (data) => {
  return await axios.post('/sessions', {
    name: data.name,
    start_time: data.start_time ? format(data.start_time, 'HH:mm:ss') : null,
    end_time: data.end_time ? format(data.end_time, 'HH:mm:ss') : null,
    allow_twice: data.allow_twice,
    gateways: data.gateways,
    group: selectedGroup.value.length ? selectedGroup.value.map(item => item.value) : []
  })
}

const {
  isPending: addSessionLoading,
  mutateAsync: addSession,
} = useMutation({
  mutationKey: ['addSession'],
  mutationFn: addSessionService,
})

const handleAddSession = () => {
  addSession(sessionData.value, {
    onSuccess: () => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Session berhasil ditambahkan',
        life: 3000,
      });
      addSessionDialog.value = false
      sessionData.value = {
        name: '',
        start_time: null,
        end_time: null,
        allow_twice: false,
        gateways: [],
      }
      selectedGroup.value = []
      refetch()
    },
    onError: (err) => {
      if (err.response.status === 400) {
        errorsAddSession.value = err.response.data
      } else if (err.response.status === 404) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Gateway sudah digunakan atau belum tersedia',
          life: 3000,
        });
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Session gagal ditambahkan',
          life: 3000,
        });
      }

    }
  })
}
const handleChangeGateways = (val) => {
  const gateways = val.map((gateway) => gateway.id)
  sessionData.value.gateways = gateways
}

// delete sesion
const deleteSessionService = async (id) => {
  return await axios.delete(`/sessions/${id}`)
}

const {
  mutateAsync: deleteSession,
  isPending: deleteSessionPending,
} = useMutation({
  mutationKey: ['deleteSessionService'],
  mutationFn: deleteSessionService,
})

const confirmDeleteSession = (id) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Konfirmasi',
    message: 'Yakin hapus sesi presensi ini ?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Batalkan',
    acceptLabel: 'Hapus',
    accept: () => {
      deleteSession(id, {
        onSuccess() {
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Session berhasil dihapus',
            life: 3000
          })
          refetch()
        },
        onError() {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Session gagal dihapus',
            life: 3000
          })
        }
      })
    },
  });
};
// update
const showDialogUpdateSession = ref(false)
const dataUpdateSession = ref({
  name: '',
  start_time: null,
  end_time: null,
  allow_twice: false,
  gateways: []
})
const errorsUpdateSession = ref({})


const updateService = async (data) => {
  return await axios.patch(`/sessions/${data.id}`, {
    name: data.name,
    allow_twice: data.allow_twice,
    start_time: data.start_time,
    end_time: data.end_time,
    ...data.gateways && data.gateways.length && {
      gateways: data.gateways
    },
    group: selectedGroup.value.length ? selectedGroup.value.map(item => item.value) : []
  })
}

const handleChangeUpdateSessionGateway = (val) => {
  const gateways = val.map((gateway) => gateway.id)
  dataUpdateSession.value.gateways = gateways
}

const {
  isPending: updateSessionLoading,
  mutateAsync: updateSession,
} = useMutation({
  mutationKey: ['updateSession'],
  mutationFn: updateService,
})

const handleShowDialogUpdateSesion = (data) => {
  showDialogUpdateSession.value = true
  errorsUpdateSession.value = {}
  const now = format(Date.now(), "yyyy-MM-dd")
  dataUpdateSession.value = {
    id: data.id,
    name: data.name,
    ...data.start_time && { start_time: new Date(`${now} ${data.start_time}`) },
    ...data.end_time && { end_time: new Date(`${now} ${data.end_time}`) },
    allow_twice: data.allow_twice,
    gateways: data.gateways,
  }

  selectedGroup.value = data.group ? JSON.parse(data.group).map(item => ({ value: item })) : []
}

const clearUpdateSession = () => {
  dataUpdateSession.value = {
    name: '',
    start_time: null,
    end_time: null,
    allow_twice: false,
    gateways: []
  }

  showDialogUpdateSession.value = false
  selectedGroup.value = []
}

const handleSubmitUpdateSesion = () => {
  updateSession({
    id: dataUpdateSession.value.id,
    name: dataUpdateSession.value.name,
    allow_twice: dataUpdateSession.value.allow_twice,
    start_time: dataUpdateSession.value.start_time ? format(dataUpdateSession.value.start_time, 'HH:mm:ss') : null,
    end_time: dataUpdateSession.value.end_time ? format(dataUpdateSession.value.end_time, 'HH:mm:ss') : null,
    ...dataUpdateSession.value.gateways.length && {
      gateways: dataUpdateSession.value.gateways
    }
    ,
    group: selectedGroup.value.length ? selectedGroup.value.map(item => item.value) : []
  }, {
    onSuccess() {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Session berhasil diupdate',
        life: 3000
      })

      errorsUpdateSession.value = {}
      clearUpdateSession()
      refetch()
    },
    onError: (err) => {
      if (!err.response) return;
      if (err.response.status === 400) {
        errorsUpdateSession.value = err.response.data
      } else if (err.response.status === 404) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Gateway sudah digunakan atau belum tersedia',
          life: 3000,
        });
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Session gagal diupdate',
          life: 3000,
        });
      }
    }
  })
}
// get rombel service
const getRombel = async () => {
  return await axios.get('/siswa/rombel');
}

const { data: dataRombels, isLoading: loadingRombel } = useQuery({
  queryKey: ['rombel'],
  queryFn: getRombel
})




// camera
const router = proxy.$router;
const handlePushCamera = (id) => {
  router.push({
    name: 'camera-scan',
    params: {
      id
    }
  })
}
// qrcode
const showdialogQrCode = ref(false)
const dataQr = ref({
  qrcode: '',
  name: ''
})
const handleShowQrCode = (data) => {
  showdialogQrCode.value = true
  dataQr.value = {
    qrcode: data.qrcode,
    name: data.name
  }
}
const clearDialogQrCode = () => {
  showdialogQrCode.value = false
  dataQr.value = {
    qrcode: '',
    name: ''
  }
}
</script>
<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h3>Sesi Presensi</h3>
        <hr>
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button label="Buat sesi presensi baru" icon="pi pi-plus" class="mr-2"
                @click.prevent="addSessionDialog = true" />
            </div>
          </template>
        </Toolbar>
        <DataTable ref="dt" :totalRecords="totalRecords" v-model:expandedRows="expandedRows" :loading="isLoading"
          :value="isLoading ? [] : sessions.data.data.items" dataKey="id" paginator :rows="10" :filters="filters" lazy
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[10, 25, 50]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sessions" :first="first"
          @page="onPage($event)">
          <template #header>
            <div class="flex flex-column  md:flex-row md:justify-content-end md:align-items-center">
              <IconField iconPosition="left" class="block mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText v-debounce:300ms="handleDebounceFilter" class="w-full sm:w-auto" placeholder="Search..." />
              </IconField>
            </div>
          </template>
          <template #empty>
            <div class="flex justify-content-center p-4 gap-3 align-items-center">
              <i class="pi pi-folder-open"></i>
              <span>
                Data session masih kosong
              </span>
            </div>
          </template>
          <Column expander />
          <Column field="name" header="Nama">
          </Column>
          <Column field="allow_twice" header="Presensi 2x">
            <template #body="{ data }">

              <Chip class="py-0 pl-0 pr-4">
                <span :class="{ 'bg-primary': data.allow_twice, 'bg-red-400': !data.allow_twice }"
                  class="border-circle w-2rem h-2rem flex align-items-center justify-content-center text-white">
                  <i :class="{ 'pi pi-check': data.allow_twice, 'pi pi-times': !data.allow_twice }"></i></span>
                <span class="ml-2 font-medium">
                  {{ data.allow_twice ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </Chip>
            </template>
          </Column>
          <Column field="start_time" header="Waktu Mulai">
            <template #body="{ data }">
              <Chip class="bg-primary text-white text-sm" :label="data.start_time" v-if="data.start_time" />
              <p v-else>-</p>
            </template>
          </Column>
          <Column field="end_time" header="Waktu Selesai">
            <template #body="{ data }">
              <Chip class="bg-red-400 text-white text-sm" :label="data.end_time" v-if="data.end_time" />
              <p v-else>-</p>
            </template>
          </Column>
          <Column field="group" header="Group yang diijinkan">
            <template #body="{ data }">
              <div v-if="data.group && JSON.parse(data.group).length > 0">
                <Chip class="bg-primary text-white text-sm m-2" :label="rmbl" v-for="rmbl in JSON.parse(data.group)"
                  :key="rmbl" />
              </div>
              <p v-else>-</p>
            </template>
          </Column>
          <Column field="count" alignFrozen="right" :frozen="true" header="Gateway yang digunakan">
            <template #body="{ data }">
              <Badge>
                {{ data.gateways.length }}
              </Badge>
            </template>
          </Column>
          <Column headerStyle="width:4rem">
            <template #body="{ data }">
              <div class="flex gap-2 mt-1">
                <Button icon="pi pi-pencil" @click.prevent="handleShowDialogUpdateSesion(data)" />
                <Button :loading="deleteSessionPending" :disabled="deleteSessionPending" severity="danger"
                  @click.prevent="confirmDeleteSession(data.id)" icon="pi pi-trash" />
                <!-- <Button icon="pi pi-camera" @click.prevent="handlePushCamera(data.id)" />
                <Button icon="pi pi-qrcode" @click.prevent="handleShowQrCode(data)" /> -->
              </div>
            </template>
          </Column>
          <template #expansion="{ data }">
            <!-- {{ data.gateways }} -->
            <DataView :value="data.gateways">
              <template #list="slotProps">
                <div class="card" v-for="(item, index) in slotProps.items" :key="index">
                  <div class="flex align-items-center gap-3">
                    <div :class="`${item.status ? 'bg-primary' : 'bg-red-500'} h-1rem w-1rem border-circle`">
                    </div>
                    <div class="flex flex-column gap-2">
                      <span>{{ item.name }} - {{ item.location }}</span>
                      <Tag class="w-fit">{{ item.ip }}</Tag>
                    </div>
                  </div>
                </div>
              </template>
            </DataView>
          </template>
        </DataTable>
      </div>
      <!-- create -->
      <Dialog v-model:visible="addSessionDialog" :style="{ width: '450px' }" header="Tambah Session Baru" :modal="true"
        class="p-fluid">
        <div class="field">
          <label for="name">Nama</label>
          <InputText id="name" :disabled="addSessionLoading" :invalid="errorsAddSession && errorsAddSession.name"
            required="true" autofocus v-model="sessionData.name" />
          <p class="text-red-500" v-if="errorsAddSession && errorsAddSession.name">
            {{ errorsAddSession.name[0] }}
          </p>
        </div>
        <div class="field flex gap-2 flex-column">
          <label for="allow_twice">Presensi 2x</label>
          <InputSwitch v-model="sessionData.allow_twice" :disabled="addSessionLoading" />
        </div>
        <div class="field">
          <label for="start_time">
            Waktu Mulai (Optional)
          </label>
          <Calendar timeOnly id="calendar-24h-mulai" v-model="sessionData.start_time" hourFormat="24" showSeconds
            :disabled="addSessionLoading" showButtonBar showIcon />
          <p class="text-red-500" v-if="errorsAddSession && errorsAddSession.start_time">
            {{ errorsAddSession.start_time[0] }}
          </p>
        </div>
        <div class="field">
          <label for="end_time">
            Waktu Selesai (Optional)
          </label>
          <Calendar timeOnly id="calendar-24h-selesai" v-model="sessionData.end_time" showTime hourFormat="24"
            :disabled="addSessionLoading" showSeconds showButtonBar showIcon />
          <p class="text-red-500" v-if="errorsAddSession && errorsAddSession.end_time">
            {{ errorsAddSession.end_time[0] }}
          </p>
        </div>
        <div class="field">
          <label for="gateways">Gateway (Optional)</label>
          <SelectGateway role="presence" multiple @input="handleChangeGateways" />
          <p class="text-red-500" v-if="errorsAddSession && errorsAddSession.gateways">
            {{ errorsAddSession.gateways[0] }}
          </p>
        </div>
        <div class="field">
          <label for="gateways">Group (Optional)</label>
          <MultiSelect :loading="loadingRombel" filter v-model="selectedGroup"
            :options="dataRombels ? dataRombels.data.data.map(item => ({ value: item })) : []" optionLabel="value"
            placeholder="Pilih Rombel" class="w-full" />
          <p class="text-red-500" v-if="errorsAddSession && errorsAddSession.rombel">
            {{ errorsAddSession.rombel[0] }}
          </p>
        </div>

        <template #footer>
          <Button label="Batal" :disabled="addSessionLoading" severity="danger" icon="pi pi-times" outlined
            @click.prevent="addSessionDialog = false" />
          <Button label="Simpan" :loading="addSessionLoading" :disabled="addSessionLoading" icon="pi pi-link"
            @click="handleAddSession" />
        </template>
      </Dialog>
      <Dialog v-model:visible="showDialogUpdateSession" :style="{ width: '450px' }" header="Edit Session" :modal="true"
        class="p-fluid" @after-hide="clearUpdateSession">
        <div class="field">
          <label for="name">Nama</label>
          <InputText id="name" :disabled="updateSessionLoading"
            :invalid="errorsUpdateSession && errorsUpdateSession.name" required="true" autofocus
            v-model="dataUpdateSession.name" />
          <p class="text-red-500" v-if="errorsUpdateSession && errorsUpdateSession.name">
            {{ errorsUpdateSession.name[0] }}
          </p>
        </div>
        <div class="field flex gap-2 flex-column">
          <label for="allow_twice">Presensi 2x</label>
          <InputSwitch v-model="dataUpdateSession.allow_twice" :disabled="updateSessionLoading" />
        </div>
        <div class="field">
          <label for="start_time">
            Waktu Mulai (Optional)
          </label>
          <Calendar id="calendar-24h-mulai" timeOnly showSeconds showIcon v-model="dataUpdateSession.start_time"
            showTime hourFormat="24" :invalid="errorsUpdateSession && errorsUpdateSession.start_time"
            :disabled="updateSessionLoading" showButtonBar />
          <p class="text-red-500" v-if="errorsUpdateSession && errorsUpdateSession.start_time">
            {{ errorsUpdateSession.start_time[0] }}
          </p>
        </div>
        <div class="field">
          <label for="end_time">
            Waktu Selesai (Optional)
          </label>
          <Calendar id="calendar-24h-selesai" timeOnly showSeconds showIcon v-model="dataUpdateSession.end_time"
            showTime hourFormat="24" :invalid="errorsUpdateSession && errorsUpdateSession.end_time"
            :disabled="updateSessionLoading" showButtonBar />
          <p class="text-red-500" v-if="errorsUpdateSession && errorsUpdateSession.end_time">
            {{ errorsUpdateSession.end_time[0] }}
          </p>
        </div>
        <div class="field">
          <label for="gateways">Gateway (Optional)</label>
          <SelectGateway role="presence" :defaultValue="dataUpdateSession.gateways" multiple
            @input="handleChangeUpdateSessionGateway" />
          <p class="text-red-500" v-if="errorsUpdateSession && errorsUpdateSession.gateways">
            {{ errorsUpdateSession.gateways[0] }}
          </p>
        </div>

        <div class="field">
          <label for="gateways">Group (Optional)</label>
          <MultiSelect :loading="loadingRombel" filter v-model="selectedGroup"
            :options="dataRombels ? dataRombels.data.data.map(item => ({ value: item })) : []" optionLabel="value"
            placeholder="Pilih Rombel" class="w-full" />
          <p class="text-red-500" v-if="errorsUpdateSession && errorsUpdateSession.rombel">
            {{ errorsUpdateSession.rombel[0] }}
          </p>
        </div>

        <template #footer>
          <Button label="Batal" :disabled="updateSessionLoading" severity="danger" icon="pi pi-times" outlined
            @click.prevent="showDialogUpdateSession = false" />
          <Button label="Update" :loading="updateSessionLoading" :disabled="updateSessionLoading" icon="pi pi-link"
            @click="handleSubmitUpdateSesion" />
        </template>
      </Dialog>
      <Dialog v-model:visible="showdialogQrCode" :modal="true" @after-hide="clearDialogQrCode">
        <div class="w-full flex flex-column justify-content-center align-items-center text-center"
          :id="`qrsession-${dataQr.qrcode}`">
          <h1 class="text-6xl font-bold underline">
            {{ dataQr.name }}
          </h1>
          <vue-qrcode :value="dataQr.qrcode" :options="{ width: 800 }"></vue-qrcode>
        </div>
        <template #footer>
          <Button label="Batal" severity="danger" icon="pi pi-times" outlined
            @click.prevent="showdialogQrCode = false" />
          <Button label="Cetak" v-print="`#qrsession-${dataQr.qrcode}`" icon="pi pi-print" />
        </template>
      </Dialog>
    </div>
  </div>
</template>
