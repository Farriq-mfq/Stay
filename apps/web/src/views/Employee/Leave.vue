<script setup>
import { useQuery, useMutation } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, ref, watch } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import Calendar from 'primevue/calendar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
const toast = useToast();
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const confirm = useConfirm();

// datatable server side
const expandedRows = ref({});
const filters = ref(null);
const first = ref(0);
const queryParams = ref({
    first: 0,
    rows: 10
});
const totalRecords = ref(0);
const dt = ref();

const getAllLeave = async () => {
    const queries = {
        page: queryParams.value.first / queryParams.value.rows + 1,
        limit: queryParams.value.rows,
        ...(filters.value && { search: filters.value })
    };

    const params = new URLSearchParams(queries);

    return await axios.get(`/leave?${params}`);
};
const {
    data: leaves,
    isLoading,
    refetch
} = useQuery({
    queryKey: ['leave', queryParams.value],
    queryFn: getAllLeave,
    keepPreviousData: true
});

const onPage = (event) => {
    queryParams.value = event;
    refetch();
};

watch(leaves, () => {
    if (leaves.value) {
        totalRecords.value = leaves.value.data.data.meta.totalCount;
    }
});
const handleDebounceFilter = (val) => {
    filters.value = val;
    refetch();
};

const approvedDialog = ref(false);
const errorsLeave = ref({});
const approvedData = ref(null);
const notes = ref('');
const approveLeaveService = async (data) => {
    return await axios.patch(`/leave/${data.id}/approve`, {
        notes: data.notes
    });
};
const { isPending: approveLeaveLoading, mutateAsync: approveLeave } = useMutation({
    mutationKey: ['approveLeave'],
    mutationFn: approveLeaveService
});
const handleSubmitApproveLeave = async () => {
    await approveLeave(
        {
            id: approvedData.value.id,
            notes: notes.value
        },
        {
            onSuccess: (res) => {
                toast.add({
                    severity: 'success',
                    summary: 'Berhasil Menyetujui',
                    detail: res.data.message,
                    life: 3000
                });
                approvedDialog.value = false;
                refetch();
            },
            onError: (err) => {
                if (err.response.status === 400) {
                    if (err.response.message) {
                        toast.add({
                            severity: 'error',
                            summary: 'Gagal Menyetujui',
                            detail: err.response.message,
                            life: 3000
                        });
                    } else {
                        errorsLeave.value = err.response.data;
                    }
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Gagal Menyetujui',
                        detail: err.response.data.message,
                        life: 3000
                    });
                }
            }
        }
    );
};
const showApproveLeaveDialog = (data) => {
    errorsLeave.value = {};
    notes.value = '';
    approvedDialog.value = true;
    approvedData.value = data;
};
// reject leave

const rejectDialog = ref(false);
const rejectData = ref(null);
const rejectLeaveService = async (data) => {
    return await axios.patch(`/leave/${data.id}/reject`, {
        notes: data.notes
    });
};
const { isPending: rejectLeaveLoading, mutateAsync: rejectLeave } = useMutation({
    mutationKey: ['rejectLeave'],
    mutationFn: rejectLeaveService
});
const handleSubmitRejectLeave = async () => {
    await rejectLeave(
        {
            id: rejectData.value.id,
            notes: notes.value
        },
        {
            onSuccess: (res) => {
                toast.add({
                    severity: 'success',
                    summary: 'Berhasil Menolak',
                    detail: res.data.message,
                    life: 3000
                });
                rejectDialog.value = false;
                refetch();
            },
            onError: (err) => {
                if (err.response.status === 400) {
                    if (err.response.message) {
                        toast.add({
                            severity: 'error',
                            summary: 'Gagal Menolak',
                            detail: err.response.message,
                            life: 3000
                        });
                    } else {
                        errorsLeave.value = err.response.data;
                    }
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Gagal Menolak',
                        detail: err.response.data.message,
                        life: 3000
                    });
                }
            }
        }
    );
};
const showRejectLeaveDialog = (data) => {
    errorsLeave.value = {};
    notes.value = '';
    rejectDialog.value = true;
    rejectData.value = data;
};
</script>

