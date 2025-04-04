<script setup>
import { useMutation } from '@tanstack/vue-query';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { ref, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const toast = useToast();
const confirm = useConfirm();

const changePasswordService = async (data) => {
    const response = await axios.post('/siswa/modules/profile/change-password', data);
    return response.data;
}

const { mutate: changePassword, isPending: changePasswordPending } = useMutation({
    mutationKey: ['changePassword'],
    mutationFn: changePasswordService,
});


const passwordForm = ref({
    old_password: '',
    new_password: '',
    confirm_password: ''
});

const errors = ref({})

const handleSubmit = async () => {
    // confirm.require({
    //     header: 'Konfirmasi',
    //     message: 'Apakah anda yakin ingin mengubah password?',
    //     icon: 'pi pi-exclamation-triangle',
    //     acceptLabel: 'Ya',
    //     rejectLabel: 'Tidak',
    //     acceptButtonStyleClass: 'p-button-danger',
    //     rejectButtonStyleClass: 'p-button-secondary',
    //     acceptButtonClass: 'p-button-danger',
    //     rejectButtonClass: 'p-button-secondary',
    //     accept: async () => {

    //     }
    // });

    await changePassword(passwordForm.value, {
        onSuccess: () => {
            toast.add({
                severity: 'success',
                summary: 'Berhasil',
                detail: 'Password berhasil diubah',
                life: 3000
            });
        },
        onError: (error) => {
            const response = error.response;

            if (response.status === 400) {
                errors.value = response.data;
            } else if (response.status === 422) {
                errors.value = {
                    old_password: [response.data.message],
                }
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: "Terjadi kesalahan, silahkan coba lagi",
                    life: 3000
                });
            }
        }
    });
};
</script>

<template>
    <div class="">
        <AppHeaderBack title="Ubah Password" />
        <div class="mt-8 px-3 pt-3">
            <div class="flex flex-column gap-4">
                <div class="flex flex-column gap-2">
                    <h3 class="text-lg m-0 text-color px-1">Ubah Password</h3>
                    <div class="p-card shadow-1 flex flex-column justify-content-center p-3 border-round-xl">
                        <form @submit.prevent="handleSubmit" class="flex flex-column gap-3">
                            <div class="flex flex-column gap-2">
                                <label for="currentPassword" class="text-sm text-500">Password Saat Ini</label>
                                <Password id="currentPassword" :invalid="errors.old_password"
                                    v-model="passwordForm.old_password" :feedback="false" toggleMask class="w-full" />
                                <p class="text-sm text-red-500" v-if="errors.old_password">{{ errors.old_password[0] }}
                                </p>
                            </div>

                            <div class="flex flex-column gap-2">
                                <label for="newPassword" class="text-sm text-500">Password Baru</label>
                                <Password id="newPassword" :invalid="errors.new_password"
                                    v-model="passwordForm.new_password" :feedback="false" toggleMask class="w-full" />
                                <p class="text-sm text-red-500" v-if="errors.new_password">{{ errors.new_password[0] }}
                                </p>
                            </div>

                            <div class="flex flex-column gap-2">
                                <label for="confirm_password" class="text-sm text-500">Konfirmasi Password Baru</label>
                                <Password id="confirm_password" :invalid="errors.confirm_password"
                                    v-model="passwordForm.confirm_password" :feedback="false" toggleMask
                                    class="w-full" />
                                <p class="text-sm text-red-500" v-if="errors.confirm_password">{{
                                    errors.confirm_password[0] }}</p>
                            </div>
                            <Button type="submit" label="Ubah Password" :loading="changePasswordPending"
                                class="w-full" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-password) {
    width: 100%;
}
</style>