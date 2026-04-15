<script setup lang="ts">
import { RouterView } from 'vue-router'
import { api } from './api/apiBase';
console.log('BASE URL:', api.defaults.baseURL)
import Toast from 'primevue/toast'

import { useToast } from 'primevue/usetoast'
import { setToastInstance } from '@/utils/toastService'

const toast = useToast()
setToastInstance(toast)
</script>

<template>
  <div class="main-container">
    <RouterView />
    <Toast />
  </div>
</template>