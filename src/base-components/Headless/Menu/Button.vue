<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import omit from "lodash-es/omit";
import { twMerge } from "tailwind-merge";
import { MenuButton as HeadlessMenuButton } from "@headlessui/vue";
import { useAttrs, computed } from "vue";

// eslint-disable-next-line no-undef
interface ButtonProps extends ExtractProps<typeof HeadlessMenuButton> {
  as?: string | object;
}

const { as } = withDefaults(defineProps<ButtonProps>(), {
  as: "div",
});

const attrs = useAttrs();
const computedClass = computed(() =>
  twMerge(["cursor-pointer", typeof attrs.class === "string" && attrs.class])
);
</script>

<template>
  <HeadlessMenuButton as="template">
    <component
      :is="as"
      :class="computedClass"
      v-bind="omit(attrs, 'class')"
    >
      <slot />
    </component>
  </HeadlessMenuButton>
</template>
