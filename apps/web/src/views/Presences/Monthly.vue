<script setup>
import { useQuery } from '@tanstack/vue-query';
import { eachDayOfInterval, format } from 'date-fns';
import { getCurrentInstance, ref, watch } from 'vue';
import { useVueToPrint } from 'vue-to-print';
import html2pdf from 'html2pdf.js';

const { proxy } = getCurrentInstance();
const axios = proxy.axios;

// the datatable queries server side
const sessionId = ref(null);
const filterDate = ref();
const selectedRombel = ref();
const detailSession = ref(null);

const getAllPresences = async () => {
    if (sessionId.value && selectedRombel.value && filterDate.value) {
        const queries = {
            date: format(filterDate.value, 'yyyy-MM')
        };

        const params = new URLSearchParams(queries);

        return await axios.get(`/presence/${sessionId.value}/${selectedRombel.value.value}/monthly?${params}`);
    } else {
        throw new Error();
    }
};

const {
    data: presences,
    isLoading,
    refetch
} = useQuery({
    queryKey: [`presences-all-recap-month`, sessionId.value, selectedRombel.value, filterDate.value],
    queryFn: getAllPresences
});

const onPage = (event) => {
    queryParams.value = event;
    refetch();
};

const getRombel = async () => {
    return await axios.get('/siswa/rombel');
};

const { data: dataRombels, isLoading: loadingRombel } = useQuery({
    queryKey: ['rombel'],
    queryFn: getRombel
});

watch([sessionId, selectedRombel, filterDate], (val) => {
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
    if (sessionId.value && selectedRombel.value && filterDate.value) {
        const queries = {
            date: format(filterDate.value, 'yyyy-MM')
        };

        const params = new URLSearchParams(queries);

        const response = await axios.get(`/presence/${sessionId.value}/${selectedRombel.value.value}/monthly/export?${params}`, {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${format(new Date(), 'yyyy-MM')}-presences-${selectedRombel.value.value}.xlsx`);
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
    selectedRombel.value = null;
    filterDate.value = null;
};

const getRangeDate = (startDate, endDate) => {
    return eachDayOfInterval({ start: startDate, end: endDate });
};

const componentPrintRef = ref();
const { handlePrint } = useVueToPrint({
    content: componentPrintRef,
    documentTitle: format(new Date(), 'yyyy-MM-dd') + '-presences',
    removeAfterPrint: true,
    copyStyles: true,
    pageStyle: `
        @page { size: A4; margin: 1cm; size: A4 landscape; }
        body { font-family: Arial, sans-serif; }
        .print-table { width: 100%; border-collapse: collapse; margin-bottom:20px }
        .print-table th, .print-table td { border: 1px solid #000; padding: 8px; text-align: left; }
        .print-table th { background-color: #f2f2f2; font-weight: bold; }
      `
});

const generatePdf = () => {
    if (componentPrintRef.value) {
        html2pdf()
            .set({
                margin: 5,
                filename: `${format(new Date(), 'yyyy-MM-dd')}-presences.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, imageTimeout: 15000 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
            })
            .from(componentPrintRef.value)
            .save();
    }
};
</script>
<template>
    <div>
        <div class="field">
            <select-session role="SISWA" @input="handleChangeSelectSession" />
            <Dropdown :loading="loadingRombel" v-model="selectedRombel" :options="dataRombels ? dataRombels.data.data.map((item) => ({ value: item })) : []" optionLabel="value" placeholder="Pilih Rombel" class="w-full mt-3" />
            <Calendar v-model="filterDate" placeholder="Pilih Bulan dan Tahun" view="month" dateFormat="yy/mm" showButtonBar :manualInput="false" class="mt-3 w-full" />

            <div class="flex gap-2">
                <Button :disabled="isLoading || loadingExport" :loading="isLoading || loadingExport" icon="pi pi-file-excel" label="Export" @click.prevent="handleExportService" class="mt-3" v-if="sessionId && selectedRombel && filterDate && $can('presences:export-monthly')" />
                <Button severity="info" :disabled="isLoading" :loading="isLoading" icon="pi pi-print" label="Print" @click.prevent="handlePrint" class="mt-3" v-if="sessionId && selectedRombel && filterDate" />
                <Button
                    :disabled="isLoading || loadingExport"
                    :loading="isLoading || loadingExport"
                    icon="pi pi-file-pdf"
                    severity="help"
                    label="Download PDF"
                    @click.prevent="generatePdf"
                    class="mt-3"
                    v-if="sessionId && selectedRombel && filterDate"
                />
                <Button :disabled="isLoading || loadingExport" :loading="isLoading || loadingExport" icon="pi pi-refresh" outlined label="Refresh" @click.prevent="refetch" class="mt-3" v-if="sessionId && selectedRombel && filterDate" />
                <Button icon="pi pi-refresh" outlined label="Reset" @click.prevent="resetAll" class="mt-3" severity="danger" v-if="sessionId && selectedRombel && filterDate" />
            </div>
        </div>

        <div class="overflow-x-auto" v-if="sessionId && selectedRombel && filterDate && presences">
            <!-- <Divider />
            <div class="detail-session">
                <h3>
                    {{ detailSession.name }}
                </h3>
                <p>Dicetak pada {{ format(new Date(), "yyyy-MM-dd HH:mm:ss") }}</p>
            </div>
            <h4 class="filter-date">
                {{ format(filterDate, "MMMM yyyy", { locale: id }) }}
            </h4> -->
            <table ref="componentPrintRef" class="print-table p-datatable p-datatable-gridlines p-component w-full">
                <!-- Table Header -->
                <thead class="p-datatable-thead">
                    <tr>
                        <th class="p-column-header">Nama</th>
                        <th class="p-column-header" v-for="date in getRangeDate(presences.data.data.date.startDate, presences.data.data.date.endDate)" :key="date">
                            {{ format(date, 'dd') }}
                        </th>
                    </tr>
                </thead>

                <!-- Table Body -->
                <tbody class="p-datatable-tbody" v-for="(presence, idx) in presences.data.data.presences" :key="idx">
                    <tr class="p-row">
                        <td class="p-column-body" style="min-width: 200px">{{ presence.name }}</td>
                        <td class="p-column-body" style="min-width: 100px" v-for="(date, idx) in getRangeDate(presences.data.data.date.startDate, presences.data.data.date.endDate)" :key="date">
                            <div v-if="presence.presences[idx]" class="flex flex-column gap-1">
                                <Tag severity="success" v-if="presence.presences[idx][format(date, 'dd')] && presence.presences[idx][format(date, 'dd')].enter_time">
                                    {{ format(presence.presences[idx][format(date, 'dd')].enter_time, 'HH:mm:ss') }}
                                </Tag>
                                <Tag severity="danger" v-if="presence.presences[idx][format(date, 'dd')] && presence.presences[idx][format(date, 'dd')].exit_time">
                                    {{ format(presence.presences[idx][format(date, 'dd')].exit_time, 'HH:mm:ss') }}
                                </Tag>
                                <!-- <Tag severity="danger" v-if="presence.presences.find(pr => pr[parseInt(format(date, 'dd'))])[format(date,
                                    'dd')].exit_time">
                                    {{ format(presence.presences.find(pr => pr[parseInt(format(date,
                                        'dd'))])[format(date,
                                            'dd')].exit_time, 'HH:mm:ss') }}
                                </Tag> -->
                            </div>
                            <p v-else>-</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
