<script setup lang="ts">
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {useDataPoinStore} from "../../stores/modules/data-poin";
import {ref} from "vue";
import {countPaginationNumber, tindakLanjutLabel} from "../../utils/helper";
import DataPoinModal from "../../components/DataPoin/DataPoinModal.vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import {DataPoin} from "../../utils/interfaces/data-poin";
import {useGlobalStore} from "../../stores/global";
import TomSelect from "../../base-components/TomSelect";
import PoinType from "../../components/Poin/PoinType.vue";

const showModal = ref(false)

const global = useGlobalStore()
const dataPoin = useDataPoinStore()

const getData = (resetPage: boolean = false) => {
  if (resetPage) dataPoin.updateCurrentPage(1)

  dataPoin.getDataPoin({
    page: dataPoin.pagination.page,
    per_page: dataPoin.pagination.per_page,
    search: search.value,
    type: type.value,
    category: category.value,
  })
}

const search = ref('')
const type = ref('')
const category = ref('')

const handleUpdatePage = (value: number) => {
  dataPoin.updateCurrentPage(value)
  getData()
}

const handleUpdatePerPage = (value: number) => {
  dataPoin.updatePerPage(value)
  getData(true)
}

const handleSearch = (value: string = '') => {
  search.value = value
  getData(true)
}

getData()

const showDataPoinModal = (item?: DataPoin) => {
  dataPoin.selectedDataPoin = item
  showModal.value = true
}

const deleteDataPoin = (item: DataPoin) => {
  global.showModal({
    type: 'danger',
    title: 'Konfirmasi',
    description: `Yakin untuk menghapus Data Poin <span class="text-danger">${item.title}</span>?`,
    icon: 'XCircle',
    buttonConfirmationText: 'Hapus',
    callback: () => handleDeletePoin(item.id || 0),
  })
}

const handleDeletePoin = async (id: number): Promise<void> => {
  await dataPoin.deleteDataPoin(id)
  await getData()
}

</script>
<template>
  <DataPoinModal
    v-model="showModal"
    @success="getData"
  />
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      Master Poin
    </h2>
    <Button
      class="gap-2"
      variant="primary"
      @click="showDataPoinModal()"
    >
      <Lucide icon="Plus" />
      Tambah Data
    </Button>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <div class="flex flex-wrap gap-2 mb-4">
      <TomSelect
        v-model="type"
        placeholder="Pilih Tipe"
        style="width: 200px"
        @update:modelValue="getData(true)"
      >
        <option value="">
          Pilih Tipe
        </option>
        <option value="Penghargaan">
          Penghargaan
        </option>
        <option value="Pelanggaran">
          Pelanggaran
        </option>
      </TomSelect>
      <TomSelect
        v-if="type"
        v-model="category"
        placeholder="Pilih Kategori"
        style="width: 200px"
        @update:modelValue="getData(true)"
      >
        <option value="">
          Pilih Kategori
        </option>
        <template v-if="type === 'Penghargaan'">
          <option value="Sekolah">
            Sekolah
          </option>
          <option value="Kota">
            Kota
          </option>
          <option value="Provinsi">
            Provinsi
          </option>
          <option value="Nasional">
            Nasional
          </option>
          <option value="Internasional">
            Internasional
          </option>
        </template>
        <template v-else-if="type === 'Pelanggaran'">
          <option value="Ringan">
            Ringan
          </option>
          <option value="Sedang">
            Sedang
          </option>
          <option value="Berat">
            Berat
          </option>
        </template>
      </TomSelect>
    </div>

    <MyTable
      :current-page="dataPoin.pagination.page"
      :page-count="dataPoin.pagination.total_page"
      :per-page="dataPoin.pagination.per_page"
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
              Nama
            </Table.Th>
            <Table.Th>
              Deskripsi
            </Table.Th>
            <Table.Th>
              Tipe
            </Table.Th>
            <Table.Th>
              Kategori
            </Table.Th>
            <Table.Th>
              Poin
            </Table.Th>
            <Table.Th style="width: 200px" />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody
          v-if="dataPoin.dataPoin.length"
          :data="dataPoin.dataPoin"
        >
          <Table.Tr
            v-for="(item, key) in dataPoin.dataPoin"
            :key="key"
          >
            <Table.Td>
              {{ countPaginationNumber(dataPoin.pagination, key) }}
            </Table.Td>
            <Table.Td>
              {{ item.title }}
            </Table.Td>
            <Table.Td>
              {{ item.description }}
              <p v-if="item.penanganan">
                <span class="font-bold">Penanganan</span>: {{ item.penanganan }}
              </p>
              <p v-if="item.tindak_lanjut">
                <span class="font-bold">{{ tindakLanjutLabel(item.type) }}</span>: {{ item.tindak_lanjut }}
              </p>
            </Table.Td>
            <Table.Td>
              <span
                :class="{
                  'text-danger': item.type === 'Pelanggaran',
                  'text-success': item.type === 'Penghargaan',
                  'font-bold': true,
                }"
              >
                {{ item.type }}
              </span>
            </Table.Td>
            <Table.Td>
              <span
                :class="[
                  'px-2 py-1 text-xs text-white rounded-full',
                  item.category === 'Ringan' && 'bg-red-400',
                  item.category === 'Sedang' && 'bg-red-500',
                  item.category === 'Berat' && 'bg-danger/90',
                  item.category === 'Sekolah' && 'bg-teal-400',
                  item.category === 'Kota' && 'bg-teal-500',
                  item.category === 'Provinsi' && 'bg-teal-600',
                  item.category === 'Nasional' && 'bg-teal-700',
                  item.category === 'Internasional' && 'bg-teal-800',
                ]"
              >{{ item.category }}</span>
            </Table.Td>
            <Table.Td>
              <PoinType
                v-model="item.poin"
                :type="item.type"
              />
            </Table.Td>
            <Table.Td>
              <div class="flex gap-2">
                <Button
                  class="gap-2"
                  variant="warning"
                  @click="showDataPoinModal(item)"
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
                  @click="deleteDataPoin(item)"
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
