<script setup lang="ts">
import {Field, Form} from "vee-validate";
import Button from "../../base-components/Button";
import TomSelect from "../../base-components/TomSelect";
import FormLabel from "../../base-components/Form/FormLabel.vue";
import FormTextarea from "../../base-components/Form/FormTextarea.vue";
import {ref} from "vue";
import FormCheck from "../../base-components/Form/FormCheck";
import {useSiswaStore} from "../../stores/modules/siswa";
import {useDataPoinStore} from "../../stores/modules/data-poin";
import {usePoinSiswaStore} from "../../stores/modules/poin-siswa";
import {PoinSiswaRequest} from "../../utils/interfaces/poin-siswa";
import {useGlobalStore} from "../../stores/global";

const siswa = useSiswaStore()
const dataPoin = useDataPoinStore()
const poinSiswa = usePoinSiswaStore()
const global = useGlobalStore()

const form = ref({
  description: '',
  type: "Penghargaan",
  siswa_kelas_id: '',
  poin_id: '',
})

const handleResetForm = () => {
  form.value = {
    description: '',
    type: "Penghargaan",
    siswa_kelas_id: '',
    poin_id: '',
  }
}

const handleSearchSiswa = (search:string) => {
  siswa.getSiswa({
    page: 1,
    per_page: 10,
    search,
    tahun_ajar_active: true,
  })
}

const handleSearchPoin = (search:string) => {
  dataPoin.getDataPoin({
    page: 1,
    per_page: 10,
    search,
    type: form.value.type,
  })
}

const handleSubmit = (values:any, actions:any) => {
  const {description, type, siswa_kelas_id, poin_id} = form.value

  if (!poin_id || !siswa_kelas_id) return

  const selectedPoin = dataPoin.dataPoin.find(e => e.id === parseInt(poin_id))

  if (selectedPoin) {
    const payload: PoinSiswaRequest = {
      title: selectedPoin.title,
      description,
      poin: selectedPoin.poin || 0,
      type,
      siswa_kelas_id: parseInt(siswa_kelas_id),
    }

    poinSiswa.addPoinSiswa(payload).then(() => {
      actions.resetForm()
      handleResetForm()
      global.showModal({
        type: 'success',
        title: 'Berhasil melakukan input poin',
        icon: 'CheckCircleIcon',
        buttonCancel:false,
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
        <div>
          <FormLabel for="siswa_kelas_id">
            Siswa
          </FormLabel>
          <Field
            v-slot="{ field, errorMessage }"
            v-model="form.siswa_kelas_id"
            name="Siswa"
            :rules="{
              required: true,
            }"
          >
            <div>
              <TomSelect
                id="type"
                v-model="form.siswa_kelas_id"
                :class="{ 'border-danger': errorMessage }"
                placeholder="Cari Siswa"
                v-bind="field"
                @search="handleSearchSiswa"
              >
                <option value="">
                  Cari Siswa
                </option>
                <template v-if="siswa.siswa?.length">
                  <option
                    v-for="(item, key) in siswa.siswa"
                    :key="key"
                    :value="item.siswa_kelas_id"
                  >
                    {{ item.nis }} - {{ item.nama }}
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
          <div
            v-if="form.siswa_kelas_id"
            class="text-right mt-2"
          >
            <span class="cursor-pointer text-primary">Lihat Profil Siswa</span>
          </div>
        </div>
        <div>
          <FormLabel for="poin_id">
            Poin
          </FormLabel>
          <Field
            v-slot="{ field, errorMessage }"
            v-model="form.poin_id"
            name="Poin"
            :rules="{
              required: true,
            }"
          >
            <div>
              <TomSelect
                id="type"
                v-model="form.poin_id"
                :class="{ 'border-danger': errorMessage }"
                placeholder="Cari Nama Poin"
                v-bind="field"
                @search="handleSearchPoin"
              >
                <option value="">
                  Cari Nama Poin
                </option>
                <template v-if="dataPoin.dataPoin?.length">
                  <option
                    v-for="(item, key) in dataPoin.dataPoin"
                    :key="key"
                    :value="item.id"
                  >
                    {{ item.title }} - {{ item.category }}
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
