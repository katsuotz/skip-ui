<script setup lang="ts">
import {countPaginationNumber, dateTimeFormat, getUserPhoto} from "../../utils/helper";
import Table from "../Table";
import Lucide from "../Lucide";
import MyTable from "../My/MyTable/MyTable.vue";
import {ref} from "vue";
import {LoginLog, Role} from "../../utils/interfaces/user";
import {useInfoStore} from "../../stores/modules/info";
import {useAuthStore} from "../../stores/modules/auth";

interface LoginLogTableProps {
    modelValue?: LoginLog[],
}

interface LoginLogEmit {
    (e: "update:modelValue", value: boolean): void;
    (e: "updatePage", value: number): void;
    (e: "updatePerPage", value: number): void;
    (e: "updateSearch", value?: string): void;
    (e: "delete", value: LoginLog): void;
}

const props = defineProps<LoginLogTableProps>();
const emit = defineEmits<LoginLogEmit>();

const auth = useAuthStore()
const info = useInfoStore()

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

const getRole = (role: Role) => {
  switch (role) {
  case "admin":
    return "Guru BK"
  case "staff-ict":
    return "Guru"
  default:
    return auth.roleLabel[role]
  }
}

</script>

<template>
  <MyTable
    :current-page="info.loginLogPagination.page"
    :page-count="info.loginLogPagination.total_page"
    :per-page="info.loginLogPagination.per_page"
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
            User
          </Table.Th>
          <Table.Th>
            Waktu
          </Table.Th>
          <Table.Th>
            Aksi
          </Table.Th>
          <Table.Th>
            Detail
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
            {{ countPaginationNumber(info.loginLogPagination, key) }}
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
                  {{ getRole(item.role) }}
                </p>
              </div>
            </div>
          </Table.Td>
          <Table.Td>
            {{ dateTimeFormat(item.created_at) }}
          </Table.Td>
          <Table.Td>
            <div class="flex items-center font-medium gap-3">
              <div
                v-if="item.action === 'Successful Login'"
                class="text-success flex"
              >
                <Lucide
                  icon="CheckCircle"
                  class="w-7 h-7"
                />
              </div>
              <div
                v-else-if="item.action === 'Failed Login Attempt'"
                class="text-danger flex"
              >
                <Lucide
                  icon="XCircle"
                  class="w-7 h-7"
                />
              </div>
              <div
                v-else-if="item.action === 'Change Password Attempt'"
                class="text-warning flex"
              >
                <Lucide
                  icon="AlertTriangle"
                  class="w-7 h-7"
                />
              </div>
              <div
                v-else-if="item.action === 'Password Changed'"
                class="text-warning flex"
              >
                <Lucide
                  icon="FormInput"
                  class="w-7 h-7"
                />
              </div>
              {{ item.action }}
            </div>
          </Table.Td>
          <Table.Td class="font-medium">
            <p>{{ item.os }}</p>
            <p>{{ item.browser }}</p>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
      <Table.Empty v-else />
    </Table>
  </MyTable>
</template>
