<script setup lang="ts">
import {ref} from "vue";
import {useGlobalStore} from "../../stores/global";
import {useKelasStore} from "../../stores/modules/kelas";
import {useRoute} from "vue-router";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import {PoinLog} from "../../utils/interfaces/poin-log";
import {usePoinSiswaStore} from "../../stores/modules/poin-siswa";
import PoinLogTable from "../../components/Poin/PoinLogTable.vue";
import {getUserPhoto} from "../../utils/helper";
import PoinValue from "../../components/Poin/PoinValue.vue";

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
    handleUpdatePerPage(10)
  })
}

onLoaded()

const handlePoinLog = async (id: number): Promise<void> => {
  poinLog.deletePoinLog(id).then(async () => {
    await poinSiswa.getPoinSiswa(siswa_kelas_id)
    await getData()
  })
}

const handleDeleteLog = (item: PoinLog) => {
  global.showModal({
    type: 'danger',
    title: 'Konfirmasi',
    description: `Yakin untuk menghapus Siswa <span class="text-danger">${item.title}</span>?`,
    icon: 'XCircle',
    buttonConfirmationText: 'Hapus',
    callback: () => handlePoinLog(item.id),
  })
}

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="text-lg font-medium">
      Riwayat Poin
    </h2>
  </div>
  <div
    class="p-5 mt-5 intro-y box flex sm:flex-row flex-col gap-5 sm:items-center justify-between"
  >
    <div class="flex items-start">
      <img
        v-if="poinSiswa.selectedPoinSiswa"
        :src="getUserPhoto(poinSiswa.selectedPoinSiswa?.foto)"
        alt=""
        class="w-[64px] h-[64px] rounded-full object-cover object-center mr-5"
      >
      <table>
        <tr>
          <td class="whitespace-nowrap pr-2 align-top">
            Nama
          </td>
          <th class="text-left">
            : {{ poinSiswa.selectedPoinSiswa?.nama }}
          </th>
        </tr>
        <tr>
          <td class="whitespace-nowrap pr-2">
            Kelas
          </td>
          <th class="text-left">
            : {{ kelas.selectedKelas?.nama_kelas }}
          </th>
        </tr>
        <tr>
          <td class="whitespace-nowrap pr-2">
            Tahun Ajar
          </td>
          <th class="text-left">
            : {{ kelas.selectedKelas?.tahun_ajar }}
          </th>
        </tr>
      </table>
    </div>

    <PoinValue
      v-if="poinSiswa.selectedPoinSiswa"
      v-model="poinSiswa.selectedPoinSiswa.poin"
      class="text-3xl mr-2 ml-auto"
    />
  </div>
  <div class="p-5 mt-5 intro-y box">
    <PoinLogTable
      v-model="poinLog.poinLogSiswaKelas"
      hide-siswa
      @updatePerPage="handleUpdatePerPage"
      @updatePage="handleUpdatePage"
      @updateSearch="handleSearch"
      @delete="handleDeleteLog"
      @getData="getData()"
    />
  </div>
</template>
