import { defineStore } from 'pinia';
import router from '@/router'

export const useNavStore = defineStore('navigation', () => {
  
  const irAhome = (): void => {
    router.push({ path: '/o-home' });
  };

  const irAagenda = (): void => {
    router.push({ path: '/o-agenda' });
  };

  const irApacientes = (): void => {
    router.push({ path: '/o-pacientes' });
  };

  const irAclinicas = (): void => {
    router.push({ path: '/o-clinicas' });
  };

  const irAperfil = (): void => {
    router.push({ path: '/o-perfil' });
  };

  return { 
    irAhome,
    irAagenda, 
    irApacientes, 
    irAclinicas,
    irAperfil 
  };
});