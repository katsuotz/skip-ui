<script setup lang="ts">
import {defineAsyncComponent, ref} from "vue";

const Loading = defineAsyncComponent(() => import("./components/Main/Loading.vue"))
const ConfirmationModal = defineAsyncComponent(() => import("./components/Main/ConfirmationModal.vue"))
const NotificationOverlay = defineAsyncComponent(() => import("./components/Main/NotificationOverlay.vue"))
</script>

<template>
  <Loading />
  <ConfirmationModal />
  <NotificationOverlay />
  <RouterView />
</template>
