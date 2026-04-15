<script setup lang="ts">
  import Button from 'primevue/button'
  import Divider from 'primevue/divider'
  import Panel from 'primevue/panel'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Select from 'primevue/select'; 

  import { useNavStore } from '@/stores/navigation'
  const nav = useNavStore();

  import { ref } from 'vue'
  const selectedClinica = ref();
  const clinicas = ref([
    { name: 'Clínica Santa Fe', code: 'SF' },
    { name: 'Clínica Centro', code: 'CC' }
  ]);

  const selectedEstados = ref();
  const estados = ref([
    { name: 'Completada', code: 'CO' },
    { name: 'Pendiente', code: 'PE' },
    { name: 'Urgente', code: 'UR' }
  ]);
</script>

<template>
  <div class="main-layout">
    <header class="top-header">
      <div class="logo-section">
        <img src="@/assets/smilio-logo-blue.png" alt="Smilio" class="header-logo" />
      </div>
      <div class="title-section">
        <h2>Gestión de Pacientes </h2>
      </div>
    </header>

    <div class="app-body">
      <nav class="sidebar">
        <div class="menu-items">
          <Button @click="nav.irAhome()" label="Home" icon="pi pi-home" text class="menu-button" />
          <Button @click="nav.irAagenda()" label="Agenda" icon="pi pi-calendar" text class="menu-button" />
          <Button label="Pacientes" icon="pi pi-users" text class="menu-button active-link" />
          <Button @click="nav.irAclinicas()" label="Clínicas" icon="pi pi-building" text class="menu-button" />
      </div>
        <Divider />
        <div class="menu-group">
          <Button @click="nav.irAperfil()"label="Mi Perfil" icon="pi pi-cog" text class="menu-button" />
        </div>
      </nav>

      <main class="main-content">
        <div class="p-5">
            <h1 class="h3">Directorio Global de Pacientes</h1>
        </div>

        <!-- Selector de Filtros Clinicas & Estados-->    
        <div class="px-5 pt-3"> 
          <Panel header="Listado de Contactos" class="mb-4"> 
            <div class="flex justify-content-between align-items-center mb-4">
              <div class="flex align-items-center gap-3">
                <div class="p-float-label">
                  <Select v-model="selectedClinica" :options="clinicas" optionLabel="name" placeholder="Filtra por Clínica" class="w-full md:w-14rem" />
                </div>

                <div class="p-float-label">
                  <Select v-model="selectedEstados" :options="estados" optionLabel="name" placeholder="Filtra por Estado" class="w-full md:w-14rem" />
                </div>
                  <div class="p-float-label">
                <Button text class="p-button-secondary" icon="pi pi-filter-slash"/>
              </div>
              </div>

              <div class="flex align-items-center mb-4 gap-3">
                <Button label="Nuevo Paciente" icon="pi pi-user-plus" class="btn-add ml-auto"/>
              </div>
            </div>

            <!-- <DataTable :value="citas" class="p-datatable-sm"> -->
            <DataTable class="p-datatable-sm" style="font-size: medium;">
              <Column field="paciente" header="Paciente"></Column>
              <Column field="edad" header="Edad"></Column>
              <Column field="direccion" header="Dirección"></Column>
              <Column field="telefono" header="#Teléfono"></Column>
              <Column field="correo" header="E-mail"></Column>
              <Column field="paciente" header="Última Cita"></Column>
              <Column field="odontologo" header="Estado Pre-Clínico"></Column>
              <Column field="clinica" header="Clínica Asignada"></Column>
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
      </main>

    </div>
  </div>
</template>