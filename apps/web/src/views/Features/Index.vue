<script setup>
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, ref, watch } from 'vue';
import { isJSON } from '@/helpers/functions';
import SelectIcon from '@/components/SelectIcon.vue';
import SelectTextColor from '@/components/SelectTextColor.vue';
const toast = useToast();
const { proxy } = getCurrentInstance();
const axios = proxy.axios;

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
const updateDialog = ref(false);
const updateData = ref({});
const errorsUpdate = ref({});
// get rombel service
const getRombel = async () => {
    return await axios.get('/siswa/rombel');
};

const { data: dataRombels, isLoading: loadingRombel } = useQuery({
    queryKey: ['rombel'],
    queryFn: getRombel
});

const getGroup = async () => {
    return await axios.get('/pegawai/group');
};

const { data: dataGroups, isLoading: loadingGroup } = useQuery({
    queryKey: ['pegawai-group'],
    queryFn: getGroup
});

watch(
    () => updateData.value.role,
    () => {
        const mappingSelectedGroup = selectedGroup.value.map((item) => item.value);
        if (updateData.value.role == 'SISWA') {
            if (dataRombels.value) {
                const validateRombel = dataRombels.value.data.data.filter((rombel) => mappingSelectedGroup.includes(rombel));
                selectedGroup.value = validateRombel.length > 0 ? validateRombel.map((item) => ({ value: item })) : [];
            }
        } else if (updateData.value.role == 'PEGAWAI') {
            if (dataGroups.value) {
                const validateGroup = dataGroups.value.data.data.filter((rombel) => mappingSelectedGroup.includes(rombel));
                selectedGroup.value = validateGroup.length > 0 ? validateGroup.map((item) => ({ value: item })) : [];
            }
        }
    }
);

const getAllSessions = async () => {
    const queries = {
        page: queryParams.value.first / queryParams.value.rows + 1,
        limit: queryParams.value.rows,
        ...(filters.value && { search: filters.value })
    };

    const params = new URLSearchParams(queries);

    return await axios.get(`/features?${params}`);
};
const {
    data: sessions,
    isLoading,
    refetch
} = useQuery({
    queryKey: ['features', queryParams.value],
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

const handleShowDialogUpdate = (data) => {
    selectedGroup.value = data.group && isJSON(data.group) ? JSON.parse(data.group).map((item) => ({ value: item })) : [];
    updateData.value = {
        id: data.id,
        title: data.title,
        icon: data.icon,
        iconColor: data.iconColor,
        status: data.status,
        role: data.role
    };
    errorsUpdate.value = {};
    updateDialog.value = true;
};

const updateService = async (data) => {
    return await axios.patch(`/features/${data.id}`, data);
};

const { mutate: updateFeature, isPending: updateFeatureLoading } = useMutation({
    mutationFn: updateService,
    mutationKey: ['updateFeature']
});

const handleSubmit = () => {
    updateFeature(
        {
            id: updateData.value.id,
            title: updateData.value.title,
            icon: updateData.value.icon.icon ?? updateData.value.icon,
            iconColor: updateData.value.iconColor.color ?? updateData.value.iconColor,
            status: updateData.value.status,
            role: updateData.value.role,
            group: selectedGroup.value.map((item) => item.value)
        },
        {
            onSuccess: () => {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Data updated successfully',
                    life: 3000
                });
                updateDialog.value = false;
                refetch();
            },
            onError: (err) => {
                errorsUpdate.value = err.response.data.errors;
            }
        }
    );
};
</script>

