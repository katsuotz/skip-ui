<script setup lang="ts">
import Dropzone from "../../base-components/Dropzone";
import {computed, ref, watch} from "vue";
import {UploadType} from "../../utils/interfaces/helper";
import Button from "../../base-components/Button";
import {useAuthStore} from "../../stores/modules/auth";
import {getFileUrl} from "../../utils/helper";

interface FileUploadProps {
  modelValue?: string | string[] | null;
  isManual?: boolean;
  acceptedFiles?: UploadType;
  showUploadedFile?: boolean;
  disabled?: boolean;
  fileName?: string;
}

interface FileUploadEmit {
  (e: "update:modelValue", value: string | string[] | null): void;
  (e: "added", value: File): void;
  (e: "removed", value: File): void;
}

const props = withDefaults(defineProps<FileUploadProps>(), {
  isManual: false,
  showUploadedFile: false,
  acceptedFiles: 'pdf_img',
  fileName: '',
});

const emit = defineEmits<FileUploadEmit>();

const auth = useAuthStore()
const localValue = ref(props.modelValue)

watch(localValue, () => {
  if (localValue.value !== undefined)
    emit('update:modelValue', localValue.value)
})

const acceptedFiles = computed((): string | undefined => {
  switch (props.acceptedFiles) {
  case 'xlsx':
    return '.xlsx,.csv'
  case 'pdf':
    return '.pdf'
  case 'img':
    return '.png, .jpg, .jpeg, .webp'
  case 'pdf_img':
    return '.pdf, .png, .jpg, .jpeg, .webp'
  default:
    return undefined
  }
})

const acceptedFilesText = computed((): string | null => {
  switch (props.acceptedFiles) {
  case 'xlsx':
    return 'Excel (.xlsx)'
  case 'pdf':
    return 'Dokumen PDF'
  case 'img':
    return 'Foto / Gambar'
  case 'pdf_img':
    return 'Dokumen PDF / Foto / Gambar'
  default:
    return null
  }
})

const handleRemoved = (value:File) => {
  localValue.value = null
  emit('removed', value)
}

const api = import.meta.env.VITE_API

</script>

<template>
  <div class="flex flex-col gap-2">
    <Dropzone
      v-if="!disabled"
      v-model="localValue"
      :options="{
        url: isManual ? '/' : `${api}/upload`,
        maxFilesize: 2,
        acceptedFiles,
        addRemoveLinks: true,
        headers: {
          'Authorization': 'Bearer ' + (auth.token || ''),
        },
      }"
      :file-name="props.fileName"
      class="dropzone"
      @added="value => emit('added', value)"
      @removed="handleRemoved"
    >
      <div>
        <span class="font-bold italic">Klik Disini</span> atau <span class="font-bold italic">Geser</span> untuk melakukan upload
        <span class="font-bold">
          <template v-if="acceptedFilesText">{{ acceptedFilesText }}</template>
        </span>
      </div>
    </Dropzone>
    <div
      v-if="showUploadedFile && typeof localValue === 'string' && localValue"
      class="flex"
    >
      <Button
        as="a"
        type="button"
        :href="getFileUrl(localValue)"
        variant="primary"
        target="_blank"
      >
        Lihat File
      </Button>
    </div>
  </div>
</template>
