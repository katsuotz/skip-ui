<script setup lang="ts">
import {ref, watch} from "vue";
import {Form, Field} from "vee-validate";
import Dialog from "../../base-components/Headless/Dialog";
import Button from "../../base-components/Button";
import FormInput from "../../base-components/Form/FormInput.vue";
import FormLabel from "../../base-components/Form/FormLabel.vue";
import {useKelasStore} from "../../stores/modules/kelas";
import {Kelas, KelasRequest} from "../../utils/interfaces/kelas";
import TomSelect from "../../base-components/TomSelect";
import {usePegawaiStore} from "../../stores/modules/pegawai";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import {useJurusanStore} from "../../stores/modules/jurusan";
import debounce from "lodash-es/debounce";
import {Pegawai} from "../../utils/interfaces/pegawai";

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
const pegawai = usePegawaiStore()
const tahunAjar = useTahunAjarStore()
const jurusan = useJurusanStore()

const form = ref<KelasRequest>({
  id: 0,
  nama_kelas: '',
  tahun_ajar_id: '',
  jurusan_id: '',
  pegawai_id: '',
})

watch(() => kelas.selectedKelas, (value) => {
  if (value?.pegawai_id) {
    pegawai.pegawai = [{
      id: value.pegawai_id,
      nama: value.nama,
      nip: '',
      tipe_pegawai: '',
    }]
  }

  form.value = {
    id: value?.id || 0,
    nama_kelas: value?.nama_kelas || '',
    tahun_ajar_id: value?.tahun_ajar_id.toString() || '',
    jurusan_id: value?.jurusan_id.toString() || '',
    pegawai_id: value?.pegawai_id.toString() || '',
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
  const payload: Kelas = {
    id: form.value?.id,
    nama_kelas: form.value.nama_kelas,
    tahun_ajar_id: parseInt(form.value.tahun_ajar_id),
    jurusan_id: parseInt(form.value.jurusan_id),
    pegawai_id: parseInt(form.value.pegawai_id),
  }

  if (form.value.id)
    kelas.updateKelas(form.value.id, payload).then(() => handleSuccess(actions))
  else
    kelas.createKelas(payload).then(() => handleSuccess(actions))
}

const handleSuccess = (actions: any) => {
  actions.resetForm()
  showModal.value = false
  emit('success')
}

const pegawaFilter= ref<Pegawai[]>([])

const handleSearchPegawai = debounce((search: string) => {
  pegawai.searchPegawai({
    search,
  }).then((res:any) => {
    pegawaFilter.value = res.data
  })
}, 700)

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
            Form Kelas
          </p>
          <div>
            <FormLabel for="nama_kelas">
              Nama Kelas
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.nama_kelas"
              :validate-on-blur="false"
              name="Nama Kelas"
              :rules="{
                required: true,
              }"
            >
              <FormInput
                id="nama_kelas"
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
            <FormLabel for="tahun_ajar_id">
              Tahun Ajar
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.tahun_ajar_id"
              :validate-on-blur="false"
              name="Tahun Ajar"
              :rules="{
                required: true,
              }"
            >
              <div>
                <TomSelect
                  id="tahun_ajar_id"
                  v-model="form.tahun_ajar_id"
                  :class="{ 'border-danger': errorMessage }"
                  placeholder="Pilih Tahun Ajar"
                  v-bind="field"
                >
                  <option value="">
                    Pilih Tahun Ajar
                  </option>
                  <option
                    v-for="(item, key) in tahunAjar.tahunAjar"
                    :key="key"
                    :value="item.id"
                  >
                    {{ item.tahun_ajar }}
                    <template v-if="item.is_active">
                      (Aktif)
                    </template>
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
            <FormLabel for="jurusan_id">
              Jurusan
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.jurusan_id"
              :validate-on-blur="false"
              name="Jurusan"
              :rules="{
                required: true,
              }"
            >
              <div>
                <TomSelect
                  id="jurusan_id"
                  v-model="form.jurusan_id"
                  :class="{ 'border-danger': errorMessage }"
                  placeholder="Pilih Jurusan"
                  v-bind="field"
                >
                  <option value="">
                    Pilih Jurusan
                  </option>
                  <option
                    v-for="(item, key) in jurusan.jurusan"
                    :key="key"
                    :value="item.id"
                  >
                    {{ item.nama_jurusan }}
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
            <FormLabel for="pegawai_id">
              Wali Kelas
            </FormLabel>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.pegawai_id"
              :validate-on-blur="false"
              name="Wali Kelas"
              :rules="{
                required: true,
              }"
            >
              <div>
                <TomSelect
                  id="pegawai_id"
                  v-model="form.pegawai_id"
                  :class="{ 'border-danger': errorMessage }"
                  placeholder="Cari Guru"
                  v-bind="field"
                  @search="handleSearchPegawai"
                >
                  <option value="">
                    Cari Guru
                  </option>
                  <option
                    v-for="(item, key) in pegawaFilter"
                    :key="key"
                    :value="item.id"
                  >
                    {{ item.nama }}
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
