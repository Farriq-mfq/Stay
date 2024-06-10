<script setup>
import { inject, reactive } from 'vue';

const state = reactive({
    form: {
        body: {
            username: 'farriq',
            password: 'farriq',
        },
        remember: false,
        fetchUser: true,
        staySignedIn: false,
        errors: {}
    }
});

const $auth = inject('auth')
function login() {
    $auth.login({
        data: state.form.body,
        remember: state.form.remember ? '{"name": "Default"}' : null,
        fetchUser: state.form.fetchUser,
        staySignedIn: state.form.staySignedIn,
        redirect: '/',
        success: (response) => {
            alert('ok')
            // console.log('hallo')
            // this.$auth.user(response.data.user)
        },
        error: () => {
            this.error = 'Invalid username or password'
        },
    })
}
</script>
<template>
    <form @submit.prevent="login">
        <p>form login</p>
        <input type="text" />
        <input type="text" />
        <button>
            lorem
        </button>
    </form>
</template>
