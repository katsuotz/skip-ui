<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import omit from "lodash-es/omit";
import { twMerge } from "tailwind-merge";
import { computed, useAttrs, inject } from "vue";
import { ProvideFormInline } from "./FormInline.vue";

const attrs = useAttrs();

const formInline = inject<ProvideFormInline>("formInline", false);

const computedClass = computed(() =>
  twMerge([
    "inline-block mb-2",
    formInline && "mb-2 sm:mb-0 sm:mr-5 sm:text-right",
    typeof attrs.class === "string" && attrs.class,
  ])
);
</script>

<template>
  <label
    :class="computedClass"
    v-bind="omit(attrs, 'class')"
  >
    <slot />
  </label>
</template>
