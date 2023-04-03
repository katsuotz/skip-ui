import axios from "axios"
import {useAuthStore} from "../stores/modules/user/auth";
import {useGlobalStore} from "../stores/global";
import router from "../router";

const setup = (url: string) => {
  const instance = axios.create({
    baseURL: url,
  })

  instance.interceptors.request.use(function (config: any) {
    const auth = useAuthStore();

    if (auth && auth.token)
      config.headers.Authorization = 'Bearer ' + auth.token

    return config
  }, function (error: any) {
    return Promise.reject(error)
  })

  instance.interceptors.response.use((res: any) => {
    const global = useGlobalStore()

    const { data } = res

    const msg = res.status === 200 && !data.result && data.message

    if (msg) global.setNotification(msg, 'success')

    return res.data
  }, function (error: any) {
    if (error?.response && error?.response.status === 401) {
      const auth = useAuthStore();
      return auth.logout()
    }

    const global = useGlobalStore()

    const msg = error?.response?.data?.message

    if (msg) global.setNotification(msg, 'danger')
    else if (typeof error.code === 'string') {
      global.setNotification(error.message || error.code, 'danger')
      router.push('/')
    }

    return Promise.reject(error?.response)
  })

  return instance
}

export default setup(import.meta.env.VITE_API)
