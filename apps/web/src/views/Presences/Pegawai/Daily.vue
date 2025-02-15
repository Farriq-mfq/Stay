<script setup>
import { useQuery } from '@tanstack/vue-query';
import { format } from 'date-fns';
import { getCurrentInstance, ref, watch } from 'vue';
import { useVueToPrint } from 'vue-to-print';
import { id } from 'date-fns/locale';
const { proxy } = getCurrentInstance();
const axios = proxy.axios;

// the datatable queries server side
const sessionId = ref(null);
const filterDate = ref();
const selectedGroup = ref();
const detailSession = ref(null);

const getAllPresences = async () => {
    if (sessionId.value && filterDate.value) {
        const queries = {
            date: format(filterDate.value, 'yyyy-MM-dd'),
            ...(selectedGroup.value && {
                group: selectedGroup.value.value
            })
        };

        const params = new URLSearchParams(queries);

        return await axios.get(`/presence-pegawai/${sessionId.value}/daily?${params}`);
    } else {
        throw new Error();
    }
};

const {
    data: presences,
    isLoading,
    refetch
} = useQuery({
    queryKey: [`presences-all-daily`, sessionId.value],
    queryFn: getAllPresences
});

const getGroup = async () => {
    return await axios.get('/pegawai/group');
};

const { data: dataGroups, isLoading: loadinggroup } = useQuery({
    queryKey: ['group'],
    queryFn: getGroup
});

watch([sessionId, filterDate, selectedGroup], (val) => {
    refetch();
});

const handleChangeSelectSession = (val) => {
    sessionId.value = val.id;
    detailSession.value = val;
};

