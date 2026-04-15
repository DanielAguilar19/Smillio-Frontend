<template>
  <main>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <span class="hero-badge">Clínicas verificadas</span>

          <h1 class="hero-title">
            Encuentra clínicas dentales
            <span class="hero-title-accent">en minutos</span>
          </h1>

          <p class="hero-subtitle">
            Agenda citas fácilmente con profesionales verificados y sin complicaciones. Tu sonrisa, nuestra prioridad.
          </p>

          <div class="hero-buttons">
            <Button label="Buscar clínicas" icon="pi pi-search" class="btn-hero-primary" />
            <Button label="Soy Odontólogo" outlined class="btn-hero-outline" />
            <Button @click="RegistroPaciente()" label="Soy Paciente" outlined class="btn-hero-outline" />
          </div>

          <div class="hero-stats">
            <div class="stat">
              <span class="stat-number">500+</span>
              <span class="stat-label">Clínicas</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-number">10k+</span>
              <span class="stat-label">Pacientes</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-number">4.9★</span>
              <span class="stat-label">Calificación</span>
            </div>
          </div>
        </div>

        <div class="hero-image-wrap">
          <div class="hero-image-bg"></div>
          <img src="https://cdn-icons-png.flaticon.com/512/2966/2966480.png" class="img-hero" alt="Dental" />
        </div>
      </div>
    </section>

    <!-- COMO FUNCIONA -->
    <section class="section-steps">
      <div class="section-container text-center">
        <span class="section-label">Simple y rápido</span>
        <h2 class="section-title">¿Cómo funciona?</h2>
        <p class="section-subtitle">Agenda tu cita en 3 pasos</p>

        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number">01</div>
            <div class="step-icon">
              <i class="pi pi-search"></i>
            </div>
            <h3 class="step-title">Buscar</h3>
            <p class="step-desc">Encuentra clínicas cercanas según tu ubicación y especialidad.</p>
          </div>

          <div class="step-arrow">›</div>

          <div class="step-card step-card--accent">
            <div class="step-number step-number--light">02</div>
            <div class="step-icon">
              <i class="pi pi-user"></i>
            </div>
            <h3 class="step-title step-title--light">Seleccionar</h3>
            <p class="step-desc step-desc--light">Elige el odontólogo que mejor se adapte a ti y tu presupuesto.</p>
          </div>

          <div class="step-arrow">›</div>

          <div class="step-card">
            <div class="step-number">03</div>
            <div class="step-icon">
              <i class="pi pi-calendar"></i>
            </div>
            <h3 class="step-title">Agendar</h3>
            <p class="step-desc">Reserva tu cita en segundos desde tu celular.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- BENEFICIOS -->
    <section class="section-benefits">
      <div class="section-container">
        <div class="benefits-grid">

          <!-- Pacientes -->
          <div class="benefit-card benefit-card--blue">
            <div class="benefit-icon-wrap benefit-icon-wrap--blue">
              <i class="pi pi-users"></i>
            </div>
            <h2 class="benefit-title">Para pacientes</h2>
            <ul class="benefit-list">
              <li class="benefit-item">
                <span class="benefit-check">
                  <i class="pi pi-check"></i>
                </span>
                Agenda rápida y sencilla en segundos
              </li>
              <li class="benefit-item">
                <span class="benefit-check">
                  <i class="pi pi-check"></i>
                </span>
                Clínicas y odontólogos verificados
              </li>
              <li class="benefit-item">
                <span class="benefit-check">
                  <i class="pi pi-check"></i>
                </span>
                Ahorra tiempo sin llamadas
              </li>
              <li class="benefit-item">
                <span class="benefit-check">
                  <i class="pi pi-check"></i>
                </span>
                Recordatorios de citas automáticos
              </li>
            </ul>
            <Button @click="RegistroPaciente()" label="Buscar clínica" icon="pi pi-arrow-right" class="benefit-btn" />
          </div>

          <!-- Clínicas -->
          <div class="benefit-card benefit-card--dark">
            <div class="benefit-icon-wrap benefit-icon-wrap--dark">
              <i class="pi pi-building"></i>
            </div>
            <h2 class="benefit-title benefit-title--light">Para clínicas</h2>
            <ul class="benefit-list">
              <li class="benefit-item benefit-item--light">
                <span class="benefit-check">
                  <i class="pi pi-check"></i>
                </span> Más pacientes nuevos cada mes
              </li>
              <li class="benefit-item benefit-item--light">
                <span class="benefit-check">
                  <i class="pi pi-check"></i>
                </span> Gestión de agenda centralizada
              </li>
              <li class="benefit-item benefit-item--light">
                <span class="benefit-check">
                  <i class="pi pi-check"></i>
                </span> Reducción de citas canceladas
              </li>
              <li class="benefit-item benefit-item--light">
                <span class="benefit-check">
                  <i class="pi pi-check"></i>
                </span> Panel de control completo
              </li>
            </ul>
            <Button label="Registrar clínica" icon="pi pi-arrow-right" outlined class="benefit-btn-outline" />
          </div>

        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="cta-inner">
        <div class="cta-badge">🦷</div>
        <h2 class="cta-title">Empieza a cuidar tu sonrisa hoy</h2>
        <p class="cta-text">Únete a miles de pacientes que ya agendaron con Smillio</p>
        <div class="cta-buttons">
          <Button label="Buscar clínicas" icon="pi pi-search" class="btn-cta-white" />
          <Button label="Registrar mi clínica" outlined class="btn-cta-outline" />
        </div>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import router from '@/router'
import Button from 'primevue/button'

function RegistroPaciente() {
  router.push({ name: 'registro-paciente' })
}
</script>

<style scoped>
/* ── HERO ─────────────────────────────────────── */
.hero {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-400) 55%, var(--primary-300) 100%);
  color: white;
}

