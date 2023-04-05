<script setup lang="ts">
import { TabGroup as HeadlessTabGroup } from "@headlessui/vue";

// eslint-disable-next-line no-undef
interface GroupProps extends ExtractProps<typeof HeadlessTabGroup> {}

defineProps<GroupProps>();
</script>

<template>
  <HeadlessTabGroup as="div">
    <slot />
  </HeadlessTabGroup>
</template>
