<script setup lang="ts">
import {countPaginationNumber} from "../../utils/helper";
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {InfoListDataCount} from "../../utils/interfaces/info";
import {Pagination} from '../../utils/interfaces/table'

interface PoinLogTableProps {
  modelValue?: InfoListDataCount[];
  pagination: Pagination;
}

interface PoinLogEmit {
  (e: "update:modelValue", value: boolean): void;
  (e: "updatePage", value: number): void;
  (e: "updatePerPage", value: number): void;
}

const props = defineProps<PoinLogTableProps>();
const emit = defineEmits<PoinLogEmit>();

const handleUpdatePage = (value: number) => {
  emit('updatePage', value)
}

const handleUpdatePerPage = (value: number) => {
  emit('updatePerPage', value)
}

</script>

<template>
  <MyTable
    :current-page="props.pagination.page"
    :page-count="props.pagination.total_page"
    :per-page="props.pagination.per_page"
    hide-search
    @updatePerPage="handleUpdatePerPage"
    @updatePage="handleUpdatePage"
  >
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th width="10">
            #
          </Table.Th>
          <Table.Th>
            Nama Poin
          </Table.Th>
          <Table.Th>
            Total
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
            {{ item.title }}
          </Table.Td>
          <Table.Td>
            <span
              :class="[
                item.type === 'Penghargaan' && 'text-success',
                item.type === 'Pelanggaran' && 'text-danger',
                'font-bold'
              ]"
            >
              {{ item.total }}
            </span>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
      <Table.Empty v-else />
    </Table>
  </MyTable>
</template>
