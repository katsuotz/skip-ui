<script setup lang="ts">

import {usePoinLogStore} from "../../stores/modules/poin-log";
import ReportSiswa from "../Report/ReportSiswa.vue";
import {useAuthStore} from "../../stores/modules/auth";
import {useSiswaStore} from "../../stores/modules/siswa";

const auth = useAuthStore()
const poinLog = usePoinLogStore()
const siswa = useSiswaStore()

poinLog.getPoinLogByNis(auth.user?.nis || '')

</script>

<template>
  <div class="py-5 px-7 mt-8 intro-y box flex flex-col gap-4">
    <ReportSiswa
      v-model="poinLog.poinLogWithKelas"
      :selected-siswa="siswa.selectedSiswa"
    />
  </div>
</template>
