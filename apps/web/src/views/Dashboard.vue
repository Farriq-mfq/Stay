<script setup>
import SelectGateway from '@/components/SelectGateway.vue'
const handleChange = (val) => {
  alert(val)
}
</script>
<template>
  <div>
    <SelectGateway role="register" @input="handleChange" />
    <p>slkdfnlskndf</p>
  </div>
</template>
