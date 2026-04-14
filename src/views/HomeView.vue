<template>
  <main class="main-container">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-content">

        <div>
          <h1 class="hero-title">
            Encuentra clínicas dentales en minutos
          </h1>

          <p class="hero-subtitle">
            Agenda citas fácilmente con profesionales verificados y sin complicaciones.
          </p>

          <div class="hero-buttons">
            <Button label="Buscar clínicas" icon="pi pi-search" class="btn-primary" />

            <Button label="Soy Odontólogo" outlined class="btn-outline" />
            <Button @click="RegistroPaciente()" label="Soy Paciente" outlined class="btn-outline" />

          </div>
        </div>

        <div class="hero-image">
          <img src="https://cdn-icons-png.flaticon.com/512/2966/2966480.png" class="img-hero" />
        </div>

      </div>
    </section>

    <!-- COMO FUNCIONA -->
    <section class="section-gray">
      <div class="section-container text-center">
        <h2 class="section-title">¿Cómo funciona?</h2>

        <div class="cards-grid">
          <Card class="card">
            <template #title>Buscar</template>
            <template #content>
              Encuentra clínicas cercanas según tu ubicación.
            </template>
          </Card>

          <Card class="card">
            <template #title>Seleccionar</template>
            <template #content>
              Elige el odontólogo que mejor se adapte a ti.
            </template>
          </Card>

          <Card class="card">
            <template #title>Agendar</template>
            <template #content>
              Reserva tu cita en segundos desde tu celular.
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- BENEFICIOS -->
    <section class="section-container benefits">
      <div>
        <h2 class="benefit-title">Para pacientes</h2>
        <ul class="benefit-list">
          <li>✔ Agenda rápida y sencilla</li>
          <li>✔ Clínicas verificadas</li>
          <li>✔ Ahorra tiempo</li>
        </ul>
      </div>

      <div>
        <h2 class="benefit-title">Para clínicas</h2>
        <ul class="benefit-list">
          <li>✔ Más pacientes</li>
          <li>✔ Gestión de agenda</li>
          <li>✔ Control de citas</li>
        </ul>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <h2 class="cta-title">
        Empieza a cuidar tu sonrisa hoy
      </h2>

      <p class="cta-text">
        Encuentra clínicas y agenda tu cita en segundos.
      </p>

      <Button label="Buscar clínicas" icon="pi pi-arrow-right" class="btn-cta" />
    </section>

  </main>
</template>

<script setup lang="ts">
import router from '@/router';
import Button from 'primevue/button'
import Card from 'primevue/card'

function RegistroPaciente() {
  router.push({
    name: 'registro-paciente'
  })
}
</script>


<style>
.main-container {
  background-color: white;
  color: #1f2937;
  /* gray-800 */
}

/* HERO */
.hero {
  background: linear-gradient(to bottom right, rgba(79, 123, 203, 0.1), white);
}

.hero-content {
  max-width: 80rem;
  /* max-w-7xl */
  margin: 0 auto;
  padding: 5rem 1.5rem;
  display: grid;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 768px) {
  .hero-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
}

.hero-subtitle {
  margin-top: 1rem;
  color: #4b5563;
  /* gray-600 */
  font-size: 1.125rem;
}

.hero-buttons {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

.hero-image {
  display: flex;
  justify-content: center;
}

.img-hero {
  width: 18rem;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
}

@media (min-width: 768px) {
  .img-hero {
    width: 24rem;
  }
}

/* BOTONES */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border: none;
}

.btn-outline {
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}

/* SECCIONES */
.section-gray {
  background-color: #f9fafb;
  padding: 4rem 1.5rem;
}

.section-container {
  max-width: 72rem;
  margin: 0 auto;
}

.section-title {
  font-size: 1.875rem;
  font-weight: 700;
}

.cards-grid {
  margin-top: 2.5rem;
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  border-radius: 1rem;
  transition: 0.3s;
}

.card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* BENEFICIOS */
.benefits {
  padding: 4rem 1.5rem;
  display: grid;
  gap: 2.5rem;
}

@media (min-width: 768px) {
  .benefits {
    grid-template-columns: repeat(2, 1fr);
  }
}

.benefit-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.benefit-list {
  margin-top: 1rem;
  color: #4b5563;
}

.benefit-list li {
  margin-bottom: 0.5rem;
}

/* CTA */
.cta {
  padding: 5rem 1.5rem;
  text-align: center;
  background-color: var(--color-primary);
  color: white;
}

.cta-title {
  font-size: 1.875rem;
  font-weight: 700;
}

.cta-text {
  margin-top: 1rem;
  opacity: 0.9;
}

.btn-cta {
  margin-top: 1.5rem;
  background-color: white;
  color: var(--color-primary);
  border: none;
}
</style>