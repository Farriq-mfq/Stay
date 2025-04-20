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
        name: 'Align Center',
        icon: 'pi pi-align-center'
    },
    {
        name: 'Align Justify',
        icon: 'pi pi-align-justify'
    },
    {
        name: 'Align Left',
        icon: 'pi pi-align-left'
    },
    {
        name: 'Align Right',
        icon: 'pi pi-align-right'
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
        name: 'Angle Double Down',
        icon: 'pi pi-angle-double-down'
    },
    {
        name: 'Angle Double Left',
        icon: 'pi pi-angle-double-left'
    },
    {
        name: 'Angle Double Right',
        icon: 'pi pi-angle-double-right'
    },
    {
        name: 'Angle Double Up',
        icon: 'pi pi-angle-double-up'
    },
    {
        name: 'Angle Down',
        icon: 'pi pi-angle-down'
    },
    {
        name: 'Angle Left',
        icon: 'pi pi-angle-left'
    },
    {
        name: 'Angle Right',
        icon: 'pi pi-angle-right'
    },
    {
        name: 'Angle Up',
        icon: 'pi pi-angle-up'
    },
    {
        name: 'Apple',
        icon: 'pi pi-apple'
    },
    {
        name: 'Arrow Circle Down',
        icon: 'pi pi-arrow-circle-down'
    },
    {
        name: 'Arrow Circle Left',
        icon: 'pi pi-arrow-circle-left'
    },
    {
        name: 'Arrow Circle Right',
        icon: 'pi pi-arrow-circle-right'
    },
    {
        name: 'Arrow Circle Up',
        icon: 'pi pi-arrow-circle-up'
    },
    {
        name: 'Arrow Down',
        icon: 'pi pi-arrow-down'
    },
    {
        name: 'Arrow Left',
        icon: 'pi pi-arrow-left'
    },
    {
        name: 'Arrow Right',
        icon: 'pi pi-arrow-right'
    },
    {
        name: 'Arrow Up',
        icon: 'pi pi-arrow-up'
    },
    {
        name: 'Asterisk',
        icon: 'pi pi-asterisk'
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
        name: 'Ban',
        icon: 'pi pi-ban'
    },
    {
        name: 'Barcode',
        icon: 'pi pi-barcode'
    },
    {
        name: 'Bars',
        icon: 'pi pi-bars'
    },
    {
        name: 'Bell',
        icon: 'pi pi-bell'
    },
    {
        name: 'Bell Slash',
        icon: 'pi pi-bell-slash'
    },
    {
        name: 'Bitcoin',
        icon: 'pi pi-bitcoin'
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
        name: 'Bookmark',
        icon: 'pi pi-bookmark'
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
        name: 'Bullseye',
        icon: 'pi pi-bullseye'
    },
    {
        name: 'Calculator',
        icon: 'pi pi-calculator'
    },
    {
        name: 'Calendar',
        icon: 'pi pi-calendar'
    },
    {
        name: 'Calendar Minus',
        icon: 'pi pi-calendar-minus'
    },
    {
        name: 'Calendar Plus',
        icon: 'pi pi-calendar-plus'
    },
    {
        name: 'Camera',
        icon: 'pi pi-camera'
    },
    {
        name: 'Caret Down',
        icon: 'pi pi-caret-down'
    },
    {
        name: 'Caret Left',
        icon: 'pi pi-caret-left'
    },
    {
        name: 'Caret Right',
        icon: 'pi pi-caret-right'
    },
    {
        name: 'Caret Up',
        icon: 'pi pi-caret-up'
    },
    {
        name: 'Cart Minus',
        icon: 'pi pi-cart-minus'
    },
    {
        name: 'Cart Plus',
        icon: 'pi pi-cart-plus'
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
        name: 'Check Circle',
        icon: 'pi pi-check-circle'
    },
    {
        name: 'Check Square',
        icon: 'pi pi-check-square'
    },
    {
        name: 'Chevron Circle Down',
        icon: 'pi pi-chevron-circle-down'
    },
    {
        name: 'Chevron Circle Left',
        icon: 'pi pi-chevron-circle-left'
    },
    {
        name: 'Chevron Circle Right',
        icon: 'pi pi-chevron-circle-right'
    },
    {
        name: 'Chevron Circle Up',
        icon: 'pi pi-chevron-circle-up'
    },
    {
        name: 'Chevron Down',
        icon: 'pi pi-chevron-down'
    },
    {
        name: 'Chevron Left',
        icon: 'pi pi-chevron-left'
    },
    {
        name: 'Chevron Right',
        icon: 'pi pi-chevron-right'
    },
    {
        name: 'Chevron Up',
        icon: 'pi pi-chevron-up'
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
        name: 'Clipboard',
        icon: 'pi pi-clipboard'
    },
    {
        name: 'Clock',
        icon: 'pi pi-clock'
    },
    {
        name: 'Clone',
        icon: 'pi pi-clone'
    },
    {
        name: 'Cloud',
        icon: 'pi pi-cloud'
    },
    {
        name: 'Cloud Download',
        icon: 'pi pi-cloud-download'
    },
    {
        name: 'Cloud Upload',
        icon: 'pi pi-cloud-upload'
    },
    {
        name: 'Code',
        icon: 'pi pi-code'
    },
    {
        name: 'Cog',
        icon: 'pi pi-cog'
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
        name: 'Copy',
        icon: 'pi pi-copy'
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
        name: 'Discord',
        icon: 'pi pi-discord'
    },
    {
        name: 'Dollar',
        icon: 'pi pi-dollar'
    },
    {
        name: 'Download',
        icon: 'pi pi-download'
    },
    {
        name: 'Eject',
        icon: 'pi pi-eject'
    },
    {
        name: 'Ellipsis H',
        icon: 'pi pi-ellipsis-h'
    },
    {
        name: 'Ellipsis V',
        icon: 'pi pi-ellipsis-v'
    }
];

const selectedIcon = ref(null);
</script>

<style scoped>
.card {
    padding: 2rem;
}
</style>
