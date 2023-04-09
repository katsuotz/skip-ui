<script setup lang="ts">
import Lucide from "../../base-components/Lucide";
import logoUrl from "../../assets/images/logo.svg";
import {Menu} from "../../base-components/Headless";
import {useAuthStore} from "../../stores/modules/auth";
import {defineAsyncComponent, ref, watch} from "vue";
import {getUserPhoto} from "../../utils/helper";
import Breadcrumb from "../../base-components/Breadcrumb";
import {useRoute} from "vue-router";

const EditProfileModal = defineAsyncComponent(() => import("../User/EditProfileModal.vue"));

const props = defineProps<{
  layout?: "side-menu" | "simple-menu" | "top-menu";
}>();

const auth = useAuthStore()

const logout = () => {
  auth.logout()
}

const showModalProfile = ref(false)

const route = useRoute()

const breadcrumbs = ref(route.meta?.breadcrumbs)

watch(() => route.meta?.breadcrumbs, () => {
  breadcrumbs.value = route.meta?.breadcrumbs
})
</script>

<template>
  <EditProfileModal
    v-model="showModalProfile"
    @success="auth.getMyData"
  />

  <div
    :class="[
      'h-[70px] md:h-[65px] z-[51] border-b border-white/[0.08] mt-12 md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 md:border-b-0 relative md:fixed md:inset-x-0 md:top-0 sm:px-8 md:px-10 md:pt-10 md:bg-gradient-to-b md:from-slate-100 md:to-transparent dark:md:from-darkmode-700',
      props.layout == 'top-menu' && 'dark:md:from-darkmode-800',
      'before:content-[\'\'] before:absolute before:h-[65px] before:inset-0 before:top-0 before:mx-7 before:bg-primary/30 before:mt-3 before:rounded-xl before:hidden before:md:block before:dark:bg-darkmode-600/30',
      'after:content-[\'\'] after:absolute after:inset-0 after:h-[65px] after:mx-3 after:bg-primary after:mt-5 after:rounded-xl after:shadow-md after:hidden after:md:block after:dark:bg-darkmode-600',
    ]"
  >
    <div class="flex items-center h-full">
      <!-- BEGIN: Logo -->
      <RouterLink
        :to="{ name: 'dashboard' }"
        :class="[
          '-intro-x hidden md:flex',
          props.layout == 'side-menu' && 'xl:w-[180px]',
          props.layout == 'simple-menu' && 'xl:w-auto',
          props.layout == 'top-menu' && 'w-auto',
        ]"
      >
        <img
          alt="Sistem Kredit Poin"
          class="w-6"
          :src="logoUrl"
        >
        <span
          :class="[
            'ml-3 text-lg text-white',
            props.layout == 'side-menu' && 'hidden xl:block',
            props.layout == 'simple-menu' && 'hidden',
          ]"
        >
          SKIP
        </span>
      </RouterLink>
      <!-- END: Logo -->
      <Breadcrumb
        v-if="breadcrumbs?.length"
        light
        :class="[
          'h-[45px] md:ml-10 md:border-l border-white/[0.08] dark:border-white/[0.08] mr-auto -intro-x',
          props.layout != 'top-menu' && 'md:pl-6',
          props.layout == 'top-menu' && 'md:pl-10',
        ]"
      >
        <Breadcrumb.Link
          v-for="(item, key) in breadcrumbs"
          :key="key"
          :index="key"
          :active="key + 1 === breadcrumbs.length"
        >
          {{ item }}
        </Breadcrumb.Link>
      </Breadcrumb>

      <!-- BEGIN: Account Menu -->
      <Menu class="ml-auto">
        <Menu.Button
          class="flex items-center cursor-default -intro-x"
        >
          <div class="text-white text-right mr-4">
            <div class="font-medium">
              {{ auth.user?.nama }}
            </div>
            <div class="text-xs dark:text-slate-500">
              {{ auth.user?.role }}
            </div>
          </div>
          <img
            alt=""
            :src="getUserPhoto(auth.user?.foto)"
            class="w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit cursor-pointer bg-white object-cover object-center"
          >
        </Menu.Button>
        <Menu.Items
          class="p-2 border-transparent rounded-md dark:bg-darkmode-600 dark:border-transparent w-56 mt-px relative bg-white shadow-lg"
        >
          <Menu.Item
            class="hover:bg-dark/5"
            @click="showModalProfile = true"
          >
            <Lucide
              icon="User"
              class="w-4 h-4 mr-2"
            />
            Ubah Profil
          </Menu.Item>
          <Menu.Item
            class="hover:bg-dark/5"
            @click="logout"
          >
            <Lucide
              icon="LogOut"
              class="w-4 h-4 mr-2"
            />
            Logout
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <!-- END: Account Menu -->
    </div>
  </div>
</template>
