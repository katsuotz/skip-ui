<script setup lang="ts">
import {ref} from "vue";
import {useInfoStore} from "../../stores/modules/info";
import TomSelect from "../../base-components/TomSelect";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import {TahunAjar} from "../../utils/interfaces/tahun-ajar";
import {useRoute, useRouter} from "vue-router";
import PoinTypeTable from "../../components/Poin/PoinTypeTable.vue";

const router = useRouter()
const route = useRoute()

const info = useInfoStore()
const tahunAjar = useTahunAjarStore()

const tahunAjarFilter = ref<TahunAjar[]>([])

const selectedTahunAjar = ref<string>('')
const selectedType = ref<string>(route.query.type?.toString() || 'Penghargaan')

const loaded = ref(false)

tahunAjar.getTahunAjar({
  page: 1,
  per_page: -1,
}).then((res: any) => {
  selectedTahunAjar.value = route.query.tahun_ajar_id ? route.query.tahun_ajar_id.toString() : (tahunAjar.activeTahunAjar?.id.toString() || '')
  tahunAjarFilter.value = res.data
}).finally( () => {
  loaded.value = true
  getData()
})

const getData = (resetPage: boolean = false) => {
  if (resetPage) info.listTypePagination.page = 1

  info.listPoinCount({
    page: info.listTypePagination.page,
    per_page: info.listTypePagination.per_page,
    type: selectedType.value,
    group_by: 'type',
    tahun_ajar_id: selectedTahunAjar.value,
  })
}

const search = ref('')

const handleUpdatePage = (value: number) => {
  info.listTypePagination.page = value
  getData()
}

const handleUpdatePerPage = (value: number) => {
  info.listTypePagination.per_page = value
  getData(true)
}

const handleSearch = (value: string = '') => {
  search.value = value
  getData(true)
}

info.listTypePagination.per_page = 10

router.replace({ path: '/poin/type', query: {}})

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y">
    <h2 class="mr-auto text-lg font-medium">
      Data Jumlah Poin
    </h2>
  </div>
  <div class="p-5 mt-5 intro-y box flex flex-col gap-4">
    <div class="flex flex-wrap gap-2">
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
      <TomSelect
        v-model="selectedType"
        style="width: 200px"
        :clearable="false"
        @update:modelValue="getData(true)"
      >
        <option value="Penghargaan">
          Penghargaan
        </option>
        <option value="Pelanggaran">
          Pelanggaran
        </option>
      </TomSelect>
    </div>

    <PoinTypeTable
      v-model="info.listType"
      :pagination="info.listTypePagination"
      @updatePerPage="handleUpdatePerPage"
      @updatePage="handleUpdatePage"
      @updateSearch="handleSearch"
    />
  </div>
</template>
