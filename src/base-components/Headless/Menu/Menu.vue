<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import omit from "lodash-es/omit";
import { twMerge } from "tailwind-merge";
import { Menu as HeadlessMenu } from "@headlessui/vue";
import { useAttrs, computed } from "vue";

// eslint-disable-next-line no-undef
interface MenuProps extends ExtractProps<typeof HeadlessMenu> {
  as?: string | object;
}

const { as } = withDefaults(defineProps<MenuProps>(), {
  as: "div",
});

const attrs = useAttrs();
const computedClass = computed(() =>
  twMerge(["relative", typeof attrs.class === "string" && attrs.class])
);
</script>

<template>
  <HeadlessMenu as="template">
    <component
      :is="as"
      :class="computedClass"
      v-bind="omit(attrs, 'class')"
    >
      <slot />
    </component>
  </HeadlessMenu>
</template>
