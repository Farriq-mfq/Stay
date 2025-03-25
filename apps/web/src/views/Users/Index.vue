<script setup>
import { useQuery, useMutation } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, ref, watch } from 'vue';
import { useConfirm } from "primevue/useconfirm";
const toast = useToast();
const { proxy } = getCurrentInstance()
const axios = proxy.axios
const confirm = useConfirm();

// datatable server side
const expandedRows = ref({});
const filters = ref(null);
const first = ref(0);
const queryParams = ref({
  first: 0,
  rows: 10,
})
const totalRecords = ref(0);
const dt = ref()

const getAllUsers = async () => {
  const queries = {
    page: (queryParams.value.first / queryParams.value.rows) + 1,
    limit: queryParams.value.rows,
    ...filters.value && { search: filters.value }
  }

  const params = new URLSearchParams(queries)

  return await axios.get(`/users?${params}`)
}
const { data: users, isLoading, refetch } = useQuery({
  queryKey: ['users', queryParams.value],
  queryFn: getAllUsers,
  keepPreviousData: true,
})


const onPage = (event) => {
  queryParams.value = event;
  refetch()
};

watch(users, () => {
  if (users.value) {
    totalRecords.value = users.value.data.data.meta.totalCount
  }
})

const handleDebounceFilter = (val) => {
  filters.value = val;
  refetch()
}

// add user
const showDialogUser = ref(false)
const userAddData = ref({
  name: '',
  username: '',
  confirm_password: '',
  password: ''
})
const errorsAddUser = ref({})
const addUserService = async (data) => {
  return await axios.post('/users', data)
}
const {
  mutateAsync: addUser,
  isPending: addUserLoading,
} = useMutation({
  mutationKey: ['addUser'],
  mutationFn: addUserService,
})
const handleSubmitAddUser = () => {
  addUser(userAddData.value, {
    onSuccess: (res) => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'User berhasil ditambahkan',
        life: 3000
      })
      showDialogUser.value = false
      userAddData.value = {
        name: '',
        username: '',
        confirm_password: '',
        password: ''
      }
      errorsAddUser.value = {}
      refetch()
    },
    onError: (err) => {
      if (err.response.status === 400) {
        errorsAddUser.value = err.response.data
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: "user gagal ditambahkan",
          life: 3000
        })
      }
    }
  })
}


// remove user
const deleteUserService = async (id) => {
  return await axios.delete(`/users/${id}`)
}

const {
  mutateAsync: deleteUser,
  isPending: deleteUserPending,
} = useMutation({
  mutationKey: ['deleteUserService'],
  mutationFn: deleteUserService,
})

const confirmDeleteUser = (id) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Konfirmasi',
    message: 'Yakin hapus user ini ?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    rejectLabel: 'Batalkan',
    acceptLabel: 'Hapus',
    accept: () => {
      deleteUser(id, {
        onSuccess() {
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User berhasil dihapus',
            life: 3000
          })
          refetch()
        },
        onError() {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User gagal dihapus',
            life: 3000
          })
        }
      })
    },
  });
};

// update user
const showDialogUpdateUser = ref(false)
const updateUserData = ref({
  id: '',
  name: '',
  username: '',
})

const errorsUpdateUser = ref({})

const handleShowDialogUpdateUser = (data) => {
  updateUserData.value = {
    id: data.id,
    name: data.name,
    username: data.username
  }
  showDialogUpdateUser.value = true
}
const updateUserService = (data) => {
  return axios.patch(`/users/${data.id}`, data)
}
const {
  mutateAsync: updateUser,
  isPending: updateUserLoading,
} = useMutation({
  mutationKey: ['updateUser'],
  mutationFn: updateUserService,
})

const handleUpdateUser = () => {
  updateUser(updateUserData.value, {
    onSuccess: () => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'User berhasil diupdate',
        life: 3000
      })
      showDialogUpdateUser.value = false
      updateUserData.value = {
        id: '',
        name: '',
        username: '',
      }
      refetch()
    },
    onError: (err) => {
      if (err.response.status === 400) {
        errorsUpdateUser.value = err.response.data
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: "user gagal diupdate",
          life: 3000
        })
      }
    }
  })
}
const clearUpdateUser = () => {
  updateUserData.value = {
    id: '',
    name: '',
    username: '',
  }
  errorsUpdateUser.value = {}
}

