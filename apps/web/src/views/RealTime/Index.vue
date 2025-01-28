<script setup>
import { ref } from 'vue';
import AppConfig from '../../layout/AppConfig.vue';
import SiswaType from './Type/Siswa.vue';
import PegawaiType from './Type/Pegawai.vue';


const sessionId = ref(null)
const detailSession = ref(null)

const handleChangeSelectSession = (val) => {
    sessionId.value = val.id
    detailSession.value = val
}

const clearSession = () => {
    sessionId.value = null
    detailSession.value = null
}
</script>

<template>
    <div class="pt-3">
        <div class="mx-4 mt-3">
            <div class="field" v-if="sessionId === null">
                <select-session @input="handleChangeSelectSession" />
            </div>
        </div>
        <div v-if="sessionId && detailSession.session_role_type === 'SISWA'">
            <SiswaType :sessionId="sessionId" @close="clearSession" :detailSession="detailSession" />
        </div>
        <div v-else-if="sessionId && detailSession.session_role_type === 'PEGAWAI'">
            <PegawaiType :sessionId="sessionId" @close="clearSession" :detailSession="detailSession" />
        </div>
        <app-config></app-config>
        <div class="layout-mask"></div>
    </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>