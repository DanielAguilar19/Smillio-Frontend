<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useClinicaDashboardStore } from '@/stores/clinicaDashboardStore'

const router = useRouter()
const store = useClinicaDashboardStore()

const proximasCitas = computed(() =>
  store.citasHoy.slice(0, 5)
)

const ultimasResenas = computed(() =>
  [...store.resenas]
    .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))
    .slice(0, 3)
)

const porcentajePagadas = computed(() => {
  if (!store.facturas.length) return 0
  const pagadas = store.facturas.filter(f => f.estado === 'pagada').length
  return Math.round((pagadas / store.facturas.length) * 100)
})
</script>

<template>
  <div class="dashboard-home">

    <!-- Bienvenida -->
    <div class="welcome-banner">
      <div class="welcome-text">
        <div class="welcome-title">
          <i class="pi pi-sun" style="font-size:18px;color:#f59e0b"></i>
          Bienvenido, <strong>{{ store.clinica?.doctorNombre || 'Doctor' }}</strong>
        </div>
        <div class="welcome-sub">
          {{ store.clinica?.nombre }} · {{ new Date().toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
        </div>
      </div>
      <button class="btn btn-brand" @click="router.push('/agenda')">
        <i class="pi pi-plus"></i> Nueva cita
      </button>
    </div>

    <!-- Métricas principales -->
    <div class="metrics-row">
      <div class="metric-card metric-blue">
        <div class="metric-icon"><i class="pi pi-calendar"></i></div>
        <div class="metric-body">
          <div class="metric-value">{{ store.citasHoy.length }}</div>
          <div class="metric-label">Citas hoy</div>
        </div>
      </div>
      <div class="metric-card metric-green">
        <div class="metric-icon"><i class="pi pi-users"></i></div>
        <div class="metric-body">
          <div class="metric-value">{{ store.pacientes.length }}</div>
          <div class="metric-label">Pacientes activos</div>
        </div>
      </div>
      <div class="metric-card metric-amber">
        <div class="metric-icon"><i class="pi pi-dollar"></i></div>
        <div class="metric-body">
          <div class="metric-value">L. {{ store.totalMes.toLocaleString() }}</div>
          <div class="metric-label">Ingresos del mes</div>
        </div>
      </div>
      <div class="metric-card metric-violet">
        <div class="metric-icon"><i class="pi pi-star"></i></div>
        <div class="metric-body">
          <div class="metric-value">{{ store.clinica?.rating?.toFixed(1) || '—' }}</div>
          <div class="metric-label">Valoración media</div>
        </div>
      </div>
    </div>

    <!-- Grid principal -->
    <div class="main-grid">

      <!-- Citas de hoy -->
      <div class="card card-pad section-card">
        <div class="section-header">
          <div class="section-title"><i class="pi pi-calendar-clock"></i> Agenda de hoy</div>
          <button class="btn btn-ghost btn-sm" @click="router.push('/agenda')">Ver todo</button>
        </div>

        <div v-if="proximasCitas.length" class="citas-list">
          <div v-for="cita in proximasCitas" :key="cita.id" class="cita-item">
            <div class="cita-hora">{{ cita.hora }}</div>
            <div :class="['cita-indicator', `indicator-${cita.estado}`]"></div>
            <div class="cita-info">
              <div class="cita-nombre">{{ cita.nombrePaciente || 'Paciente' }}</div>
              <div class="cita-servicio">{{ cita.servicio }}</div>
            </div>
            <span :class="['badge', cita.estado === 'confirmada' ? 'badge-success' : 'badge-warning']">
              {{ cita.estado }}
            </span>
          </div>
        </div>

        <div v-else class="empty-state">
          <i class="pi pi-calendar" style="font-size:28px;margin-bottom:8px"></i>
          <div>No hay citas programadas para hoy</div>
          <button class="btn btn-outline btn-sm" style="margin-top:10px" @click="router.push('/agenda')">
            Agendar cita
          </button>
        </div>
      </div>

      <!-- Panel derecho -->
      <div class="right-panel">

        <!-- Pendientes de cobro -->
        <div class="card card-pad">
          <div class="section-header">
            <div class="section-title"><i class="pi pi-file-invoice"></i> Por cobrar</div>
            <button class="btn btn-ghost btn-sm" @click="router.push('/facturacion')">Ver todo</button>
          </div>
          <div v-if="store.pendientesCobro > 0" class="cobro-amount">
            <div class="cobro-value">L. {{ store.pendientesCobro.toLocaleString() }}</div>
            <div class="cobro-sub">
              {{ store.facturas.filter(f => f.estado === 'pendiente' || f.estado === 'vencida').length }} facturas pendientes
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: porcentajePagadas + '%' }"></div>
            </div>
            <div class="text-xs text-muted" style="margin-top:4px">{{ porcentajePagadas }}% cobrado este período</div>
          </div>
          <div v-else class="empty-state" style="padding:1rem 0">
            <i class="pi pi-check-circle" style="font-size:24px;color:#22c55e"></i>
            <div style="margin-top:6px">Sin pendientes de cobro</div>
          </div>
        </div>

        <!-- Últimas reseñas -->
        <div class="card card-pad">
          <div class="section-header">
            <div class="section-title"><i class="pi pi-star"></i> Últimas reseñas</div>
            <button class="btn btn-ghost btn-sm" @click="router.push('/resenas')">Ver todo</button>
          </div>
          <div v-if="ultimasResenas.length" class="resenas-list">
            <div v-for="r in ultimasResenas" :key="r.id" class="resena-item">
              <div class="resena-stars">
                <span class="stars">{{ '★'.repeat(r.rating) }}</span><span class="stars-empty">{{ '★'.repeat(5 - r.rating) }}</span>
              </div>
              <div class="resena-texto text-sm">{{ r.texto }}</div>
              <div class="text-xs text-muted" style="margin-top:4px">{{ r.fecha }}</div>
              <span v-if="!r.respondida" class="badge badge-warning" style="margin-top:4px">Sin responder</span>
            </div>
          </div>
          <div v-else class="empty-state" style="padding:1rem 0">
            <i class="pi pi-star" style="font-size:24px;color:var(--neutral-300)"></i>
            <div style="margin-top:6px">Sin reseñas aún</div>
          </div>
        </div>

        <!-- Accesos rápidos -->
        <div class="card card-pad">
          <div class="section-title" style="margin-bottom:10px"><i class="pi pi-bolt"></i> Accesos rápidos</div>
          <div class="quick-links">
            <button class="quick-link" @click="router.push('/pacientes')">
              <i class="pi pi-users"></i>
              <span>Pacientes</span>
            </button>
            <button class="quick-link" @click="router.push('/facturacion')">
              <i class="pi pi-file-invoice"></i>
              <span>Facturas</span>
            </button>
            <button class="quick-link" @click="router.push('/mi-clinica')">
              <i class="pi pi-cog"></i>
              <span>Mi clínica</span>
            </button>
            <button class="quick-link" @click="router.push('/resenas')">
              <i class="pi pi-star"></i>
              <span>Reseñas</span>
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.dashboard-home {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Welcome */
.welcome-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: linear-gradient(135deg, var(--brand-600) 0%, var(--brand-400) 100%);
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-lg);
  flex-wrap: wrap;
}
.welcome-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}
.welcome-sub {
  font-size: 12px;
  color: rgba(255,255,255,.75);
  margin-top: 3px;
  text-transform: capitalize;
}

