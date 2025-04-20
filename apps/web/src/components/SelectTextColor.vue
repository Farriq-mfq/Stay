<template>
    <Dropdown v-model="selectedIcon" :options="colors" :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" optionLabel="name" placeholder="Pilih Text Color" class="w-full" filter>
        <template #value="slotProps">
            <div class="flex align-items-center gap-2" v-if="slotProps.value">
                <div :class="`h-2rem w-2rem border-1 surface-border ${slotProps.value.color.replace('text-', 'bg-')}`"></div>
                <div>{{ slotProps.value.name }}</div>
            </div>
            <span v-else>{{ slotProps.placeholder }}</span>
        </template>
        <template #option="slotProps">
            <div class="flex align-items-center gap-2">
                <div :class="`h-2rem w-2rem border-1 surface-border ${slotProps.option.color.replace('text-', 'bg-')}`"></div>
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
const colors = [
    {
        name: 'Orange-100',
        color: 'text-orange-100'
    },
    {
        name: 'Orange-200',
        color: 'text-orange-200'
    },
    {
        name: 'Orange-300',
        color: 'text-orange-300'
    },
    {
        name: 'Orange-400',
        color: 'text-orange-400'
    },
    {
        name: 'Orange-500',
        color: 'text-orange-500'
    },
    {
        name: 'Orange-600',
        color: 'text-orange-600'
    },
    {
        name: 'Orange-700',
        color: 'text-orange-700'
    },
    {
        name: 'Orange-800',
        color: 'text-orange-800'
    },
    {
        name: 'Orange-900',
        color: 'text-orange-900'
    },
    {
        name: 'Blue-100',
        color: 'text-blue-100'
    },
    {
        name: 'Blue-200',
        color: 'text-blue-200'
    },
    {
        name: 'Blue-300',
        color: 'text-blue-300'
    },
    {
        name: 'Blue-400',
        color: 'text-blue-400'
    },
    {
        name: 'Blue-500',
        color: 'text-blue-500'
    },
    {
        name: 'Blue-600',
        color: 'text-blue-600'
    },
    {
        name: 'Blue-700',
        color: 'text-blue-700'
    },
    {
        name: 'Blue-800',
        color: 'text-blue-800'
    },
    {
        name: 'Blue-900',
        color: 'text-blue-900'
    },
    {
        name: 'Red-100',
        color: 'text-red-100'
    },
    {
        name: 'Red-200',
        color: 'text-red-200'
    },
    {
        name: 'Red-300',
        color: 'text-red-300'
    },
    {
        name: 'Red-400',
        color: 'text-red-400'
    },
    {
        name: 'Red-500',
        color: 'text-red-500'
    },
    {
        name: 'Red-600',
        color: 'text-red-600'
    },
    {
        name: 'Red-700',
        color: 'text-red-700'
    },
    {
        name: 'Red-800',
        color: 'text-red-800'
    },
    {
        name: 'Red-900',
        color: 'text-red-900'
    },
    {
        name: 'Green-100',
        color: 'text-green-100'
    },
    {
        name: 'Green-200',
        color: 'text-green-200'
    },
    {
        name: 'Green-300',
        color: 'text-green-300'
    },
    {
        name: 'Green-400',
        color: 'text-green-400'
    },
    {
        name: 'Green-500',
        color: 'text-green-500'
    },
    {
        name: 'Green-600',
        color: 'text-green-600'
    },
    {
        name: 'Green-700',
        color: 'text-green-700'
    },
    {
        name: 'Green-800',
        color: 'text-green-800'
    },
    {
        name: 'Green-900',
        color: 'text-green-900'
    },
    {
        name: 'Yellow-100',
        color: 'text-yellow-100'
    },
    {
        name: 'Yellow-200',
        color: 'text-yellow-200'
    },
    {
        name: 'Yellow-300',
        color: 'text-yellow-300'
    },
    {
        name: 'Yellow-400',
        color: 'text-yellow-400'
    },
    {
        name: 'Yellow-500',
        color: 'text-yellow-500'
    },
    {
        name: 'Yellow-600',
        color: 'text-yellow-600'
    },
    {
        name: 'Yellow-700',
        color: 'text-yellow-700'
    },
    {
        name: 'Yellow-800',
        color: 'text-yellow-800'
    },
    {
        name: 'Yellow-900',
        color: 'text-yellow-900'
    },
    {
        name: 'Purple-100',
        color: 'text-purple-100'
    },
    {
        name: 'Purple-200',
        color: 'text-purple-200'
    },
    {
        name: 'Purple-300',
        color: 'text-purple-300'
    },
    {
        name: 'Purple-400',
        color: 'text-purple-400'
    },
    {
        name: 'Purple-500',
        color: 'text-purple-500'
    },
    {
        name: 'Purple-600',
        color: 'text-purple-600'
    },
    {
        name: 'Purple-700',
        color: 'text-purple-700'
    },
    {
        name: 'Purple-800',
        color: 'text-purple-800'
    },
    {
        name: 'Purple-900',
        color: 'text-purple-900'
    },
    {
        name: 'Pink-100',
        color: 'text-pink-100'
    },
    {
        name: 'Pink-200',
        color: 'text-pink-200'
    },
    {
        name: 'Pink-300',
        color: 'text-pink-300'
    },
    {
        name: 'Pink-400',
        color: 'text-pink-400'
    },
    {
        name: 'Pink-500',
        color: 'text-pink-500'
    },
    {
        name: 'Pink-600',
        color: 'text-pink-600'
    },
    {
        name: 'Pink-700',
        color: 'text-pink-700'
    },
    {
        name: 'Pink-800',
        color: 'text-pink-800'
    },
    {
        name: 'Pink-900',
        color: 'text-pink-900'
    },
    {
        name: 'Teal-100',
        color: 'text-teal-100'
    },
    {
        name: 'Teal-200',
        color: 'text-teal-200'
    },
    {
        name: 'Teal-300',
        color: 'text-teal-300'
    },
    {
        name: 'Teal-400',
        color: 'text-teal-400'
    },
    {
        name: 'Teal-500',
        color: 'text-teal-500'
    },
    {
        name: 'Teal-600',
        color: 'text-teal-600'
    },
    {
        name: 'Teal-700',
        color: 'text-teal-700'
    },
    {
        name: 'Teal-800',
        color: 'text-teal-800'
    },
    {
        name: 'Teal-900',
        color: 'text-teal-900'
    },
    {
        name: 'Gray-100',
        color: 'text-gray-100'
    },
    {
        name: 'Gray-200',
        color: 'text-gray-200'
    },
    {
        name: 'Gray-300',
        color: 'text-gray-300'
    },
    {
        name: 'Gray-400',
        color: 'text-gray-400'
    },
    {
        name: 'Gray-500',
        color: 'text-gray-500'
    },
    {
        name: 'Gray-600',
        color: 'text-gray-600'
    },
    {
        name: 'Gray-700',
        color: 'text-gray-700'
    },
    {
        name: 'Gray-800',
        color: 'text-gray-800'
    },
    {
        name: 'Gray-900',
        color: 'text-gray-900'
    }
];

const selectedIcon = ref(null);
</script>

<style scoped>
.card {
    padding: 2rem;
}
</style>
