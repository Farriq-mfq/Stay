<script setup>
import { useQuery, useMutation } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { capitalize, getCurrentInstance, ref, watch } from 'vue';
import { useConfirm } from "primevue/useconfirm";
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
  gateways: []
})
const addSessionService = async (data) => {
  return await axios.post('/sessions', data)
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
        gateways: []
      }
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
    header: 'Confirmation',
    message: 'Yakin Hapus Session Ini ?',
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
        onError(err) {
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
</script>
<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button label="Buat session baru" icon="pi pi-plus" class="mr-2"
                @click.prevent="addSessionDialog = true" />
            </div>
          </template>
        </Toolbar>
        <DataTable ref="dt" :totalRecords="totalRecords" v-model:expandedRows="expandedRows" :loading="isLoading"
          :value="isLoading ? [] : sessions.data.data.items" dataKey="id" paginator :rows="10" :filters="filters" lazy
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sessions" :first="first"
          @page="onPage($event)">
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">
                Session
              </h5>
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
          <Column field="count" alignFrozen="right" :frozen="true" header="Gateway yang digunakan">
            <template #body="{ data }">
              <Badge>
                {{ data.gateways.length }}
              </Badge>
            </template>
          </Column>
          <Column header="Status">
            <template #body="{ data }">
              <Tag v-if="data.status" value="Aktif" severity="primary" />
              <Tag v-else value="Tidak aktif" severity="danger" />
            </template>
          </Column>
          <Column headerStyle="width:4rem">
            <template #body="{ data }">
              <div class="flex gap-2 mt-1">
                <Button icon="pi pi-pencil" @click.prevent="handleShowDialogEditGateway(data)" />
                <Button outlined :loading="pendingUpdateStatusGateway" :disabled="pendingUpdateStatusGateway"
                  :severity="data.status ? 'danger' : 'success'"
                  @click.prevent="handleUpdateStatus(data.id, data.status)" icon="pi pi-power-off" />
                <Button :loading="deleteSessionPending" :disabled="deleteSessionPending" severity="danger"
                  @click.prevent="confirmDeleteSession(data.id)" icon="pi pi-trash" />
              </div>
            </template>
          </Column>
          <template #expansion="{ data }">
            {{ data.gateways }}
          </template>
        </DataTable>
      </div>
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
        <div class="field">
          <label for="gateways">Gateway (Optional)</label>
          <SelectGateway role="presence" multiple @input="handleChangeGateways" />
          <p class="text-red-500" v-if="errorsAddSession && errorsAddSession.gateways">
            {{ errorsAddSession.gateways[0] }}
          </p>
        </div>

        <template #footer>
          <Button label="Batal" :disabled="addSessionLoading" severity="danger" icon="pi pi-times" outlined
            @click.prevent="addSessionDialog = false" />
          <Button label="Simpan" :loading="addSessionLoading" :disabled="addSessionLoading" icon="pi pi-link"
            @click="handleAddSession" />
        </template>
      </Dialog>
    </div>
  </div>
</template>
