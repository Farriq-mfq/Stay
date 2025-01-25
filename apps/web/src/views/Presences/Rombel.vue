<script setup>
import { useQuery } from '@tanstack/vue-query';
import { format, parse } from 'date-fns';
import { computed, getCurrentInstance, ref, watch } from 'vue';
import { useVueToPrint } from 'vue-to-print';
const { proxy } = getCurrentInstance()
const axios = proxy.axios

// the datatable queries server side
const filters = ref(null);
const sessionId = ref(null)
const filterDate = ref()
const selectedRombel = ref();


const getAllPresences = async () => {
    if (sessionId.value && selectedRombel.value && filterDate.value) {
        const queries = {
            ...filters.value && { search: filters.value },
            date: format(filterDate.value, "yyyy-MM-dd"),
        }

        const params = new URLSearchParams(queries)

        return await axios.get(`/presence/${sessionId.value}/${selectedRombel.value.value}?${params}`)
    } else {
        throw new Error()
    }
}


const { data: presences, isLoading, refetch } = useQuery({
    queryKey: [`presences-all-rombel`, sessionId.value, selectedRombel.value, filterDate.value],
    queryFn: getAllPresences,
})


const getRombel = async () => {
    return await axios.get('/siswa/rombel');
}

const { data: dataRombels, isLoading: loadingRombel } = useQuery({
    queryKey: ['rombel'],
    queryFn: getRombel
})



watch([sessionId, selectedRombel, filterDate], (val) => {
    refetch()
})



const handleDebounceFilter = (val) => {
    filters.value = val;
    refetch()
}


const handleChangeSelectSession = (val) => {
    sessionId.value = val.id
}

// export
const loadingExport = ref(false)
const handleExportService = async () => {
    loadingExport.value = true;
    if (sessionId.value && selectedRombel.value && filterDate.value) {
        const queries = {
            ...filters.value && { search: filters.value },
            date: format(filterDate.value, "yyyy-MM-dd"),
        }

        const params = new URLSearchParams(queries)

        const response = await axios.get(`/presence/export/${sessionId.value}/${selectedRombel.value.value}?${params}`, {
            responseType: 'blob',
        })
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${format(new Date(), 'yyyy-MM-dd')}-presences-${selectedRombel.value.value}.xlsx`);
        document.body.appendChild(link);
        link.click();
        loadingExport.value = false;
    } else {
        loadingExport.value = false;
        throw new Error()
    }
}

const resetAll = () => {
    sessionId.value = null
    selectedRombel.value = null
    filterDate.value = null
}


const componentPrintRef = ref();
const { handlePrint } = useVueToPrint({
    content: componentPrintRef,
    documentTitle: format(new Date(), 'yyyy-MM-dd') + "-presences",
    removeAfterPrint: true,
    copyStyles: true,
});
</script>
<template>
    <div>
        <div class="field">
            <select-session @input="handleChangeSelectSession" />
            <Dropdown :loading="loadingRombel" v-model="selectedRombel"
                :options="dataRombels ? dataRombels.data.data.map(item => ({ value: item })) : []" optionLabel="value"
                placeholder="Pilih Rombel" class="w-full mt-3" />
            <Calendar v-model="filterDate" placeholder="Filter Tanggal Presensi" showButtonBar :manualInput="false"
                class="mt-3 w-full" />

            <div class="flex gap-2">
                <Button :disabled="isLoading || loadingExport" :loading="isLoading || loadingExport"
                    icon="pi pi-file-excel" label="Export" @click.prevent="handleExportService" class="mt-3"
                    v-if="sessionId && selectedRombel && filterDate" />
                <Button severity="info" :disabled="isLoading" :loading="isLoading" icon="pi pi-print" label="Print"
                    @click.prevent="handlePrint" class="mt-3" v-if="sessionId && selectedRombel && filterDate" />
                <Button :disabled="isLoading || loadingExport" :loading="isLoading || loadingExport"
                    icon="pi pi-refresh" outlined label="Refresh" @click.prevent="refetch" class="mt-3"
                    v-if="sessionId && selectedRombel && filterDate" />
                <Button icon="pi pi-refresh" outlined label="Reset" @click.prevent="resetAll" class="mt-3"
                    severity="danger" v-if="sessionId && selectedRombel && filterDate" />
            </div>

        </div>


        <DataTable v-if="sessionId && selectedRombel && filterDate" ref="componentPrintRef" :loading="isLoading"
            :value="isLoading ? [] : presences.data.data" dataKey="id">
            <template #header>
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5 class="m-0">
                        Presences
                    </h5>
                    <IconField iconPosition="left" class="block mt-2 md:mt-0">
                        <InputIcon class="pi pi-search" />
                        <InputText v-debounce:300ms="handleDebounceFilter" class="w-full sm:w-auto"
                            placeholder="Search..." />
                    </IconField>
                </div>
            </template>
            <template #empty>
                <div class="flex justify-content-center p-4 gap-3 align-items-center">
                    <i class="pi pi-folder-open"></i>
                    <span>
                        Data presences masih kosong
                    </span>
                </div>
            </template>
            <!-- <Column expander /> -->
            <Column header="Nama">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
            </Column>
            <Column header="Rombel">
                <template #body="{ data }">
                    {{ data.rombel }}
                </template>
            </Column>
            <Column header="Status">
                <template #body="{ data }">
                    <Tag value="Presensi" severity="success" v-if="data.hasPresence" />
                    <Tag value="Tidak Presensi" severity="danger" v-if="!data.hasPresence" />
                </template>
            </Column>
            <Column header="Gateway">
                <template #body="{ data }">
                    {{ data.gateway }}
                </template>
            </Column>
            <Column header="Masuk">
                <template #body="{ data }">
                    {{ data.detailPresence ? data.detailPresence.enter_time : '-' }}
                </template>
            </Column>
            <Column header="Keluar">
                <template #body="{ data }">
                    {{ data.detailPresence ? data.detailPresence.exit_time ?? '-' : '-' }}
                </template>
            </Column>
            <Column header="Metode">
                <template #body="{ data }">
                    {{ data.detailPresence ? data.detailPresence.method : '-' }}
                </template>
            </Column>

            <!-- <Column header="Tanggal">
        <template #body="{ data }">
          {{ format(new Date(data.createdAt), 'EEEE, d MMMM yyyy', { locale: id }) }}
        </template>
      </Column> -->
        </DataTable>
    </div>
</template>

<style>
@media print {
    .p-datatable-header {
        display: none !important;
    }
}
</style>