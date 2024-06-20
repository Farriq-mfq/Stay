<script setup>
import SelectGateway from '@/components/SelectGateway.vue'
import { ref } from 'vue';
const test = ref()
const handleChange = (val) => {
  // alert(val)r
  test.value = val
}
const defaultV =[
  { "id": 1004, "name": "Gateway 1", "ip": "192.168.1.1", "location": "Musholla", "role": "presence", "status": true }
]
</script>
<template>
  <div>
    <!-- {{ test }} -->
    <SelectGateway :defaultValue="defaultV" multiple @input="handleChange" />
    <!-- <p>slkdfnlskndf</p> -->
  </div>
</template>