.hero-content {
  max-width: 80rem;
  margin: 0 auto;
  padding: 5rem 1.5rem 4rem;
  display: grid;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr 1fr;
    padding: 6rem 1.5rem 5rem;
  }
}

.hero-badge {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: white;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.3rem 0.875rem;
  border-radius: 9999px;
  letter-spacing: 0.5px;
  margin-bottom: 1.25rem;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.15;
  color: white;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
}

.hero-title-accent {
  color: var(--primary-100);
}

.hero-subtitle {
  margin-top: 1.25rem;
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.0625rem;
  line-height: 1.6;
}

.hero-buttons {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.btn-hero-primary {
  background-color: white !important;
  color: var(--color-primary) !important;
  border: none !important;
  font-weight: 700 !important;
  border-radius: 0.75rem !important;
  padding: 0.75rem 1.5rem !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.btn-hero-outline {
  border: 2px solid rgba(255, 255, 255, 0.7) !important;
  color: white !important;
  background: transparent !important;
  font-weight: 600 !important;
  border-radius: 0.75rem !important;
  padding: 0.75rem 1.5rem !important;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background-color: rgba(255, 255, 255, 0.3);
}

.hero-image-wrap {
  display: flex;
  justify-content: center;
  position: relative;
}

.hero-image-bg {
  position: absolute;
  width: 18rem;
  height: 18rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.img-hero {
  width: 15rem;
  position: relative;
  filter: drop-shadow(0 16px 24px rgba(0, 0, 0, 0.25));
  animation: float 4s ease-in-out infinite;
}

@media (min-width: 768px) {
  .img-hero {
    width: 20rem;
  }

  .hero-image-bg {
    width: 22rem;
    height: 22rem;
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-12px);
  }
}

/* ── STEPS ────────────────────────────────────── */
.section-steps {
  padding: 5rem 1.5rem;
  background-color: white;
}

.section-container {
  max-width: 72rem;
  margin: 0 auto;
}

.section-label {
  display: inline-block;
  color: var(--color-primary);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.section-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 2.25rem;
  }
}

.section-subtitle {
  color: #6b7280;
  margin-top: 0.5rem;
  font-size: 1.0625rem;
}

.steps-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
}

@media (min-width: 768px) {
  .steps-grid {
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
  }
}

.step-card {
  background-color: white;
  border: 2px solid var(--primary-100);
  border-radius: 1.5rem;
  padding: 2rem 1.75rem;
  flex: 1;
  max-width: 22rem;
  text-align: center;
  transition: box-shadow 0.3s, transform 0.3s;
}

.step-card:hover {
  box-shadow: 0 8px 24px rgba(79, 123, 203, 0.15);
  transform: translateY(-4px);
}

.step-card--accent {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-400));
  border-color: transparent;
}

.step-number {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--primary-200);
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
}

.step-number--light {
  color: rgba(255, 255, 255, 0.5);
}

.step-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.step-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.step-title--light {
  color: white;
}

.step-desc {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.5;
}

.step-desc--light {
  color: rgba(255, 255, 255, 0.85);
}

.step-arrow {
  font-size: 2rem;
  color: var(--primary-200);
  display: none;
}

@media (min-width: 768px) {
  .step-arrow {
    display: flex;
    align-items: center;
  }
}

/* ── BENEFICIOS ───────────────────────────────── */
.section-benefits {
  padding: 5rem 1.5rem;
  background-color: var(--primary-50);
}

.benefits-grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.benefit-card {
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.benefit-card--blue {
  background-color: white;
  border: 2px solid var(--primary-100);
  box-shadow: 0 4px 20px rgba(79, 123, 203, 0.08);
}

.benefit-card--dark {
  background: linear-gradient(135deg, var(--primary-700), var(--primary-500));
}

.benefit-icon-wrap {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

.benefit-icon-wrap--blue {
  background-color: var(--primary-50);
}

.benefit-icon-wrap--dark {
  background-color: rgba(255, 255, 255, 0.15);
}

.benefit-title {
  font-size: 1.375rem;
  font-weight: 800;
  color: #111827;
}

.benefit-title--light {
  color: white;
}

.benefit-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9375rem;
  color: #374151;
}

.benefit-item--light {
  color: rgba(255, 255, 255, 0.9);
}

.benefit-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--primary-50);
  color: var(--color-primary);
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.benefit-check--light {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.benefit-btn {
  background-color: var(--color-primary) !important;
  border: none !important;
  color: white !important;
  font-weight: 600 !important;
  border-radius: 0.75rem !important;
  align-self: flex-start;
}

.benefit-btn-outline {
  border: 2px solid rgba(255, 255, 255, 0.6) !important;
  color: white !important;
  background: transparent !important;
  font-weight: 600 !important;
  border-radius: 0.75rem !important;
  align-self: flex-start;
}

/* ── CTA ──────────────────────────────────────── */
.cta {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-400) 100%);
  padding: 5rem 1.5rem;
}

.cta-inner {
  max-width: 48rem;
  margin: 0 auto;
  text-align: center;
}

.cta-badge {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.cta-title {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .cta-title {
    font-size: 2.5rem;
  }
}

.cta-text {
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.0625rem;
}

.cta-buttons {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.btn-cta-white {
  background-color: white !important;
  color: var(--color-primary) !important;
  border: none !important;
  font-weight: 700 !important;
  border-radius: 0.75rem !important;
  padding: 0.75rem 1.75rem !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.btn-cta-outline {
  border: 2px solid rgba(255, 255, 255, 0.65) !important;
  color: white !important;
  background: transparent !important;
  font-weight: 600 !important;
  border-radius: 0.75rem !important;
  padding: 0.75rem 1.75rem !important;
}
</style>
