<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import omit from "lodash-es/omit";
import { twMerge } from "tailwind-merge";
import { Popover as HeadlessPopover } from "@headlessui/vue";
import { useAttrs, computed } from "vue";

// eslint-disable-next-line no-undef
interface PopoverProps extends ExtractProps<typeof HeadlessPopover> {
  as?: string | object;
}

const { as } = withDefaults(defineProps<PopoverProps>(), {
  as: "div",
});

const attrs = useAttrs();
const computedClass = computed(() =>
  twMerge(["relative", typeof attrs.class === "string" && attrs.class])
);
</script>

<template>
  <HeadlessPopover
    v-slot="{ close }"
    as="template"
  >
    <component
      :is="as"
      :class="computedClass"
      v-bind="omit(attrs, 'class')"
    >
      <slot :close="close" />
    </component>
  </HeadlessPopover>
</template>
