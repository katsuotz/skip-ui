<script setup lang="ts">

import {usePoinLogStore} from "../../stores/modules/poin-log";
import ReportSiswa from "../../components/Report/ReportSiswa.vue";
import {useSiswaStore} from "../../stores/modules/siswa";
import {useRoute} from "vue-router";
import {print} from "../../utils/helper";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide/Lucide.vue";

const route = useRoute()
const poinLog = usePoinLogStore()
const siswa = useSiswaStore()

poinLog.getPoinLogByNis(route?.params?.nis.toString())

</script>

<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between hide-print">
    <h2 class="mr-auto text-lg font-medium">
      Personal
    </h2>
  </div>
  <div class="p-5 mt-5 intro-y box flex flex-col gap-4 hide-print">
    <div class="flex items-center flex-wrap gap-2">
      <Button
        v-if="siswa.selectedSiswa"
        class="gap-2 hide-print ml-auto"
        variant="primary"
        @click="print"
      >
        <Lucide
          icon="Printer"
          class="w-4 h-4"
        />
        Print
      </Button>
    </div>
  </div>
  <div class="py-5 px-7 mt-8 intro-y box flex flex-col gap-4">
    <ReportSiswa
      v-model="poinLog.poinLogWithKelas"
      :selected-siswa="siswa.selectedSiswa"
    />
  </div>
</template>
