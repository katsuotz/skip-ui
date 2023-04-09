<script setup lang="ts">
import {ref} from "vue";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import PoinLogTable from "../../base-components/PoinLog/PoinLogTable.vue";

const poinLog = usePoinLogStore()

const getData = (resetPage: boolean = false) => {
  if (resetPage) poinLog.updateCurrentPage(1)

  poinLog.getPoinLog({
    page: poinLog.pagination.page,
    per_page: poinLog.pagination.per_page,
    search: search.value,
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

handleUpdatePerPage(10)

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y">
    <h2 class="mr-auto text-lg font-medium">
      Aktivitas Poin
    </h2>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <PoinLogTable
      v-model="poinLog.poinLog"
      hide-action
      @updatePerPage="handleUpdatePerPage"
      @updatePage="handleUpdatePage"
      @updateSearch="handleSearch"
    />
  </div>
</template>
