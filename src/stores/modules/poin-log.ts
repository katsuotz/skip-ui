import api from '../../utils/api'
import {defineStore} from "pinia";

import {PoinLog, PoinLogTable} from '../../utils/interfaces/poin-log'
import {Payload, Pagination} from '../../utils/interfaces/table'
import {useGlobalStore} from "../global";

interface PoinLogState {
  poinLog?: PoinLog[];
  latestLog?: PoinLog[];
  poinLogSiswaKelas?: PoinLog[];
  pagination: Pagination;
}

export const usePoinLogStore = defineStore("poinLog", {
  state: (): PoinLogState => ({
    poinLog: [],
    latestLog: [],
    poinLogSiswaKelas: [],
    pagination: {
      page: 1,
      total_item: 0,
      total_page: 0,
      per_page: 10,
    },
  }),
  actions: {
    updatePoinLog(id: number, data: PoinLog) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.patch('/poin-log/' + id, data).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    deletePoinLog(id: number) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.delete('/poin-log/' + id).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getPoinLog({page = 1, per_page = 10, order = 'desc', order_by = 'created_at', tahun_ajar_id}: PoinLogTable) {
      const params: Payload = {
        page,
        per_page,
        order,
        order_by,
        tahun_ajar_id,
      }

      this.poinLog = []

      return new Promise((resolve, reject) => {
        api.get('/poin/log', {
          params,
        }).then((res: any) => {
          this.poinLog = res.data
          this.pagination = res.pagination
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getPoinLogBySiswaKelasID({page = 1, per_page = 10, search = '', siswa_kelas_id}: PoinLogTable) {
      const params: Payload = {
        page,
        per_page,
        search,
      }

      this.poinLogSiswaKelas = []

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/poin/log/' + siswa_kelas_id, {
          params,
        }).then((res: any) => {
          this.poinLogSiswaKelas = res.data
          this.pagination = res.pagination
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    updateCurrentPage(page: number) {
      this.pagination.page = page
    },
    updatePerPage(per_page: number) {
      this.pagination.per_page = per_page
    },

    getLatestLog(tahun_ajar_id: string) {
      return new Promise((resolve, reject) => {
        this.getPoinLog({
          page: 1,
          per_page: 5,
          order: 'desc',
          order_by: 'created_at',
          tahun_ajar_id: tahun_ajar_id,
        }).then((res: any) => {
          this.latestLog = res.data
          resolve(res)
        }).catch(reject)
      })
    },

  },
});
