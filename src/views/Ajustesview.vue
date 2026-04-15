<script setup>
import { ref } from 'vue'
import { useClinicaStore } from '@/stores/clinica'

const store = useClinicaStore()

const notificaciones = ref({
  emailNuevaCita: true,
  emailCancelacion: true,
  emailRecordatorio: false,
  smsConfirmacion: true,
  smsRecordatorio: true,
  nuevaResena: true
})

const seguridad = ref({
  passActual: '',
  passNueva: '',
  passConfirm: ''
})

const apariencia = ref({
  idioma: 'es',
  zonaHoraria: 'America/Tegucigalpa',
  formatoFecha: 'DD/MM/YYYY',
  moneda: 'HNL'
})

const tabActiva = ref('notificaciones')

const tabs = [
  { id: 'notificaciones', label: 'Notificaciones', icon: 'pi pi-bell' },
  { id: 'apariencia',     label: 'Preferencias',   icon: 'pi pi-sliders-h' },
  { id: 'cuenta',         label: 'Cuenta',          icon: 'pi pi-user' },
  { id: 'seguridad',      label: 'Seguridad',       icon: 'pi pi-lock' }
]

const guardado = ref(false)
const guardar = () => {
  guardado.value = true
  setTimeout(() => guardado.value = false, 2500)
}
</script>

