<script setup lang="ts">
import {countPaginationNumber, getUserPhoto} from "../../utils/helper";
import Table from "../../base-components/Table";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {ref} from "vue";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import {PoinLog} from "../../utils/interfaces/poin-log";
import PoinType from "./PoinType.vue";
import PoinValue from "./PoinValue.vue";

interface PoinLogTableProps {
  modelValue?: PoinLog[],
  hidePagination?: boolean;
  hideGuru?: boolean;
  hideAction?: boolean;
  hideDetail?: boolean;
  hideSiswa?: boolean;
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
          <Table.Th v-if="!props.hideSiswa">
            Siswa
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
            Pencatat
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
            {{ item.title }}
            <p class="text-xs">
              {{ item.description }}
            </p>
          </Table.Td>
          <Table.Td>
            <PoinValue v-model="item.poin_before" />
          </Table.Td>
          <Table.Td>
            <PoinValue v-model="item.poin_after" />
          </Table.Td>
          <Table.Td>
            <PoinType
              v-model="item.poin"
              :type="item.type"
            />
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