<template>
    <div class="grid">
        <div class="col">
            <div class="card">
                <h3>Fitur Aplikasi</h3>
                <hr />
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} features"
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
                            <span> Data fitur belum ada </span>
                        </div>
                    </template>
                    <Column field="title" header="Nama Fitur"> </Column>
                    <Column field="role" header="Tersedia Untuk"> </Column>
                    <Column field="icon" header="Icon">
                        <template #body="{ data }">
                            <i :class="`${data.icon} text-2xl ${data.iconColor ?? ''}`"></i>
                        </template>
                    </Column>
                    <Column field="status" header="Status">
                        <template #body="{ data }">
                            <Tag :severity="data.status ? 'success' : 'danger'">{{ data.status ? 'Active' : 'Inactive' }}</Tag>
                        </template>
                    </Column>
                    <Column field="route" header="Rute">
                        <template #body="{ data }">
                            <Tag severity="primary">{{ data.route }}</Tag>
                        </template>
                    </Column>
                    <Column field="group" header="Group yang diijinkan">
                        <template #body="{ data }">
                            <div v-if="data.group && isJSON(data.group) && JSON.parse(data.group).length > 0">
                                <Chip class="bg-primary text-white text-sm m-2" :label="rmbl" v-for="rmbl in JSON.parse(data.group)" :key="rmbl" />
                            </div>
                            <p v-else>-</p>
                        </template>
                    </Column>
                    <Column headerStyle="width:4rem">
                        <template #body="{ data }">
                            <div class="flex gap-2 mt-1">
                                <Button icon="pi pi-pencil" v-if="$can('features:update')" @click.prevent="handleShowDialogUpdate(data)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <Dialog v-model:visible="updateDialog" :style="{ width: '450px' }" header="Update Fitur" :modal="true" class="p-fluid">
            <div class="field">
                <div class="flex flex-wrap gap-3 border-1 py-4 px-2 border-round border-primary justify-content-center">
                    <div class="flex align-items-center">
                        <RadioButton v-model="updateData.role" inputId="siswa" name="siswa" value="SISWA" />
                        <label for="siswa" class="ml-2">Siswa</label>
                    </div>
                    <div class="flex align-items-center">
                        <RadioButton v-model="updateData.role" inputId="pegawai" name="pegawai" value="PEGAWAI" />
                        <label for="pegawai" class="ml-2">Pegawai</label>
                    </div>
                </div>
                <p class="text-red-500" v-if="errorsAddSession && errorsAddSession.role">
                    {{ errorsAddSession.role[0] }}
                </p>
            </div>
            <div class="field">
                <label for="title">Nama Fitur</label> <InputText id="title" :disabled="updateFeatureLoading" :invalid="errorsUpdate && errorsUpdate.title" required="true" autofocus v-model="updateData.title" />
                <p class="text-red-500" v-if="errorsUpdate && errorsUpdate.title">{{ errorsUpdate.title[0] }}</p>
            </div>
            <div class="field flex flex-column gap-2">
                <label for="icon"> Preview Icon </label>
                <div class="border-1 surface-border border-round py-4 px-2">
                    <i :class="`${updateData.icon.icon ?? updateData.icon} text-2xl ${updateData.iconColor.color ?? updateData.iconColor}`" />
                </div>
            </div>
            <div class="field">
                <SelectIcon v-model="updateData.icon" />
                <p class="text-red-500" v-if="errorsUpdate && errorsUpdate.icon">{{ errorsUpdate.icon[0] }}</p>
            </div>
            <div class="field">
                <SelectTextColor v-model="updateData.iconColor" />
                <p class="text-red-500" v-if="errorsUpdate && errorsUpdate.icon">{{ errorsUpdate.icon[0] }}</p>
            </div>
            <div class="field flex flex-column gap-2">
                <label for="status"> Status </label> <InputSwitch id="status" :disabled="updateFeatureLoading" :invalid="errorsUpdate && errorsUpdate.status" required="true" autofocus v-model="updateData.status" />
                <p class="text-red-500" v-if="errorsUpdate && errorsUpdate.status">{{ errorsUpdate.status[0] }}</p>
            </div>

            <div class="field" v-if="(dataGroups && dataGroups.data.data.length > 0) || (dataRombels && dataRombels.data.data.length > 0)">
                <label for="group" v-if="updateData.role === 'SISWA'">Pilih Rombel Siswa (Optional)</label>
                <label for="group" v-else-if="updateData.role === 'PEGAWAI'">Pilih Kelompok Pegawai (Optional)</label>
                <!-- siswa -->
                <MultiSelect
                    v-if="updateData.role == 'SISWA'"
                    :loading="loadingRombel"
                    filter
                    v-model="selectedGroup"
                    :options="dataRombels ? dataRombels.data.data.map((item) => ({ value: item })) : []"
                    optionLabel="value"
                    placeholder="Pilih Rombel"
                    class="w-full"
                />
                <!-- pegawai -->
                <MultiSelect
                    v-else-if="updateData.role == 'PEGAWAI'"
                    :loading="loadingGroup"
                    filter
                    v-model="selectedGroup"
                    :options="dataGroups ? dataGroups.data.data.map((item) => ({ value: item })) : []"
                    optionLabel="value"
                    placeholder="Pilih Kelompok"
                    class="w-full"
                />

                <p class="text-red-500" v-if="errorsAddSession && errorsAddSession.group">
                    {{ errorsAddSession.group[0] }}
                </p>
            </div>

            <div class="field"><Button :loading="updateFeatureLoading" :disabled="updateFeatureLoading" label="Update" @click.prevent="handleSubmit" /></div>
        </Dialog>
    </div>
</template>
