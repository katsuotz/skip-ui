<script setup lang="ts">
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {ref} from "vue";
import {countPaginationNumber} from "../../utils/helper";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import {useGlobalStore} from "../../stores/global";
import {useKelasStore} from "../../stores/modules/kelas";
import {useRoute} from "vue-router";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import {PoinLog} from "../../utils/interfaces/poin-log";
import {usePoinSiswaStore} from "../../stores/modules/poin-siswa";

const global = useGlobalStore()
const kelas = useKelasStore()
const poinLog = usePoinLogStore()
const poinSiswa = usePoinSiswaStore()

const route = useRoute()
const kelas_id:string = route.params.kelas_id.toString()
const siswa_kelas_id:string = route.params.siswa_kelas_id.toString()

const getData = (resetPage: boolean = false) => {
  if (resetPage) poinLog.updateCurrentPage(1)

  poinLog.getPoinLog({
    page: poinLog.pagination.page,
    per_page: poinLog.pagination.per_page,
    search: search.value,
    siswa_kelas_id,
  })
}

const search = ref('')

const handleUpdatePage = (value: number) => {
  poinLog.updateCurrentPage(value)
  getData()
}

const handleUpdatePerPage = (value: number) => {
  poinLog.updatePerPage(value)
  getData(true)
}

const handleSearch = (value: string = '') => {
  search.value = value
  getData(true)
}

const onLoaded = async () => {
  Promise.all([
    kelas.getKelasByID(kelas_id),
    poinSiswa.getPoinSiswa(siswa_kelas_id),
  ]).then(() => {
    getData(true)
  })
}

onLoaded()

const deleteLog = (item: PoinLog) => {
  global.showModal({
    type: 'danger',
    title: 'Konfirmasi',
    description: `Yakin untuk menghapus Siswa <span class="text-danger">${item.title}</span>?`,
    icon: 'XCircle',
    buttonConfirmationText: 'Hapus',
    // callback: () => handleDeleteSiswaKelas([item.id || 0]),
  })
}

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="text-lg font-medium">
      Riwayat Poin
    </h2>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <table>
      <tr>
        <td style="width: 90px">
          Nama
        </td>
        <th class="text-left">
          : {{ poinSiswa.selectedPoinSiswa?.nama }}
        </th>
      </tr>
      <tr>
        <td style="width: 90px">
          Kelas
        </td>
        <th class="text-left">
          : {{ kelas.selectedKelas?.nama_kelas }}
        </th>
      </tr>
      <tr>
        <td style="width: 90px">
          Tahun Ajar
        </td>
        <th class="text-left">
          : {{ kelas.selectedKelas?.tahun_ajar }}
        </th>
      </tr>
    </table>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <MyTable
      :current-page="poinLog.pagination.page"
      :page-count="poinLog.pagination.total_page"
      :per-page="poinLog.pagination.per_page"
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
              Riwayat Poin
            </Table.Th>
            <Table.Th>
              Poin
            </Table.Th>
            <Table.Th>
              Poin Awal
            </Table.Th>
            <Table.Th>
              Poin Akhir
            </Table.Th>
            <Table.Th>
              Nama Guru
            </Table.Th>
            <Table.Th style="width: 200px" />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody
          v-if="poinLog.poinLog?.length"
          :data="poinLog.poinLog"
        >
          <Table.Tr
            v-for="(item, key) in poinLog.poinLog"
            :key="key"
          >
            <Table.Td>
              {{ countPaginationNumber(poinLog.pagination, key) }}
            </Table.Td>
            <Table.Td>
              {{ item.title }}
              <p class="text-xs">
                {{ item.description }}
              </p>
            </Table.Td>
            <Table.Td>
              <span
                :class="[
                  item.type === 'Pelanggaran' && 'text-danger',
                  item.type === 'Penghargaan' && 'text-success',
                  'font-bold'
                ]"
              >
                {{ item.poin }}
              </span>
            </Table.Td>
            <Table.Td>
              <span
                :class="[
                  item.poin_before < 50 && 'text-danger',
                  item.poin_before >= 50 && item.poin_before < 100 && 'text-warning',
                  item.poin_before >= 100 && 'text-success',
                  'font-bold'
                ]"
              >
                {{ item.poin_before }}
              </span>
            </Table.Td>
            <Table.Td>
              <span
                :class="[
                  item.poin_after < 50 && 'text-danger',
                  item.poin_after >= 50 && item.poin_after < 100 && 'text-warning',
                  item.poin_after >= 100 && 'text-success',
                  'font-bold'
                ]"
              >
                {{ item.poin_after }}
              </span>
            </Table.Td>
            <Table.Td>
              {{ item.nama_guru }}
            </Table.Td>
            <Table.Td>
              <div class="flex gap-2">
                <Button
                  class="gap-2"
                  variant="danger"
                  @click="deleteLog(item)"
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
