<script setup lang="ts">
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {ref} from "vue";
import {countPaginationNumber, dateTimeFormat} from "../../utils/helper";
import TahunAjarModal from "../../components/TahunAjar/TahunAjarModal.vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import {useGlobalStore} from "../../stores/global";
import {useSyncStore} from "../../stores/modules/sync";

const showModal = ref(false)

const global = useGlobalStore()
const sync = useSyncStore()

sync.updatePerPage(10)
sync.updateCurrentPage(1)

const getData = (resetPage: boolean = false) => {
  if (resetPage) sync.updateCurrentPage(1)

  sync.getSync({
    page: sync.pagination.page,
    per_page: sync.pagination.per_page,
  })
}

const search = ref('')

const handleUpdatePage = (value: number) => {
  sync.updateCurrentPage(value)
  getData()
}

const handleUpdatePerPage = (value: number) => {
  sync.updatePerPage(value)
  getData(true)
}

const handleSearch = (value: string = '') => {
  search.value = value
  getData(true)
}

getData()

const syncSiti = () => {
  global.showModal({
    type: 'primary',
    title: 'Sync SITI',
    icon: 'DatabaseBackup',
    buttonConfirmationText: 'Sync',
    callback: () => handleSyncSiti(),
  })
}

const handleSyncSiti = async (): Promise<void> => {
  await sync.syncSiti()
  getData()
}

const syncPassword = () => {
  global.showModal({
    type: 'primary',
    title: 'Sync Password',
    icon: 'Key',
    buttonConfirmationText: 'Sync',
    callback: () => handleSyncPassword(),
  })
}

const handleSyncPassword = async (): Promise<void> => {
  await sync.syncPassword()
  getData()
}

</script>
<template>
  <TahunAjarModal
    v-model="showModal"
    @success="getData"
  />
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      SITI
    </h2>
    <div class="flex gap-2">
      <Button
        class="gap-2"
        variant="primary"
        @click="syncSiti"
      >
        <Lucide icon="DatabaseBackup" />
        Sync SITI
      </Button>
      <Button
        class="gap-2"
        variant="primary"
        @click="syncPassword"
      >
        <Lucide icon="Key" />
        Sync Password
      </Button>
    </div>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <MyTable
      :current-page="sync.pagination.page"
      :page-count="sync.pagination.total_page"
      :per-page="sync.pagination.per_page"
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
              Time
            </Table.Th>
            <Table.Th>
              Type
            </Table.Th>
            <Table.Th>
              Status
            </Table.Th>
            <Table.Th>
              Description
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody
          v-if="sync.syncData.length"
          :data="sync.syncData"
        >
          <Table.Tr
            v-for="(item, key) in sync.syncData"
            :key="key"
          >
            <Table.Td>
              {{ countPaginationNumber(sync.pagination, key) }}
            </Table.Td>
            <Table.Td>
              {{ dateTimeFormat(item.created_at) }}
            </Table.Td>
            <Table.Td>
              {{ item.type }}
            </Table.Td>
            <Table.Td>
              {{ item.status }}
            </Table.Td>
            <Table.Td>
              {{ item.description }}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
        <Table.Empty v-else />
      </Table>
    </MyTable>
  </div>
</template>
