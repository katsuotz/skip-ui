<script setup lang="ts">
import {HTMLAttributes, ref, inject, onMounted} from "vue";
import DropzoneJs, {DropzoneOptions} from "dropzone";
import {init} from "./dropzone";
import {toLowerCase} from "../../utils/helper";
import {useAuthStore} from "../../stores/modules/auth";

export type ProvideDropzone = (el: DropzoneElement) => void;

export interface DropzoneElement extends HTMLDivElement {
  dropzone: DropzoneJs;
}

interface DropzoneProps extends HTMLAttributes {
  modelValue?: string | string[] | null;
  options: DropzoneOptions;
  refKey?: string;
  isMultiple?: boolean;
  fileName: string;
}

interface DropzoneEmit {
  (e: "update:modelValue", value: string | string[] | null): void;
  (e: "added", value: File): void;
  (e: "removed", value: File): void;
}

const emit = defineEmits<DropzoneEmit>();

const props = defineProps<DropzoneProps>();

const fileUploadRef = ref<DropzoneElement>();

const bindInstance = (el: DropzoneElement) => {
  if (props.refKey) {
    const bind = inject<ProvideDropzone>(`bind[${props.refKey}]`);
    if (bind) {
      bind(el);
    }
  }
};

const vFileUploadDirective = {
  mounted(el: DropzoneElement) {
    init(el, props);
  },
};

const auth = useAuthStore()
const currentFile = ref()

const isDocument = (ext:string) => {
  return ['.pdf', 'xlsx', '.csv'].includes(ext)
}

onMounted(() => {
  if (fileUploadRef.value) {
    bindInstance(fileUploadRef.value);
  }

  const elDropzoneRef = fileUploadRef.value;

  elDropzoneRef?.dropzone.on('addedfile', (file: any) => {
    if (!props.isMultiple) {
      if (currentFile.value?.name) {
        elDropzoneRef?.dropzone?.removeFile(currentFile.value)
        currentFile.value = null
      }

      if (file) {
        currentFile.value = file
      }

      emit('added', file)
    }
  })

  elDropzoneRef?.dropzone.on('removedfile', (file: File) => {
    if (!props.isMultiple) {
      currentFile.value = null
      emit('removed', file)
    }
  })

  elDropzoneRef?.dropzone.on('success', (file: any) => {
    const response = JSON.parse(file.xhr.response)
    emit("update:modelValue", response.data.url);
  })

  elDropzoneRef?.dropzone.on('sending', (file, xhr, formData) => {
    formData.append('filename', toLowerCase(auth.user?.username || ''))
    formData.append('folder', 'file')
  })

  if (typeof props.modelValue === 'string' && props.modelValue) {
    const ext: string = '.' + props.modelValue.split('.').pop();
    const path = isDocument(ext) ? '/assets/images/file-text.png' : '/assets/images/file-image.png'

    const file: any = {size: 1000000, name: props.modelValue}
    elDropzoneRef?.dropzone.displayExistingFile(file, path)
  }
});

</script>

<template>
  <div
    ref="fileUploadRef"
    v-file-upload-directive
    class="[&.dropzone]:border-2 [&.dropzone]:border-dashed dropzone [&.dropzone]:border-darkmode-200/10 [&.dropzone]:dark:bg-darkmode-600 [&.dropzone]:dark:border-white/5"
  >
    <div class="dz-message">
      <slot />
    </div>
  </div>
</template>
