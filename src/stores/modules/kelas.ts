import api from '../../utils/api'
import {defineStore} from "pinia";

import {Kelas, KelasResponse} from '../../utils/interfaces/kelas'
import {useGlobalStore} from "../global";
import {Any} from "../../utils/interfaces/helper";

interface KelasState {
  kelas: KelasResponse[];
  selectedKelas?: KelasResponse;
}

export const useKelasStore = defineStore("kelas", {
  state: (): KelasState => ({
    kelas: [],
    selectedKelas: undefined,
  }),
  actions: {
    createKelas(payload: Kelas) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.post('/kelas', payload).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    updateKelas(id: number, payload: Kelas) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.patch('/kelas/' + id, payload).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    deleteKelas(id: number) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.delete('/kelas/' + id).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    addSiswaKelas(kelas_id: string, siswa_id: number[]) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.post('/kelas/' + kelas_id + '/add-siswa', {
          siswa_id
        }).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    deleteSiswaKelas(kelas_id: string, siswa_id: number[]) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.delete('/kelas/' + kelas_id + '/remove-siswa', {
          data: {
            siswa_id
          },
        }).then((res: any) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getKelas(tahun_ajar_id: number, jurusan_id: number) {
      const params: Any = {
        tahun_ajar_id,
        jurusan_id,
      }

      this.kelas = []

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/kelas', {
          params,
        }).then((res: any) => {
          this.kelas = res
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getKelasByID(id: string) {
      this.selectedKelas = undefined

      const params: any = {}

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/kelas/' + id, {
          params,
        }).then((res: any) => {
          this.selectedKelas = res
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
