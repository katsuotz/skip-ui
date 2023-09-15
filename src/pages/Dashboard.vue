<script setup lang="ts">
import {defineAsyncComponent} from "vue";
import {useAuthStore} from "../stores/modules/auth";

const DashboardAdmin = defineAsyncComponent(() => import("../components/Dashboard/DashboardAdmin.vue"));
const DashboardSiswa = defineAsyncComponent(() => import("../components/Dashboard/DashboardSiswa.vue"));

const auth = useAuthStore()

</script>

<template>
  <DashboardAdmin v-if="!auth.isSiswa && auth.canView" />
  <DashboardSiswa v-else-if="auth.isSiswa" />
  <template v-else>
    <div class="flex items-center sm:mt-8 mt-6 intro-y justify-between">
      <h2 class="mr-auto text-lg font-medium">
        Home
      </h2>
    </div>
    <div
      class="p-5 mt-5 intro-y box flex flex-col gap-4"
    >
      Welcome to POIN!
    </div>
  </template>
</template>
