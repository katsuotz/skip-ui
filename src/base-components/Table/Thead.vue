<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import omit from "lodash-es/omit";
import { twMerge } from "tailwind-merge";
import { withDefaults, computed, HTMLAttributes, useAttrs, provide } from "vue";

export type ProvideThead = {
  variant?: "default" | "light" | "dark";
};

interface TheadProps extends HTMLAttributes {
  variant?: "default" | "light" | "dark";
}

const props = withDefaults(defineProps<TheadProps>(), {
  variant: "default",
});

const attrs = useAttrs();

const computedClass = computed(() =>
  twMerge([
    props.variant === "light" && "bg-slate-200/60 dark:bg-slate-200",
    props.variant === "dark" && "bg-dark text-white dark:bg-black/30",
    typeof attrs.class === "string" && attrs.class,
  ])
);

provide<ProvideThead>("thead", {
  variant: props.variant,
});
</script>

<template>
  <thead
    :class="computedClass"
    v-bind="omit(attrs, 'class')"
  >
    <slot />
  </thead>
</template>
