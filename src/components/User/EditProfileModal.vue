<script setup lang="ts">
import {ref, watch} from "vue";
import {Form, Field} from "vee-validate";
import Dialog from "../../base-components/Headless/Dialog";
import Button from "../../base-components/Button";
import FormInput from "../../base-components/Form/FormInput.vue";
import FormLabel from "../../base-components/Form/FormLabel.vue";
import Lucide from "../../base-components/Lucide/Lucide.vue";
import {useAuthStore} from "../../stores/modules/auth";
import {UserResponse} from "../../utils/interfaces/user";
import {useFileStore} from "../../stores/modules/file";
import {dateInputFormat, getUserPhoto} from "../../utils/helper";
import DatePicker from "vue-datepicker-next";
import FormCheck from "../../base-components/Form/FormCheck";

interface TahunAjarProps {
  modelValue: boolean;
}

interface TahunAjarEmit {
  (e: "update:modelValue", value: boolean): void;

  (e: "success"): void;
}

const props = defineProps<TahunAjarProps>();
const emit = defineEmits<TahunAjarEmit>();

const auth = useAuthStore()

const form = ref<UserResponse>({
  nama: auth.user?.nama || '',
  username: auth.user?.username || '',
  role: auth.user?.role || '',
  jenis_kelamin: auth.user?.jenis_kelamin || '',
  tempat_lahir: auth.user?.tempat_lahir || '',
  tanggal_lahir: auth.user?.tanggal_lahir ? new Date(auth.user.tanggal_lahir) : '',
  foto: auth.user?.foto || '',
})

const showModal = ref(props.modelValue);

watch(props, () => {
  showModal.value = props.modelValue
})

watch(showModal, () => {
  emit("update:modelValue", showModal.value);
});


const handleSubmit = () => {
  let payload = {
    ...form.value,
    tanggal_lahir: dateInputFormat(form.value.tanggal_lahir)
  }

  auth.updateProfile(payload).then(() => {
    showModal.value = false
    emit('success')
  })
}

const file = useFileStore()
const fileInput: any = ref(null)

const openUploadFile = () => {
  if (fileInput.value) fileInput.value.click()
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target && target.files) {
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
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept=".png,.jpg,.jpeg"
        @change="handleFileChange"
      >
      <Form
        :validate-on-blur="false"
        @submit="handleSubmit"
      >
        <div class="p-5 flex flex-col gap-5">
          <div class="flex flex-col items-center">
            <div
              class="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit mb-4 mt-4"
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
            <p class="font-bold text-lg">
              {{ form.nama }}
            </p>
            <p class="text-slate-500 mt-0.5">
              {{ form.role }}
            </p>
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
                readonly
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
