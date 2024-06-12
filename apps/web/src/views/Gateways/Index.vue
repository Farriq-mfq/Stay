<script setup>
import { useQuery, useMutation } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { capitalize, getCurrentInstance, ref, watch } from 'vue';
const toast = useToast();
const { proxy } = getCurrentInstance()
const axios = proxy.axios
// the datatable queries server side
const expandedRows = ref({});
const filters = ref(null);
const first = ref(0);
const queryParams = ref({
    first: 0,
    rows: 10,
})
const totalRecords = ref(0);
const dt = ref()


const getAllGateways = async () => {
    const queries = {
        page: (queryParams.value.first / queryParams.value.rows) + 1,
        perpage: queryParams.value.rows,
        ...filters.value && { search: filters.value }
    }

    const params = new URLSearchParams(queries)

    return await axios.get(`/gateways?${params}`)
}


const { data: gateways, isLoading, refetch } = useQuery({
    queryKey: ['gateways', queryParams.value],
    queryFn: getAllGateways,
    keepPreviousData: true,
})


const onPage = (event) => {
    queryParams.value = event;
    refetch()
};

watch(gateways, () => {
    if (gateways.value) {
        totalRecords.value = gateways.value.data.data.meta.totalCount
    }
})

// mutation for testing connection gateway
const testingGateway = async (id) => {
    return await axios.post(`/gateways/${id}/ping`)
}
const { mutateAsync: testing, isPending: loadingTesting } = useMutation({
    mutationKey: ['testingGateway'],
    mutationFn: testingGateway
})

const handleTestConnection = (id) => {
    testing(id, {
        onSuccess() {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Koneksi gateway berhasil',
                life: 3000
            })
        },
        onError() {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Koneksi gateway gagal',
                life: 3000
            })
        }
    })
}

const handleDebounceFilter = (val) => {
    filters.value = val;
    refetch()
}


// add gateways
const addGatewayDialog = ref(false)

const addGateway = ref({
    name: '',
    ip: '',
    location: '',
    role: ''
})

const errorsAddGateways = ref(null)

const addGatewayService = async (data) => {
    return await axios.post('gateways', data)
}

const { mutateAsync: mutateGateway, isPending: pendingAddGateway } = useMutation({
    mutationKey: ['addGateway'],
    mutationFn: addGatewayService
})

const addGatewayStore = () => {
    mutateGateway(addGateway.value, {
        onSuccess() {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Gateway berhasil ditambahkan',
                life: 3000
            })
            addGatewayDialog.value = false
            addGateway.value = {
                name: '',
                ip: '',
                location: '',
                role: ''
            }
            errorsAddGateways.value = {}
            refetch()
        },
        onError(err) {
            if (err.response.status === 400) {
                errorsAddGateways.value = err.response.data
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Gateway gagal ditambahkan',
                    life: 3000
                })
            }
        }
    })


}

// update status

const updateStatusGateway = async (data) => {
    return await axios.patch(`/gateways/${data.id}`, { status: !data.status })
}

const { mutateAsync: mutateUpdateStatusGateway, isPending: pendingUpdateStatusGateway } = useMutation({
    mutationKey: ['updateStatusGateway'],
    mutationFn: updateStatusGateway
})

const handleUpdateStatus = (id, status) => {
    mutateUpdateStatusGateway({ id, status }, {
        onSuccess() {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Status gateway berhasil diubah',
                life: 3000
            })
            refetch()
        },
        onError() {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Status gateway gagal diubah',
                life: 3000
            })
        }
    })
}


// remove gateway
const showDialogRemoveGateway = ref(false)
const removeGateway = ref(null)
const handleShowDialogRemoveGateway = (data) => {
    removeGateway.value = data
    showDialogRemoveGateway.value = true
}

const removeGatewayService = async (data) => {
    return await axios.delete(`/gateways/${data.id}`)
}

const { mutateAsync: removeGatewayMutate, isPending: removeGatewayPending } = useMutation({
    mutationKey: ['removeGateway'],
    mutationFn: removeGatewayService
})


