import {defineStore} from "pinia";
import {Icon} from "../base-components/Lucide/Lucide.vue";
import {useAuthStore} from "./modules/auth";
import {Role} from "../utils/interfaces/user";

export interface Menu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
  role?: string[];
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

export const useSideMenuStore = defineStore("sideMenu", {
  state: (): SideMenuState => ({
    menu: [
      {
        icon: "LineChart",
        pageName: "dashboard",
        title: "Dashboard",
      },

      {
        icon: "ListOrdered",
        title: "Siswa",
        subMenu: [
          {
            icon: "ChevronRight",
            pageName: "siswa",
            title: "Data Siswa",
          },
          {
            icon: "ChevronRight",
            pageName: "kelas",
            title: "Kelas",
          },
        ]
      },
      {
        icon: "UserCheck",
        pageName: "guru",
        title: "Guru",
        role: ['admin', 'staff-ict'],
      },
      {
        icon: "Inbox",
        title: "Admin",
        subMenu: [
          {
            icon: "ChevronRight",
            pageName: "jurusan",
            title: "Jurusan",
            role: ['admin', 'staff-ict'],
          },
          {
            icon: "ChevronRight",
            pageName: "tahun-ajar",
            title: "Tahun Ajar",
            role: ['admin', 'staff-ict'],
          },
          {
            icon: "ChevronRight",
            pageName: "data-poin",
            title: "Poin",
            role: ['admin', 'staff-ict'],
          },
        ],
      }
    ],
  }),
  getters: {
    activeMenu: (state) => {
      const auth = useAuthStore()

      const checkRole = (e: Menu) => {
        if (e.subMenu) return e.subMenu.length
        return e.role ? e.role.includes(<Role>auth?.user?.role || '') : true
      }

      return state.menu.map(e => {
        if (e === "divider") return e
        if (e.subMenu) {
          e.subMenu = e.subMenu?.filter(checkRole)
        }
        return e
      }).filter(e => {
        if (e === "divider") return true
        return checkRole(e)
      })
    }
  },
});
