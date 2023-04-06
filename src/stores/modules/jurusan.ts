import api from '../../utils/api'
import {defineStore} from "pinia";

import {Jurusan} from '../../utils/interfaces/jurusan'
import {useGlobalStore} from "../global";

interface JurusanState {
  jurusan: Jurusan[];
  selectedJurusan?: Jurusan | undefined;
}

export const useJurusanStore = defineStore("jurusan", {
  state: (): JurusanState => ({
    jurusan: [],
    selectedJurusan: undefined,
  }),
  actions: {
    createJurusan(nama_jurusan: string) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.post('/jurusan', {
          nama_jurusan,
        }).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    updateJurusan(id: number, nama_jurusan: string) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.patch('/jurusan/' + id, {
          nama_jurusan,
        }).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    deleteJurusan(id: number) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.delete('/jurusan/' + id).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getJurusan() {
      this.jurusan = []
      this.selectedJurusan = undefined

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/jurusan').then((res: any) => {
          this.jurusan = res
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getJurusanDetail(id: string) {
      this.selectedJurusan = undefined

      const params: any = {}

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/jurusan/' + id, {
          params,
        }).then((res: any) => {
          this.selectedJurusan = res
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
  },
});
