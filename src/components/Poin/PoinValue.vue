<script setup lang="ts">

import {numberFormat} from "../../utils/helper";

interface PoinValueProps {
    modelValue?: number;
}

const props = defineProps<PoinValueProps>();

</script>

<template>
  <div
    v-if="props.modelValue"
    :class="[
      props.modelValue < 50 && 'text-danger',
      props.modelValue >= 50 && props.modelValue < 100 && 'text-warning',
      props.modelValue >= 100 && 'text-success',
      'font-bold'
    ]"
  >
    {{ numberFormat(props.modelValue) }}
  </div>
  <div v-else>
    -
  </div>
</template>
