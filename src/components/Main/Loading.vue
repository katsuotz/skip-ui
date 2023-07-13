<script setup lang="ts">
import LoadingIcon from "../../base-components/LoadingIcon";
import {useGlobalStore} from "../../stores/global";

const global = useGlobalStore()
</script>

<template>
  <div
    v-if="global.loading"
    :class="[
      'fixed inset-0 bg-black/60 flex justify-center items-center transition ease-in',
    ]"
    style="z-index: 1000;"
  >
    <LoadingIcon
      icon="oval"
      class="w-12 h-12"
      color="#2a4953"
    />
  </div>
</template>
