<script setup lang="ts">
import { setValue, init, updateValue } from "./tom-select";
import { TomSettings, RecursivePartial } from "tom-select/src/types";
import TomSelectPlugin from "tom-select";
import {
  withDefaults,
  computed,
  SelectHTMLAttributes,
  onMounted,
  inject,
  ref,
} from "vue";

export interface TomSelectElement extends HTMLSelectElement {
  TomSelect: TomSelectPlugin;
}

export interface TomSelectProps extends SelectHTMLAttributes {
  modelValue?: string | string[];
  options?: RecursivePartial<TomSettings>;
  refKey?: string;
  clearable?: boolean;
  disableOption?: boolean;
}

export interface TomSelectEmit {
  (e: "update:modelValue", value: string | string[]): void;
  (e: "optionAdd", value: string | number): void;
  (e: "search", value: string): void;
}

export type ProvideTomSelect = (el: TomSelectElement) => void;

const props = withDefaults(defineProps<TomSelectProps>(), {
  clearable: true,
});

const emit = defineEmits<TomSelectEmit>();

const tomSelectRef = ref<TomSelectElement>();

// Compute all default options
const computedOptions = computed(() => {
  let clear_button = props.clearable ? {clear_button: {}} : undefined

  let plugins = {
    dropdown_input: {},
    ...clear_button,
    ...props.options?.plugins,
  }

  let options: TomSelectProps["options"] = {
    allowEmptyOption: true,
    ...props.options,
    plugins,
  };

  if (Array.isArray(props.modelValue)) {
    options = {
      persist: false,
      create: true,
      onDelete: function (values: string[]) {
        return confirm(
          values.length > 1
            ? "Are you sure you want to remove these " +
                values.length +
                " items?"
            : 'Are you sure you want to remove "' + values[0] + '"?'
        );
      },
      ...options,
      plugins: {
        remove_button: {
          title: "Remove this item",
        },
        ...options.plugins,
      },
    };
  }

  return options;
});

const vSelectDirective = {
  mounted(el: TomSelectElement) {
    // Unique attribute
    el.setAttribute("data-id", "_" + Math.random().toString(36).substr(2, 9));

    // Clone the select element to prevent tom select remove the original element
    const clonedEl = el.cloneNode(true) as TomSelectElement;

    // Save initial classnames
    const classNames = el?.getAttribute("class");
    classNames && clonedEl.setAttribute("data-initial-class", classNames);

    // Hide original element
    el?.parentNode && el?.parentNode.appendChild(clonedEl);
    el.setAttribute("hidden", "true");

    // Initialize tom select
    setValue(clonedEl, props);
    init(el, clonedEl, props, computedOptions.value, emit);
    if (props.disableOption) clonedEl.TomSelect.disable()
  },
  updated(el: TomSelectElement) {
    const clonedEl = document.querySelectorAll(
      `[data-id='${el.getAttribute("data-id")}'][data-initial-class]`
    )[0] as TomSelectElement;
    const value = props.modelValue;
    if (props.disableOption) clonedEl.TomSelect.disable()
    else clonedEl.TomSelect.enable()
    updateValue(el, clonedEl, value || '', props, computedOptions.value, emit);
  },
};

const bindInstance = (el: TomSelectElement) => {
  if (props.refKey) {
    const bind = inject<ProvideTomSelect>(`bind[${props.refKey}]`);
    if (bind) {
      bind(el);
    }
  }
};

onMounted(() => {
  if (tomSelectRef.value) {
    bindInstance(tomSelectRef.value);
  }
});
</script>

<template>
  <select
    ref="tomSelectRef"
    v-select-directive
    :value="props.modelValue"
    class="tom-select"
    @change="
      (event) => {
        emit('update:modelValue', (event.target as HTMLSelectElement).value);
      }
    "
  >
    <slot />
  </select>
</template>