//  update user password
const showDialogUpdateUserPassword = ref(false)
const updateUserPasswordData = ref({
  id: '',
  password: '',
  confirmation_password: ''
})
const errorsUpdateUserPassword = ref({})
const handleShowDialogUpdateUserPassword = (data) => {
  showDialogUpdateUserPassword.value = true
  updateUserPasswordData.value = {
    id: data.id,
    password: '',
    confirmation_password: ''
  }
}

const updateUserPasswordService = (data) => {
  return axios.patch(`/users/password/${data.id}`, data)
}

const {
  mutateAsync: updateUserPassword,
  isPending: updateUserPasswordLoading,
} = useMutation({
  mutationKey: ['updateUserPasswordService'],
  mutationFn: updateUserPasswordService,
})

const handleUpdateUserPassword = () => {
  updateUserPassword(updateUserPasswordData.value, {
    onSuccess: () => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Password berhasil diupdate',
        life: 3000
      })
      showDialogUpdateUserPassword.value = false
      updateUserPasswordData.value = {
        id: '',
        password: '',
        confirmation_password: ''
      }
      refetch()
    },
    onError: (err) => {
      if (err.response.status === 400) {
        errorsUpdateUserPassword.value = err.response.data
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: "Password gagal diupdate",
          life: 3000
        })
      }
    }
  })
}

const clearUpdateUserPassword = () => {
  updateUserPasswordData.value = {
    id: '',
    password: '',
    confirmation_password: ''
  }
  errorsUpdateUserPassword.value = {}
}


