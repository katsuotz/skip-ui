<script setup lang="ts">
import {countPaginationNumber, dateTimeFormat, getFileUrl, getUserPhoto} from "../../utils/helper";
import Table from "../../base-components/Table";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {ref} from "vue";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import {PoinLog} from "../../utils/interfaces/poin-log";
import PoinType from "./PoinType.vue";
import PoinValue from "./PoinValue.vue";
import PoinLogTindakanModal from "./PoinLogTindakanModal.vue";

interface PoinLogTableProps {
  modelValue?: PoinLog[],
  hidePagination?: boolean;
  hidePegawai?: boolean;
  hideDelete?: boolean;
  hideAction?: boolean;
  hideQr?: boolean;
  hideDetail?: boolean;
  hideSiswa?: boolean;
}

interface PoinLogEmit {
  (e: "update:modelValue", value: boolean): void;
  (e: "getData"): void;
  (e: "updatePage", value: number): void;
  (e: "updatePerPage", value: number): void;
  (e: "updateSearch", value?: string): void;
  (e: "delete", value: PoinLog): void;
}

const props = defineProps<PoinLogTableProps>();
const emit = defineEmits<PoinLogEmit>();

const poinLog = usePoinLogStore()

const search = ref('')

const handleUpdatePage = (value: number) => {
  emit('updatePage', value)
}

const handleUpdatePerPage = (value: number) => {
  emit('updatePerPage', value)
}

const handleSearch = (value: string = '') => {
  emit('updateSearch', value)
}

const deleteLog = (item: PoinLog) => {
  emit('delete', item)
}

const tindakanModal = ref(false)

const showTindakanModal = (item?: PoinLog) => {
  poinLog.selectedPoinLog = item
  tindakanModal.value = true
}

</script>

<template>
  <PoinLogTindakanModal
    v-model="tindakanModal"
    @success="emit('getData')"
  />

  <MyTable
    :current-page="poinLog.pagination.page"
    :page-count="poinLog.pagination.total_page"
    :per-page="poinLog.pagination.per_page"
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
          <Table.Th v-if="!props.hideSiswa">
            Siswa
          </Table.Th>
          <Table.Th>
            Riwayat Poin
          </Table.Th>
          <Table.Th>
            Penanganan
          </Table.Th>
          <Table.Th>
            Tindak Lanjut
          </Table.Th>
          <Table.Th>
            Poin Awal
          </Table.Th>
          <Table.Th>
            Poin
          </Table.Th>
          <Table.Th>
            Poin Akhir
          </Table.Th>
          <Table.Th v-if="!hidePegawai">
            Pencatat
          </Table.Th>
          <Table.Th>
            Waktu
          </Table.Th>
          <Table.Th
            v-if="!hideAction || !hideDelete"
            class="hide-print"
            style="max-width: 200px"
          />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody
        v-if="props.modelValue?.length"
        :data="props.modelValue"
      >
        <Table.Tr
          v-for="(item, key) in props.modelValue"
          :key="key"
        >
          <Table.Td>
            {{ props.hidePagination ? key + 1 : countPaginationNumber(poinLog.pagination, key) }}
          </Table.Td>
          <Table.Td v-if="!props.hideSiswa">
            <div class="flex items-center gap-2">
              <img
                class="w-10 h-10 overflow-hidden rounded-full object-cover object-center"
                alt=""
                :src="getUserPhoto(item?.foto)"
              >
              <div>
                <p class="font-medium">
                  {{ item.nama }}
                </p>
                <p class="text-slate-500 text-xs mt-0.5">
                  {{ item.nis }}
                </p>
              </div>
            </div>
          </Table.Td>
          <Table.Td>
            <p class="font-bold">
              {{ item.title }}
            </p>
            <p class="text-xs">
              {{ item.description }}
            </p>
          </Table.Td>
          <Table.Td>
            {{ item.penanganan || '-' }}
          </Table.Td>
          <Table.Td>
            {{ item.tindak_lanjut || '-' }}
          </Table.Td>
          <Table.Td>
            <PoinValue v-model="item.poin_before" />
          </Table.Td>
          <Table.Td>
            <PoinType
              v-model="item.poin"
              :type="item.type"
            />
          </Table.Td>
          <Table.Td>
            <PoinValue v-model="item.poin_after" />
          </Table.Td>
          <Table.Td v-if="!props.hidePegawai">
            {{ item.nama_pegawai }}
          </Table.Td>
          <Table.Td>
            {{ dateTimeFormat(item.created_at) }}
          </Table.Td>
          <Table.Td class="hide-print">
            <div class="flex gap-2 justify-end">
              <Button
                v-if="!hideDelete"
                class="whitespace-nowrap gap-2"
                variant="warning"
                @click="showTindakanModal(item)"
              >
                <Lucide
                  class="w-5 h-5"
                  icon="Flag"
                />
                Tindakan
              </Button>
              <Button
                v-if="item.file && !hideAction"
                as="a"
                target="_blank"
                :href="getFileUrl(item.file)"
                class="whitespace-nowrap gap-2"
                variant="success"
              >
                <Lucide
                  class="w-5 h-5"
                  icon="Image"
                />
                Lihat Bukti
              </Button>
              <Button
                v-if="!hideDelete"
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
      <Table.Empty v-else />
    </Table>
  </MyTable>
</template>
