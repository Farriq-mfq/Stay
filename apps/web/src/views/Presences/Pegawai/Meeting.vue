<script setup>
import { ref } from 'vue';
import VLazyImage from 'v-lazy-image';
import html2pdf from 'html2pdf.js';
import { getCurrentInstance } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const selectedMeetingSession = ref(null);
const toast = useToast();
const handleChangeMeetingSession = (data) => {
    selectedMeetingSession.value = data;
};

const pdfContent = ref(null);

const generatePdf = () => {
    if (pdfContent.value) {
        html2pdf()
            .set({
                margin: 5,
                filename: `${selectedMeetingSession.value.name}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, imageTimeout: 15000 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                // pagebreak: { mode: ['css', 'legacy'] }
            })
            .from(pdfContent.value)
            .save();
    }
};
const getPresences = async () => {
    return await axios.get(`/presence-pegawai/${selectedMeetingSession.value.id}/meeting`);
};

const { data: presences } = useQuery({
    queryKey: ['presence-pegawai-meeting', selectedMeetingSession],
    queryFn: getPresences
});
</script>

<template>
    <div>
        <SelectMeetingSession @input="handleChangeMeetingSession" />
        <Button v-if="selectedMeetingSession" @click="generatePdf" class="mt-3" icon="pi pi-file-pdf" label="Download PDF" severity="danger" />
        <div v-if="selectedMeetingSession" class="border-1 p-5 my-4 surface-border border-round">
            <div class="flex flex-column align-items-center gap-5 p-3 overflow-auto" ref="pdfContent">
                <!-- header -->
                <div class="h-10rem flex justify-content-center gap-6 align-items-center w-full" style="max-width: 80%">
                    <div class="flex align-items-center gap-2">
                        <img src="/logo2.png" class="h-4rem" />
                        <img src="/logo.png" class="h-4rem" />
                    </div>
                    <div class="h-full border-left-1"></div>
                    <div>
                        <h1 class="font-semibold text-xl">
                            {{ selectedMeetingSession.name }}
                        </h1>
                        <h2 class="font-semibold text-lg">SMK Negeri 1 Pekalongan</h2>
                        <span class="text-xs" style="font-style: italic">Dicetak oleh stay</span>
                    </div>
                </div>
                <!-- keterangan header -->
                <div class="w-full flex flex-column align-items-center" style="max-width: 80%">
                    <table class="p-datatable p-component w-full">
                        <tbody class="p-datatable-tbody">
                            <tr class="p-datatable-row">
                                <th class="p-datatable-header text-left">Hari, Tanggal :</th>
                                <td class="p-datatable-cell">
                                    {{ format(selectedMeetingSession.date, 'EEEE, dd MMMM yyyy', { locale: id }) }}
                                </td>
                            </tr>
                            <tr class="p-datatable-row">
                                <th class="p-datatable-header text-left">Waktu :</th>
                                <td class="p-datatable-cell">
                                    {{ selectedMeetingSession.time }}
                                </td>
                            </tr>
                            <tr class="p-datatable-row">
                                <th class="p-datatable-header text-left">Tempat :</th>
                                <td class="p-datatable-cell">
                                    {{ selectedMeetingSession.location }}
                                </td>
                            </tr>
                            <tr class="p-datatable-row">
                                <th class="p-datatable-header text-left">Agenda Rapat :</th>
                                <td class="p-datatable-cell">
                                    {{ selectedMeetingSession.agenda }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- content -->
                <div class="w-full flex flex-column align-items-center">
                    <table class="p-datatable p-component p-datatable-gridlines w-full" v-if="presences">
                        <thead class="p-datatable-thead">
                            <tr>
                                <th class="p-column-header surface-200">No</th>
                                <th class="p-column-header surface-200">Nama</th>
                                <th class="p-column-header surface-200">Username / NIP</th>
                                <th class="p-column-header surface-200">TTD</th>
                            </tr>
                        </thead>
                        <tbody class="p-datatable-tbody">
                            <tr class="p-datatable-row h-1rem" v-for="(pg, idx) in presences.data.data" :key="pg.id">
                                <td class="p-datatable-cell" style="max-width: 2rem; overflow: hidden; width: 2rem">
                                    {{ idx + 1 }}
                                </td>
                                <td class="p-datatable-cell" style="max-width: 10rem; overflow: hidden">
                                    {{ pg.name }}
                                </td>
                                <td class="p-datatable-cell" style="max-width: 10rem; overflow: hidden">{{ pg.username }}</td>
                                <td class="p-datatable-cell w-18rem">
                                    <div class="w-8rem h-5rem flex justify-content-center sign_container" :class="{ even: (idx + 1) % 2 === 0 }">
                                        <img v-if="pg.isPresence" :src="pg.sign_picture" class="h-full w-5rem" alt="sign" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.sign_container {
    border-bottom: 2px dotted black;
}

.even {
    transform: translateX(8rem);
}
</style>
