<script setup>
import { useToast } from "primevue/usetoast";
import List from './components/List.vue'
const toast = useToast()
const handleShowNotifications = () => {
    toast.add({
        severity: 'success',
        summary: 'Notifications Enabled',
        detail: 'You will now receive notifications',
        life: 3000
    });

}
</script>
<template>
    <div>
        <List />
    </div>
</template>