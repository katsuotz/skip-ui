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
import InputGroup from "../../base-components/Form/InputGroup";
import {tindakLanjutLabel} from "../../utils/helper";

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
  penanganan: '',
  tindak_lanjut: '',
})

const handleUpdateType = () => {
  form.value.penanganan = ''
  form.value.tindak_lanjut = ''
}

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

const handleSubmit = (values:any, actions:any) => {
  if (form.value.id)
    dataPoin.updateDataPoin(form.value).then(() => handleSuccess(actions))
  else
    dataPoin.createDataPoin(form.value).then(() => handleSuccess(actions))
}

const handleSuccess = (actions: any) => {
  actions.resetForm()
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
            Form Master Poin
          </p>
          <div>
            <FormLabel for="title">
              Nama
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.title"
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
              v-model="form.description"
              :validate-on-blur="false"
              name="Deskripsi"
              :rules="{
                required: true,
              }"
            >
              <FormTextarea
                id="description"
                v-model="form.description"
                :class="{ 'border-danger': errorMessage }"
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
                  v-model="form.type"
                  :class="{ 'border-danger': errorMessage }"
                  placeholder="Pilih Tipe"
                  v-bind="field"
                  @update:modelValue="handleUpdateType"
                >
                  <option value="">
                    Pilih Tipe
                  </option>
                  <option value="Penghargaan">
                    Penghargaan
                  </option>
                  <option value="Pelanggaran">
                    Pelanggaran
                  </option>
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
              <InputGroup>
                <InputGroup.Text
                  v-if="form.type"
                  :class="[
                    form.type === 'Pelanggaran' && 'bg-danger border-danger',
                    form.type === 'Penghargaan' && 'bg-success border-success',
                    'font-bold border-r-transparent w-10 text-center text-white'
                  ]"
                >
                  {{ form.type === 'Penghargaan' ? '+' : '-' }}
                </InputGroup.Text>
                <FormInput
                  id="poin"
                  :class="[
                    form.type === 'Pelanggaran' && 'text-danger',
                    form.type === 'Penghargaan' && 'text-success',
                    errorMessage && 'border-danger',
                    'font-bold',
                  ]"
                  type="number"
                  step="1"
                  v-bind="field"
                  :disabled="!form.type"
                  @wheel="//@ts-ignore
                    $event.target.blur()"
                />
              </InputGroup>
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
                  v-model="form.category"
                  :class="{ 'border-danger': errorMessage }"
                  placeholder="Pilih Kategori"
                  v-bind="field"
                >
                  <option value="">
                    Pilih Kategori
                  </option>
                  <template v-if="form.type === 'Penghargaan'">
                    <option value="Sekolah">
                      Sekolah
                    </option>
                    <option value="Kota">
                      Kota
                    </option>
                    <option value="Provinsi">
                      Provinsi
                    </option>
                    <option value="Nasional">
                      Nasional
                    </option>
                    <option value="Internasional">
                      Internasional
                    </option>
                  </template>
                  <template v-else-if="form.type === 'Pelanggaran'">
                    <option value="Ringan">
                      Ringan
                    </option>
                    <option value="Sedang">
                      Sedang
                    </option>
                    <option value="Berat">
                      Berat
                    </option>
                  </template>
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
          <template v-if="form.type">
            <div v-if="form.type === 'Pelanggaran'">
              <FormLabel for="penanganan">
                Penanganan (Opsional)
              </FormLabel>
              <Field
                v-slot="{ field, errorMessage }"
                v-model="form.penanganan"
                :validate-on-blur="false"
                name="Penanganan"
              >
                <FormTextarea
                  id="penanganan"
                  v-model="form.penanganan"
                  :class="{ 'border-danger': errorMessage }"
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
              <FormLabel for="tindak_lanjut">
                {{ tindakLanjutLabel(form.type) }} (Opsional)
              </FormLabel>
              <Field
                v-slot="{ field, errorMessage }"
                v-model="form.tindak_lanjut"
                :validate-on-blur="false"
                :name="tindakLanjutLabel(form.type)"
              >
                <FormTextarea
                  id="tindak_lanjut"
                  v-model="form.tindak_lanjut"
                  :class="{ 'border-danger': errorMessage }"
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
          </template>

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
