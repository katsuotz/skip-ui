<script setup lang="ts">
import { useRoute } from "vue-router";
import Divider from "./Divider.vue";
import Menu from "./Menu.vue";
import TopBar from "../../components/TopBar";
import MobileMenu from "../../components/MobileMenu";
import { useSideMenuStore } from "../../stores/side-menu";
import { FormattedMenu, nestedMenu, enter, leave } from "./side-menu";
import { watch, reactive, computed, onMounted } from "vue";
import Lucide from "../../base-components/Lucide/Lucide.vue";
import {useAuthStore} from "../../stores/modules/auth";

const route = useRoute();

const auth = useAuthStore()

let formattedMenu = reactive<Array<FormattedMenu | "divider">>([]);
const setFormattedMenu = (
  computedFormattedMenu: Array<FormattedMenu | "divider">
) => {
  Object.assign(formattedMenu, computedFormattedMenu);
};
const sideMenuStore = useSideMenuStore();
const sideMenu = computed(() => nestedMenu(sideMenuStore.activeMenu, route));

watch(sideMenu, () => {
  setFormattedMenu(sideMenu.value);
});

onMounted(() => {
  setFormattedMenu(sideMenu.value);
});

auth.getMyData()
</script>

<template>
  <div class="py-5 md:py-0 print-overlay">
    <MobileMenu />
    <TopBar layout="side-menu" />
    <div class="flex overflow-hidden">
      <!-- BEGIN: Side Menu -->
      <nav
        class="w-[105px] xl:w-[260px] px-5 pb-16 overflow-x-hidden z-50 pt-32 -mt-4 hidden md:block intro-y hide-print"
      >
        <ul>
          <!-- BEGIN: First Child -->
          <template v-for="(menu, menuKey) in formattedMenu">
            <Divider
              v-if="menu == 'divider'"
              :key="'divider-' + menuKey"
              type="li"
              :class="[
                'my-6',
              ]"
            />
            <li
              v-else
              :key="menuKey"
            >
              <Menu
                :menu="menu"
                :formatted-menu-state="[formattedMenu, setFormattedMenu]"
                level="first"
              />
              <!-- BEGIN: Second Child -->
              <Transition
                @enter="enter"
                @leave="leave"
              >
                <ul
                  v-if="menu.subMenu && menu.activeDropdown"
                  :class="[
                    'bg-white/[0.04] rounded-xl relative dark:bg-transparent',
                    'before:content-[\'\'] before:block before:inset-0 before:bg-white/30 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30',
                    { block: menu.activeDropdown },
                    { hidden: !menu.activeDropdown },
                  ]"
                >
                  <li
                    v-for="(subMenu, subMenuKey) in menu.subMenu"
                    :key="subMenuKey"
                  >
                    <Menu
                      :class="{
                        // Animation
                        [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                          (subMenuKey + 1) * 10
                        }`]: !subMenu.active,
                      }"
                      :menu="subMenu"
                      :formatted-menu-state="[formattedMenu, setFormattedMenu]"
                      level="second"
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
                          'bg-white/[0.04] rounded-xl relative dark:bg-transparent',
                          'before:content-[\'\'] before:block before:inset-0 before:bg-white/30 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30',
                          { block: subMenu.activeDropdown },
                          { hidden: !subMenu.activeDropdown },
                        ]"
                      >
                        <li
                          v-for="(
                            lastSubMenu, lastSubMenuKey
                          ) in subMenu.subMenu"
                          :key="lastSubMenuKey"
                        >
                          <Menu
                            :class="{
                              // Animation
                              [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                (lastSubMenuKey + 1) * 10
                              }`]: !lastSubMenu.active,
                            }"
                            :menu="lastSubMenu"
                            :formatted-menu-state="[
                              formattedMenu,
                              setFormattedMenu,
                            ]"
                            level="third"
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
      </nav>
      <!-- END: Side Menu -->
      <!-- BEGIN: Content -->
      <div
        :class="[
          'max-w-full md:max-w-none rounded-[30px] md:rounded-none px-4 md:px-[22px] min-w-0 min-h-screen bg-slate-100 flex-1 md:pt-20 pb-24 mt-5 md:mt-1 relative dark:bg-darkmode-700',
          'before:content-[\'\'] before:w-full before:h-px before:block',
          'print-overlay'
        ]"
      >
        <RouterView />
      </div>
      <!-- END: Content -->
    </div>

    <RouterLink
      v-if="auth.isPegawai && route.name !== 'add-poin'"
      to="/add-poin"
      class="h-12 bg-primary text-white fixed bottom-6 right-6 flex items-center rounded-full shadow-lg shadow-black/40 cursor-pointer z-50 px-5 font-medium hide-print"
    >
      <Lucide
        class="w-5 h-5 stroke-2 mr-2"
        icon="Plus"
      />
      Lapor Penghargaan / Pelanggaran
    </RouterLink>
  </div>
</template>
