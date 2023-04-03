<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import {ref, watch} from "vue";
import FormSelect from "../../Form/FormSelect.vue";
import FormInput from "../../Form/FormInput.vue";
import MyPagination from "../MyPagination/MyPagination.vue";
import debounce from "lodash-es/debounce";

interface TableProps {
  currentPage?: number;
  pageCount?: number;
  perPage?: number;
  search?: string;
  pagination?: boolean;
  hideSearch?: boolean;
}

interface MyTableEmit {
  (e: "updatePage", value: number): void;
  (e: "updatePerPage", value: number): void;
  (e: "updateSearch", value?: string): void;
}

const props = withDefaults(defineProps<TableProps>(), {
  currentPage: 1,
  pageCount: 1,
  perPage: 10,
  search: '',
  pagination: true,
  hideSearch: false,
})

const emit = defineEmits<MyTableEmit>();

const currentPage = ref(props.currentPage);
const pageCount = ref(props.pageCount);
const perPage = ref(props.perPage);
const search = ref(props.search);
const searchDebounce = ref(props.search);

watch(perPage, () => {
  if (perPage.value)
    emit("updatePerPage", perPage.value);
});

watch(search, () => {
  emit("updateSearch", search.value);
});

watch(currentPage, () => {
  if (currentPage.value)
    emit("updatePage", currentPage.value);
});

const handleUpdatePagination = () => {
  currentPage.value = props.currentPage
  pageCount.value = props.pageCount
  perPage.value = props.perPage
  search.value = props.search
}

watch(props, handleUpdatePagination)

const handleUpdatePage = (value: number) => {
  currentPage.value = value
}

const handleSearch = debounce((value: string) => {
  search.value = value
}, 1000)
</script>

<template>
  <div
    v-if="pagination && !hideSearch"
    class="flex flex-wrap w-full justify-between items-center intro-y sm:flex-row sm:flex-nowrap mb-5 gap-3"
  >
    <div
      v-if="pagination"
      class="flex items-center gap-2"
    >
      <span>Show</span>
      <FormSelect
        v-model.number="perPage"
        class=""
      >
        <option :value="10">
          10
        </option>
        <option :value="25">
          25
        </option>
        <option :value="50">
          50
        </option>
        <option :value="100">
          100
        </option>
      </FormSelect>
      <span>Data</span>
    </div>
    <FormInput
      v-if="!hideSearch"
      id="search"
      v-model.trim="searchDebounce"
      type="text"
      placeholder="Cari"
      class="w-64"
      @update:modelValue="handleSearch"
    />
  </div>
  <div class="overflow-x-auto">
    <slot />
  </div>
  <div
    v-if="pagination"
    class="flex flex-wrap justify-end mt-5"
  >
    <MyPagination
      :page="currentPage"
      :total-pages="pageCount"
      @update-page="handleUpdatePage"
    />
  </div>
</template>
