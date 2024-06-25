<script setup>
import { inject, ref, getCurrentInstance } from "vue"
import { useMutation } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast';
const auth = inject('auth')
const { proxy } = getCurrentInstance()
const axios = proxy.axios
const toast = useToast()
const changePasswordData = ref({
    old_password: "",
    new_password: "",
    confirmation_password: ""
})

const errorsChangePassword = ref({})
const changePasswordService = async (data) => {
    return await axios.patch(`/auth/change-password`, data)
}
const {
    mutateAsync: changePassword,
    isPending: changePasswordPending
} = useMutation({
    mutationKey: ['changePasswordService'],
    mutationFn: changePasswordService,
})
const handleSubmit = () => {
    changePassword(changePasswordData.value, {
        onSuccess: () => {
            toast.add({
                severity: 'success',
                summary: 'Berhasil',
                detail: "Password berhasil diubah",
                life: 3000
            })
            changePasswordData.value = {
                old_password: "",
                new_password: "",
                confirmation_password: ""
            }
            auth.logout({
                redirect: { name: 'login' },
            })
        },
        onError: (error) => {
            if (error.response.status === 400) {
                errorsChangePassword.value = error.response.data
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: "Terjadi kesalahan",
                    life: 3000
                })
            }
        }
    })
}

</script>
<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <form @submit.prevent="handleSubmit">
                    <div class="field">
                        <label for="old_password">Password Lama</label>
                        <InputText id="old_password" class="w-full" :disabled="addSiswaPending"
                            :invalid="errorsChangePassword && errorsChangePassword.old_password" autofocus
                            v-model="changePasswordData.old_password" />
                        <p class="text-red-500" v-if="errorsChangePassword && errorsChangePassword.old_password">
                            {{ errorsChangePassword.old_password[0] }}
                        </p>
                    </div>
                    <div class="field">
                        <label for="new_password">Password Baru</label>
                        <InputText id="new_password" class="w-full" :disabled="addSiswaPending"
                            :invalid="errorsChangePassword && errorsChangePassword.new_password"
                            v-model="changePasswordData.new_password" />
                        <p class="text-red-500" v-if="errorsChangePassword && errorsChangePassword.new_password">
                            {{ errorsChangePassword.new_password[0] }}
                        </p>
                    </div>
                    <div class="field">
                        <label for="confirmation_password">Konfirmasi Password Baru</label>
                        <InputText id="confirmation_password" class="w-full" :disabled="addSiswaPending"
                            :invalid="errorsChangePassword && errorsChangePassword.confirmation_password"
                            v-model="changePasswordData.confirmation_password" />
                        <p class="text-red-500"
                            v-if="errorsChangePassword && errorsChangePassword.confirmation_password">
                            {{ errorsChangePassword.confirmation_password[0] }}
                        </p>
                    </div>
                    <div class="field">
                        <Button type="submit" label="Ubah Password" icon="pi pi-key" :loading="changePasswordPending"
                            :disabled="changePasswordPending" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>