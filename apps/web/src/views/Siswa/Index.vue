<script setup>
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, ref, watch } from 'vue';
import SelectGateway from '@/components/SelectGateway.vue'
import { useConfirm } from "primevue/useconfirm";
import { useStorage } from '@vueuse/core'
const { proxy } = getCurrentInstance()
const axios = proxy.axios
const toast = useToast();
const confirm = useConfirm();

// show data siswa
const expandedRows = ref({});
const filters = ref(null);
const first = ref(0);
const queryParams = ref({
  first: 0,
  rows: 10,
})

const totalRecords = ref(0)

const getAllSiswa = async () => {
  const queries = {
    page: (queryParams.value.first / queryParams.value.rows) + 1,
    perpage: queryParams.value.rows,
    ...filters.value && { search: filters.value }
  }

  const params = new URLSearchParams(queries)

  return await axios.get(`/siswa?${params}`)
}

const { data: siswa, refetch, isLoading } = useQuery({
  queryKey: ['siswa', queryParams.value],
  queryFn: getAllSiswa,
})


const onPage = (event) => {
  queryParams.value = event;
  refetch()
};

watch(siswa, () => {
  if (siswa.value) {
    totalRecords.value = siswa.value.data.data.meta.totalCount
  }
})

const handleDebounceFilter = (val) => {
  filters.value = val;
  refetch()
}

// add siswa

const showDialogAddSiswa = ref(false)
const errorsAddSiswa = ref(null)

const addSiswa = async (data) => {
  return await axios.post('/siswa', data)
}

const siswaData = ref({
  nis: '',
  nisn: '',
  notelp: '',
  name: '',
  rombel: ''
})

const { mutateAsync: addSiswaMutate, isPending: addSiswaPending } = useMutation({
  mutationKey: ['addSiswa'],
  mutationFn: addSiswa,
})

const handleSubmitAddSiswa = () => {
  addSiswaMutate(siswaData.value, {
    onSuccess() {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data siswa berhasil ditambahkan',
        life: 3000
      })
      showDialogAddSiswa.value = false
      siswaData.value = {
        nis: '',
        nisn: '',
        notelp: '',
        name: '',
        rombel: ''
      }
      refetch()
    },
    onError(err) {
      console.log(err)
      if (err.response.status === 400) {
        errorsAddSiswa.value = err.response.data
      } else if (err.response.status === 409) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Data siswa sudah ada',
          life: 3000
        })
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Data siswa gagal ditambahkan',
          life: 3000
        })
      }
    }
  })
}
// remove
const showdialogRemoveSiswa = ref(false)
const siswaRemove = ref(null)
const handleShowDialogSiswaRemove = (data) => {
  siswaRemove.value = data
  showdialogRemoveSiswa.value = true
}

const removeSiswaService = async (data) => {
  return await axios.delete(`/siswa/${data.id}`)
}

const { mutateAsync: removeSiswaMutate, isPending: removeSiswaPending } = useMutation({
  mutationKey: ['removeSiswa'],
  mutationFn: removeSiswaService,
})


const handleSiswaRemove = () => {
  removeSiswaMutate(siswaRemove.value, {
    onSuccess() {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data siswa berhasil dihapus',
        life: 3000
      })
      showdialogRemoveSiswa.value = false
      siswaRemove.value = null
      refetch()
    },
    onError() {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Data siswa gagal dihapus',
        life: 3000
      })
    }
  })
}


const clearRemoveState = () => {
  siswaRemove.value = {
    nis: '',
    nisn: '',
    notelp: '',
    name: '',
    rombel: ''
  }
}
// update data siswa

const showDialogUpdateSiswa = ref(false)
const errorsUpdateSiswa = ref(null)
const dataUpdateSiswa = ref({
  nis: '',
  nisn: '',
  notelp: '',
  name: '',
  rombel: ''
})

const updateSiswaService = async (data) => {
  console.log(data)
  return await axios.patch(`/siswa/${data.id}`, data)
}

const { mutateAsync: updateSiswaMutate, isPending: updateSiswaPending } = useMutation({
  mutationKey: ['updateSiswa'],
  mutationFn: updateSiswaService,
})