<template>
  <div style="max-width:800px">

    <!-- Header tabs vertical -->
    <div style="display:grid;grid-template-columns:200px 1fr;gap:1.25rem">

      <!-- Sidebar tabs -->
      <div class="card card-pad" style="padding:0.75rem">
        <div style="display:flex;flex-direction:column;gap:2px">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="settings-tab"
            :class="{ active: tabActiva === tab.id }"
            @click="tabActiva = tab.id"
          >
            <i :class="tab.icon" style="font-size:13px"></i>
            {{ tab.label }}
          </button>
        </div>
        <div class="divider"></div>
        <button class="settings-tab" style="color:var(--color-danger)">
          <i class="pi pi-sign-out" style="font-size:13px"></i>
          Cerrar sesión
        </button>
      </div>

      <!-- Content -->
      <div>

        <!-- Notificaciones -->
        <div v-if="tabActiva === 'notificaciones'" class="card card-pad">
          <div class="settings-section-title">Notificaciones por email</div>
          <div style="display:flex;flex-direction:column;gap:0">
            <div v-for="(val, key) in { 'Nueva cita agendada': 'emailNuevaCita', 'Cancelación de cita': 'emailCancelacion', 'Recordatorio de cita': 'emailRecordatorio' }"
              :key="key" class="notif-row">
              <div>
                <div class="text-sm font-medium">{{ key }}</div>
              </div>
              <label class="toggle-wrap">
                <input type="checkbox" v-model="notificaciones[val]" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="divider"></div>
          <div class="settings-section-title">Notificaciones por SMS</div>
          <div style="display:flex;flex-direction:column;gap:0">
            <div class="notif-row">
              <div class="text-sm font-medium">Confirmación de cita</div>
              <label class="toggle-wrap"><input type="checkbox" v-model="notificaciones.smsConfirmacion" /><span class="toggle-slider"></span></label>
            </div>
            <div class="notif-row">
              <div class="text-sm font-medium">Recordatorio 24h antes</div>
              <label class="toggle-wrap"><input type="checkbox" v-model="notificaciones.smsRecordatorio" /><span class="toggle-slider"></span></label>
            </div>
            <div class="notif-row">
              <div class="text-sm font-medium">Nueva reseña recibida</div>
              <label class="toggle-wrap"><input type="checkbox" v-model="notificaciones.nuevaResena" /><span class="toggle-slider"></span></label>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:1rem">
            <button class="btn btn-brand" @click="guardar">Guardar preferencias</button>
          </div>
        </div>

        <!-- Preferencias -->
        <div v-if="tabActiva === 'apariencia'" class="card card-pad">
          <div class="settings-section-title">Preferencias del sistema</div>
          <div style="display:flex;flex-direction:column;gap:1rem">
            <div class="form-group">
              <label class="form-label">Idioma</label>
              <select v-model="apariencia.idioma" class="form-select">
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Zona horaria</label>
              <select v-model="apariencia.zonaHoraria" class="form-select">
                <option value="America/Tegucigalpa">América/Tegucigalpa (GMT-6)</option>
                <option value="America/Guatemala">América/Guatemala (GMT-6)</option>
                <option value="America/Mexico_City">América/Ciudad de México (GMT-6)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Formato de fecha</label>
              <select v-model="apariencia.formatoFecha" class="form-select">
                <option value="DD/MM/YYYY">DD/MM/AAAA</option>
                <option value="MM/DD/YYYY">MM/DD/AAAA</option>
                <option value="YYYY-MM-DD">AAAA-MM-DD</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Moneda</label>
              <select v-model="apariencia.moneda" class="form-select">
                <option value="HNL">Lempira (L.)</option>
                <option value="USD">Dólar ($)</option>
              </select>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:0.5rem">
            <button class="btn btn-brand" @click="guardar">Guardar</button>
          </div>
        </div>

        <!-- Cuenta -->
        <div v-if="tabActiva === 'cuenta'" class="card card-pad">
          <div class="settings-section-title">Información de la cuenta</div>
          <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;padding:1rem;background:var(--neutral-50);border-radius:var(--radius-md)">
            <div class="avatar avatar-lg avatar-green">AM</div>
            <div>
              <div class="text-base font-medium">{{ store.clinica.doctor.nombre }}</div>
              <div class="text-sm text-muted">{{ store.clinica.doctor.especialidad }}</div>
              <div class="text-xs text-muted" style="margin-top:3px">{{ store.clinica.email }}</div>
            </div>
            <button class="btn btn-outline btn-sm" style="margin-left:auto">Cambiar foto</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input type="text" value="Andrea" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Apellido</label>
              <input type="text" value="Méndez" class="form-input" />
            </div>
            <div class="form-group" style="grid-column:1/-1">
              <label class="form-label">Email</label>
              <input type="email" :value="store.clinica.email" class="form-input" />
            </div>
            <div class="form-group" style="grid-column:1/-1">
              <label class="form-label">Especialidad</label>
              <input type="text" :value="store.clinica.doctor.especialidad" class="form-input" />
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:0.5rem">
            <button class="btn btn-brand" @click="guardar">Guardar cambios</button>
          </div>
        </div>

        <!-- Seguridad -->
        <div v-if="tabActiva === 'seguridad'" class="card card-pad">
          <div class="settings-section-title">Cambiar contraseña</div>
          <div style="display:flex;flex-direction:column;gap:1rem">
            <div class="form-group">
              <label class="form-label">Contraseña actual</label>
              <input v-model="seguridad.passActual" type="password" class="form-input" placeholder="••••••••" />
            </div>
            <div class="form-group">
              <label class="form-label">Nueva contraseña</label>
              <input v-model="seguridad.passNueva" type="password" class="form-input" placeholder="Mínimo 8 caracteres" />
            </div>
            <div class="form-group">
              <label class="form-label">Confirmar nueva contraseña</label>
              <input v-model="seguridad.passConfirm" type="password" class="form-input" placeholder="••••••••" />
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:0.5rem">
            <button class="btn btn-brand" @click="guardar">Actualizar contraseña</button>
          </div>
          <div class="divider"></div>
          <div class="settings-section-title" style="color:var(--color-danger)">Zona de peligro</div>
          <p class="text-sm text-muted" style="margin-bottom:1rem">
            Eliminar la cuenta eliminará permanentemente todos los datos de la clínica, incluyendo pacientes, citas y facturas. Esta acción no se puede deshacer.
          </p>
          <button class="btn btn-danger btn-sm">Eliminar cuenta</button>
        </div>

        <!-- Feedback guardado -->
        <Transition name="fade">
          <div v-if="guardado" class="card card-pad" style="margin-top:0;background:var(--brand-50);border-color:var(--brand-200)">
            <div style="display:flex;align-items:center;gap:8px;color:var(--brand-700)">
              <i class="pi pi-check-circle"></i>
              <span class="text-sm font-medium">Cambios guardados correctamente</span>
            </div>
          </div>
        </Transition>

      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-tab {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 10px; border-radius: var(--radius-md);
  font-size: 13px; color: var(--neutral-500);
  background: transparent; border: none; width: 100%; text-align: left;
  transition: all .15s;
}
.settings-tab:hover { background: var(--neutral-100); color: var(--neutral-700); }
.settings-tab.active { background: var(--brand-50); color: var(--brand-700); font-weight: 500; }

.settings-section-title {
  font-size: 13px; font-weight: 600; color: var(--neutral-600);
  margin-bottom: 1rem; letter-spacing: .01em;
}

.notif-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 0; border-bottom: 1px solid var(--neutral-100);
}
.notif-row:last-child { border-bottom: none; }

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