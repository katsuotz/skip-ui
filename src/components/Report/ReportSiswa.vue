<script setup lang="ts">
import {getUserPhoto} from "../../utils/helper";
import PoinLogTable from "../Poin/PoinLogTable.vue";
import VueQrious from "vue-qrious";
import Divider from "../../base-components/Divider";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import {useSiswaStore} from "../../stores/modules/siswa";
import {computed} from "vue";
import PoinValue from "../Poin/PoinValue.vue";

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
              Wali Kelas: <span class="font-bold text-success">{{ item.kelas.wali_kelas }}</span>
              <!--              Total Poin: <span class="font-bold text-success">{{ item.kelas.poin }}</span>-->
            </p>
          </div>
          <div
            :class="[
              'flex items-center text-xl',
            ]"
          >
            <span class="mr-2 font-bold text-slate-600">Poin: </span>
            <PoinValue
              v-model="item.kelas.poin"
              class="text-3xl"
            />
          </div>
        </div>

        <PoinLogTable
          v-model="item.data"
          hide-pagination
          hide-pegawai
          hide-siswa
          hide-delete
        />
      </div>
    </div>
  </div>
</template>
