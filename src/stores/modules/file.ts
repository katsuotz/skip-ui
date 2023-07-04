import api from '../../utils/api'
import {defineStore} from "pinia";
import {useAuthStore} from "./auth";
import {useGlobalStore} from "../global";

export const useFileStore = defineStore("file", {
  actions: {
    upload(file: File, filename: string, folder: string) {
      const global = useGlobalStore()

      return new Promise((resolve, reject) => {
        global.loading = true

        const data = new FormData()

        data.append('file', file)
        data.append('filename', filename)
        data.append('folder', folder)

        api.post('/upload', data).then((res: any) => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          global.loading = false
        })
      })
    },
    uploadFoto(file: File) {
      const auth = useAuthStore()
      return this.upload(file, auth.user?.username || '', 'foto')
    },
  },
});
