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

const selectedGroup = ref([]);

const { session, parentRefresh } = defineProps({
    session: {
        type: Object,
        required: false
    },
    parentRefresh: {
        type: Function
    }
});

const getAllSessions = async () => {
    const queries = {
        page: queryParams.value.first / queryParams.value.rows + 1,
        limit: queryParams.value.rows,
        ...(filters.value && { search: filters.value })
    };

    const params = new URLSearchParams(queries);

    return await axios.get(`/meeting-session?${params}`);
};
const {
    data: sessions,
    isLoading,
    refetch
} = useQuery({
    queryKey: ['meeting-session', queryParams.value],
    queryFn: getAllSessions,
    keepPreviousData: true
});

const onPage = (event) => {
    queryParams.value = event;
    refetch();
};

watch(sessions, () => {
    if (sessions.value) {
        totalRecords.value = sessions.value.data.data.meta.totalCount;
    }
});
const handleDebounceFilter = (val) => {
    filters.value = val;
    refetch();
};

const addSessionDialog = ref(false);
const errorsAddSession = ref({});
const sessionData = ref({
    name: '',
    date: '',
    time: '',
    agenda: '',
    location: ''
});
const addSessionService = async (data) => {
    return await axios.post('/meeting-session', {
        name: data.name,
        date: data.date,
        time: data.time,
        agenda: data.agenda,
        location: data.location
    });
};

const { isPending: addSessionLoading, mutateAsync: addSession } = useMutation({
    mutationKey: ['addSession'],
    mutationFn: addSessionService
});
const handleAddSession = () => {
    addSession(sessionData.value, {
        onSuccess: () => {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Session berhasil ditambahkan',
                life: 3000
            });
            addSessionDialog.value = false;
            sessionData.value = {
                name: '',
                start_time: null,
                end_time: null,
                allow_twice: false,
                gateways: []
            };
            selectedGroup.value = [];
            refetch();
        },
        onError: (err) => {
            if (err.response.status === 400) {
                if (err.response.data.message) {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: err.response.data.message,
                        life: 3000
                    });
                }
                errorsAddSession.value = err.response.data;
            } else if (err.response.status === 404) {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Gateway sudah digunakan atau belum tersedia',
                    life: 3000
                });
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Session gagal ditambahkan',
                    life: 3000
                });
            }
        }
    });
};

const deleteSessionService = async (id) => {
    return await axios.delete(`/meeting-session/${id}`);
};

const { mutateAsync: deleteSession, isPending: deleteSessionPending } = useMutation({
    mutationKey: ['deleteMeetingSessionService'],
    mutationFn: deleteSessionService
});

const confirmDeleteSession = (id) => {
    confirm.require({
        target: event.currentTarget,
        header: 'Konfirmasi',
        message: 'Yakin hapus sesi meeting ini ?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-sm p-button-danger',
        rejectLabel: 'Batalkan',
        acceptLabel: 'Hapus',
        accept: () => {
            deleteSession(id, {
                onSuccess() {
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Session berhasil dihapus',
                        life: 3000
                    });
                    refetch();
                    parentRefresh();
                },
                onError() {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Session gagal dihapus',
                        life: 3000
                    });
                }
            });
        }
    });
};

// update
const showDialogUpdateSession = ref(false);
const dataUpdateSession = ref({
    name: '',
    date: ''
});
const errorsUpdateSession = ref({});

const updateService = async (data) => {
    return await axios.patch(`/meeting-session/${data.id}`, {
        name: data.name,
        date: data.date
    });
};

const { isPending: updateSessionLoading, mutateAsync: updateSession } = useMutation({
    mutationKey: ['updateSession'],
    mutationFn: updateService
});

const handleShowDialogUpdateSesion = (data) => {
    showDialogUpdateSession.value = true;
    errorsUpdateSession.value = {};
    dataUpdateSession.value = {
        id: data.id,
        name: data.name,
        date: new Date(data.date)
    };
};

const clearUpdateSession = () => {
    dataUpdateSession.value = {
        name: '',
        date: null
    };

    showDialogUpdateSession.value = false;
};

const handleSubmitUpdateSesion = () => {
    updateSession(
        {
            id: dataUpdateSession.value.id,
            name: dataUpdateSession.value.name,
            date: dataUpdateSession.value.date
        },
        {
            onSuccess() {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Session berhasil diupdate',
                    life: 3000
                });

                errorsUpdateSession.value = {};
                clearUpdateSession();
                refetch();
                parentRefresh();
            },
            onError: (err) => {
                if (!err.response) return;
                if (err.response.status === 400) {
                    if (err.response.data.message) {
                        toast.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: err.response.data.message,
                            life: 3000
                        });
                    }
                    errorsUpdateSession.value = err.response.data;
                } else if (err.response.status === 404) {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Gateway sudah digunakan atau belum tersedia',
                        life: 3000
                    });
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Session gagal diupdate',
                        life: 3000
                    });
                }
            }
        }
    );
};

const selectedMeetingService = async (data) => {
    return await axios.post(`/meeting-session/${data.id}/selected/${session.id}`);
};

const { mutateAsync: selectedMeeting, isPending: selectedMeetingLoading } = useMutation({
    mutationKey: ['selectedMeeting'],
    mutationFn: selectedMeetingService
});
const handleSelectedMeetingSession = (data) => {
    selectedMeeting(data, {
        onSuccess() {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Session berhasil dipilih',
                life: 3000
            });
            refetch();
            parentRefresh();
        },
        onError() {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Session gagal dipilih',
                life: 3000
            });
        }
    });
};
const unSelectedMeetingService = async (data) => {
    return await axios.post(`/meeting-session/${data.id}/unselected/${session.id}`);
};

