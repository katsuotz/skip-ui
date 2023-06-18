<script setup lang="ts">
import Notification from "../../base-components/Notification";
import {NotificationElement} from "../../base-components/Notification";
import {useGlobalStore} from "../../stores/global";
import {computed, ComputedRef, nextTick, provide, ref, toRef, watch} from "vue";
import Lucide from "../../base-components/Lucide";
import {Icon} from "../../base-components/Lucide/Lucide.vue";

const global = useGlobalStore()

const notification = toRef(global, 'notification')

let successNotificationTimeout: number | ReturnType<typeof setTimeout>;

const notificationEl = ref<NotificationElement>();
const showNotification = () => {
  notificationEl.value?.showToast();

  successNotificationTimeout = setTimeout(() => {
    hideNotification()
  }, 3000)
};

const hideNotification = () => {
  global.notification.show = false
  notificationEl.value?.hideToast();
  clearTimeout(successNotificationTimeout)
  successNotificationTimeout = 0
};

provide("bind[notificationEl]", (el: NotificationElement) => {
  notificationEl.value = el;
});

watch(() => notification.value.show, (value, oldValue) => {
  if (value && successNotificationTimeout) {
    hideNotification()
  }

  nextTick(() => {
    if (value && value !== oldValue) showNotification()
  })
}, {
  deep: true,
})

const icon: ComputedRef<Icon | null> = computed((): Icon | null => {
  switch (notification.value.type) {
  case 'success':
    return 'CheckCircle'
  case 'danger':
    return 'XCircle'
  case 'warning':
    return 'AlertTriangle'
  case 'primary':
    return 'AlertCircle'
  default:
    return null
  }
});

</script>

<template>
  <Notification
    ref-key="notificationEl"
    class="flex items-center"
  >
    <Lucide
      v-if="icon"
      :icon="icon"
      :class="'text-' + notification.type"
    />
    <div class="ml-4 mr-4">
      <div class="font-medium">
        {{ global.notification.message }}
      </div>
      <div v-if="global.notification.description">
        {{ global.notification.description }}
      </div>
    </div>
  </Notification>
</template>