<template>
    <div class="grid">
        <div class="col">
            <div class="card">
                <h3>Permintaaan Izin</h3>
                <hr />
                <DataTable
                    ref="dt"
                    :totalRecords="totalRecords"
                    v-model:expandedRows="expandedRows"
                    :loading="isLoading"
                    :value="isLoading ? [] : leaves.data.data.items"
                    dataKey="id"
                    paginator
                    :rows="10"
                    :filters="filters"
                    lazy
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[10, 25, 50]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} leaves"
                    :first="first"
                    @page="onPage($event)"
                >
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
                            <span> Data izin masih kosong </span>
                        </div>
                    </template>
                    <Column field="name" header="Nama">
                        <template #body="{ data }">
                            {{ data.pegawai.name }}
                        </template>
                    </Column>
                    <Column field="start_date" header="Tanggal Mulai Izin">
                        <template #body="{ data }">
                            {{ format(new Date(data.start_date), 'dd/MM/yyyy', { locale: id }) }}
                        </template>
                    </Column>
                    <Column field="end_date" header="Tanggal Akhir Izin">
                        <template #body="{ data }">
                            {{ format(new Date(data.end_date), 'dd/MM/yyyy', { locale: id }) }}
                        </template>
                    </Column>
                    <Column field="duration" header="Durasi (Hari)">
                        <template #body="{ data }"> {{ data.duration }} Hari </template>
                    </Column>
                    <Column field="duration" header="Alasan">
                        <template #body="{ data }"> {{ data.reason }} </template>
                    </Column>
                    <Column field="applied_at" header="Tanggal Diajukan">
                        <template #body="{ data }">
                            {{ format(new Date(data.applied_at), 'dd/MM/yyyy', { locale: id }) }}
                        </template>
                    </Column>
                    <Column field="name" header="DiProses Tanggal">
                        <template #body="{ data }">
                            <div v-if="data.processed_at" class="flex flex-column gap-1">
                                {{ format(new Date(data.processed_at), 'dd/MM/yyyy', { locale: id }) }}
                                <span class="text-600">Disetujui oleh {{ data.approver_name }}</span>
                            </div>
                            <div v-else>-</div>
                        </template>
                    </Column>
                    <Column field="status" header="Status">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <span
                                    :class="{
                                        'text-green-500 font-bold': data.status === 'Approved',
                                        'text-yellow-500 font-bold': data.status === 'Pending',
                                        'text-red-500 font-bold': data.status === 'Rejected'
                                    }"
                                >
                                    {{ data.status === 'Approved' ? 'Disetujui' : data.status === 'Pending' ? 'Pending' : 'Ditolak' }}
                                </span>
                                <i
                                    :class="{
                                        'pi pi-check-circle text-green-500': data.status === 'Approved',
                                        'pi pi-clock text-yellow-500': data.status === 'Pending',
                                        'pi pi-times-circle text-red-500': data.status === 'Rejected'
                                    }"
                                ></i>
                            </div>
                        </template>
                    </Column>
                    <Column headerStyle="width:4rem">
                        <template #body="{ data }">
                            <div class="flex gap-2 mt-1">
                                <Button v-if="data.status === 'Pending' && $can('leave:approve')" icon="pi pi-check-circle" @click="showApproveLeaveDialog(data)" />
                                <Button v-if="data.status === 'Pending' && $can('leave:reject')" severity="danger" icon="pi pi-times-circle" @click="showRejectLeaveDialog(data)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <Dialog v-model:visible="approvedDialog" :style="{ width: '450px' }" header="Setujui Izin" :modal="true" class="p-fluid">
            <div class="field">
                <label for="notes">Catatan</label>
                <Textarea rows="5" id="notes" :disabled="approveLeaveLoading" :invalid="errorsLeave && errorsLeave.notes" required="true" autofocus v-model="notes" />
                <p class="text-red-500" v-if="errorsLeave && errorsLeave.notes">{{ errorsLeave.notes[0] }}</p>
            </div>
            <div class="field">
                <Button :loading="approveLeaveLoading" :disabled="approveLeaveLoading" label="Izinkan" @click.prevent="handleSubmitApproveLeave" />
            </div>
        </Dialog>
        <Dialog v-model:visible="rejectDialog" :style="{ width: '450px' }" header="Tolak Izin" :modal="true" class="p-fluid">
            <div class="field">
                <label for="notes">Catatan</label>
                <Textarea rows="5" id="notes" :disabled="rejectLeaveLoading" :invalid="errorsLeave && errorsLeave.notes" required="true" autofocus v-model="notes" />
                <p class="text-red-500" v-if="errorsLeave && errorsLeave.notes">{{ errorsLeave.notes[0] }}</p>
            </div>
            <div class="field">
                <Button :loading="rejectLeaveLoading" severity="danger" :disabled="rejectLeaveLoading" label="Tolak Izin" @click.prevent="handleSubmitRejectLeave" />
            </div>
        </Dialog>
    </div>
</template>
