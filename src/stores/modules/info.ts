import api from '../../utils/api'
import {defineStore} from "pinia";

import {InfoGraphCount, InfoListData, InfoListDataCount, InfoListTable} from "../../utils/interfaces/info";
import {Pagination, Payload, Table} from "../../utils/interfaces/table";
import {LoginLog} from "../../utils/interfaces/user";
import {useGlobalStore} from "../global";

interface InfoState {
  totalPenghargaan?: number;
  totalPelanggaran?: number;
  maxPoin?: number;
  minPoin?: number;
  avgPoin?: number;
  infoList: InfoListData[];
  infoListPagination: Pagination;
  infoListBigger: InfoListData[];
  infoListSmaller: InfoListData[];
  listType: InfoListDataCount[];
  listTypePagination: Pagination;
  listPenghargaan: InfoListDataCount[];
  listPelanggaran: InfoListDataCount[];
  graphCountPenghargaan: InfoGraphCount[];
  graphCountPelanggaran: InfoGraphCount[];
  loginLog: LoginLog[];
  loginLogPagination: Pagination;
}

export const useInfoStore = defineStore("info", {
  state: (): InfoState => ({
    totalPenghargaan: undefined,
    totalPelanggaran: undefined,
    maxPoin: undefined,
    minPoin: undefined,
    avgPoin: undefined,
    infoList: [],
    infoListPagination: {
      page: 1,
      total_item: 0,
      total_page: 0,
      per_page: 10,
    },
    infoListBigger: [],
    infoListSmaller: [],
    listType: [],
    listTypePagination: {
      page: 1,
      total_item: 0,
      total_page: 0,
      per_page: 10,
    },
    listPenghargaan: [],
    listPelanggaran: [],
    loginLog: [],
    loginLogPagination: {
      page: 1,
      total_item: 0,
      total_page: 0,
      per_page: 10,
    },
    graphCountPenghargaan: [],
    graphCountPelanggaran: [],
  }),
  getters: {
    totalData: state =>
      typeof state.totalPenghargaan === 'number' && typeof state.totalPelanggaran === 'number' ?
        state.totalPenghargaan + state.totalPelanggaran :
        undefined,
    totalPenghargaanPercentage: state =>
      typeof state.totalPenghargaan === 'number' && typeof state.totalPelanggaran === 'number' ?
        (state.totalPenghargaan / (state.totalPenghargaan + state.totalPelanggaran)) * 100 :
        undefined,
    totalPelanggaranPercentage: state =>
      typeof state.totalPenghargaan === 'number' && typeof state.totalPelanggaran === 'number' ?
        (state.totalPelanggaran / (state.totalPenghargaan + state.totalPelanggaran)) * 100 :
        undefined,
  },
  actions: {
    countPoin(type: string, tahun_ajar_id: string) {
      if (type === "Penghargaan") this.totalPenghargaan = undefined
      else if (type === "Pelanggaran") this.totalPelanggaran = undefined

      return new Promise((resolve, reject) => {
        api.get('/info/poin/count', {
          params: {
            type,
            tahun_ajar_id,
          },
        }).then((res: any) => {
          const {total} = res

          if (type === "Penghargaan") this.totalPenghargaan = total
          else if (type === "Pelanggaran") this.totalPelanggaran = total

          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    calculatePoin(type: string, tahun_ajar_id: string) {
      return new Promise((resolve, reject) => {
        api.get('/info/poin/' + type, {
          params: {
            tahun_ajar_id,
          },
        }).then((res: any) => {
          const {total} = res
          if (type === 'max') this.maxPoin = total
          else if (type === 'min') this.minPoin = total
          else if (type === 'avg') this.avgPoin = total
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    listPoin({page = 1, per_page = 10, order = 'desc', order_by = 'poin', tahun_ajar_id}: InfoListTable, loading: boolean = true) {
      const params: Payload = {
        page,
        per_page,
        order,
        order_by,
        tahun_ajar_id,
      }

      this.infoList = []

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        if (loading) global.loading = true
        api.get('/info/poin/list', {
          params,
        }).then((res: any) => {
          this.infoList = res.data
          if (loading) this.infoListPagination = res.pagination
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          if (loading) global.loading = false
        })
      })
    },
    listPoinBigger(tahun_ajar_id: string) {
      return new Promise((resolve, reject) => {
        this.listPoin({
          page: 1,
          per_page: 5,
          order: 'desc',
          order_by: 'poin',
          tahun_ajar_id,
        }, false).then((res: any) => {
          this.infoListBigger = res.data
          resolve(res)
        }).catch(reject)
      })
    },
    listPoinSmaller(tahun_ajar_id: string) {
      return new Promise((resolve, reject) => {
        this.listPoin({
          page: 1,
          per_page: 5,
          order: 'asc',
          order_by: 'poin',
          tahun_ajar_id,
        }, false).then((res: any) => {
          this.infoListSmaller = res.data
          resolve(res)
        }).catch(reject)
      })
    },
    listPoinCount({page = 1, per_page = 10, order = 'desc', order_by = 'total', tahun_ajar_id, type, group_by}: InfoListTable, loading: boolean = true) {
      const params: Payload = {
        page,
        per_page,
        order,
        order_by,
        tahun_ajar_id,
        type,
        group_by,
      }

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        if (loading) global.loading = true
        api.get('/info/poin/list/count', {
          params,
        }).then((res: any) => {
          this.listType = res.data
          if (loading) this.listTypePagination = res.pagination
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          if (loading) global.loading = false
        })
      })
    },
    listPoinCountPenghargaan(tahun_ajar_id: string) {
      return new Promise((resolve, reject) => {
        this.listPoinCount({
          page: 1,
          per_page: 5,
          order: 'desc',
          order_by: 'total',
          tahun_ajar_id,
          type: 'Penghargaan',
          group_by: 'type',
        }).then((res: any) => {
          this.listPenghargaan = res.data
          resolve(res)
        }).catch(reject)
      })
    },
    listPoinCountPelanggaran(tahun_ajar_id: string) {
      return new Promise((resolve, reject) => {
        this.listPoinCount({
          page: 1,
          per_page: 5,
          order: 'desc',
          order_by: 'total',
          tahun_ajar_id,
          type: 'Pelanggaran',
          group_by: 'type',
        }).then((res: any) => {
          this.listPelanggaran = res.data
          resolve(res)
        }).catch(reject)
      })
    },
    getGraphCount(tahun_ajar_id: string, type: string) {
      return new Promise((resolve, reject) => {
        api.get('/info/poin/graph/count', {
          params: {
            tahun_ajar_id,
            type,
          }
        }).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getGraphCountPenghargaan (tahun_ajar_id: string) {
      return new Promise((resolve, reject) => {
        this.getGraphCount(tahun_ajar_id, 'Penghargaan').then((res:any) => {
          this.graphCountPenghargaan = res
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getGraphCountPelanggaran (tahun_ajar_id: string) {
      return new Promise((resolve, reject) => {
        this.getGraphCount(tahun_ajar_id, 'Pelanggaran').then((res:any) => {
          this.graphCountPelanggaran = res
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getLoginLog({page = 1, per_page = 10, search = ''}: Table, loading: boolean = true) {
      const params: Payload = {
        page,
        per_page,
        search,
      }

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        if (loading) global.loading = true
        api.get('/info/login', {
          params,
        }).then((res: any) => {
          this.loginLog = res.data
          if (loading) this.loginLogPagination = res.pagination
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          if (loading) global.loading = false
        })
      })
    },
  },
});
