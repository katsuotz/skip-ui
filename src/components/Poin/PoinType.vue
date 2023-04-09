<script setup lang="ts">

import {numberFormat} from "../../utils/helper";

interface PoinValueProps {
    modelValue?: number;
    type: string;
}

const props = defineProps<PoinValueProps>();

</script>

<template>
  <div
    v-if="props.modelValue"
    :class="[
      props.type === 'Pelanggaran' && 'text-danger',
      props.type === 'Penghargaan' && 'text-success',
      'font-bold'
    ]"
  >
    {{ props.type === 'Pelanggaran' ? '-' : '+' }}{{ numberFormat(props.modelValue) }}
  </div>
  <div v-else>
    -
  </div>
</template>
