<script setup lang="ts">
import { useRoute } from "vue-router";
import { twMerge } from "tailwind-merge";
import logoUrl from "../../assets/images/logo-smkn4.png";
import Divider from "./Divider.vue";
import Menu from "./Menu.vue";
import Lucide from "../../base-components/Lucide";
import { useSideMenuStore } from "../../stores/side-menu";
import {
  FormattedMenu,
  nestedMenu,
  enter,
  leave,
} from "../../layouts/SideMenu/side-menu";
import { watch, reactive, computed, onMounted, ref } from "vue";
import SimpleBar from "simplebar";

const route = useRoute();
let formattedMenu = reactive<Array<FormattedMenu | "divider">>([]);
const setFormattedMenu = (
  computedFormattedMenu: Array<FormattedMenu | "divider">
) => {
  Object.assign(formattedMenu, computedFormattedMenu);
};
const sideMenuStore = useSideMenuStore();
const sideMenu = computed(() => nestedMenu(sideMenuStore.menu, route));

const activeMobileMenu = ref(false);
const setActiveMobileMenu = (active: boolean) => {
  activeMobileMenu.value = active;
};

const scrollableRef = ref<HTMLDivElement>();

watch(sideMenu, () => {
  setFormattedMenu(sideMenu.value);
});

onMounted(() => {
  if (scrollableRef.value) {
    new SimpleBar(scrollableRef.value);
  }

  setFormattedMenu(sideMenu.value);
});
</script>

<template>
  <!-- BEGIN: Mobile Menu -->
  <div
    :class="[
      'w-full fixed bg-primary/90 z-[60] border-b border-white/[0.08] -mt-5 -mx-3 sm:-mx-8 mb-6 dark:bg-darkmode-800/90 md:hidden',
      'before:content-[\'\'] before:w-full before:h-screen before:z-10 before:fixed before:inset-x-0 before:bg-black/90 before:transition-opacity before:duration-200 before:ease-in-out',
      !activeMobileMenu && 'before:invisible before:opacity-0',
      activeMobileMenu && 'before:visible before:opacity-100',
      'hide-print',
    ]"
  >
    <div class="h-[70px] px-3 sm:px-8 flex items-center">
      <a
        href=""
        class="flex mr-auto"
      >
        <img
          alt="Sistem Kredit Poin"
          class="w-12"
          :src="logoUrl"
        >
      </a>
      <a
        href="#"
        @click="(e) => e.preventDefault()"
      >
        <Lucide
          icon="BarChart2"
          class="w-8 h-8 text-white transform -rotate-90"
          @click="
            () => {
              setActiveMobileMenu(!activeMobileMenu);
            }
          "
        />
      </a>
    </div>
    <div
      ref="scrollableRef"
      :class="
        twMerge([
          'h-screen z-20 top-0 left-0 w-[270px] -ml-[100%] bg-white transition-all duration-300 ease-in-out dark:bg-darkmode-800',
          '[&[data-simplebar]]:fixed [&_.simplebar-scrollbar]:before:bg-black/50',
          activeMobileMenu && 'ml-0',
        ])
      "
    >
      <a
        href="#"
        :class="[
          'fixed top-0 right-0 mt-4 mr-4 transition-opacity duration-200 ease-in-out',
          !activeMobileMenu && 'invisible opacity-0',
          activeMobileMenu && 'visible opacity-100',
        ]"
        @click="(e) => e.preventDefault()"
      >
        <Lucide
          icon="XCircle"
          class="w-8 h-8 text-white transform -rotate-90 stroke-2"
          @click="
            () => {
              setActiveMobileMenu(!activeMobileMenu);
            }
          "
        />
      </a>
      <ul class="py-2">
        <!-- BEGIN: First Child -->
        <template v-for="(menu, menuKey) in formattedMenu">
          <Divider
            v-if="menu == 'divider'"
            :key="'divider-' + menuKey"
            as="li"
            class="my-6"
          />
          <li
            v-else
            :key="menuKey"
          >
            <Menu
              :menu="menu"
              :formatted-menu-state="[formattedMenu, setFormattedMenu]"
              level="first"
              :set-active-mobile-menu="setActiveMobileMenu"
            />
            <!-- BEGIN: Second Child -->
            <Transition
              v-if="menu.subMenu"
              @enter="enter"
              @leave="leave"
            >
              <ul
                v-if="menu.subMenu && menu.activeDropdown"
                :class="[
                  'rounded-lg mx-4-darkmode-700 block',
                  !menu.activeDropdown && 'hidden',
                  menu.activeDropdown && 'block',
                ]"
              >
                <li
                  v-for="(subMenu, subMenuKey) in menu.subMenu"
                  :key="subMenuKey"
                  class="max-w-[1280px] w-full mx-auto"
                >
                  <Menu
                    :menu="subMenu"
                    :formatted-menu-state="[formattedMenu, setFormattedMenu]"
                    level="second"
                    :set-active-mobile-menu="setActiveMobileMenu"
                  />
                  <!-- BEGIN: Third Child -->
                  <Transition
                    v-if="subMenu.subMenu"
                    @enter="enter"
                    @leave="leave"
                  >
                    <ul
                      v-if="subMenu.subMenu && subMenu.activeDropdown"
                      :class="[
                        'bg-black/10 rounded-lg my-1 dark:bg-darkmode-600',
                        !subMenu.activeDropdown && 'hidden',
                        subMenu.activeDropdown && 'block',
                      ]"
                    >
                      <li
                        v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu"
                        :key="lastSubMenuKey"
                        class="max-w-[1280px] w-full mx-auto"
                      >
                        <Menu
                          :menu="lastSubMenu"
                          :formatted-menu-state="[
                            formattedMenu,
                            setFormattedMenu,
                          ]"
                          level="third"
                          :set-active-mobile-menu="setActiveMobileMenu"
                        />
                      </li>
                    </ul>
                  </Transition>
                  <!-- END: Third Child -->
                </li>
              </ul>
            </Transition>
            <!-- END: Second Child -->
          </li>
        </template>
        <!-- END: First Child -->
      </ul>
    </div>
  </div>
  <!-- END: Mobile Menu -->
</template>
