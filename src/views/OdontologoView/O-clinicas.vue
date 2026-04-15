<script setup lang="ts">
import Button from 'primevue/button'
import Divider from 'primevue/divider'

import { useNavStore } from '@/stores/navigation'
const nav = useNavStore();
</script>

<template>
  <div class="main-layout">
  <header class="top-header">
    <div class="logo-section">
      <img src="@/assets/smilio-logo-blue.png" alt="Smilio" class="header-logo" />
    </div>
    <div class="title-section">
      <h2>Gestión de Clínicas </h2>
    </div>
  </header>

  <div class="app-body">
    <nav class="sidebar">
      <div class="menu-items">
        <Button @click="nav.irAhome()" label="Home" icon="pi pi-home" text class="menu-button" />
        <Button @click="nav.irAagenda()" label="Agenda" icon="pi pi-calendar" text class="menu-button" />
        <Button @click="nav.irApacientes()" label="Pacientes" icon="pi pi-users" text class="menu-button" />
        <Button label="Clínicas" icon="pi pi-building" text class="menu-button active-link" />
    </div>
      <Divider />
      <div class="menu-group">
        <Button @click="nav.irAperfil()" label="Mi Perfil" icon="pi pi-cog" text class="menu-button" />
      </div>
    </nav>

    <main class="main-content">
      <div class="p-4">
          <h1 style="color: #16529E;"></h1>
          </div>
    </main>

  </div>
</div>
</template>