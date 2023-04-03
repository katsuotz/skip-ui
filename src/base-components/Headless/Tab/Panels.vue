<script setup lang="ts">
import { TabPanels as HeadlessTabPanels } from "@headlessui/vue";

// eslint-disable-next-line no-undef
interface PanelsProps extends ExtractProps<typeof HeadlessTabPanels> {}

defineProps<PanelsProps>();
</script>

<template>
  <HeadlessTabPanels as="div">
    <slot />
  </HeadlessTabPanels>
</template>
