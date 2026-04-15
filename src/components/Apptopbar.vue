<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useClinicaStore } from '@/stores/clinica'

const route = useRoute()
const store = useClinicaStore()

const title = computed(() => route.meta.title || 'Panel')
const hoy   = computed(() => {
  return new Intl.DateTimeFormat('es-HN', {
    weekday: 'long', day: 'numeric', month: 'long'
  }).format(new Date(2025, 3, 13))
})

const pendientes = computed(() =>
  store.citas.filter(c => c.fecha === '2025-04-13' && c.estado === 'pendiente').length
)
</script>

<template>
  <header class="app-topbar">
    <div>
      <div class="topbar-title">{{ title }}</div>
      <div class="topbar-sub">{{ hoy }} · <span v-if="pendientes">{{ pendientes }} cita{{ pendientes !== 1 ? 's' : '' }} pendiente{{ pendientes !== 1 ? 's' : '' }} de confirmar</span><span v-else>Agenda al día</span></div>
    </div>

    <div class="topbar-right">
      <div class="search-wrap">
        <i class="pi pi-search search-icon"></i>
        <input type="text" placeholder="Buscar paciente..." class="topbar-search" />
      </div>

      <button class="topbar-icon-btn" title="Notificaciones">
        <i class="pi pi-bell"></i>
        <span class="notif-dot"></span>
      </button>

      <RouterLink to="/agenda" class="btn btn-brand btn-sm">
        <i class="pi pi-plus"></i> Nueva cita
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.topbar-title { font-size: 15px; font-weight: 600; color: var(--neutral-800); }
.topbar-sub   { font-size: 12px; color: var(--neutral-400); margin-top: 1px; }

.topbar-right { display: flex; align-items: center; gap: 10px; }

.search-wrap { position: relative; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 12px; color: var(--neutral-300); }
.topbar-search {
  padding: 6px 12px 6px 30px; border-radius: var(--radius-md);
  border: 1px solid var(--neutral-200); background: var(--neutral-50);
  font-size: 12px; color: var(--neutral-700); outline: none; width: 200px;
}
.topbar-search:focus { border-color: var(--brand-400); background: #fff; box-shadow: 0 0 0 3px rgba(58,170,135,.1); }

.topbar-icon-btn {
  width: 32px; height: 32px; border-radius: var(--radius-md);
  background: transparent; border: 1px solid var(--neutral-200);
  display: flex; align-items: center; justify-content: center;
  color: var(--neutral-500); font-size: 13px; position: relative;
}
.topbar-icon-btn:hover { background: var(--neutral-100); }
.notif-dot {
  position: absolute; top: 5px; right: 5px;
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--brand-500); border: 1.5px solid #fff;
}
</style>