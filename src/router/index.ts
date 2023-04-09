import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/SideMenu/SideMenu.vue";
import {useAuthStore} from "../stores/modules/auth";

const routes = [
  {
    path: "/",
    component: SideMenu,
    children: [
      {
        path: "/",
        name: "dashboard",
        component: () => import("../pages/Dashboard.vue"),
        meta: {
          breadcrumbs: ['Dashboard'],
        }
      },
      {
        path: "guru",
        name: "guru",
        component: () => import("../pages/Guru/GuruIndex.vue"),
        meta: {
          role: ['admin', 'staff-ict'],
          breadcrumbs: ['Guru', 'Data Guru'],
        },
      },
      {
        path: "siswa",
        name: "siswa",
        component: () => import("../pages/Siswa/SiswaIndex.vue"),
        meta: {
          role: ['admin', 'staff-ict'],
          breadcrumbs: ['Siswa', 'Data Siswa'],
        },
      },
      {
        path: "kelas",
        name: "kelas",
        component: () => import("../pages/Kelas/KelasIndex.vue"),
        meta: {
          role: ['admin', 'staff-ict'],
          breadcrumbs: ['Siswa', 'Kelas'],
        },
      },
      {
        path: "kelas/:kelas_id/siswa",
        name: "kelas-siswa",
        component: () => import("../pages/Kelas/KelasSiswaIndex.vue"),
        meta: {
          role: ['admin', 'staff-ict'],
          breadcrumbs: ['Siswa', 'Kelas', 'List Siswa'],
        },
      },
      {
        path: "kelas/:kelas_id/siswa/:siswa_kelas_id",
        name: "kelas-siswa-log",
        component: () => import("../pages/Kelas/KelasSiswaLog.vue"),
        meta: {
          role: ['admin', 'staff-ict'],
          breadcrumbs: ['Siswa', 'Riwayat Poin'],
        },
      },
      {
        path: "kelas/:kelas_id/siswa/add",
        name: "kelas-siswa-add",
        component: () => import("../pages/Kelas/KelasSiswaForm.vue"),
        meta: {
          role: ['admin', 'staff-ict'],
        },
      },
      {
        path: "tahun-ajar",
        name: "tahun-ajar",
        component: () => import("../pages/TahunAjar/TahunAjarIndex.vue"),
        meta: {
          role: ['admin', 'staff-ict'],
          breadcrumbs: ['Admin', 'Tahun Ajar'],
        },
      },
      {
        path: "jurusan",
        name: "jurusan",
        component: () => import("../pages/Jurusan/JurusanIndex.vue"),
        meta: {
          role: ['admin', 'staff-ict'],
          breadcrumbs: ['Admin', 'Jurusan'],
        },
      },
      {
        path: "data-poin",
        name: "data-poin",
        component: () => import("../pages/DataPoin/DataPoinIndex.vue"),
        meta: {
          role: ['admin', 'staff-ict'],
          breadcrumbs: ['Admin', 'Poin'],
        },
      },
      {
        path: "add-poin",
        name: "add-poin",
        component: () => import("../pages/Poin/AddPoin.vue"),
        meta: {
          role: ['staff-ict', 'guru', 'guru-bk', 'tata-usaha'],
        },
      },
      {
        path: "report",
        name: "report",
        component: () => import("../pages/Report/ReportIndex.vue"),
        meta: {
          role: ['admin', 'staff-ict', 'guru', 'guru-bk', 'tata-usaha'],
          breadcrumbs: ['Laporan', 'Rekap'],
        },
      },
      {
        path: "report/personal",
        name: "report-personal",
        component: () => import("../pages/Report/ReportSiswaIndex.vue"),
        meta: {
          role: ['admin', 'staff-ict', 'guru', 'guru-bk', 'tata-usaha'],
          breadcrumbs: ['Laporan', 'Personal'],
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/Login.vue"),
    meta: {
      auth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (!auth.token && to.meta.auth !== false)
    return next('/login')
  if (auth.token && to.meta.auth === false)
    return next('/')

  const {meta} = to

  // @ts-ignore
  if (meta?.role && !meta?.role?.includes(auth.user?.role))
    return next('/')

  next()
})

export default router;
