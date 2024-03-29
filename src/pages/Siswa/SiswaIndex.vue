<script setup lang="ts">
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {ref} from "vue";
import {countPaginationNumber, getUserPhoto} from "../../utils/helper";
import SiswaModal from "../../components/Siswa/SiswaModal.vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import {Siswa} from "../../utils/interfaces/siswa";
import {useGlobalStore} from "../../stores/global";
import {useSiswaStore} from "../../stores/modules/siswa";

const showModal = ref(false)

const global = useGlobalStore()
const siswa = useSiswaStore()

const getData = (resetPage: boolean = false) => {
  if (resetPage) {
    siswa.updateCurrentPage(1)
    siswa.updatePerPage(10)
  }

  siswa.getSiswa({
    page: siswa.pagination.page,
    per_page: siswa.pagination.per_page,
    search: search.value,
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

handleUpdatePerPage(10)

const showSiswaModal = (item?: Siswa) => {
  siswa.selectedSiswa = item
  showModal.value = true
}

const deleteSiswa = (item: Siswa) => {
  global.showModal({
    type: 'danger',
    title: 'Konfirmasi',
    description: `Yakin untuk menghapus Siswa <span class="text-danger">${item.nama}</span>?`,
    icon: 'XCircle',
    buttonConfirmationText: 'Hapus',
    callback: () => handleDeleteSiswa(item.id || 0),
  })
}

const handleDeleteSiswa = async (id: number): Promise<void> => {
  await siswa.deleteSiswa(id)
  await getData()
}

</script>
<template>
  <SiswaModal
    v-model="showModal"
    @success="getData"
  />
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      Data Siswa
    </h2>
    <Button
      class="gap-2"
      variant="primary"
      @click="showSiswaModal()"
    >
      <Lucide icon="Plus" />
      Tambah Data
    </Button>
  </div>
  <div class="p-5 mt-5 intro-y box">
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
              {{ countPaginationNumber(siswa.pagination, key) }}
            </Table.Td>
            <Table.Td>
              {{ item.nis }}
            </Table.Td>
            <Table.Td>
              <div class="flex items-center">
                <img
                  :src="getUserPhoto(item.foto)"
                  alt=""
                  class="w-[36px] h-[36px] max-w-[36px] max-h-[36px] rounded-full object-cover object-center mr-3"
                >
                {{ item.nama }}
              </div>
            </Table.Td>
            <Table.Td>
              <div class="flex gap-2">
                <Button
                  class="gap-2"
                  variant="warning"
                  @click="showSiswaModal(item)"
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
        <Table.Empty v-else />
      </Table>
    </MyTable>
  </div>
</template>
