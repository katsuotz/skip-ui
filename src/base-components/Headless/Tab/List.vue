<script lang="ts">
export default {
  inheritAttrs: false,
};

type Variant = "tabs" | "pills" | "boxed-tabs" | "link-tabs";
</script>

<script setup lang="ts">
import omit from "lodash-es/omit";
import { provide, useAttrs, computed } from "vue";
import { twMerge } from "tailwind-merge";
import { TabList as HeadlessTabList } from "@headlessui/vue";

export type ProvideList = {
  variant?: Variant;
};

// eslint-disable-next-line no-undef
interface ListProps extends ExtractProps<typeof HeadlessTabList> {
  variant?: Variant;
}

const { variant } = withDefaults(defineProps<ListProps>(), {
  variant: "tabs",
});

const attrs = useAttrs();
const computedClass = computed(() =>
  twMerge([
    variant == "tabs" && "border-b border-slate-200 dark:border-darkmode-400",
    "flex",
    typeof attrs.class === "string" && attrs.class,
  ])
);

provide<ProvideList>("list", {
  variant: variant,
});
</script>

<template>
  <HeadlessTabList
    as="ul"
    :class="computedClass"
    v-bind="omit(attrs, 'class')"
  >
    <slot />
  </HeadlessTabList>
</template>
