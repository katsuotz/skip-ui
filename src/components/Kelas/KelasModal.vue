<script setup lang="ts">
import {ref, watch} from "vue";
import {Form, Field} from "vee-validate";
import Dialog from "../../base-components/Headless/Dialog";
import Button from "../../base-components/Button";
import FormInput from "../../base-components/Form/FormInput.vue";
import FormLabel from "../../base-components/Form/FormLabel.vue";
import {useKelasStore} from "../../stores/modules/kelas";
import {Kelas} from "../../utils/interfaces/kelas";

interface KelasProps {
  modelValue: boolean;
}

interface KelasEmit {
  (e: "update:modelValue", value: boolean): void;

  (e: "success"): void;
}

const props = defineProps<KelasProps>();
const emit = defineEmits<KelasEmit>();

const kelas = useKelasStore()

const form = ref<Kelas>({
  id: 0,
  nama_kelas: '',
  tahun_ajar_id: 0,
  jurusan_id: 0,
  guru_id: 0,
})

watch(() => kelas.selectedKelas, (value) => {
  form.value = {
    id: value?.id || 0,
    nama_kelas: value?.nama_kelas || '',
    tahun_ajar_id: value?.tahun_ajar_id || 0,
    jurusan_id: value?.jurusan_id || 0,
    guru_id: value?.guru_id || 0,
  }
})

const showModal = ref(props.modelValue);

watch(props, () => {
  showModal.value = props.modelValue
})

watch(showModal, () => {
  emit("update:modelValue", showModal.value);
});

const handleSubmit = async () => {
  if (form.value.id)
    await kelas.updateKelas(form.value.id, form.value)
  else
    await kelas.createKelas(form.value)

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
          <p class="text-lg font-bold">
            Form Tahun Ajar
          </p>
          <div>
            <FormLabel for="tahun_ajar">
              Tahun Ajar
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.tahun_ajar"
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
              type="button"
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
