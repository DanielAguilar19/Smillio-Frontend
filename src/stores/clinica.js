import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/* ── Datos mock de la clínica ──────────────────────────────────── */
export const useClinicaStore = defineStore('clinica', () => {

  const clinica = ref({
    id: 'clinica-001',
    nombre: 'Clínica Dental SmileCare',
    rtn: '08011998012345',
    telefono: '+504 2239-0088',
    email: 'contacto@smilecare.hn',
    direccion: 'Col. Palmira, Blvd. Morazán, Tegucigalpa',
    web: 'www.smilecare.hn',
    descripcion: 'Clínica dental con más de 15 años de experiencia, especializada en ortodoncia, estética dental y odontología preventiva. Ofrecemos atención personalizada con tecnología de punta.',
    horario: {
      lunes:    { activo: true, desde: '08:00', hasta: '18:00' },
      martes:   { activo: true, desde: '08:00', hasta: '18:00' },
      miercoles:{ activo: true, desde: '08:00', hasta: '18:00' },
      jueves:   { activo: true, desde: '08:00', hasta: '18:00' },
      viernes:  { activo: true, desde: '08:00', hasta: '17:00' },
      sabado:   { activo: true, desde: '08:00', hasta: '12:00' },
      domingo:  { activo: false, desde: '', hasta: '' }
    },
    servicios: [
      { id: 's1', nombre: 'Limpieza dental', duracion: 45, precio: 500 },
      { id: 's2', nombre: 'Ortodoncia',      duracion: 30, precio: 1200 },
      { id: 's3', nombre: 'Blanqueamiento',  duracion: 60, precio: 2500 },
      { id: 's4', nombre: 'Extracción',      duracion: 45, precio: 800 },
      { id: 's5', nombre: 'Endodoncia',      duracion: 90, precio: 4500 },
      { id: 's6', nombre: 'Implante',        duracion: 120, precio: 12000 },
      { id: 's7', nombre: 'Corona',          duracion: 60, precio: 6500 },
      { id: 's8', nombre: 'Revisión general',duracion: 30, precio: 300 }
    ],
    rating: 4.8,
    totalResenas: 38,
    doctor: {
      nombre: 'Dra. Andrea Méndez',
      especialidad: 'Odontóloga General & Ortodoncista',
      iniciales: 'AM'
    }
  })

  const pacientes = ref([
    {
      id: 'p001', nombre: 'María', apellido: 'López', sexo: 'F',
      email: 'maria.lopez@gmail.com', telefono: '+504 9876-5432',
      fechaNacimiento: '1990-03-15', tipoSangre: 'O+',
      alergias: ['Penicilina'], enfermedades: [],
      avatarColor: 'blue',
      fechaRegistro: '2022-06-10',
      historial: [
        { id: 'h1', fecha: '2024-12-10', servicio: 'Limpieza dental', doctor: 'Dra. Méndez', notas: 'Paciente con acumulación moderada de sarro. Se realizó limpieza completa y pulido.', costo: 500 },
        { id: 'h2', fecha: '2024-06-05', servicio: 'Blanqueamiento', doctor: 'Dra. Méndez', notas: 'Blanqueamiento con lámpara LED. Resultado excelente, 4 tonos más claro.', costo: 2500 },
        { id: 'h3', fecha: '2023-12-20', servicio: 'Limpieza dental', doctor: 'Dra. Méndez', notas: 'Mantenimiento rutinario. Sin complicaciones.', costo: 500 }
      ],
      proximaCita: '2025-04-13T09:00',
      estado: 'activo',
      rating: 5
    },
    {
      id: 'p002', nombre: 'Carlos', apellido: 'Reyes', sexo: 'M',
      email: 'creyes@outlook.com', telefono: '+504 9654-3210',
      fechaNacimiento: '1985-07-22', tipoSangre: 'A+',
      alergias: [], enfermedades: ['Hipertensión'],
      avatarColor: 'green',
      fechaRegistro: '2023-01-15',
      historial: [
        { id: 'h4', fecha: '2025-03-10', servicio: 'Ortodoncia - revisión', doctor: 'Dra. Méndez', notas: 'Ajuste de brackets superior. Progreso adecuado.', costo: 1200 },
        { id: 'h5', fecha: '2025-01-08', servicio: 'Ortodoncia - revisión', doctor: 'Dra. Méndez', notas: 'Ajuste mensual. Se cambia arco.', costo: 1200 }
      ],
      proximaCita: '2025-04-13T10:30',
      estado: 'activo',
      rating: 4
    },
    {
      id: 'p003', nombre: 'Sofia', apellido: 'Pineda', sexo: 'F',
      email: 'sofia.p@gmail.com', telefono: '+504 9111-2233',
      fechaNacimiento: '1995-11-08', tipoSangre: 'B+',
      alergias: ['Ibuprofeno'], enfermedades: [],
      avatarColor: 'amber',
      fechaRegistro: '2024-02-20',
      historial: [
        { id: 'h6', fecha: '2025-02-14', servicio: 'Blanqueamiento', doctor: 'Dra. Méndez', notas: 'Segunda sesión de blanqueamiento. Muy buena respuesta.', costo: 2500 }
      ],
      proximaCita: '2025-04-13T12:00',
      estado: 'activo',
      rating: 5
    },
    {
      id: 'p004', nombre: 'Jorge', apellido: 'Morales', sexo: 'M',
      email: 'jmorales@empresa.com', telefono: '+504 9888-7766',
      fechaNacimiento: '1978-04-30', tipoSangre: 'AB-',
      alergias: [], enfermedades: ['Diabetes tipo 2'],
      avatarColor: 'violet',
      fechaRegistro: '2025-04-13',
      historial: [],
      proximaCita: '2025-04-13T14:00',
      estado: 'nuevo',
      rating: null
    },
    {
      id: 'p005', nombre: 'Ana', apellido: 'Herrera', sexo: 'F',
      email: 'ana.herrera@gmail.com', telefono: '+504 9333-4455',
      fechaNacimiento: '1992-09-12', tipoSangre: 'O-',
      alergias: [], enfermedades: [],
      avatarColor: 'teal',
      fechaRegistro: '2023-08-05',
      historial: [
        { id: 'h7', fecha: '2025-01-20', servicio: 'Revisión general', doctor: 'Dra. Méndez', notas: 'Dolor molar inferior derecho. Se solicita radiografía.', costo: 300 }
      ],
      proximaCita: '2025-04-13T15:30',
      estado: 'activo',
      rating: 4
    },
    {
      id: 'p006', nombre: 'Luisa', apellido: 'Martínez', sexo: 'F',
      email: 'luisa.m@hotmail.com', telefono: '+504 9777-8899',
      fechaNacimiento: '1988-01-25', tipoSangre: 'A-',
      alergias: [], enfermedades: [],
      avatarColor: 'rose',
      fechaRegistro: '2021-03-10',
      historial: [
        { id: 'h8', fecha: '2025-03-01', servicio: 'Blanqueamiento', doctor: 'Dra. Méndez', notas: 'Mantenimiento post-blanqueamiento.', costo: 2500 },
        { id: 'h9', fecha: '2024-09-10', servicio: 'Limpieza dental', doctor: 'Dra. Méndez', notas: 'Rutina semestral.', costo: 500 }
      ],
      proximaCita: '2025-04-22T11:00',
      estado: 'recordatorio',
      rating: 5
    }
  ])

  const citas = ref([
    { id: 'c001', pacienteId: 'p001', fecha: '2025-04-13', hora: '09:00', servicio: 'Limpieza dental', duracion: 45, estado: 'confirmada', notas: '' },
    { id: 'c002', pacienteId: 'p002', fecha: '2025-04-13', hora: '10:30', servicio: 'Ortodoncia', duracion: 30, estado: 'confirmada', notas: 'Traer radiografías anteriores' },
    { id: 'c003', pacienteId: 'p003', fecha: '2025-04-13', hora: '12:00', servicio: 'Blanqueamiento', duracion: 60, estado: 'pendiente', notas: '' },
    { id: 'c004', pacienteId: 'p004', fecha: '2025-04-13', hora: '14:00', servicio: 'Revisión general', duracion: 30, estado: 'pendiente', notas: 'Primera visita' },
    { id: 'c005', pacienteId: 'p005', fecha: '2025-04-13', hora: '15:30', servicio: 'Extracción', duracion: 45, estado: 'confirmada', notas: 'Molar 36, anestesia local' },
    { id: 'c006', pacienteId: 'p006', fecha: '2025-04-22', hora: '11:00', servicio: 'Limpieza dental', duracion: 45, estado: 'confirmada', notas: '' },
    { id: 'c007', pacienteId: 'p001', fecha: '2025-04-15', hora: '09:00', servicio: 'Revisión general', duracion: 30, estado: 'confirmada', notas: '' },
    { id: 'c008', pacienteId: 'p002', fecha: '2025-04-18', hora: '10:00', servicio: 'Ortodoncia', duracion: 30, estado: 'pendiente', notas: '' }
  ])

  const facturas = ref([
    { id: 'f001', pacienteId: 'p001', fecha: '2025-04-13', servicio: 'Limpieza dental', monto: 500, estado: 'pagada', metodoPago: 'Efectivo' },
    { id: 'f002', pacienteId: 'p003', fecha: '2025-03-28', servicio: 'Blanqueamiento', monto: 2500, estado: 'pagada', metodoPago: 'Tarjeta' },
    { id: 'f003', pacienteId: 'p002', fecha: '2025-03-10', servicio: 'Ortodoncia', monto: 1200, estado: 'pagada', metodoPago: 'Transferencia' },
    { id: 'f004', pacienteId: 'p005', fecha: '2025-04-13', servicio: 'Extracción', monto: 800, estado: 'pendiente', metodoPago: '' },
    { id: 'f005', pacienteId: 'p004', fecha: '2025-04-13', servicio: 'Revisión general', monto: 300, estado: 'pendiente', metodoPago: '' },
    { id: 'f006', pacienteId: 'p006', fecha: '2025-03-01', servicio: 'Blanqueamiento', monto: 2500, estado: 'pagada', metodoPago: 'Tarjeta' },
    { id: 'f007', pacienteId: 'p001', fecha: '2025-02-20', servicio: 'Limpieza dental', monto: 500, estado: 'pagada', metodoPago: 'Efectivo' },
    { id: 'f008', pacienteId: 'p002', fecha: '2025-01-08', servicio: 'Ortodoncia', monto: 1200, estado: 'vencida', metodoPago: '' }
  ])

  const resenas = ref([
    { id: 'r001', pacienteId: 'p001', fecha: '2024-12-12', rating: 5, texto: 'Excelente atención, muy amables y profesionales. El consultorio está muy limpio y moderno.', respuesta: 'Muchas gracias María, es un placer atenderte. ¡Hasta la próxima!', respondida: true },
    { id: 'r002', pacienteId: 'p002', fecha: '2025-03-12', rating: 4, texto: 'Muy buena atención. El tratamiento va muy bien. Solo mejoraría los tiempos de espera.', respuesta: '', respondida: false },
    { id: 'r003', pacienteId: 'p003', fecha: '2025-02-16', rating: 5, texto: 'Me encantó el resultado del blanqueamiento. La doctora muy amable y explica todo detalladamente.', respuesta: 'Gracias Sofía, fue un placer trabajar contigo. Los resultados fueron realmente bonitos.', respondida: true },
    { id: 'r004', pacienteId: 'p006', fecha: '2025-03-03', rating: 5, texto: 'Siempre una experiencia excepcional. Llevo 4 años siendo paciente y no cambiaría esta clínica por ninguna otra.', respuesta: '', respondida: false },
    { id: 'r005', pacienteId: 'p005', fecha: '2025-01-22', rating: 4, texto: 'Buena atención y diagnóstico claro. Me explicaron bien el procedimiento antes de hacerlo.', respuesta: 'Gracias Ana, nos alegra que todo haya salido bien. ¡Te esperamos para el seguimiento!', respondida: true }
  ])

  /* ── Getters ──────────────────────────────────────────────── */

  const getPaciente = (id) => pacientes.value.find(p => p.id === id)

  const citasHoy = computed(() => {
    const hoy = '2025-04-13'
    return citas.value
      .filter(c => c.fecha === hoy)
      .sort((a, b) => a.hora.localeCompare(b.hora))
  })

  const totalMes = computed(() => {
    return facturas.value
      .filter(f => f.estado === 'pagada' && f.fecha.startsWith('2025-04'))
      .reduce((sum, f) => sum + f.monto, 0)
  })

  const pendientesCobro = computed(() => {
    return facturas.value
      .filter(f => f.estado === 'pendiente' || f.estado === 'vencida')
      .reduce((sum, f) => sum + f.monto, 0)
  })

  /* ── Actions ──────────────────────────────────────────────── */

  const agregarCita = (cita) => {
    citas.value.push({ id: `c${Date.now()}`, ...cita })
  }

  const actualizarCita = (id, datos) => {
    const idx = citas.value.findIndex(c => c.id === id)
    if (idx !== -1) citas.value[idx] = { ...citas.value[idx], ...datos }
  }

  const eliminarCita = (id) => {
    citas.value = citas.value.filter(c => c.id !== id)
  }

  const agregarPaciente = (paciente) => {
    pacientes.value.push({ id: `p${Date.now()}`, ...paciente, historial: [], fechaRegistro: new Date().toISOString().split('T')[0] })
  }

  const responderResena = (id, texto) => {
    const r = resenas.value.find(r => r.id === id)
    if (r) { r.respuesta = texto; r.respondida = true }
  }

  const marcarFacturaPagada = (id, metodo) => {
    const f = facturas.value.find(f => f.id === id)
    if (f) { f.estado = 'pagada'; f.metodoPago = metodo }
  }

  return {
    clinica, pacientes, citas, facturas, resenas,
    getPaciente, citasHoy, totalMes, pendientesCobro,
    agregarCita, actualizarCita, eliminarCita,
    agregarPaciente, responderResena, marcarFacturaPagada
  }
})