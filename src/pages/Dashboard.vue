<script setup lang="ts">
import {defineAsyncComponent} from "vue";
import {useAuthStore} from "../stores/modules/auth";

const DashboardAdmin = defineAsyncComponent(() => import("../components/Dashboard/DashboardAdmin.vue"));
const DashboardSiswa = defineAsyncComponent(() => import("../components/Dashboard/DashboardSiswa.vue"));

const auth = useAuthStore()

</script>

<template>
  <DashboardAdmin v-if="auth.isAdmin || auth.isPegawai" />
  <DashboardSiswa v-else-if="auth.isSiswa" />
</template>
