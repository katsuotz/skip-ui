<script setup lang="ts">
import {ref} from "vue";
import {useGlobalStore} from "../../stores/global";
import {useKelasStore} from "../../stores/modules/kelas";
import {useRoute} from "vue-router";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import {PoinLog} from "../../utils/interfaces/poin-log";
import {usePoinSiswaStore} from "../../stores/modules/poin-siswa";
import PoinLogTable from "../../components/Poin/PoinLogTable.vue";

const global = useGlobalStore()
const kelas = useKelasStore()
const poinLog = usePoinLogStore()
const poinSiswa = usePoinSiswaStore()

const route = useRoute()
const kelas_id:string = route.params.kelas_id.toString()
const siswa_kelas_id:string = route.params.siswa_kelas_id.toString()

const getData = (resetPage: boolean = false) => {
  if (resetPage) poinLog.updateCurrentPage(1)

  poinLog.getPoinLogBySiswaKelasID({
    page: poinLog.pagination.page,
    per_page: poinLog.pagination.per_page,
    search: search.value,
    siswa_kelas_id,
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

const onLoaded = async () => {
  Promise.all([
    kelas.getKelasByID(kelas_id),
    poinSiswa.getPoinSiswa(siswa_kelas_id),
  ]).then(() => {
    getData(true)
  })
}

onLoaded()

const handleDeleteLog = (item: PoinLog) => {
  global.showModal({
    type: 'danger',
    title: 'Konfirmasi',
    description: `Yakin untuk menghapus Siswa <span class="text-danger">${item.title}</span>?`,
    icon: 'XCircle',
    buttonConfirmationText: 'Hapus',
    // callback: () => handleDeleteSiswaKelas([item.id || 0]),
  })
}

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="text-lg font-medium">
      Riwayat Poin
    </h2>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <table>
      <tr>
        <td style="width: 90px">
          Nama
        </td>
        <th class="text-left">
          : {{ poinSiswa.selectedPoinSiswa?.nama }}
        </th>
      </tr>
      <tr>
        <td style="width: 90px">
          Kelas
        </td>
        <th class="text-left">
          : {{ kelas.selectedKelas?.nama_kelas }}
        </th>
      </tr>
      <tr>
        <td style="width: 90px">
          Tahun Ajar
        </td>
        <th class="text-left">
          : {{ kelas.selectedKelas?.tahun_ajar }}
        </th>
      </tr>
    </table>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <PoinLogTable
      v-model="poinLog.poinLogSiswaKelas"
      hide-siswa
      @updatePerPage="handleUpdatePerPage"
      @updatePage="handleUpdatePage"
      @updateSearch="handleSearch"
      @delete="handleDeleteLog"
    />
  </div>
</template>
