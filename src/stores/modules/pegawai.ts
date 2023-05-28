import api from '../../utils/api'
import {defineStore} from "pinia";

import {Pegawai} from '../../utils/interfaces/pegawai'
import {Table, Payload, Pagination} from '../../utils/interfaces/table'
import {useGlobalStore} from "../global";

interface PegawaiState {
  pegawai?: Pegawai[];
  selectedPegawai?: Pegawai | undefined;
  pagination: Pagination;
}

export const usePegawaiStore = defineStore("pegawai", {
  state: (): PegawaiState => ({
    pegawai: [],
    selectedPegawai: undefined,
    pagination: {
      page: 1,
      total_item: 0,
      total_page: 0,
      per_page: 10,
    },
  }),
  actions: {
    createPegawai(data: Pegawai) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.post('/pegawai', data).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    updatePegawai(id: number, data: Pegawai) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.patch('/pegawai/' + id, data).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    deletePegawai(id: number) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.delete('/pegawai/' + id).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getPegawai({page = 1, per_page = 10, search = ''}: Table, loading: boolean = true) {
      const params: Payload = {
        page,
        per_page,
        search,
      }

      this.pegawai = []
      this.selectedPegawai = undefined

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        if (loading) global.loading = true
        api.get('/pegawai', {
          params,
        }).then((res: any) => {
          this.pegawai = res.data
          if (loading) this.pagination = res.pagination
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          if (loading) global.loading = false
        })
      })
    },
    searchPegawai({search = ''}: Table) {
      return new Promise((resolve, reject) => {
        this.getPegawai({
          page: 1,
          per_page: 5,
          search,
        }, false)
          .then(resolve)
          .catch(reject)
      })
    },
    getPegawaiDetail(id: string) {
      this.selectedPegawai = undefined

      const params: any = {}

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/pegawai/' + id, {
          params,
        }).then((res: any) => {
          this.selectedPegawai = res
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
