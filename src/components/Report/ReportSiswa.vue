<script setup lang="ts">
import {getUserPhoto, poinColorClass, poinIcon, poinLabel} from "../../utils/helper";
import PoinLogTable from "../Poin/PoinLogTable.vue";
import Lucide from "../../base-components/Lucide/Lucide.vue";
import VueQrious from "vue-qrious";
import Divider from "../../base-components/Divider";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import {useSiswaStore} from "../../stores/modules/siswa";
import {computed} from "vue";

const siswa = useSiswaStore()
const poinLog = usePoinLogStore()

const url = computed(() => document.location.origin + '/report/personal/' + siswa.selectedSiswa?.nis)

</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <img
          :src="getUserPhoto(siswa.selectedSiswa?.foto)"
          alt=""
          class="w-[86px] h-[86px] rounded-full object-cover object-center"
        >
        <div class="ml-4">
          <h3 class="text-xl font-bold">
            {{ siswa.selectedSiswa?.nama }}
          </h3>
          <p class="text-slate-500 font-medium">
            {{ siswa.selectedSiswa?.nis }}
          </p>
        </div>
      </div>
      <VueQrious
        :value="url"
      />
    </div>
    <Divider />
    <div class="flex flex-col gap-8">
      <div
        v-for="(item, key) in poinLog.poinLogWithKelas"
        :key="key"
      >
        <div class="mb-5 flex justify-between items-center">
          <div>
            <p class="text-lg font-bold text-slate-800">
              {{ item.kelas.nama_kelas }} - {{ item.kelas.tahun_ajar }}
            </p>
            <p class="text-slate-500 mt-0.5">
              Total Poin: <span class="font-bold text-success">{{ item.kelas.poin }}</span>
            </p>
          </div>
          <div
            :class="[
              'flex items-center text-lg',
              poinColorClass(item.kelas.poin)
            ]"
          >
            <span class="mr-2 font-bold">{{ poinLabel(item.kelas.poin) }}</span>
            <Lucide
              :icon="poinIcon(item.kelas.poin)"
              class="w-8 h-8 stroke-2"
            />
          </div>
        </div>

        <PoinLogTable
          v-model="item.data"
          hide-pagination
          hide-action
          hide-pegawai
          hide-siswa
          hide-delete
        />
      </div>
    </div>
  </div>
</template>
