<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import omit from "lodash-es/omit";
import { twMerge } from "tailwind-merge";
import { DialogTitle as HeadlessDialogTitle } from "@headlessui/vue";
import { useAttrs, computed } from "vue";

// eslint-disable-next-line no-undef
interface TitleProps extends ExtractProps<typeof HeadlessDialogTitle> {
  as?: string | object;
}

const { as } = withDefaults(defineProps<TitleProps>(), {
  as: "div",
});

const attrs = useAttrs();
const computedClass = computed(() =>
  twMerge([
    "flex items-center px-5 py-3 border-b border-slate-200/60 dark:border-darkmode-400",
    typeof attrs.class === "string" && attrs.class,
  ])
);
</script>

<template>
  <HeadlessDialogTitle as="template">
    <component
      :is="as"
      :class="computedClass"
      v-bind="omit(attrs, 'class')"
    >
      <slot />
    </component>
  </HeadlessDialogTitle>
</template>
