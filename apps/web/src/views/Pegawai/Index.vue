<script setup>
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, ref, watch } from 'vue';
import SelectGateway from '@/components/SelectGateway.vue';
import { useConfirm } from 'primevue/useconfirm';
import { useStorage } from '@vueuse/core';
import VLazyImage from 'v-lazy-image';
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const toast = useToast();
const confirm = useConfirm();

const expandedRows = ref({});
const filters = ref(null);
const first = ref(0);
const queryParams = ref({
    first: 0,
    rows: 10
});

const totalRecords = ref(0);
const signPictureFile = ref(null);
const profilePictureFile = ref(null);

const getAllPegawai = async () => {
    const queries = {
        page: queryParams.value.first / queryParams.value.rows + 1,
        limit: queryParams.value.rows,
        ...(filters.value && { search: filters.value })
    };

    const params = new URLSearchParams(queries);

    return await axios.get(`/pegawai?${params}`);
};

const {
    data: pegawai,
    refetch,
    isLoading
} = useQuery({
    queryKey: ['pegawai', queryParams.value],
    queryFn: getAllPegawai
});

const onPage = (event) => {
    queryParams.value = event;
    refetch();
};

watch(pegawai, () => {
    if (pegawai.value) {
        totalRecords.value = pegawai.value.data.data.meta.totalCount;
    }
});

const handleDebounceFilter = (val) => {
    filters.value = val;
    refetch();
};

const onChangeSignPicture = (event) => {
    const target = event.target;
    if (target.files && target.files[0]) {
        signPictureFile.value = target.files[0];
    }
};
const onChangeProfilePicture = (event) => {
    const target = event.target;
    if (target.files && target.files[0]) {
        profilePictureFile.value = target.files[0];
    }
};

// add pegawai
const showDialogAddPegawai = ref(false);
const errorsAddPegawai = ref(null);

const addPegawai = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('username', data.username);
    formData.append('position', data.position);
    formData.append('group', data.group);
    if (signPictureFile.value) formData.append('sign_picture', signPictureFile.value);
    if (profilePictureFile.value) formData.append('profile_picture', profilePictureFile.value);
    return await axios.post('/pegawai', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const pegawaiData = ref({
    name: '',
    username: '',
    position: '',
    group: ''
});

const { mutateAsync: addPegawaiMutate, isPending: addPegawaiPending } = useMutation({
    mutationKey: ['addPegawai'],
    mutationFn: addPegawai
});

const handleSubmitAddPegawai = () => {
    addPegawaiMutate(pegawaiData.value, {
        onSuccess() {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Data pegawai berhasil ditambahkan',
                life: 3000
            });
            showDialogAddPegawai.value = false;
            pegawaiData.value = {
                name: '',
                username: '',
                position: '',
                group: ''
            };
            errorsAddPegawai.value = null;
            signPictureFile.value = null;
            profilePictureFile.value = null;
            refetch();
        },
        onError(err) {
            if (err.response.status === 400) {
                errorsAddPegawai.value = err.response.data;
            } else if (err.response.status === 409) {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Data pegawai sudah ada',
                    life: 3000
                });
            } else if (err.response.status === 422) {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Mohon perbaiki file yang diupload',
                    life: 3000
                });

                errorsAddPegawai.value = {
                    file: 'Mohon perbaiki file yang diupload'
                };
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Data pegawai gagal ditambahkan',
                    life: 3000
                });
            }
        }
    });
};

const handleHideDialogAddPegawai = () => {
    errorsAddPegawai.value = null;
};
// remove
const removePegawai = async (data) => {
    return await axios.delete(`/pegawai/${data.id}`);
};

const { mutateAsync: removePegawaiMutate, isPending: removePegawaiPending } = useMutation({
    mutationKey: ['removePegawai'],
    mutationFn: removePegawai
});

const confirmRemovePegawai = (data) => {
    confirm.require({
        message: 'Yakin ingin hapus data pegawai ini ?',
        header: 'Konfirmasi',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        rejectLabel: 'Batalkan',
        acceptLabel: 'Hapus',
        accept: () => {
            console.log(data);
            removePegawaiMutate(data, {
                onSuccess() {
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Data pegawai berhasil dihapus',
                        life: 3000
                    });
                    refetch();
                },
                onError() {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Data pegawai gagal dihapus',
                        life: 3000
                    });
                }
            });
        }
    });
};
// update data pegawai

