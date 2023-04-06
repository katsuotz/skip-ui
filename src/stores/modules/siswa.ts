import api from '../../utils/api'
import {defineStore} from "pinia";

import {Siswa} from '../../utils/interfaces/siswa'
import {Table, Payload, Pagination} from '../../utils/interfaces/table'
import {useGlobalStore} from "../global";

interface SiswaState {
  siswa?: Siswa[];
  selectedSiswa?: Siswa | undefined;
  pagination: Pagination;
}

export const useSiswaStore = defineStore("siswa", {
  state: (): SiswaState => ({
    siswa: [],
    selectedSiswa: undefined,
    pagination: {
      page: 1,
      total_item: 0,
      total_page: 0,
      per_page: 10,
    },
  }),
  actions: {
    createSiswa(data: Siswa) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.post('/siswa', data).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    updateSiswa(id: number, data: Siswa) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.patch('/siswa/' + id, data).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    deleteSiswa(id: number) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.delete('/siswa/' + id).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getSiswa({page = 1, per_page = 10, search = ''}: Table) {
      const params: Payload = {
        page,
        per_page,
        search,
      }

      this.siswa = []
      this.selectedSiswa = undefined

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/siswa', {
          params,
        }).then((res: any) => {
          this.siswa = res.data
          this.pagination = res.pagination
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getSiswaDetail(id: string) {
      this.selectedSiswa = undefined

      const params: any = {}

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/siswa/' + id, {
          params,
        }).then((res: any) => {
          this.selectedSiswa = res
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
