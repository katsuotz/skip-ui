import api from '../../utils/api'
import {defineStore} from "pinia";

import {InfoListData, InfoListDataCount, InfoListTable} from "../../utils/interfaces/info";
import {Payload, Table} from "../../utils/interfaces/table";
import {LoginLog} from "../../utils/interfaces/user";

interface InfoState {
  totalPenghargaan?: number;
  totalPelanggaran?: number;
  infoListBigger: InfoListData[];
  infoListSmaller: InfoListData[];
  listPenghargaan: InfoListDataCount[];
  listPelanggaran: InfoListDataCount[];
  loginLog: LoginLog[];
}

export const useInfoStore = defineStore("info", {
  state: (): InfoState => ({
    totalPenghargaan: undefined,
    totalPelanggaran: undefined,
    infoListBigger: [],
    infoListSmaller: [],
    listPenghargaan: [],
    listPelanggaran: [],
    loginLog: [],
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
    listPoin({page = 1, per_page = 10, order = 'desc', order_by = 'poin', tahun_ajar_id}: InfoListTable) {
      const params: Payload = {
        page,
        per_page,
        order,
        order_by,
        tahun_ajar_id,
      }

      return new Promise((resolve, reject) => {
        api.get('/info/poin/list', {
          params,
        }).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
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
        }).then((res: any) => {
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
        }).then((res: any) => {
          this.infoListSmaller = res.data
          resolve(res)
        }).catch(reject)
      })
    },
    listPoinCount({page = 1, per_page = 10, order = 'desc', order_by = 'poin', tahun_ajar_id, type, group_by}: InfoListTable) {
      const params: Payload = {
        page,
        per_page,
        order,
        order_by,
        tahun_ajar_id,
        type,
        group_by,
      }

      return new Promise((resolve, reject) => {
        api.get('/info/poin/list/count', {
          params,
        }).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
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
    getLoginLog({page = 1, per_page = 10, search = ''}: Table) {
      const params: Payload = {
        page,
        per_page,
        search,
      }

      return new Promise((resolve, reject) => {
        api.get('/info/login', {
          params,
        }).then((res: any) => {
          this.loginLog = res.data
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
  },
});