// export
const loadingExport = ref(false);
const handleExportService = async () => {
    loadingExport.value = true;
    if (sessionId.value && filterDate.value && presences.value && presences.value.data.data.group === null) {
        const queries = {
            date: format(filterDate.value, 'yyyy-MM-dd')
        };

        const params = new URLSearchParams(queries);

        const response = await axios.get(`/presence-pegawai/export/${sessionId.value}/daily?${params}`, {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${format(new Date(), 'yyyy-MM-dd')}-presences.zip`);
        document.body.appendChild(link);
        link.click();
        loadingExport.value = false;
    } else if (sessionId.value && filterDate.value && presences.value && presences.value.data.data.group !== null) {
        const queries = {
            date: format(filterDate.value, 'yyyy-MM-dd'),
            ...(selectedGroup.value && {
                group: selectedGroup.value.value
            })
        };

        const params = new URLSearchParams(queries);

        const response = await axios.get(`/presence-pegawai/export/${sessionId.value}/daily?${params}`, {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${format(new Date(), 'yyyy-MM-dd')}-presences.xlsx`);
        document.body.appendChild(link);
        link.click();
        loadingExport.value = false;
    } else {
        loadingExport.value = false;
        throw new Error();
    }
};

const resetAll = () => {
    sessionId.value = null;
    selectedGroup.value = null;
    filterDate.value = null;
};

const componentPrintRef = ref();
const { handlePrint } = useVueToPrint({
    content: componentPrintRef,
    documentTitle: format(new Date(), 'yyyy-MM-dd') + '-presences',
    removeAfterPrint: true,
    copyStyles: true,
    pageStyle: `
        @page { size: A4; margin: 1cm;size:A4 landscape }
        body { font-family: Arial, sans-serif; }
        .print-table { width: 100%; border-collapse: collapse; margin-bottom:20px }
        .print-table th, .print-table td { border: 1px solid #000; padding: 8px; text-align: left; }
        .print-table th { background-color: #f2f2f2; font-weight: bold; }
        .filter-date { display:block !important }
        .detail-session { display:block !important }
      `
});
</script>
<template>
    <div>
        <div class="field">
            <select-session role="PEGAWAI" @input="handleChangeSelectSession" />
            <Calendar v-model="filterDate" placeholder="Filter Tanggal Presensi" showButtonBar :manualInput="false" class="mt-3 w-full" />
            <Dropdown :loading="loadinggroup" v-model="selectedGroup" :options="dataGroups ? dataGroups.data.data.map((item) => ({ value: item })) : []" optionLabel="value" placeholder="Pilih group" class="w-full mt-3" showClear />

            <div class="flex gap-2">
                <Button :disabled="isLoading || loadingExport" :loading="isLoading || loadingExport" icon="pi pi-file-excel" label="Export" @click.prevent="handleExportService" class="mt-3" v-if="sessionId && filterDate" />
                <Button severity="info" :disabled="isLoading" :loading="isLoading" icon="pi pi-print" label="Print" @click.prevent="handlePrint" class="mt-3" v-if="sessionId && filterDate" />
                <Button :disabled="isLoading || loadingExport" :loading="isLoading || loadingExport" icon="pi pi-refresh" outlined label="Refresh" @click.prevent="refetch" class="mt-3" v-if="sessionId && filterDate" />
                <Button icon="pi pi-refresh" outlined label="Reset" @click.prevent="resetAll" class="mt-3" severity="danger" v-if="sessionId && filterDate" />
            </div>
        </div>

        <div ref="componentPrintRef" class="overflow-x-auto" v-if="filterDate && presences && presences.data.data.group === null">
            <div class="detail-session">
                <h3>
                    {{ detailSession.name }}
                </h3>
                <p>Dicetak pada {{ format(new Date(), 'yyyy-MM-dd HH:mm:ss') }}</p>
            </div>
            <h4 class="filter-date">
                {{ format(filterDate, 'EEEE, dd MMMM yyyy', { locale: id }) }}
            </h4>
            <Divider />

            <div v-for="groupPresences in presences.data.data.presences" :key="Object.keys(groupPresences)[0]">
                <h3>
                    {{ Object.keys(groupPresences)[0] }}
                </h3>
                <table class="print-table p-datatable p-datatable-gridlines p-component w-full mb-4">
                    <thead class="p-datatable-thead">
                        <tr>
                            <th class="p-column-header">Nama</th>
                            <th class="p-column-header">group</th>
                            <th class="p-column-header">Status</th>
                            <th class="p-column-header">Gateway</th>
                            <th class="p-column-header">Masuk</th>
                            <th class="p-column-header">Keluar</th>
                            <th class="p-column-header">Metode</th>
                        </tr>
                    </thead>
                    <tbody class="p-datatable-tbody">
                        <tr class="p-row" v-for="dt in groupPresences[Object.keys(groupPresences)[0]]" :key="dt.id">
                            <td class="p-column-body">
                                {{ dt.name }}
                            </td>
                            <td class="p-column-body">
                                {{ dt.group }}
                            </td>
                            <td class="p-column-body">
                                <Tag value="Presensi" severity="success" v-if="dt.hasPresence" />
                                <Tag value="Tidak Presensi" severity="danger" v-if="!dt.hasPresence" />
                            </td>
                            <td class="p-column-body">
                                {{ dt.gateway }}
                            </td>
                            <td class="p-column-body">
                                {{ dt.detailPresence ? dt.detailPresence.enter_time : '-' }}
                            </td>
                            <td class="p-column-body">
                                {{ dt.detailPresence ? dt.detailPresence.exit_time ?? '-' : '-' }}
                            </td>
                            <td class="p-column-body">
                                {{ dt.detailPresence ? dt.detailPresence.method : '-' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div ref="componentPrintRef" v-if="sessionId && filterDate && presences && presences.data.data.group != null && selectedGroup">
            <div class="detail-session">
                <h3>
                    {{ detailSession.name }}
                </h3>
                <p>Dicetak pada {{ format(new Date(), 'yyyy-MM-dd HH:mm:ss') }}</p>
            </div>
            <h4 class="filter-date">
                {{ format(filterDate, 'EEEE, dd MMMM yyyy', { locale: id }) }}
            </h4>
            <Divider />
            <div>
                <h3>
                    {{ selectedGroup.value }}
                </h3>
                <table class="print-table p-datatable p-datatable-gridlines p-component w-full mb-4">
                    <thead class="p-datatable-thead">
                        <tr>
                            <th class="p-column-header">Nama</th>
                            <th class="p-column-header">Group</th>
                            <th class="p-column-header">Status</th>
                            <th class="p-column-header">Gateway</th>
                            <th class="p-column-header">Masuk</th>
                            <th class="p-column-header">Keluar</th>
                            <th class="p-column-header">Metode</th>
                        </tr>
                    </thead>
                    <tbody class="p-datatable-tbody">
                        <tr class="p-row" v-for="dt in presences.data.data.presences" :key="dt.id">
                            <td class="p-column-body">
                                {{ dt.name }}
                            </td>
                            <td class="p-column-body">
                                {{ dt.group }}
                            </td>
                            <td class="p-column-body">
                                <Tag value="Presensi" severity="success" v-if="dt.hasPresence" />
                                <Tag value="Tidak Presensi" severity="danger" v-if="!dt.hasPresence" />
                            </td>
                            <td class="p-column-body">
                                {{ dt.gateway }}
                            </td>
                            <td class="p-column-body">
                                {{ dt.detailPresence ? dt.detailPresence.enter_time : '-' }}
                            </td>
                            <td class="p-column-body">
                                {{ dt.detailPresence ? dt.detailPresence.exit_time ?? '-' : '-' }}
                            </td>
                            <td class="p-column-body">
                                {{ dt.detailPresence ? dt.detailPresence.method : '-' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
.filter-date {
    display: none;
}

.detail-session {
    display: none;
}
</style>