const { mutateAsync: unSelectedMeeting, isPending: unSelectedMeetingLoading } = useMutation({
    mutationKey: ['unSelectedMeeting'],
    mutationFn: unSelectedMeetingService
});
const handleUnSelectedMeetingSession = (data) => {
    unSelectedMeeting(data, {
        onSuccess() {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Session berhasil diupdate',
                life: 3000
            });
            refetch();
            parentRefresh();
        },
        onError() {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Session gagal dipilih',
                life: 3000
            });
        }
    });
};
</script>

<template>
    <div class="grid">
        <div class="col">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Buat sesi rapat baru" icon="pi pi-plus" class="mr-2" @click.prevent="addSessionDialog = true" />
                        </div>
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :totalRecords="totalRecords"
                    v-model:expandedRows="expandedRows"
                    :loading="isLoading"
                    :value="isLoading ? [] : sessions.data.data.items"
                    dataKey="id"
                    paginator
                    :rows="10"
                    :filters="filters"
                    lazy
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[10, 25, 50]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sessions"
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
                            <span> Data sesi rapat masih kosong </span>
                        </div>
                    </template>
                    <Column field="name" header="Nama"> </Column>
                    <Column field="date" header="Tanggal">
                        <template #body="{ data }">
                            {{ format(data.date, 'EEEE, dd MMMM yyyy', { locale: id }) }}
                        </template>
                    </Column>
                    <Column headerStyle="width:4rem">
                        <template #body="{ data }">
                            <div class="flex gap-2 mt-1">
                                <Button icon="pi pi-pencil" @click.prevent="handleShowDialogUpdateSesion(data)" />
                                <Button :loading="deleteSessionPending" :disabled="deleteSessionPending" severity="danger" @click.prevent="confirmDeleteSession(data.id)" icon="pi pi-trash" />
                                <!-- session.meeting_session.id !== data.id -->
                                <Button
                                    v-if="data.presence_sessions && data.presence_sessions.id === session.id"
                                    icon="pi pi-times-circle"
                                    outlined
                                    severity="danger"
                                    :loading="unSelectedMeetingLoading"
                                    @click.prevent="handleUnSelectedMeetingSession(data)"
                                />
                                <Button v-else icon="pi pi-check-circle" severity="contrast" :loading="selectedMeetingLoading" @click.prevent="handleSelectedMeetingSession(data)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <Dialog v-model:visible="addSessionDialog" :style="{ width: '450px' }" header="Buat sesi rapat baru" :modal="true" class="p-fluid">
            <div class="field">
                <label for="name">Nama</label>
                <InputText id="name" :disabled="addSessionLoading" :invalid="errorsAddSession && errorsAddSession.name" required="true" autofocus v-model="sessionData.name" />
                <p class="text-red-500" v-if="errorsAddSession && errorsAddSession.name">
                    {{ errorsAddSession.name[0] }}
                </p>
            </div>
            <div class="field">
                <label for="location">Tempat</label>
                <InputText id="location" :disabled="addSessionLoading" :invalid="errorsAddSession && errorsAddSession.location" required="true" autofocus v-model="sessionData.location" />
                <p class="text-red-500" v-if="errorsAddSession && errorsAddSession.location">
                    {{ errorsAddSession.location[0] }}
                </p>
            </div>
            <div class="field">
                <label for="time">Waktu</label>
                <InputText id="time" :disabled="addSessionLoading" :invalid="errorsAddSession && errorsAddSession.time" required="true" autofocus v-model="sessionData.time" />
                <p class="text-red-500" v-if="errorsAddSession && errorsAddSession.time">
                    {{ errorsAddSession.time[0] }}
                </p>
            </div>
            <div class="field">
                <label for="date">Tanggal</label>
                <Calendar v-model="sessionData.date" dateFormat="dd/mm/yy" :disabled="addSessionLoading" class="w-full" />
                <p class="text-red-500" v-if="errorsUpdateSession && errorsAddSession.date">
                    {{ errorsAddSession.date[0] }}
                </p>
            </div>
            <div class="field">
                <label for="agenda">Agenda</label>
                <InputText id="agenda" :disabled="addSessionLoading" :invalid="errorsAddSession && errorsAddSession.agenda" required="true" autofocus v-model="sessionData.agenda" class="p-4" />
                <p class="text-red-500" v-if="errorsAddSession && errorsAddSession.agenda">
                    {{ errorsAddSession.agenda[0] }}
                </p>
            </div>
            <div class="field">
                <Button :loading="addSessionLoading" :disabled="addSessionLoading" label="Simpan" @click.prevent="handleAddSession" />
            </div>
        </Dialog>
        <Dialog v-model:visible="showDialogUpdateSession" :style="{ width: '450px' }" header="Update sesi rapat" :modal="true" class="p-fluid">
            <div class="field">
                <label for="name">Nama</label>
                <InputText id="name" :disabled="updateSessionLoading" :invalid="errorsUpdateSession && errorsUpdateSession.name" required="true" autofocus v-model="dataUpdateSession.name" />
                <p class="text-red-500" v-if="errorsUpdateSession && errorsUpdateSession.name">
                    {{ errorsUpdateSession.name[0] }}
                </p>
            </div>
            <div class="field">
                <Calendar v-model="dataUpdateSession.date" dateFormat="dd/mm/yy" :disabled="updateSessionLoading" placeholder="Tanggal" class="w-full" />
                <p class="text-red-500" v-if="errorsUpdateSession && errorsUpdateSession.date">
                    {{ errorsUpdateSession.date[0] }}
                </p>
            </div>
            <div class="field">
                <Button :loading="updateSessionLoading" :disabled="updateSessionLoading" label="Update" @click.prevent="handleSubmitUpdateSesion" />
            </div>
        </Dialog>
    </div>
</template>
