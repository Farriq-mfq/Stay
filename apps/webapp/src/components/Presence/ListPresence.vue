<script setup>
import { format } from "date-fns";
import { id } from "date-fns/locale";
const { items } = defineProps({
  items: {
    type: Array,
    default: [],
    required: true,
  },
});
</script>

<template>
  <router-link
    v-for="(item, index) in items"
    :key="index"
    :to="{ name: 'presences-detail', params: { id: item.id } }"
    class="flex flex-column py-2 border-bottom-1 surface-border no-underline text-color"
  >
    <h4 class="m-0 mb-2">{{ item.session.name }}</h4>
    <div class="text-xs my-1 font-semibold">
      <span class="text-primary">Lokasi : </span>
      <span class="text-color-secondary">{{
        item.gateway ? item.gateway.location : "-"
      }}</span>
    </div>
    <div class="text-xs my-1 font-semibold">
      <span class="text-primary">Tanggal : </span>
      <span class="text-color-secondary">
        {{ format(item.createdAt, "dd MMMM yyyy", { locale: id }) }}
      </span>
    </div>
    <div class="text-xs my-1 font-semibold">
      <span class="text-primary">Metode : </span>
      <span class="text-color-secondary">
        {{ item.method }}
      </span>
    </div>
  </router-link>
</template>
