<script setup lang="ts">
import {useKelasStore} from "../../stores/modules/kelas";
import {computed, ref} from "vue";
import TomSelect from "../../base-components/TomSelect";
import {useJurusanStore} from "../../stores/modules/jurusan";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import {useSiswaStore} from "../../stores/modules/siswa";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import {getUserPhoto} from "../../utils/helper";
import VueQrious from 'vue-qrious'
import Divider from "../../base-components/Divider";
import PoinLogTable from "../../base-components/PoinLog/PoinLogTable.vue";
import Lucide from "../../base-components/Lucide/Lucide.vue";

const showModal = ref(false)

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

const url = computed(() => document.location.origin + '/report/personal/12345')

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
    class="py-5 px-7 mt-5 intro-y box flex flex-col gap-4"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <img
          :src="getUserPhoto(siswa.selectedSiswa?.foto)"
          alt=""
          class="w-[86px] h-[86px] rounded-full object-cover object-center"
        >
        <div class="ml-4">
          <h3 class="text-xl font-bold">
            {{ siswa.selectedSiswa?.nama }}
          </h3>
          <p class="text-slate-500 font-medium">
            {{ siswa.selectedSiswa?.nis }}
          </p>
        </div>
      </div>
      <VueQrious
        :value="url"
      />
    </div>
    <Divider />
    <div class="flex flex-col gap-8">
      <div
        v-for="(item, key) in poinLog.poinLogWithKelas"
        :key="key"
      >
        <div class="mb-5 flex justify-between items-center">
          <div>
            <p class="text-lg font-bold text-slate-800">
              {{ item.kelas.nama_kelas }} - {{ item.kelas.tahun_ajar }}
            </p>
            <p class="text-slate-500 mt-0.5">
              Total Poin: <span class="font-bold text-success">305</span>
            </p>
          </div>
          <div class="flex items-center text-lg">
            <span class="mr-2 font-light">Sangat Baik</span>
            <Lucide
              icon="CheckCircle"
              class="w-10 h-10 text-success"
            />
          </div>
        </div>

        <PoinLogTable
          v-model="item.data"
          hide-pagination
          hide-action
          hide-guru
        />
      </div>
    </div>
  </div>
</template>
