import api from '../../utils/api'
import {defineStore} from "pinia";
import {useAuthStore} from "./auth";

export const useFileStore = defineStore("file", {
  actions: {
    upload(file: File, filename: string, folder: string) {
      return new Promise((resolve, reject) => {
        const data = new FormData()

        data.append('file', file)
        data.append('filename', filename)
        data.append('folder', folder)

        api.post('/upload', data).then((res: any) => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    uploadFoto(file: File) {
      const auth = useAuthStore()
      return this.upload(file, auth.user?.username || '', 'foto')
    },
  },
});
