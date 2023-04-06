<script setup lang="ts">
import {computed, defineAsyncComponent, ref} from "vue";
import {useKelasStore} from "../../stores/modules/kelas";
import Tab from "../../base-components/Headless/Tab";
import KelasAddSiswaForm from "../../components/Kelas/KelasAddSiswaForm.vue";
import {useRoute} from "vue-router";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import {useJurusanStore} from "../../stores/modules/jurusan";
const NaikKelasForm = defineAsyncComponent(() => import("../../components/Kelas/NaikKelasForm.vue"))

const kelas = useKelasStore()
const tahunAjar = useTahunAjarStore()
const jurusan = useJurusanStore()

const route = useRoute()

const kelas_id: string = route.params.kelas_id.toString()

const loaded = ref(false)

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

kelas.getKelasByID(kelas_id).then(() => {
  loaded.value = true
})

const tahunAjarKelas = computed(() => tahunAjar.tahunAjar.find(e => e.id === kelas.selectedKelas?.tahun_ajar_id))

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      Tambah Siswa - {{ kelas.selectedKelas?.nama_kelas }} - {{ tahunAjarKelas?.tahun_ajar }}
    </h2>
  </div>
  <div
    v-if="loaded"
    class="p-5 mt-5 intro-y box"
  >
    <Tab.Group>
      <Tab.List variant="link-tabs">
        <Tab :full-width="false">
          <Tab.Button
            class="w-full py-2"
            as="button"
          >
            Tambah Siswa
          </Tab.Button>
        </Tab>
        <Tab :full-width="false">
          <Tab.Button
            class="w-full py-2"
            as="button"
          >
            Naik Kelas
          </Tab.Button>
        </Tab>
      </Tab.List>
      <Tab.Panels class="mt-5">
        <Tab.Panel class="leading-relaxed flex flex-col gap-4">
          <KelasAddSiswaForm />
        </Tab.Panel>
        <Tab.Panel class="leading-relaxed">
          <NaikKelasForm />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  </div>
</template>
