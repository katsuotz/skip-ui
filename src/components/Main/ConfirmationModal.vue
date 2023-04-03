<script setup lang="ts">
import {useGlobalStore} from "../../stores/global";
import {toRef} from "vue";
import Dialog from "../../base-components/Headless/Dialog";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";

const global = useGlobalStore()

const modal = toRef(global, 'modal')

const handleConfirmModal = () => {
  if (modal.value?.callback) modal.value.callback()
  global.hideModal()
}

/*
just for reference later. do not delete
const deleteButtonRef = ref<any>(null);

const setRef = (v: any) => {
  deleteButtonRef.value = v
}

onMounted(() => {
  console.log(deleteButtonRef.value._value)
})
 */

</script>

<template>
  <Dialog
    :open="modal.show"
    @close="() => {modal.show = false}"
  >
    <!--  do not delete  -->
    <!--    :initialFocus="deleteButtonRef"-->
    <Dialog.Panel
      @close="() => {modal.show = false}"
    >
      <div class="p-5 text-center">
        <Lucide
          v-if="modal.icon"
          :class="[
            'w-16 h-16 mx-auto my-3',
            'text-' + modal.type,
          ]"
          :icon="modal.icon"
        />
        <div
          v-if="modal.title"
          class="text-lg font-bold"
        >
          {{ modal.title }}
        </div>
        <div
          v-if="modal.description"
          class="mt-2 text-slate-500 font-medium"
          v-html="modal.description"
        />
      </div>
      <div class="px-5 pb-8 text-center">
        <Button
          v-if="modal.buttonCancel"
          type="button"
          variant="outline-secondary"
          class="w-24 mr-1"
          @click="() => {modal.show = false}"
        >
          {{ modal.buttonCancelText }}
        </Button>
        <Button
          v-if="modal.buttonConfirmation"
          type="button"
          :variant="modal.type"
          class="w-24"
          @click="handleConfirmModal"
        >
          <!--    do not delete      -->
          <!--          :ref="setRef"-->
          {{ modal.buttonConfirmationText }}
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>
