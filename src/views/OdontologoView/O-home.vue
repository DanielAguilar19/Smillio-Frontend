<script setup lang="ts">
import Button from 'primevue/button'
import ScrollPanel from 'primevue/scrollpanel'
import Divider from 'primevue/divider'
import Panel from 'primevue/panel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Card from 'primevue/card'

import { useNavStore } from '@/stores/navigation'
const nav = useNavStore();

</script>

<template>
  <div class="main-layout">

    <nav class="sidebar">
      <div class="logo-container">
        <img src="@/assets/smilio-logo-blue.png"/>
      </div>

      <ScrollPanel style="height: calc(100vh - 120px)" class="custom-scroll">
        <div class="menu-group">
          <Button label="Home" icon="pi pi-home" text class="menu-button active-item" />
          <Button @click="nav.irAagenda()" label="Agenda" icon="pi pi-calendar" text class="menu-button" />
          <Button @click="nav.irApacientes()" label="Pacientes" icon="pi pi-users" text class="menu-button" />
          <Button @click="nav.irAclinicas()" label="Clínicas" icon="pi pi-building" text class="menu-button" />
        </div>

        <Divider />

        <div class="menu-group">
          <Button @click="nav.irAperfil()" label="Mi Perfil" icon="pi pi-cog" text class="menu-button" />
        </div>
      </ScrollPanel>
    </nav>

    <main class="main-content">
      <div class="p-5">
          <h1 class="h1">¡Bienvenido, Dr. [Nombre del Odontólogo]!</h1>
          <p style="font-size: medium;">Aquí puedes ver un resumen de tus próximas citas, pacientes recientes y 
            otras actividades relevantes.</p>
      </div>

        <div class="px-5 pt-3"> 
          <Panel header="Próximas Citas" style="font-size: large;">
            <!-- <DataTable :value="citas" class="p-datatable-sm"> -->
            <DataTable class="p-datatable-sm" style="font-size: medium;">
              <Column field="fecha" header="Fecha/Hora"></Column>
              <Column field="paciente" header="Paciente"></Column>
              <Column field="odontologo" header="Odontólogo"></Column>
              <Column field="clinica" header="Clínica"></Column>
              <Column field="especialidad" header="Especialidad"></Column>
              <Column field="estado" header="Estado">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.estado" severity="success" />
                </template>
              </Column>
              <Column header="Acciones">
                <template #body>
                  <div class="flex gap-2">
                    <Button label="Ver Detalle" text size="small" />
                    <Button label="Cancelar" text severity="danger" size="small" />
                  </div>
                </template>
              </Column>
            </DataTable>
          </Panel>
        </div>

        <section class="section-container">
          <div class="cards-grid">
           
            <Card @click="nav.irAagenda()" class="custom-card">
              <template #title>
                <div class="flex align-items-center">
                  <i class="pi pi-calendar mr-2" style="color: #a9c2ef; font-size: 1.2rem"></i>
                  <span style="color: #335497;">Ver Mi Agenda</span>
                </div>
              </template>
              <template #content>
                <p class="m-0 text-600">
                  Revisa tus citas en segundos desde tu celular.
                </p>
              </template>
            </Card>
      
            <Card @click="nav.irApacientes()" class="custom-card">
              <template #title>
                <div class="flex align-items-center">
                  <i class="pi pi-users mr-2" style="color: #a9c2ef; font-size: 1.2rem"></i>
                  <span style="color: #335497;">Gestionar Pacientes</span>
                </div>
              </template>
              <template #content>
                <p class="m-0 text-600">
                  Administra el contacto de tus pacientes.
                </p>
              </template>
            </Card>

            <Card @click="nav.irAclinicas()" class="custom-card">
              <template #title>
                <div class="flex align-items-center">
                  <i class="pi pi-building mr-2" style="color: #a9c2ef; font-size: 1.2rem"></i>
                  <span style="color: #335497;">Gestionar Clínicas</span>
                </div>
              </template>
              <template #content>
                <p class="m-0 text-600">
                  Administra la información e historial de tus clínicas.
                </p>
              </template>
            </Card>

            <Card @click="nav.irAperfil()" class="custom-card">
              <template #title>
                <div class="flex align-items-center">
                  <i class="pi pi-cog mr-2" style="color: #a9c2ef; font-size: 1.2rem"></i>
                  <span style="color: #335497;">Configurar Mi Perfil</span>
                </div>
              </template>
              <template #content>
                <p class="m-0 text-600">
                  Gestiona tu información personal y preferencias.
                </p>
              </template>
            </Card>

          </div>
        </section>
    </main>

  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 270px;
  background-color: #16529e; 
  display: flex;
  flex-direction: column;
  padding: 0;
  border-right: 1px solid #e1e4e8;
}

.section-container {
  max-width: 72rem;
  margin: 0 auto;
}


:deep(.menu-button) {
  width: 100% !important;
  justify-content: flex-start !important;  
  color: #FFFFFF !important; 
  padding: 0.75rem 3rem !important;
  background: transparent !important;
  border: none !important;
  font-weight: 500 !important;
  transition: all 0.2s;
}

/* Color cuando pasas el mouse (Hover) */
:deep(.menu-button:hover) {
  background: rgba(255, 255, 255, 0.1) !important; 
  color: #FFFFFF !important;
  border-radius: 8px !important; 
  width: 90% !important;
  margin-left: 5% !important;
}

:deep(.menu-button .p-button-icon) {
  color: #FFFFFF !important;
  margin-right: 1rem;
}

/* Si quieres que el item activo sea un gris más claro */
:deep(.active-link) {
  background: rgba(255, 255, 255, 0.15) !important;
  color: #FFFFFF !important;
}

.main-content {
  flex-grow: 1;
  overflow-y: auto;
}

.h1 {
  color: #16529E;
  font-weight: bold;
  font-size: x-large;
  margin-top: 1.5rem;
}

.cards-grid {
  margin-top: 2.5rem;
  display: grid;
  gap: 3rem;
  padding-left: 4rem;
  margin-inline: 2rem;
  width: 87%;
}
@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.custom-card {
  border-left: 5px solid #16529e; /* El azul base */
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  background: #ffffff;
}

.custom-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 15px rgba(22, 82, 158, 0.15); /* Sombra sutil azulada */
}

/* Ajuste para el texto del contenido */
.text-600 {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

</style>