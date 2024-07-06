<script setup>
import { useToast } from "primevue/usetoast";
import { inject, reactive } from "vue";
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
</script>
<template>
    <div class="flex justify-content-center align-items-center" style="min-height: 80vh;">
        <div class="col-12 mx-auto">
            <form @submit.prevent="handleLogin" class="px-3 py-5">
                <div class="text-center mb-5">
                    <div class="text-primary text-4xl border-bottom-1 pb-3 font-bold mb-3 uppercase">
                        Stay <i class="pi pi-verified" />
                    </div>
                    <div class="text-900 text-3xl font-medium mb-3">
                        Selamat datang
                    </div>
                    <span class="text-600 font-medium">
                        Silahkan login
                    </span>
                </div>
                <div class="field">
                    <label for="username" class="block text-900 text-xl font-medium mb-2">
                        Username
                    </label>
                    <InputText :disabled="state.form.loading" :invalid="state.form.errors && state.form.errors.username"
                        class="w-full" style="padding: 1rem" v-model="state.form.body.username" />
                    <p class="text-red-500" v-if="state.form.errors && state.form.errors.username">
                        {{ state.form.errors.username[0] }}
                    </p>
                </div>
                <div class="field">
                    <label for="username" class="block text-900 text-xl font-medium mb-2">
                        Password
                    </label>
                    <Password :disabled="state.form.loading" :invalid="state.form.errors && state.form.errors.password"
                        class="w-full" :feedback="false" :toggleMask="true" inputClass="w-full"
                        :inputStyle="{ padding: '1rem' }" v-model="state.form.body.password" />
                    <p class="text-red-500" v-if="state.form.errors && state.form.errors.password">
                        {{ state.form.errors.password[0] }}
                    </p>
                </div>
                <div class="field">
                    <Button :disabled="state.form.loading" type="submit"
                        :label="state.form.loading ? 'Loading...' : 'Sign In'" class="w-full" style="padding: 1rem" />
                </div>
            </form>
        </div>
    </div>
</template>