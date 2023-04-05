import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/css/app.css";

import {defineRule, configure} from 'vee-validate';
import {required, integer} from '@vee-validate/rules';
import {localize, setLocale} from '@vee-validate/i18n';
import id from '@vee-validate/i18n/dist/locale/id.json';

defineRule('required', required);
defineRule('integer', integer);

configure({
// @ts-ignore
  generateMessage: localize({
    id: {
      code: 'id',
      messages: {
        ...id.messages,
      }
    },
  }),
});
setLocale('id')

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.mount('#app')
