<script setup>
import { ref, computed } from 'vue'
import { useClinicaStore } from '@/stores/clinica'

const store = useClinicaStore()

const vistaActiva = ref('semana')
const semanaOffset = ref(0)

// Días de la semana actual
const diasSemana = computed(() => {
  const base = new Date(2025, 3, 13) // 13 abril 2025 (domingo)
  const lunes = new Date(base)
  lunes.setDate(base.getDate() - base.getDay() + 1 + semanaOffset.value * 7)
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(lunes)
    d.setDate(lunes.getDate() + i)
    return {
      fecha: d.toISOString().split('T')[0],
      dia: d.toLocaleDateString('es', { weekday: 'short' }),
      num: d.getDate(),
      esHoy: d.toISOString().split('T')[0] === '2025-04-13'
    }
  })
})

const horas = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00']

const getCitaEnSlot = (fecha, hora) => {
  return store.citas.find(c => c.fecha === fecha && c.hora === hora)
}

const nombrePaciente = (pid) => {
  const p = store.getPaciente(pid)
  return p ? `${p.nombre} ${p.apellido}` : '—'
}

const colorCita = (estado) => ({
  confirmada: '#e8f4f0',
  pendiente:  '#fef3c7',
  completada: '#eff6ff'
}[estado] || '#f1f2f1')

const borderCita = (estado) => ({
  confirmada: 'var(--brand-400)',
  pendiente:  '#f59e0b',
  completada: '#60a5fa'
}[estado] || '#d1d5db')

// Modal nueva cita
const showModal = ref(false)
const nuevaCita = ref({ pacienteId: '', fecha: '2025-04-13', hora: '09:00', servicio: '', notas: '' })

const guardarCita = () => {
  if (!nuevaCita.value.pacienteId || !nuevaCita.value.servicio) return
  store.agregarCita({ ...nuevaCita.value, estado: 'pendiente', duracion: 45 })
  showModal.value = false
  nuevaCita.value = { pacienteId: '', fecha: '2025-04-13', hora: '09:00', servicio: '', notas: '' }
}

const citaSeleccionada = ref(null)

const abrirCita = (cita) => {
  citaSeleccionada.value = cita
}

const confirmarCita = (id) => {
  store.actualizarCita(id, { estado: 'confirmada' })
  citaSeleccionada.value = null
}

const cancelarCita = (id) => {
  store.eliminarCita(id)
  citaSeleccionada.value = null
}
</script>

