<script setup>
import { onMounted, ref } from 'vue';

const hours = ref('-');
const minutes = ref('-');
const seconds = ref('-');
const setTime = () => {
    const date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    h = h <= 9 ? `${h}`.padStart(2, 0) : h;
    m = m <= 9 ? `${m}`.padStart(2, 0) : m;
    s = s <= 9 ? `${s}`.padStart(2, 0) : s;
    hours.value = h;
    minutes.value = m;
    seconds.value = s;
}

onMounted(() => {
    setInterval(setTime, 1000);
})
</script>

<template>
    <div class="text-4xl font-bold text-primary">
        <span>
            {{ hours }}
        </span>
        <span>:</span>
        <span>
            {{ minutes }}
        </span>
        <span>:</span>
        <span>
            {{ seconds }}
        </span>
    </div>
</template>