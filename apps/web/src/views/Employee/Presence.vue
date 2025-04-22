<script setup>
import { useQuery } from '@tanstack/vue-query';
import { eachDayOfInterval, format } from 'date-fns';
import { getCurrentInstance, ref, watch } from 'vue';
import { useVueToPrint } from 'vue-to-print';
import html2pdf from 'html2pdf.js';
import { id } from 'date-fns/locale';

const { proxy } = getCurrentInstance();
const axios = proxy.axios;

const sessionId = ref(null);
const filterDate = ref();
const selectedRombel = ref();
const detailSession = ref(null);

const getAllPresences = async () => {
    const queries = {
        date: format(filterDate.value, 'yyyy-MM')
    };

    const params = new URLSearchParams(queries);

    return await axios.get(`/presence-pegawai/auto-read?${params}`);
};

const {
    data: presences,
    isLoading,
    refetch,
    status
} = useQuery({
    queryKey: [`presences-auto-read-recap-month`, filterDate.value],
    queryFn: getAllPresences
});

const onPage = (event) => {
    queryParams.value = event;
    refetch();
};

watch([filterDate], (val) => {
    refetch();
});

// export
// const loadingExport = ref(false);
// const handleExportService = async () => {
//     loadingExport.value = true;
//     if (sessionId.value && selectedRombel.value && filterDate.value) {
//         const queries = {
//             date: format(filterDate.value, 'yyyy-MM')
//         };

//         const params = new URLSearchParams(queries);

//         const response = await axios.get(`/presence/${sessionId.value}/${selectedRombel.value.value}/monthly/export?${params}`, {
//             responseType: 'blob'
//         });
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', `${format(new Date(), 'yyyy-MM')}-presences-${selectedRombel.value.value}.xlsx`);
//         document.body.appendChild(link);
//         link.click();
//         loadingExport.value = false;
//     } else {
//         loadingExport.value = false;
//         throw new Error();
//     }
// };

const resetAll = () => {
    filterDate.value = null;
};

const getRangeDate = (startDate, endDate) => {
    return eachDayOfInterval({ start: startDate, end: endDate });
};

