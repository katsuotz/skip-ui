<script setup lang="ts">

import {numberFormat} from "../../utils/helper";

interface PoinValueProps {
    modelValue?: number;
    as?: string;
}

const props = withDefaults(defineProps<PoinValueProps>(), {
  as: 'span'
});

</script>

<template>
  <component
    :is="props.as"
    v-if="props.modelValue"
    :class="[
      props.modelValue < 50 && 'text-danger',
      props.modelValue >= 50 && props.modelValue < 100 && 'text-warning',
      props.modelValue >= 100 && 'text-success',
      'font-bold'
    ]"
  >
    {{ numberFormat(props.modelValue) }}
  </component>
  <div v-else>
    -
  </div>
</template>
