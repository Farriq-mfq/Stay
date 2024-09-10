<script setup>

import { getCurrentInstance, reactive, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { ref } from 'vue';
import Chart from 'primevue/chart';
import { useQuery } from '@tanstack/vue-query';
const { proxy } = getCurrentInstance()
const axios = proxy.axios
const session = ref(null)
const { isDarkTheme } = useLayout();


const getChartPresencesService = async () => {
    return await axios.get(`/stats/presences/chart/${session.value.id}`)
}

const {
    data: chartPresences,
    isLoading: chartPresencesLoading,
} = useQuery({
    queryKey: ['getChartPresencesService', session],
    queryFn: getChartPresencesService,
})


const handleChangeSelectSession = (val) => {
    session.value = val
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

watch(session, (val) => {
    lineData.datasets[0].label = val.name
})


watch(chartPresences, (value) => {
    if (value) {
        let labels = []
        let dataValues = []
        value.data.data.forEach(item => {
            labels.push(item.key)
        })
        value.data.data.forEach(item => {
            dataValues.push(item.value)
        })

        lineData.labels = labels;
        lineData.datasets[0].data = dataValues;
    }
}, { immediate: true })



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
const printLoading = ref(false)
const printObj = ref({
    // id: "printChart",
    popTitle: session.value ? session.value.name : '-',
    beforeOpenCallback(vue) {
        printLoading.value = true
    },
    openCallback(vue) {
        printLoading.value = false
    },
})

</script>
<template>
    <div>
        <div class="field">
            <select-session @input="handleChangeSelectSession" />
            <div class="flex gap-2">
                <Button :disabled="chartPresencesLoading" :loading="chartPresencesLoading" icon="pi pi-print"
                    label="Print" class="mt-3" v-if="session" v-print="printObj" />
            </div>
        </div>
        <div id="printChart">
            <Chart type="bar" v-if="session" :data="lineData" :options="lineOptions" />
        </div>
    </div>
</template>
