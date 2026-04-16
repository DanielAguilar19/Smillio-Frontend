<script setup>
import { ref, computed } from 'vue'
import { useClinicaDashboardStore } from '@/stores/clinicaDashboardStore'

const store = useClinicaDashboardStore()
const filtro = ref('todas')
const respuestaTexto = ref('')
const resenaActiva = ref(null)

const resenasConPaciente = computed(() =>
  store.resenas.map(r => ({
    ...r,
    paciente: store.getPaciente(r.pacienteId)
  })).sort((a, b) => b.fecha.localeCompare(a.fecha))
)

const resenasFiltradas = computed(() => {
  if (filtro.value === 'todas') return resenasConPaciente.value
  if (filtro.value === 'sin-respuesta') return resenasConPaciente.value.filter(r => !r.respondida)
  return resenasConPaciente.value.filter(r => r.respondida)
})

const promedio = computed(() => {
  const total = store.resenas.reduce((s, r) => s + r.rating, 0)
  return (total / store.resenas.length).toFixed(1)
})

const distribucion = computed(() => {
  return [5, 4, 3, 2, 1].map(n => ({
    n,
    count: store.resenas.filter(r => r.rating === n).length,
    pct: Math.round((store.resenas.filter(r => r.rating === n).length / store.resenas.length) * 100)
  }))
})

const abrirRespuesta = (r) => {
  resenaActiva.value = r
  respuestaTexto.value = r.respuesta || ''
}

const enviarRespuesta = () => {
  if (!respuestaTexto.value.trim()) return
  store.responderResena(resenaActiva.value.id, respuestaTexto.value)
  resenaActiva.value = null
  respuestaTexto.value = ''
}
</script>

