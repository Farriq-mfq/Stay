<script setup>
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, ref, watch } from 'vue';
import SelectGateway from '@/components/SelectGateway.vue'
import { useConfirm } from "primevue/useconfirm";
import { useStorage } from '@vueuse/core'
import VLazyImage from "v-lazy-image";

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
const file = ref(null);


const getAllSiswa = async () => {
  const queries = {
    page: (queryParams.value.first / queryParams.value.rows) + 1,
    limit: queryParams.value.rows,
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

const onFileChange = (event) => {
  const target = event.target;
  if (target.files && target.files[0]) {
    file.value = target.files[0];
  }
};


// add siswa
const showDialogAddSiswa = ref(false)
const errorsAddSiswa = ref(null)

const addSiswa = async (data) => {
  const formData = new FormData();
  formData.append("nis", data.nis);
  formData.append("nisn", data.nisn);
  formData.append("notelp", data.notelp);
  formData.append("name", data.name);
  formData.append("rombel", data.rombel);
  if (file.value) {
    formData.append('file', file.value);
  }
  return await axios.post('/siswa', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const siswaData = ref({
  nis: '',
  nisn: '',
  notelp: '',
  name: '',
  rombel: '',
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
        rombel: '',
      }
      file.value = null
      refetch()
    },
    onError(err) {
      if (err.response.status === 400) {
        errorsAddSiswa.value = err.response.data
      } else if (err.response.status === 409) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Data siswa sudah ada',
          life: 3000
        })
      } else if (err.response.status === 422) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Mohon perbaiki file yang diupload',
          life: 3000
        })

        errorsAddSiswa.value = {
          file: 'Mohon perbaiki file yang diupload'
        }
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
const removeSiswaService = async (data) => {
  return await axios.delete(`/siswa/${data.id}`)
}

const { mutateAsync: removeSiswaMutate, isPending: removeSiswaPending } = useMutation({
  mutationKey: ['removeSiswa'],
  mutationFn: removeSiswaService,
})

