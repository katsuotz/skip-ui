import {defineStore} from "pinia";
import {Icon} from "../base-components/Lucide/Lucide.vue";
import {useAuthStore} from "./modules/auth";
import {Role} from "../utils/interfaces/user";
import {toRaw} from "vue";
import cloneDeep from "lodash-es/cloneDeep";

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
        icon: "LogIn",
        pageName: "login",
        title: "Login",
        role: ['guest'],
      },
      {
        icon: "LineChart",
        pageName: "dashboard",
        title: "Dashboard",
        role: ['admin', 'staff-ict', 'guru', 'guru-bk', 'siswa'],
      },
      {
        icon: "ListOrdered",
        pageName: "poin-siswa/index",
        title: "Poin Siswa",
        role: ['admin', 'staff-ict', 'guru', 'guru-bk'],
      },
      {
        icon: "BookCopy",
        pageName: "siswa",
        title: "Siswa",
        role: ['admin', 'staff-ict'],
      },
      {
        icon: "UserCircle2",
        pageName: "pegawai",
        title: "Pegawai",
        role: ['admin', 'staff-ict'],
      },
      {
        icon: "Presentation",
        pageName: "kelas",
        title: "Kelas",
        role: ['admin', 'staff-ict'],
      },
      {
        icon: "GraduationCap",
        pageName: "jurusan",
        title: "Jurusan",
        role: ['admin', 'staff-ict'],
      },
      {
        icon: "CalendarDays",
        pageName: "tahun-ajar",
        title: "Tahun Ajar",
        role: ['admin', 'staff-ict'],
      },
      {
        icon: "Binary",
        pageName: "data-poin",
        title: "Poin",
        role: ['admin', 'staff-ict'],
      },
      {
        icon: "FileText",
        title: "Laporan",
        subMenu: [
          {
            icon: "ChevronRight",
            pageName: "report",
            title: "Rekap",
            role: ['admin', 'staff-ict'],
          },
          {
            icon: "ChevronRight",
            pageName: "report-personal",
            title: "Personal",
            role: ['admin', 'staff-ict'],
          },
        ],
      },
      {
        icon: "AlignCenterVerticalIcon",
        pageName: "compare",
        title: "Bandingkan",
        role: ['admin', 'staff-ict'],
      },
    ],
  }),
  getters: {
    activeMenu: (state) => {
      const auth = useAuthStore()

      const checkRole = (e: Menu) => {
        if (e.subMenu) return e.subMenu.length
        return e.role ? e.role.includes(<Role>auth?.user?.role || '') : true
      }

      return cloneDeep(toRaw(state.menu)).map((e:any) => {
        if (e === "divider") return e
        if (e.subMenu) {
          e.subMenu = e.subMenu?.filter(checkRole)
        }
        return e
      }).filter((e:any) => {
        if (e === "divider") return true
        return checkRole(e)
      })
    }
  },
});
