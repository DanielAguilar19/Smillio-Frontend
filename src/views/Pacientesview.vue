<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useClinicaDashboardStore } from '@/stores/clinicaDashboardStore'
import { LanzarToast } from '@/utils/toastService'

const store  = useClinicaDashboardStore()
const router = useRouter()

const busqueda = ref('')
const filtroEstado = ref('todos')
const showModal = ref(false)

const nuevoPaciente = ref({
  nombre: '', apellido: '', email: '', telefono: '',
  fechaNacimiento: '', tipoSangre: '', alergias: '', enfermedades: '',
  sexo: 'F', avatarColor: 'blue', estado: 'nuevo'
})

const colores = ['blue','green','amber','violet','rose','teal']

const pacientesFiltrados = computed(() => {
  let lista = store.pacientes
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(p =>
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.telefono?.includes(q)
    )
  }
  if (filtroEstado.value !== 'todos') {
    lista = lista.filter(p => p.estado === filtroEstado.value)
  }
  return lista
})

const guardarPaciente = () => {
  // Los pacientes se registran ellos mismos desde la app.
  // Esta vista es de solo lectura para la clínica.
  LanzarToast('Los pacientes se registran desde la app de pacientes', 'info')
  showModal.value = false
}

const estadoBadge = { activo: 'badge-success', nuevo: 'badge-info', recordatorio: 'badge-warning' }
</script>

