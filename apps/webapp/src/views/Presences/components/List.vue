<script setup>
const presences = [
    {
        title: 'sfad',
        method: 'dsf',
        tanggal: ""
    },
    {
        title: 'sfad',
        method: 'dsf',
        tanggal: ""
    },
    {
        title: 'sfad',
        method: 'dsf',
        tanggal: ""
    },
    {
        title: 'sfad',
        method: 'dsf',
        tanggal: ""
    },
    {
        title: 'sfad',
        method: 'dsf',
        tanggal: ""
    },
]
</script>
<template>
    <div>
        <DataView :value="presences">
            <template #empty>
                koshong
            </template>
            <template #list="slotProps">
                <div class="gap-3 flex flex-column">
                    <div v-for="(item, index) in slotProps.items" :key="index">
                        <Panel header="Presensi Musholla" toggleable>
                            <div class="text-sm flex align-items-center gap-2 text-500">
                                <i class="pi pi-map-marker"></i>
                                <span>Musholla</span>
                            </div>
                            <Tag class="mt-3">
                                <i class="pi pi-id-card mr-1"></i>
                                kartu
                            </Tag>
                            <div class="mt-3 text-sm flex align-items-center gap-2 text-500">
                                <i class="pi pi-calendar"></i>
                                <span>20 Juni 2024</span>
                            </div>
                        </Panel>
                    </div>
                </div>
            </template>
        </DataView>
    </div>
</template>