const showDialogUpdatePegawai = ref(false);
const errorsUpdatePegawai = ref(null);
const dataUpdatePegawai = ref({
    name: '',
    username: '',
    position: '',
    group: ''
});

const updatePegawaiService = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('username', data.username);
    formData.append('position', data.position);
    formData.append('group', data.group);
    if (signPictureFile.value) formData.append('sign_picture', signPictureFile.value);
    if (profilePictureFile.value) formData.append('profile_picture', profilePictureFile.value);
    return await axios.patch(`/pegawai/${data.id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const { mutateAsync: updatePegawaiMutate, isPending: updatePegawaiPending } = useMutation({
    mutationKey: ['updatePegawaiService'],
    mutationFn: updatePegawaiService
});

const handleSubmitUpdatePegawai = () => {
    updatePegawaiMutate(dataUpdatePegawai.value, {
        onSuccess() {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Data pegawai berhasil diubah',
                life: 3000
            });
            showDialogUpdatePegawai.value = false;
            dataUpdatePegawai.value = null;
            errorsUpdatePegawai.value = null;
            signPictureFile.value = null;
            profilePictureFile.value = null;
            refetch();
        },
        onError(err) {
            if (err.response.status === 400) {
                errorsUpdatePegawai.value = err.response.data;
            } else if (err.response.status === 409) {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Data pegawai sudah ada',
                    life: 3000
                });
            } else if (err.response.status === 422) {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Mohon perbaiki file yang diupload',
                    life: 3000
                });

                errorsUpdatePegawai.value = {
                    file: 'Mohon perbaiki file yang diupload'
                };
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Data pegawai gagal diubah',
                    life: 3000
                });
            }
        }
    });
};

const handleshowDialogUpdatePegawai = (data) => {
    dataUpdatePegawai.value = {
        id: data.id,
        name: data.name,
        username: data.username,
        position: data.position,
        group: data.group
    };
    showDialogUpdatePegawai.value = true;
    signPictureFile.value = null;
    profilePictureFile.value = null;
};

const clearUpdateState = () => {
    dataUpdatePegawai.value = {
        name: '',
        username: '',
        position: '',
        group: ''
    };
    errorsUpdatePegawai.value = null;
    signPictureFile.value = null;
    profilePictureFile.value = null;
};

// register RFID card

const showDialogRegisterCard = ref(false);
const errorsRegisterCard = ref(null);
const scannedToken = ref(null);

const dataRegisterCard = ref({
    name: '',
    username: '',
    position: '',
    group: '',
    token: ''
});

const registerCardService = async (data) => {
    return await axios.post(`/pegawai/${data.id}/rfid-token`, {
        token: scannedToken.value
    });
};

const { mutateAsync: registerCardMutate, isPending: registerCardPending } = useMutation({
    mutationKey: ['registerCardPegawai'],
    mutationFn: registerCardService
});

const handleShowDialogRegisterCard = (data) => {
    dataRegisterCard.value = {
        id: data.id,
        name: data.name,
        username: data.username,
        position: data.position,
        group: data.group
    };

    showDialogRegisterCard.value = true;
    if (defaultGateway.value) {
        selectedGateway.value = JSON.parse(defaultGateway.value);
    }
};

const handleSubmitRegisterCard = () => {
    registerCardMutate(dataRegisterCard.value, {
        onSuccess() {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'RFID card berhasil didaftarkan',
                life: 3000
            });
            showDialogRegisterCard.value = false;
            dataRegisterCard.value = null;
            refetch();
        },
        onError(err) {
            if (err.response.status === 400) {
                errorsRegisterCard.value = err.response.data;
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'RFID card gagal didaftarkan',
                    life: 3000
                });
            }
        }
    });
};

const clearRegisterCard = () => {
    dataRegisterCard.value = {
        name: '',
        username: '',
        position: '',
        group: ''
    };
    errorsRegisterCard.value = null;
    scannedToken.value = null;
    selectedGateway.value = null;
};

const socket = proxy.socket;
const selectedGateway = ref();
const isListening = ref(false);

watch(selectedGateway, (newGateway, oldGateway) => {
    if (oldGateway) {
        turnOffListener();
    }

    if (newGateway) {
        turnOnListener();
    }
});

const handleSelectedGateway = (val) => {
    selectedGateway.value = val;
    scannedToken.value = null;
};

// socket switch on & off
const handleGatewayUpdate = (data) => {
    if (showDialogRegisterCard.value) {
        scannedToken.value = data.toString();
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
        console.log('Listening on');
    }
};

const turnOffListener = () => {
    if (isListening.value && selectedGateway.value) {
        // socket.off(`READER_${selectedGateway.value.token}`, handleGatewayUpdate);
        isListening.value = false;
        console.log('Listening off');
    }
};

onMounted(() => {
    if (selectedGateway.value) {
        turnOnListener();
    }
});

// show qrCode
const showDialogQrcode = ref(false);
const qrCode = ref({
    nis: '',
    nisn: '',
    notelp: '',
    name: '',
    rombel: ''
});
const handleShowDialogQrcode = (data) => {
    qrCode.value = data;
    showDialogQrcode.value = true;
};
// reset rfid token
const resetTokenRfid = async (id) => {
    return await axios.delete(`/pegawai/${id}/rfid-token`);
};
const { mutateAsync: resetToken, isPending: resetTokenPending } = useMutation({
    mutationKey: ['resetTokenRfidPegawai'],
    mutationFn: resetTokenRfid
});

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
                    });
                    refetch();
                },
                onError() {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Kartu RFID gagal direset',
                        life: 3000
                    });
                }
            });
        }
    });
};

// set default gateway
const defaultGateway = useStorage('default-gateway', selectedGateway.value);

const setDefaultGateway = () => {
    if (selectedGateway.value) {
        defaultGateway.value = JSON.stringify(selectedGateway.value);
    } else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gateway belum dipilih',
            life: 3000
        });
    }
};

const resetDefaultGateway = () => {
    defaultGateway.value = null;
    // disabled : off socket
    // socket.off(`READER_${selectedGateway.value.token}`);
    selectedGateway.value = null;
};

// // reset data siswa
// const resetService = async () => {
//     return await axios.delete('siswa/reset')
// }

// const {
//     mutateAsync: resetDataSiswa,
//     isPending: resetDataSiswaPending,
// } = useMutation({
//     mutationKey: ['resetDataSiswa'],
//     mutationFn: resetService,
// })

// const confirmResetSiswa = () => {
//     confirm.require({
//         message: 'Yakin ingin reset data siswa ?',
//         header: 'Konfirmasi',
//         icon: 'pi pi-info-circle',
//         rejectClass: 'p-button-secondary p-button-outlined',
//         acceptClass: 'p-button-danger',
//         rejectLabel: 'Batalkan',
//         acceptLabel: 'Reset',
//         accept: () => {
//             resetDataSiswa({}, {
//                 onSuccess() {
//                     toast.add({
//                         severity: 'success',
//                         summary: 'Success',
//                         detail: 'Data siswa berhasil direset',
//                         life: 3000
//                     })
//                     refetch()
//                 },
//                 onError() {
//                     toast.add({
//                         severity: 'error',
//                         summary: 'Error',
//                         detail: 'Data siswa gagal direset',
//                         life: 3000
//                     })
//                 }
//             })
//         },
//     });
// };

// import pegawai
const fileImport = ref(null);
const showDialogImportPegawai = ref(false);
const handleChangeImport = (e) => {
    fileImport.value = e.target.files[0];
};

const importPegawaiService = async (data) => {
    const headers = { 'Content-Type': 'multipart/form-data' };
    return await axios.post('pegawai/import', data, {
        headers
    });
};

const { mutateAsync: importPegawai, isPending: importPendingPegawai } = useMutation({
    mutationKey: ['importPegawaiService'],
    mutationFn: importPegawaiService
});

const handleImportPegawai = () => {
    let formdata = new FormData();
    formdata.append('file', fileImport.value);
    importPegawai(formdata, {
        onSuccess() {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Data pegawai berhasil diimport',
                life: 3000
            });
            showDialogImportPegawai.value = false;
            fileImport.value = null;
            refetch();
        },
        onError(err) {
            if (err.response.status === 400) {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Pastikan format import sesuai',
                    life: 3000
                });
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Data pegawai gagal diimport',
                    life: 3000
                });
            }
        }
    });
};

// download template
const downloadTemplateService = async () => {
    const response = await axios.get(`/pegawai/download`, {
        responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pegawai-template.xlsx');
    document.body.appendChild(link);
    link.click();
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h3>Pegawai</h3>
                <hr />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2 gap-1 flex flex-wrap">
                            <Button label="Tambah Pegawai" v-if="$can('pegawai:create')" icon="pi pi-plus" class="mr-2" @click.prevent="showDialogAddPegawai = true" />
                            <Button label="Import Pegawai" v-if="$can('pegawai:import')" icon="pi pi-arrow-up" severity="success" class="mr-2" @click.prevent="showDialogImportPegawai = true" />
                            <!-- <Button label="Reset siswa" icon="pi pi-refresh" :loading="resetDataSiswaPending"
                :disabled="resetDataSiswaPending" severity="danger" class="mr-2" @click.prevent="confirmResetSiswa" /> -->
                            <Button label="Download Format" v-if="$can('pegawai:download')" @click.prevent="downloadTemplateService" icon="pi pi-download" class="mr-2" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    :totalRecords="totalRecords"
                    v-model:expandedRows="expandedRows"
                    :loading="isLoading"
                    :value="isLoading ? [] : pegawai.data.data.items"
                    dataKey="id"
                    paginator
                    :rows="10"
                    :filters="filters"
                    lazy
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[10, 25, 50]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} pegawai"
                    :first="first"
                    @page="onPage($event)"
                >
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
                            <span> Data pegawai masih kosong </span>
                        </div>
                    </template>
                    <Column expander />
                    <Column field="name" header="Nama"> </Column>
                    <Column field="username" header="Username"> </Column>
                    <Column field="position" header="Jabatan"> </Column>
                    <Column field="group" header="Kelompok"> </Column>
                    <Column field="sign_picture" header="Tanda Tangan">
                        <template #body="{ data }">
                            <v-lazy-image :src="data.sign_picture" style="width: 100px; height: 100px; object-fit: cover" />
                        </template>
                    </Column>
                    <Column field="profile_picture" header="Foto Profil">
                        <template #body="{ data }">
                            <v-lazy-image :src="data.profile_picture" style="width: 100px; height: 100px; object-fit: cover" />
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
                                <Button icon="pi pi-pencil" v-if="$can('pegawai:update')" @click.prevent="handleshowDialogUpdatePegawai(data)" />
                                <Button severity="danger" icon="pi pi-trash" v-if="$can('pegawai:delete')" :loading="removePegawaiPending" :disabled="removePegawaiPending" @click.prevent="confirmRemovePegawai(data)" />
                                <Button icon="pi pi-id-card" v-if="$can('pegawai:rfid-register')" @click.prevent="handleShowDialogRegisterCard(data)" />
                                <!-- <Button icon="pi pi-key" severity="warning" @click.prevent="handleShowDialogRegisterCard(data)" /> -->
                            </div>
                        </template>
                    </Column>
                    <template #expansion="{ data }">
                        <Card>
                            <template #content>
                                <tr v-if="data.rfid_token">
                                    <th>ID Kartu</th>
                                    <td>:</td>
                                    <td>
                                        <Tag class="border-solid border-1 p-2 border-round">{{ data.rfid_token }}</Tag>
                                    </td>
                                </tr>
                            </template>
                            <template #footer>
                                <div class="flex gap-2" v-if="data.rfid_token">
                                    <Button label="Reset Kartu" v-if="$can('pegawai:rfid-reset')" @click="confirmResetRFID($event, data)" icon="pi pi-id-card" outlined severity="danger" />
                                </div>
                            </template>
                        </Card>
                    </template>
                </DataTable>
            </div>
        </div>
        <Dialog v-model:visible="showDialogAddPegawai" :style="{ width: '450px' }" header="Tambah Pegawai" :modal="true" class="p-fluid" @after-hide="handleHideDialogAddPegawai">
            <div class="field">
                <label for="name">Nama</label>
                <InputText id="name" :disabled="addPegawaiPending" :invalid="errorsAddPegawai && errorsAddPegawai.name" required="true" autofocus v-model="pegawaiData.name" placeholder="Cth: Sibudi" />
                <p class="text-red-500" v-if="errorsAddPegawai && errorsAddPegawai.name">
                    {{ errorsAddPegawai.name[0] }}
                </p>
            </div>
            <div class="field">
                <label for="username">Username</label>
                <InputText id="username" :disabled="addPegawaiPending" :invalid="errorsAddPegawai && errorsAddPegawai.username" required="true" autofocus v-model="pegawaiData.username" placeholder="Cth: 1234" />
                <p class="text-red-500" v-if="errorsAddPegawai && errorsAddPegawai.username">
                    {{ errorsAddPegawai.username[0] }}
                </p>
            </div>
            <div class="field">
                <label for="position">Jabatan</label>
                <InputText id="position" :disabled="addPegawaiPending" :invalid="errorsAddPegawai && errorsAddPegawai.position" required="true" autofocus v-model="pegawaiData.position" placeholder="Cth: Guru" />
                <p class="text-red-500" v-if="errorsAddPegawai && errorsAddPegawai.position">
                    {{ errorsAddPegawai.position[0] }}
                </p>
            </div>
            <div class="field">
                <label for="group">Kelompok</label>
                <InputText id="group" :disabled="addPegawaiPending" :invalid="errorsAddPegawai && errorsAddPegawai.group" required="true" autofocus v-model="pegawaiData.group" placeholder="Cth: Guru" />
                <p class="text-red-500" v-if="errorsAddPegawai && errorsAddPegawai.group">
                    {{ errorsAddPegawai.group[0] }}
                </p>
            </div>
            <div class="field">
                <label for="sign_picture">Gambar Tanda Tangan (Optional)</label>
                <input :disabled="addPegawaiPending" type="file" accept="image/jpg, image/jpeg, image/png" @change="onChangeSignPicture" class="border-1 surface-border border-round p-3 w-full" />
                <p class="text-muted text-sm">Ukuran File 1.5 MB dengan format .jpg, .jpeg, .png</p>
            </div>
            <div class="field">
                <label for="sign_picture">Foto Profile (Optional)</label>
                <input :disabled="addPegawaiPending" type="file" accept="image/jpg, image/jpeg, image/png" @change="onChangeProfilePicture" class="border-1 surface-border border-round p-3 w-full" />
                <p class="text-muted text-sm">Ukuran File 1.5 MB dengan format .jpg, .jpeg, .png</p>
            </div>
            <div class="field">
                <p class="text-red-500" v-if="errorsAddPegawai && errorsAddPegawai.file">
                    {{ errorsAddPegawai.file }}
                </p>
            </div>

            <template #footer>
                <Button label="Batal" :disabled="addPegawaiPending" severity="danger" icon="pi pi-times" outlined @click.prevent="showDialogAddPegawai = false" />
                <Button label="Simpan" :loading="addPegawaiPending" :disabled="addPegawaiPending" icon="pi pi-link" @click="handleSubmitAddPegawai" />
            </template>
        </Dialog>
        <!-- update -->
        <Dialog v-model:visible="showDialogUpdatePegawai" @after-hide="clearUpdateState" :style="{ width: '450px' }" header="Update Pegawai" :modal="true" class="p-fluid">
            <div class="field">
                <label for="name">Nama</label>
                <InputText id="name" :disabled="updatePegawaiPending" :invalid="errorsUpdatePegawai && errorsUpdatePegawai.name" required="true" autofocus v-model="dataUpdatePegawai.name" placeholder="Cth: Sibudi" />
                <p class="text-red-500" v-if="errorsUpdatePegawai && errorsUpdatePegawai.name">
                    {{ errorsUpdatePegawai.name[0] }}
                </p>
            </div>
            <div class="field">
                <label for="username">Username</label>
                <InputText id="username" :disabled="updatePegawaiPending" :invalid="errorsUpdatePegawai && errorsUpdatePegawai.username" required="true" autofocus v-model="dataUpdatePegawai.username" placeholder="Cth: 1234" />
                <p class="text-red-500" v-if="errorsUpdatePegawai && errorsUpdatePegawai.username">
                    {{ errorsUpdatePegawai.username[0] }}
                </p>
            </div>
            <div class="field">
                <label for="position">Jabatan</label>
                <InputText id="position" :disabled="updatePegawaiPending" :invalid="errorsUpdatePegawai && errorsUpdatePegawai.position" required="true" autofocus v-model="dataUpdatePegawai.position" placeholder="Cth: Guru" />
                <p class="text-red-500" v-if="errorsUpdatePegawai && errorsUpdatePegawai.position">
                    {{ errorsUpdatePegawai.position[0] }}
                </p>
            </div>
            <div class="field">
                <label for="group">Kelompok</label>
                <InputText id="group" :disabled="updatePegawaiPending" :invalid="errorsUpdatePegawai && errorsUpdatePegawai.group" required="true" autofocus v-model="dataUpdatePegawai.group" placeholder="Cth: Guru" />
                <p class="text-red-500" v-if="errorsUpdatePegawai && errorsUpdatePegawai.group">
                    {{ errorsUpdatePegawai.group[0] }}
                </p>
            </div>
            <div class="field">
                <label for="sign_picture">Gambar Tanda Tangan (Optional)</label>
                <input :disabled="updatePegawaiPending" type="file" accept="image/jpg, image/jpeg, image/png" @change="onChangeSignPicture" class="border-1 surface-border border-round p-3 w-full" />
                <p class="text-muted text-sm">Ukuran File 1.5 MB dengan format .jpg, .jpeg, .png</p>
            </div>
            <div class="field">
                <label for="sign_picture">Gambar Tanda Tangan (Optional)</label>
                <input :disabled="updatePegawaiPending" type="file" accept="image/jpg, image/jpeg, image/png" @change="onChangeProfilePicture" class="border-1 surface-border border-round p-3 w-full" />
                <p class="text-muted text-sm">Ukuran File 1.5 MB dengan format .jpg, .jpeg, .png</p>
            </div>
            <div class="field">
                <p class="text-red-500" v-if="errorsUpdatePegawai && errorsUpdatePegawai.file">
                    {{ errorsUpdatePegawai.file }}
                </p>
            </div>

            <!-- <div class="field">
                <label for="name">Nama</label>
                <InputText id="name" :disabled="updatePegawaiPending"
                    :invalid="errorsUpdatePegawai && errorsUpdatePegawai.name" required="true" autofocus
                    v-model="dataUpdatePegawai.name" />
                <p class="text-red-500" v-if="errorsUpdatePegawai && errorsUpdatePegawai.name">
                    {{ errorsUpdatePegawai.name[0] }}
                </p>
            </div>
            <div class="field">
                <label for="notelp">NoTelp</label>
                <InputText id="notelp" :disabled="updatePegawaiPending"
                    :invalid="errorsUpdatePegawai && errorsUpdatePegawai.notelp" required="true" autofocus
                    v-model="dataUpdatePegawai.notelp" />
                <p class="text-red-500" v-if="errorsUpdatePegawai && errorsUpdatePegawai.notelp">
                    {{ errorsUpdatePegawai.notelp[0] }}
                </p>
            </div>
            <div class="field">
                <label for="nisn">NISN</label>
                <InputText id="nisn" :disabled="updatePegawaiPending"
                    :invalid="errorsUpdatePegawai && errorsUpdatePegawai.nisn" required="true" autofocus
                    v-model="dataUpdatePegawai.nisn" />
                <p class="text-red-500" v-if="errorsUpdatePegawai && errorsUpdatePegawai.nisn">
                    {{ errorsUpdatePegawai.nisn[0] }}
                </p>
            </div>
            <div class="field">
                <label for="nis">NIS</label>
                <InputText id="nis" :disabled="updatePegawaiPending"
                    :invalid="errorsUpdatePegawai && errorsUpdatePegawai.nis" required="true" autofocus
                    v-model="dataUpdatePegawai.nis" />
                <p class="text-red-500" v-if="errorsUpdatePegawai && errorsUpdatePegawai.nis">
                    {{ errorsUpdatePegawai.nis[0] }}
                </p>
            </div>
            <div class="field">
                <label for="rombel">Rombel</label>
                <InputText id="rombel" :disabled="updatePegawaiPending"
                    :invalid="errorsUpdatePegawai && errorsUpdatePegawai.rombel" required="true" autofocus
                    v-model="dataUpdatePegawai.rombel" />
                <p class="text-red-500" v-if="errorsUpdatePegawai && errorsUpdatePegawai.rombel">
                    {{ errorsUpdatePegawai.rombel[0] }}
                </p>
            </div> -->

            <template #footer>
                <Button label="Batal" :disabled="updatePegawaiPending" severity="danger" icon="pi pi-times" outlined @click.prevent="showDialogUpdatePegawai = false" />
                <Button label="Update" :loading="updatePegawaiPending" :disabled="updatePegawaiPending" icon="pi pi-link" @click="handleSubmitUpdatePegawai" />
            </template>
        </Dialog>

        <Dialog v-model:visible="showDialogRegisterCard" @after-hide="clearRegisterCard" :style="{ width: '450px' }" :modal="true" :closable="false">
            <Message severity="error" v-if="errorsRegisterCard && errorsRegisterCard.token">
                {{ errorsRegisterCard.token[0] }}
            </Message>
            <!-- {{ `READER_${selectedGateway.ip}` }} -->
            <SelectGateway v-if="!defaultGateway" role="register" @input="handleSelectedGateway" />
            <div v-else class="flex align-items-center gap-3 border-solid py-3 px-2 border-round border-1 border-200">
                <div :class="`${selectedGateway.status ? 'bg-primary' : 'bg-red-500'} h-1rem w-1rem border-circle`"></div>
                <div class="flex flex-column gap-2">
                    <span>{{ selectedGateway.name }} - {{ selectedGateway.location }}</span>
                    <Tag class="w-fit">{{ selectedGateway.ip }}</Tag>
                </div>
            </div>

            <Button v-if="!defaultGateway" label="Setel sebagai default gateway" outlined class="my-2" @click.prevent="setDefaultGateway" />
            <Button v-else label="Pilih gateway" severity="danger" outlined class="my-2" @click.prevent="resetDefaultGateway" />
            <div v-if="selectedGateway && !scannedToken" class="w-full border-round border-dotted h-15rem bg-primary justify-content-center flex align-items-center mt-2">
                <span class="text-2xl text-center font-bold"> SILAHKAN SCAN KARTU <i :class="`pi pi-circle bg-red-500 border-circle ml-3 ${isListening ? 'fadeout animation-duration-1000 animation-iteration-infinite' : ''}`"></i> </span>
            </div>
            <div v-if="scannedToken && selectedGateway" class="w-full border-round border-dotted bg-primary p-3 mt-4">
                <h3 class="text-white text-lg underline mt-2">Scan Kartu Berhasil</h3>
                <pre class="app-code"><code>ID: {{ scannedToken }}</code></pre>
            </div>
            <template #footer>
                <Button label="Batalkan" severity="danger" outlined @click.prevent="showDialogRegisterCard = false" />
                <Button v-if="scannedToken" label="Ulangi" severity="warning" outlined @click.prevent="scannedToken = null" />
                <Button label="Register" outlined :disabled="registerCardPending" :loading="registerCardPending" @click.prevent="handleSubmitRegisterCard" />
            </template>
        </Dialog>

        <Dialog :closable="!importPendingPegawai" :header="importPendingPegawai ? 'Loading...' : 'Import Pegawai'" v-model:visible="showDialogImportPegawai" :style="{ width: '450px' }" :modal="true">
            <Input type="file" :disabled="importPendingPegawai" @change="handleChangeImport" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.shee" />
            <template #footer>
                <Button label="Batalkan" :loading="importPendingPegawai" :disabled="importPendingPegawai" outlined severity="danger" @click="showDialogImportPegawai = false" />
                <Button label="Import" :loading="importPendingPegawai" :disabled="importPendingPegawai" outlined icon="pi pi-upload" @click.prevent="handleImportPegawai" />
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
