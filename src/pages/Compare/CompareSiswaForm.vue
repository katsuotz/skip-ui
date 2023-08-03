<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import TomSelect from "../../base-components/TomSelect";
import {useJurusanStore} from "../../stores/modules/jurusan";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import {Siswa} from "../../utils/interfaces/siswa";
import debounce from "lodash-es/debounce";
import {useSiswaStore} from "../../stores/modules/siswa";
import {Kelas} from "../../utils/interfaces/kelas";
import {useKelasStore} from "../../stores/modules/kelas";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import {PoinLogWithKelas} from "../../utils/interfaces/poin-log";
import ReportSiswa from "../../components/Report/ReportSiswa.vue";
import {useSideMenuStore} from "../../stores/side-menu";

const jurusan = useJurusanStore()
const tahunAjar = useTahunAjarStore()
const kelas = useKelasStore()
const siswa = useSiswaStore()
const poinLog = usePoinLogStore()

const filter = ref<{
  tahun_ajar_id: string;
  jurusan_id: string;
  kelas_id: string;
  nis: string;
  siswa?: Siswa | null,
}[]>([
  {
    tahun_ajar_id: '',
    jurusan_id: '',
    kelas_id: '',
    nis: '',
    siswa: null,
  },
  {
    tahun_ajar_id: '',
    jurusan_id: '',
    kelas_id: '',
    nis: '',
    siswa: null,
  },
])

const kelasFilter = ref<Kelas[][]>([
  [],
  [],
])

const siswaSearch = ref<Siswa[][]>([
  [],
  [],
])

const getKelas = (n: number) => {
  if (!filter.value[n].tahun_ajar_id || !filter.value[n].jurusan_id) return
  kelas.getKelas(parseInt(filter.value[n].tahun_ajar_id), parseInt(filter.value[n].jurusan_id))
    .then((res:any) => {
      kelasFilter.value[n] = res
    })
}


const handleSearchSiswa = debounce((search: string, n: number) => {
  const {jurusan_id, tahun_ajar_id} = filter.value[n]

  siswa.searchSiswa({
    search,
    jurusan_id,
    tahun_ajar_id,
  }).then((res: any) => {
    siswaSearch.value[n] = res.data
  })
}, 700)

const data = ref<PoinLogWithKelas[][]>([
  [],
  [],
])

const getData = (value: string, key: number) => {
  data.value[key] = []
  filter.value[key].siswa = null

  if (filter.value[key].nis)
    poinLog.getPoinLogByNis(filter.value[key].nis).then((res: any) => {
      data.value[key] = res.log
      filter.value[key].siswa = res.siswa
    })
}

const hasData = computed(() => data.value.filter(e => e?.length).length)

const sideMenuStore = useSideMenuStore()

onMounted(() => {
  sideMenuStore.expand = false
})

</script>
<template>
  <div class="p-5 intro-y box">
    <div class="grid grid-cols-12 gap-5">
      <div
        v-for="n in 2"
        :key="n - 1"
        class="col-span-12"
      >
        <p class="mb-2">
          Siswa {{ n }}
        </p>
        <div class="flex flex-wrap gap-2">
          <TomSelect
            v-model="filter[n - 1].tahun_ajar_id"
            placeholder="Pilih Tahun Ajar"
            style="width: 200px"
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
            v-model="filter[n - 1].jurusan_id"
            placeholder="Pilih Jurusan"
            style="width: 200px"
            @update:modelValue="getKelas(n - 1)"
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
            v-model="filter[n - 1].kelas_id"
            placeholder="Pilih Kelas"
            style="width: 200px"
          >
            <option value="">
              Pilih Kelas
            </option>
            <option
              v-for="(item, key) in kelasFilter[n - 1]"
              :key="key"
              :value="item.id"
            >
              {{ item.nama_kelas }}
            </option>
          </TomSelect>
          <TomSelect
            id="type"
            v-model="filter[n - 1].nis"
            placeholder="Cari Siswa"
            style="width: 200px"
            @search="value => handleSearchSiswa(value, n - 1)"
            @update:modelValue="value => getData(value.toString(), n - 1)"
          >
            <option
              v-for="(item, key) in siswaSearch[n - 1]"
              :key="key"
              :value="item.nis"
            >
              {{ item.nis }} - {{ item.nama }}
            </option>
          </TomSelect>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="hasData"
    class="p-5 mt-5 intro-y box"
  >
    <div class="grid grid-cols-12 gap-5">
      <template
        v-for="(item, key) in data"
        :key="key"
      >
        <div
          v-if="item.length && filter[key].siswa"
          class="col-span-12 xl:col-span-6"
        >
          <ReportSiswa
            v-model="data[key]"
            :selected-siswa="filter[key].siswa"
            hide-action
            hide-qr
          />
        </div>
      </template>
    </div>
  </div>
</template>
