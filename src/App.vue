<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { api } from './api/apiBase'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { setToastInstance } from '@/utils/toastService'
import { useAuthStore } from '@/stores/authStore'

const toast = useToast()
setToastInstance(toast)

const authStore = useAuthStore()
onMounted(() => {
  authStore.loadUser()
})
</script>

<template>
  <div class="main-container">
    <RouterView />
    <Toast />
  </div>
</template>