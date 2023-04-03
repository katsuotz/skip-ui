<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import {ref, watch, onMounted} from "vue";
import Pagination from '../../Pagination'
import Lucide from '../../Lucide'

interface PaginationProps {
  page: number;
  totalPages: number;
}

const props = defineProps<PaginationProps>()
const emit = defineEmits(['updatePage'])

const startPage = ref(1)
const endPage = ref(1)
const totalGeneratedPages = ref(1)

const handleUpdatePagination = () => {
  startPage.value = props.page - 2
  endPage.value = props.page + 2

  if (startPage.value <= 0) startPage.value = 1
  if (endPage.value >= props.totalPages) endPage.value = props.totalPages

  totalGeneratedPages.value = endPage.value - startPage.value + 1
}

handleUpdatePagination()

const updatePage = (page = 1) => {
  emit('updatePage', page)
}

onMounted(() => {
  watch(props, handleUpdatePagination)
})
</script>

<template>
  <Pagination>
    <Pagination.Link
      :disabled="page === 1"
      @click="!(page === 1) && updatePage(page - 1)"
    >
      <Lucide
        icon="ChevronLeft"
        class="w-4 h-4"
      />
    </Pagination.Link>
    <Pagination.Link
      v-if="startPage !== 1"
      @click="updatePage(1)"
    >
      1
    </Pagination.Link>
    <Pagination.Link
      v-if="startPage > 1"
      disabled
    >
      ...
    </Pagination.Link>
    <Pagination.Link
      v-for="n in totalGeneratedPages"
      :key="n"
      :active="(n + startPage - 1) === page"
      :disabled="(n + startPage - 1) === page"
      @click="!((n + startPage - 1) === page) && updatePage(n + startPage - 1)"
    >
      {{ n + startPage - 1 }}
    </Pagination.Link>
    <Pagination.Link
      v-if="endPage < totalPages"
      disabled
    >
      ...
    </Pagination.Link>
    <Pagination.Link
      v-if="endPage !== totalPages"
      @click="updatePage(totalPages)"
    >
      {{ totalPages }}
    </Pagination.Link>
    <Pagination.Link
      :disabled="page === totalPages"
      @click="!(page === totalPages) && updatePage(page + 1)"
    >
      <Lucide
        icon="ChevronRight"
        class="w-4 h-4"
      />
    </Pagination.Link>
  </Pagination>
</template>
