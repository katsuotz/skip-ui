<script setup lang="ts">
import {useKelasStore} from "../../stores/modules/kelas";
import {ref} from "vue";
import TomSelect from "../../base-components/TomSelect";
import {useJurusanStore} from "../../stores/modules/jurusan";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import {useSiswaStore} from "../../stores/modules/siswa";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import ReportSiswa from "../../components/Report/ReportSiswa.vue";
import debounce from "lodash-es/debounce";
import {Siswa} from "../../utils/interfaces/siswa";
import {Kelas} from "../../utils/interfaces/kelas";
import Button from "../../base-components/Button";
import {print} from '../../utils/helper'
import Lucide from "../../base-components/Lucide/Lucide.vue";

const kelas = useKelasStore()
const jurusan = useJurusanStore()
const tahunAjar = useTahunAjarStore()
const siswa = useSiswaStore()
const poinLog = usePoinLogStore()

const filter = ref({
  tahun_ajar_id: '',
  jurusan_id: '',
  kelas_id: '',
  nis: '',
})

siswa.siswa = []

const getTahunAjar = () => {
  tahunAjar.getTahunAjar({
    page: 1,
    per_page: -1,
  }).then(() => {
    filter.value.tahun_ajar_id = tahunAjar.activeTahunAjar?.id?.toString() || ''
  })
}

const getJurusan = () => {
  jurusan.getJurusan()
}

const kelasFilter = ref<Kelas[]>([])

const getKelas = () => {
  if (!filter.value.tahun_ajar_id || !filter.value.jurusan_id) return
  kelas.getKelas(parseInt(filter.value.tahun_ajar_id), parseInt(filter.value.jurusan_id))
    .then((res:any) => {
      kelasFilter.value = res
    })
}

getTahunAjar()
getJurusan()

const siswaSearch = ref<Siswa[]>([])

const handleSearchSiswa = debounce((search: string) => {
  const {kelas_id, jurusan_id, tahun_ajar_id} = filter.value

  siswa.searchSiswa({
    search,
    kelas_id,
    jurusan_id,
    tahun_ajar_id,
  }).then((res: any) => {
    siswaSearch.value = res.data
  })
}, 700)

const getData = () => {
  siswa.selectedSiswa = undefined
  if (filter.value.nis)
    poinLog.getPoinLogByNis(filter.value.nis)
}

siswa.selectedSiswa = undefined

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between hide-print">
    <h2 class="mr-auto text-lg font-medium">
      Personal
    </h2>
  </div>
  <div class="p-5 mt-5 intro-y box flex flex-col gap-4 hide-print">
    <div class="flex items-center flex-wrap gap-2">
      <div class="flex flex-wrap gap-2">
        <TomSelect
          v-model="filter.tahun_ajar_id"
          placeholder="Pilih Tahun Ajar"
          style="width: 200px"
          @update:modelValue="getKelas"
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
        <TomSelect
          v-model="filter.jurusan_id"
          placeholder="Pilih Jurusan"
          style="width: 200px"
          @update:modelValue="getKelas"
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
        <TomSelect
          v-model="filter.kelas_id"
          placeholder="Pilih Kelas"
          style="width: 200px"
        >
          <option value="">
            Pilih Kelas
          </option>
          <option
            v-for="(item, key) in kelasFilter"
            :key="key"
            :value="item.id"
          >
            {{ item.nama_kelas }}
          </option>
        </TomSelect>
        <TomSelect
          id="type"
          v-model="filter.nis"
          placeholder="Cari Siswa"
          style="width: 200px"
          @search="handleSearchSiswa"
          @update:modelValue="getData"
        >
          <option
            v-for="(item, key) in siswaSearch"
            :key="key"
            :value="item.nis"
          >
            {{ item.nis }} - {{ item.nama }}
          </option>
        </TomSelect>
      </div>

      <Button
        v-if="siswa.selectedSiswa"
        class="gap-2 hide-print ml-auto"
        variant="primary"
        @click="print"
      >
        <Lucide
          icon="Printer"
          class="w-4 h-4"
        />
        Print
      </Button>
    </div>
  </div>

  <div
    v-if="siswa.selectedSiswa"
    id="element-to-print"
    class="p-5 mt-5 intro-y box"
  >
    <ReportSiswa
      v-model="poinLog.poinLogWithKelas"
      :selected-siswa="siswa.selectedSiswa"
    />
  </div>
</template>
