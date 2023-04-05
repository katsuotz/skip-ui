<script setup lang="ts">
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import {ref} from "vue";
import {countPaginationNumber} from "../../utils/helper";
import TahunAjarModal from "../../components/TahunAjar/TahunAjarModal.vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import FormSwitch from "../../base-components/Form/FormSwitch";
import {TahunAjar} from "../../utils/interfaces/tahun-ajar";
import {useGlobalStore} from "../../stores/global";

const showModal = ref(false)

const global = useGlobalStore()
const tahunAjar = useTahunAjarStore()

const getData = (resetPage: boolean = false) => {
  if (resetPage) tahunAjar.updateCurrentPage(1)

  tahunAjar.getTahunAjar({
    page: tahunAjar.pagination.page,
    per_page: tahunAjar.pagination.per_page,
    search: search.value,
  })
}

const search = ref('')

const handleUpdatePage = (value: number) => {
  tahunAjar.updateCurrentPage(value)
  getData()
}

const handleUpdatePerPage = (value: number) => {
  tahunAjar.updatePerPage(value)
  getData(true)
}

const handleSearch = (value: string = '') => {
  search.value = value
  getData(true)
}

getData()

const handleUpdateActive = (id: number) => {
  tahunAjar.setActiveTahunAjar(id).then(() => {
    getData()
  })
}

const showTahunAjarModal = (item?: TahunAjar) => {
  tahunAjar.selectedTahunAjar = item
  showModal.value = true
}

const deleteTahunAjar = (item: TahunAjar) => {
  global.showModal({
    type: 'danger',
    title: 'Konfirmasi',
    description: `Yakin untuk menghapus Tahun Ajar <span class="text-danger">${item.tahun_ajar}</span>?`,
    icon: 'XCircle',
    buttonConfirmationText: 'Hapus',
    callback: () => handleDeleteTahunAjar(item.id),
  })
}

const handleDeleteTahunAjar = async (id: number): Promise<void> => {
  await tahunAjar.deleteTahunAjar(id)
  await getData()
}

</script>
<template>
  <TahunAjarModal
    v-model="showModal"
    @success="getData"
  />
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      Tahun Ajar
    </h2>
    <Button
      class="gap-2"
      variant="primary"
      @click="showTahunAjarModal()"
    >
      <Lucide icon="Plus" />
      Tambah Data
    </Button>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <MyTable
      :current-page="tahunAjar.pagination.page"
      :page-count="tahunAjar.pagination.total_page"
      :per-page="tahunAjar.pagination.per_page"
      :search="search"
      @updatePerPage="handleUpdatePerPage"
      @updatePage="handleUpdatePage"
      @updateSearch="handleSearch"
    >
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              #
            </Table.Th>
            <Table.Th>
              Tahun Ajar
            </Table.Th>
            <Table.Th>
              Status
            </Table.Th>
            <Table.Th style="width: 200px" />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody :data="tahunAjar.tahunAjar">
          <Table.Tr
            v-for="(item, key) in tahunAjar.tahunAjar"
            :key="key"
          >
            <Table.Td>
              {{ countPaginationNumber(tahunAjar.pagination, key) }}
            </Table.Td>
            <Table.Td>
              {{ item.tahun_ajar }}
            </Table.Td>
            <Table.Td>
              <FormSwitch class="w-full mt-3 sm:w-auto sm:ml-auto sm:mt-0">
                <FormSwitch.Input
                  :disabled="item.is_active"
                  :checked="item.is_active"
                  class="ml-3 mr-0"
                  type="checkbox"
                  @click="item.is_active"
                  @update:modelValue="handleUpdateActive(item.id)"
                />
              </FormSwitch>
            </Table.Td>
            <Table.Td>
              <div class="flex gap-2">
                <Button
                  class="gap-2"
                  variant="warning"
                  @click="showTahunAjarModal(item)"
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
                  @click="deleteTahunAjar(item)"
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
