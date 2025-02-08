<script setup>
import { useScreenOrientation } from "@vueuse/core";

const { lockOrientation } = useScreenOrientation();

lockOrientation("portrait-primary");
</script>
<template>
  <div class="surface-ground relative min-h-screen">
    <component :is="this.$route.meta.layoutComponent">
      <slot></slot>
    </component>
  </div>
</template>
