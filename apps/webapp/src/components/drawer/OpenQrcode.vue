<script setup>
import { useQRCode } from '@vueuse/integrations/useQRCode'
const qrcode = useQRCode('text-to-encode')

</script>

<template>
    <div>
        <p>Ini qrcode</p>

        <img :src="qrcode" alt="QR Code" />

    </div>
</template>