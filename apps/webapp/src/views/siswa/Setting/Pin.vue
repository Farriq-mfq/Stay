<script setup>
import { computed, inject, ref, getCurrentInstance, onMounted } from 'vue';
import CreateAccount from '../dashboard/components/CreateAccount.vue';
import { useMutation } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';

const auth = inject("auth")
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const account = computed(() => auth.user().account)
const toast = useToast();

const pinForm = ref({
    pin: '',
    pin_confirmation: '',
    password: ''
});

const errors = ref({});

const registerPinService = async (data) => {
    const response = await axios.post('siswa/modules/account/register-pin', data);
    return response.data;
};

const { mutate: registerPin, isPending: isRegisteringPin } = useMutation({
    mutationKey: ['registerPin'],
    mutationFn: registerPinService,
});

onMounted(() => {
    auth.fetch()
})

const handleRegisterPin = async () => {
    errors.value = {};
    await registerPin(pinForm.value, {
        onSuccess: () => {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'PIN berhasil diubah',
                life: 3000
            });
            auth.fetch()
            pinForm.value = {
                pin: '',
                pin_confirmation: ''
            }
            errors.value = {};
        },
        onError: (error) => {
            if (error.response.status === 400) {
                errors.value = error.response.data;
                if (error.response.data.message) {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.response.data.message,
                        life: 3000
                    });
                }
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Gagal mendaftarkan PIN',
                    life: 3000
                });
            }
        }
    });
};
</script>
<template>
    <div>
        <AppHeaderBack title="Pin" />
        <div class="mt-8 surface-ground border-round-xl border-1 surface-border p-3 mx-3 pt-3">
            <CreateAccount v-if="!account" />
            <div v-else>
                <h3 class="text-lg m-0 text-color mb-4">Daftarkan atau Ubah PIN</h3>
                <div v-if="account.pin" class="flex flex-column gap-2 mb-4">
                    <span class="text-sm text-500">Status Pin</span>
                    <Badge severity="success" class="w-fit">Aktif</Badge>
                </div>
                <div v-else>
                    <div class="flex flex-column gap-2 mb-4">
                        <span class="text-sm text-500">Status Pin</span>
                        <Badge severity="danger" class="w-fit">Belum Aktif</Badge>
                    </div>
                </div>
                <form @submit.prevent="handleRegisterPin" class="flex flex-column gap-4">
                    <div class="flex flex-column gap-2">
                        <label for="pin" class="text-sm text-500">PIN Baru</label>
                        <InputOtp type="number" id="pin" v-model="pinForm.pin" class="w-full" :invalid="errors.pin"
                            :length="6" integerOnly :disabled="isRegisteringPin || pinForm.pin.length >= 6" />
                        <p class="text-sm text-red-500" v-if="errors.pin">{{ errors.pin[0] }}</p>
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="pin_confirmation" class="text-sm text-500">Konfirmasi PIN</label>
                        <InputOtp type="number" id="pin_confirmation" v-model="pinForm.pin_confirmation" class="w-full"
                            :invalid="errors.pin_confirmation" :length="6" integerOnly
                            :disabled="isRegisteringPin || pinForm.pin_confirmation.length >= 6" />
                        <p class="text-sm text-red-500" v-if="errors.pin_confirmation">{{ errors.pin_confirmation[0]
                            }}</p>
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="password" class="text-sm text-500">Password</label>
                        <Password id="password" :disabled="isRegisteringPin" v-model="pinForm.password" :toggleMask="true" :feedback="false"
                            class="w-full" :invalid="errors.password" />
                        <p class="text-sm text-red-500" v-if="errors.password">{{ errors.password[0] }}</p>
                    </div>
                    <Button type="submit" :loading="isRegisteringPin" :label="account && account.pin ? 'Ubah PIN' : 'Daftarkan PIN'"
                        class="w-full" />
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-password) {
    width: 100%;
}
</style>
