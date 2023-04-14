<script setup lang="ts">
import {ref, watch} from "vue";
import {Form, Field} from "vee-validate";
import Dialog from "../../base-components/Headless/Dialog";
import Button from "../../base-components/Button";
import FormInput from "../../base-components/Form/FormInput.vue";
import FormLabel from "../../base-components/Form/FormLabel.vue";
import FormCheck from "../../base-components/Form/FormCheck";
import {useGuruStore} from "../../stores/modules/guru";
import {Guru, GuruRequest} from "../../utils/interfaces/guru";
import DatePicker from 'vue-datepicker-next';
import {dateInputFormat} from "../../utils/helper";
import TomSelect from "../../base-components/TomSelect";

interface GuruProps {
  modelValue: boolean;
}

interface GuruEmit {
  (e: "update:modelValue", value: boolean): void;

  (e: "success"): void;
}

const props = defineProps<GuruProps>();
const emit = defineEmits<GuruEmit>();

const guru = useGuruStore()

const form = ref<GuruRequest>({
  nip: '',
  tipe_guru: '',
  nama: '',
  jenis_kelamin: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  username: '',
  password: '',
})

watch(() => guru.selectedGuru, (value) => {
  form.value = {
    id: value?.id,
    nip: value?.nip || '',
    tipe_guru: value?.tipe_guru || '',
    nama: value?.nama || '',
    jenis_kelamin: value?.jenis_kelamin || '',
    tempat_lahir: value?.tempat_lahir || '',
    tanggal_lahir: value?.tanggal_lahir ? new Date(value.tanggal_lahir) : '',
  }
})

const showModal = ref(props.modelValue);

watch(props, () => {
  showModal.value = props.modelValue
})

watch(showModal, () => {
  emit("update:modelValue", showModal.value);
});

const handleSubmit = (values: any, actions: any) => {
  let payload = {
    ...form.value,
    tanggal_lahir: dateInputFormat(form.value.tanggal_lahir)
  }

  if (form.value.id)
    guru.updateGuru(form.value.id, payload).then(() => handleSuccess(actions))
  else
    guru.createGuru(payload).then(() => handleSuccess(actions))
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
            Form Guru
          </p>
          <div>
            <FormLabel for="nip">
              NIP
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.nip"
              :validate-on-blur="false"
              name="NIP"
              :rules="{
                required: true,
              }"
            >
              <FormInput
                id="nip"
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
            <FormLabel for="nama">
              Nama
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.nama"
              :validate-on-blur="false"
              name="Nama"
              :rules="{
                required: true,
              }"
            >
              <FormInput
                id="nama"
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
            <FormLabel for="tanggal_lahir">
              Tanggal Lahir
            </FormLabel>
            <Field
              v-slot="{ errorMessage }"
              v-model="form.tanggal_lahir"
              :validate-on-blur="false"
              name="Tanggal Lahir"
              :rules="{
                required: true,
              }"
            >
              <div>
                <DatePicker
                  id="tanggal_lahir"
                  v-model:value="form.tanggal_lahir"
                  default-panel="year"
                  :class="{
                    'border-danger': errorMessage
                  }"
                />
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
            <FormLabel for="tempat_lahir">
              Tempat Lahir
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.tempat_lahir"
              :validate-on-blur="false"
              name="Tempat Lahir"
              :rules="{
                required: true,
              }"
            >
              <FormInput
                id="tempat_lahir"
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
            <FormLabel for="jenis_kelamin">
              Jenis Kelamin
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.jenis_kelamin"
              :validate-on-blur="false"
              name="Jenis Kelamin"
              :rules="{
                required: true,
              }"
            >
              <div class="flex flex-row flex-wrap gap-2">
                <FormCheck>
                  <FormCheck.Input
                    id="jenis_kelamin-l"
                    v-bind="field"
                    v-model="form.jenis_kelamin"
                    type="radio"
                    value="L"
                  />
                  <FormCheck.Label for="jenis_kelamin-l">
                    Laki - Laki
                  </FormCheck.Label>
                </FormCheck>
                <FormCheck>
                  <FormCheck.Input
                    id="jenis_kelamin-p"
                    v-bind="field"
                    v-model="form.jenis_kelamin"
                    type="radio"
                    value="P"
                  />
                  <FormCheck.Label for="jenis_kelamin-p">
                    Perempuan
                  </FormCheck.Label>
                </FormCheck>
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
            <FormLabel for="tipe_guru">
              Tipe Guru
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.tipe_guru"
              :validate-on-blur="false"
              name="Tipe Guru"
              :rules="{
                required: true,
              }"
            >
              <div>
                <TomSelect
                  id="tipe_guru"
                  v-model="form.tipe_guru"
                  :class="{ 'border-danger': errorMessage }"
                  placeholder="Pilih Tipe Guru"
                  v-bind="field"
                >
                  <option value="">
                    Pilih Tipe Guru
                  </option>
                  <option value="Guru">
                    Guru
                  </option>
                  <option value="Guru BK">
                    Guru BK
                  </option>
                  <option value="Staff ICT">
                    Staff ICT
                  </option>
                  <option value="Tata Usaha">
                    Tata Usaha
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
            <FormLabel for="username">
              Username
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.username"
              :validate-on-blur="false"
              name="Username"
              :rules="{
                required: true,
              }"
            >
              <FormInput
                id="username"
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
            <FormLabel for="password">
              Password
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.password"
              :validate-on-blur="false"
              name="Password"
              :rules="{
                required: true,
                min: 6,
              }"
            >
              <FormInput
                id="password"
                :class="{ 'border-danger': errorMessage }"
                type="password"
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
