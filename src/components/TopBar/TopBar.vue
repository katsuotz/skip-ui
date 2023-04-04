<script setup lang="ts">
import Lucide from "../../base-components/Lucide";
import logoUrl from "../../assets/images/logo.svg";
import {Menu} from "../../base-components/Headless";
import {useAuthStore} from "../../stores/modules/auth";

const props = defineProps<{
  layout?: "side-menu" | "simple-menu" | "top-menu";
}>();

const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
}
</script>

<template>
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
        :to="{ name: 'side-menu-page-1' }"
        :class="[
          '-intro-x hidden md:flex',
          props.layout == 'side-menu' && 'xl:w-[180px]',
          props.layout == 'simple-menu' && 'xl:w-auto',
          props.layout == 'top-menu' && 'w-auto',
        ]"
      >
        <img
          alt="Enigma Tailwind HTML Admin Template"
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
      <!-- BEGIN: Account Menu -->
      <Menu class="ml-auto">
        <Menu.Button
          class="flex items-center cursor-default -intro-x"
        >
          <div class="text-white text-right mr-4">
            <div class="font-medium">
              {{ authStore.user?.profile?.nama }}
            </div>
            <div class="text-xs dark:text-slate-500">
              {{ authStore.user?.role }}
            </div>
          </div>
          <img
            alt="Midone Tailwind HTML Admin Template"
            src="/src/assets/images/fakers/food-beverage-1.jpg"
            class="w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit cursor-pointer bg-white"
          >
        </Menu.Button>
        <Menu.Items
          class="p-2 border-transparent rounded-md dark:bg-darkmode-600 dark:border-transparent w-56 mt-px relative bg-white shadow-lg"
        >
          <Menu.Item class="hover:bg-dark/5">
            <Lucide
              icon="User"
              class="w-4 h-4 mr-2"
            />
            Profil
          </Menu.Item>
          <Menu.Item class="hover:bg-dark/5">
            <Lucide
              icon="Lock"
              class="w-4 h-4 mr-2"
            />
            Ganti Password
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