const componentPrintRef = ref();
// const { handlePrint } = useVueToPrint({
//     content: componentPrintRef,
//     documentTitle: format(new Date(), 'yyyy-MM-dd') + '-presences',
//     removeAfterPrint: true,
//     copyStyles: true,
//     pageStyle: `
//         @page { size: A4; margin: 1cm; size: A4 landscape; }
//         body { font-family: Arial, sans-serif; }
//         .print-table { width: 100%; border-collapse: collapse; margin-bottom:20px }
//         .print-table th, .print-table td { border: 1px solid #000; padding: 8px; text-align: left; }
//         .print-table th { background-color: #f2f2f2; font-weight: bold; }
//       `
// });

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
    <div class="card">
        <h3>Presensi</h3>
        <hr />
        <div class="field">
            <Calendar v-model="filterDate" placeholder="Pilih Bulan dan Tahun" view="month" dateFormat="yy/mm" showButtonBar :manualInput="false" class="mt-3 w-full" />

            <div class="flex gap-2">
                <Button icon="pi pi-file-pdf" severity="help" label="Print" @click.prevent="generatePdf" class="mt-3" v-if="status == 'success' && filterDate" />
                <Button icon="pi pi-refresh" outlined label="Refresh" @click.prevent="refetch" class="mt-3" v-if="status == 'success' && filterDate" />
                <Button icon="pi pi-refresh" outlined label="Reset" @click.prevent="resetAll" class="mt-3" severity="danger" v-if="status == 'success' && filterDate" />
            </div>
        </div>
        <div class="overflow-x-auto" v-if="filterDate && status === 'success'">
            <table ref="componentPrintRef" class="print-table p-datatable p-datatable-gridlines p-component w-full">
                <thead class="p-datatable-thead">
                    <tr>
                        <th class="p-column-header">Nama</th>
                        <th class="p-column-header" v-for="date in getRangeDate(presences.data.data.date.startDate, presences.data.data.date.endDate)" :key="date">
                            {{ format(date, 'dd') }}
                        </th>
                    </tr>
                </thead>

                <tbody class="p-datatable-tbody" v-for="(presence, idx) in presences.data.data.presences" :key="idx">
                    <tr class="p-row">
                        <td class="p-column-body" style="min-width: 200px">{{ presence.name }}</td>
                        <td
                            class="p-column-body"
                            style="min-width: 100px"
                            v-for="(date, idx) in getRangeDate(presences.data.data.date.startDate, presences.data.data.date.endDate)"
                            :key="date"
                            :class="{
                                'bg-yellow-300': presence.presences[idx] && presence.presences[idx][`${format(date, 'dd')}`] && presence.presences[idx][`${format(date, 'dd')}`].leave,
                                'bg-blue-300 ':
                                    presence.presences[idx] && presence.presences[idx][`${format(date, 'dd')}`] && presence.presences[idx][`${format(date, 'dd')}`].day_off && presence.presences[idx][`${format(date, 'dd')}`].day_off.is_cuti,
                                'bg-blue-100':
                                    presence.presences[idx] && presence.presences[idx][`${format(date, 'dd')}`] && presence.presences[idx][`${format(date, 'dd')}`].day_off && !presence.presences[idx][`${format(date, 'dd')}`].day_off.is_cuti,
                                'bg-green-400 border-2 border-green-500':
                                    !(
                                        (presence.presences[idx][`${format(date, 'dd')}`] && presence.presences[idx][`${format(date, 'dd')}`].leave) ||
                                        (presence.presences[idx][`${format(date, 'dd')}`] && presence.presences[idx][`${format(date, 'dd')}`].day_off)
                                    ) && presence.presences[idx][`${format(date, 'dd')}`]
                                        ? presence.presences[idx][`${format(date, 'dd')}`].allow_twice
                                            ? presence.presences[idx][`${format(date, 'dd')}`].enter_time != '-' && presence.presences[idx][`${format(date, 'dd')}`].exit_time != '-'
                                                ? true
                                                : false
                                            : presence.presences[idx][`${format(date, 'dd')}`].enter_time
                                            ? true
                                            : false
                                        : false,
                                'bg-green-200 border-2 border-green-500':
                                    !(
                                        (presence.presences[idx][`${format(date, 'dd')}`] && presence.presences[idx][`${format(date, 'dd')}`].leave) ||
                                        (presence.presences[idx][`${format(date, 'dd')}`] && presence.presences[idx][`${format(date, 'dd')}`].day_off)
                                    ) && presence.presences[idx][`${format(date, 'dd')}`]
                                        ? presence.presences[idx][`${format(date, 'dd')}`].allow_twice
                                            ? presence.presences[idx][`${format(date, 'dd')}`].enter_time != '-' && presence.presences[idx][`${format(date, 'dd')}`].exit_time != '-'
                                                ? false
                                                : true
                                            : presence.presences[idx][`${format(date, 'dd')}`].enter_time
                                            ? false
                                            : true
                                        : false,

                                'border-2 border-red-500':
                                    !(
                                        (presence.presences[idx][`${format(date, 'dd')}`] && presence.presences[idx][`${format(date, 'dd')}`].leave) ||
                                        (presence.presences[idx][`${format(date, 'dd')}`] && presence.presences[idx][`${format(date, 'dd')}`].day_off)
                                    ) &&
                                    presence.presences[idx][`${format(date, 'dd')}`] &&
                                    presence.presences[idx][`${format(date, 'dd')}`].is_late
                            }"
                        >
                            <div v-if="presence.presences[idx]" class="flex flex-column gap-1">
                                <div
                                    class="flex flex-column gap-1"
                                    v-if="
                                        !(
                                            (presence.presences[idx][`${format(date, 'dd')}`] && presence.presences[idx][`${format(date, 'dd')}`].leave) ||
                                            (presence.presences[idx][`${format(date, 'dd')}`] && presence.presences[idx][`${format(date, 'dd')}`].day_off)
                                        )
                                    "
                                >
                                    <span class="text-md font-semibold" v-if="presence.presences[idx][`${format(date, 'dd')}`] && presence.presences[idx][`${format(date, 'dd')}`].enter_time">
                                        {{ presence.presences[idx][`${format(date, 'dd')}`].enter_time }}
                                    </span>
                                    <span
                                        class="text-md font-semibold"
                                        v-if="presence.presences[idx][`${format(date, 'dd')}`] && presence.presences[idx][`${format(date, 'dd')}`].allow_twice && presence.presences[idx][`${format(date, 'dd')}`].exit_time"
                                    >
                                        {{ presence.presences[idx][`${format(date, 'dd')}`].exit_time }}
                                    </span>
                                    <Tag severity="danger" v-if="presence.presences[idx][`${format(date, 'dd')}`] && presence.presences[idx][`${format(date, 'dd')}`].is_late"> Terlambat </Tag>
                                </div>
                                <div
                                    class="flex flex-column gap-1"
                                    v-if="
                                        presence.presences[idx][`${format(date, 'dd')}`] &&
                                        presence.presences[idx][`${format(date, 'dd')}`].leave &&
                                        presence.presences[idx][`${format(date, 'dd')}`] &&
                                        !presence.presences[idx][`${format(date, 'dd')}`].day_off
                                    "
                                >
                                    <span class="text-md font-semibold mb-2"> Izin </span>
                                    <span class="text-md font-semibold">{{ presence.presences[idx][`${format(date, 'dd')}`].leave.reason }}</span>
                                </div>
                                <div
                                    class="flex flex-column gap-1"
                                    v-if="
                                        presence.presences[idx][`${format(date, 'dd')}`] &&
                                        presence.presences[idx][`${format(date, 'dd')}`] &&
                                        presence.presences[idx][`${format(date, 'dd')}`].day_off &&
                                        !presence.presences[idx][`${format(date, 'dd')}`].leave
                                    "
                                >
                                    <span class="text-md font-semibold">
                                        {{ presence.presences[idx][`${format(date, 'dd')}`].day_off.keterangan }}
                                    </span>
                                </div>
                            </div>
                            <p v-else>-</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="flex justify-content-center flex-column align-items-center" v-if="filterDate && status === 'pending'">
            <ProgressSpinner class="h-3rem mt-2" />
            <span class="mt-3"> Memuat... </span>
        </div>
    </div>
</template>
