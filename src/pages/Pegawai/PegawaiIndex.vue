<script setup lang="ts">
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {ref} from "vue";
import {countPaginationNumber, getUserPhoto} from "../../utils/helper";
import PegawaiModal from "../../components/Pegawai/PegawaiModal.vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import {Pegawai} from "../../utils/interfaces/pegawai";
import {useGlobalStore} from "../../stores/global";
import {usePegawaiStore} from "../../stores/modules/pegawai";

const showModal = ref(false)

const global = useGlobalStore()
const pegawai = usePegawaiStore()

const getData = (resetPage: boolean = false) => {
  if (resetPage) {
    pegawai.updateCurrentPage(1)
    pegawai.updatePerPage(10)
  }

  pegawai.getPegawai({
    page: pegawai.pagination.page,
    per_page: pegawai.pagination.per_page,
    search: search.value,
  })
}

const search = ref('')

const handleUpdatePage = (value: number) => {
  pegawai.updateCurrentPage(value)
  getData()
}

const handleUpdatePerPage = (value: number) => {
  pegawai.updatePerPage(value)
  getData(true)
}

const handleSearch = (value: string = '') => {
  search.value = value
  getData(true)
}

getData(true)

const showPegawaiModal = (item?: Pegawai) => {
  pegawai.selectedPegawai = item
  showModal.value = true
}

const deletePegawai = (item: Pegawai) => {
  global.showModal({
    type: 'danger',
    title: 'Konfirmasi',
    description: `Yakin untuk menghapus Pegawai <span class="text-danger">${item.nama}</span>?`,
    icon: 'XCircle',
    buttonConfirmationText: 'Hapus',
    callback: () => handleDeletePegawai(item.id || 0),
  })
}

const handleDeletePegawai = async (id: number): Promise<void> => {
  await pegawai.deletePegawai(id)
  await getData()
}

</script>
<template>
  <PegawaiModal
    v-model="showModal"
    @success="getData"
  />
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      Pegawai
    </h2>
    <Button
      class="gap-2"
      variant="primary"
      @click="showPegawaiModal()"
    >
      <Lucide icon="Plus" />
      Tambah Data
    </Button>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <MyTable
      :current-page="pegawai.pagination.page"
      :page-count="pegawai.pagination.total_page"
      :per-page="pegawai.pagination.per_page"
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
        <Table.Tbody
          v-if="pegawai.pegawai?.length"
          :data="pegawai.pegawai"
        >
          <Table.Tr
            v-for="(item, key) in pegawai.pegawai"
            :key="key"
          >
            <Table.Td>
              {{ countPaginationNumber(pegawai.pagination, key) }}
            </Table.Td>
            <Table.Td>
              {{ item.nip }}
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
              {{ item.tipe_pegawai }}
            </Table.Td>
            <Table.Td>
              <div class="flex gap-2">
                <Button
                  class="gap-2"
                  variant="warning"
                  @click="showPegawaiModal(item)"
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
                  @click="deletePegawai(item)"
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
