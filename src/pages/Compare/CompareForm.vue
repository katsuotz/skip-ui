<script setup lang="ts">
import {computed, ref} from "vue";
import TomSelect from "../../base-components/TomSelect";
import {useJurusanStore} from "../../stores/modules/jurusan";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import {usePoinSiswaStore} from "../../stores/modules/poin-siswa";
import {PoinJurusanWithKelas} from "../../utils/interfaces/poin-siswa";
import PoinValue from "../../components/Poin/PoinValue.vue";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import Table from "../../base-components/Table";

const jurusan = useJurusanStore()
const tahunAjar = useTahunAjarStore()
const poinSiswa = usePoinSiswaStore()

const filter = ref([
  {
    tahun_ajar_id: '',
    jurusan_id: '',
  },
  {
    tahun_ajar_id: '',
    jurusan_id: '',
  },
])

const getTahunAjar = () => {
  tahunAjar.getTahunAjar({
    page: 1,
    per_page: -1,
  })
}

const getJurusan = () => {
  jurusan.getJurusan()
}

getTahunAjar()
getJurusan()

const data = ref<PoinJurusanWithKelas[]>([])

const getData = (key: number) => {
  delete data.value[key]
  if (!filter.value[key].jurusan_id || !filter.value[key].jurusan_id) return
  poinSiswa.getPoinKelasByJurusan(filter.value[key].jurusan_id, filter.value[key].tahun_ajar_id).then((res:any) => {
    data.value[key] = res
  })
}

const hasData = computed(() => data.value.filter(e => e).length)

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      Bandingkan Kelas
    </h2>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <div class="grid grid-cols-12 gap-5">
      <div
        v-for="n in 2"
        :key="n-1"
        class="col-span-12 xl:col-span-6"
      >
        <p class="mb-2">
          Pilihan {{ n }}
        </p>
        <div class="flex flex-wrap gap-2">
          <TomSelect
            v-model="filter[n - 1].tahun_ajar_id"
            placeholder="Pilih Tahun Ajar"
            style="width: 200px"
            @update:modelValue="getData(n - 1)"
          >
            <option value="">
              Pilih Tahun Ajar
            </option>
            <option
              v-for="(item, key) in tahunAjar.tahunAjar"
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
            v-model="filter[n - 1].jurusan_id"
            placeholder="Pilih Jurusan"
            style="width: 200px"
            @update:modelValue="getData(n - 1)"
          >
            <option value="">
              Pilih Jurusan
            </option>
            <option
              v-for="(item, key) in jurusan.jurusan"
              :key="key"
              :value="item.id"
            >
              {{ item.nama_jurusan }}
            </option>
          </TomSelect>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="hasData"
    class="p-5 mt-5 intro-y box"
  >
    <div class="grid grid-cols-12 gap-5">
      <div
        v-for="(item, key) in data"
        :key="key"
        class="col-span-12 xl:col-span-6"
      >
        <template v-if="item">
          <div>
            <p class="text-lg font-bold text-slate-800">
              {{ item.jurusan.nama_jurusan }} - {{ item.jurusan.tahun_ajar }}
            </p>
            <p class="text-slate-500 mt-0.5">
              Rata - Rata Poin: <PoinValue v-model="item.jurusan.poin" />
            </p>
          </div>

          <MyTable
            :pagination="false"
            hide-search
          >
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th width="10">
                    #
                  </Table.Th>
                  <Table.Th>
                    Kelas
                  </Table.Th>
                  <Table.Th>
                    Poin
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody
                v-if="item.data.length"
                :data="item.data"
              >
                <Table.Tr
                  v-for="(kelas, keyPoin) in item.data"
                  :key="keyPoin"
                >
                  <Table.Td>
                    {{ keyPoin + 1 }}
                  </Table.Td>
                  <Table.Td>
                    {{ kelas.nama_kelas }}
                  </Table.Td>
                  <Table.Td>
                    <PoinValue v-model="kelas.poin" />
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
              <Table.Empty v-else />
            </Table>
          </MyTable>
        </template>
      </div>
    </div>
  </div>
</template>
