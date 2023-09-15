import api from '../../utils/api'
import {defineStore} from "pinia";

import {Sync} from '../../utils/interfaces/sync'
import {Table, Payload, Pagination} from '../../utils/interfaces/table'
import {useGlobalStore} from "../global";

interface SyncState {
  syncData: Sync[];
  pagination: Pagination;
}

export const useSyncStore = defineStore("sync", {
  state: (): SyncState => ({
    syncData: [],
    pagination: {
      page: 1,
      total_item: 0,
      total_page: 0,
      per_page: 10,
    },
  }),
  actions: {
    syncSiti() {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.post('/sync').then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    syncPassword() {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.post('/sync/password').then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getSync({page = 1, per_page = 10}: Table) {
      const params: Payload = {
        page,
        per_page,
      }

      this.syncData = []

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/sync', {
          params,
        }).then((res: any) => {
          this.syncData = res.data
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
  },
});
