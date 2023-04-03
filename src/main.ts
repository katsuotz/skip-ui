import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/css/app.css";

import {defineRule, configure} from 'vee-validate';
import {required, min, min_value, max_value, regex, integer, numeric, email} from '@vee-validate/rules';
import {localize, setLocale} from '@vee-validate/i18n';
import id from '@vee-validate/i18n/dist/locale/id.json';

defineRule('required', required);
defineRule('min', min);
defineRule('min_value', min_value);
defineRule('max_value', max_value);
defineRule('regex', regex);
defineRule('integer', integer);
defineRule('numeric', numeric);
defineRule('email', email);
defineRule('boolean', (value:any) => {
  return typeof value === 'boolean';
})

configure({
// @ts-ignore
  generateMessage: localize({
    id: {
      code: 'id',
      messages: {
        ...id.messages,
        boolean: '{field} harus diisi'
      }
    },
  }),
});
setLocale('id')

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.mount('#app')
