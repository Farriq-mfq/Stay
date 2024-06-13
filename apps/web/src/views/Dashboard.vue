<script setup>
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance()
const socket = proxy.socket
socket.on('READER_192.168.12.12', (data) => {
  alert(data)
})
</script>
<template>
  <p>slkdfnlskndf</p>
</template>
