<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import omit from "lodash-es/omit";
import { twMerge } from "tailwind-merge";
import { useAttrs, computed } from "vue";

interface FooterProps {
  as?: string | object;
}

const { as } = withDefaults(defineProps<FooterProps>(), {
  as: "div",
});

const attrs = useAttrs();
const computedClass = computed(() =>
  twMerge(["flex p-1", typeof attrs.class === "string" && attrs.class])
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
