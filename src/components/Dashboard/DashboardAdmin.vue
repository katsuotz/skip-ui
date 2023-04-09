<script setup lang="ts">
import Lucide from "../../base-components/Lucide";
import {useInfoStore} from "../../stores/modules/info";
import {ref} from "vue";
import {dateFormat, getUserPhoto, numberFormat, timeFormat} from "../../utils/helper";
import LoadingIcon from "../../base-components/LoadingIcon";
import {usePoinLogStore} from "../../stores/modules/poin-log";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import TomSelect from "../../base-components/TomSelect";
import Tippy from "../../base-components/Tippy";
import DashboardPoinGraph from "./DashboardPoinGraph.vue";
import {useAuthStore} from "../../stores/modules/auth";
import PoinType from "../Poin/PoinType.vue";
import PoinValue from "../Poin/PoinValue.vue";
import {TahunAjar} from "../../utils/interfaces/tahun-ajar";

const info = useInfoStore()
const poinLog = usePoinLogStore()
const tahunAjar = useTahunAjarStore()
const auth = useAuthStore()

const loading = ref({
  countPenghargaan: true,
  countPelanggaran: true,
  calculateMax: true,
  calculateMin: true,
  calculateAvg: true,
  listBigger: true,
  listSmaller: true,
  latestLog: true,
  listPenghargaan: true,
  listPelanggaran: true,
  graphPenghargaan: true,
  graphPelanggaran: true,
  loginLog: true,
})

const loaded = ref(false)

const selectedTahunAjar = ref<string>('')

const getData = () => {
  loading.value = {
    countPenghargaan: true,
    countPelanggaran: true,
    calculateMax: true,
    calculateMin: true,
    calculateAvg: true,
    listBigger: true,
    listSmaller: true,
    latestLog: true,
    listPenghargaan: true,
    listPelanggaran: true,
    graphPenghargaan: true,
    graphPelanggaran: true,
    loginLog: true,
  }

  info.countPoin("Penghargaan", selectedTahunAjar.value).finally(() => {
    loading.value.countPenghargaan = false
  })
  info.countPoin("Pelanggaran", selectedTahunAjar.value).finally(() => {
    loading.value.countPelanggaran = false
  })
  info.calculatePoin("max", selectedTahunAjar.value).finally(() => {
    loading.value.calculateMax = false
  })
  info.calculatePoin("min", selectedTahunAjar.value).finally(() => {
    loading.value.calculateMin = false
  })
  info.calculatePoin("avg", selectedTahunAjar.value).finally(() => {
    loading.value.calculateAvg = false
  })
  info.listPoinBigger(selectedTahunAjar.value).finally(() => {
    loading.value.listBigger = false
  })
  info.listPoinSmaller(selectedTahunAjar.value).finally(() => {
    loading.value.listSmaller = false
  })
  poinLog.getLatestLog(selectedTahunAjar.value).finally(() => {
    loading.value.latestLog = false
  })
  info.listPoinCountPenghargaan(selectedTahunAjar.value).finally(() => {
    loading.value.listPenghargaan = false
  })
  info.listPoinCountPelanggaran(selectedTahunAjar.value).finally(() => {
    loading.value.listPelanggaran = false
  })
  info.getGraphCountPenghargaan(selectedTahunAjar.value).finally(() => {
    loading.value.graphPenghargaan = false
  })
  info.getGraphCountPelanggaran(selectedTahunAjar.value).finally(() => {
    loading.value.graphPelanggaran = false
  })
  if (auth.isAdmin) {
    info.getLoginLog({
      page: 1,
      per_page: 5,
    }, false).finally(() => {
      loading.value.loginLog = false
    })
  }
}

const tahunAjarFilter = ref<TahunAjar[]>([])

tahunAjar.getTahunAjar({
  page: 1,
  per_page: -1,
}).then((res: any) => {
  selectedTahunAjar.value = tahunAjar.activeTahunAjar?.id.toString() || ''
  tahunAjarFilter.value = res.data
}).finally( () => {
  loaded.value = true
  getData()
})

