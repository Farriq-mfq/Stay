<script setup>
import { useQuery, useMutation } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, ref, watch } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
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

const getAllroles = async () => {
    const queries = {
        page: queryParams.value.first / queryParams.value.rows + 1,
        limit: queryParams.value.rows,
        ...(filters.value && { search: filters.value })
    };

    const params = new URLSearchParams(queries);

    return await axios.get(`/roles?${params}`);
};
const {
    data: roles,
    isLoading,
    refetch
} = useQuery({
    queryKey: ['roles', queryParams.value],
    queryFn: getAllroles,
    keepPreviousData: true
});

const onPage = (event) => {
    queryParams.value = event;
    refetch();
};

watch(roles, () => {
    if (roles.value) {
        totalRecords.value = roles.value.data.data.meta.totalCount;
    }
});

const handleDebounceFilter = (val) => {
    filters.value = val;
    refetch();
};

// add roles
const showDialogRoles = ref(false);
const rolesAddData = ref({
    name: '',
    permissions: []
});
const errorsAddRoles = ref({});
const addRolesService = async (data) => {
    return await axios.post('/roles', data);
};
const { mutateAsync: addRoles, isPending: addRolesLoading } = useMutation({
    mutationKey: ['addRoles'],
    mutationFn: addRolesService
});
const handleSubmitaddRoles = () => {
    addRoles(rolesAddData.value, {
        onSuccess: (res) => {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User berhasil ditambahkan',
                life: 3000
            });
            showDialogRoles.value = false;
            rolesAddData.value = {
                name: '',
                permissions: []
            };
            errorsAddRoles.value = {};
            refetch();
        },
        onError: (err) => {
            if (err.response.status === 400) {
                errorsAddRoles.value = err.response.data;
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'user gagal ditambahkan',
                    life: 3000
                });
            }
        }
    });
};

// remove user
const deleteroleservice = async (id) => {
    return await axios.delete(`/roles/${id}`);
};

const { mutateAsync: deleteRoles, isPending: deleteRolesPending } = useMutation({
    mutationKey: ['deleteroleservice'],
    mutationFn: deleteroleservice
});

const confirmdeleteRoles = (id) => {
    confirm.require({
        target: event.currentTarget,
        header: 'Konfirmasi',
        message: 'Yakin hapus hak akses ini ?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-sm p-button-danger',
        rejectLabel: 'Batalkan',
        acceptLabel: 'Hapus',
        accept: () => {
            deleteRoles(id, {
                onSuccess() {
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Hak Akses berhasil dihapus',
                        life: 3000
                    });
                    refetch();
                },
                onError() {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Hak Akses gagal dihapus atau mungkin hak akses sedang digunakan',
                        life: 3000
                    });
                }
            });
        }
    });
};

// update user
const showDialogUpdateRoles = ref(false);
const updateRolesData = ref({
    id: '',
    name: '',
    permissions: []
});

const errorsUpdateRoles = ref({});

const handleshowDialogUpdateRoles = (data) => {
    updateRolesData.value = {
        id: data.id,
        name: data.name,
        permissions: data.permissions.map((pr) => pr.permission.id)
    };

    showDialogUpdateRoles.value = true;
};
const updateroleservice = (data) => {
    return axios.patch(`/roles/${data.id}`, data);
};
const { mutateAsync: updateUser, isPending: updateRolesLoading } = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: updateroleservice
});

const handleUpdateUser = () => {
    updateUser(updateRolesData.value, {
        onSuccess: () => {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Hak akses berhasil diupdate',
                life: 3000
            });
            showDialogUpdateRoles.value = false;
            updateRolesData.value = {
                id: '',
                name: '',
                permissions: []
            };
            refetch();
        },
        onError: (err) => {
            if (err.response.status === 400) {
                errorsUpdateRoles.value = err.response.data;
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'user gagal diupdate',
                    life: 3000
                });
            }
        }
    });
};
const clearUpdateRoles = () => {
    updateRolesData.value = {
        id: '',
        name: '',
        permissions: []
    };
    errorsUpdateRoles.value = {};
};

