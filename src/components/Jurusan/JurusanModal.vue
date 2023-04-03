<script setup lang="ts">
import {ref, watch} from "vue";
import {Form, Field} from "vee-validate";
import Dialog from "../../base-components/Headless/Dialog";
import Button from "../../base-components/Button";
import FormInput from "../../base-components/Form/FormInput.vue";
import FormLabel from "../../base-components/Form/FormLabel.vue";
import {useJurusanStore} from "../../stores/modules/jurusan";
import {Jurusan} from "../../utils/interfaces/jurusan";

interface JurusanProps {
  modelValue: boolean;
}

interface JurusanEmit {
  (e: "update:modelValue", value: boolean): void;
  (e: "success"): void;
}

const props = defineProps<JurusanProps>();
const emit = defineEmits<JurusanEmit>();

const tahunAjar = useJurusanStore()

const tahunAjarForm = ref<Jurusan>({
  id: 0,
  nama_jurusan: '',
})

watch(() => tahunAjar.selectedJurusan, (value) => {
  tahunAjarForm.value.id = value?.id || 0
  tahunAjarForm.value.nama_jurusan = value?.nama_jurusan || ''
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
    await tahunAjar.updateJurusan(tahunAjarForm.value.id, tahunAjarForm.value.nama_jurusan)
  else
    await tahunAjar.createJurusan(tahunAjarForm.value.nama_jurusan)

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
          <div>
            <FormLabel for="nama_jurusan">
              Nama Jurusan
            </FormLabel>
            <Field
                v-slot="{ field, errorMessage }"
                v-model="tahunAjarForm.nama_jurusan"
                :validate-on-blur="false"
                name="Nama Jurusan"
                :rules="{
                  required: true,
                }"
            >
              <FormInput
                  id="nama_jurusan"
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
