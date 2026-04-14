<script setup lang="ts">
import Button from 'primevue/button'
import ScrollPanel from 'primevue/scrollpanel'
import Divider from 'primevue/divider'
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
          <Button label="Agenda" icon="pi pi-calendar" text class="menu-button" />
          <Button label="Pacientes" icon="pi pi-users" text class="menu-button" />
          <Button label="Clínicas" icon="pi pi-building" text class="menu-button" />
        </div>

        <Divider />

        <div class="menu-group">
          <Button label="Mi Perfil" icon="pi pi-cog" text class="menu-button" />
        </div>
      </ScrollPanel>
    </nav>

    <main class="main-content">
      <div class="p-4">
          <h1 style="color: #16529E;">Panel Principal</h1>
          </div>
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


</style>