const getPermissionService = async () => {
    return await axios.get('/permissions');
};

const { data: permissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissionService
});
</script>
<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h3>Hak Akses</h3>
                <hr />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Tambah" v-if="$can('roles:create')" icon="pi pi-plus" class="mr-2" @click.prevent="showDialogRoles = true" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    :totalRecords="totalRecords"
                    v-model:expandedRows="expandedRows"
                    :loading="isLoading"
                    :value="isLoading ? [] : roles.data.data.items"
                    dataKey="id"
                    paginator
                    :rows="10"
                    :filters="filters"
                    lazy
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[10, 25, 50]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} roles"
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
                            <span> Data roles masih kosong </span>
                        </div>
                    </template>
                    <Column field="name" header="Nama">
                        <template #body="{ data }">
                            {{ data.name }}
                        </template>
                    </Column>
                    <Column field="permissions" header="Akses">
                        <template #body="{ data }">
                            <div v-if="data.permissions.length > 0">
                                <Accordion>
                                    <AccordionTab :header="`Akses yang diberikan (${data.permissions.length})`">
                                        <Fieldset
                                            class="mb-5"
                                            v-for="group in data.permissions
                                                .map((pr) => pr.permission.name.split(':')[0])
                                                .filter(function (item, pos) {
                                                    return data.permissions.map((pr) => pr.permission.name.split(':')[0]).indexOf(item) == pos;
                                                })"
                                            :key="group"
                                            :legend="group"
                                        >
                                            <div class="flex align-items-center gap-4 flex-wrap">
                                                <Badge v-for="permission in data.permissions.filter((pr) => pr.permission.name.split(':')[0] === group)" :key="permission.id">{{ permission.permission.name.split(':')[1].toUpperCase() }}</Badge>
                                            </div>
                                        </Fieldset>
                                    </AccordionTab>
                                </Accordion>
                            </div>
                            <div v-else>
                                <Badge>Belum ada akses</Badge>
                            </div>
                        </template>
                    </Column>

                    <Column headerStyle="width:4rem">
                        <template #body="{ data }">
                            <div class="flex gap-2 mt-1">
                                <Button icon="pi pi-pencil" v-if="$can('roles:update')" @click.prevent="handleshowDialogUpdateRoles(data)" />
                                <Button :loading="deleteRolesPending" v-if="$can('roles:delete')" :disabled="deleteRolesPending" severity="danger" @click.prevent="confirmdeleteRoles(data.id)" icon="pi pi-trash" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
                <!-- created -->
                <Dialog v-model:visible="showDialogRoles" :style="{ width: '450px' }" header="Tambah Hak Akses Baru" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Nama</label>
                        <InputText id="name" :disabled="addRolesLoading" :invalid="errorsAddRoles && errorsAddRoles.name" required="true" autofocus v-model="rolesAddData.name" />
                        <p class="text-red-500" v-if="errorsAddRoles && errorsAddRoles.name">
                            {{ errorsAddRoles.name[0] }}
                        </p>
                    </div>
                    <div class="field" v-if="!permissionsLoading">
                        <Fieldset
                            class="mb-5"
                            v-for="group in permissions.data.data
                                .map((pr) => pr.name.split(':')[0])
                                .filter(function (item, pos) {
                                    return permissions.data.data.map((pr) => pr.name.split(':')[0]).indexOf(item) == pos;
                                })"
                            :key="group"
                            :legend="group"
                        >
                            <div class="flex flex-wrap gap-5">
                                <div class="flex align-items-center" v-for="permission in permissions.data.data.filter((pr) => pr.name.split(':')[0] === group)" :key="permission.id">
                                    <Checkbox :disabled="addRolesLoading" v-model="rolesAddData.permissions" :name="permission.name" :value="permission.id" :inputId="permission.id" />
                                    <label :for="permission.id" class="ml-2"> {{ permission.name.split(':')[1].toUpperCase() }} </label>
                                </div>
                            </div>
                        </Fieldset>
                    </div>
                    <template #footer>
                        <Button label="Batal" :disabled="addRolesLoading" severity="danger" icon="pi pi-times" outlined @click.prevent="showDialogRoles = false" />
                        <Button label="Simpan" :loading="addRolesLoading" :disabled="addRolesLoading" icon="pi pi-link" @click="handleSubmitaddRoles" />
                    </template>
                </Dialog>
                <!-- update -->
                <Dialog v-model:visible="showDialogUpdateRoles" @after-hide="clearUpdateRoles" :style="{ width: '450px' }" header="Update Hak Akses" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Nama</label>
                        <InputText id="name" :disabled="updateRolesLoading" :invalid="errorsUpdateRoles && errorsUpdateRoles.name" required="true" autofocus v-model="updateRolesData.name" />
                        <p class="text-red-500" v-if="errorsUpdateRoles && errorsUpdateRoles.name">
                            {{ errorsUpdateRoles.name[0] }}
                        </p>
                    </div>
                    <div class="field" v-if="!permissionsLoading">
                        <Fieldset
                            class="mb-5"
                            v-for="group in permissions.data.data
                                .map((pr) => pr.name.split(':')[0])
                                .filter(function (item, pos) {
                                    return permissions.data.data.map((pr) => pr.name.split(':')[0]).indexOf(item) == pos;
                                })"
                            :key="group"
                            :legend="group"
                        >
                            <div class="flex flex-wrap gap-5">
                                <div class="flex align-items-center" v-for="permission in permissions.data.data.filter((pr) => pr.name.split(':')[0] === group)" :key="permission.id">
                                    <Checkbox :disabled="addRolesLoading" v-model="updateRolesData.permissions" :name="permission.name" :value="permission.id" :inputId="permission.id" checked />
                                    <label :for="permission.id" class="ml-2"> {{ permission.name.split(':')[1].toUpperCase() }} </label>
                                </div>
                            </div>
                        </Fieldset>
                    </div>
                    <template #footer>
                        <Button label="Batal" :disabled="updateRolesLoading" severity="danger" icon="pi pi-times" outlined @click.prevent="showDialogUpdateRoles = false" />
                        <Button label="Update" :loading="updateRolesLoading" :disabled="updateRolesLoading" icon="pi pi-link" @click="handleUpdateUser" />
                    </template>
                </Dialog>
                <!-- update password -->
                <Dialog v-model:visible="showDialogUpdateRolesPassword" @after-hide="clearUpdateRolesPassword" :style="{ width: '450px' }" header="Update User Password" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="password">Password Baru</label>
                        <InputText id="password" :disabled="updateUserPasswordLoading" :invalid="errorsUpdateRolesPassword && errorsUpdateRolesPassword.password" required="true" autofocus v-model="updateUserPasswordData.password" />
                        <p class="text-red-500" v-if="errorsUpdateRolesPassword && errorsUpdateRolesPassword.password">
                            {{ errorsUpdateRolesPassword.password[0] }}
                        </p>
                    </div>
                    <div class="field">
                        <label for="confirmation_password">Konfirmasi Password</label>
                        <InputText
                            id="confirmation_password"
                            :disabled="updateUserPasswordLoading"
                            :invalid="errorsUpdateRolesPassword && errorsUpdateRolesPassword.confirmation_password"
                            required="true"
                            autofocus
                            v-model="updateUserPasswordData.confirmation_password"
                        />
                        <p class="text-red-500" v-if="errorsUpdateRolesPassword && errorsUpdateRolesPassword.confirmation_password">
                            {{ errorsUpdateRolesPassword.confirmation_password[0] }}
                        </p>
                    </div>

                    <template #footer>
                        <Button label="Batal" :disabled="updateUserPasswordLoading" severity="danger" icon="pi pi-times" outlined @click.prevent="showDialogUpdateRolesPassword = false" />
                        <Button label="Update" :loading="updateUserPasswordLoading" :disabled="updateUserPasswordLoading" icon="pi pi-link" @click="handleUpdateUserPassword" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
