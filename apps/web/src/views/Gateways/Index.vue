<script setup>
import { useQuery, useMutation } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, ref } from 'vue';
const toast = useToast();
const { proxy } = getCurrentInstance()
const axios = proxy.axios

const expandedRows = ref({});
const filters = ref({
    'name': { value: '', matchMode: 'contains' },
    'country.name': { value: '', matchMode: 'contains' },
    'company': { value: '', matchMode: 'contains' },
    'representative.name': { value: '', matchMode: 'contains' },
});
const first = ref(0);
const queryParams = ref({
    page: 1,
    perpage: 1,
    first: 0,
    rows: 10,
    sortField: null,
    sortOrder: null,
    filters: filters.value
})
const totalRecords = ref(0);
const dt = ref()


const onPage = (event) => {
    state.value = event;
};

const getAllGateways = async () => {
    return await axios.get('/gateways')
}


const { data: gateways, isLoading } = useQuery({
    queryKey: ['gateways', state.value],
    queryFn: getAllGateways
})

if (gateways.value) {
    totalRecords.value = gateways.value.data.data.meta.totalCount
}

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

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            sdfknsfdlkn
                            {{ expandedRows }}
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
                                <InputText class="w-full sm:w-auto" placeholder="Search..." />
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
                        <template #body>
                            <Button icon="pi pi-pencil" />
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
                                            {{ data.role }}
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
                                    <Button label="Hapus" outlined severity="danger" icon="pi pi-trash" />
                                </div>
                            </template>
                        </Card>
                    </template>
                </DataTable>
            </div>
        </div>
    </div>
</template>
