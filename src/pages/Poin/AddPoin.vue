<script setup lang="ts">
import {Field, Form} from "vee-validate";
import Button from "../../base-components/Button";
import FormLabel from "../../base-components/Form/FormLabel.vue";
import FormTextarea from "../../base-components/Form/FormTextarea.vue";
import {ref} from "vue";
import FormCheck from "../../base-components/Form/FormCheck";
import {useSiswaStore} from "../../stores/modules/siswa";
import {useDataPoinStore} from "../../stores/modules/data-poin";
import {usePoinSiswaStore} from "../../stores/modules/poin-siswa";
import {PoinSiswaRequest} from "../../utils/interfaces/poin-siswa";
import {useGlobalStore} from "../../stores/global";
import {Siswa} from "../../utils/interfaces/siswa";
import debounce from "lodash-es/debounce";
import {DataPoin} from "../../utils/interfaces/data-poin";
import {getUserPhoto} from "../../utils/helper";
import VueSelect from 'vue-select'
import Lucide from "../../base-components/Lucide/Lucide.vue";
import FileUpload from "../../components/Upload/FileUpload.vue";

const siswa = useSiswaStore()
const dataPoin = useDataPoinStore()
const poinSiswa = usePoinSiswaStore()
const global = useGlobalStore()

const siswaSearch = ref<Siswa[]>([])
const poinSearch = ref<DataPoin[]>([])

const form = ref<{
  description: string,
  type: string,
  siswa_kelas_id?: number,
  siswa?: Siswa,
  poin?: DataPoin,
  poin_id?: number,
  file: string,
}>({
  description: '',
  type: '',
  file: '',
})

const handleResetForm = () => {
  form.value = {
    description: '',
    type: '',
    file: '',
  }
}

const handleSearchSiswa = debounce((search: string, loading: any) => {
  if (!search) return
  loading(true)
  siswa.searchSiswa({
    search,
    tahun_ajar_active: true,
  }).then((res: any) => {
    siswaSearch.value = res.data
  }).finally(() => {
    loading(false)
  })
}, 1000)

const handleSelectSiswa = () => {
  form.value.siswa_kelas_id = form.value.siswa?.siswa_kelas_id
}

const handleSelectPoin = () => {
  form.value.poin_id = form.value.poin?.id
}

const handleSearchPoin = debounce((search: string, loading: any) => {
  if (!search) return
  loading(true)
  dataPoin.searchDataPoin({
    search,
    type: form.value.type,
  }).then((res: any) => {
    poinSearch.value = res.data
  }).finally(() => {
    loading(false)
  })
}, 700)

const handleSubmit = (values:any, actions:any) => {
  const {description, type, siswa_kelas_id, poin_id, file} = form.value

  if (!poin_id || !siswa_kelas_id) return

  const selectedPoin = form.value.poin

  if (selectedPoin) {
    const payload: PoinSiswaRequest = {
      title: selectedPoin.title,
      description,
      poin: selectedPoin.poin || 0,
      type,
      siswa_kelas_id,
      file,
    }

    poinSiswa.addPoinSiswa(payload).then(() => {
      actions.resetForm()
      handleResetForm()
      global.showModal({
        type: 'success',
        title: 'Berhasil melakukan input poin',
        icon: 'CheckCircleIcon',
        buttonCancel: false,
      })
    })
  }
}

