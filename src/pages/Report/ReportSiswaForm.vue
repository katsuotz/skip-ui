<script setup lang="ts">
import {useKelasStore} from "../../stores/modules/kelas";
import {ref} from "vue";
import TomSelect from "../../base-components/TomSelect";
import {useJurusanStore} from "../../stores/modules/jurusan";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import {useSiswaStore} from "../../stores/modules/siswa";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import ReportSiswa from "../../components/Report/ReportSiswa.vue";

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
  })
}

const getJurusan = () => {
  jurusan.getJurusan()
}

const getKelas = () => {
  if (!filter.value.tahun_ajar_id || !filter.value.jurusan_id) return
  kelas.getKelas(parseInt(filter.value.tahun_ajar_id), parseInt(filter.value.jurusan_id))
}

getTahunAjar()
getJurusan()

const handleSearchSiswa = (search: string) => {
  const {kelas_id, jurusan_id, tahun_ajar_id} = filter.value

  siswa.getSiswa({
    page: 1,
    per_page: 10,
    search,
    kelas_id,
    jurusan_id,
    tahun_ajar_id,
  })
}

const getData = () => {
  poinLog.getPoinLogByNis(filter.value.nis)
}

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      Personal
    </h2>
  </div>
  <div class="p-5 mt-5 intro-y box flex flex-col gap-4">
    <div class="flex flex-wrap gap-2">
      <TomSelect
        id="tahun_ajar_id"
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
        id="jurusan_id"
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
        id="kelas_id"
        v-model="filter.kelas_id"
        placeholder="Pilih Kelas"
        style="width: 200px"
      >
        <option value="">
          Pilih Kelas
        </option>
        <option
          v-for="(item, key) in kelas.kelas"
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
        <option value="">
          Cari Siswa
        </option>
        <template v-if="siswa.siswa?.length">
          <option
            v-for="(item, key) in siswa.siswa"
            :key="key"
            :value="item.nis"
          >
            {{ item.nis }} - {{ item.nama }}
          </option>
        </template>
      </TomSelect>
    </div>
  </div>

  <div
    v-if="siswa.selectedSiswa"
    class="py-5 px-7 mt-5 intro-y box"
  >
    <ReportSiswa />
  </div>
</template>
