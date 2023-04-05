<script setup lang="ts">
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {useKelasStore} from "../../stores/modules/kelas";
import {ref} from "vue";
import KelasModal from "../../components/Kelas/KelasModal.vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import {Kelas, KelasResponse} from "../../utils/interfaces/kelas";
import {useGlobalStore} from "../../stores/global";
import TomSelect from "../../base-components/TomSelect";
import {useJurusanStore} from "../../stores/modules/jurusan";
import {useTahunAjarStore} from "../../stores/modules/tahun-ajar";

const showModal = ref(false)

const global = useGlobalStore()
const kelas = useKelasStore()
const jurusan = useJurusanStore()
const tahunAjar = useTahunAjarStore()

const filter = ref({
  tahun_ajar_id: '',
  jurusan_id: '',
})

const getData = () => {
  if (!filter.value.tahun_ajar_id || !filter.value.jurusan_id) return
  kelas.getKelas(parseInt(filter.value.tahun_ajar_id), parseInt(filter.value.jurusan_id))
}

getData()

const showKelasModal = (item?: KelasResponse) => {
  kelas.selectedKelas = item
  showModal.value = true
}

const deleteKelas = (item: Kelas) => {
  global.showModal({
    type: 'danger',
    title: 'Konfirmasi',
    description: `Yakin untuk menghapus Kelas <span class="text-danger">${item.nama_kelas}</span>?`,
    icon: 'XCircle',
    buttonConfirmationText: 'Hapus',
    callback: () => handleDeleteKelas(item.id),
  })
}

const handleDeleteKelas = async (id: number): Promise<void> => {
  await kelas.deleteKelas(id)
  await getData()
}

const getTahunAjar = () => {
  tahunAjar.getTahunAjar({
    page: 1,
    per_page: -1,
  })
}

const getJurusan = () => {
  jurusan.getJurusan()
}

const handleSearchTahunAjar = (value:string) => {
  console.log(value)
}

getTahunAjar()
getJurusan()

</script>
<template>
  <KelasModal
    v-model="showModal"
    @success="getData"
  />
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      Kelas
    </h2>
    <Button
      class="gap-2"
      variant="primary"
      @click="showKelasModal()"
    >
      <Lucide icon="Plus" />
      Tambah Data
    </Button>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <div class="flex flex-wrap gap-2 mb-4">
      <TomSelect
        id="tahun_ajar_id"
        v-model="filter.tahun_ajar_id"
        placeholder="Pilih Tahun Ajar"
        style="width: 200px"
        @update:modelValue="getData"
        @search="handleSearchTahunAjar"
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
        </option>
      </TomSelect>
      <TomSelect
        id="jurusan_id"
        v-model="filter.jurusan_id"
        placeholder="Pilih Jurusan"
        style="width: 200px"
        @update:modelValue="getData"
      >
        <option value="">
          Pilih Jurusan
        </option>
        <option
          v-for="(item, key) in jurusan.jurusan"
          :key="key"
          :value="item.id"
        >
          {{ item.nama_jurusan }}
        </option>
      </TomSelect>
    </div>

    <MyTable
      v-if="filter.tahun_ajar_id && filter.jurusan_id"
      :pagination="false"
      :hide-search="true"
    >
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              #
            </Table.Th>
            <Table.Th>
              Kelas
            </Table.Th>
            <Table.Th>
              Wali Kelas
            </Table.Th>
            <Table.Th style="width: 200px" />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody
          v-if="kelas.kelas?.length"
          :data="kelas.kelas"
        >
          <Table.Tr
            v-for="(item, key) in kelas.kelas"
            :key="key"
          >
            <Table.Td>
              {{ key + 1 }}
            </Table.Td>
            <Table.Td>
              {{ item.nama_kelas }}
            </Table.Td>
            <Table.Td>
              {{ item.nama }}
            </Table.Td>
            <Table.Td>
              <div class="flex gap-2">
                <Button
                  class="gap-2"
                  variant="info"
                  @click="showKelasModal(item)"
                >
                  <Lucide
                    class="w-5 h-5"
                    icon="Users"
                  />
                  Siswa
                </Button>
                <Button
                  class="gap-2"
                  variant="warning"
                  @click="showKelasModal(item)"
                >
                  <Lucide
                    class="w-5 h-5"
                    icon="Edit"
                  />
                  Ubah
                </Button>
                <Button
                  class="gap-2"
                  variant="danger"
                  @click="deleteKelas(item)"
                >
                  <Lucide
                    class="w-5 h-5"
                    icon="Trash2"
                  />
                  Hapus
                </Button>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody v-else>
          <Table.Tr>
            <Table.Td
              colspan="99"
              class="text-center"
            >
              Tidak ada Data
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </MyTable>
  </div>
</template>
