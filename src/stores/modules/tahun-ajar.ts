import api from '../../utils/api'
import {defineStore} from "pinia";

import {TahunAjar} from '../../utils/interfaces/tahun-ajar'
import {Table, Payload, Pagination} from '../../utils/interfaces/table'
import {useGlobalStore} from "../global";

interface TahunAjarState {
  tahunAjar: TahunAjar[];
  selectedTahunAjar?: TahunAjar;
  pagination: Pagination;
}

export const useTahunAjarStore = defineStore("tahunAjar", {
  state: (): TahunAjarState => ({
    tahunAjar: [],
    selectedTahunAjar: undefined,
    pagination: {
      page: 1,
      total_item: 0,
      total_page: 0,
      per_page: 10,
    },
  }),
  getters: {
    activeTahunAjar: state => state.tahunAjar.find(e => e.is_active),
  },
  actions: {
    createTahunAjar(tahun_ajar: string) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.post('/tahun-ajar', {
          tahun_ajar,
        }).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    updateTahunAjar(id: number, tahun_ajar: string) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.patch('/tahun-ajar/' + id, {
          tahun_ajar,
        }).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    setActiveTahunAjar(id: number) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.patch('/tahun-ajar/' + id + '/set-active').then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    deleteTahunAjar(id: number) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.delete('/tahun-ajar/' + id).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getTahunAjar({page = 1, per_page = 10, search = ''}: Table) {
      const params: Payload = {
        page,
        per_page,
        search,
      }

      this.tahunAjar = []
      this.selectedTahunAjar = undefined

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/tahun-ajar', {
          params,
        }).then((res: any) => {
          this.tahunAjar = res.data
          this.pagination = res.pagination
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getTahunAjarDetail(id: string) {
      this.selectedTahunAjar = undefined

      const params: any = {}

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/tahun-ajar/' + id, {
          params,
        }).then((res: any) => {
          this.selectedTahunAjar = res
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