const handleSubmitUpdateSiswa = () => {
  updateSiswaMutate(dataUpdateSiswa.value, {
    onSuccess() {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data siswa berhasil diubah',
        life: 3000
      })
      showDialogUpdateSiswa.value = false
      dataUpdateSiswa.value = null
      refetch()
    },
    onError(err) {
      if (err.response.status === 400) {
        errorsUpdateSiswa.value = err.response.data
      } else if (err.response.status === 409) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Data siswa sudah ada',
          life: 3000
        })
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Data siswa gagal diubah',
          life: 3000
        })
      }
    }
  })
}

const handleShowDialogUpdateSiswa = (data) => {
  dataUpdateSiswa.value = {
    id: data.id,
    nis: data.nis,
    nisn: data.nisn,
    notelp: data.notelp,
    name: data.name,
    rombel: data.rombel
  }
  showDialogUpdateSiswa.value = true
}

const clearUpdateState = () => {
  dataUpdateSiswa.value = {
    nis: '',
    nisn: '',
    notelp: '',
    name: '',
    rombel: ''
  }
  errorsUpdateSiswa.value = null
}

// register RFID card

const showDialogRegisterCard = ref(false)
const errorsRegisterCard = ref(null)
const scannedToken = ref(null)

const dataRegisterCard = ref({
  nis: '',
  nisn: '',
  notelp: '',
  name: '',
  rombel: '',
  token: ''
})

const registerCardService = async (data) => {
  return await axios.post(`/siswa/${data.id}/rfid-token`, {
    token: scannedToken.value
  })
}

const { mutateAsync: registerCardMutate, isPending: registerCardPending } = useMutation({
  mutationKey: ['registerCard'],
  mutationFn: registerCardService,
})

const handleShowDialogRegisterCard = (data) => {
  dataRegisterCard.value = {
    id: data.id,
    nis: data.nis,
    nisn: data.nisn,
    notelp: data.notelp,
    name: data.name,
    rombel: data.rombel,
  }

  showDialogRegisterCard.value = true
  if (defaultGateway.value) {
    selectedGateway.value = JSON.parse(defaultGateway.value)
  }
}

const handleSubmitRegisterCard = () => {
  registerCardMutate(dataRegisterCard.value, {
    onSuccess() {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'RFID card berhasil didaftarkan',
        life: 3000
      })
      showDialogRegisterCard.value = false
      dataRegisterCard.value = null
      refetch()
    },
    onError(err) {
      if (err.response.status === 400) {
        errorsRegisterCard.value = err.response.data
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'RFID card gagal didaftarkan',
          life: 3000
        })
      }
    }
  })
}

const clearRegisterCard = () => {
  dataRegisterCard.value = {
    nis: '',
    nisn: '',
    notelp: '',
    name: '',
    rombel: ''
  }
  errorsRegisterCard.value = null
  scannedToken.value = null
  selectedGateway.value = null
}

const socket = proxy.socket
const selectedGateway = ref()

watch(() => [showDialogRegisterCard.value, selectedGateway.value], (val) => {
  if (val && selectedGateway.value) {
    socket.on(`READER_${selectedGateway.value.ip}`, (data) => {
      scannedToken.value = data.toString()
      socket.off(`READER_${selectedGateway.value.ip}`);
    })
  }
})

const handleSelectedGateway = (val) => {
  selectedGateway.value = val
  scannedToken.value = null
}


// show qrCode
const showDialogQrcode = ref(false)
const qrCode = ref({
  nis: '',
  nisn: '',
  notelp: '',
  name: '',
  rombel: ''
})
const handleShowDialogQrcode = (data) => {
  qrCode.value = data
  showDialogQrcode.value = true
}
// reset rfid token
const resetTokenRfid = async (id) => {
  return await axios.delete(`/siswa/${id}/rfid-token`)
}
const {
  mutateAsync: resetToken,
  isPending: resetTokenPending,
} = useMutation({
  mutationKey: ['resetTokenRfid'],
  mutationFn: resetTokenRfid,
})


const confirmResetRFID = (event, data) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Yakin ingin reset kartu RFID ?',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Batalkan',
    acceptLabel: 'Reset',
    accept: () => {
      resetToken(data.id, {
        onSuccess() {
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'RFID card berhasil didaftarkan',
            life: 3000
          })
          showDialogRegisterCard.value = false
          dataRegisterCard.value = null
          refetch()
        },
        onError() {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'RFID card gagal didaftarkan',
            life: 3000
          })
        }
      })
    },
  });
};

