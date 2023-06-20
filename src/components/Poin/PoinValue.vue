<script setup lang="ts">

import {numberFormat, poinColorClass} from "../../utils/helper";

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
      poinColorClass(props.modelValue),
      'font-bold'
    ]"
  >
    {{ numberFormat(props.modelValue) }}
  </component>
  <div v-else>
    -
  </div>
</template>