const confirmRemoveSiswa = (data) => {
  confirm.require({
    message: 'Yakin ingin hapus data siswa ini ?',
    header: 'Konfirmasi',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: 'Batalkan',
    acceptLabel: 'Hapus',
    accept: () => {
      console.log(data)
      removeSiswaMutate(data, {
        onSuccess() {
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data siswa berhasil dihapus',
            life: 3000
          })
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
    },
  });
};
// update data siswa

const showDialogUpdateSiswa = ref(false)
const errorsUpdateSiswa = ref(null)
const dataUpdateSiswa = ref({
  nis: '',
  nisn: '',
  notelp: '',
  name: '',
  rombel: '',
})

const updateSiswaService = async (data) => {
  const formData = new FormData();
  formData.append("nis", data.nis);
  formData.append("nisn", data.nisn);
  formData.append("notelp", data.notelp);
  formData.append("name", data.name);
  formData.append("rombel", data.rombel);
  if (file.value) {
    formData.append('file', file.value);
  }
  return await axios.patch(`/siswa/${data.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
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
      file.value = null
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
      } else if (err.response.status === 422) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Mohon perbaiki file yang diupload',
          life: 3000
        })

        errorsUpdateSiswa.value = {
          file: 'Mohon perbaiki file yang diupload'
        }
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
    rombel: data.rombel,
  }
  file.value = null
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
  file.value = null
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
    rombel: '',
  }
  errorsRegisterCard.value = null
  scannedToken.value = null
  selectedGateway.value = null
}

const socket = proxy.socket
const selectedGateway = ref()
const isListening = ref(false);

watch(selectedGateway, (newGateway, oldGateway) => {
  if (oldGateway) {
    turnOffListener();
  }

  if (newGateway) {
    turnOnListener();
  }
})

const handleSelectedGateway = (val) => {
  selectedGateway.value = val
  scannedToken.value = null
}

// socket switch on & off 
const handleGatewayUpdate = (data) => {
  if (showDialogRegisterCard.value) {
    scannedToken.value = data.toString()
    turnOffListener();
    setTimeout(turnOnListener, 100);
  } else {
    turnOffListener();
  }
};

const turnOnListener = () => {
  if (!isListening.value && selectedGateway.value) {
    socket.on(`READER_${selectedGateway.value.token}`, handleGatewayUpdate);
    isListening.value = true;
    console.log('Listening on')
  }
};

const turnOffListener = () => {
  if (isListening.value && selectedGateway.value) {
    // socket.off(`READER_${selectedGateway.value.token}`, handleGatewayUpdate);
    isListening.value = false;
    console.log('Listening off')
  }
};

onMounted(() => {
  if (selectedGateway.value) {
    turnOnListener();
  }
});


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
    header: 'Konfirmasi',
    icon: 'pi pi-info-circle',
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
            detail: 'Kartu RFID berhasil direset',
            life: 3000
          })
          refetch()
        },
        onError() {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Kartu RFID gagal direset',
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
    defaultGateway.value = JSON.stringify(selectedGateway.value)
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Gateway belum dipilih',
      life: 3000
    })
  }
}

const resetDefaultGateway = () => {
  defaultGateway.value = null
  // disabled : off socket
  // socket.off(`READER_${selectedGateway.value.token}`);
  selectedGateway.value = null
}



// reset data siswa
// const resetService = async () => {
//   return await axios.delete('siswa/reset')
// }

// const {
//   mutateAsync: resetDataSiswa,
//   isPending: resetDataSiswaPending,
// } = useMutation({
//   mutationKey: ['resetDataSiswa'],
//   mutationFn: resetService,
// })

// const confirmResetSiswa = () => {
//   confirm.require({
//     message: 'Yakin ingin reset data siswa ?',
//     header: 'Konfirmasi',
//     icon: 'pi pi-info-circle',
//     rejectClass: 'p-button-secondary p-button-outlined',
//     acceptClass: 'p-button-danger',
//     rejectLabel: 'Batalkan',
//     acceptLabel: 'Reset',
//     accept: () => {
//       resetDataSiswa({}, {
//         onSuccess() {
//           toast.add({
//             severity: 'success',
//             summary: 'Success',
//             detail: 'Data siswa berhasil direset',
//             life: 3000
//           })
//           refetch()
//         },
//         onError() {
//           toast.add({
//             severity: 'error',
//             summary: 'Error',
//             detail: 'Data siswa gagal direset',
//             life: 3000
//           })
//         }
//       })
//     },
//   });
// };

// import siswa
const fileImport = ref(null)
const showDialogImportsiswa = ref(false)
const handleChangeImport = (e) => {
  fileImport.value = e.target.files[0]
}

const importSiswaService = async (data) => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  return await axios.post('siswa/import', data, {
    headers
  })
}

const {
  mutateAsync: importSiswa,
  isPending: importSiswaPending,
} = useMutation({
  mutationKey: ['importSiswaService'],
  mutationFn: importSiswaService,
})

const handleImportSiswa = () => {
  let formdata = new FormData()
  formdata.append('file', fileImport.value)
  importSiswa(formdata, {
    onSuccess() {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data siswa berhasil diimport',
        life: 3000
      })
      showDialogImportsiswa.value = false
      fileImport.value = null
      refetch()
    },
    onError(err) {
      if (err.response.status === 400) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Pastikan format import sesuai',
          life: 3000
        })
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Data siswa gagal diimport',
          life: 3000
        })
      }
    }
  })
}

// reset telegram
const resetTelegramService = async (id) => {
  return await axios.delete(`/siswa/${id}/reset-telegram`)
}

const {
  mutateAsync: resetTelegram,
  isPending: resetTelegramServicePending,
} = useMutation({
  mutationKey: ['resetTelegramService'],
  mutationFn: resetTelegramService,
})

const confirmResetTelegram = (event, data) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Konfirmasi',
    message: 'Yakin ingin reset Telegram ?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Batalkan',
    acceptLabel: 'Reset',
    accept: () => {
      resetTelegram(data.id, {
        onSuccess() {
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Akun Telegram berhasil direset',
            life: 3000
          })
          refetch()
        },
        onError(err) {
          if (err.response.status === 404) {
            toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Akun Telegram belum diregistrasi',
              life: 3000
            })
          } else {
            toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Akun Telegram gagal direset',
              life: 3000
            })
          }
        }
      })
    },
  });
};
// download template
const downloadTemplateService = async () => {
  const response = await axios.get(`/siswa/download`, {
    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'siswa-template.xlsx');
  document.body.appendChild(link);
  link.click();
}


</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h3>Siswa</h3>
        <hr>
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2 gap-1 flex flex-wrap">
              <Button label="Tambah Siswa" icon="pi pi-plus" class="mr-2" @click.prevent="showDialogAddSiswa = true" />
              <Button label="Import Siswa" icon="pi pi-arrow-up" severity="success" class="mr-2"
                @click.prevent="showDialogImportsiswa = true" />
              <!-- <Button label="Reset siswa" icon="pi pi-refresh" :loading="resetDataSiswaPending"
                :disabled="resetDataSiswaPending" severity="danger" class="mr-2" @click.prevent="confirmResetSiswa" /> -->
              <Button label="Download Format" @click.prevent="downloadTemplateService" icon="pi pi-download"
                class="mr-2" />
            </div>
          </template>
        </Toolbar>
        <DataTable ref="dt" :totalRecords="totalRecords" v-model:expandedRows="expandedRows" :loading="isLoading"
          :value="isLoading ? [] : siswa.data.data.items" dataKey="id" paginator :rows="10" :filters="filters" lazy
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[10, 25, 50]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} siswa" :first="first"
          @page="onPage($event)">
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-end md:align-items-center">
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
                Data siswa masih kosong
              </span>
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
          <Column field="profile_picture" header="Gambar Profil">
            <template #body="{ data }">
              <v-lazy-image v-if="data.profile_picture" :src="data.profile_picture"
                style="width: 100px;" />
              <div v-else style="height: 100px;width: 100px;"></div>
            </template>
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
                <Button severity="danger" icon="pi pi-trash" :loading="removeSiswaPending"
                  :disabled="removeSiswaPending" @click.prevent="confirmRemoveSiswa(data)" />
                <Button icon="pi pi-id-card" @click.prevent="handleShowDialogRegisterCard(data)" />
              </div>
            </template>
          </Column>
          <template #expansion="{ data }">
            <Card>
              <template #content>
                <tr v-if="data.rfid_token">
                  <th>
                    ID Kartu
                  </th>
                  <td>:</td>
                  <td>
                    <Tag class="border-solid border-1 p-2 border-round">{{ data.rfid_token }}</Tag>
                  </td>
                </tr>
                <!-- <tr v-if="data.telegram_account">
                  <th>
                    Telegram
                  </th>
                  <td>:</td>
                  <td>
                    <Tag class="p-2">
                <tr>
                  <th>Nama</th>
                  <td>:</td>
                  <td>
                    {{ data.telegram_account.name }}
                  </td>
                </tr>
                <tr>
                  <th>Username</th>
                  <td>:</td>
                  <td>{{ data.telegram_account.username }}</td>
                </tr>
                <tr>
                  <th>Chat id</th>
                  <td>:</td>
                  <td>{{ data.telegram_account.chat_id }}</td>
                </tr>
                </Tag>
                </td>
                </tr> -->
              </template>
              <template #footer>
                <div class="flex gap-2">
                  <Button label="Lihat QRCode" icon="pi pi-qrcode" outlined
                    @click.prevent="handleShowDialogQrcode(data)" />
                  <Button label="Reset Kartu" @click="confirmResetRFID($event, data)" icon="pi pi-id-card" outlined
                    severity="danger" />
                  <Button label="Reset Telegram" :loading="resetTelegramServicePending"
                    :disabled="resetTelegramServicePending" @click="confirmResetTelegram($event, data)"
                    icon="pi pi-telegram" outlined severity="danger" />
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
      <div class="field">
        <label for="profile_picture">Gambar Profil (Optional)</label>
        <input :disabled="addSiswaPending" type="file" accept="image/jpg, image/jpeg, image/png" @change="onFileChange"
          class="border p-2 w-full" />
        <p class="text-muted text-sm">Ukuran File 1.5 MB dengan format .jpg, .jpeg, .png</p>
        <p class="text-red-500" v-if="errorsAddSiswa && errorsAddSiswa.file">
          {{ errorsAddSiswa.file }}
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
      <div class="field">
        <label for="profile_picture">Gambar Profil (Optional)</label>
        <input :disabled="updateSiswaPending" type="file" accept="image/jpg, image/jpeg, image/png" @change="onFileChange"
          class="border p-2 w-full" />
        <p class="text-muted text-sm">Ukuran File 1.5 MB dengan format .jpg, .jpeg, .png</p>
        <p class="text-red-500" v-if="errorsUpdateSiswa && errorsUpdateSiswa.file">
          {{ errorsUpdateSiswa.file }}
        </p>
      </div>
      <template #footer>
        <Button label="Batal" :disabled="updateSiswaPending" severity="danger" icon="pi pi-times" outlined
          @click.prevent="showDialogUpdateSiswa = false" />
        <Button label="Update" :loading="updateSiswaPending" :disabled="updateSiswaPending" icon="pi pi-link"
          @click="handleSubmitUpdateSiswa" />
      </template>
    </Dialog>

    <Dialog v-model:visible="showDialogRegisterCard" @after-hide="clearRegisterCard" :style="{ width: '450px' }"
      :modal="true" :closable="false">
      <Message severity="error" v-if="errorsRegisterCard && errorsRegisterCard.token">
        {{ errorsRegisterCard.token[0] }}
      </Message>
      <!-- {{ `READER_${selectedGateway.ip}` }} -->
      <SelectGateway v-if="!defaultGateway" role="register" @input="handleSelectedGateway" />
      <div v-else class="flex align-items-center gap-3 border-solid py-3 px-2 border-round border-1 border-200">
        <div :class="`${selectedGateway.status ? 'bg-primary' : 'bg-red-500'} h-1rem w-1rem border-circle`">
        </div>
        <div class="flex flex-column gap-2">
          <span>{{ selectedGateway.name }} - {{ selectedGateway.location }}</span>
          <Tag class="w-fit">{{ selectedGateway.ip }}</Tag>
        </div>
      </div>

      <Button v-if="!defaultGateway" label="Setel sebagai default gateway" outlined class="my-2"
        @click.prevent="setDefaultGateway" />
      <Button v-else label="Pilih gateway" severity="danger" outlined class="my-2"
        @click.prevent="resetDefaultGateway" />
      <div v-if="selectedGateway && !scannedToken"
        class="w-full border-round border-dotted h-15rem bg-primary justify-content-center flex align-items-center mt-2">
        <span class="text-2xl text-center font-bold">
          SILAHKAN SCAN KARTU <i
            :class="`pi pi-circle bg-red-500 border-circle ml-3 ${isListening ? 'fadeout animation-duration-1000 animation-iteration-infinite' : ''}`"></i>
        </span>
      </div>
      <div v-if="scannedToken && selectedGateway" class="w-full border-round border-dotted bg-primary p-3 mt-4">
        <h3 class="text-white text-lg underline mt-2">
          Scan Kartu Berhasil
        </h3>
        <pre class="app-code"><code>ID: {{ scannedToken }}</code></pre>
      </div>
      <template #footer>
        <Button label="Batalkan" severity="danger" outlined @click.prevent="showDialogRegisterCard = false" />
        <Button v-if="scannedToken" label="Ulangi" severity="warning" outlined @click.prevent="scannedToken = null" />
        <Button label="Register" outlined :disabled="registerCardPending" :loading="registerCardPending"
          @click.prevent="handleSubmitRegisterCard" />
      </template>
    </Dialog>
    <Dialog v-model:visible="showDialogQrcode" :modal="true" :closable="false">
      <div class="w-full flex flex-column justify-content-center align-items-center"
        :id="`qrcode-siswa-${qrCode.nisn}`">
        <h1 class="text-6xl font-bold underline">
          {{ qrCode.name }}
        </h1>
        <vue-qrcode :value="qrCode.nisn" :options="{ width: 800 }"></vue-qrcode>
      </div>
      <template #footer>
        <Button label="Batalkan" outlined severity="danger" @click="showDialogQrcode = false" />
        <Button label="Cetak" outlined v-print="`#qrcode-siswa-${qrCode.nisn}`" icon="pi pi-print"
          :loading="resetTokenPending" :disabled="resetTokenPending" />
      </template>
    </Dialog>
    <Dialog :closable="!importSiswaPending" :header="importSiswaPending ? 'Loading...' : 'Import siswa'"
      v-model:visible="showDialogImportsiswa" :style="{ width: '450px' }" :modal="true">

      <Input type="file" :disabled="importSiswaPending" @change="handleChangeImport"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.shee" />
      <template #footer>
        <Button label="Batalkan" :loading="importSiswaPending" :disabled="importSiswaPending" outlined severity="danger"
          @click="showDialogImportsiswa = false" />
        <Button label="Import" :loading="importSiswaPending" :disabled="importSiswaPending" outlined icon="pi pi-upload"
          @click.prevent="handleImportSiswa" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.v-lazy-image {
    filter: blur(5px);
    transition: filter 1.6s;
    will-change: filter;
}

.v-lazy-image-loaded {
    filter: blur(0);
}
</style>
