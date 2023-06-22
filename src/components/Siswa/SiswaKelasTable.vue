<script setup lang="ts">
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {ref, watch} from "vue";
import {countPaginationNumber, getUserPhoto, numberFormat} from "../../utils/helper";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import {Siswa} from "../../utils/interfaces/siswa";
import {useGlobalStore} from "../../stores/global";
import {useSiswaStore} from "../../stores/modules/siswa";
import {useKelasStore} from "../../stores/modules/kelas";
import FormCheck from "../../base-components/Form/FormCheck";
import PoinValue from "../Poin/PoinValue.vue";

interface SiswaKelasTableProps {
  kelasId: string | number;
  hideDelete?: boolean;
  showSummary?: boolean;
  showAll?: boolean;
  hidePagination?: boolean;
}

const props = defineProps<SiswaKelasTableProps>();

const global = useGlobalStore()
const siswa = useSiswaStore()
const kelas = useKelasStore()

const getData = (resetPage: boolean = false) => {
  if (resetPage) siswa.updateCurrentPage(1)

  siswa.getSiswa({
    page: props.hidePagination ? 1 : siswa.pagination.page,
    per_page: props.hidePagination ? -1 : siswa.pagination.per_page,
    search: search.value,
    kelas_id: props.kelasId.toString(),
    summary: props.showSummary,
  })
}

watch(() => props.kelasId, () => {
  getData(true)
})

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

getData()

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
  await kelas.deleteSiswaKelas(props.kelasId.toString(), siswa_id)
  await getData()
}

</script>
<template>
  <div
    v-if="!props.hideDelete"
    class="flex justify-end"
  >
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
    :pagination="!hidePagination"
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
          <template v-if="showSummary">
            <Table.Th>
              Jumlah Poin Penghargaan
            </Table.Th>
            <Table.Th>
              Jumlah Poin Pelanggaran
            </Table.Th>
          </template>
          <Table.Th>
            Poin
          </Table.Th>
          <Table.Th
            style="width: 200px"
            class="hide-print"
          />
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
            <div class="flex items-center">
              <FormCheck
                v-if="!props.hideDelete"
                class="mr-2"
              >
                <FormCheck.Input
                  v-model="selectedSiswa"
                  type="checkbox"
                  :value="item.id"
                />
              </FormCheck>
              <span>
                {{ countPaginationNumber(siswa.pagination, key) }}
              </span>
            </div>
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
          <template v-if="showSummary">
            <Table.Td>
              <span class="font-bold text-success">{{ numberFormat(item.total_penghargaan) }}</span>
            </Table.Td>
            <Table.Td>
              <span class="font-bold text-danger">{{ numberFormat(item.total_pelanggaran) }}</span>
            </Table.Td>
          </template>
          <Table.Td>
            <PoinValue v-model="item.poin" />
          </Table.Td>
          <Table.Td class="hide-print">
            <div class="flex gap-2">
              <RouterLink
                target="_blank"
                :to="`/kelas/${props.kelasId}/siswa/${item.siswa_kelas_id}`"
              >
                <Button
                  class="gap-2 whitespace-nowrap"
                  variant="success"
                  target="_blank"
                >
                  <Lucide
                    class="w-5 h-5"
                    icon="History"
                  />
                  Riwayat Poin
                </Button>
              </RouterLink>
              <Button
                v-if="!props.hideDelete"
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
</template>
