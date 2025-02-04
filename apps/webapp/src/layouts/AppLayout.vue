<script setup>
import { isEmpty } from "lodash";
</script>

<template>
  <div class="surface-ground min-h-screen w-full">
    <component :is="this.$route.meta.layoutComponent">
      <slot></slot>
    </component>
  </div>
</template>
