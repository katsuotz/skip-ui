<script setup lang="ts">
import {useJurusanStore} from "../../stores/modules/jurusan";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";
import Tab from "../../base-components/Headless/Tab";
import CompareKelasForm from "./CompareKelasForm.vue";
import CompareSiswaForm from "./CompareSiswaForm.vue";

const jurusan = useJurusanStore()
const tahunAjar = useTahunAjarStore()

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

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      Bandingkan
    </h2>
  </div>
  <Tab.Group class="flex flex-col items-start">
    <Tab.List
      class="mt-4 intro-y box rounded-md"
      variant="boxed-tabs"
    >
      <Tab :full-width="false">
        <Tab.Button
          class="w-full py-2"
          as="button"
        >
          Kelas
        </Tab.Button>
      </Tab>
      <Tab :full-width="false">
        <Tab.Button
          class="w-full py-2"
          as="button"
        >
          Siswa
        </Tab.Button>
      </Tab>
    </Tab.List>
    <Tab.Panels class="mt-5 w-full">
      <Tab.Panel>
        <CompareKelasForm />
      </Tab.Panel>
      <Tab.Panel>
        <CompareSiswaForm />
      </Tab.Panel>
    </Tab.Panels>
  </Tab.Group>
</template>
