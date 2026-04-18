import './assets/main.css'
import 'tailwindcss'
import 'primeicons/primeicons.css'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { ToastService, ConfirmationService, DialogService } from 'primevue'
import Tooltip from 'primevue/tooltip'

const app = createApp(App)

app.use(createPinia())
app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: false,
    },
    semantic: {
      primary: {
        50: '#eef3fc',
        100: '#d6e2f8',
        200: '#b3c9f1',
        300: '#8fb0ea',
        400: '#6c97e3',
        500: '#4F7BCB',
        600: '#4063a3',
        700: '#304a7a',
        800: '#203152',
        900: '#101829',
      },
    },
  },
})
app.use(router)
app.directive('tooltip', Tooltip)

app.mount('#app')
