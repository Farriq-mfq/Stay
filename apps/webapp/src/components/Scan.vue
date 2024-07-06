<script setup>
import { ref, computed } from "vue";
import { QrcodeStream } from 'vue-qrcode-reader'
const visibleBottom = ref(false)
const result = ref('')
const loading = ref(true)

function onDetect(detectedCodes) {
    console.log(detectedCodes)
    result.value = JSON.stringify(detectedCodes.map((code) => code.rawValue))
}

/*** select camera ***/

const selectedConstraints = ref({ facingMode: 'environment' })
const defaultConstraintOptions = [
    { label: 'rear camera', constraints: { facingMode: 'environment' } },
    { label: 'front camera', constraints: { facingMode: 'user' } }
]
const constraintOptions = ref(defaultConstraintOptions)

async function onCameraReady() {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(({ kind }) => kind === 'videoinput')

    constraintOptions.value = [
        ...defaultConstraintOptions,
        ...videoDevices.map(({ deviceId, label }) => ({
            label: `${label} (ID: ${deviceId})`,
            constraints: { deviceId }
        }))
    ]

    error.value = ''
    loading.value = false
}

/*** track functons ***/

function paintOutline(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

        ctx.strokeStyle = 'red'

        ctx.beginPath()
        ctx.moveTo(firstPoint.x, firstPoint.y)
        for (const { x, y } of otherPoints) {
            ctx.lineTo(x, y)
        }
        ctx.lineTo(firstPoint.x, firstPoint.y)
        ctx.closePath()
        ctx.stroke()
    }
}
function paintBoundingBox(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
        const {
            boundingBox: { x, y, width, height }
        } = detectedCode

        ctx.lineWidth = 2
        ctx.strokeStyle = '#007bff'
        ctx.strokeRect(x, y, width, height)
    }
}
function paintCenterText(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
        const { boundingBox, rawValue } = detectedCode

        const centerX = boundingBox.x + boundingBox.width / 2
        const centerY = boundingBox.y + boundingBox.height / 2

        const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width)

        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.textAlign = 'center'

        ctx.lineWidth = 3
        ctx.strokeStyle = '#35495e'
        ctx.strokeText(detectedCode.rawValue, centerX, centerY)

        ctx.fillStyle = '#5cb984'
        ctx.fillText(rawValue, centerX, centerY)
    }
}
const trackFunctionOptions = [
    { text: 'nothing (default)', value: undefined },
    { text: 'outline', value: paintOutline },
    { text: 'centered text', value: paintCenterText },
    { text: 'bounding box', value: paintBoundingBox }
]
const trackFunctionSelected = ref(trackFunctionOptions[1])

/*** barcode formats ***/

const barcodeFormats = ref({
    aztec: false,
    code_128: false,
    code_39: false,
    code_93: false,
    codabar: false,
    databar: false,
    databar_expanded: false,
    data_matrix: false,
    dx_film_edge: false,
    ean_13: false,
    ean_8: false,
    itf: false,
    maxi_code: false,
    micro_qr_code: false,
    pdf417: false,
    qr_code: true,
    rm_qr_code: false,
    upc_a: false,
    upc_e: false,
    linear_codes: false,
    matrix_codes: false
})
const selectedBarcodeFormats = computed(() => {
    return Object.keys(barcodeFormats.value).filter((format) => barcodeFormats.value[format])
})

// switch camera
const switchCamera = () => {
    loading.value = true
    switch (selectedConstraints.value.facingMode) {
        case 'environment':
            selectedConstraints.value.facingMode = 'user'
            break
        case 'user':
            selectedConstraints.value.facingMode = 'environment'
            break
    }
}



/*** error handling ***/

const error = ref('')

function onError(err) {
    error.value = `[${err.name}]: `

    if (err.name === 'NotAllowedError') {
        error.value += 'you need to grant camera access permission'
    } else if (err.name === 'NotFoundError') {
        error.value += 'no camera on this device'
    } else if (err.name === 'NotSupportedError') {
        error.value += 'secure context required (HTTPS, localhost)'
    } else if (err.name === 'NotReadableError') {
        error.value += 'is the camera already in use?'
    } else if (err.name === 'OverconstrainedError') {
        error.value += 'installed cameras are not suitable'
    } else if (err.name === 'StreamApiNotSupportedError') {
        error.value += 'Stream API is not supported in this browser'
    } else if (err.name === 'InsecureContextError') {
        error.value +=
            'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
    } else {
        error.value += err.message
    }

    loading.value = false
}


</script>
<template>
    <div>
        <Button class="p-5 flex-1 list-none absolute bg-primary left-0 right-0 border-circle mx-auto shadow-2"
        style="bottom: 2rem;" rounded icon="pi pi-qrcode text-2xl text-center"
            @click.prevent="visibleBottom = true" />
        <Drawer v-model:visible="visibleBottom" class="border-round-top-2xl w-30rem" blockScroll position="bottom"
            style="height: auto">
            <p class="error">{{ error }}</p>
            <div
                class="border-300 h-40rem border-round-xl overflow-hidden justify-content-center flex align-items-center">
                <qrcode-stream :constraints="selectedConstraints" :track="trackFunctionSelected.value"
                    :formats="selectedBarcodeFormats" @error="onError" @detect="onDetect" @camera-on="onCameraReady">
                    <Skeleton size="25rem" v-if="loading"></Skeleton>
                    <Button v-if="!error" @click.prevent="switchCamera" severity="" icon="pi pi-arrow-right-arrow-left"
                        rounded class="m-2" style="z-index: 1;" />
                </qrcode-stream>
            </div>
        </Drawer>
    </div>
</template>

<style scoped>
.error {
    font-weight: bold;
    color: red;
}

.barcode-format-checkbox {
    margin-right: 10px;
    white-space: nowrap;
    display: inline-block;
}

</style>