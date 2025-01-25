div
<script setup>

import { getCurrentInstance, reactive, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { ref } from 'vue';
import Chart from 'primevue/chart';
import { useQuery } from '@tanstack/vue-query';
import { useVueToPrint } from "vue-to-print";
import ColorPicker from 'primevue/colorpicker';
const { proxy } = getCurrentInstance()
const axios = proxy.axios
const session = ref(null)
const { isDarkTheme } = useLayout();
const selectedRombel = ref();
const selectedYear = ref(null)
const chartType = ref('bar')

const getChartPresencesService = async () => {
    const queries = {
        ...(selectedRombel.value && {
            rombel: selectedRombel.value.value
        }),
        ...(selectedYear.value && {
            year: selectedYear.value.value
        }),
    }
    const queryParams = new URLSearchParams(queries)

    return await axios.get(`/stats/presences/chart/${session.value.id}?${queryParams}`)
}

const {
    data: chartPresences,
    isLoading: chartPresencesLoading,
} = useQuery({
    queryKey: ['getChartPresencesService', session, selectedRombel, selectedYear],
    queryFn: getChartPresencesService,
})


const handleChangeSelectSession = (val) => {
    session.value = val
    selectedRombel.value = null
    selectedYear.value = null
}


const lineData = reactive({
    labels: [],
    datasets: [
        {
            label: "",
            data: [],
            fill: true,
            backgroundColor: '#059669',
            borderColor: '#059669',
            borderWidth: 1,
            tension: 0
        },
    ]
});


const lineOptions = ref(null);

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
        }
    };
};

watch([session, chartPresences, selectedYear, selectedRombel], ([val, value, year, rombel]) => {
    lineData.datasets[0].label = val ? `${val.name} ${rombel != null ? ' - ' + rombel.value : ""} ${value ? '- ' + value.data.data.year : '-'}` : ''
    if (value) {
        let labels = []
        let dataValues = []
        value.data.data.stats.forEach(item => {
            labels.push(item.key.toUpperCase())
        })
        value.data.data.stats.forEach(item => {
            dataValues.push(item.value)
        })

        lineData.labels = labels;
        lineData.datasets[0].data = dataValues;
    }
})


watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);

const getRombel = async () => {
    return await axios.get('/siswa/rombel');
}

const { data: dataRombels, isLoading: loadingRombel } = useQuery({
    queryKey: ['rombel', session],
    queryFn: getRombel,
})


const getYears = async (sessionId) => {
    return await axios.get(`/stats/presences/years/${sessionId}`)
}

const { data: years, isLoading: loadingGetYear } = useQuery({
    queryKey: ['years', session],
    queryFn: () => getYears(session.value.id),
})

const componentPrintRef = ref();
const { handlePrint } = useVueToPrint({
    content: componentPrintRef,
    documentTitle: lineData.datasets[0].label,
    removeAfterPrint: true,
    copyStyles: true,
});

const changeChartType = () => {
    chartType.value = chartType.value == 'bar' ? 'line' : 'bar'
    lineData.datasets[0].fill = chartType.value == 'bar' ? true : false
}
const backgroundColor = ref(null)
const borderColor = ref(null)

watch([backgroundColor, borderColor], ([background, border]) => {
    lineData.datasets[0].backgroundColor = background ? `#${background}` : '#059669';
    lineData.datasets[0].borderColor = border ? `#${border}` : '#059669';
}, { immediate: true })


</script>
<template>
    <div>
        <div class="field">
            <select-session @input="handleChangeSelectSession" />
            <Dropdown v-if="session" :loading="loadingGetYear" v-model="selectedYear"
                :options="years ? years.data.data.map(item => ({ value: item })) : []" optionLabel="value"
                placeholder="Pilih Tahun" class="w-full mt-3" showClear />
            <div class="flex gap-2 lg:flex-row flex-column">
                <Button :disabled="chartPresencesLoading" :loading="chartPresencesLoading" icon="pi pi-print"
                    label="Print" class="mt-3" v-if="session" @click="handlePrint" />
                <Dropdown v-if="session" :loading="loadingRombel" v-model="selectedRombel"
                    :options="dataRombels ? dataRombels.data.data.map(item => ({ value: item })) : []"
                    optionLabel="value" placeholder="Pilih Rombel" class="w-full mt-3" showClear />

            </div>
        </div>
        <Fieldset legend="Styling Grafik" class="w-fit" v-if="session">
            <div class="flex gap-5 items-center lg:flex-col flex-row">
                <Button :disabled="chartPresencesLoading" :loading="chartPresencesLoading"
                    :icon="chartType === 'bar' ? 'pi pi-chart-line' : 'pi pi-chart-bar'"
                    :label="chartType === 'bar' ? 'Line' : 'Bar'" class="mt-3 h-fit" @click="changeChartType"
                    severity="info" />
                <div class="flex-1 flex flex-column align-items-center">
                    <label for="backgroundColor" class="font-bold block mb-2"> Background </label>
                    <ColorPicker v-model="backgroundColor" inputId="backgroundColor" format="hex" class="mb-3" />
                </div>
                <div class="flex-1 flex flex-column align-items-center">
                    <label for="borderColor" class="font-bold block mb-2"> Border </label>
                    <ColorPicker v-model="borderColor" inputId="borderColor" format="hex" class="mb-3" />
                </div>
            </div>
        </Fieldset>
        <div ref="componentPrintRef" v-if="session" class="p-3">
            <Chart :type="chartType" :data="lineData" :options="lineOptions" />
        </div>
    </div>
</template>
