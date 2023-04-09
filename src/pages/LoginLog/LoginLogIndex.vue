<script setup lang="ts">
import {ref} from "vue";
import {useInfoStore} from "../../stores/modules/info";
import LoginLogTable from "../../base-components/LoginLog/LoginLogTable.vue";

const info = useInfoStore()

const getData = (resetPage: boolean = false) => {
  if (resetPage) info.loginLogPagination.page = 1

  info.getLoginLog({
    page: info.loginLogPagination.page,
    per_page: info.loginLogPagination.per_page,
    search: search.value,
  })
}

const search = ref('')

const handleUpdatePage = (value: number) => {
  info.loginLogPagination.page = value
  getData()
}

const handleUpdatePerPage = (value: number) => {
  info.loginLogPagination.per_page = value
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
      Aktivitas Login
    </h2>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <LoginLogTable
      v-model="info.loginLog"
      @updatePerPage="handleUpdatePerPage"
      @updatePage="handleUpdatePage"
      @updateSearch="handleSearch"
    />
  </div>
</template>
