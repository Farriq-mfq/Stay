<script setup>
import { ref, computed, watch } from "vue";

import { QrcodeStream } from "vue-qrcode-reader";
import { useScan } from "@/store/scan";
const loading = ref(true);
const result = ref("");
const torchActive = ref(false);
const scan = useScan();

function onDetect(detectedCodes) {
  console.log(detectedCodes);
  result.value = JSON.stringify(detectedCodes.map((code) => code.rawValue));
}

const selectedConstraints = ref({ facingMode: "environment" });
const defaultConstraintOptions = [
  { label: "rear camera", constraints: { facingMode: "environment" } },
  { label: "front camera", constraints: { facingMode: "user" } },
];
const constraintOptions = ref(defaultConstraintOptions);

async function onCameraReady() {
  loading.value = false;
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(({ kind }) => kind === "videoinput");

  constraintOptions.value = [
    ...defaultConstraintOptions,
    ...videoDevices.map(({ deviceId, label }) => ({
      label: `${label} (ID: ${deviceId})`,
      constraints: { deviceId },
    })),
  ];

  error.value = "";
}

function paintOutline(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

    ctx.strokeStyle = "red";

    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y);
    }
    ctx.lineTo(firstPoint.x, firstPoint.y);
    ctx.closePath();
    ctx.stroke();
  }
}
function paintBoundingBox(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: { x, y, width, height },
    } = detectedCode;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#007bff";
    ctx.strokeRect(x, y, width, height);
  }
}
function paintCenterText(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const { boundingBox, rawValue } = detectedCode;

    const centerX = boundingBox.x + boundingBox.width / 2;
    const centerY = boundingBox.y + boundingBox.height / 2;

    const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width);

    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#35495e";
    ctx.strokeText(detectedCode.rawValue, centerX, centerY);

    ctx.fillStyle = "#5cb984";
    ctx.fillText(rawValue, centerX, centerY);
  }
}
const trackFunctionOptions = [
  { text: "nothing (default)", value: undefined },
  { text: "outline", value: paintOutline },
  { text: "centered text", value: paintCenterText },
  { text: "bounding box", value: paintBoundingBox },
];
const trackFunctionSelected = ref(trackFunctionOptions[1]);

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
  matrix_codes: false,
});
const selectedBarcodeFormats = computed(() => {
  return Object.keys(barcodeFormats.value).filter(
    (format) => barcodeFormats.value[format]
  );
});

const error = ref("");

function onError(err) {
  error.value = `[${err.name}]: `;

  if (err.name === "NotAllowedError") {
    error.value += "you need to grant camera access permission";
  } else if (err.name === "NotFoundError") {
    error.value += "no camera on this device";
  } else if (err.name === "NotSupportedError") {
    error.value += "secure context required (HTTPS, localhost)";
  } else if (err.name === "NotReadableError") {
    error.value += "is the camera already in use?";
  } else if (err.name === "OverconstrainedError") {
    error.value += "installed cameras are not suitable";
  } else if (err.name === "StreamApiNotSupportedError") {
    error.value += "Stream API is not supported in this browser";
  } else if (err.name === "InsecureContextError") {
    error.value +=
      "Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
  } else {
    error.value += err.message;
  }
}

function switchCamera() {
  loading.value = true;
  switch (selectedConstraints.value.facingMode) {
    case "environment":
      selectedConstraints.value.facingMode = "user";
      break;
    case "user":
      selectedConstraints.value.facingMode = "environment";
      break;
  }
}

function switchTorch() {
  loading.value = true;
  torchActive.value = !torchActive.value;
}

watch(result, (val) => {
  if (val.length) {
    scan.closeScan();
  }
});
</script>

<template>
  <div class="p-3">
    <div
      class="w-full h-30rem border-2 border-primary border-round-2xl overflow-hidden relative"
    >
      <qrcode-stream
        v-if="!result.length"
        :constraints="selectedConstraints"
        :track="trackFunctionSelected.value"
        :formats="selectedBarcodeFormats"
        @error="onError"
        @detect="onDetect"
        @camera-on="onCameraReady"
        v-memo="[torchActive]"
        :torch="torchActive"
      >
        <Skeleton style="height: 30rem" v-if="loading"></Skeleton>
        <Button
          v-if="!loading"
          @click="switchCamera"
          icon="pi pi-arrow-right-arrow-left text-xs"
          style="box-shadow: none !important"
          class="m-2 absolute right-0 top-0"
          rounded
          outlined
        />
        <Button
          v-if="!loading"
          @click="switchTorch"
          icon="pi pi-bolt text-xs"
          style="box-shadow: none !important"
          class="m-2 absolute left-0 top-0"
          rounded
          :outlined="!torchActive"
        />
        <p
          v-if="!loading"
          class="absolute bottom-0 left-0 right-0 text-center text-white text-xs"
          style="font-style: italic"
        >
          SMK Negeri 1 Pekalongan
        </p>

        <!-- <div class="animation-qr" v-if="!loading"></div> -->
      </qrcode-stream>
    </div>
    Result : {{ result }}
  </div>
</template>

<style setup>
/* .animation-qr {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  width: 100%;
  background: red;
  animation: updown 3s infinite linear;
}

@keyframes updown {
  0% {
    top: 0;
  }
  50% {
    top: 100%;
  }
  100% {
    top: 0;
  }
} */
</style>
