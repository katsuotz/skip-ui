<script setup lang="ts">
import {useKelasStore} from "../../stores/modules/kelas";
import {computed, ref} from "vue";
import TomSelect from "../../base-components/TomSelect";
import {useJurusanStore} from "../../stores/modules/jurusan";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import SiswaKelasTable from "../../components/Siswa/SiswaKelasTable.vue";
import {KelasResponse} from "../../utils/interfaces/kelas";
import Divider from "../../base-components/Divider";
import cloneDeep from "lodash-es/cloneDeep";
import {print} from "../../utils/helper";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide/Lucide.vue";
import PoinValue from "../../components/Poin/PoinValue.vue";
import {useSiswaStore} from "../../stores/modules/siswa";

const kelas = useKelasStore()
const jurusan = useJurusanStore()
const tahunAjar = useTahunAjarStore()
const siswa = useSiswaStore()

const filter = ref({
  tahun_ajar_id: '',
  jurusan_id: '',
  kelas_id: '',
})

const selectedKelas = ref<KelasResponse>()
const selectedTahunAjar = computed(() => tahunAjar.tahunAjar.find(e=> e.id === parseInt(filter.value.tahun_ajar_id)))

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

const kelasFilter = ref<KelasResponse[]>([])

const getKelas = () => {
  if (!filter.value.tahun_ajar_id || !filter.value.jurusan_id) return
  kelas.getKelas(parseInt(filter.value.tahun_ajar_id), parseInt(filter.value.jurusan_id))
    .then((res:any) => {
      kelasFilter.value = res
    })
}

getTahunAjar()
getJurusan()

const handleUpdateSelectedKelas = () => {
  selectedKelas.value = cloneDeep(kelasFilter.value.find(e => e.id === parseInt(filter.value.kelas_id)))
}

const avgPoin = computed(() => siswa.siswa?.reduce((a,b) => {
  return a + (b?.poin || 0) / (siswa.siswa?.length || 0)
}, 0))

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between hide-print">
    <h2 class="mr-auto text-lg font-medium">
      Rekap
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
          @update:modelValue="handleUpdateSelectedKelas"
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

      <Button
        v-if="selectedKelas"
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
    v-if="selectedKelas"
    id="element-to-print"
    class="p-5 mt-5 intro-y box"
  >
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold">
            {{ selectedKelas.nama_kelas }}
            <template v-if="selectedTahunAjar">
              - {{ selectedTahunAjar.tahun_ajar }}
            </template>
          </h3>
          <p class="text-slate-500 font-medium">
            Wali Kelas: {{ selectedKelas.nama }}
          </p>
        </div>

        <div class="mr-2 ml-auto flex items-center">
          <span class="font-bold text-lg text-slate-600 mr-4">Rata - Rata Poin:</span>
          <PoinValue
            v-if="siswa.siswa?.length"
            v-model="avgPoin"
            class="text-3xl"
          />
        </div>
      </div>
      <Divider />
      <SiswaKelasTable
        :kelas-id="filter.kelas_id"
        show-summary
        hide-pagination
        hide-delete
      />
    </div>
  </div>
</template>
