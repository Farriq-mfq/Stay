<script setup>
import { onMounted, reactive, ref, watch, getCurrentInstance } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useQuery } from '@tanstack/vue-query'
const { proxy } = getCurrentInstance()
const axios = proxy.axios
const { isDarkTheme } = useLayout();

const products = ref(null);
const lineData = reactive({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: '#2f4860',
      borderColor: '#2f4860',
      tension: 0.4
    },
    {
      label: 'Second Dataset',
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      backgroundColor: '#00bb7e',
      borderColor: '#00bb7e',
      tension: 0.4
    }
  ]
});
const items = ref([
  { label: 'Add New', icon: 'pi pi-fw pi-plus' },
  { label: 'Remove', icon: 'pi pi-fw pi-minus' }
]);
const lineOptions = ref(null);

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
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
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
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
      y: {
        ticks: {
          color: '#ebedef'
        },
        grid: {
          color: 'rgba(160, 167, 181, .3)'
        }
      }
    }
  };
};

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
// get all stats count
const getAllStatsService = async () => {
  return await axios.get('/stats')
}
const {
  data: statsCount,
  isLoading: statsCountLoading
} = useQuery({
  queryKey: ['stats'],
  queryFn: getAllStatsService,
})
</script>
<template>
  <div class="grid" v-if="!statsCountLoading">
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">
              Gateway
            </span>
            <div class="text-900 font-medium text-xl">
              {{ statsCount.data.data.gateways }}
            </div>
          </div>
          <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-link text-blue-500 text-xl"></i>
          </div>
        </div>
        <router-link :to="{ name: 'gateways' }" class="text-green-500 underline">
          View all
        </router-link>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Session</span>
            <div class="text-900 font-medium text-xl">
              {{ statsCount.data.data.sessions }}
            </div>
          </div>
          <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-file-edit text-orange-500 text-xl"></i>
          </div>
        </div>
        <router-link :to="{ name: 'sessions' }" class="text-green-500 underline">
          View all
        </router-link>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Siswa</span>
            <div class="text-900 font-medium text-xl">
              {{ statsCount.data.data.siswa }}
            </div>
          </div>
          <div class="flex align-items-center justify-content-center bg-cyan-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-users text-cyan-500 text-xl"></i>
          </div>
        </div>
        <router-link :to="{ name: 'siswa' }" class="text-green-500 underline">
          View all
        </router-link>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Users</span>
            <div class="text-900 font-medium text-xl">
              {{ statsCount.data.data.users }}
            </div>
          </div>
          <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-user text-purple-500 text-xl"></i>
          </div>
        </div>
        <router-link :to="{ name: 'users' }" class="text-green-500 underline">
          View all
        </router-link>
      </div>
    </div>
    <div class="col-12 xl:col-12">
      <div class="card">
        <h5>Grafik Presensi</h5>
        <Chart type="line" :data="lineData" :options="lineOptions" />
      </div>
    </div>
  </div>
</template>