<template>
  <div>

    <!-- Toolbar -->
    <div class="card card-pad" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <div class="search-wrap" style="flex:1;min-width:200px">
        <i class="pi pi-search" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--neutral-300)"></i>
        <input v-model="busqueda" type="text" placeholder="Buscar por nombre, email o teléfono..." class="form-input" style="padding-left:30px" />
      </div>

      <div class="filtro-tabs">
        <button v-for="f in ['todos','activo','nuevo','recordatorio']" :key="f"
          :class="{ active: filtroEstado === f }"
          @click="filtroEstado = f"
        >
          {{ f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1) }}
          <span class="count">{{ f === 'todos' ? store.pacientes.length : store.pacientes.filter(p => p.estado === f).length }}</span>
        </button>
      </div>

      <button class="btn btn-brand btn-sm" @click="showModal=true">
        <i class="pi pi-plus"></i> Nuevo paciente
      </button>
    </div>

    <!-- Tabla -->
    <div class="card table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Contacto</th>
            <th>Última visita</th>
            <th>Próxima cita</th>
            <th>Estado</th>
            <th>Valoración</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in pacientesFiltrados"
            :key="p.id"
            style="cursor:pointer"
            @click="router.push(`/pacientes/${p.id}`)"
          >
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <div :class="['avatar avatar-md', `avatar-${p.avatarColor}`]">
                  {{ p.nombre[0] }}{{ p.apellido[0] }}
                </div>
                <div>
                  <div class="text-sm font-medium">{{ p.nombre }} {{ p.apellido }}</div>
                  <div class="text-xs text-muted">Desde {{ p.fechaRegistro }}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="text-sm">{{ p.email }}</div>
              <div class="text-xs text-muted">{{ p.telefono }}</div>
            </td>
            <td class="text-sm">{{ p.historial[0]?.fecha || '—' }}</td>
            <td class="text-sm">{{ p.proximaCita?.replace('T', ' ') || '—' }}</td>
            <td>
              <span :class="['badge', estadoBadge[p.estado] || 'badge-neutral']">
                {{ p.estado.charAt(0).toUpperCase() + p.estado.slice(1) }}
              </span>
            </td>
            <td>
              <template v-if="p.rating">
                <span class="stars">{{ '★'.repeat(p.rating) }}</span><span class="stars-empty">{{ '★'.repeat(5 - p.rating) }}</span>
              </template>
              <span v-else class="text-xs text-muted">—</span>
            </td>
            <td @click.stop>
              <button class="btn btn-ghost btn-sm" @click="router.push(`/pacientes/${p.id}`)">
                <i class="pi pi-eye"></i>
              </button>
            </td>
          </tr>
          <tr v-if="!pacientesFiltrados.length">
            <td colspan="7" style="text-align:center;padding:2rem;color:var(--neutral-400)">
              No se encontraron pacientes
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal nuevo paciente -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal=false">
        <div class="modal" style="max-width:580px">
          <div class="modal-header">
            <div class="modal-title">Nuevo paciente</div>
            <button class="btn btn-ghost btn-sm" @click="showModal=false"><i class="pi pi-times"></i></button>
          </div>
          <div class="modal-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
              <div class="form-group">
                <label class="form-label">Nombre *</label>
                <input v-model="nuevoPaciente.nombre" type="text" class="form-input" placeholder="Andrea" />
              </div>
              <div class="form-group">
                <label class="form-label">Apellido *</label>
                <input v-model="nuevoPaciente.apellido" type="text" class="form-input" placeholder="Pérez" />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input v-model="nuevoPaciente.email" type="email" class="form-input" placeholder="correo@ejemplo.com" />
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input v-model="nuevoPaciente.telefono" type="tel" class="form-input" placeholder="+504 9000-0000" />
              </div>
              <div class="form-group">
                <label class="form-label">Fecha de nacimiento</label>
                <input v-model="nuevoPaciente.fechaNacimiento" type="date" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Sexo</label>
                <select v-model="nuevoPaciente.sexo" class="form-select">
                  <option value="F">Femenino</option>
                  <option value="M">Masculino</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Tipo de sangre</label>
                <select v-model="nuevoPaciente.tipoSangre" class="form-select">
                  <option value="">—</option>
                  <option v-for="t in ['A+','A-','B+','B-','AB+','AB-','O+','O-']" :key="t">{{ t }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Color de avatar</label>
                <div style="display:flex;gap:8px;padding-top:4px">
                  <div
                    v-for="c in colores" :key="c"
                    :class="['avatar avatar-sm', `avatar-${c}`]"
                    :style="{ outline: nuevoPaciente.avatarColor === c ? '2px solid var(--brand-500)' : 'none', outlineOffset: '2px', cursor: 'pointer' }"
                    @click="nuevoPaciente.avatarColor = c"
                  >{{ nuevoPaciente.nombre?.[0] || 'P' }}</div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Alergias (separadas por coma)</label>
              <input v-model="nuevoPaciente.alergias" type="text" class="form-input" placeholder="Ej: Penicilina, Ibuprofeno" />
            </div>
            <div class="form-group">
              <label class="form-label">Enfermedades preexistentes (separadas por coma)</label>
              <input v-model="nuevoPaciente.enfermedades" type="text" class="form-input" placeholder="Ej: Diabetes, Hipertensión" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" @click="showModal=false">Cancelar</button>
            <button class="btn btn-brand" @click="guardarPaciente">Registrar paciente</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.search-wrap { position: relative; }

.filtro-tabs { display: flex; gap: 4px; }
.filtro-tabs button {
  padding: 5px 12px; border-radius: var(--radius-md);
  font-size: 12px; background: transparent;
  border: 1px solid transparent; color: var(--neutral-500);
  display: flex; align-items: center; gap: 5px;
}
.filtro-tabs button:hover { background: var(--neutral-100); }
.filtro-tabs button.active { background: var(--brand-50); color: var(--brand-700); border-color: var(--brand-100); }
.count {
  background: var(--neutral-150); color: var(--neutral-500);
  font-size: 10px; padding: 1px 5px; border-radius: 99px;
}
.filtro-tabs button.active .count { background: var(--brand-100); color: var(--brand-700); }

.table-scroll { overflow-x: auto; }

@media (max-width: 768px) {
  .filtro-tabs { flex-wrap: wrap; }
}
</style>