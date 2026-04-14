<script setup lang="ts">
import Button from 'primevue/button'
import Divider from 'primevue/divider'
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
        <Button label="Home" icon="pi pi-home" text class="menu-button" />
        <Button label="Agenda" icon="pi pi-calendar" text class="menu-button" />
        <Button label="Pacientes" icon="pi pi-users" text class="menu-button active-link" />
        <Button label="Clínicas" icon="pi pi-building" text class="menu-button" />
    </div>
      <Divider />
      <div class="menu-group">
        <Button label="Mi Perfil" icon="pi pi-cog" text class="menu-button" />
      </div>
    </nav>

    <main class="main-content">
      <div class="p-4">
          <h1 style="color: #16529E;">Contactos</h1>
          </div>
    </main>

  </div>
</div>
</template>