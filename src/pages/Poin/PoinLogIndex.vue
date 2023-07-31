<script setup lang="ts">
import {ref} from "vue";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import PoinLogTable from "../../components/Poin/PoinLogTable.vue";
import TomSelect from "../../base-components/TomSelect";
import {TahunAjar} from "../../utils/interfaces/tahun-ajar";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import {useRoute, useRouter} from "vue-router";

const poinLog = usePoinLogStore()

const tahunAjar = useTahunAjarStore()

const router = useRouter()
const route = useRoute()

const tahunAjarFilter = ref<TahunAjar[]>([])
const selectedTahunAjar = ref<string>('')

const loaded = ref(false)

tahunAjar.getTahunAjar({
  page: 1,
  per_page: -1,
}).then((res: any) => {
  tahunAjarFilter.value = res.data
  selectedTahunAjar.value = route.query.tahun_ajar_id ? route.query.tahun_ajar_id.toString() : (tahunAjar.activeTahunAjar?.id.toString() || '')
  router.replace({query: {}})
  handleUpdatePerPage(10)
}).finally( () => {
  loaded.value = true
})


const getData = (resetPage: boolean = false) => {
  if (resetPage) poinLog.updateCurrentPage(1)

  poinLog.getPoinLog({
    page: poinLog.pagination.page,
    per_page: poinLog.pagination.per_page,
    search: search.value,
    tahun_ajar_id: selectedTahunAjar.value,
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

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y">
    <h2 class="mr-auto text-lg font-medium">
      Aktivitas Poin
    </h2>
  </div>
  <div class="p-5 mt-5 intro-y box flex flex-col gap-4">
    <div>
      <TomSelect
        v-model="selectedTahunAjar"
        placeholder="Pilih Tahun Ajar"
        style="width: 200px"
        :clearable="false"
        @update:modelValue="getData(true)"
      >
        <option
          v-for="(item, key) in tahunAjarFilter"
          :key="key"
          :value="item.id"
        >
          {{ item.tahun_ajar }}
          <template v-if="item.is_active">
            (Aktif)
          </template>
        </option>
      </TomSelect>
    </div>

    <PoinLogTable
      v-model="poinLog.poinLog"
      hide-delete
      @updatePerPage="handleUpdatePerPage"
      @updatePage="handleUpdatePage"
      @updateSearch="handleSearch"
    />
  </div>
</template>
