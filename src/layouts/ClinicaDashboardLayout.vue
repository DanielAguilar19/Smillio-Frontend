<template>
  <div class="clinic-layout">
    <!-- TOP HEADER -->
    <div class="clinic-topbar">
      <div class="clinic-topbar-brand">
        <img src="/logo.png" alt="Smillio" class="topbar-logo" />
        <span class="topbar-name">Smillio</span>
      </div>
      <div class="clinic-topbar-title">
        {{ store.clinica?.nombre || 'Panel de clínica' }}
      </div>
      <div class="clinic-topbar-actions">
        <Button
          icon="pi pi-bell"
          text
          rounded
          class="topbar-btn"
          v-tooltip="'Notificaciones'"
        />
        <div class="topbar-user">
          <div class="topbar-avatar">
            <i class="pi pi-building" style="font-size:14px"></i>
          </div>
          <span class="topbar-user-name">{{ store.clinica?.doctorNombre || 'Mi clínica' }}</span>
          <Button
            icon="pi pi-sign-out"
            text
            rounded
            class="topbar-btn"
            v-tooltip="'Cerrar sesión'"
            @click="cerrarSesion"
          />
        </div>
      </div>
    </div>

    <!-- CUERPO -->
    <div class="clinic-body">
      <!-- SIDEBAR -->
      <nav class="clinic-sidebar">
        <ul class="sidebar-menu">
          <li v-for="item in menuItems" :key="item.to">
            <router-link
              :to="item.to"
              class="sidebar-link"
              :class="{ 'sidebar-link-active': route.path === item.to }"
            >
              <i :class="['sidebar-icon', 'pi', item.icon]"></i>
              <span>{{ item.label }}</span>
            </router-link>
          </li>
        </ul>

        <div class="sidebar-footer">
          <router-link to="/mi-clinica" class="sidebar-link" :class="{ 'sidebar-link-active': route.path === '/mi-clinica' }">
            <i class="sidebar-icon pi pi-cog"></i>
            <span>Mi clínica</span>
          </router-link>
          <router-link to="/ajustes" class="sidebar-link" :class="{ 'sidebar-link-active': route.path === '/ajustes' }">
            <i class="sidebar-icon pi pi-sliders-h"></i>
            <span>Ajustes</span>
          </router-link>
        </div>
      </nav>

      <!-- CONTENIDO -->
      <main class="clinic-content">
        <div v-if="store.loading" class="loading-overlay">
          <ProgressSpinner />
        </div>
        <RouterView v-else />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import { useClinicaDashboardStore } from '@/stores/clinicaDashboardStore'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/api/apiBase'

const route = useRoute()
const router = useRouter()
const store = useClinicaDashboardStore()
const authStore = useAuthStore()

const menuItems = [
  { to: '/agenda',      icon: 'pi-calendar',        label: 'Agenda' },
  { to: '/pacientes',   icon: 'pi-users',            label: 'Pacientes' },
  { to: '/facturacion', icon: 'pi-file-invoice',     label: 'Facturación' },
  { to: '/resenas',     icon: 'pi-star',             label: 'Reseñas' },
]

const cerrarSesion = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  // Obtener clinicaId del usuario autenticado
  if (!store.clinicaId && authStore.user?.id) {
    try {
      const res = await api.get(`/clinicas/usuario/${authStore.user.id}`)
      const clinicaId = res.data?.id
      if (clinicaId) {
        await store.cargarTodo(clinicaId)
      }
    } catch (e) {
      console.error('Error al cargar clínica:', e)
    }
  }
})
</script>

<style scoped>
.clinic-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #f8fafc;
}

/* ── TOPBAR ─────────────────────────────────────── */
.clinic-topbar {
  height: 60px;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  padding: 0 1.25rem;
  gap: 1rem;
  flex-shrink: 0;
  z-index: 20;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.clinic-topbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 220px;
  flex-shrink: 0;
}

.topbar-logo {
  height: 32px;
  width: 32px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.topbar-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.clinic-topbar-title {
  flex: 1;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255,255,255,0.9);
}

.clinic-topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.topbar-btn {
  color: white !important;
  background: transparent !important;
  border: none !important;
}

.topbar-btn:hover {
  background: rgba(255,255,255,0.15) !important;
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.topbar-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.topbar-user-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255,255,255,0.9);
}

/* ── BODY ───────────────────────────────────────── */
.clinic-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ── SIDEBAR ────────────────────────────────────── */
.clinic-sidebar {
  width: 220px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  flex-shrink: 0;
  overflow-y: auto;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.25rem;
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 0;
  transition: all 0.15s;
  position: relative;
}

.sidebar-link:hover {
  background: #f1f5f9;
  color: var(--color-primary);
}

.sidebar-link-active {
  color: var(--color-primary) !important;
  background: #eef3fc !important;
  font-weight: 600;
}

.sidebar-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-primary);
  border-radius: 0 3px 3px 0;
}

.sidebar-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* ── CONTENT ────────────────────────────────────── */
.clinic-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  position: relative;
}

.loading-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