</script>
<template>
  <div class="flex items-center mt-8">
    <h2 class="mr-auto text-lg font-medium">
      Tambah Penghargaan / Pelanggaran
    </h2>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="p-5 mt-5 box">
    <Form
      @submit="handleSubmit"
    >
      <div class="flex flex-col gap-5">
        <div>
          <FormLabel for="siswa_kelas_id">
            Siswa
          </FormLabel>
          <Field
            v-slot="{ errorMessage }"
            v-model="form.siswa_kelas_id"
            name="Siswa"
            :rules="{
              required: true,
            }"
          >
            <div>
              <VueSelect
                v-model="form.siswa"
                :options="siswaSearch"
                label="nama"
                placeholder="Cari Siswa"
                @search="handleSearchSiswa"
                @update:modelValue="handleSelectSiswa"
              >
                <template #open-indicator="{ attributes }">
                  <span v-bind="attributes">
                    <Lucide icon="ChevronDown" />
                  </span>
                </template>
              </VueSelect>
            </div>
            <div
              v-show="errorMessage"
              class="mt-2 text-danger"
            >
              {{ errorMessage }}
            </div>
          </Field>
        </div>

        <template v-if="form.siswa_kelas_id && form.siswa">
          <div class="flex items-center">
            <img
              :src="getUserPhoto(form.siswa.foto)"
              alt=""
              class="w-[64px] h-[64px] rounded-full object-cover object-center"
            >
            <div class="ml-4">
              <h3 class="text-xl font-bold">
                {{ form.siswa?.nama }}
              </h3>
              <p class="text-slate-500 font-medium">
                {{ form.siswa?.nis }}
              </p>
            </div>
          </div>

          <div>
            <Field
              v-slot="{ field, errorMessage }"
              v-model="form.type"
              name="Tipe"
              :rules="{
                required: true,
              }"
            >
              <div class="flex gap-2">
                <FormCheck>
                  <FormCheck.Input
                    id="type-penghargaan"
                    v-bind="field"
                    v-model="form.type"
                    type="radio"
                    value="Penghargaan"
                  />
                  <FormCheck.Label for="type-penghargaan">
                    Penghargaan
                  </FormCheck.Label>
                </FormCheck>
                <FormCheck>
                  <FormCheck.Input
                    id="type-pelanggaran"
                    v-bind="field"
                    v-model="form.type"
                    type="radio"
                    value="Pelanggaran"
                  />
                  <FormCheck.Label for="type-pelanggaran">
                    Pelanggaran
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
          <template v-if="form.type">
            <div>
              <FormLabel for="poin_id">
                Poin
              </FormLabel>
              <Field
                v-slot="{ errorMessage }"
                v-model="form.poin_id"
                name="Poin"
                :rules="{
                  required: true,
                }"
              >
                <div>
                  <VueSelect
                    v-model="form.poin"
                    :options="poinSearch"
                    label="title"
                    placeholder="Cari Poin"
                    @search="handleSearchPoin"
                    @update:modelValue="handleSelectPoin"
                  >
                    <template #open-indicator="{ attributes }">
                      <span v-bind="attributes">
                        <Lucide icon="ChevronDown" />
                      </span>
                    </template>

                    <template #option="{ title, category }">
                      <span>
                        {{ title }} -
                        <span
                          :class="[
                            'px-2 py-1 text-xs text-white rounded-full',
                            category === 'Ringan' && 'bg-success/90',
                            category === 'Sedang' && 'bg-warning/90',
                            category === 'Berat' && 'bg-danger/90',
                          ]"
                        >{{ category }}</span>
                      </span>
                    </template>
                  </VueSelect>
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
              <FormLabel for="description">
                Deskripsi
              </FormLabel>
              <Field
                v-slot="{ field, errorMessage }"
                v-model="form.description"
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
              <FormLabel for="file">
                Foto / Dokumen Bukti
              </FormLabel>
              <Field
                v-slot="{ field, errorMessage }"
                v-model="form.file"
                name="Foto / Dokumen Bukti"
                rules="required"
              >
                <div class="flex flex-col h-full">
                  <FileUpload
                    v-model="form.file"
                    show-uploaded-file
                    file-name="file"
                    v-bind="field"
                  />
                  <span
                    v-show="errorMessage"
                    class="mt-2 text-danger"
                  >{{ errorMessage }}</span>
                </div>
              </Field>
            </div>
          </template>
        </template>
        <div class="text-right">
          <RouterLink
            v-slot="{href, navigate}"
            to="/"
          >
            <Button
              as="a"
              :href="href"
              variant="outline-secondary"
              class="w-24 mr-1"
              @click="navigate"
            >
              Batal
            </Button>
          </RouterLink>
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
  </div>
  <!-- END: Page Layout -->
</template>
