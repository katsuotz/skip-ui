import {defineStore} from "pinia";
import {Icon} from "../base-components/Lucide/Lucide.vue";

import {Variant} from "../utils/colors";

interface Modal {
  show?: boolean;
  type?: Variant;
  title?: string;
  description?: string;
  buttonConfirmation?: boolean;
  buttonConfirmationText?: string;
  buttonCancel?: boolean;
  buttonCancelText?: string;
  icon?: Icon;
  callback?: Function;
}

interface Notification {
  message?: string;
  type?: Variant;
  show: boolean;
}

export interface LoadingState {
  loading: boolean;
  modal: Modal;
  notification: Notification;
}

export const useGlobalStore = defineStore("global", {
  state: (): LoadingState => ({
    loading: false,
    modal: {
      show: false,
      type: 'primary',
    },
    notification: {
      show: false,
      type: 'success',
    },
  }),
  actions: {
    setNotification(value?: string, type?: Variant) {
      if (value !== this.notification.message)
        this.notification.show = false

      setTimeout(() => {
        if (value) {
          this.notification.message = value
          this.notification.type = type
          this.notification.show = true
        }
      })
    },
    showModal(
      {
        type = 'success',
        title = 'Konfirmasi',
        description = '',
        buttonConfirmation = true,
        buttonConfirmationText = 'OK',
        buttonCancel = true,
        buttonCancelText = 'Batal',
        icon,
        callback,
      }: Modal
    ) {
      this.modal = {
        show: true,
        type,
        title,
        description,
        buttonConfirmation,
        buttonConfirmationText,
        buttonCancel,
        buttonCancelText,
        icon,
        callback,
      }
    },
    hideModal() {
      this.modal.show = false
    },
  },
});
