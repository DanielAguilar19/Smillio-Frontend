<script setup>
import { useRoute } from 'vue-router'
import { useClinicaStore } from '@/stores/clinica'

const route = useRoute()
const store = useClinicaStore()

const navPrincipal = [
  { label: 'Inicio',     to: '/dashboard',   icon: 'pi pi-home' },
  { label: 'Agenda',     to: '/agenda',       icon: 'pi pi-calendar' },
  { label: 'Pacientes',  to: '/pacientes',    icon: 'pi pi-users' }
]

const navGestion = [
  { label: 'Facturación', to: '/facturacion', icon: 'pi pi-credit-card' },
  { label: 'Reseñas',     to: '/resenas',     icon: 'pi pi-star', badge: store.resenas.filter(r => !r.respondida).length },
  { label: 'Mi clínica',  to: '/clinica',     icon: 'pi pi-building' }
]

const navConfig = [
  { label: 'Ajustes', to: '/ajustes', icon: 'pi pi-cog' }
]

const isActive = (path) => route.path.startsWith(path)
</script>

<template>
  <aside class="app-sidebar">

    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-mark">
        <i class="pi pi-heart-fill" style="font-size:14px;color:#fff"></i>
      </div>
      <div>
        <div class="logo-name">SmileCare</div>
        <div class="logo-sub">Panel de clínica</div>
      </div>
    </div>

    <!-- Nav principal -->
    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in navPrincipal"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: isActive(item.to) }"
      >
        <i :class="item.icon" class="nav-icon"></i>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="nav-section-label">Gestión</div>
    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in navGestion"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: isActive(item.to) }"
      >
        <i :class="item.icon" class="nav-icon"></i>
        <span>{{ item.label }}</span>
        <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
      </RouterLink>
    </nav>

    <div class="nav-section-label">Configuración</div>
    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in navConfig"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: isActive(item.to) }"
      >
        <i :class="item.icon" class="nav-icon"></i>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Spacer -->
    <div style="flex:1"></div>

    <!-- Profile -->
    <div class="sidebar-profile">
      <div class="avatar avatar-sm avatar-green">AM</div>
      <div class="profile-info">
        <div class="profile-name">{{ store.clinica.doctor.nombre }}</div>
        <div class="profile-role">Administrador</div>
      </div>
      <i class="pi pi-ellipsis-h" style="font-size:12px;color:var(--neutral-300);margin-left:auto;cursor:pointer"></i>
    </div>

  </aside>
</template>

<style scoped>
.sidebar-logo {
  display: flex; align-items: center; gap: 10px;
  padding: 1.25rem 1rem 1rem;
  border-bottom: 1px solid var(--neutral-150);
}
.logo-mark {
  width: 32px; height: 32px; border-radius: 10px;
  background: var(--brand-500);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.logo-name  { font-size: 14px; font-weight: 600; color: var(--neutral-800); line-height: 1.2; }
.logo-sub   { font-size: 10px; color: var(--neutral-400); }

.sidebar-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 0.75rem; }

.nav-section-label {
  font-size: 10px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
  color: var(--neutral-300); padding: 1rem 1rem 0.4rem;
}

.nav-item {
  display: flex; align-items: center; gap: 9px;
  padding: 7px 10px; border-radius: var(--radius-md);
  font-size: 13px; color: var(--neutral-500);
  transition: all .15s; text-decoration: none;
}
.nav-item:hover { background: var(--neutral-100); color: var(--neutral-700); }
.nav-item.active {
  background: var(--brand-50); color: var(--brand-700); font-weight: 500;
}
.nav-icon { font-size: 13px; width: 16px; text-align: center; flex-shrink: 0; }

.nav-badge {
  margin-left: auto; background: var(--brand-500); color: #fff;
  font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 99px;
}

.sidebar-profile {
  display: flex; align-items: center; gap: 8px;
  padding: 0.875rem 1rem;
  border-top: 1px solid var(--neutral-150);
}
.profile-name { font-size: 12px; font-weight: 500; color: var(--neutral-700); }
.profile-role { font-size: 10px; color: var(--neutral-400); }
</style>