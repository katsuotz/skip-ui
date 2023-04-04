<script setup lang="ts">
import {ref, watch} from "vue";
import {Form, Field} from "vee-validate";
import Dialog from "../../base-components/Headless/Dialog";
import Button from "../../base-components/Button";
import FormInput from "../../base-components/Form/FormInput.vue";
import FormLabel from "../../base-components/Form/FormLabel.vue";
import {useDataPoinStore} from "../../stores/modules/data-poin";
import FormTextarea from "../../base-components/Form/FormTextarea.vue";
import {DataPoin} from "../../utils/interfaces/data-poin";
import TomSelect from "../../base-components/TomSelect";

interface TahunAjarProps {
  modelValue: boolean;
}

interface TahunAjarEmit {
  (e: "update:modelValue", value: boolean): void;

  (e: "success"): void;
}

const props = defineProps<TahunAjarProps>();
const emit = defineEmits<TahunAjarEmit>();

const dataPoin = useDataPoinStore()

const form = ref<DataPoin>({
  title: '',
  description: '',
  poin: undefined,
  type: '',
  category: '',
})

watch(() => dataPoin.selectedDataPoin, (value) => {
  form.value = {
    id: value?.id,
    title: value?.title || '',
    description: value?.description || '',
    poin: value?.poin,
    type: value?.type || '',
    category: value?.category || '',
  }
})

const showModal = ref(props.modelValue);

watch(props, () => {
  showModal.value = props.modelValue
})

watch(showModal, () => {
  emit("update:modelValue", showModal.value);
});

const handleSubmit = () => {
  if (form.value.id)
    dataPoin.updateDataPoin(form.value).then(handleSuccess)
  else
    dataPoin.createDataPoin(form.value).then(handleSuccess)
}

const handleSuccess = () => {
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
          <p class="text-lg font-bold">Form Data Poin</p>
          <div>
            <FormLabel for="title">
              Nama
            </FormLabel>
            <Field
                v-slot="{ field, errorMessage }"
                v-model.trim="form.title"
                :validate-on-blur="false"
                name="Nama"
                :rules="{
                  required: true,
                }"
            >
              <FormInput
                  id="title"
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
          <div>
            <FormLabel for="description">
              Deskripsi
            </FormLabel>
            <Field
                v-slot="{ field, errorMessage }"
                v-model.trim="form.description"
                :validate-on-blur="false"
                name="Deskripsi"
                :rules="{
                  required: true,
                }"
            >
              <FormTextarea
                  id="description"
                  :class="{ 'border-danger': errorMessage }"
                  v-model="form.description"
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
          <div>
            <FormLabel for="poin">
              Poin
            </FormLabel>
            <Field
                v-slot="{ field, errorMessage }"
                v-model.number="form.poin"
                :validate-on-blur="false"
                name="Poin"
                :rules="{
                  required: true,
                  integer: true,
                }"
            >
              <FormInput
                  id="poin"
                  :class="{ 'border-danger': errorMessage }"
                  type="number"
                  step="1"
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
          <div>
            <FormLabel for="type">
              Tipe
            </FormLabel>
            <Field
                v-slot="{ field, errorMessage }"
                v-model.number="form.type"
                :validate-on-blur="false"
                name="Tipe"
                :rules="{
                  required: true,
                }"
            >
              <div>
                <TomSelect
                    id="type"
                    :class="{ 'border-danger': errorMessage }"
                    v-model="form.type"
                    placeholder="Pilih Tipe"
                    v-bind="field"
                >
                  <option value="">Pilih Tipe</option>
                  <option value="Penghargaan">Penghargaan</option>
                  <option value="Pelanggaran">Pelanggaran</option>
                </TomSelect>
              </div>
              <div
                  v-show="errorMessage"
                  class="mt-2 text-danger"
              >
                {{ errorMessage }}
              </div>
            </Field>
          </div>
          <div>
            <FormLabel for="category">
              Kategori
            </FormLabel>
            <Field
                v-slot="{ field, errorMessage }"
                v-model.number="form.category"
                :validate-on-blur="false"
                name="Kategori"
                :rules="{
                  required: true,
                }"
            >
              <div>
                <TomSelect
                    id="category"
                    :class="{ 'border-danger': errorMessage }"
                    v-model="form.category"
                    placeholder="Pilih Kategori"
                    v-bind="field"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Ringan">Ringan</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Berat">Berat</option>
                </TomSelect>
              </div>
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
