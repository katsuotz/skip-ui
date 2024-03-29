<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import omit from "lodash-es/omit";
import { twMerge } from "tailwind-merge";
import { computed, InputHTMLAttributes, useAttrs } from "vue";
import FormCheck from "../FormCheck";

interface InputProps extends InputHTMLAttributes {
  modelValue?: InputHTMLAttributes["value"];
  type: "checkbox";
}

interface InputEmit {
  (e: "update:modelValue", value: string): void;
}

const props = defineProps<InputProps>();

const attrs = useAttrs();

const computedClass = computed(() =>
  twMerge([
    // Default
    "w-[38px] h-[24px] p-px rounded-full relative",
    "before:w-[20px] before:h-[20px] before:shadow-[1px_1px_3px_rgba(0,0,0,0.25)] before:transition-[margin-left] before:duration-200 before:ease-in-out before:absolute before:inset-y-0 before:my-auto before:rounded-full before:dark:bg-darkmode-600",

    // On checked
    "checked:bg-primary checked:border-primary checked:bg-none",
    "before:checked:ml-[14px] before:checked:bg-white",

    typeof attrs.class === "string" && attrs.class,
  ])
);

const emit = defineEmits<InputEmit>();

const localValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
  },
});
</script>

<template>
  <FormCheck.Input
    v-bind="omit(attrs, 'class')"
    v-model="localValue"
    :type="props.type"
    :class="computedClass"
  />
</template>
