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
import { ProvideDialog } from "./Dialog.vue";
import { inject, useAttrs, computed } from "vue";
import Lucide from "../../Lucide/Lucide.vue";

// eslint-disable-next-line no-undef
interface PanelProps extends ExtractProps<typeof HeadlessDialogPanel> {
  as?: string | object;
  background?: boolean;
  center?: boolean;
}

const { as, background, center } = withDefaults(defineProps<PanelProps>(), {
  as: "div",
  background: true,
  center: false,
});

const emit = defineEmits<{
  (e: "close", value: boolean): void;
}>();

const dialog = inject<ProvideDialog>("dialog");

const attrs = useAttrs();
const computedClass = computed(() =>
    twMerge([
      "mx-auto transition-transform w-[90%]",
      background === true && "bg-white rounded-md shadow-md dark:bg-darkmode-600",
      center === false && "relative",
      center === true && "fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2",
      dialog?.size == "md" && "sm:w-[460px]",
      dialog?.size == "sm" && "sm:w-[300px]",
      dialog?.size == "lg" && "sm:w-[600px]",
      dialog?.size == "xl" && "sm:w-[600px] lg:w-[900px]",
      dialog?.size == "fullscreen" && "w-11/12",
      dialog?.zoom.value && "scale-105",
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
      enter-from="opacity-0 -mt-16"
      enter-to="opacity-100 py-16"
      entered="opacity-100 py-16"
      leave="ease-in-out duration-[400ms]"
      leave-from="opacity-100 mt-16"
      leave-to="opacity-0 -mt-16"
      class="fixed inset-0 overflow-auto"
  >
    <HeadlessDialogPanel as="template">
      <component
          :is="as"
          :class="computedClass"
          v-bind="omit(attrs, 'class')"
      >
        <Lucide
            icon="X"
            class="absolute w-6 h-6 right-5 top-5 cursor-pointer"
            @click="emit('close', true)"
        />
        <slot />
      </component>
    </HeadlessDialogPanel>
  </TransitionChild>
</template>
