import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
export const useScan = defineStore("scan", () => {
    const scan = ref(false);

    const isScan = computed(() => scan.value)

    return { scan, isScan }
})