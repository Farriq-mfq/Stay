<script setup>
</script>
<template>
  <div class="surface-ground relative min-h-screen">
    <component :is="this.$route.meta.layoutComponent">
      <slot></slot>
    </component>
  </div>
</template>