// set default gateway
const defaultGateway = useStorage('default-gateway', selectedGateway.value)

const setDefaultGateway = () => {
  if (selectedGateway.value) {
    localStorage.setItem('default-gateway', JSON.stringify(selectedGateway.value))
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Gateway belum dipilih',
      life: 3000
    })
  }
}


</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button label="Tambah Siswa" icon="pi pi-plus" class="mr-2" @click.prevent="showDialogAddSiswa = true" />
              <Button label="Import Siswa" icon="pi pi-arrow-up" severity="success" class="mr-2"
                @click.prevent="showDialogAddSiswa = true" />
            </div>
          </template>
        </Toolbar>
        <DataTable ref="dt" :totalRecords="totalRecords" v-model:expandedRows="expandedRows" :loading="isLoading"
          :value="isLoading ? [] : siswa.data.data.items" dataKey="id" paginator :rows="10" :filters="filters" lazy
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} siswa" :first="first"
          @page="onPage($event)">
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">
                Siswa
              </h5>
              <IconField iconPosition="left" class="block mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText v-debounce:300ms="handleDebounceFilter" class="w-full sm:w-auto" placeholder="Search..." />
              </IconField>
            </div>
          </template>
          <Column expander />
          <Column field="name" header="Nama">
          </Column>
          <Column field="notelp" header="NoTelp">
          </Column>
          <Column field="nisn" header="NISN">
          </Column>
          <Column field="nis" header="NIS">
          </Column>
          <Column field="rombel" header="Rombel">
          </Column>
          <Column field="rfid_token" header="Status Kartu">
            <template #body="{ data }">
              <Tag :severity="data.rfid_token ? 'primary' : 'danger'">
                <i class="pi pi-check" v-if="data.rfid_token"></i>
                <i class="pi pi-times" v-else></i>
              </Tag>
            </template>
          </Column>
          <Column headerStyle="width:4rem">
            <template #body="{ data }">
              <div class="flex gap-2 mt-1">
                <Button icon="pi pi-pencil" @click.prevent="handleShowDialogUpdateSiswa(data)" />
                <Button severity="danger" icon="pi pi-trash" @click.prevent="handleShowDialogSiswaRemove(data)" />
                <Button icon="pi pi-id-card" @click.prevent="handleShowDialogRegisterCard(data)" />
              </div>
            </template>
          </Column>
          <template #expansion="{ data }">
            <Card>
              <template #content>
                <table style="border-spacing: 0.6rem;">
                  <tr v-if="data.rfid_token">
                    <th>
                      ID Kartu
                    </th>
                    <td>:</td>
                    <td>
                      <Tag class="border-solid border-1 p-2 border-round">{{ data.rfid_token }}</Tag>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      Telegram
                    </th>
                    <td>:</td>
                    <td>
                      .
                    </td>
                  </tr>
                </table>
              </template>
              <template #footer>
                <div class="flex gap-2">
                  <Button label="Lihat QRCode" icon="pi pi-qrcode" outlined
                    @click.prevent="handleShowDialogQrcode(data)" />
                  <Button label="Reset Kartu" @click="confirmResetRFID($event, data)" icon="pi pi-id-card" outlined
                    severity="danger" />
                </div>
              </template>
            </Card>
          </template>
        </DataTable>
      </div>
    </div>
    <Dialog v-model:visible="showDialogAddSiswa" :style="{ width: '450px' }" header="Tambah Siswa" :modal="true"
      class="p-fluid">
      <div class="field">
        <label for="name">Nama</label>
        <InputText id="name" :disabled="addSiswaPending" :invalid="errorsAddSiswa && errorsAddSiswa.name"
          required="true" autofocus v-model="siswaData.name" />
        <p class="text-red-500" v-if="errorsAddSiswa && errorsAddSiswa.name">
          {{ errorsAddSiswa.name[0] }}
        </p>
      </div>
      <div class="field">
        <label for="notelp">NoTelp</label>
        <InputText id="notelp" :disabled="addSiswaPending" :invalid="errorsAddSiswa && errorsAddSiswa.notelp"
          required="true" autofocus v-model="siswaData.notelp" />
        <p class="text-red-500" v-if="errorsAddSiswa && errorsAddSiswa.notelp">
          {{ errorsAddSiswa.notelp[0] }}
        </p>
      </div>
      <div class="field">
        <label for="nisn">NISN</label>
        <InputText id="nisn" :disabled="addSiswaPending" :invalid="errorsAddSiswa && errorsAddSiswa.nisn"
          required="true" autofocus v-model="siswaData.nisn" />
        <p class="text-red-500" v-if="errorsAddSiswa && errorsAddSiswa.nisn">
          {{ errorsAddSiswa.nisn[0] }}
        </p>
      </div>
      <div class="field">
        <label for="nis">NIS</label>
        <InputText id="nis" :disabled="addSiswaPending" :invalid="errorsAddSiswa && errorsAddSiswa.nis" required="true"
          autofocus v-model="siswaData.nis" />
        <p class="text-red-500" v-if="errorsAddSiswa && errorsAddSiswa.nis">
          {{ errorsAddSiswa.nis[0] }}
        </p>
      </div>
      <div class="field">
        <label for="rombel">Rombel</label>
        <InputText id="rombel" :disabled="addSiswaPending" :invalid="errorsAddSiswa && errorsAddSiswa.rombel"
          required="true" autofocus v-model="siswaData.rombel" />
        <p class="text-red-500" v-if="errorsAddSiswa && errorsAddSiswa.rombel">
          {{ errorsAddSiswa.rombel[0] }}
        </p>
      </div>

      <template #footer>
        <Button label="Batal" :disabled="addSiswaPending" severity="danger" icon="pi pi-times" outlined
          @click.prevent="showDialogAddSiswa = false" />
        <Button label="Simpan" :loading="addSiswaPending" :disabled="addSiswaPending" icon="pi pi-link"
          @click="handleSubmitAddSiswa" />
      </template>
    </Dialog>
    <!-- update -->
    <Dialog v-model:visible="showDialogUpdateSiswa" @after-hide="clearUpdateState" :style="{ width: '450px' }"
      header="Update Siswa" :modal="true" class="p-fluid">
      <div class="field">
        <label for="name">Nama</label>
        <InputText id="name" :disabled="updateSiswaPending" :invalid="errorsUpdateSiswa && errorsUpdateSiswa.name"
          required="true" autofocus v-model="dataUpdateSiswa.name" />
        <p class="text-red-500" v-if="errorsUpdateSiswa && errorsUpdateSiswa.name">
          {{ errorsUpdateSiswa.name[0] }}
        </p>
      </div>
      <div class="field">
        <label for="notelp">NoTelp</label>
        <InputText id="notelp" :disabled="updateSiswaPending" :invalid="errorsUpdateSiswa && errorsUpdateSiswa.notelp"
          required="true" autofocus v-model="dataUpdateSiswa.notelp" />
        <p class="text-red-500" v-if="errorsUpdateSiswa && errorsUpdateSiswa.notelp">
          {{ errorsUpdateSiswa.notelp[0] }}
        </p>
      </div>
      <div class="field">
        <label for="nisn">NISN</label>
        <InputText id="nisn" :disabled="updateSiswaPending" :invalid="errorsUpdateSiswa && errorsUpdateSiswa.nisn"
          required="true" autofocus v-model="dataUpdateSiswa.nisn" />
        <p class="text-red-500" v-if="errorsUpdateSiswa && errorsUpdateSiswa.nisn">
          {{ errorsUpdateSiswa.nisn[0] }}
        </p>
      </div>
      <div class="field">
        <label for="nis">NIS</label>
        <InputText id="nis" :disabled="updateSiswaPending" :invalid="errorsUpdateSiswa && errorsUpdateSiswa.nis"
          required="true" autofocus v-model="dataUpdateSiswa.nis" />
        <p class="text-red-500" v-if="errorsUpdateSiswa && errorsUpdateSiswa.nis">
          {{ errorsUpdateSiswa.nis[0] }}
        </p>
      </div>
      <div class="field">
        <label for="rombel">Rombel</label>
        <InputText id="rombel" :disabled="updateSiswaPending" :invalid="errorsUpdateSiswa && errorsUpdateSiswa.rombel"
          required="true" autofocus v-model="dataUpdateSiswa.rombel" />
        <p class="text-red-500" v-if="errorsUpdateSiswa && errorsUpdateSiswa.rombel">
          {{ errorsUpdateSiswa.rombel[0] }}
        </p>
      </div>

      <template #footer>
        <Button label="Batal" :disabled="updateSiswaPending" severity="danger" icon="pi pi-times" outlined
          @click.prevent="showDialogUpdateSiswa = false" />
        <Button label="Update" :loading="updateSiswaPending" :disabled="updateSiswaPending" icon="pi pi-link"
          @click="handleSubmitUpdateSiswa" />
      </template>
    </Dialog>
    <!-- delete -->
    <Dialog v-model:visible="showdialogRemoveSiswa" @after-hide="clearRemoveState" :style="{ width: '450px' }"
      header="Confirm" :modal="true">
      <p class="m-0">
        Yakin ingin menghapus siswa ini ?
      </p>
      <template #footer>
        <Button label="Batalkan" outlined @click="showdialogRemoveSiswa = false" />
        <Button label="Hapus" outlined severity="danger" :disabled="removeSiswaPending" :loading="removeSiswaPending"
          @click.prevent="handleSiswaRemove" />
      </template>
    </Dialog>
    <Dialog v-model:visible="showDialogRegisterCard" @after-hide="clearRegisterCard" :style="{ width: '450px' }"
      :modal="true" :closable="false">
      <Message severity="error" v-if="errorsRegisterCard && errorsRegisterCard.token">
        {{ errorsRegisterCard.token[0] }}
      </Message>
      <SelectGateway role="register" @input="handleSelectedGateway" />
      <Button label="Setel sebagai default gateway" outlined class="my-2" @click.prevent="setDefaultGateway" />
      <div v-if="selectedGateway && !scannedToken"
        class="w-full border-round border-dotted h-15rem bg-primary justify-content-center flex align-items-center mt-4 ">
        <span class="text-2xl text-center font-bold">
          SILAHKAN SCAN KARTU <i
            class="pi pi-circle bg-red-500 border-circle ml-3 fadeout animation-duration-1000 animation-iteration-infinite"></i>
        </span>
      </div>
      <div v-if="scannedToken && selectedGateway" class="w-full border-round border-dotted bg-primary p-3 mt-4">
        {{ selectedGateway }}
        <h3 class="text-white text-lg underline mt-2">
          Scan Kartu Berhasil
        </h3>
        <pre class="app-code"><code>ID: {{ scannedToken }}</code></pre>
      </div>
      <template #footer>
        <Button label="Batalkan" severity="danger" outlined @click="showDialogRegisterCard = false" />
        <Button v-if="scannedToken && selectedGateway" label="Ulangi" severity="warning" outlined
          @click="scannedToken = null" />
        <Button label="Register" outlined :disabled="registerCardPending" :loading="registerCardPending"
          @click.prevent="handleSubmitRegisterCard" />
      </template>
    </Dialog>
    <Dialog v-model:visible="showDialogQrcode" :style="{ width: '450px' }" :modal="true" :closable="false">
      <div
        class="w-full border-round border-dotted bg-primary p-3 mt-4 flex justify-content-between align-items-center">
        <table>
          <tr>
            <td>Nama</td>
            <td>:</td>
            <td>{{ qrCode.name }}</td>
          </tr>
          <tr>
            <td>NIS</td>
            <td>:</td>
            <td>{{ qrCode.nis }}</td>
          </tr>
          <tr>
            <td>NISN</td>
            <td>:</td>
            <td>{{ qrCode.nisn }}</td>
          </tr>
          <tr>
            <td>Rombel</td>
            <td>:</td>
            <td>{{ qrCode.rombel }}</td>
          </tr>
        </table>
        <vue-qrcode :value="qrCode.nisn" :options="{ width: 100 }"></vue-qrcode>
      </div>
      <template #footer>
        <Button label="Batalkan" outlined severity="danger" @click="showDialogQrcode = false" />
        <Button label="Cetak" outlined icon="pi pi-print" :loading="resetTokenPending" :disabled="resetTokenPending" />
      </template>
    </Dialog>
    <ConfirmPopup></ConfirmPopup>
  </div>
</template>