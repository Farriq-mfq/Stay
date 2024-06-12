<script setup>
import { useQuery, useMutation } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, ref, watch } from 'vue';
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
                            {{ filters }}
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
                        <template #body>
                            <div class="flex gap-3 mt-1">
                                <Button icon="pi pi-pencil" />
                                <Button severity="danger" icon="pi pi-power-off" />
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
