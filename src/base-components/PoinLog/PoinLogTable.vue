<script setup lang="ts">
import {countPaginationNumber} from "../../utils/helper";
import Table from "../Table";
import Button from "../Button";
import Lucide from "../Lucide";
import MyTable from "../My/MyTable/MyTable.vue";
import {ref} from "vue";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import {PoinLog} from "../../utils/interfaces/poin-log";

interface PoinLogTableProps {
  modelValue: PoinLog[],
  hidePagination?: boolean;
  hideGuru?: boolean;
  hideAction?: boolean;
  hideDetail?: boolean;
}

interface PoinLogEmit {
  (e: "update:modelValue", value: boolean): void;
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

</script>

<template>
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
          <Table.Th>
            Riwayat Poin
          </Table.Th>
          <Table.Th>
            Poin Awal
          </Table.Th>
          <Table.Th>
            Poin Akhir
          </Table.Th>
          <Table.Th>
            Poin
          </Table.Th>
          <Table.Th v-if="!hideGuru">
            Nama Guru
          </Table.Th>
          <Table.Th
            v-if="!hideAction"
            style="width: 200px"
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
          <Table.Td>
            {{ item.title }}
            <p class="text-xs">
              {{ item.description }}
            </p>
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
          <Table.Td v-if="!props.hideGuru">
            {{ item.nama_guru }}
          </Table.Td>
          <Table.Td v-if="!props.hideAction">
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
      <Table.Empty v-else />
    </Table>
  </MyTable>
</template>