/* Metrics */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
@media (max-width: 900px) {
  .metrics-row { grid-template-columns: repeat(2, 1fr); }
}
.metric-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg);
  background: white;
  border: 1px solid var(--neutral-150);
}
.metric-icon {
  width: 44px; height: 44px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.metric-blue  .metric-icon { background: #dbeafe; color: #1d4ed8; }
.metric-green .metric-icon { background: #dcfce7; color: #15803d; }
.metric-amber .metric-icon { background: #fef3c7; color: #b45309; }
.metric-violet .metric-icon { background: #ede9fe; color: #7c3aed; }
.metric-value { font-size: 22px; font-weight: 700; color: var(--neutral-800); line-height: 1.1; }
.metric-label { font-size: 11px; color: var(--neutral-400); margin-top: 2px; }

/* Main grid */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.25rem;
  align-items: start;
}
@media (max-width: 960px) {
  .main-grid { grid-template-columns: 1fr; }
}
.right-panel { display: flex; flex-direction: column; gap: 1rem; }

.section-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem;
}
.section-title {
  font-size: 13px; font-weight: 600; color: var(--neutral-700);
  display: flex; align-items: center; gap: 6px;
}

/* Citas list */
.citas-list { display: flex; flex-direction: column; gap: 8px; }
.cita-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: var(--radius-md);
  background: var(--neutral-50);
}
.cita-hora { font-size: 12px; font-weight: 600; color: var(--brand-600); min-width: 40px; }
.cita-indicator { width: 4px; height: 32px; border-radius: 99px; flex-shrink: 0; }
.indicator-confirmada { background: #22c55e; }
.indicator-pendiente  { background: #f59e0b; }
.indicator-cancelada  { background: #ef4444; }
.cita-info { flex: 1; min-width: 0; }
.cita-nombre { font-size: 13px; font-weight: 500; color: var(--neutral-800); }
.cita-servicio { font-size: 11px; color: var(--neutral-400); }

/* Por cobrar */
.cobro-amount { display: flex; flex-direction: column; gap: 4px; }
.cobro-value { font-size: 24px; font-weight: 700; color: var(--neutral-800); }
.cobro-sub { font-size: 12px; color: var(--neutral-400); }
.progress-bar {
  height: 6px; background: var(--neutral-150); border-radius: 99px;
  margin-top: 8px; overflow: hidden;
}
.progress-fill { height: 100%; background: var(--brand-400); border-radius: 99px; transition: width .4s; }

/* Reseñas */
.resenas-list { display: flex; flex-direction: column; gap: 10px; }
.resena-item {
  padding: 8px; border-radius: var(--radius-md);
  background: var(--neutral-50); border: 1px solid var(--neutral-150);
}
.resena-stars { font-size: 12px; margin-bottom: 3px; }
.resena-texto { color: var(--neutral-600); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* Quick links */
.quick-links { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.quick-link {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 12px 8px; border-radius: var(--radius-md);
  background: var(--neutral-50); border: 1px solid var(--neutral-150);
  font-size: 11px; font-weight: 500; color: var(--neutral-600);
  cursor: pointer; transition: all .15s;
}
.quick-link i { font-size: 18px; color: var(--brand-500); }
.quick-link:hover { background: var(--brand-50); border-color: var(--brand-200); color: var(--brand-700); }

/* Empty state */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 2rem 1rem;
  color: var(--neutral-400); font-size: 13px; text-align: center;
}
</style>
