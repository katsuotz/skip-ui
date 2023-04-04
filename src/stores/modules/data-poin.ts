import api from '../../utils/api'
import {defineStore} from "pinia";

import {Table, Payload, Pagination} from '../../utils/interfaces/table'
import {useGlobalStore} from "../global";
import {DataPoin, DataPoinTable} from "../../utils/interfaces/data-poin";

interface DataPoinState {
  dataPoin?: DataPoin[];
  selectedDataPoin?: DataPoin | undefined;
  pagination: Pagination;
}

export const useDataPoinStore = defineStore("dataPoin", {
  state: (): DataPoinState => ({
    dataPoin: [],
    selectedDataPoin: undefined,
    pagination: {
      page: 1,
      total_item: 0,
      total_page: 0,
      per_page: 10,
    },
  }),
  actions: {
    createDataPoin(dataPoin: DataPoin) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.post('/data-poin', dataPoin).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    updateDataPoin(dataPoin: DataPoin) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.patch('/data-poin/' + dataPoin.id, dataPoin).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    deleteDataPoin(id: number) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.delete('/data-poin/' + id).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getDataPoin({page = 1, per_page = 10, search = '', type = '', category = ''}: DataPoinTable) {
      const params: Payload = {
        page,
        per_page,
        search,
        type,
        category,
      }

      this.dataPoin = []
      this.selectedDataPoin = undefined

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/data-poin', {
          params,
        }).then((res: any) => {
          this.dataPoin = res.data
          this.pagination = res.pagination
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getDataPoinDetail(id: string) {
      this.selectedDataPoin = undefined

      const params: any = {}

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/data-poin/' + id, {
          params,
        }).then((res: any) => {
          this.selectedDataPoin = res
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
