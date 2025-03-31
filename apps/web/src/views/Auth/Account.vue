<script setup>
import { ref, inject, getCurrentInstance } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useMutation } from '@tanstack/vue-query';
import { rupiahFormat } from '@/helpers/money';
import { config } from '@/config';

const { proxy } = getCurrentInstance()
const axios = proxy.axios
const toast = useToast()


const auth = inject('auth')

const createAccountService = async () => {
    return await axios.post('/transaction/create-account')
}


const { mutate: createAccount, isPending } = useMutation({
    mutationKey: ['createAccount'],
    mutationFn: createAccountService
})

const handleCreateAccount = async () => {
    await createAccount(null, {
        onSuccess: () => {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Akun berhasil dibuat',
            })
            window.location.reload()
        },
        onError: (error) => {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Gagal membuat akun',
            })
        }
    })
}

</script>

<template>
    <div>
        <p v-if="auth.user().account == null">Dengan mengklik tombol dibawah, anda akan membuat nomer rekening secara
            otomatis.</p>
        <Button label="Buat Akun Sekarang" @click="handleCreateAccount" :loading="isPending"
            v-if="auth.user().account == null" />

        <div v-else>
            <Card class="account-card mt-3 shadow-none border-1 surface-border">
                <template #content>
                    <div class="surface-ground p-4 border-round-xl">
                        <div class="account-header mb-4">
                            <span class="bank-name text-xs font-bold text-white">
                                {{ config.app_name }}
                            </span>
                            <i class="pi pi-credit-card text-2xl text-white"></i>
                        </div>
                        
                        <div class="account-number-section mb-5">
                            <div class="text-xs mb-2 text-white-alpha-70">Nomor Rekening</div>
                            <div class="text-xl font-medium tracking-widest text-white">
                                {{ auth.user().account.accountNumber.match(/.{1,4}/g).join(' ') }}
                            </div>
                        </div>

                        <div class="flex justify-content-between align-items-end">
                            <div>
                                <div class="text-xs mb-1 text-white-alpha-70">Pemilik Rekening</div>
                                <div class="text-lg font-medium text-white">{{ auth.user().account.name }}</div>
                            </div>
                            <div class="text-right">
                                <div class="text-xs mb-1 text-white-alpha-70">Saldo</div>
                                <div class="text-2xl font-bold text-white">
                                    {{ rupiahFormat(auth.user().account.balance) }}
                                </div>
                            </div>
                        </div>

                        <div class="card-pattern"></div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<style scoped>
.account-card {
    max-width: 100%;
}

.account-card :deep(.p-card-content) {
    padding: 0;
}

.surface-ground {
    background: linear-gradient(135deg, var(--primary-900) 0%, var(--primary-700) 100%);
    position: relative;
    overflow: hidden;
}

.account-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.bank-name {
    letter-spacing: 2px;
}

.text-white-alpha-70 {
    color: rgba(255, 255, 255, 0.85) !important;
}

.card-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
    background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.7) 1px, transparent 0);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 0;
}

.account-header, .account-number-section, .flex {
    position: relative;
    z-index: 1;
}

.tracking-widest {
    letter-spacing: 0.2em;
}
</style>