<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import omit from "lodash-es/omit";
import { twMerge } from "tailwind-merge";
import { useAttrs, computed } from "vue";

interface HeaderProps {
  as?: string | object;
}

const { as } = withDefaults(defineProps<HeaderProps>(), {
  as: "div",
});

const attrs = useAttrs();
const computedClass = computed(() =>
  twMerge(["p-2 font-medium", typeof attrs.class === "string" && attrs.class])
);
</script>

<template>
  <component
    :is="as"
    :class="computedClass"
    v-bind="omit(attrs, 'class')"
  >
    <slot />
  </component>
</template>
