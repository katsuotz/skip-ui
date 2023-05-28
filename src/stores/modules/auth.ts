import api from '../../utils/api'
import {defineStore} from "pinia";
import router from "../../router";

import {PasswordRequest, UserResponse} from '../../utils/interfaces/user'
import {useGlobalStore} from "../global";
import {capitalizeFirstLetter} from "../../utils/helper";

interface AuthState {
  user?: UserResponse;
  token?: string;
}

const removeUser = () => {
  localStorage.removeItem('skip-user')
  localStorage.removeItem('skip-token')

  router.push('/login')
}

const getUser = (): UserResponse | undefined => {
  const {'skip-user': value}: Storage = localStorage

  try {
    return value ? JSON.parse(value) : null
  } catch (e: any) {
    removeUser()
  }
};

const getToken = () => {
  return localStorage.getItem('skip-token') || ''
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: getUser(),
    token: getToken(),
  }),
  getters: {
    roleLabel: state => {
      if (state.user)
        return capitalizeFirstLetter(state.user.role.replace(/-/g, ' '))
      return ''
    },
    isPegawai: state => ['guru', 'staff-ict', 'guru-bk', 'tata-usaha'].includes(state.user?.role || ''),
    isStaff: state => ['admin', 'staff-ict', 'guru-bk'].includes(state.user?.role || ''),
    isAdmin: state => ['admin', 'staff-ict'].includes(state.user?.role || ''),
    isSiswa: state => ['siswa'].includes(state.user?.role || ''),
  },
  actions: {
    login(username: string, password: string) {
      return new Promise((resolve, reject) => {
        const global = useGlobalStore()
        global.loading = true
        api.post('/login', {
          username,
          password,
        }).then((res: any) => {
          this.user = res.data.user
          this.token = res.data.token

          localStorage.setItem("skip-user", JSON.stringify(res.data.user));
          localStorage.setItem("skip-token", res.data.token);
          resolve(res)
        }).catch(reject).finally(() => {
          global.loading = false
        })
      })
    },
    logout() {
      this.user = undefined
      this.token = undefined
      localStorage.removeItem("skip-user")
      localStorage.removeItem("skip-token")

      router.push('/login')
    },
    getMyData() {
      if (!this.token) return
      api.get('/me').then((res: any) => {
        this.user = res
        localStorage.setItem("skip-user", JSON.stringify(res));
      })
    },
    updateProfile(payload: UserResponse) {
      const global = useGlobalStore()
      global.loading = true
      return new Promise((resolve, reject) => {
        api.patch('/profile', payload).then(resolve).catch(reject).finally(() => {
          global.loading = false
        })
      })
    },
    updatePassword(payload: PasswordRequest) {
      const global = useGlobalStore()
      global.loading = true
      return new Promise((resolve, reject) => {
        api.patch('/password', payload).then(resolve).catch(reject).finally(() => {
          global.loading = false
        })
      })
    },
  },
});