const handleRemoveGateway = () => {
    removeGatewayMutate(removeGateway.value, {
        onSuccess() {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Gateway berhasil dihapus',
                life: 3000
            })
            showDialogRemoveGateway.value = false
            removeGateway.value = null
            refetch()
        },
        onError() {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Gateway gagal dihapus',
                life: 3000
            })
        }
    })
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Tambah gateway" icon="pi pi-plus" class="mr-2"
                                @click.prevent="addGatewayDialog = true" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable ref="dt" :totalRecords="totalRecords" v-model:expandedRows="expandedRows"
                    :loading="isLoading" :value="isLoading ? [] : gateways.data.data.items" dataKey="id" paginator
                    :rows="10" :filters="filters" lazy
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} gateways" :first="first"
                    @page="onPage($event)">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">
                                Gateway
                            </h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText v-debounce:300ms="handleDebounceFilter" class="w-full sm:w-auto"
                                    placeholder="Search..." />
                            </IconField>
                        </div>
                    </template>
                    <Column expander />
                    <Column field="name" header="Name">
                    </Column>
                    <Column field="ip" alignFrozen="right" :frozen="true" header="IP">
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
                                <Button icon="pi pi-pencil" />
                                <Button outlined :loading="pendingUpdateStatusGateway" :disabled="pendingUpdateStatusGateway" :severity="data.status ? 'danger' : 'success'"
                                    @click.prevent="handleUpdateStatus(data.id, data.status)" icon="pi pi-power-off" />
                            </div>
                        </template>
                    </Column>
                    <template #expansion="{ data }">
                        <Card>
                            <template #content>
                                <table style="border-spacing: 0.6rem;">
                                    <tr style="width: 4rem;">
                                        <th style="width: 4rem;">
                                            Lokasi
                                        </th>
                                        <td>:</td>
                                        <td>{{ data.location }}</td>
                                    </tr>
                                    <tr>
                                        <th style="width: 4rem;">
                                            Role
                                        </th>
                                        <td>:</td>
                                        <td>
                                           <Tag>
                                            {{ capitalize(data.role) }}
                                           </Tag>
                                        </td>
                                    </tr>
                                </table>
                            </template>
                            <template #footer>
                                <div class="flex gap-3 mt-1">
                                    <Button :disabled="loadingTesting" :loading="loadingTesting"
                                        :label="loadingTesting ? 'Loading...' : 'Ping'" icon="pi pi-sitemap"
                                        @click.prevent="handleTestConnection(data.id)" />
                                    <Button label="Generate Token Baru" outlined icon="pi pi-key"
                                        @click.prevent="handleTestConnection(data.id)" />
                                    <Button label="Hapus" outlined severity="danger"
                                        @click.prevent="handleShowDialogRemoveGateway(data)" icon="pi pi-trash" />
                                </div>
                            </template>
                        </Card>
                    </template>
                </DataTable>
            </div>


            <Dialog v-model:visible="addGatewayDialog" :style="{ width: '450px' }" header="Tambah Gateway Baru"
                :modal="true" class="p-fluid">
                <div class="field">

                    <label for="name">Nama</label>
                    <InputText id="name" :disabled="pendingAddGateway"
                        :invalid="errorsAddGateways && errorsAddGateways.name" required="true" autofocus
                        v-model="addGateway.name" />
                    <small class="p-invalid" v-if="errorsAddGateways && errorsAddGateways.name">
                        {{ errorsAddGateways.name[0] }}
                    </small>
                </div>
                <div class="field">
                    <label for="ip">IP</label>
                    <InputText id="ip" :disabled="pendingAddGateway" required="true"
                        :invalid="errorsAddGateways && errorsAddGateways.ip" v-model="addGateway.ip" />
                    <small class="p-invalid" v-if="errorsAddGateways && errorsAddGateways.ip">
                        {{ errorsAddGateways.ip[0] }}
                    </small>
                </div>
                <div class="field">
                    <label for="location">Lokasi</label>
                    <InputText id="location" :disabled="pendingAddGateway"
                        :invalid="errorsAddGateways && errorsAddGateways.location" required="true"
                        v-model="addGateway.location" />
                    <small class="p-invalid" v-if="errorsAddGateways && errorsAddGateways.location">
                        {{ errorsAddGateways.location[0] }}
                    </small>
                </div>
                <div class="field">
                    <label class="mb-3">Role</label>
                    <div class="formgrid grid">
                        <div class="field-radiobutton col-3">
                            <RadioButton :invalid="errorsAddGateways && errorsAddGateways.role"
                                :disabled="pendingAddGateway" id="presence" v-model="addGateway.role" name="presence"
                                value="presence" />
                            <label for="presence">Presensi</label>
                        </div>
                        <div class="field-radiobutton col-3">
                            <RadioButton :invalid="errorsAddGateways && errorsAddGateways.role"
                                :disabled="pendingAddGateway" id="register" v-model="addGateway.role" name="register"
                                value="register" />
                            <label for="register">Register</label>
                        </div>
                    </div>
                </div>

                <template #footer>
                    <Button label="Batal" :disabled="pendingAddGateway" severity="danger" icon="pi pi-times" outlined
                        @click.prevent="addGatewayDialog = false" />
                    <Button label="Simpan" :loading="pendingAddGateway" :disabled="pendingAddGateway" icon="pi pi-link"
                        @click="addGatewayStore" />
                </template>
            </Dialog>

            <Dialog v-model:visible="showDialogRemoveGateway" :style="{ width: '450px' }" header="Confirm"
                :modal="true">
                <div class="flex align-items-center justify-content-center">
                    <span>Yakin ingin menghapus gateway ini ?</span>
                </div>
                <template #footer>
                    <!-- <Button label="Batalkan" outlined @click="deleteProductsDialog = false" /> -->
                    <Button label="Hapus" outlined severity="danger" :disabled="removeGatewayPending" :loading="removeGatewayPending" @click="handleRemoveGateway" />
                </template>
            </Dialog>
        </div>
    </div>
</template>
