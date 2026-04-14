<script setup lang="ts">
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import { ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Select from 'primevue/select'; 

const selectedClinica = ref();
const clinicas = ref([
  { name: 'Clínica Santa Fe', code: 'SF' },
  { name: 'Clínica Centro', code: 'CC' }
]);

const selectedEstados = ref();
const estados = ref([
  { name: 'Completada', code: 'CP' },
  { name: 'Pendiente', code: 'PN' },
  { name: 'Cancelada', code: 'CN' },
  { name: 'Reprogramada', code: 'RP' }
]);

// Configuración del Calendario
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek', // Vista semanal con horas
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  locale: 'es', // Idioma español
  slotMinTime: '08:00:00', // Hora de inicio
  slotMaxTime: '20:00:00', // Hora de cierre
});
</script>

<template>
  <div class="main-layout">
  <header class="top-header">
    <div class="logo-section">
      <img src="@/assets/smilio-logo-blue.png" alt="Smilio" class="header-logo" />
    </div>
    <div class="title-section">
      <h2>Gestión de Citas </h2>
    </div>
  </header>

  <div class="app-body">
    <nav class="sidebar">
      <div class="menu-items">
        <Button label="Home" icon="pi pi-home" text class="menu-button" />
        <Button label="Agenda" icon="pi pi-calendar" text class="menu-button active-link" />
        <Button label="Pacientes" icon="pi pi-users" text class="menu-button" />
        <Button label="Clínicas" icon="pi pi-building" text class="menu-button" />
    </div>
      <Divider />
      <div class="menu-group">
        <Button label="Mi Perfil" icon="pi pi-cog" text class="menu-button" />
      </div>
    </nav>

    <main class="main-content">
      <div class="p-5">
          <h1 class="h3">Administrador de Agenda Mensual</h1>
      </div>

      <div class="page-container">
        <div class="flex justify-content-between align-items-center mb-4 gap-3">
          <h2 class="section-title"></h2>
          <div class="flex gap-3">
            <span class="p-float-label">
              <Select v-model="selectedClinica" :options="clinicas" optionLabel="name" placeholder="Filtra por Clínica" class="w-full md:w-14rem" />
            </span>
          </div>
          <div class="flex gap-3">
            <span class="p-float-label">
              <Select v-model="selectedEstados" :options="estados" optionLabel="name" placeholder="Filtra por Estado" class="w-full md:w-14rem" />
            </span>
          </div>
        </div>

        <div class="calendar-card">
          <FullCalendar :options="calendarOptions"/>
        </div>
      </div>
    </main>

  </div>
</div>
</template>

<style scoped>
.calendar-card {
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin: 0 1.5rem 1.5rem;
}

:deep(.fc) {
  border: none;
}

.section-title {
  color: #16529E;
  font-size: 1.5rem;
  font-weight: 600;
  margin-left: 1rem;
}

/* Personalización de colores de FullCalendar para que combinen con Smilio */
:deep(.fc-header-toolbar) {
  margin-bottom: 2rem !important;
}

:deep(.fc-button-primary) {
  background-color: #16529E !important;
  border-color: #16529E !important;
}

:deep(.fc-event) {
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 4px;
}

/* Texto de horas y días */
:deep(.fc-col-header-cell-cushion), :deep(.fc-timegrid-slot-label-cushion) {
    color: #16529e;
    font-weight: 600;
    text-transform: capitalize;
}

/* Suavizar la grilla */
:deep(.fc td), :deep(.fc th) {
  border-color: #f1f5f9 !important;
}

/* Día seleccionado (hoy) */
:deep(.fc-day-today) {
  background-color: #eef3fc !important; /* Azul muy pálido en vez de amarillo */
}

/* Botones de vista (Mes/Semana/Día) */
:deep(.fc-button-group .fc-button) {
  background-color: #f1f5f9 !important;
  color: #475569 !important;
  border: 1px solid #e2e8f0 !important;
  text-transform: capitalize;
}

:deep(.fc-button-group .fc-button-active) {
  background-color: #16529e !important;
  color: white !important;
  border-color: #16529e !important;
}

/* Título del calendario */
:deep(.fc-toolbar-title) {
  color: #27427d;
  font-size: 1.75rem !important;
  font-weight: 700;
}


</style>
