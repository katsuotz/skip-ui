<script setup lang="ts">
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {ref, watch} from "vue";
import {countPaginationNumber} from "../../utils/helper";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import {Siswa} from "../../utils/interfaces/siswa";
import {useGlobalStore} from "../../stores/global";
import {useSiswaStore} from "../../stores/modules/siswa";
import {useKelasStore} from "../../stores/modules/kelas";
import {useRoute} from "vue-router";
import FormCheck from "../../base-components/Form/FormCheck";

interface KelasTableProps {
  kelasId: string | number;
  hideDelete?: boolean;
}

const props = defineProps<KelasTableProps>();

const global = useGlobalStore()
const siswa = useSiswaStore()
const kelas = useKelasStore()

const route = useRoute()

const getData = (resetPage: boolean = false) => {
  if (resetPage) siswa.updateCurrentPage(1)

  siswa.getSiswa({
    page: siswa.pagination.page,
    per_page: siswa.pagination.per_page,
    search: search.value,
    kelas_id: props.kelasId.toString(),
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
            <div class="flex items-center">
              <FormCheck
                v-if="!props.hideDelete"
              >
                <FormCheck.Input
                  v-model="selectedSiswa"
                  type="checkbox"
                  :value="item.id"
                />
              </FormCheck>
              <span class="ml-2">
                {{ countPaginationNumber(siswa.pagination, key) }}
              </span>
            </div>
          </Table.Td>
          <Table.Td>
            {{ item.nis }}
          </Table.Td>
          <Table.Td>
            {{ item.nama }}
          </Table.Td>
          <Table.Td>
            <span
              v-if="item.poin"
              :class="[
                item.poin < 50 && 'text-danger',
                item.poin >= 50 && item.poin < 100 && 'text-warning',
                item.poin >= 100 && 'text-success',
                'font-bold'
              ]"
            >
              {{ item.poin }}
            </span>
          </Table.Td>
          <Table.Td>
            <div class="flex gap-2">
              <RouterLink
                v-slot="{ href, navigate }"
                :to="`/kelas/${props.kelasId}/siswa/${item.siswa_kelas_id}`"
              >
                <Button
                  as="a"
                  :href="href"
                  class="gap-2 whitespace-nowrap"
                  variant="success"
                  @click="navigate"
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
</template>
