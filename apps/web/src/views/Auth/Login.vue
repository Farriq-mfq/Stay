<script setup>
import { useToast } from 'primevue/usetoast';
import { inject, provide, reactive } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';

const toast = useToast()
const state = reactive({
    form: {
        body: {
            username: '',
            password: '',
        },
        remember: false,
        fetchUser: true,
        staySignedIn: false,
        errors: {},
        loading: false,
        unauthorized: false
    }
});


function errors(res) {
    if (res && res.status === 401) {
        state.form.errors = {
            username: ["Login gagal mohon perikasa username atau password"]
        }
    } else if (res && res.status === 400) {
        state.form.errors = res.data
    } else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "Internal server error",
            life: 3000
        })
    }
}


const $auth = inject('auth')
function handleLogin() {
    state.form.errors = null
    state.form.loading = true
    $auth.login({
        data: state.form.body,
        remember: state.form.remember ? '{"name": "Default"}' : null,
        fetchUser: state.form.fetchUser,
        staySignedIn: state.form.staySignedIn,
        redirect: '/',
    }).then(null, (res) => {
        errors(res.response);
        state.form.loading = false
        state.form.body.password = ''
    })
}

const APP_NAME = inject('APP_NAME')
</script>
<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <form @submit.prevent="handleLogin" class="col-12 sm:col-10 md:col-8 lg:col-5 xl:col-4">
            <div>
                <div class="w-full card py-5" style="border-radius: 20px">
                    <div class="text-center mb-5">
                        <div class="font-bold text-3xl font-medium mb-3">
                            {{ APP_NAME }}
                        </div>
                        <hr>
                        <div class="text-900 text-2xl font-medium mb-3 uppercase text-center">
                            Selamat Datang!
                        </div>
                        <span class="text-600 font-medium text-center">
                            Silakan masuk untuk melanjutkan
                        </span>
                    </div>
                    <div class="mb-4">
                        <label for="username" class="block text-900 text-xl font-medium mb-2">
                            Username
                        </label>
                        <InputText :disabled="state.form.loading" id="username" type="text" placeholder="Username"
                            class="w-full" :invalid="state.form.errors && state.form.errors.username"
                            style="padding: 1rem" v-model="state.form.body.username" />
                        <p class="text-red-500" v-if="state.form.errors && state.form.errors.username">
                            {{ state.form.errors.username[0] }}
                        </p>
                    </div>
                    <div class="mb-4">
                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password :disabled="state.form.loading"
                            :invalid="state.form.errors && state.form.errors.password" :feedback="false" id="password1"
                            v-model="state.form.body.password" placeholder="Password" :toggleMask="true" class="w-full"
                            inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                        <p class="text-red-500" v-if="state.form.errors && state.form.errors.password">
                            {{ state.form.errors.password[0] }}
                        </p>
                    </div>

                    <!-- <div class="flex align-items-center justify-content-between mb-5 gap-5">
                        <div class="flex align-items-center">
                            <Checkbox :disabled="state.form.loading" v-model="state.form.remember" id="rememberme1"
                                binary class="mr-2"></Checkbox>
                            <label for="rememberme1">Remember me</label>
                        </div>
                    </div> -->
                    <Button :disabled="state.form.loading" type="submit"
                        :label="state.form.loading ? 'Loading...' : 'Sign In'" class="w-full p-3 text-xl"></Button>
                    <div class="text-center mt-5">
                        <span class="font-medium ml-2">&copy; Copyright {{ new Date().getFullYear() }} | TIM IT SMK
                            Negeri 1
                            Pekalongan</span>

                    </div>
                </div>
            </div>
        </form>

        <app-config></app-config>
    </div>
</template>
