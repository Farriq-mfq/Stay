<script setup>
import { inject, capitalize } from "vue"
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
const auth = inject("auth")
</script>
<template>
    <Card>
        <template #content>
            <div class="field">
                <label class="font-bold">Nama:</label>
                <div>{{ capitalize(auth.user().name) }}</div>
            </div>
            <div class="field">
                <label class="font-bold">Username:</label>
                <div>{{ auth.user().username }}</div>
            </div>
            <div class="field">
                <label class="font-bold">Role:</label>
                <div>{{ auth.user().role }}</div>
            </div>
            <div class="field">
                <label class="font-bold">Tanggal dibuat:</label>
                <div>
                    {{ format(new Date(auth.user().createdAt), 'EEEE, d MMMM yyyy', { locale: id }) }}
                </div>
            </div>
        </template>
    </Card>
</template>