</script>
<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h3>Pengguna Sistem</h3>
        <hr>
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button label="Tambah" icon="pi pi-plus" class="mr-2" @click.prevent="showDialogUser = true" />
            </div>
          </template>
        </Toolbar>
        <DataTable ref="dt" :totalRecords="totalRecords" v-model:expandedRows="expandedRows" :loading="isLoading"
          :value="isLoading ? [] : users.data.data.items" dataKey="id" paginator :rows="10" :filters="filters" lazy
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[10, 25, 50]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users" :first="first"
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
                Data users masih kosong
              </span>
            </div>
          </template>
          <Column field="name" header="Nama">
          </Column>
          <Column field="username" header="Username">
          </Column>

          <Column headerStyle="width:4rem">
            <template #body="{ data }">
              <div class="flex gap-2 mt-1">
                <Button icon="pi pi-pencil" @click.prevent="handleShowDialogUpdateUser(data)" />
                <Button :loading="deleteUserPending" :disabled="deleteUserPending" severity="danger"
                  @click.prevent="confirmDeleteUser(data.id)" icon="pi pi-trash" />
                <Button :loading="updateUserPasswordLoading" :disabled="updateUserPasswordLoading" outlined
                  severity="warning" @click.prevent="handleShowDialogUpdateUserPassword(data)" icon="pi pi-key" />
              </div>
            </template>
          </Column>
        </DataTable>
        <!-- created -->
        <Dialog v-model:visible="showDialogUser" :style="{ width: '450px' }" header="Tambah User Baru" :modal="true"
          class="p-fluid">
          <div class="field">
            <label for="name">Nama</label>
            <InputText id="name" :disabled="addUserLoading" :invalid="errorsAddUser && errorsAddUser.name"
              required="true" autofocus v-model="userAddData.name" />
            <p class="text-red-500" v-if="errorsAddUser && errorsAddUser.name">
              {{ errorsAddUser.name[0] }}
            </p>
          </div>
          <div class="field">
            <label for="username">Username</label>
            <InputText id="username" :disabled="addUserLoading" :invalid="errorsAddUser && errorsAddUser.username"
              required="true" autofocus v-model="userAddData.username" />
            <p class="text-red-500" v-if="errorsAddUser && errorsAddUser.username">
              {{ errorsAddUser.username[0] }}
            </p>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <InputText id="password" :disabled="addUserLoading" :invalid="errorsAddUser && errorsAddUser.password"
              required="true" autofocus v-model="userAddData.password" />
            <p class="text-red-500" v-if="errorsAddUser && errorsAddUser.password">
              {{ errorsAddUser.password[0] }}
            </p>
          </div>
          <div class="field">
            <label for="confirmation_password">Konfirmasi Password</label>
            <InputText id="confirmation_password" :disabled="addUserLoading"
              :invalid="errorsAddUser && errorsAddUser.confirmation_password" required="true" autofocus
              v-model="userAddData.confirmation_password" />
            <p class="text-red-500" v-if="errorsAddUser && errorsAddUser.confirmation_password">
              {{ errorsAddUser.confirmation_password[0] }}
            </p>
          </div>

          <div class="field">
            <select>
              <option value="">--Pilih Role--</option>
            </select>
          </div>
          <template #footer>
            <Button label="Batal" :disabled="addUserLoading" severity="danger" icon="pi pi-times" outlined
              @click.prevent="showDialogUser = false" />
            <Button label="Simpan" :loading="addUserLoading" :disabled="addUserLoading" icon="pi pi-link"
              @click="handleSubmitAddUser" />
          </template>
        </Dialog>
        <!-- update -->
        <Dialog v-model:visible="showDialogUpdateUser" @after-hide="clearUpdateUser" :style="{ width: '450px' }"
          header="Update User" :modal="true" class="p-fluid">
          <div class="field">
            <label for="name">Nama</label>
            <InputText id="name" :disabled="updateUserLoading" :invalid="errorsUpdateUser && errorsUpdateUser.name"
              required="true" autofocus v-model="updateUserData.name" />
            <p class="text-red-500" v-if="errorsUpdateUser && errorsUpdateUser.name">
              {{ errorsUpdateUser.name[0] }}
            </p>
          </div>
          <div class="field">
            <label for="username">Username</label>
            <InputText id="username" :disabled="updateUserLoading"
              :invalid="errorsUpdateUser && errorsUpdateUser.username" required="true" autofocus
              v-model="updateUserData.username" />
            <p class="text-red-500" v-if="errorsUpdateUser && errorsUpdateUser.username">
              {{ errorsUpdateUser.username[0] }}
            </p>
          </div>

          <template #footer>
            <Button label="Batal" :disabled="updateUserLoading" severity="danger" icon="pi pi-times" outlined
              @click.prevent="showDialogUpdateUser = false" />
            <Button label="Update" :loading="updateUserLoading" :disabled="updateUserLoading" icon="pi pi-link"
              @click="handleUpdateUser" />
          </template>
        </Dialog>
        <!-- update password -->
        <Dialog v-model:visible="showDialogUpdateUserPassword" @after-hide="clearUpdateUserPassword"
          :style="{ width: '450px' }" header="Update User Password" :modal="true" class="p-fluid">
          <div class="field">
            <label for="password">Password Baru</label>
            <InputText id="password" :disabled="updateUserPasswordLoading"
              :invalid="errorsUpdateUserPassword && errorsUpdateUserPassword.password" required="true" autofocus
              v-model="updateUserPasswordData.password" />
            <p class="text-red-500" v-if="errorsUpdateUserPassword && errorsUpdateUserPassword.password">
              {{ errorsUpdateUserPassword.password[0] }}
            </p>
          </div>
          <div class="field">
            <label for="confirmation_password">Konfirmasi Password</label>
            <InputText id="confirmation_password" :disabled="updateUserPasswordLoading"
              :invalid="errorsUpdateUserPassword && errorsUpdateUserPassword.confirmation_password" required="true"
              autofocus v-model="updateUserPasswordData.confirmation_password" />
            <p class="text-red-500" v-if="errorsUpdateUserPassword && errorsUpdateUserPassword.confirmation_password">
              {{ errorsUpdateUserPassword.confirmation_password[0] }}
            </p>
          </div>

          <template #footer>
            <Button label="Batal" :disabled="updateUserPasswordLoading" severity="danger" icon="pi pi-times" outlined
              @click.prevent="showDialogUpdateUserPassword = false" />
            <Button label="Update" :loading="updateUserPasswordLoading" :disabled="updateUserPasswordLoading"
              icon="pi pi-link" @click="handleUpdateUserPassword" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>
