<script setup lang="ts">
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {computed, ref} from "vue";
import {countPaginationNumber} from "../../utils/helper";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import {useSiswaStore} from "../../stores/modules/siswa";
import {useKelasStore} from "../../stores/modules/kelas";
import {useRoute, useRouter} from "vue-router";
import FormCheck from "../../base-components/Form/FormCheck";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import {useJurusanStore} from "../../stores/modules/jurusan";
import TomSelect from "../../base-components/TomSelect/TomSelect.vue";
import PoinValue from "../Poin/PoinValue.vue";

const siswa = useSiswaStore()
const kelas = useKelasStore()
const tahunAjar = useTahunAjarStore()
const jurusan = useJurusanStore()

const filter = ref({
  tahun_ajar_id: '',
  jurusan_id: '',
  kelas_id: '',
})

const disableKelas = ref(true)

const getKelas = () => {
  disableKelas.value = !filter.value.tahun_ajar_id
  kelas.kelas = []
  if (!filter.value.tahun_ajar_id || !filter.value.jurusan_id) return
  kelas.getKelas(parseInt(filter.value.tahun_ajar_id), parseInt(filter.value.jurusan_id))
}

const route = useRoute()
const kelas_id: string = route.params.kelas_id.toString()

const getData = (resetPage: boolean = false) => {
  if (resetPage) siswa.updateCurrentPage(1)

  siswa.getSiswa({
    page: siswa.pagination.page,
    per_page: siswa.pagination.per_page,
    search: search.value,
    kelas_id: filter.value.kelas_id,
  })
}

const search = ref('')

const handleUpdatePage = (value: number) => {
  siswa.updateCurrentPage(value)
  getData()
}

const handleUpdatePerPage = (value: number) => {
  siswa.updatePerPage(value)
  getData(true)
}

const handleSearch = (value: string = '') => {
  search.value = value
  getData(true)
}

const resetData = () => {
  siswa.siswa = []
  siswa.updateCurrentPage(1)
}

resetData()

const selectedSiswa = ref<number[]>([])

const router = useRouter()

const handleAddSiswaKelas = () => {
  kelas.siswaNaikKelas(kelas_id, selectedSiswa.value).then(() => {
    router.push('/kelas/' + kelas_id + '/siswa')
  })
}

const tahunAjarOptions = computed(() => tahunAjar.tahunAjar.filter(e => e.id !== kelas.selectedKelas?.tahun_ajar_id))

</script>
<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <Button
        class="gap-2"
        variant="success"
        :disabled="selectedSiswa.length === 0"
        @click="handleAddSiswaKelas"
      >
        <Lucide
          class="w-5 h-5"
          icon="Check"
        />
        Tambah Siswa Terpilih
      </Button>
    </div>

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
          v-for="(item, key) in tahunAjarOptions"
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
        :disable-option="disableKelas"
        @update:modelValue="() => getData(true)"
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
    </div>

    <MyTable
      v-if="filter.tahun_ajar_id && filter.jurusan_id && filter.kelas_id"
      :current-page="siswa.pagination.page"
      :page-count="siswa.pagination.total_page"
      :per-page="siswa.pagination.per_page"
      :search="search"
      @updatePerPage="handleUpdatePerPage"
      @updatePage="handleUpdatePage"
      @updateSearch="handleSearch"
    >
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th width="10">
              #
            </Table.Th>
            <Table.Th>
              NIS
            </Table.Th>
            <Table.Th>
              Nama
            </Table.Th>
            <Table.Th>
              Poin
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody
          v-if="siswa.siswa?.length"
          :data="siswa.siswa"
        >
          <Table.Tr
            v-for="(item, key) in siswa.siswa"
            :key="key"
          >
            <Table.Td>
              <FormCheck>
                <FormCheck.Input
                  v-model="selectedSiswa"
                  type="checkbox"
                  :value="item.siswa_kelas_id"
                />
                <span class="ml-2">
                  {{ countPaginationNumber(siswa.pagination, key) }}
                </span>
              </FormCheck>
            </Table.Td>
            <Table.Td>
              {{ item.nis }}
            </Table.Td>
            <Table.Td>
              {{ item.nama }}
            </Table.Td>
            <Table.Td>
              <PoinValue v-model="item.poin" />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
        <Table.Empty v-else />
      </Table>
    </MyTable>
  </div>
</template>
