<script setup>
import { ref } from 'vue'
import { useClinicaStore } from '@/stores/clinica'

const store = useClinicaStore()
const clinica = ref({ ...store.clinica })
const guardado = ref(false)
const tabActiva = ref('general')

const tabs = [
  { id: 'general',   label: 'Información general' },
  { id: 'horario',   label: 'Horario de atención' },
  { id: 'servicios', label: 'Servicios y precios' }
]

const dias = [
  { key: 'lunes',     label: 'Lunes' },
  { key: 'martes',    label: 'Martes' },
  { key: 'miercoles', label: 'Miércoles' },
  { key: 'jueves',    label: 'Jueves' },
  { key: 'viernes',   label: 'Viernes' },
  { key: 'sabado',    label: 'Sábado' },
  { key: 'domingo',   label: 'Domingo' }
]

const guardar = () => {
  Object.assign(store.clinica, clinica.value)
  guardado.value = true
  setTimeout(() => guardado.value = false, 2500)
}

const nuevoServicio = ref({ nombre: '', duracion: 30, precio: 0 })
const agregarServicio = () => {
  if (!nuevoServicio.value.nombre) return
  clinica.value.servicios.push({ id: `s${Date.now()}`, ...nuevoServicio.value })
  nuevoServicio.value = { nombre: '', duracion: 30, precio: 0 }
}
const eliminarServicio = (id) => {
  clinica.value.servicios = clinica.value.servicios.filter(s => s.id !== id)
}
</script>

<template>
  <div>

    <!-- Header con foto de portada simulada -->
    <div class="clinica-cover card" style="overflow:hidden;margin-bottom:0">
      <div class="cover-bg">
        <div class="cover-content">
          <div class="clinica-avatar">
            <i class="pi pi-heart-fill" style="font-size:28px;color:#fff"></i>
          </div>
          <div>
            <div style="font-size:22px;font-weight:600;color:#fff">{{ store.clinica.nombre }}</div>
            <div style="font-size:13px;color:rgba(255,255,255,.8);margin-top:3px">
              <i class="pi pi-map-marker" style="font-size:11px"></i>
              {{ store.clinica.direccion }}
            </div>
          </div>
          <div style="margin-left:auto;display:flex;gap:8px">
            <div class="cover-stat">
              <div style="font-size:20px;font-weight:600">{{ store.clinica.rating }}</div>
              <div style="font-size:11px;opacity:.8">valoración</div>
            </div>
            <div class="cover-stat">
              <div style="font-size:20px;font-weight:600">{{ store.pacientes.length }}</div>
              <div style="font-size:11px;opacity:.8">pacientes</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-bar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="{ active: tabActiva === tab.id }"
          @click="tabActiva = tab.id"
        >{{ tab.label }}</button>
      </div>
    </div>

    <!-- Información general -->
    <div v-if="tabActiva === 'general'" class="card card-pad">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem">
        <div class="form-group" style="grid-column:1/-1">
          <label class="form-label">Nombre de la clínica</label>
          <input v-model="clinica.nombre" type="text" class="form-input" />
        </div>
        <div class="form-group" style="grid-column:1/-1">
          <label class="form-label">Descripción</label>
          <textarea v-model="clinica.descripcion" class="form-input" rows="4"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">RTN</label>
          <input v-model="clinica.rtn" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Sitio web</label>
          <input v-model="clinica.web" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Teléfono</label>
          <input v-model="clinica.telefono" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Email de contacto</label>
          <input v-model="clinica.email" type="email" class="form-input" />
        </div>
        <div class="form-group" style="grid-column:1/-1">
          <label class="form-label">Dirección</label>
          <input v-model="clinica.direccion" type="text" class="form-input" />
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:0.5rem;gap:8px">
        <Transition name="fade">
          <span v-if="guardado" class="badge badge-success" style="padding:7px 12px;font-size:12px">
            <i class="pi pi-check"></i> Cambios guardados
          </span>
        </Transition>
        <button class="btn btn-brand" @click="guardar">Guardar cambios</button>
      </div>
    </div>

    <!-- Horario -->
    <div v-if="tabActiva === 'horario'" class="card card-pad">
      <div style="display:flex;flex-direction:column;gap:10px">
        <div v-for="dia in dias" :key="dia.key" class="horario-row">
          <div style="display:flex;align-items:center;gap:10px;min-width:140px">
            <label class="toggle-wrap">
              <input type="checkbox" v-model="clinica.horario[dia.key].activo" />
              <span class="toggle-slider"></span>
            </label>
            <span class="text-sm" :class="clinica.horario[dia.key].activo ? 'text-primary font-medium' : 'text-muted'">
              {{ dia.label }}
            </span>
          </div>
          <template v-if="clinica.horario[dia.key].activo">
            <div style="display:flex;align-items:center;gap:8px">
              <input type="time" v-model="clinica.horario[dia.key].desde" class="form-input" style="width:120px" />
              <span class="text-xs text-muted">hasta</span>
              <input type="time" v-model="clinica.horario[dia.key].hasta" class="form-input" style="width:120px" />
            </div>
          </template>
          <span v-else class="text-xs text-muted">Cerrado</span>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:1rem">
        <button class="btn btn-brand" @click="guardar">Guardar horario</button>
      </div>
    </div>

    <!-- Servicios -->
    <div v-if="tabActiva === 'servicios'">
      <div class="card" style="overflow:hidden">
        <table class="data-table">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Duración (min)</th>
              <th>Precio (L.)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in clinica.servicios" :key="s.id">
              <td class="text-sm font-medium">{{ s.nombre }}</td>
              <td>
                <input type="number" v-model="s.duracion" class="form-input" style="width:80px" />
              </td>
              <td>
                <input type="number" v-model="s.precio" class="form-input" style="width:100px" />
              </td>
              <td>
                <button class="btn btn-ghost btn-sm" style="color:var(--color-danger)" @click="eliminarServicio(s.id)">
                  <i class="pi pi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Agregar -->
      <div class="card card-pad" style="margin-top:0">
        <div class="text-sm font-medium" style="margin-bottom:.75rem">Agregar nuevo servicio</div>
        <div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap">
          <div class="form-group" style="flex:1;min-width:180px;margin-bottom:0">
            <label class="form-label">Nombre del servicio</label>
            <input v-model="nuevoServicio.nombre" type="text" class="form-input" placeholder="Ej: Corona dental" />
          </div>
          <div class="form-group" style="width:120px;margin-bottom:0">
            <label class="form-label">Duración (min)</label>
            <input v-model="nuevoServicio.duracion" type="number" class="form-input" />
          </div>
          <div class="form-group" style="width:140px;margin-bottom:0">
            <label class="form-label">Precio (L.)</label>
            <input v-model="nuevoServicio.precio" type="number" class="form-input" />
          </div>
          <button class="btn btn-brand" @click="agregarServicio">
            <i class="pi pi-plus"></i> Agregar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.clinica-cover { margin-bottom: 0; border-bottom: none; border-radius: var(--radius-lg) var(--radius-lg) 0 0; }

