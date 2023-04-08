<script setup lang="ts">
import Lucide from "../base-components/Lucide";
import {useInfoStore} from "../stores/modules/info";
import {ref} from "vue";
import {dateFormat, numberFormat, timeFormat} from "../utils/helper";
import LoadingIcon from "../base-components/LoadingIcon/LoadingIcon.vue";
import {usePoinLogStore} from "../stores/modules/poin-log";
import {useTahunAjarStore} from "../stores/modules/tahun-ajar";
import TomSelect from "../base-components/TomSelect";
import Tippy from "../base-components/Tippy";

const info = useInfoStore()
const poinLog = usePoinLogStore()
const tahunAjar = useTahunAjarStore()

const loading = ref({
  countPenghargaan: true,
  countPelanggaran: true,
  listBigger: true,
  listSmaller: true,
  latestLog: true,
  listPenghargaan: true,
  listPelanggaran: true,
  loginLog: true,
})

const loaded = ref(false)

const selectedTahunAjar = ref<string>('')

const getData = () => {
  loading.value = {
    countPenghargaan: true,
    countPelanggaran: true,
    listBigger: true,
    listSmaller: true,
    latestLog: true,
    listPenghargaan: true,
    listPelanggaran: true,
    loginLog: true,
  }

  info.countPoin("Penghargaan", selectedTahunAjar.value).finally(() => {
    loading.value.countPenghargaan = false
  })
  info.countPoin("Pelanggaran", selectedTahunAjar.value).finally(() => {
    loading.value.countPelanggaran = false
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
  info.getLoginLog({
    page: 1,
    per_page: 5,
  }).finally(() => {
    loading.value.loginLog = false
  })
}

tahunAjar.getTahunAjar({
  page: 1,
  per_page: -1,
}).then(() => {
  selectedTahunAjar.value = tahunAjar.activeTahunAjar?.id.toString() || ''
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
  <!--  <div class="flex items-center mt-8">-->
  <!--    <h2 class="mr-auto text-lg font-medium">-->
  <!--      Dashboard-->
  <!--    </h2>-->
  <!--  </div>-->
  <!-- BEGIN: Page Layout -->

  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 2xl:col-span-9">
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 mt-8">
          <div class="flex items-center h-10 intro-y">
            <h2 class="mr-5 text-lg font-medium truncate">
              Dashboard
            </h2>
            <div class="ml-auto flex items-center gap-4">
              <div>
                <TomSelect
                    id="tahun_ajar_id"
                    v-model="selectedTahunAjar"
                    placeholder="Pilih Tahun Ajar"
                    style="width: 200px"
                    @update:modelValue="getData"
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
                    class="mt-6 text-3xl font-medium leading-8"
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
                      v-if="!loading.countPenghargaan"
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
                    class="mt-6 text-3xl font-medium leading-8"
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
                      v-if="!loading.countPelanggaran"
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
                    class="mt-6 text-3xl font-medium leading-8"
                  >
                    {{ numberFormat(info.totalPelanggaran) }}
                  </div>
                  <div class="mt-1 text-base text-slate-500">
                    Total Pelanggaran
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
                    alt="Midone Tailwind HTML Admin Template"
                    src="/src/assets/images/fakers/food-beverage-1.jpg"
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
                <div class="text-success font-bold">
                  {{ numberFormat(item.poin) }}
                </div>
              </div>
            </div>
            <a
              href=""
              class="block w-full py-1 text-right rounded-md intro-x border-slate-400 text-slate-500 hover:text-primary"
            >
              Lihat Lebih Banyak
            </a>
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
                    alt="Midone Tailwind HTML Admin Template"
                    src="/src/assets/images/fakers/food-beverage-1.jpg"
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
                <div class="text-danger font-bold">
                  {{ numberFormat(item.poin) }}
                </div>
              </div>
            </div>
            <a
              href=""
              class="block w-full py-1 text-right rounded-md intro-x border-slate-400 text-slate-500 hover:text-primary"
            >
              Lihat Lebih Banyak
            </a>
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
          <div v-else class="mt-5">
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
            <a
                href=""
                class="block w-full py-1 text-right rounded-md intro-x border-slate-400 text-slate-500 hover:text-primary"
            >
              Lihat Lebih Banyak
            </a>
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
          <div v-else class="mt-5">
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
            <a
                href=""
                class="block w-full py-1 text-right rounded-md intro-x border-slate-400 text-slate-500 hover:text-primary"
            >
              Lihat Lebih Banyak
            </a>
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
            <div v-else class="mt-5">
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
                          alt="Midone Tailwind HTML Admin Template"
                          src="/src/assets/images/fakers/food-beverage-1.jpg"
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
                    <div :class="[
                        item.poin > 0 && 'text-success',
                        item.poin < 0 && 'text-danger',
                        'font-bold'
                    ]">
                      {{ item.poin }}
                    </div>
                  </div>
                </div>
              </template>
              <a
                  href=""
                  class="block w-full py-1 text-right rounded-md intro-x border-slate-400 text-slate-500 hover:text-primary"
              >
                Lihat Lebih Banyak
              </a>
            </div>
          </div>
          <div
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
            <div v-else class="mt-5">
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
                      alt="Midone Tailwind HTML Admin Template"
                      src="/src/assets/images/fakers/food-beverage-1.jpg"
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
                      <Lucide icon="CheckCircle" class="w-6 h-6"/>
                    </div>
                    <div
                        v-else
                        class="text-danger flex"
                    >
                      <Lucide icon="XCircle" class="w-6 h-6"/>
                    </div>
                  </Tippy>
                </div>
              </div>
              <a
                  href=""
                  class="block w-full py-1 text-right rounded-md intro-x border-slate-400 text-slate-500 hover:text-primary"
              >
                Lihat Lebih Banyak
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Page Layout -->
</template>
