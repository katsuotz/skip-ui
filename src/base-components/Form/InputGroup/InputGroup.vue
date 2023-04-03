<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import omit from "lodash-es/omit";
import { twMerge } from "tailwind-merge";
import { computed, useAttrs, provide } from "vue";

export type ProvideInputGroup = boolean;

const attrs = useAttrs();
const computedClass = computed(() =>
  twMerge(["flex", typeof attrs.class === "string" && attrs.class])
);

provide<ProvideInputGroup>("inputGroup", true);
</script>

<template>
  <div
    :class="computedClass"
    v-bind="omit(attrs, 'class')"
  >
    <slot />
  </div>
</template>