.cover-bg {
  background: linear-gradient(135deg, var(--brand-600) 0%, var(--brand-400) 100%);
  padding: 1.75rem 1.5rem;
}
.cover-content { display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; }
.clinica-avatar {
  width: 56px; height: 56px; border-radius: 16px;
  background: rgba(255,255,255,.2);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.cover-stat {
  background: rgba(255,255,255,.15); border-radius: var(--radius-md);
  padding: 8px 16px; text-align: center; color: #fff;
}

.tabs-bar {
  display: flex; padding: 0 0.5rem;
  border-bottom: 1px solid var(--neutral-150);
  background: var(--neutral-0);
}
.tabs-bar button {
  padding: 12px 16px; font-size: 13px;
  background: transparent; border: none;
  color: var(--neutral-500); position: relative; transition: color .15s;
}
.tabs-bar button:hover { color: var(--neutral-700); }
.tabs-bar button.active { color: var(--brand-600); font-weight: 500; }
.tabs-bar button.active::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0;
  height: 2px; background: var(--brand-500); border-radius: 99px;
}

.horario-row {
  display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;
  padding: 10px 0; border-bottom: 1px solid var(--neutral-100);
}
.horario-row:last-child { border-bottom: none; }

/* Toggle switch */
.toggle-wrap { position: relative; display: inline-block; width: 36px; height: 20px; flex-shrink: 0; }
.toggle-wrap input { opacity: 0; width: 0; height: 0; }
.toggle-slider {
  position: absolute; inset: 0; background: var(--neutral-200);
  border-radius: 99px; transition: .2s; cursor: pointer;
}
.toggle-slider::before {
  content: ''; position: absolute;
  width: 14px; height: 14px; left: 3px; top: 3px;
  background: #fff; border-radius: 50%; transition: .2s;
}
.toggle-wrap input:checked + .toggle-slider { background: var(--brand-500); }
.toggle-wrap input:checked + .toggle-slider::before { transform: translateX(16px); }
</style>