// poinLog.getPoinLog({
//   page: 1,
//   per_page: 5,
//   order: 'desc',
//   order_by: 'created_at',
//   tahun_ajar_id
// })


</script>

<template>
  <!-- BEGIN: Page Layout -->
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 2xl:col-span-9">
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 mt-8">
          <div class="flex items-center h-10 intro-y">
            <h2 class="mr-5 text-lg font-medium truncate">
              Statistik Data
            </h2>
            <div class="ml-auto flex items-center gap-4">
              <div>
                <TomSelect
                  id="tahun_ajar_id"
                  v-model="selectedTahunAjar"
                  placeholder="Pilih Tahun Ajar"
                  style="width: 200px"
                  :clearable="false"
                  @update:modelValue="getData"
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
              <div
                class="flex items-center text-primary cursor-pointer"
                @click.prevent="getData"
              >
                <Lucide
                  icon="RefreshCcw"
                  class="w-4 h-4 mr-3"
                />
                Refresh
              </div>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-6 mt-5">
            <div class="col-span-12 sm:col-span-6 lg:col-span-4 intro-y">
              <div
                :class="[
                  'relative zoom-in',
                  'before:content-[\'\'] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70',
                ]"
              >
                <div class="p-5 box">
                  <div class="flex">
                    <Lucide
                      icon="Files"
                      class="w-[28px] h-[28px] text-info"
                    />
                  </div>
                  <div
                    v-if="loading.countPenghargaan || loading.countPelanggaran"
                    class="flex mt-6"
                  >
                    <LoadingIcon
                      icon="puff"
                      class="w-8 h-8"
                      color="#0B5351"
                    />
                  </div>
                  <div
                    v-else
                    class="mt-4 text-3xl font-medium leading-8"
                  >
                    {{ numberFormat(info.totalData) }}
                  </div>
                  <div class="mt-1 text-base text-slate-500">
                    Total Data
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 lg:col-span-4 intro-y">
              <div
                :class="[
                  'relative zoom-in',
                  'before:content-[\'\'] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70',
                ]"
              >
                <div class="p-5 box">
                  <div class="flex">
                    <Lucide
                      icon="Medal"
                      class="w-[28px] h-[28px] text-success"
                    />
                    <div
                      v-if="!loading.countPenghargaan && typeof info.totalData === 'number' && info.totalData > 0"
                      class="ml-auto"
                    >
                      <div
                        class="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs px-2 items-center font-medium"
                      >
                        {{ numberFormat(info.totalPenghargaanPercentage, 2) }}%
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="loading.countPenghargaan"
                    class="flex mt-6"
                  >
                    <LoadingIcon
                      icon="puff"
                      class="w-8 h-8"
                      color="#0B5351"
                    />
                  </div>
                  <div
                    v-else
                    class="mt-4 text-3xl font-medium leading-8"
                  >
                    {{ numberFormat(info.totalPenghargaan) }}
                  </div>
                  <div class="mt-1 text-base text-slate-500">
                    Total Penghargaan
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 lg:col-span-4 intro-y">
              <div
                :class="[
                  'relative zoom-in',
                  'before:content-[\'\'] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70',
                ]"
              >
                <div class="p-5 box">
                  <div class="flex">
                    <Lucide
                      icon="Slash"
                      class="w-[28px] h-[28px] text-danger"
                    />
                    <div
                      v-if="!loading.countPelanggaran && typeof info.totalData === 'number' && info.totalData > 0"
                      class="ml-auto"
                    >
                      <div
                        class="cursor-pointer bg-danger py-[3px] flex rounded-full text-white text-xs px-2 items-center font-medium"
                      >
                        {{ numberFormat(info.totalPelanggaranPercentage, 2) }}%
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="loading.countPelanggaran"
                    class="flex mt-6"
                  >
                    <LoadingIcon
                      icon="puff"
                      class="w-8 h-8"
                      color="#0B5351"
                    />
                  </div>
                  <div
                    v-else
                    class="mt-4 text-3xl font-medium leading-8"
                  >
                    {{ numberFormat(info.totalPelanggaran) }}
                  </div>
                  <div class="mt-1 text-base text-slate-500">
                    Total Pelanggaran
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 lg:col-span-4 intro-y">
              <div
                :class="[
                  'relative zoom-in',
                  'before:content-[\'\'] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70',
                ]"
              >
                <div class="p-5 box">
                  <div class="flex">
                    <Lucide
                      icon="ChevronsUp"
                      class="w-[28px] h-[28px] text-success"
                    />
                  </div>
                  <div
                    v-if="loading.calculateMax"
                    class="flex mt-6"
                  >
                    <LoadingIcon
                      icon="puff"
                      class="w-8 h-8"
                      color="#0B5351"
                    />
                  </div>
                  <div
                    v-else
                    class="mt-4 text-3xl font-medium leading-8"
                  >
                    {{ numberFormat(info.maxPoin) }}
                  </div>
                  <div class="mt-1 text-base text-slate-500">
                    Jumlah Poin Terbesar
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 lg:col-span-4 intro-y">
              <div
                :class="[
                  'relative zoom-in',
                  'before:content-[\'\'] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70',
                ]"
              >
                <div class="p-5 box">
                  <div class="flex">
                    <Lucide
                      icon="ChevronsDown"
                      class="w-[28px] h-[28px] text-danger"
                    />
                  </div>
                  <div
                    v-if="loading.calculateMin"
                    class="flex mt-6"
                  >
                    <LoadingIcon
                      icon="puff"
                      class="w-8 h-8"
                      color="#0B5351"
                    />
                  </div>
                  <div
                    v-else
                    class="mt-4 text-3xl font-medium leading-8"
                  >
                    {{ numberFormat(info.minPoin) }}
                  </div>
                  <div class="mt-1 text-base text-slate-500">
                    Jumlah Poin Terkecil
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 lg:col-span-4 intro-y">
              <div
                :class="[
                  'relative zoom-in',
                  'before:content-[\'\'] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70',
                ]"
              >
                <div class="p-5 box">
                  <div class="flex">
                    <Lucide
                      icon="ChevronsLeftRight"
                      class="w-[28px] h-[28px] text-gray-500"
                    />
                  </div>
                  <div
                    v-if="loading.calculateAvg"
                    class="flex mt-6"
                  >
                    <LoadingIcon
                      icon="puff"
                      class="w-8 h-8"
                      color="#0B5351"
                    />
                  </div>
                  <div
                    v-else
                    class="mt-4 text-3xl font-medium leading-8"
                  >
                    {{ numberFormat(info.avgPoin) }}
                  </div>
                  <div class="mt-1 text-base text-slate-500">
                    Rata - Rata Jumlah Poin
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-span-12 mt-3 md:col-span-6"
        >
          <div class="flex items-center h-10 intro-x">
            <h2 class="mr-5 text-lg font-medium truncate">
              Total Poin Tertinggi
            </h2>
          </div>
          <div
            v-if="loading.listBigger"
            class="flex justify-center py-8 intro-x"
          >
            <LoadingIcon
              icon="puff"
              class="w-16 h-16"
              color="#0B5351"
            />
          </div>
          <div
            v-else
            class="mt-5"
          >
            <template v-if="info.infoListBigger.length">
              <div
                v-for="(item, key) in info.infoListBigger"
                :key="key"
                class="intro-x"
              >
                <div class="flex items-center px-5 py-3 mb-3 box zoom-in">
                  <div
                    class="flex-none w-10 h-10 overflow-hidden rounded-full image-fit"
                  >
                    <img
                      alt=""
                      :src="getUserPhoto(item?.foto)"
                    >
                  </div>
                  <div class="ml-4 mr-auto">
                    <div class="font-medium">
                      {{ item.nama }}
                    </div>
                    <div class="text-slate-500 text-xs mt-0.5">
                      {{ item.nis }}
                    </div>
                  </div>
                  <PoinValue v-model="item.poin" />
                </div>
              </div>
              <RouterLink
                :to="{
                  path: '/poin/siswa',
                  query: {
                    tahun_ajar_id: selectedTahunAjar,
                    order: 'desc',
                  }
                }"
                class="block w-full py-1 text-right rounded-md intro-x border-slate-400 text-slate-500 hover:text-primary"
              >
                Lihat Lebih Banyak
              </RouterLink>
            </template>
            <p
              v-else
              class="-mt-4 text-slate-500"
            >
              Tidak Ada Data
            </p>
          </div>
        </div>
        <div
          class="col-span-12 mt-3 md:col-span-6"
        >
          <div class="flex items-center h-10 intro-x">
            <h2 class="mr-5 text-lg font-medium truncate">
              Total Poin Terendah
            </h2>
          </div>
          <div
            v-if="loading.listSmaller"
            class="flex justify-center py-8 intro-x"
          >
            <LoadingIcon
              icon="puff"
              class="w-16 h-16"
              color="#0B5351"
            />
          </div>
          <div
            v-else
            class="mt-5"
          >
            <template v-if="info.infoListSmaller.length">
              <div
                v-for="(item, key) in info.infoListSmaller"
                :key="key"
                class="intro-x"
              >
                <div class="flex items-center px-5 py-3 mb-3 box zoom-in">
                  <div
                    class="flex-none w-10 h-10 overflow-hidden rounded-full image-fit"
                  >
                    <img
                      alt=""
                      :src="getUserPhoto(item?.foto)"
                    >
                  </div>
                  <div class="ml-4 mr-auto">
                    <div class="font-medium">
                      {{ item.nama }}
                    </div>
                    <div class="text-slate-500 text-xs mt-0.5">
                      {{ item.nis }}
                    </div>
                  </div>
                  <PoinValue v-model="item.poin" />
                </div>
              </div>
              <RouterLink
                :to="{
                  path: '/poin/siswa',
                  query: {
                    tahun_ajar_id: selectedTahunAjar,
                    order: 'asc',
                  }
                }"
                class="block w-full py-1 text-right rounded-md intro-x border-slate-400 text-slate-500 hover:text-primary"
              >
                Lihat Lebih Banyak
              </RouterLink>
            </template>
            <p
              v-else
              class="-mt-4 text-slate-500"
            >
              Tidak Ada Data
            </p>
          </div>
        </div>
        <div
          class="col-span-12 mt-3 md:col-span-6"
        >
          <div class="flex items-center h-10 intro-x">
            <h2 class="mr-5 text-lg font-medium truncate">
              Jenis Penghargaan Terbanyak
            </h2>
          </div>
          <div
            v-if="loading.listPenghargaan"
            class="flex justify-center py-8 intro-x"
          >
            <LoadingIcon
              icon="puff"
              class="w-16 h-16"
              color="#0B5351"
            />
          </div>
          <div
            v-else
            class="mt-5"
          >
            <template v-if="info.listPenghargaan.length">
              <div
                v-for="(item, key) in info.listPenghargaan"
                :key="key"
                class="intro-x"
              >
                <div class="flex items-center px-5 py-3 mb-3 box zoom-in">
                  <div class="mr-auto">
                    <div class="font-medium">
                      {{ item.title }}
                    </div>
                  </div>
                  <div class="text-success font-bold">
                    {{ numberFormat(item.total) }}
                  </div>
                </div>
              </div>
              <RouterLink
                :to="{
                  path: '/poin/type',
                  query: {
                    tahun_ajar_id: selectedTahunAjar,
                    type: 'Penghargaan',
                  }
                }"
                class="block w-full py-1 text-right rounded-md intro-x border-slate-400 text-slate-500 hover:text-primary"
              >
                Lihat Lebih Banyak
              </RouterLink>
            </template>
            <p
              v-else
              class="-mt-4 text-slate-500"
            >
              Tidak Ada Data
            </p>
          </div>
        </div>
        <div
          class="col-span-12 mt-3 md:col-span-6"
        >
          <div class="flex items-center h-10 intro-x">
            <h2 class="mr-5 text-lg font-medium truncate">
              Jenis Pelanggaran Terbanyak
            </h2>
          </div>
          <div
            v-if="loading.listPelanggaran"
            class="flex justify-center py-8 intro-x"
          >
            <LoadingIcon
              icon="puff"
              class="w-16 h-16"
              color="#0B5351"
            />
          </div>
          <div
            v-else
            class="mt-5"
          >
            <template v-if="info.listPelanggaran.length">
              <div
                v-for="(item, key) in info.listPelanggaran"
                :key="key"
                class="intro-x"
              >
                <div class="flex items-center px-5 py-3 mb-3 box zoom-in">
                  <div class="mr-auto">
                    <div class="font-medium">
                      {{ item.title }}
                    </div>
                  </div>
                  <div class="text-danger font-bold">
                    {{ item.total }}
                  </div>
                </div>
              </div>
              <RouterLink
                :to="{
                  path: '/poin/type',
                  query: {
                    tahun_ajar_id: selectedTahunAjar,
                    type: 'Pelanggaran',
                  }
                }"
                class="block w-full py-1 text-right rounded-md intro-x border-slate-400 text-slate-500 hover:text-primary"
              >
                Lihat Lebih Banyak
              </RouterLink>
            </template>
            <p
              v-else
              class="-mt-4 text-slate-500"
            >
              Tidak Ada Data
            </p>
          </div>
        </div>
        <div
          class="col-span-12 mt-3 md:col-span-6"
        >
          <div class="flex items-center h-10 intro-x">
            <h2 class="mr-5 text-lg font-medium truncate">
              Grafik Jumlah Penghargaan
            </h2>
          </div>
          <div
            v-if="loading.graphPenghargaan"
            class="flex justify-center py-8 intro-x"
          >
            <LoadingIcon
              icon="puff"
              class="w-16 h-16"
              color="#0B5351"
            />
          </div>
          <div
            v-else
            class="mt-5"
          >
            <div
              v-if="info.graphCountPenghargaan.length"
              class="intro-x"
            >
              <div class="flex items-center px-5 pt-5 pb-3 box zoom-in">
                <DashboardPoinGraph
                  v-model="info.graphCountPenghargaan"
                  :width="300"
                  :height="300"
                  variant="success"
                  label="Jumlah Penghargaan"
                />
              </div>
            </div>
            <p
              v-else
              class="-mt-4 text-slate-500"
            >
              Tidak Ada Data
            </p>
          </div>
        </div>
        <div
          class="col-span-12 mt-3 md:col-span-6"
        >
          <div class="flex items-center h-10 intro-x">
            <h2 class="mr-5 text-lg font-medium truncate">
              Grafik Jumlah Pelanggaran
            </h2>
          </div>
          <div
            v-if="loading.graphPelanggaran"
            class="flex justify-center py-8 intro-x"
          >
            <LoadingIcon
              icon="puff"
              class="w-16 h-16"
              color="#0B5351"
            />
          </div>
          <div
            v-else
            class="mt-5"
          >
            <div
              v-if="info.graphCountPelanggaran.length"
              class="intro-x"
            >
              <div class="flex items-center px-5 pt-5 pb-3 box zoom-in">
                <DashboardPoinGraph
                  v-model="info.graphCountPelanggaran"
                  :width="300"
                  :height="300"
                  variant="danger"
                  label="Jumlah Pelanggaran"
                />
              </div>
            </div>
            <p
              v-else
              class="-mt-4 text-slate-500"
            >
              Tidak Ada Data
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-12 2xl:col-span-3">
      <div class="pb-10 -mb-10 2xl:border-l">
        <div class="grid grid-cols-12 2xl:pl-6 gap-x-6 2xl:gap-x-0 gap-y-6">
          <div
            class="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 mt-8"
          >
            <div class="flex items-center h-10 intro-x">
              <h2 class="mr-5 text-lg font-medium truncate">
                Aktivitas Poin
              </h2>
            </div>
            <div
              v-if="loading.latestLog"
              class="flex justify-center py-8 intro-x"
            >
              <LoadingIcon
                icon="puff"
                class="w-16 h-16"
                color="#0B5351"
              />
            </div>
            <div
              v-else
              class="mt-5"
            >
              <template v-if="poinLog.latestLog?.length">
                <div
                  v-for="(item, key) in poinLog.latestLog"
                  :key="key"
                  class="intro-x"
                >
                  <div class="flex items-center px-5 py-3 mb-3 box zoom-in">
                    <div
                      class="flex-none w-10 h-10 overflow-hidden rounded-full image-fit"
                    >
                      <img
                        alt=""
                        :src="getUserPhoto(item?.foto)"
                      >
                    </div>
                    <div class="ml-4 mr-auto">
                      <div class="font-medium">
                        {{ item.nama }}
                      </div>
                      <div class="text-slate-500 text-xs mt-0.5">
                        {{ item.nis }}
                      </div>
                      <div class="text-slate-500 text-xs mt-0.5">
                        {{ dateFormat(item.created_at) }},
                        {{ timeFormat(item.created_at) }}
                      </div>
                    </div>
                    <PoinType
                      v-model="item.poin"
                      :type="item.type"
                    />
                  </div>
                </div>
                <RouterLink
                  to="/poin/log"
                  class="block w-full py-1 text-right rounded-md intro-x border-slate-400 text-slate-500 hover:text-primary"
                >
                  Lihat Lebih Banyak
                </RouterLink>
              </template>
              <p
                v-else
                class="-mt-4 text-slate-500"
              >
                Tidak Ada Data
              </p>
            </div>
          </div>
          <div
            v-if="auth.isAdmin"
            class="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12"
          >
            <div class="flex items-center h-10 intro-x">
              <h2 class="mr-5 text-lg font-medium truncate">
                Aktivitas Login
              </h2>
            </div>
            <div
              v-if="loading.loginLog"
              class="flex justify-center py-8 intro-x"
            >
              <LoadingIcon
                icon="puff"
                class="w-16 h-16"
                color="#0B5351"
              />
            </div>
            <div
              v-else
              class="mt-5"
            >
              <template v-if="info.loginLog.length">
                <div
                  v-for="(item, key) in info.loginLog"
                  :key="key"
                  class="intro-x"
                >
                  <div class="flex items-center px-5 py-3 mb-3 box zoom-in">
                    <div
                      class="flex-none w-10 h-10 overflow-hidden rounded-full image-fit"
                    >
                      <img
                        alt=""
                        :src="getUserPhoto(item?.foto)"
                      >
                    </div>
                    <div class="ml-4 mr-auto">
                      <div class="font-medium">
                        {{ item.nama }}
                      </div>
                      <div class="text-slate-500 text-xs mt-0.5">
                        {{ item.role }}
                      </div>
                      <div class="text-slate-500 text-xs mt-0.5">
                        {{ dateFormat(item.created_at) }},
                        {{ timeFormat(item.created_at) }}
                      </div>
                    </div>
                    <Tippy
                      as="div"
                      :content="item.action"
                    >
                      <div
                        v-if="item.action === 'Successful Login'"
                        class="text-success flex"
                      >
                        <Lucide
                          icon="CheckCircle"
                          class="w-6 h-6"
                        />
                      </div>
                      <div
                        v-else-if="item.action === 'Failed Login Attempt'"
                        class="text-danger flex"
                      >
                        <Lucide
                          icon="XCircle"
                          class="w-6 h-6"
                        />
                      </div>
                      <div
                        v-else-if="item.action === 'Change Password Attempt'"
                        class="text-warning flex"
                      >
                        <Lucide
                          icon="AlertTriangle"
                          class="w-6 h-6"
                        />
                      </div>
                      <div
                        v-else-if="item.action === 'Password Changed'"
                        class="text-warning flex"
                      >
                        <Lucide
                          icon="FormInput"
                          class="w-6 h-6"
                        />
                      </div>
                    </Tippy>
                  </div>
                </div>
                <RouterLink
                  to="/login/log"
                  class="block w-full py-1 text-right rounded-md intro-x border-slate-400 text-slate-500 hover:text-primary"
                >
                  Lihat Lebih Banyak
                </RouterLink>
              </template>
              <p
                v-else
                class="-mt-4 text-slate-500"
              >
                Tidak Ada Data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Page Layout -->
</template>
