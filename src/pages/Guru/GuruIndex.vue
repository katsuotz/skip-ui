<script setup lang="ts">
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {ref} from "vue";
import {countPaginationNumber} from "../../utils/helper";
import GuruModal from "../../components/Guru/GuruModal.vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import {Guru} from "../../utils/interfaces/guru";
import {useGlobalStore} from "../../stores/global";
import {useGuruStore} from "../../stores/modules/guru";

const showModal = ref(false)

const global = useGlobalStore()
const guru = useGuruStore()

const getData = (resetPage: boolean = false) => {
  if (resetPage) guru.updateCurrentPage(1)

  guru.getGuru({
    page: guru.pagination.page,
    per_page: guru.pagination.per_page,
    search: search.value,
  })
}

const search = ref('')

const handleUpdatePage = (value: number) => {
  guru.updateCurrentPage(value)
  getData()
}

const handleUpdatePerPage = (value: number) => {
  guru.updatePerPage(value)
  getData(true)
}

const handleSearch = (value: string = '') => {
  search.value = value
  getData(true)
}

getData()

const showGuruModal = (item?: Guru) => {
  guru.selectedGuru = item
  showModal.value = true
}

const deleteGuru = (item: Guru) => {
  global.showModal({
    type: 'danger',
    title: 'Konfirmasi',
    description: `Yakin untuk menghapus Guru <span class="text-danger">${item.nama}</span>?`,
    icon: 'XCircle',
    buttonConfirmationText: 'Hapus',
    callback: () => handleDeleteGuru(item.id || 0),
  })
}

const handleDeleteGuru = async (id: number): Promise<void> => {
  await guru.deleteGuru(id)
  await getData()
}

</script>
<template>
  <GuruModal
    v-model="showModal"
    @success="getData"
  />
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      Guru
    </h2>
    <Button
      class="gap-2"
      variant="primary"
      @click="showGuruModal()"
    >
      <Lucide icon="Plus" />
      Tambah Data
    </Button>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <MyTable
      :current-page="guru.pagination.page"
      :page-count="guru.pagination.total_page"
      :per-page="guru.pagination.per_page"
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
              NIP
            </Table.Th>
            <Table.Th>
              Nama
            </Table.Th>
            <Table.Th>
              Tipe
            </Table.Th>
            <Table.Th style="width: 200px" />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody :data="guru.guru">
          <Table.Tr
            v-for="(item, key) in guru.guru"
            :key="key"
          >
            <Table.Td>
              {{ countPaginationNumber(guru.pagination, key) }}
            </Table.Td>
            <Table.Td>
              {{ item.nip }}
            </Table.Td>
            <Table.Td>
              {{ item.nama }}
            </Table.Td>
            <Table.Td>
              {{ item.tipe_guru }}
            </Table.Td>
            <Table.Td>
              <div class="flex gap-2">
                <Button
                  class="gap-2"
                  variant="warning"
                  @click="showGuruModal(item)"
                >
                  <Lucide
                    class="w-5 h-5"
                    icon="Edit"
                  />
                  Ubah
                </Button>
                <Button
                  class="gap-2"
                  variant="danger"
                  @click="deleteGuru(item)"
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
      </Table>
    </MyTable>
  </div>
</template>
