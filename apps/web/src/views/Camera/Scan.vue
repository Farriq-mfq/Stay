<script setup>
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast';
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import { useRoute, useRouter } from 'vue-router'
const result = ref('')
const loading = ref(true)
const facingMode = ref('environment')
const noRearCamera = ref(false)
const noFrontCamera = ref(false)
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const axios = proxy.axios
const toast = useToast()

// mutate presence
const presenceQRCodeService = async (data) => {
    return await axios.post(`/presence/qr`, data)
}
const {
    mutateAsync: mutatePresence,
    isPending: isLoadingPresence,
} = useMutation({
    mutationKey: ['presence-qr'],
    mutationFn: presenceQRCodeService
})


function onDetect(detectedCodes) {
    result.value = detectedCodes.map((code) => code.rawValue)
    mutatePresence({
        nisn: result.value[0],
        session: parseInt(route.params.id)
    }, {
        onSuccess() {
            toast.add({
                severity: 'success',
                summary: 'Success',
                life: 3000,
                detail: "Presensi berhasil"
            })
        },
        onError(err) {
            if (err.response.status === 400) {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    life: 3000,
                    detail: "Mungkin anda sudah presensi"
                })
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    life: 3000,
                    detail: "Internal server error"
                })
            }
        }
    })
}

/*** select camera ***/

const selectedConstraints = ref({ facingMode: 'environment' })
const defaultConstraintOptions = [
    { label: 'rear camera', constraints: { facingMode: 'environment' } },
    { label: 'front camera', constraints: { facingMode: 'user' } }
]
const constraintOptions = ref(defaultConstraintOptions)

async function onCameraReady() {
    // NOTE: on iOS we can't invoke `enumerateDevices` before the user has given
    // camera access permission. `QrcodeStream` internally takes care of
    // requesting the permissions. The `camera-on` event should guarantee that this
    // has happened.
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
}
// switch

const switchCamera = () => {
    switch (facingMode.value) {
        case 'environment':
            facingMode.value = 'user'
            break
        case 'user':
            facingMode.value = 'environment'
            break
    }
}

// validate session is not error
const getSessionServiceByOne = async ({ queryKey }) => {
    try {
        const [_key, id] = queryKey;
        return await axios.get(`/sessions/${id}`)
    } catch (err) {
        throw err
    }
}

// todo: error handling
const {
    status,
    data,
    isError
} = useQuery({
    queryKey: ['getSessionServiceByOne', route.params.id],
    queryFn: getSessionServiceByOne,
    onError: (error) => {
        router.back();
    },
})


onMounted(() => {
    toast.add({
        severity: 'info',
        summary: 'Info',
        life: 3000,
        detail: "Arahkan Camera di QRCode"
    })
})

</script>
<template>
    <Card>
        <template #title>
            <router-link :to="{ name: 'camera' }"
                class="block mt-2 text-sm border-1 w-fit p-2 bg-primary border-round">Kembali</router-link>
        </template>
        <template #content>
            <ProgressSpinner v-if="isLoadingPresence" style="width: 50px; height: 50px" strokeWidth="8"
                fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
            <qrcode-stream :paused="isLoadingPresence" :track="trackFunctionSelected.value"
                :formats="selectedBarcodeFormats" @error="onError" @detect="onDetect" @camera-on="onCameraReady"
                :constraints="{ facingMode }">

                <Skeleton width="100%" height="20rem" class="mb-2" v-if="loading"></Skeleton>
                <Button v-if="!loading" @click="switchCamera" icon="pi pi-arrow-right-arrow-left" class="m-2" rounded />
            </qrcode-stream>
        </template>
    </Card>
</template>