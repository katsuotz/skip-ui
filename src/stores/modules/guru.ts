import api from '../../utils/api'
import {defineStore} from "pinia";

import {Guru} from '../../utils/interfaces/guru'
import {Table, Payload, Pagination} from '../../utils/interfaces/table'
import {useGlobalStore} from "../global";

interface GuruState {
  guru?: Guru[];
  selectedGuru?: Guru | undefined;
  pagination: Pagination;
}

export const useGuruStore = defineStore("guru", {
  state: (): GuruState => ({
    guru: [],
    selectedGuru: undefined,
    pagination: {
      page: 1,
      total_item: 0,
      total_page: 0,
      per_page: 10,
    },
  }),
  actions: {
    createGuru(data: Guru) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.post('/guru', data).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    updateGuru(id: number, data: Guru) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.patch('/guru/' + id, data).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    deleteGuru(id: number) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.delete('/guru/' + id).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getGuru({page = 1, per_page = 10, search = ''}: Table, loading: boolean = true) {
      const params: Payload = {
        page,
        per_page,
        search,
      }

      this.guru = []
      this.selectedGuru = undefined

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        if (loading) global.loading = true
        api.get('/guru', {
          params,
        }).then((res: any) => {
          this.guru = res.data
          if (loading) this.pagination = res.pagination
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          if (loading) global.loading = false
        })
      })
    },
    searchGuru({search = ''}: Table) {
      return new Promise((resolve, reject) => {
        this.getGuru({
          page: 1,
          per_page: 5,
          search,
        }, false)
          .then(resolve)
          .catch(reject)
      })
    },
    getGuruDetail(id: string) {
      this.selectedGuru = undefined

      const params: any = {}

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/guru/' + id, {
          params,
        }).then((res: any) => {
          this.selectedGuru = res
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
