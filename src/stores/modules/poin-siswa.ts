import api from '../../utils/api'
import {defineStore} from "pinia";

import {PoinSiswa, PoinSiswaRequest} from '../../utils/interfaces/poin-siswa'
import {useGlobalStore} from "../global";

interface PoinSiswaState {
  selectedPoinSiswa?: PoinSiswa;
}

export const usePoinSiswaStore = defineStore("poinSiswa", {
  state: (): PoinSiswaState => ({
    selectedPoinSiswa: undefined,
  }),
  actions: {
    getPoinSiswa(siswa_kelas_id: string) {
      this.selectedPoinSiswa = undefined

      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/poin/siswa/' + siswa_kelas_id).then((res: any) => {
          this.selectedPoinSiswa = res
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    getPoinKelasByJurusan(jurusan_id: string, tahun_ajar_id: string) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.get('/poin/jurusan/' + jurusan_id, {
          params: {
            tahun_ajar_id,
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
    addPoinSiswa(data: PoinSiswaRequest) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true
        api.post('/poin', data).then((res: any) => {
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