<template>
  <div>

    <!-- Stats -->
    <div style="display:grid;grid-template-columns:240px 1fr;gap:1.25rem">
      <div class="card card-pad" style="text-align:center">
        <div class="text-muted text-xs" style="margin-bottom:0.5rem">Valoración general</div>
        <div style="font-size:52px;font-weight:600;color:var(--neutral-800);line-height:1">{{ promedio }}</div>
        <div class="stars" style="font-size:20px;margin:8px 0">
          {{ '★'.repeat(Math.round(promedio)) }}<span class="stars-empty">{{ '★'.repeat(5 - Math.round(promedio)) }}</span>
        </div>
        <div class="text-xs text-muted">{{ store.resenas.length }} reseñas en total</div>
        <div class="divider"></div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div v-for="d in distribucion" :key="d.n" style="display:flex;align-items:center;gap:8px">
            <span class="text-xs text-muted" style="min-width:8px">{{ d.n }}</span>
            <span class="stars" style="font-size:11px">★</span>
            <div style="flex:1;height:6px;background:var(--neutral-150);border-radius:99px;overflow:hidden">
              <div :style="{ width: d.pct + '%', height: '100%', background: 'var(--brand-400)', borderRadius: '99px' }"></div>
            </div>
            <span class="text-xs text-muted" style="min-width:16px">{{ d.count }}</span>
          </div>
        </div>
      </div>

      <!-- Lista -->
      <div style="display:flex;flex-direction:column;gap:1rem">
        <!-- Toolbar -->
        <div class="card card-pad" style="display:flex;align-items:center;gap:8px">
          <div class="filtro-tabs">
            <button :class="{ active: filtro === 'todas' }" @click="filtro='todas'">Todas</button>
            <button :class="{ active: filtro === 'sin-respuesta' }" @click="filtro='sin-respuesta'">
              Sin responder
              <span class="notif-badge">{{ store.resenas.filter(r=>!r.respondida).length }}</span>
            </button>
            <button :class="{ active: filtro === 'respondidas' }" @click="filtro='respondidas'">Respondidas</button>
          </div>
        </div>

        <!-- Reseñas -->
        <div v-for="r in resenasFiltradas" :key="r.id" class="card card-pad">
          <div style="display:flex;align-items:flex-start;gap:10px">
            <div v-if="r.paciente" :class="['avatar avatar-md', `avatar-${r.paciente.avatarColor}`]">
              {{ r.paciente.nombre[0] }}{{ r.paciente.apellido[0] }}
            </div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                <span class="text-sm font-medium">
                  {{ r.paciente?.nombre }} {{ r.paciente?.apellido }}
                </span>
                <div class="stars" style="font-size:13px">
                  {{ '★'.repeat(r.rating) }}<span class="stars-empty">{{ '★'.repeat(5 - r.rating) }}</span>
                </div>
                <span class="text-xs text-muted">{{ r.fecha }}</span>
                <span v-if="!r.respondida" class="badge badge-warning">Sin respuesta</span>
                <span v-else class="badge badge-success">Respondida</span>
              </div>

              <p class="text-sm" style="margin-top:8px;color:var(--neutral-600);line-height:1.6">
                "{{ r.texto }}"
              </p>

              <!-- Respuesta existente -->
              <div v-if="r.respuesta" class="respuesta-box">
                <div class="text-xs text-muted" style="margin-bottom:4px">
                  <i class="pi pi-building" style="font-size:10px"></i> Respuesta de la clínica
                </div>
                <p class="text-sm" style="color:var(--neutral-700);line-height:1.6">{{ r.respuesta }}</p>
              </div>

              <div style="margin-top:10px">
                <button class="btn btn-outline btn-sm" @click="abrirRespuesta(r)">
                  <i class="pi pi-reply"></i>
                  {{ r.respondida ? 'Editar respuesta' : 'Responder' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!resenasFiltradas.length" class="card card-pad" style="text-align:center;padding:3rem;color:var(--neutral-400)">
          No hay reseñas en esta categoría
        </div>
      </div>
    </div>

    <!-- Modal respuesta -->
    <Transition name="fade">
      <div v-if="resenaActiva" class="modal-overlay" @click.self="resenaActiva=null">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">Responder reseña</div>
            <button class="btn btn-ghost btn-sm" @click="resenaActiva=null"><i class="pi pi-times"></i></button>
          </div>
          <div class="modal-body">
            <div style="background:var(--neutral-50);border-radius:var(--radius-md);padding:1rem;margin-bottom:1rem">
              <div class="stars" style="font-size:14px;margin-bottom:6px">
                {{ '★'.repeat(resenaActiva.rating) }}<span class="stars-empty">{{ '★'.repeat(5-resenaActiva.rating) }}</span>
              </div>
              <p class="text-sm" style="color:var(--neutral-600);font-style:italic">"{{ resenaActiva.texto }}"</p>
            </div>
            <div class="form-group">
              <label class="form-label">Tu respuesta</label>
              <textarea v-model="respuestaTexto" class="form-input" rows="5" placeholder="Gracias por tu comentario..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" @click="resenaActiva=null">Cancelar</button>
            <button class="btn btn-brand" @click="enviarRespuesta">
              <i class="pi pi-send"></i> Publicar respuesta
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.filtro-tabs { display: flex; gap: 4px; }
.filtro-tabs button {
  padding: 5px 12px; border-radius: var(--radius-md);
  font-size: 12px; background: transparent;
  border: 1px solid transparent; color: var(--neutral-500);
  display: flex; align-items: center; gap: 6px;
}
.filtro-tabs button:hover { background: var(--neutral-100); }
.filtro-tabs button.active { background: var(--brand-50); color: var(--brand-700); border-color: var(--brand-100); }

.notif-badge {
  background: var(--color-warning-bg); color: #92400e;
  font-size: 10px; padding: 1px 5px; border-radius: 99px;
}

.respuesta-box {
  margin-top: 10px; padding: 10px 12px;
  background: var(--brand-50);
  border-left: 3px solid var(--brand-300);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}
</style>