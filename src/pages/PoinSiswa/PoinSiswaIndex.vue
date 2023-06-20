<script setup lang="ts">
import {useKelasStore} from "../../stores/modules/kelas";
import {ref} from "vue";
import TomSelect from "../../base-components/TomSelect";
import {useJurusanStore} from "../../stores/modules/jurusan";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import SiswaKelasTable from "../../components/Siswa/SiswaKelasTable.vue";
import {Kelas} from "../../utils/interfaces/kelas";

const kelas = useKelasStore()
const jurusan = useJurusanStore()
const tahunAjar = useTahunAjarStore()

const filter = ref({
  tahun_ajar_id: '',
  jurusan_id: '',
  kelas_id: '',
})

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

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      Poin Siswa
    </h2>
  </div>
  <div class="p-5 mt-5 intro-y box flex flex-col gap-4">
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
    </div>

    <SiswaKelasTable
      v-if="filter.kelas_id"
      :kelas-id="filter.kelas_id"
      hide-delete
    />
  </div>
</template>
