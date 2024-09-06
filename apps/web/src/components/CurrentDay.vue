<script setup>
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { computed } from 'vue';
const currentDate = new Date();

const formattedDate = computed(() => format(currentDate, 'EEEE, dd MMMM yyyy', { locale: id }))
</script>
<template>
    <div class="bg-primary shadow-1 border-1 surface-border px-4 py-2 border-round-xl mb-4 font-semibold text-3xl w-fit">
        {{ formattedDate }}
    </div>
</template>