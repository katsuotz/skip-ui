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
  description: string;
  penanganan: string;
  type: string;
  siswa_kelas_id?: number;
  siswa: Siswa[];
  poin?: DataPoin;
  poin_id?: number;
  file: string;
}>({
  description: '',
  penanganan: '',
  type: '',
  file: '',
  siswa: [],
})

const handleResetForm = () => {
  form.value = {
    description: '',
    penanganan: '',
    type: '',
    file: '',
    siswa: [],
  }
  poinSearch.value = []
  siswaSearch.value = []
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
  const {description, penanganan, type, poin_id, file, siswa} = form.value

  if (!poin_id || !siswa.length) return

  const selectedPoin = form.value.poin

  if (selectedPoin) {
    let promises: any[] = []

    for (let i = 0; i < siswa.length; i++) {
      const payload: PoinSiswaRequest = {
        title: selectedPoin.title,
        description,
        penanganan,
        poin: selectedPoin.poin || 0,
        type,
        siswa_kelas_id: siswa[i].siswa_kelas_id || 0,
        data_poin_id: poin_id,
        file,
      }

      promises.push(poinSiswa.addPoinSiswa(payload))
    }

    Promise.all(promises).then(() => {
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
  <div class="flex items-center sm:mt-8 mt-6">
    <h2 class="mr-auto text-lg font-medium">
      Lapor Penghargaan / Pelanggaran
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
            v-model="form.siswa"
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
                multiple
                @search="handleSearchSiswa"
              >
                <template #selected-option="{nis, nama}">
                  <p>{{ nis }} - {{ nama }}</p>
                </template>
                <template #option="{nis, nama}">
                  <p>{{ nis }} - {{ nama }}</p>
                </template>
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

        <template v-if="form.siswa?.length">
          <div class="flex flex-wrap gap-5">
            <div
              v-for="(item, key) in form.siswa"
              :key="key"
              class="flex items-center"
            >
              <img
                :src="getUserPhoto(item.foto)"
                alt=""
                class="w-[64px] h-[64px] rounded-full object-cover object-center"
              >
              <div class="ml-4">
                <h3 class="text-xl font-bold">
                  {{ item.nama }}
                </h3>
                <p class="text-slate-500 font-medium">
                  {{ item.nis }}
                </p>
                <p class="text-slate-500 font-medium">
                  {{ item.nama_kelas }}
                </p>
              </div>
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
                Deskripsi / Latar Belakang
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
            <div v-if="form.type === 'Pelanggaran'">
              <FormLabel for="penanganan">
                Penanganan
              </FormLabel>
              <p
                v-if="form.poin?.penanganan"
                class="mb-2"
              >
                <span class="font-bold">Rekomendasi Penanganan</span>: {{ form.poin?.penanganan }}
              </p>
              <Field
                v-slot="{ field, errorMessage }"
                v-model="form.penanganan"
                name="Penanganan"
                :rules="{
                  required: form.type === 'Pelanggaran',
                }"
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
              <FormLabel for="file">
                Foto / Dokumen Bukti (Opsional)
              </FormLabel>
              <Field
                v-slot="{ field, errorMessage }"
                v-model="form.file"
                name="Foto / Dokumen Bukti"
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