<template>
  <div>

    <!-- Header -->
    <div class="agenda-header card card-pad" style="display:flex;align-items:center;justify-content:space-between;gap:1rem">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn btn-ghost btn-sm" @click="semanaOffset--">
          <i class="pi pi-chevron-left"></i>
        </button>
        <div class="text-base font-medium">
          {{ diasSemana[0].num }} — {{ diasSemana[5].num }} abril 2025
        </div>
        <button class="btn btn-ghost btn-sm" @click="semanaOffset++">
          <i class="pi pi-chevron-right"></i>
        </button>
        <button class="btn btn-outline btn-sm" @click="semanaOffset=0">Hoy</button>
      </div>

      <div style="display:flex;align-items:center;gap:8px">
        <div class="vista-toggle">
          <button :class="{ active: vistaActiva === 'semana' }" @click="vistaActiva='semana'">Semana</button>
          <button :class="{ active: vistaActiva === 'dia' }"    @click="vistaActiva='dia'">Día</button>
        </div>
        <button class="btn btn-brand btn-sm" @click="showModal=true">
          <i class="pi pi-plus"></i> Nueva cita
        </button>
      </div>
    </div>

    <!-- Calendario -->
    <div class="card" style="overflow:hidden">
      <div class="cal-grid">

        <!-- Header días -->
        <div class="cal-time-col"></div>
        <div
          v-for="dia in diasSemana"
          :key="dia.fecha"
          class="cal-day-header"
          :class="{ hoy: dia.esHoy }"
        >
          <div class="dia-name">{{ dia.dia }}</div>
          <div class="dia-num" :class="{ 'dia-num-hoy': dia.esHoy }">{{ dia.num }}</div>
        </div>

        <!-- Filas de horas -->
        <template v-for="hora in horas" :key="hora">
          <div class="cal-time-label">{{ hora }}</div>
          <div
            v-for="dia in diasSemana"
            :key="dia.fecha + hora"
            class="cal-cell"
            :class="{ 'cell-hoy': dia.esHoy }"
          >
            <div
              v-if="getCitaEnSlot(dia.fecha, hora)"
              class="cita-chip"
              :style="{
                background: colorCita(getCitaEnSlot(dia.fecha, hora).estado),
                borderLeft: `3px solid ${borderCita(getCitaEnSlot(dia.fecha, hora).estado)}`
              }"
              @click="abrirCita(getCitaEnSlot(dia.fecha, hora))"
            >
              <div class="cita-nombre">{{ nombrePaciente(getCitaEnSlot(dia.fecha, hora).pacienteId) }}</div>
              <div class="cita-servicio">{{ getCitaEnSlot(dia.fecha, hora).servicio }}</div>
            </div>
          </div>
        </template>

      </div>
    </div>

    <!-- Modal nueva cita -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal=false">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">Nueva cita</div>
            <button class="btn btn-ghost btn-sm" @click="showModal=false"><i class="pi pi-times"></i></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Paciente</label>
              <select v-model="nuevaCita.pacienteId" class="form-select">
                <option value="">Seleccionar paciente...</option>
                <option v-for="p in store.pacientes" :key="p.id" :value="p.id">
                  {{ p.nombre }} {{ p.apellido }}
                </option>
              </select>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
              <div class="form-group">
                <label class="form-label">Fecha</label>
                <input type="date" v-model="nuevaCita.fecha" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Hora</label>
                <select v-model="nuevaCita.hora" class="form-select">
                  <option v-for="h in horas" :key="h" :value="h">{{ h }}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Servicio</label>
              <select v-model="nuevaCita.servicio" class="form-select">
                <option value="">Seleccionar servicio...</option>
                <option v-for="s in store.clinica.servicios" :key="s.id" :value="s.nombre">
                  {{ s.nombre }} — L. {{ s.precio }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Notas (opcional)</label>
              <textarea v-model="nuevaCita.notas" class="form-input" rows="3" placeholder="Instrucciones especiales..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" @click="showModal=false">Cancelar</button>
            <button class="btn btn-brand" @click="guardarCita">Guardar cita</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal detalle cita -->
    <Transition name="fade">
      <div v-if="citaSeleccionada" class="modal-overlay" @click.self="citaSeleccionada=null">
        <div class="modal" style="max-width:420px">
          <div class="modal-header">
            <div class="modal-title">Detalle de cita</div>
            <button class="btn btn-ghost btn-sm" @click="citaSeleccionada=null"><i class="pi pi-times"></i></button>
          </div>
          <div class="modal-body" style="display:flex;flex-direction:column;gap:12px">
            <div class="detalle-row"><span>Paciente</span><strong>{{ nombrePaciente(citaSeleccionada.pacienteId) }}</strong></div>
            <div class="detalle-row"><span>Servicio</span><strong>{{ citaSeleccionada.servicio }}</strong></div>
            <div class="detalle-row"><span>Fecha y hora</span><strong>{{ citaSeleccionada.fecha }} {{ citaSeleccionada.hora }}</strong></div>
            <div class="detalle-row"><span>Duración</span><strong>{{ citaSeleccionada.duracion }} min</strong></div>
            <div class="detalle-row"><span>Estado</span>
              <span :class="['badge', citaSeleccionada.estado === 'confirmada' ? 'badge-success' : 'badge-warning']">
                {{ citaSeleccionada.estado }}
              </span>
            </div>
            <div v-if="citaSeleccionada.notas" class="detalle-row"><span>Notas</span><span>{{ citaSeleccionada.notas }}</span></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger btn-sm" @click="cancelarCita(citaSeleccionada.id)">
              <i class="pi pi-trash"></i> Cancelar cita
            </button>
            <button v-if="citaSeleccionada.estado === 'pendiente'" class="btn btn-brand btn-sm" @click="confirmarCita(citaSeleccionada.id)">
              <i class="pi pi-check"></i> Confirmar
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.agenda-header { margin-bottom: 0; }

.vista-toggle {
  display: flex; border: 1px solid var(--neutral-200); border-radius: var(--radius-md); overflow: hidden;
}
.vista-toggle button {
  padding: 5px 12px; font-size: 12px; background: transparent; border: none;
  color: var(--neutral-500); transition: all .15s;
}
.vista-toggle button.active { background: var(--neutral-100); color: var(--neutral-800); font-weight: 500; }

.cal-grid {
  display: grid;
  grid-template-columns: 52px repeat(6, 1fr);
  overflow-y: auto; max-height: calc(100vh - 220px);
}

.cal-time-col { background: var(--neutral-0); border-right: 1px solid var(--neutral-150); position: sticky; top: 0; z-index: 10; }

.cal-day-header {
  padding: 12px 6px; text-align: center;
  border-right: 1px solid var(--neutral-150);
  border-bottom: 1px solid var(--neutral-150);
  background: var(--neutral-0); position: sticky; top: 0; z-index: 9;
}
.cal-day-header.hoy { background: var(--brand-50); }
.dia-name { font-size: 11px; color: var(--neutral-400); text-transform: uppercase; letter-spacing: .04em; }
.dia-num { font-size: 18px; font-weight: 500; color: var(--neutral-700); margin-top: 2px; }
.dia-num-hoy {
  background: var(--brand-500); color: #fff;
  width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; margin: 2px auto 0;
}

.cal-time-label {
  font-size: 11px; color: var(--neutral-300); text-align: right;
  padding: 8px 8px 0; border-right: 1px solid var(--neutral-150);
  border-bottom: 1px solid var(--neutral-100);
  background: var(--neutral-0); height: 64px;
}

.cal-cell {
  border-right: 1px solid var(--neutral-150);
  border-bottom: 1px solid var(--neutral-100);
  padding: 4px; height: 64px; position: relative;
  transition: background .1s;
}
.cal-cell:hover { background: var(--neutral-50); }
.cal-cell.cell-hoy { background: rgba(58,170,135,.03); }

.cita-chip {
  padding: 5px 8px; border-radius: var(--radius-sm);
  cursor: pointer; height: 100%;
  transition: opacity .15s;
}
.cita-chip:hover { opacity: .85; }
.cita-nombre { font-size: 11px; font-weight: 600; color: var(--neutral-800); }
.cita-servicio { font-size: 10px; color: var(--neutral-500); margin-top: 1px; }

.detalle-row {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 13px; color: var(--neutral-600);
  padding: 6px 0; border-bottom: 1px solid var(--neutral-100);
}
.detalle-row:last-child { border-bottom: none; }
.detalle-row span:first-child { color: var(--neutral-400); }
</style>