<script setup lang="ts">
import {defineAsyncComponent, ref} from "vue";
import {useKelasStore} from "../../stores/modules/kelas";
import Tab from "../../base-components/Headless/Tab";
import KelasAddSiswaForm from "../../components/Kelas/KelasAddSiswaForm.vue";
import {useRoute} from "vue-router";
const NaikKelasForm = defineAsyncComponent(() => import("../../components/Kelas/NaikKelasForm.vue"))

const kelas = useKelasStore()

const route = useRoute()

const kelas_id: string = route.params.kelas_id.toString()

const loaded = ref(false)

kelas.getKelasByID(kelas_id).then(() => {
  loaded.value = true
})

</script>
<template>
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      Tambah Siswa - {{ kelas.selectedKelas?.nama_kelas }}
    </h2>
  </div>
  <div
    v-if="loaded"
    class="p-5 mt-5 intro-y box"
  >
    <NaikKelasForm />
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
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  </div>
</template>
