<script setup>
import { ref, getCurrentInstance } from 'vue';
import SelectSiswa from '@/components/SelectSiswa.vue';
import SelectPegawai from '@/components/SelectPegawai.vue';
import { useMutation } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
const { proxy } = getCurrentInstance();
const axios = proxy.axios;

const toast = useToast();

const form = ref({
    toAccountId: null,
    toAccountType: null,
    amount: null,
    note: null,
});

const errorForm = ref(null)


const depositService = async (data) => {
    return await axios.post('/transaction/deposit', data);
}

const { mutate: deposit, isPending } = useMutation({
    mutationKey: ['deposit'],
    mutationFn: depositService,
})

const handleSubmit = async () => {
    await deposit(form.value, {
        onSuccess: (data) => {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Deposit berhasil',
                life: 3000
            });
            form.value = {
                toAccountId: null,
                toAccountType: null,
                amount: null,
                note: null,
            }
        },
        onError: (error) => {
            if (error) {
                const status = error.response.status;

                if (status === 400) {
                    if (error.response.data.message === 'CREATE_ACCOUNT_FIRST') {
                        toast.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: "Sebelum melakukan deposit, silahkan buat akun terlebih dahulu",
                            life: 3000
                        });
                    } else {
                        errorForm.value = error.response.data
                    }
                } else if (status === 404) {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: "Akun tidak ditemukan",
                        life: 3000
                    });
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: "Terjadi kesalahan",
                        life: 3000
                    });
                }


            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Gagal deposit',
                    life: 3000
                });
            }
        }
    });
}

const handleSelectSiswa = (value) => {
    form.value.toAccountId = value.id;
    form.value.toAccountType = 'SISWA';
}

const handleSelectPegawai = (value) => {
    form.value.toAccountId = value.id;
    form.value.toAccountType = 'PEGAWAI';
}
</script>

<template>
    <div>
        <h3>Deposit</h3>
        <div class="card flex justify-content-center">
            <div class="flex flex-wrap gap-3">
                <div class="flex align-items-center">
                    <RadioButton v-model="form.toAccountType" inputId="siswa" name="accountType" value="SISWA" />
                    <label for="siswa" class="ml-2">Siswa</label>
                </div>
                <div class="flex align-items-center">
                    <RadioButton v-model="form.toAccountType" inputId="pegawai" name="accountType" value="PEGAWAI" />
                    <label for="pegawai" class="ml-2">Pegawai</label>
                </div>
                <div class="flex align-items-center">
                    <RadioButton v-model="form.toAccountType" inputId="user" name="accountType" value="USER" />
                    <label for="user" class="ml-2">Admin / Pengguna Sistem</label>
                </div>
            </div>
        </div>
        <form @submit.prevent="handleSubmit" method="post" v-if="form.toAccountType">
            <div class="field" v-if="form.toAccountType === 'SISWA'">
                <select-siswa @input="handleSelectSiswa" />
            </div>
            <div class="field" v-if="form.toAccountType === 'PEGAWAI'">
                <select-pegawai @input="handleSelectPegawai" />
            </div>
            <p v-if="errorForm && errorForm.toAccountId" class="text-red-500">{{ errorForm.toAccountId[0] }}</p>
            <div class="field">
                <InputNumber v-model="form.amount" :invalid="errorForm && errorForm.amount" class="w-full"
                    :disabled="isPending" placeholder="Jumlah Uang" :min="0" mode="currency" currency="IDR" />
                <p v-if="errorForm && errorForm.amount" class="text-red-500">{{ errorForm.amount[0] }}</p>
            </div>
            <div class="field">
                <Textarea v-model="form.note" :invalid="errorForm && errorForm.note" class="w-full"
                    :disabled="isPending" placeholder="Catatan" />
                <p v-if="errorForm && errorForm.note" class="text-red-500">{{ errorForm.note[0] }}</p>
            </div>
            <Button type="submit" :disabled="isPending" :loading="isPending" label="Deposit" />
        </form>
    </div>
</template>