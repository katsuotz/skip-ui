import api from '../../utils/api'
import {defineStore} from "pinia";

import {PoinLog, PoinLogTable} from '../../utils/interfaces/poin-log'
import {Payload, Pagination} from '../../utils/interfaces/table'
import {useGlobalStore} from "../global";

interface PoinLogState {
  poinLog?: PoinLog[];
  pagination: Pagination;
}

export const usePoinLogStore = defineStore("poinLog", {
  state: (): PoinLogState => ({
    poinLog: [],
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
    getPoinLog({page = 1, per_page = 10, search = '', siswa_kelas_id}: PoinLogTable) {
      const params: Payload = {
        page,
        per_page,
        search,
      }

      this.poinLog = []

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/poin/log/' + siswa_kelas_id, {
          params,
        }).then((res: any) => {
          this.poinLog = res.data
          this.pagination = res.pagination
          console.log(res.pagination)
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
  },
});
