<script setup lang="ts">
import {countPaginationNumber, getUserPhoto} from "../../utils/helper";
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {ref} from "vue";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import {PoinLog} from "../../utils/interfaces/poin-log";
import PoinValue from "./PoinValue.vue";
import {InfoListData} from "../../utils/interfaces/info";
import {Pagination} from '../../utils/interfaces/table'

interface PoinLogTableProps {
  modelValue?: InfoListData[];
  pagination: Pagination;
}

interface PoinLogEmit {
  (e: "update:modelValue", value: boolean): void;
  (e: "updatePage", value: number): void;
  (e: "updatePerPage", value: number): void;
  (e: "updateSearch", value?: string): void;
}

const props = defineProps<PoinLogTableProps>();
const emit = defineEmits<PoinLogEmit>();

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

</script>

<template>
  <MyTable
    :current-page="props.pagination.page"
    :page-count="props.pagination.total_page"
    :per-page="props.pagination.per_page"
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
            Siswa
          </Table.Th>
          <Table.Th>
            Poin
          </Table.Th>
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
            {{ countPaginationNumber(props.pagination, key) }}
          </Table.Td>
          <Table.Td>
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
            <PoinValue
              v-model="item.poin"
            />
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
      <Table.Empty v-else />
    </Table>
  </MyTable>
</template>
