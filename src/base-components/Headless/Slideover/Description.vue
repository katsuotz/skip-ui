<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import omit from "lodash-es/omit";
import { twMerge } from "tailwind-merge";
import { DialogDescription as HeadlessDialogDescription } from "@headlessui/vue";
import { useAttrs, computed } from "vue";

interface DescriptionProps
// eslint-disable-next-line no-undef
  extends ExtractProps<typeof HeadlessDialogDescription> {
  as?: string | object;
}

const { as } = withDefaults(defineProps<DescriptionProps>(), {
  as: "div",
});

const attrs = useAttrs();
const computedClass = computed(() =>
  twMerge([
    "p-5 overflow-y-auto flex-1",
    typeof attrs.class === "string" && attrs.class,
  ])
);
</script>

<template>
  <HeadlessDialogDescription as="template">
    <component
      :is="as"
      :class="computedClass"
      v-bind="omit(attrs, 'class')"
    >
      <slot />
    </component>
  </HeadlessDialogDescription>
</template>
