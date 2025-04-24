<template>
    <Dropdown v-model="selectedIcon" :options="icons" :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" optionLabel="name" placeholder="Pilih Icon" class="w-full" filter>
        <template #value="slotProps">
            <div class="flex align-items-center" v-if="slotProps.value">
                <i :class="`${slotProps.value.icon} mr-2`" />
                <div>{{ slotProps.value.name }}</div>
            </div>
            <span v-else>{{ slotProps.placeholder }}</span>
        </template>
        <template #option="slotProps">
            <div class="flex align-items-center">
                <i :class="`pi ${slotProps.option.icon} mr-2`" />
                <div>{{ slotProps.option.name }}</div>
            </div>
        </template>
    </Dropdown>
</template>

<script setup>
defineProps(['modelValue']);
defineEmits(['update:modelValue']);
import { ref } from 'vue';
import Dropdown from 'primevue/dropdown';
const icons = [
    {
        name: 'Address Book',
        icon: 'pi pi-address-book'
    },
    {
        name: 'Amazon',
        icon: 'pi pi-amazon'
    },
    {
        name: 'Android',
        icon: 'pi pi-android'
    },
    {
        name: 'Apple',
        icon: 'pi pi-apple'
    },
    {
        name: 'Arrow Down Left',
        icon: 'pi pi-arrow-down-left'
    },
    {
        name: 'Arrow Down Right',
        icon: 'pi pi-arrow-down-right'
    },
    {
        name: 'Arrow Up Left',
        icon: 'pi pi-arrow-up-left'
    },
    {
        name: 'Arrow Up Right',
        icon: 'pi pi-arrow-up-right'
    },
    {
        name: 'Arrows Horizontal',
        icon: 'pi pi-arrows-h'
    },
    {
        name: 'Arrows Vertical',
        icon: 'pi pi-arrows-v'
    },
    {
        name: 'At',
        icon: 'pi pi-at'
    },
    {
        name: 'Backward',
        icon: 'pi pi-backward'
    },
    {
        name: 'Bell',
        icon: 'pi pi-bell'
    },
    {
        name: 'Bolt',
        icon: 'pi pi-bolt'
    },
    {
        name: 'Book',
        icon: 'pi pi-book'
    },
    {
        name: 'Bookmark Fill',
        icon: 'pi pi-bookmark-fill'
    },
    {
        name: 'Box',
        icon: 'pi pi-box'
    },
    {
        name: 'Briefcase',
        icon: 'pi pi-briefcase'
    },
    {
        name: 'Building',
        icon: 'pi pi-building'
    },
    {
        name: 'Camera',
        icon: 'pi pi-camera'
    },
    {
        name: 'Car',
        icon: 'pi pi-car'
    },
    {
        name: 'Chart Bar',
        icon: 'pi pi-chart-bar'
    },
    {
        name: 'Chart Line',
        icon: 'pi pi-chart-line'
    },
    {
        name: 'Chart Pie',
        icon: 'pi pi-chart-pie'
    },
    {
        name: 'Check',
        icon: 'pi pi-check'
    },
    {
        name: 'Check Square',
        icon: 'pi pi-check-square'
    },
    {
        name: 'Circle',
        icon: 'pi pi-circle'
    },
    {
        name: 'Circle Fill',
        icon: 'pi pi-circle-fill'
    },
    {
        name: 'Code',
        icon: 'pi pi-code'
    },
    {
        name: 'Comment',
        icon: 'pi pi-comment'
    },
    {
        name: 'Comments',
        icon: 'pi pi-comments'
    },
    {
        name: 'Compass',
        icon: 'pi pi-compass'
    },
    {
        name: 'Credit Card',
        icon: 'pi pi-credit-card'
    },
    {
        name: 'Database',
        icon: 'pi pi-database'
    },
    {
        name: 'Desktop',
        icon: 'pi pi-desktop'
    },
    {
        name: 'Directions',
        icon: 'pi pi-directions'
    },
    {
        name: 'Directions Alt',
        icon: 'pi pi-directions-alt'
    },
    {
        name: 'Discord',
        icon: 'pi pi-discord'
    },
    {
        name: 'Dollar',
        icon: 'pi pi-dollar'
    },
    {
        name: 'Eject',
        icon: 'pi pi-eject'
    },
    {
        name: 'Envelope',
        icon: 'pi pi-envelope'
    },
    {
        name: 'Euro',
        icon: 'pi pi-euro'
    },
    {
        name: 'Exclamation Circle',
        icon: 'pi pi-exclamation-circle'
    },
    {
        name: 'Eye Slash',
        icon: 'pi pi-eye-slash'
    },
    {
        name: 'Facebook',
        icon: 'pi pi-facebook'
    },
    {
        name: 'Fast Backward',
        icon: 'pi pi-fast-backward'
    },
    {
        name: 'Fast Forward',
        icon: 'pi pi-fast-forward'
    },
    {
        name: 'File Excel',
        icon: 'pi pi-file-excel'
    },
    {
        name: 'File PDF',
        icon: 'pi pi-file-pdf'
    },
    {
        name: 'File O',
        icon: 'pi pi-file-o'
    },
    {
        name: 'Filter Fill',
        icon: 'pi pi-filter-fill'
    },
    {
        name: 'Filter Slash',
        icon: 'pi pi-filter-slash'
    },
    {
        name: 'Flag',
        icon: 'pi pi-flag'
    },
    {
        name: 'Flag Fill',
        icon: 'pi pi-flag-fill'
    },
    {
        name: 'Forward',
        icon: 'pi pi-forward'
    },
    {
        name: 'Github',
        icon: 'pi pi-github'
    },
    {
        name: 'Google',
        icon: 'pi pi-google'
    },
    {
        name: 'Hashtag',
        icon: 'pi pi-hashtag'
    },
    {
        name: 'Heart',
        icon: 'pi pi-heart'
    },
    {
        name: 'Heart Fill',
        icon: 'pi pi-heart-fill'
    },
    {
        name: 'History',
        icon: 'pi pi-history'
    },
    {
        name: 'Id Card',
        icon: 'pi pi-id-card'
    },
    {
        name: 'Image',
        icon: 'pi pi-image'
    },
    {
        name: 'Images',
        icon: 'pi pi-images'
    },
    {
        name: 'Instagram',
        icon: 'pi pi-instagram'
    },
    {
        name: 'Key',
        icon: 'pi pi-key'
    },
    {
        name: 'Link',
        icon: 'pi pi-link'
    },
    {
        name: 'LinkedIn',
        icon: 'pi pi-linkedin'
    },
    {
        name: 'List',
        icon: 'pi pi-list'
    },
    {
        name: 'Lock Open',
        icon: 'pi pi-lock-open'
    },
    {
        name: 'Map',
        icon: 'pi pi-map'
    },
    {
        name: 'Map Marker',
        icon: 'pi pi-map-marker'
    },
    {
        name: 'Microsoft',
        icon: 'pi pi-microsoft'
    },
    {
        name: 'Mobile',
        icon: 'pi pi-mobile'
    },
    {
        name: 'Money Bill',
        icon: 'pi pi-money-bill'
    },
    {
        name: 'Moon',
        icon: 'pi pi-moon'
    },
    {
        name: 'Palette',
        icon: 'pi pi-palette'
    },
    {
        name: 'Paperclip',
        icon: 'pi pi-paperclip'
    },
    {
        name: 'Pause',
        icon: 'pi pi-pause'
    },
    {
        name: 'Paypal',
        icon: 'pi pi-paypal'
    },
    {
        name: 'Percentage',
        icon: 'pi pi-percentage'
    }
];

const selectedIcon = ref(null);
</script>

<style scoped>
.card {
    padding: 2rem;
}
</style>
