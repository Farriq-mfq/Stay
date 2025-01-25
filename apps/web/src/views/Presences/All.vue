<script setup>
import { useQuery } from '@tanstack/vue-query';
import { format, parse } from 'date-fns';
import { getCurrentInstance, ref, watch } from 'vue';
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
const sessionId = ref(null)
const filterDate = ref()


const getAllPresences = async () => {
  if (sessionId.value) {
    const queries = {
      page: (queryParams.value.first / queryParams.value.rows) + 1,
      limit: queryParams.value.rows,
      ...filters.value && { search: filters.value },
      ...filterDate.value && filterDate.value.length === 2 && {
        date: JSON.stringify({
          start_date: format(filterDate.value[0], "yyyy-MM-dd"),
          end_date: format(filterDate.value[1], "yyyy-MM-dd"),
        })
      }
    }


    const params = new URLSearchParams(queries)

    return await axios.get(`/presence/${sessionId.value}?${params}`)
  } else {
    throw new Error()
  }
}


const { data: presences, isLoading, refetch } = useQuery({
  queryKey: [`presences-all`, sessionId.value, queryParams.value],
  queryFn: getAllPresences,
})


const onPage = (event) => {
  queryParams.value = event;
  refetch()
};

watch(presences, () => {
  if (presences.value) {
    totalRecords.value = presences.value.data.data.meta.totalCount
  }
})

watch(sessionId, (val) => {
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
  if (sessionId.value) {
    const queries = {
      ...filters.value && { search: filters.value },
      ...filterDate.value && filterDate.value.length === 2 && {
        date: JSON.stringify({
          start_date: format(filterDate.value[0], "yyyy-MM-dd"),
          end_date: format(filterDate.value[1], "yyyy-MM-dd"),
        })
      }
    }

    const params = new URLSearchParams(queries)

    const response = await axios.get(`/presence/export/${sessionId.value}?${params}`, {
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${format(new Date(), 'yyyy-MM-dd')}-presences.xlsx`);
    document.body.appendChild(link);
    link.click();
    loadingExport.value = false;
  } else {
    loadingExport.value = false;
    throw new Error()
  }
}

const handleFilter = () => {
  refetch()
}

</script>
<template>
  <div>
    <div class="field">
      <select-session @input="handleChangeSelectSession" />
      <div class="flex gap-2">
        <Button :disabled="isLoading || loadingExport" :loading="isLoading || loadingExport" icon="pi pi-file-excel"
          label="Export" @click.prevent="handleExportService" class="mt-3" v-if="sessionId" />
        <Button :disabled="isLoading || loadingExport" :loading="isLoading || loadingExport" icon="pi pi-refresh"
          outlined label="Refresh" @click.prevent="refetch" class="mt-3" v-if="sessionId" />
      </div>
    </div>
    <div v-if="sessionId" class="mt-3">
      <div class="flex gap-2">
        <Calendar v-model="filterDate" :disabled="isLoading" placeholder="Filter Tanggal Presensi" showButtonBar
          selectionMode="range" :manualInput="false" />
        <Button :loading="isLoading" icon="pi pi-filter" label="Filter" @click="handleFilter" />
      </div>
    </div>

    <DataTable v-if="sessionId" ref="dt" :totalRecords="totalRecords" v-model:expandedRows="expandedRows"
      :loading="isLoading" :value="isLoading ? [] : presences.data.data.items" dataKey="id" paginator :rows="10"
      :filters="filters" lazy
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 25, 50]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} presences" :first="first"
      @page="onPage($event)">
      <template #header>
        <div class="flex flex-column md:flex-row md:justify-content-end md:align-items-center">
          <IconField iconPosition="left" class="block mt-2 md:mt-0">
            <InputIcon class="pi pi-search" />
            <InputText v-debounce:300ms="handleDebounceFilter" class="w-full sm:w-auto" placeholder="Search..." />
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
          {{ data.siswa.name }}
        </template>
      </Column>
      <Column header="Rombel">
        <template #body="{ data }">
          {{ data.siswa.rombel }}
        </template>
      </Column>
      <Column header="Lokasi">
        <template #body="{ data }">
          {{ data.gateway ? data.gateway.location : '-' }}
        </template>
      </Column>
      <Column header="Masuk">
        <template #body="{ data }">
          {{ data.enter_time ?? '-' }}
        </template>
      </Column>
      <Column header="Keluar">
        <template #body="{ data }">
          {{ data.exit_time ?? '-' }}
        </template>
      </Column>
      <Column header="Metode">
        <template #body="{ data }">
          <Tag severity="info" v-if="data.method === 'card'">
            <i class="pi pi-id-card mr-1" />
            {{ data.method }}
          </Tag>
          <Tag severity="warning" v-if="data.method === 'qrcode'">
            <i class="pi pi-id-card mr-1" />
            {{ data.method }}
          </Tag>
          <Tag severity="secondary" v-if="data.method === 'other'">
            {{ data.method }}
          </Tag>
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