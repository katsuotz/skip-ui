<script setup lang="ts">
import {ref, watch} from "vue";
import {Form, Field} from "vee-validate";
import Dialog from "../../base-components/Headless/Dialog";
import Button from "../../base-components/Button";
import FormInput from "../../base-components/Form/FormInput.vue";
import FormLabel from "../../base-components/Form/FormLabel.vue";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import {TahunAjar} from "../../utils/interfaces/tahun-ajar";

interface TahunAjarProps {
  modelValue: boolean;
}

interface TahunAjarEmit {
  (e: "update:modelValue", value: boolean): void;
  (e: "success"): void;
}

const props = defineProps<TahunAjarProps>();
const emit = defineEmits<TahunAjarEmit>();

const tahunAjar = useTahunAjarStore()

const tahunAjarForm = ref<TahunAjar>({
  id: 0,
  tahun_ajar: '',
})

watch(() => tahunAjar.selectedTahunAjar, (value) => {
  tahunAjarForm.value.id = value?.id || 0
  tahunAjarForm.value.tahun_ajar = value?.tahun_ajar || ''
})

const showModal = ref(props.modelValue);

watch(props, () => {
  showModal.value = props.modelValue
})

watch(showModal, () => {
  emit("update:modelValue", showModal.value);
});

const handleSubmit = async () => {
  if (tahunAjarForm.value.id)
    await tahunAjar.updateTahunAjar(tahunAjarForm.value.id, tahunAjarForm.value.tahun_ajar)
  else
    await tahunAjar.createTahunAjar(tahunAjarForm.value.tahun_ajar)

  showModal.value = false
  emit('success')
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
          <div>
            <FormLabel for="tahun_ajar">
              Tahun Ajar
            </FormLabel>
            <Field
                v-slot="{ field, errorMessage }"
                v-model="tahunAjarForm.tahun_ajar"
                :validate-on-blur="false"
                name="Tahun Ajar"
                :rules="{
                  required: true,
                }"
            >
              <FormInput
                  id="tahun_ajar"
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
                variant="outline-secondary"
                class="w-24 mr-1"
                @click.prevent="() => {
                  showModal = false
                }"
            >
              Batal
            </Button>
            <Button
                type="submit"
                variant="info"
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
