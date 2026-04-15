import type { ToastServiceMethods } from 'primevue/toastservice'

let toast: ToastServiceMethods

export const setToastInstance = (instance: ToastServiceMethods) => {
  toast = instance
}

type ToastType = 'success' | 'error' | 'warn' | 'info'

export function LanzarToast(mensaje: string, tipo: ToastType = 'info', titulo?: string) {
  toast.add({
    severity: tipo,
    summary: titulo || getTitulo(tipo),
    detail: mensaje,
    life: 3000,
  })
}

function getTitulo(tipo: ToastType) {
  switch (tipo) {
    case 'success':
      return 'Éxito'
    case 'error':
      return 'Error'
    case 'warn':
      return 'Advertencia'
    case 'info':
      return 'Info'
  }
}
