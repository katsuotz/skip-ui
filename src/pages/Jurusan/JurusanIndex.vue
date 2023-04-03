<script setup lang="ts">
import Table from "../../base-components/Table";
import MyTable from "../../base-components/My/MyTable/MyTable.vue";
import {useJurusanStore} from "../../stores/modules/jurusan";
import {ref} from "vue";
import {countPaginationNumber} from "../../utils/helper";
import JurusanModal from "../../components/Jurusan/JurusanModal.vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import FormSwitch from "../../base-components/Form/FormSwitch";
import {useGlobalStore} from "../../stores/global";
import {Jurusan} from "../../utils/interfaces/jurusan";

const showModal = ref(false)

const global = useGlobalStore()
const jurusan = useJurusanStore()

const getData = () => {
  jurusan.getJurusan()
}

getData()

const editJurusan = (item: Jurusan) => {
  jurusan.selectedJurusan = item
  showModal.value = true
}

const deleteJurusan = (item: Jurusan) => {
  global.showModal({
    type: 'danger',
    title: 'Konfirmasi',
    description: `Yakin untuk menghapus Jurusan <span class="text-danger">${item.nama_jurusan}</span>?`,
    icon: 'XCircle',
    buttonConfirmationText: 'Hapus',
    callback: () => handleDeleteTahunAajar(item.id),
  })
}

const handleDeleteTahunAajar = async (id: number): Promise<void> => {
  await jurusan.deleteJurusan(id)
  await getData()
}

</script>
<template>
  <JurusanModal
      v-model="showModal"
      @success="getData"
  />
  <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
    <h2 class="mr-auto text-lg font-medium">
      Jurusan
    </h2>
    <Button
        class="gap-2"
        variant="info"
        @click="showModal = true"
    >
      <Lucide icon="Plus"/>
      Tambah Data
    </Button>
  </div>
  <div class="p-5 mt-5 intro-y box">
    <MyTable
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
              Jurusan
            </Table.Th>
            <Table.Th style="width: 200px"/>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody :data="jurusan.jurusan">
          <Table.Tr
              v-for="(item, key) in jurusan.jurusan"
              :key="key"
          >
            <Table.Td>
              {{ key + 1 }}
            </Table.Td>
            <Table.Td>
              {{ item.nama_jurusan }}
            </Table.Td>
            <Table.Td>
              <div class="flex gap-2">
                <Button
                    class="gap-2"
                    variant="warning"
                    @click="editJurusan(item)"
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
                    @click="deleteJurusan(item)"
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
      </Table>
    </MyTable>
  </div>
</template>
