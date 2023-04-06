<script setup lang="ts">
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {ref} from "vue";
import {countPaginationNumber} from "../../utils/helper";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import {useSiswaStore} from "../../stores/modules/siswa";
import {useKelasStore} from "../../stores/modules/kelas";
import {useRoute, useRouter} from "vue-router";
import FormCheck from "../../base-components/Form/FormCheck";

const siswa = useSiswaStore()
const kelas = useKelasStore()

const route = useRoute()
const kelas_id:string = route.params.kelas_id.toString()

const getData = (resetPage: boolean = false) => {
  if (resetPage) siswa.updateCurrentPage(1)

  siswa.getSiswa({
    page: siswa.pagination.page,
    per_page: siswa.pagination.per_page,
    search: search.value,
    kelas_id: "0",
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

const selectedSiswa = ref<number[]>([])

const router = useRouter()

const handleAddSiswaKelas = () => {
  kelas.addSiswaKelas(kelas_id, selectedSiswa.value).then(() => {
    router.push('/kelas/' + kelas_id + '/siswa')
  })
}

getData(true)

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
    <MyTable
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
              Status
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
                  :value="item.id"
                  :disabled="!!item.siswa_kelas?.length"
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
              <span
                :class="[
                  item.siswa_kelas?.length && 'text-success',
                  !item.siswa_kelas?.length && 'text-danger',
                  'font-bold',
                ]"
              >
                <Lucide
                  v-if="item.siswa_kelas?.length"
                  icon="Check"
                  class="stroke-2"
                />
                {{ item.siswa_kelas?.length ? '' : 'Belum ada kelas' }}
              </span>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody v-else>
          <Table.Tr>
            <Table.Td
              colspan="99"
              class="text-center"
            >
              Tidak ada Data
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </MyTable>
  </div>
</template>
