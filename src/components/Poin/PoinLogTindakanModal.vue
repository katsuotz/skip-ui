<script setup lang="ts">
import {ref, watch} from "vue";
import {Form, Field} from "vee-validate";
import Dialog from "../../base-components/Headless/Dialog";
import Button from "../../base-components/Button";
import FormInput from "../../base-components/Form/FormInput.vue";
import FormLabel from "../../base-components/Form/FormLabel.vue";
import {usePoinLogStore} from "../../stores/modules/poin-log";

interface PoinLogProps {
  modelValue: boolean;
}

interface PoinLogEmit {
  (e: "update:modelValue", value: boolean): void;
  (e: "success"): void;
}

const props = defineProps<PoinLogProps>();
const emit = defineEmits<PoinLogEmit>();

const poinLog = usePoinLogStore()

const form = ref<{
  id: number;
  tindak_lanjut: string;
}>({
  id: 0,
  tindak_lanjut: '',
})

watch(() => poinLog.selectedPoinLog, (value) => {
  form.value.id = value?.id || 0
  form.value.tindak_lanjut = value?.tindak_lanjut || ''
})

const showModal = ref(props.modelValue);

watch(props, () => {
  showModal.value = props.modelValue
})

watch(showModal, () => {
  emit("update:modelValue", showModal.value);
});

const handleSubmit = (values: any, actions: any) => {
  if (form.value?.id)
    poinLog.updatePoinLog(form.value.id, form.value?.tindak_lanjut || '').then(() => handleSuccess(actions))
}

const handleSuccess = (actions: any) => {
  actions.resetForm()
  showModal.value = false
  emit("success")
}
</script>

<template>
  <Dialog
    :open="showModal"
    static-backdrop
    @close="() => {showModal = false}"
  >
    <Dialog.Panel
      @close="() => {showModal = false}"
    >
      <Form
        :validate-on-blur="false"
        @submit="handleSubmit"
      >
        <div class="p-5 flex flex-col gap-5">
          <p class="text-lg font-bold">
            Form Tindak Lanjut
          </p>
          <div>
            <FormLabel for="tindak_lanjut">
              Tindak Lanjut
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.tindak_lanjut"
              :validate-on-blur="false"
              name="Tindak Lanjut"
              :rules="{
                required: true,
              }"
            >
              <FormInput
                id="tindak_lanjut"
                :class="{ 'border-danger': errorMessage }"
                type="text"
                v-bind="field"
              />
              <div
                v-show="errorMessage"
                class="mt-2 text-danger"
              >
                {{ errorMessage }}
              </div>
            </Field>
          </div>
          <div class="text-right">
            <Button
              type="button"
              variant="outline-secondary"
              class="w-24 mr-1"
              @click="() => {
                showModal = false
              }"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              class="w-24"
            >
              Simpan
            </Button>
          </div>
        </div>
      </Form>
    </Dialog.Panel>
  </Dialog>
</template>
