<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import Button from 'primevue/button'
</script>

<template>
  <main>
    <TheWelcome />
  </main>

  <div class="p-4">
    <Button label="Guardar" icon="pi pi-check" />
  </div>
</template>
