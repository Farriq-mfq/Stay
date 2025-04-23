<script setup>
import { ref, getCurrentInstance } from 'vue';
import { useMutation } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { rupiahFormat } from '@/helpers/money';
const { proxy } = getCurrentInstance();
const axios = proxy.axios
const showCamera = ref(false);
const transactionCode = ref('');
const toast = useToast()

const getWithdrawRequestService = async (code) => {
    // For testing, return dummy data
    if (code === 'test') {
        return { data: dummyTransaction }
    }
    return await axios.get('/transaction/withdraw', {
        params: {
            transaction_code: code
        }
    })
}

const { mutate: withdrawRequest, isPending: isLoadingWithdrawRequest, error: errorWithdrawRequest } = useMutation({
    mutationFn: getWithdrawRequestService,
    mutationKey: ['withdrawRequest', transactionCode.value],
})

const errorSearchTransaction = ref(null)
const errorValidate = ref(null)
const dataWithdrawRequest = ref(null)

const handleSearchWithdrawRequest = async () => {
    errorSearchTransaction.value = null
    errorValidate.value = null
    await withdrawRequest(transactionCode.value, {
        onSuccess: (data) => {
            dataWithdrawRequest.value = data
        },
        onError: (error) => {
            const response = error.response
            if (response.status === 404) {
                errorSearchTransaction.value = response.data.message
            } else if (response.status === 400) {
                errorValidate.value = response.data
                if (response.data.message) {
                    if (response.data.message === "CREATE_ACCOUNT_FIRST") {
                        errorSearchTransaction.value = "Silahkan buat akun terlebih dahulu"
                    } else {
                        errorSearchTransaction.value = response.data.message
                    }
                }
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: "Terjadi kesalahan, silahkan coba lagi", life: 3000 })
            }
        }
    })
}

const withdrawService = async (code) => {
    return await axios.post('/transaction/withdraw', {
        transaction_code: code
    })
}

const { mutate: withdraw, isPending: isLoadingWithdraw, error: errorWithdraw } = useMutation({
    mutationFn: withdrawService,
    mutationKey: ['withdraw', transactionCode.value],
})

const handleWithdraw = async () => {
    await withdraw(dataWithdrawRequest.value.data.data.code, {
        onSuccess: () => {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Penarikan berhasil', life: 3000 })
            dataWithdrawRequest.value = null
        },
        onError: (error) => {
            const response = error.response
            if (response.status === 404) {
                errorSearchTransaction.value = response.data.message
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: "Terjadi kesalahan, silahkan coba lagi", life: 3000 })
            }
        }
    })
}

const copyCode = () => {
    if (dataWithdrawRequest.value?.data?.data?.code) {
        navigator.clipboard.writeText(dataWithdrawRequest.value.data.data.code)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Kode transaksi berhasil disalin', life: 3000 })
    }
}
</script>

<template>
    <div>
        <Card>
            <template #title>
                <div class="flex align-items-center gap-2">
                    <i class="pi pi-money-bill text-xl"></i>
                    <span>Withdraw</span>
                </div>
            </template>
            <template #content>
                <div class="flex flex-column gap-3">
                    <div v-if="dataWithdrawRequest && dataWithdrawRequest.data" class="flex flex-column gap-3">
                        <div class="surface-ground p-3 border-round">
                            <div class="flex flex-column gap-3">
                                <div class="flex align-items-center justify-content-between">
                                    <div class="flex align-items-center gap-2">
                                        <i class="pi pi-user text-primary"></i>
                                        <span class="font-semibold">Informasi Penarikan</span>
                                    </div>
                                    <Tag :value="dataWithdrawRequest.data.data.status"
                                        :severity="dataWithdrawRequest.data.data.status === 'SUCCESS' ? 'success' :
                                            dataWithdrawRequest.data.data.status === 'PENDING' ? 'warning' : 'danger'" />
                                </div>
                                <Divider />
                                <div class="flex flex-column gap-3">
                                    <div class="flex justify-content-between">
                                        <span class="text-color-secondary">Nama Pengguna</span>
                                        <span class="font-medium">{{ dataWithdrawRequest.data.data.from.name }}</span>
                                    </div>
                                    <div class="flex justify-content-between">
                                        <span class="text-color-secondary">Nomor Rekening</span>
                                        <span class="font-medium">{{ dataWithdrawRequest.data.data.from.accountNumber
                                            }}</span>
                                    </div>
                                    <div class="flex justify-content-between">
                                        <span class="text-color-secondary">Tanggal Transaksi</span>
                                        <span class="font-medium">{{ format(new
                                            Date(dataWithdrawRequest.data.data.createdAt), 'dd MMMM yyyy HH:mm', {
                                            locale: id
                                        }) }}</span>
                                    </div>
                                </div>
                                <Divider />
                                <div class="flex justify-content-between align-items-center">
                                    <span class="text-xl font-semibold">Total Penarikan</span>
                                    <span class="text-2xl font-bold text-primary">{{
                                        rupiahFormat(dataWithdrawRequest.data.data.amount) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="surface-ground p-3 border-round">
                            <div class="flex flex-column gap-2">
                                <div class="flex align-items-center gap-2">
                                    <i class="pi pi-id-card text-primary"></i>
                                    <span class="font-semibold">Kode Transaksi</span>
                                </div>
                                <Divider />
                                <div class="flex justify-content-between align-items-center">
                                    <span class="text-sm font-medium">{{ dataWithdrawRequest.data.data.code }}</span>
                                    <Button icon="pi pi-copy" class="p-button-text" @click="copyCode" />
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-content-end">
                            <div class="flex align-items-center gap-2">
                                <Button label="Batal" icon="pi pi-times" severity="danger"
                                    @click="dataWithdrawRequest = null" />
                                <Button label="Tarik Saldo" icon="pi pi-money-bill"
                                    :disabled="dataWithdrawRequest.data.data.status !== 'PENDING'"
                                    @click="handleWithdraw" />
                            </div>
                        </div>
                    </div>
                    <form @submit.prevent="handleSearchWithdrawRequest" v-else class="surface-ground p-3 border-round">
                        <div class="flex flex-column gap-3">
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-search text-primary"></i>
                                <span class="font-semibold">Cari Transaksi</span>
                            </div>
                            <Divider />
                            <div class="field">
                                <InputText autocomplete="off" autofocus
                                    :invalid="errorSearchTransaction || errorValidate && errorValidate.transaction_code"
                                    id="transactionCode" placeholder="Ketik Kode Transaksi" class="w-full flex-1"
                                    v-model="transactionCode" :disabled="isLoadingWithdrawRequest" />
                                <p class="text-red-500" v-if="errorValidate && errorValidate.transaction_code">{{
                                    errorValidate.transaction_code[0] }}
                                </p>
                                <p v-if="errorSearchTransaction" class="text-red-500">{{ errorSearchTransaction }}</p>
                            </div>
                            <div class="field">
                                <Button label="Cari" icon="pi pi-search" class="w-fit" type="submit"
                                    :loading="isLoadingWithdrawRequest" />
                            </div>
                            <!-- <Divider align="center">
                                <span class="text-color-secondary">ATAU</span>
                            </Divider>
                            <Button label="Scan QR Code" @click="showCamera = true" icon="pi pi-qrcode" class="w-fit" /> -->
                        </div>
                    </form>
                </div>
                <!-- qrcode camera -->
                <div class="w-full h-30rem border-round-md border-2 border-dashed border-gray-300 mt-3"
                    v-if="showCamera">

                </div>

            </template>
        </Card>
    </div>
</template>