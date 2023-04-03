import api from '../../../utils/api'
import {defineStore} from "pinia";
import router from "../../../router";

import {User} from '../../../utils/interfaces/user'
import {useGlobalStore} from "../../global";
import {capitalizeFirstLetter} from "../../../utils/helper";

interface AuthState {
  user?: User;
  token?: string;
}

const removeUser = () => {
  localStorage.removeItem('skip-user')
  localStorage.removeItem('skip-token')

  router.push('/login')
}

const getUser = (): User | undefined => {
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
    }
  },
  actions: {
    login(username: string, password: string) {
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
        router.push('/')
      }).finally(() => {
        global.loading = false
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
  },
});
