<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import omit from "lodash-es/omit";
import { twMerge } from "tailwind-merge";
import { computed, useAttrs } from "vue";

const attrs = useAttrs();
const computedClass = computed(() =>
  twMerge([
    "text-xs text-slate-500 mt-2",
    typeof attrs.class === "string" && attrs.class,
  ])
);
</script>

<template>
  <div
    :class="computedClass"
    v-bind="omit(attrs, 'class')"
  >
    <slot />
  </div>
</template>
