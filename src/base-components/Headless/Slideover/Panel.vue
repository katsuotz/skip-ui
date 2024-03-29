<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import {
  DialogPanel as HeadlessDialogPanel,
  TransitionChild,
} from "@headlessui/vue";
import omit from "lodash-es/omit";
import { twMerge } from "tailwind-merge";
import { ProvideSlideover } from "./Slideover.vue";
import { inject, useAttrs, computed } from "vue";

// eslint-disable-next-line no-undef
interface PanelProps extends ExtractProps<typeof HeadlessDialogPanel> {
  as?: string | object;
}

const { as } = withDefaults(defineProps<PanelProps>(), {
  as: "div",
});

const slideover = inject<ProvideSlideover>("slideover");

const attrs = useAttrs();
const computedClass = computed(() =>
  twMerge([
    "w-[90%] ml-auto h-screen flex flex-col bg-white relative shadow-md transition-transform dark:bg-darkmode-600",
    slideover?.size == "md" && "sm:w-[460px]",
    slideover?.size == "sm" && "sm:w-[300px]",
    slideover?.size == "lg" && "sm:w-[600px]",
    slideover?.size == "xl" && "sm:w-[600px] lg:w-[900px]",
    slideover?.zoom.value && "scale-105",
    typeof attrs.class === "string" && attrs.class,
  ])
);
</script>

<template>
  <TransitionChild
    as="div"
    enter="ease-in-out duration-500"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="ease-in-out duration-[400ms]"
    leave-from="opacity-100"
    leave-to="opacity-0"
    class="fixed inset-0 bg-black/60"
    aria-hidden="true"
  />
  <TransitionChild
    as="div"
    enter="ease-in-out duration-500"
    enter-from="opacity-0 -mr-[100%]"
    enter-to="opacity-100 mr-0"
    leave="ease-in-out duration-[400ms]"
    leave-from="opacity-100 mr-0"
    leave-to="opacity-0 -mr-[100%]"
    class="fixed inset-y-0 right-0"
  >
    <HeadlessDialogPanel as="template">
      <component
        :is="as"
        :class="computedClass"
        v-bind="omit(attrs, 'class')"
      >
        <slot />
      </component>
    </HeadlessDialogPanel>
  </TransitionChild>
</template>
