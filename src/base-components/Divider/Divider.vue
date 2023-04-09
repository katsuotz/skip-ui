<script setup lang="ts">
import { withDefaults } from "vue";

interface DividerProps {
  as?: string | object;
}

const { as } = withDefaults(defineProps<DividerProps>(), {
  as: "div",
});
</script>

<template>
  <component
    :is="as"
    class="w-full h-px bg-black/[0.08] relative"
  >
    <slot />
  </component>
</template>
