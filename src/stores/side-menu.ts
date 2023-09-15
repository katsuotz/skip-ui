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
  view?: boolean;
}

export interface SideMenuState {
  expand: boolean;
  menu: Array<Menu | "divider">;
}

export const useSideMenuStore = defineStore("sideMenu", {
  state: (): SideMenuState => ({
    expand: true,
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
        role: ['admin', 'staff-ict', 'guru-bk', 'siswa'],
      },
      {
        icon: "Home",
        pageName: "dashboard",
        title: "Home",
        role: ['guru', 'tata-usaha'],
      },
      {
        icon: "ListOrdered",
        pageName: "poin-siswa/index",
        title: "Poin Siswa",
        role: ['admin', 'staff-ict', 'guru', 'guru-bk'],
        view: true,
      },
      {
        icon: "FileText",
        title: "Laporan",
        subMenu: [
          {
            icon: "ChevronRight",
            pageName: "report",
            title: "Rekap",
            role: ['admin', 'staff-ict', 'guru', 'guru-bk', 'tata-usaha'],
            view: true,
          },
          {
            icon: "ChevronRight",
            pageName: "report-personal",
            title: "Personal",
            role: ['admin', 'staff-ict', 'guru', 'guru-bk', 'tata-usaha'],
            view: true,
          },
        ],
      },
      {
        icon: "AlignCenterVerticalIcon",
        pageName: "bandingkan",
        title: "Bandingkan",
        role: ['admin', 'staff-ict', 'guru-bk'],
        view: true,
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
        title: "Master Poin",
        role: ['admin', 'staff-ict', 'guru-bk'],
      },
      {
        icon: "DatabaseBackup",
        pageName: "sync",
        title: "SITI",
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

      const checkView = (e: Menu) => {
        if (e.subMenu) return e.subMenu.length
        return e.view ? auth.canView : true
      }

      return cloneDeep(toRaw(state.menu)).map((e:any) => {
        if (e === "divider") return e
        if (e.subMenu) {
          e.subMenu = e.subMenu?.filter(checkRole).filter(checkView)
        }
        return e
      }).filter((e:any) => {
        if (e === "divider") return true
        return checkRole(e) && checkView(e)
      })
    }
  },
});
