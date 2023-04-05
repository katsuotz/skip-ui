import {
  TomSelectProps,
  TomSelectElement,
  TomSelectEmit,
} from "./TomSelect.vue";
import {TomSettings, RecursivePartial} from "tom-select/src/types";
import TomSelect from "tom-select";
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ClearButton from "tom-select/src/plugins/clear_button";
import debounce from "lodash-es/debounce";
import isEqual from "lodash-es/isEqual";

const setValue = (el: TomSelectElement, props: TomSelectProps) => {
  if (props?.modelValue?.length) {
    if (Array.isArray(props.modelValue)) {
      for (const value of props.modelValue) {
        const selectedOption = Array.from(el).find(
          (option) =>
            option instanceof HTMLOptionElement && option.value == value
        );

        if (
          selectedOption !== undefined &&
          selectedOption instanceof HTMLOptionElement
        ) {
          selectedOption.selected = true;
        }
      }
    } else {
      el.value = props?.modelValue || '';
    }
  }
};

const init = (
  originalEl: TomSelectElement,
  clonedEl: TomSelectElement,
  props: TomSelectProps,
  computedOptions: RecursivePartial<TomSettings>,
  emit: TomSelectEmit
) => {
  // On option add
  if (Array.isArray(props.modelValue)) {
    computedOptions = {
      onOptionAdd: function (value: string | number) {
        // Add new option
        const newOption = document.createElement("option");
        newOption.value = value.toString();
        newOption.text = value.toString();
        originalEl.add(newOption);

        // Emit option add
        emit("optionAdd", value);
      },
      ...computedOptions,
    };
  }

  clonedEl.TomSelect = new TomSelect(clonedEl, computedOptions);

  // On change
  clonedEl.TomSelect.on("change", debounce(function (selectedItems: string[] | string) {
    if (!props.clearable && !clonedEl.TomSelect.getValue()) {
      const value = props.modelValue || Object.values(clonedEl.TomSelect.options)[0]?.value || ''
      clonedEl.TomSelect.destroy()
      clonedEl.value = value
      emit("update:modelValue", value);
      return init(originalEl, clonedEl, props, computedOptions, emit)
    }
    emit(
      "update:modelValue",
      Array.isArray(selectedItems) ? [...selectedItems] : selectedItems,
    );
  }, 0));

  // On type
  clonedEl.TomSelect.on("type", debounce(function (value: string) {
    emit("search", value)
  }, 500));

};

const getOptions = (
  options: HTMLCollection | undefined,
  tempOptions: Element[] = []
) => {
  if (options) {
    Array.from(options).forEach(function (optionEl) {
      if (optionEl instanceof HTMLOptGroupElement) {
        getOptions(optionEl.children, tempOptions);
      } else {
        tempOptions.push(optionEl);
      }
    });
  }

  return tempOptions;
};

const updateValue = (
  originalEl: TomSelectElement,
  clonedEl: TomSelectElement,
  value: string | string[],
  props: TomSelectProps,
  computedOptions: RecursivePartial<TomSettings>,
  emit: TomSelectEmit
) => {
  // Remove old options
  for (const [, option] of Object.entries(
    clonedEl.TomSelect.options
  )) {
    if (
      !getOptions(originalEl.children).filter((optionEl) => {
        return (
          optionEl instanceof HTMLOptionElement &&
          optionEl.value === option.value
        );
      }).length
    ) {
      clonedEl.TomSelect.removeOption(option.value);
    }
  }

  // Update classnames
  const initialClassNames = clonedEl
    .getAttribute("data-initial-class")
    ?.split(" ");
  clonedEl.setAttribute(
    "class",
    [
      ...Array.from(originalEl.classList),
      ...Array.from(clonedEl.classList).filter(
        (className) => initialClassNames?.indexOf(className) == -1
      ),
    ].join(" ")
  );
  clonedEl.TomSelect.wrapper.setAttribute(
    "class",
    [
      ...Array.from(originalEl.classList),
      ...Array.from(clonedEl.TomSelect.wrapper.classList).filter(
        (className) => initialClassNames?.indexOf(className) == -1
      ),
    ].join(" ")
  );
  clonedEl.setAttribute(
    "data-initial-class",
    Array.from(originalEl.classList).join(" ")
  );

  // Add new options
  const options = originalEl.children;
  if (options) {
    Array.from(options).forEach(function (optionEl) {
      clonedEl.TomSelect.addOption({
        text: optionEl.textContent,
        value: optionEl.getAttribute("value"),
      });
    });
  }

  // Refresh options
  clonedEl.TomSelect.refreshOptions(false);

  // Update value
  if (
    (!Array.isArray(value) && value !== clonedEl.TomSelect.getValue()) ||
    (Array.isArray(value) && !isEqual(value, clonedEl.TomSelect.getValue()))
  ) {
    clonedEl.TomSelect.destroy();
    if (originalEl.innerHTML) {
      clonedEl.innerHTML = originalEl.innerHTML;
    }
    setValue(clonedEl, props);
    init(originalEl, clonedEl, props, computedOptions, emit);
  }
};

export {setValue, init, updateValue};
