import {defineStore} from "pinia";
import {Icon} from "../base-components/Lucide/Lucide.vue";

export interface Menu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

export const useSideMenuStore = defineStore("sideMenu", {
  state: (): SideMenuState => ({
    menu: [
      {
        icon: "LineChart",
        pageName: "side-menu-page-1",
        title: "Dashboard",
      },

      {
        icon: "ListOrdered",
        pageName: "side-menu-dashboard",
        title: "Siswa",
        subMenu: [
          {
            icon: "ChevronRight",
            pageName: "side-menu-page-2",
            title: "Poin Siswa",
          },
          {
            icon: "ChevronRight",
            pageName: "side-menu-page-2",
            title: "Data Siswa",
          },
          {
            icon: "ChevronRight",
            pageName: "side-menu-page-2",
            title: "Kelas",
          },
        ]
      },
      {
        icon: "UserCheck",
        pageName: "side-menu-page-2",
        title: "Guru",
      },
      {
        icon: "Inbox",
        pageName: "side-menu-dashboard",
        title: "Admin",
        subMenu: [
          {
            icon: "ChevronRight",
            pageName: "jurusan",
            title: "Jurusan",
          },
          {
            icon: "ChevronRight",
            pageName: "tahun-ajar",
            title: "Tahun Ajar",
          },
          {
            icon: "ChevronRight",
            pageName: "side-menu-page-2",
            title: "Poin",
          },
        ],
      }
    ],
  }),
});
