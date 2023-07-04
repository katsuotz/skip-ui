<script setup lang="ts">
import {ref, watch} from "vue";
import {Form, Field} from "vee-validate";
import Dialog from "../../base-components/Headless/Dialog";
import Button from "../../base-components/Button";
import FormInput from "../../base-components/Form/FormInput.vue";
import FormLabel from "../../base-components/Form/FormLabel.vue";
import FormCheck from "../../base-components/Form/FormCheck";
import {useSiswaStore} from "../../stores/modules/siswa";
import {Siswa} from "../../utils/interfaces/siswa";
import DatePicker from 'vue-datepicker-next';
import {dateInputFormat, getUserPhoto} from "../../utils/helper";
import Lucide from "../../base-components/Lucide/Lucide.vue";
import {useFileStore} from "../../stores/modules/file";

interface SiswaProps {
  modelValue: boolean;
}

interface SiswaEmit {
  (e: "update:modelValue", value: boolean): void;

  (e: "success"): void;
}

const props = defineProps<SiswaProps>();
const emit = defineEmits<SiswaEmit>();

const siswa = useSiswaStore()

const form = ref<Siswa>({
  nis: '',
  nama: '',
  jenis_kelamin: '',
  tempat_lahir: '',
  tanggal_lahir: '',
})

watch(() => siswa.selectedSiswa, (value) => {
  form.value = {
    id: value?.id,
    nis: value?.nis || '',
    nama: value?.nama || '',
    jenis_kelamin: value?.jenis_kelamin || '',
    tempat_lahir: value?.tempat_lahir || '',
    tanggal_lahir: value?.tanggal_lahir ? new Date(value.tanggal_lahir) : '',
    foto: value?.foto,
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
    siswa.updateSiswa(form.value.id, payload).then(() => handleSuccess(actions))
  else
    siswa.createSiswa(payload).then(() => handleSuccess(actions))
}

const handleSuccess = (actions: any) => {
  actions.resetForm()
  showModal.value = false
  emit('success')
}

const file = useFileStore()
const fileInput: any = ref(null)

const openUploadFile = () => {
  if (fileInput.value) fileInput.value.click()
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target && target.files?.length) {
    file.uploadFoto(target.files[0]).then((res:any) => {
      form.value.foto = res.url
    })
  }
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
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          accept=".png,.jpg,.jpeg"
          @change="handleFileChange"
        >
        <div class="p-5 flex flex-col gap-5">
          <p class="text-lg font-bold">
            Form Siswa
          </p>
          <div class="flex justify-center">
            <div
              class="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit"
            >
              <img
                alt=""
                class="rounded-full object-cover object-center"
                :src="getUserPhoto(form.foto)"
              >
              <div
                class="absolute bottom-0 right-0 flex items-center justify-center p-2 rounded-full bg-light cursor-pointer shadow-md"
                @click="openUploadFile"
              >
                <Lucide
                  icon="Camera"
                  class="w-5 h-5 text-dark"
                />
              </div>
            </div>
          </div>
          <div>
            <FormLabel for="nis">
              NIS
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.nis"
              :validate-on-blur="false"
              name="NIS"
              :rules="{
                required: true,
              }"
            >
              <FormInput
                id="nis"
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
              </div>   <div
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
