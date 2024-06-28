<script setup>
import { useToast } from 'primevue/usetoast';
import { inject, reactive } from 'vue';
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
            username: ["Invalid Credentials"]
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
    })
}
</script>
<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <form @submit.prevent="handleLogin" class="col-12 sm:col-10 md:col-8 lg:col-5">
            <div>
                <div class="w-full card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">
                            Selamat datang
                        </div>
                        <span class="text-600 font-medium">
                            Silahkan login 
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

                    <div class="flex align-items-center justify-content-between mb-5 gap-5">
                        <div class="flex align-items-center">
                            <Checkbox :disabled="state.form.loading" v-model="state.form.remember" id="rememberme1"
                                binary class="mr-2"></Checkbox>
                            <label for="rememberme1">Remember me</label>
                        </div>
                    </div>
                    <Button :disabled="state.form.loading" type="submit"
                        :label="state.form.loading ? 'Loading...' : 'Sign In'" class="w-full p-3 text-xl"></Button>
                </div>
            </div>
        </form>
        <app-config></app-config>
    </div>
</template>
