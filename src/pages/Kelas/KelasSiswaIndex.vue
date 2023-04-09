<script setup lang="ts">
import {ref} from "vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import {useKelasStore} from "../../stores/modules/kelas";
import {useRoute} from "vue-router";
import KelasTable from "../../components/Kelas/KelasTable.vue";

const kelas = useKelasStore()

const route = useRoute()
const kelas_id:string = route.params.kelas_id.toString()

const loaded = ref(false)

kelas.getKelasByID(kelas_id).then(() => {
  loaded.value = true
})

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      List Siswa
    </h2>
    <RouterLink
      v-slot="{ navigate, href }"
      :to="`/kelas/${kelas_id}/siswa/add`"
    >
      <Button
        as="a"
        class="gap-2"
        variant="primary"
        :href="href"
        @click="navigate"
      >
        <Lucide icon="Plus" />
        Tambah Data
      </Button>
    </RouterLink>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <table>
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
  <div class="p-5 mt-5 intro-y box flex flex-col gap-4">
    <KelasTable
      v-if="loaded"
      :kelas-id="kelas_id"
    />
  </div>
</template>
