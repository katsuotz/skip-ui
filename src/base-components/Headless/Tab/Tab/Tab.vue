<script setup lang="ts">
import { inject } from "vue";
import { Tab as HeadlessTab } from "@headlessui/vue";
import Provider from "./Provider.vue";
import { ProvideList } from "../List.vue";

// eslint-disable-next-line no-undef
interface TabProps extends ExtractProps<typeof HeadlessTab> {
  fullWidth?: boolean;
}

const { fullWidth } = withDefaults(defineProps<TabProps>(), {
  fullWidth: true,
});

const list = inject<ProvideList>("list");
</script>

<template>
  <HeadlessTab
    v-slot="{ selected }"
    as="template"
  >
    <li
      :class="[
        'focus-visible:outline-none',
        { 'flex-1': fullWidth },
        { '-mb-px': list && list.variant == 'tabs' },
      ]"
    >
      <Provider :selected="selected">
        <slot :selected="selected" />
      </Provider>
    </li>
  </HeadlessTab>
</template>
