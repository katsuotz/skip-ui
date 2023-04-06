<script setup lang="ts">
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {ref} from "vue";
import {countPaginationNumber} from "../../utils/helper";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import {Siswa} from "../../utils/interfaces/siswa";
import {useGlobalStore} from "../../stores/global";
import {useSiswaStore} from "../../stores/modules/siswa";
import {useKelasStore} from "../../stores/modules/kelas";
import {useRoute} from "vue-router";
import FormCheck from "../../base-components/Form/FormCheck";

const global = useGlobalStore()
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
    kelas_id,
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

const onLoaded = () => {
  kelas.getKelasByID(kelas_id).then(() => {
    getData(true)
  })
}

onLoaded()

const selectedSiswa = ref<number[]>([])

const deleteSelectedSiswa = () => {
  global.showModal({
    type: 'danger',
    title: 'Konfirmasi',
    description: `Yakin untuk menghapus <span class="text-danger">${selectedSiswa.value.length} Siswa</span> Terpilih?`,
    icon: 'XCircle',
    buttonConfirmationText: 'Hapus',
    callback: () => handleDeleteSiswaKelas(selectedSiswa.value),
  })
}

const deleteSiswa = (item: Siswa) => {
  global.showModal({
    type: 'danger',
    title: 'Konfirmasi',
    description: `Yakin untuk menghapus Siswa <span class="text-danger">${item.nama}</span>?`,
    icon: 'XCircle',
    buttonConfirmationText: 'Hapus',
    callback: () => handleDeleteSiswaKelas([item.id || 0]),
  })
}

const handleDeleteSiswaKelas = async (siswa_id: number[]): Promise<void> => {
  await kelas.deleteSiswaKelas(kelas_id, siswa_id)
  await getData()
}

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      Siswa - {{ kelas.selectedKelas?.nama_kelas }}
    </h2>
    <RouterLink
      v-slot="{ navigate, href }"
      :to="`/kelas/${kelas_id}/siswa/add`"
    >
      <Button
        as="a"
        class="gap-2"
        variant="primary"
        :href="href"
        @click="navigate"
      >
        <Lucide icon="Plus" />
        Tambah Data
      </Button>
    </RouterLink>
  </div>
  <div class="p-5 mt-5 intro-y box flex flex-col gap-4">
    <div class="flex justify-end">
      <Button
        class="gap-2"
        variant="danger"
        :disabled="selectedSiswa.length === 0"
        @click="deleteSelectedSiswa"
      >
        <Lucide
          class="w-5 h-5"
          icon="Trash2"
        />
        Hapus Siswa Terpilih
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
            <Table.Th style="width: 200px" />
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
              <div class="flex gap-2">
                <Button
                  class="gap-2"
                  variant="danger"
                  @click="deleteSiswa(item)"
                >
                  <Lucide
                    class="w-5 h-5"
                    icon="Trash2"
                  />
                  Hapus
                </Button>
              </div>
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
