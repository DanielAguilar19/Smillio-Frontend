<script setup>
import { ref, computed } from 'vue'
// Asegúrate de que este store exista, si no, dará error
import { useClinicaDashboardStore } from '@/stores/clinicaDashboardStore'

const store = useClinicaDashboardStore()
const filtro = ref('todas')
const busqueda = ref('')
const showPagoModal = ref(false)
const facturaActiva = ref(null)
const metodoPago = ref('Efectivo')

// ... (Aquí va toda tu lógica de computed y funciones que ya tenías) ...
const facturasConPaciente = computed(() => {
  return store.facturas.map(f => ({
    ...f,
    paciente: store.getPaciente(f.pacienteId)
  }))
})

const facturasFiltradas = computed(() => {
  let lista = facturasConPaciente.value
  if (filtro.value !== 'todas') lista = lista.filter(f => f.estado === filtro.value)
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(f =>
      f.paciente && `${f.paciente.nombre} ${f.paciente.apellido}`.toLowerCase().includes(q)
    )
  }
  return lista.sort((a, b) => b.fecha.localeCompare(a.fecha))
})

const totales = computed(() => ({
  pagado:   store.facturas.filter(f => f.estado === 'pagada').reduce((s, f) => s + f.monto, 0),
  pendiente:store.facturas.filter(f => f.estado === 'pendiente').reduce((s, f) => s + f.monto, 0),
  vencido:  store.facturas.filter(f => f.estado === 'vencida').reduce((s, f) => s + f.monto, 0)
}))

const abrirPago = (f) => { facturaActiva.value = f; showPagoModal.value = true }
const confirmarPago = () => {
  store.marcarFacturaPagada(facturaActiva.value.id, metodoPago.value)
  showPagoModal.value = false
  facturaActiva.value = null
}
const estadoBadge = { pagada: 'bg-green-100 text-green-700', pendiente: 'bg-yellow-100 text-yellow-700', vencida: 'bg-red-100 text-red-700' }
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-slate-800">Facturación</h1>

    <div class="metrics-grid">
      <div class="stat-box border-l-4 border-blue-500">
        <span class="label">Ingresos cobrados</span>
        <span class="value">L. {{ totales.pagado.toLocaleString() }}</span>
      </div>
      <div class="stat-box border-l-4 border-amber-500">
        <span class="label">Por cobrar</span>
        <span class="value">L. {{ totales.pendiente.toLocaleString() }}</span>
      </div>
      <div class="stat-box border-l-4 border-red-500">
        <span class="label">Vencidas</span>
        <span class="value">L. {{ totales.vencido.toLocaleString() }}</span>
      </div>
    </div>

    <div class="table-container">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr>
            <th>N° Factura</th>
            <th>Paciente</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in facturasFiltradas" :key="f.id">
            <td>#{{ f.id.toUpperCase() }}</td>
            <td>{{ f.paciente?.nombre }} {{ f.paciente?.apellido }}</td>
            <td class="font-bold">L. {{ f.monto.toLocaleString() }}</td>
            <td>
              <span :class="['px-3 py-1 rounded-full text-xs font-bold', estadoBadge[f.estado]]">
                {{ f.estado.toUpperCase() }}
              </span>
            </td>
            <td>
              <button v-if="f.estado !== 'pagada'" @click="abrirPago(f)" class="btn-cobrar">
                Cobrar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* CSS TODO EN UN MISMO ARCHIVO */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-box {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.label { color: #64748b; font-size: 0.875rem; font-weight: 500; }
.value { color: #1e293b; font-size: 1.5rem; font-weight: 700; margin-top: 0.5rem; }

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

th {
  background: #f8fafc;
  padding: 1rem;
  color: #475569;
  font-size: 0.75rem;
  text-transform: uppercase;
}

td { padding: 1rem; border-bottom: 1px solid #f1f5f9; }

.btn-cobrar {
  background: #16529e;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-cobrar:hover { background: #3f67b0; }
</style>